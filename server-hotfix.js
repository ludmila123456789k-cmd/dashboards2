const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = __dirname;
loadEnvFile(path.join(ROOT, ".env"));
if (!process.env.AUTH_SECRET) process.env.AUTH_SECRET = crypto.randomBytes(32).toString("hex");

const LOCAL_DATA_DIR = path.join(ROOT, "data");
const RENDER_DISK_DIR = "/data";
const DATA_DIR = resolveDataDir();
const STORE_FILE = path.join(DATA_DIR, "store.json");
const BACKUP_DIR = path.join(DATA_DIR, "backups");
const MAX_BODY_BYTES = 120 * 1024 * 1024;
const MAX_BACKUPS = 80;
const EDITOR_PASSWORD = process.env.EDITOR_PASSWORD || "";
const AUTH_COOKIE = "marketing_editor_session";
const AUTH_SECRET = process.env.AUTH_SECRET;
const AUTH_TOKEN = EDITOR_PASSWORD
  ? crypto.createHmac("sha256", AUTH_SECRET).update(EDITOR_PASSWORD).digest("hex")
  : "";
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_DEFAULT_CHAT_ID = process.env.TELEGRAM_DEFAULT_CHAT_ID || "";
const REPORT_FIELDS = ["title", "text", "date", "status", "attachments"];
const REPORT_STATUSES = new Set(["plan", "progress", "done"]);

const originalCreateServer = http.createServer.bind(http);
http.createServer = function createPatchedServer(listener) {
  return originalCreateServer(async (req, res) => {
    try {
      const pathname = new URL(req.url || "/", "http://localhost").pathname;
      if (req.method === "GET" && pathname === "/app.js") {
        servePatchedAppJs(res);
        return;
      }
      if (req.method === "PUT" && pathname === "/api/employees/report") {
        await handleSaveEmployeeReport(req, res);
        return;
      }
      if (req.method === "POST" && pathname === "/api/telegram/send") {
        await handleSendTelegram(req, res);
        return;
      }
      if (pathname === "/api/project2") {
        await handleProject2(req, res);
        return;
      }
    } catch (error) {
      sendJson(res, 500, { error: "Не удалось сохранить задачу" });
      return;
    }

    if (typeof listener === "function") return listener(req, res);
    res.statusCode = 404;
    res.end("Not found");
  });
};

require("./server.js");

function patchProject2AppScript(source) {
  const match = source.match(/const PROJECT2_HTML_BASE64 = '([^']+)'/);
  if (!match) return source;

  let html;
  try {
    html = Buffer.from(match[1], "base64").toString("utf8");
  } catch (error) {
    return source;
  }

  html = html.replaceAll("Доска проектов 2", "Доска проектов");
  html = html.replace(
    "</style>",
    ".board{overflow:visible!important}.content,#root{overflow:visible!important;height:auto!important;max-height:none!important}.app{height:auto!important;min-height:100vh}html,body{overflow-y:auto!important}</style>"
  );

  html = html.replace(
    /function project2HasContent\(state\)\{[^}]*\}/,
    "function project2HasContent(state){return Boolean(state&&state.initialized&&(project2ItemCount(state)>0||(Array.isArray(state?.people)&&state.people.length>0)))}"
  );

  if (!html.includes("function project2DeleteCount(state)")) {
    html = html.replace(
      "function project2ItemCount(state){return (Array.isArray(state?.tasks)?state.tasks.length:0)+(Array.isArray(state?.backlog)?state.backlog.length:0)}",
      "function project2ItemCount(state){return (Array.isArray(state?.tasks)?state.tasks.length:0)+(Array.isArray(state?.backlog)?state.backlog.length:0)+(Array.isArray(state?.people)?state.people.length:0)}\n    function project2DeleteCount(state){return (Array.isArray(state?.deletedTaskIds)?state.deletedTaskIds.length:0)+(Array.isArray(state?.deletedBacklogIds)?state.deletedBacklogIds.length:0)+(Array.isArray(state?.deletedPersonNames)?state.deletedPersonNames.length:0)}"
    );
  }
  html = html.replace(
    /function project2ItemCount\(state\)\{return \(Array\.isArray\(state\?\.tasks\)\?state\.tasks\.length:0\)\+\(Array\.isArray\(state\?\.backlog\)\?state\.backlog\.length:0\)(?:\+\(Array\.isArray\(state\?\.people\)\?state\.people\.length:0\))?\}/,
    "function project2ItemCount(state){return (Array.isArray(state?.tasks)?state.tasks.length:0)+(Array.isArray(state?.backlog)?state.backlog.length:0)+(Array.isArray(state?.people)?state.people.length:0)}"
  );
  html = html.replace(
    /function project2DeleteCount\(state\)\{return \(Array\.isArray\(state\?\.deletedTaskIds\)\?state\.deletedTaskIds\.length:0\)\+\(Array\.isArray\(state\?\.deletedBacklogIds\)\?state\.deletedBacklogIds\.length:0\)(?:\+\(Array\.isArray\(state\?\.deletedPersonNames\)\?state\.deletedPersonNames\.length:0\))?\}/,
    "function project2DeleteCount(state){return (Array.isArray(state?.deletedTaskIds)?state.deletedTaskIds.length:0)+(Array.isArray(state?.deletedBacklogIds)?state.deletedBacklogIds.length:0)+(Array.isArray(state?.deletedPersonNames)?state.deletedPersonNames.length:0)}"
  );

  const oldLoad = "async function loadProject2State(){const localState=readLocalProject2State();applyProject2State(localState);try{const response=await fetch('/api/project2',{cache:'no-store'});if(!response.ok)return;const payload=await response.json();const shared=payload?.project2;if(project2HasContent(shared)){applyProject2State(shared);writeLocalProject2State(project2StateSnapshot());exportDoneTasksToEmployees();render();return}if(project2HasContent(localState)||tasks.length||backlog.length)saveProject2State(false)}catch(e){}}";
  const newLoad = "async function loadProject2State(){try{const response=await fetch('/api/project2',{cache:'no-store'});if(response.ok){const payload=await response.json();const shared=payload?.project2;if(shared&&shared.initialized){applyProject2State(shared);writeLocalProject2State(project2StateSnapshot());exportDoneTasksToEmployees();render();return}}}catch(e){}const localState=readLocalProject2State();if(project2HasContent(localState)){applyProject2State(localState);exportDoneTasksToEmployees();render();}}";
  html = html.replace(oldLoad, newLoad);

  const oldSave = "async function saveProject2State(showMessage){try{const state=project2StateSnapshot();writeLocalProject2State(state);exportDoneTasksToEmployees();clearTimeout(project2SaveTimer);project2SaveTimer=setTimeout(()=>saveProject2ToServer(state,showMessage),showMessage?0:250);if(showMessage)alert('Сохранено');}catch(e){alert('Не удалось сохранить. Проверьте доступ к памяти браузера.')}}";
  const newSave = "async function saveProject2State(showMessage){try{const state=project2StateSnapshot();if(project2ItemCount(state)===0&&project2DeleteCount(state)===0){if(showMessage)alert('Нет задач для сохранения');return}writeLocalProject2State(state);exportDoneTasksToEmployees();clearTimeout(project2SaveTimer);project2SaveTimer=setTimeout(()=>saveProject2ToServer(state,showMessage),showMessage?0:250);if(showMessage)alert('Сохранено');}catch(e){alert('Не удалось сохранить. Проверьте доступ к памяти браузера.')}}";
  html = html.replace(oldSave, newSave);

  const oldSaveServer = "async function saveProject2ToServer(state,showErrors=false){try{const response=await fetch('/api/project2',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({project2:state})});if(!response.ok&&showErrors)alert('Не удалось сохранить общую доску на сервер')}catch(e){if(showErrors)alert('Не удалось сохранить общую доску на сервер')}}";
  const newSaveServer = "async function saveProject2ToServer(state,showErrors=false){try{const response=await fetch('/api/project2',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({project2:state})});if(!response.ok){if(showErrors)alert('Не удалось сохранить общую доску на сервер');return}const payload=await response.json().catch(()=>({}));const shared=payload?.project2;if(shared&&shared.initialized){applyProject2State(shared);writeLocalProject2State(project2StateSnapshot());exportDoneTasksToEmployees();render()}}catch(e){if(showErrors)alert('Не удалось сохранить общую доску на сервер')}}";
  html = html.replace(oldSaveServer, newSaveServer);

  html = html.replace(
    /let tasks=\[[\s\S]*?\];\s*let backlog=\[[\s\S]*?\];\s*function task/,
    "let tasks=[];\n    let backlog=[];\n    function task"
  );

  if (!html.includes("function touchProject2Item(item)")) {
    html = html.replace(
      "function task(id,number,title,status,priority,assignee,description,category='Frontend'){const time=new Date().toISOString();return{id,number,title,status,priority,assignee,start:'',due:'2026-09-25',description,category,createdAt:time,updatedAt:time}}",
      "function task(id,number,title,status,priority,assignee,description,category='Frontend'){const time=new Date().toISOString();return{id,number,title,status,priority,assignee,start:'',due:'2026-09-25',description,category,createdAt:time,updatedAt:time}}\n    function touchProject2Item(item){if(item)item.updatedAt=new Date().toISOString();return item}"
    );
  }

  html = html.replace(
    "function moveCurrentToBacklog(){if(editSource!=='tasks')return;const i=tasks.findIndex(t=>t.id===editId);if(i>-1){backlog.push(tasks.splice(i,1)[0]);persistProject2();closeModal();render()}}function moveCurrentToKanban(){if(editSource!=='backlog')return;const i=backlog.findIndex(t=>t.id===editId);if(i>-1){tasks.push(backlog.splice(i,1)[0]);persistProject2();closeModal();render()}}",
    "function moveCurrentToBacklog(){if(editSource!=='tasks')return;const i=tasks.findIndex(t=>t.id===editId);if(i>-1){backlog.push(touchProject2Item(tasks.splice(i,1)[0]));persistProject2();closeModal();render()}}function moveCurrentToKanban(){if(editSource!=='backlog')return;const i=backlog.findIndex(t=>t.id===editId);if(i>-1){tasks.push(touchProject2Item(backlog.splice(i,1)[0]));persistProject2();closeModal();render()}}"
  );

  html = html.replace(
    "function moveToKanban(id){const i=backlog.findIndex(x=>x.id===id);if(i>-1){tasks.push(backlog.splice(i,1)[0]);persistProject2();render()}}function moveToBacklog(id){const i=tasks.findIndex(x=>x.id===id);if(i>-1){backlog.push(tasks.splice(i,1)[0]);persistProject2();render()}}",
    "function moveToKanban(id){const i=backlog.findIndex(x=>x.id===id);if(i>-1){tasks.push(touchProject2Item(backlog.splice(i,1)[0]));persistProject2();render()}}function moveToBacklog(id){const i=tasks.findIndex(x=>x.id===id);if(i>-1){backlog.push(touchProject2Item(tasks.splice(i,1)[0]));persistProject2();render()}}"
  );

  if (!html.includes("let deletedPersonNames=[]")) {
    html = html.replace(
      "let deletedTaskIds=[];let deletedBacklogIds=[];",
      "let deletedTaskIds=[];let deletedBacklogIds=[];let deletedPersonNames=[];"
    );
  }

  html = html.replace(
    "function project2StateSnapshot(){return{people,categories,tasks,backlog,filters,deletedTaskIds,deletedBacklogIds,initialized:true,updatedAt:new Date().toISOString()}}",
    "function project2StateSnapshot(){return{people,categories,tasks,backlog,filters,deletedTaskIds,deletedBacklogIds,deletedPersonNames,initialized:true,updatedAt:new Date().toISOString()}}"
  );

  html = html.replace(
    "function mergeProject2States(base={},extra={}){const taskDeletes=Array.from(new Set([...(base.deletedTaskIds||[]),...(extra.deletedTaskIds||[])]));const backlogDeletes=Array.from(new Set([...(base.deletedBacklogIds||[]),...(extra.deletedBacklogIds||[])]));return{...base,...extra,people:Array.isArray(extra.people)&&extra.people.length?extra.people:base.people,categories:Array.isArray(extra.categories)&&extra.categories.length?extra.categories:base.categories,deletedTaskIds:taskDeletes,deletedBacklogIds:backlogDeletes,tasks:mergeProject2List(base.tasks,extra.tasks,taskDeletes),backlog:mergeProject2List(base.backlog,extra.backlog,backlogDeletes),filters:{...(base.filters||{}),...(extra.filters||{})},initialized:true,updatedAt:new Date().toISOString()}}",
    "function mergeProject2States(base={},extra={}){const taskDeletes=Array.from(new Set([...(base.deletedTaskIds||[]),...(extra.deletedTaskIds||[])]));const backlogDeletes=Array.from(new Set([...(base.deletedBacklogIds||[]),...(extra.deletedBacklogIds||[])]));const personDeletes=Array.from(new Set([...(base.deletedPersonNames||[]),...(extra.deletedPersonNames||[])]));const peopleSource=Array.isArray(extra.people)?extra.people:base.people;return{...base,...extra,people:(Array.isArray(peopleSource)?peopleSource:[]).filter(p=>!personDeletes.includes(String(p?.name||''))),categories:Array.isArray(extra.categories)&&extra.categories.length?extra.categories:base.categories,deletedTaskIds:taskDeletes,deletedBacklogIds:backlogDeletes,deletedPersonNames:personDeletes,tasks:mergeProject2List(base.tasks,extra.tasks,taskDeletes),backlog:mergeProject2List(base.backlog,extra.backlog,backlogDeletes),filters:{...(base.filters||{}),...(extra.filters||{})},initialized:true,updatedAt:new Date().toISOString()}}"
  );

  html = html.replace(
    "function applyProject2State(value){const saved=normalizeProject2State(value);if(saved.filters&&typeof saved.filters==='object')filters={...filters,...saved.filters};if(Array.isArray(saved.people)){people.splice(0,people.length,...saved.people.map((p,i)=>({...people[i],...p})));}if(Array.isArray(saved.categories)&&saved.categories.length){categories.splice(0,categories.length,...saved.categories);}",
    "function applyProject2State(value){const saved=normalizeProject2State(value);if(saved.filters&&typeof saved.filters==='object')filters={...filters,...saved.filters};if(Array.isArray(saved.deletedPersonNames))deletedPersonNames=Array.from(new Set(saved.deletedPersonNames.filter(Boolean))).slice(-1000);if(Array.isArray(saved.people)){people.splice(0,people.length,...saved.people.filter(p=>!deletedPersonNames.includes(String(p?.name||''))).map((p,i)=>({...people[i],...p})));}if(Array.isArray(saved.categories)&&saved.categories.length){categories.splice(0,categories.length,...saved.categories);}"
  );

  html = html.replace(
    "function addPerson(){people.push({name:'Новый исполнитель',telegram:''});render()}function updatePerson(i,name){const old=people[i].name;people[i].name=name;if(reportEmployee===old)reportEmployee=name;tasks.forEach(t=>{if(t.assignee===old)t.assignee=name});backlog.forEach(t=>{if(t.assignee===old)t.assignee=name})}function updateTelegram(i,value){people[i].telegram=value}function deletePerson(i){if(confirm('Удалить пользователя навсегда?')){const old=people[i].name;people.splice(i,1);tasks.forEach(t=>{if(t.assignee===old)t.assignee=''});backlog.forEach(t=>{if(t.assignee===old)t.assignee=''});if(reportEmployee===old)reportEmployee=people[0]?.name||'';render()}}",
    "function addPerson(){people.push({name:'Новый исполнитель',telegram:''});persistProject2();render()}function updatePerson(i,name){const old=people[i].name;people[i].name=name;deletedPersonNames=deletedPersonNames.filter(item=>item!==name);if(reportEmployee===old)reportEmployee=name;tasks.forEach(t=>{if(t.assignee===old){t.assignee=name;touchProject2Item(t)}});backlog.forEach(t=>{if(t.assignee===old){t.assignee=name;touchProject2Item(t)}});persistProject2()}function updateTelegram(i,value){people[i].telegram=value;persistProject2()}function deletePerson(i){if(confirm('Удалить пользователя навсегда?')){const old=people[i].name;deletedPersonNames=Array.from(new Set([...deletedPersonNames,old])).slice(-1000);people.splice(i,1);tasks.forEach(t=>{if(t.assignee===old){t.assignee='';touchProject2Item(t)}});backlog.forEach(t=>{if(t.assignee===old){t.assignee='';touchProject2Item(t)}});if(reportEmployee===old)reportEmployee=people[0]?.name||'';persistProject2();render()}}"
  );

  const nextBase64 = Buffer.from(html, "utf8").toString("base64");
  return source.replace(match[1], nextBase64);
}

function servePatchedAppJs(res) {
  const appPath = path.join(ROOT, "public", "app.js");
  fs.readFile(appPath, "utf8", (error, content) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }
    const patched = patchProject2AppScript(content);
    res.writeHead(200, {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-store"
    });
    res.end(patched);
  });
}

function now() {
  return new Date().toISOString();
}

function resolveDataDir() {
  if (process.env.DATA_DIR) return path.resolve(process.env.DATA_DIR);
  if (process.env.RENDER || fs.existsSync(RENDER_DISK_DIR)) return RENDER_DISK_DIR;
  return LOCAL_DATA_DIR;
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if ((value.startsWith('\"') && value.endsWith('\"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}


const PROJECT2_DEMO_TASKS = new Map([
  ["t1", "Подготовить структуру карточки"],
  ["t2", "Добавить связи задач"],
  ["t3", "Kanban и перенос задач"],
  ["t4", "Бэклог"],
  ["t5", "Проверка отчета"],
  ["t6", "Ждем доступы"],
  ["t7", "Справочник исполнителей"],
  ["b1", "Разобрать требования по отчетности"],
  ["b2", "Импорт старых задач"]
]);

function isProject2DemoTask(item) {
  const id = String(item?.id || "");
  const title = String(item?.title || "").trim();
  return Boolean(id && PROJECT2_DEMO_TASKS.get(id) === title);
}

function normalizeProject2Payload(value) {
  const source = value && typeof value === "object" ? value : {};
  const deletedPersonNames = Array.isArray(source.deletedPersonNames)
    ? source.deletedPersonNames.filter(Boolean).slice(-1000)
    : [];
  return {
    initialized: Boolean(source.initialized || Array.isArray(source.tasks) || Array.isArray(source.backlog)),
    updatedAt: source.updatedAt || now(),
    people: Array.isArray(source.people)
      ? source.people.filter(person => !deletedPersonNames.includes(String(person?.name || "")))
      : [],
    categories: Array.isArray(source.categories) ? source.categories : [],
    tasks: Array.isArray(source.tasks) ? source.tasks.filter(item => !isProject2DemoTask(item)) : [],
    backlog: Array.isArray(source.backlog) ? source.backlog.filter(item => !isProject2DemoTask(item)) : [],
    deletedTaskIds: Array.isArray(source.deletedTaskIds) ? source.deletedTaskIds.filter(Boolean).slice(-1000) : [],
    deletedBacklogIds: Array.isArray(source.deletedBacklogIds) ? source.deletedBacklogIds.filter(Boolean).slice(-1000) : [],
    deletedPersonNames,
    filters: source.filters && typeof source.filters === "object" ? source.filters : {}
  };
}

function project2ItemKey(item) {
  return String(item?.id || item?.number || item?.title || "");
}

function project2Timestamp(value) {
  const time = Date.parse(value || "");
  return Number.isFinite(time) ? time : 0;
}

function mergeProject2Item(currentItem, incomingItem) {
  if (!currentItem) return incomingItem;
  if (!incomingItem) return currentItem;
  const currentTime = project2Timestamp(currentItem.updatedAt || currentItem.createdAt);
  const incomingTime = project2Timestamp(incomingItem.updatedAt || incomingItem.createdAt);
  return incomingTime >= currentTime ? { ...currentItem, ...incomingItem } : { ...incomingItem, ...currentItem };
}

function mergeProject2Items(currentItems = [], incomingItems = [], deletedIds = new Set()) {
  const items = new Map();
  (Array.isArray(currentItems) ? currentItems : []).forEach(item => {
    const key = project2ItemKey(item);
    if (key && !deletedIds.has(key)) items.set(key, item);
  });
  (Array.isArray(incomingItems) ? incomingItems : []).forEach(item => {
    const key = project2ItemKey(item);
    if (key && !deletedIds.has(key)) items.set(key, mergeProject2Item(items.get(key), item));
  });
  return Array.from(items.values()).sort((a, b) => (Number(a.number) || 0) - (Number(b.number) || 0));
}

function project2ItemCount(state = {}) {
  return (Array.isArray(state.tasks) ? state.tasks.length : 0)
    + (Array.isArray(state.backlog) ? state.backlog.length : 0)
    + (Array.isArray(state.people) ? state.people.length : 0);
}

function project2DeleteCount(state = {}) {
  return (Array.isArray(state.deletedTaskIds) ? state.deletedTaskIds.length : 0)
    + (Array.isArray(state.deletedBacklogIds) ? state.deletedBacklogIds.length : 0)
    + (Array.isArray(state.deletedPersonNames) ? state.deletedPersonNames.length : 0);
}

function mergeProject2State(currentState = {}, incomingState = {}) {
  const current = normalizeProject2Payload(currentState);
  const incoming = normalizeProject2Payload(incomingState);
  if (project2ItemCount(current) > 0 && project2ItemCount(incoming) === 0 && project2DeleteCount(incoming) === 0) {
    return current;
  }
  const deletedPersonNames = Array.from(new Set([...(current.deletedPersonNames || []), ...(incoming.deletedPersonNames || [])])).slice(-1000);
  const peopleSource = Array.isArray(incoming.people) ? incoming.people : current.people;
  return {
    ...current,
    ...incoming,
    people: (Array.isArray(peopleSource) ? peopleSource : []).filter(person => !deletedPersonNames.includes(String(person?.name || ""))),
    categories: incoming.categories.length ? incoming.categories : current.categories,
    deletedTaskIds: Array.from(new Set([...(current.deletedTaskIds || []), ...(incoming.deletedTaskIds || [])])).slice(-1000),
    deletedBacklogIds: Array.from(new Set([...(current.deletedBacklogIds || []), ...(incoming.deletedBacklogIds || [])])).slice(-1000),
    deletedPersonNames,
    tasks: mergeProject2Items(current.tasks, incoming.tasks, new Set([...(current.deletedTaskIds || []), ...(incoming.deletedTaskIds || [])])),
    backlog: mergeProject2Items(current.backlog, incoming.backlog, new Set([...(current.deletedBacklogIds || []), ...(incoming.deletedBacklogIds || [])])),
    filters: { ...(current.filters || {}), ...(incoming.filters || {}) },
    initialized: true,
    updatedAt: now()
  };
}

async function handleProject2(req, res) {
  if (!requireEditor(req, res)) return;
  const store = readStore() || { workspace: { sections: {} } };
  store.workspace = store.workspace && typeof store.workspace === "object" ? store.workspace : { sections: {} };
  store.workspace.sections = store.workspace.sections || {};

  if (req.method === "GET") {
    sendJson(res, 200, { project2: normalizeProject2Payload(store.workspace.sections.project2 || {}) });
    return;
  }

  if (req.method === "PUT") {
    try {
      const payload = JSON.parse(await readBody(req) || "{}");
      ensureDailyBackup();
      store.workspace.sections.project2 = mergeProject2State(store.workspace.sections.project2 || {}, payload.project2 || payload);
      store.workspace.updatedAt = now();
      writeStore(store);
      sendJson(res, 200, { project2: store.workspace.sections.project2, updatedAt: store.workspace.updatedAt });
    } catch (error) {
      sendJson(res, error.message === "BODY_TOO_LARGE" ? 413 : 400, { error: "Не удалось сохранить Доску проектов", detail: error.message });
    }
    return;
  }

  sendJson(res, 405, { error: "Method not allowed" });
}

async function handleSaveEmployeeReport(req, res) {
  if (!requireEditor(req, res)) return;

  try {
    const payload = JSON.parse(await readBody(req) || "{}");
    if (!payload || typeof payload !== "object" || !payload.personId || !payload.report) {
      sendJson(res, 400, { error: "Expected { personId, report }" });
      return;
    }

    const store = readStore();
    if (!store?.workspace?.sections?.employees) {
      sendJson(res, 409, { error: "Хранилище отчетов еще не готово. Обновите страницу и попробуйте снова." });
      return;
    }

    ensureDailyBackup();
    const saved = saveEmployeeReportToWorkspace(store.workspace, payload);
    if (!saved) {
      sendJson(res, 404, { error: "Сотрудник для сохранения задачи не найден" });
      return;
    }

    store.workspace.updatedAt = now();
    writeStore(store);
    sendJson(res, 200, { workspace: store.workspace, report: saved.report, personId: saved.person.id || payload.personId });
  } catch (error) {
    sendJson(res, error.message === "BODY_TOO_LARGE" ? 413 : 400, {
      error: error.message === "BODY_TOO_LARGE"
        ? "Слишком большой объем данных. Уменьшите размер вложений и попробуйте сохранить еще раз."
        : "Не удалось сохранить задачу"
    });
  }
}

async function handleSendTelegram(req, res) {
  if (!requireEditor(req, res)) return;

  if (!TELEGRAM_BOT_TOKEN) {
    sendJson(res, 503, { error: "TELEGRAM_BOT_TOKEN не задан в переменных Render" });
    return;
  }

  try {
    const payload = JSON.parse(await readBody(req) || "{}");
    const chatId = normalizeTelegramTarget(payload.telegram || payload.chatId || TELEGRAM_DEFAULT_CHAT_ID);
    const text = String(payload.text || "").trim();

    if (!chatId) {
      sendJson(res, 400, { error: "У исполнителя не указан Telegram chat_id или username" });
      return;
    }
    if (!text) {
      sendJson(res, 400, { error: "Пустой текст уведомления" });
      return;
    }

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true
      })
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok || result.ok === false) {
      sendJson(res, 502, {
        error: telegramErrorMessage(result.description || response.statusText || "Telegram rejected message")
      });
      return;
    }

    sendJson(res, 200, { ok: true });
  } catch (error) {
    sendJson(res, 400, { error: "Не удалось отправить уведомление в Telegram" });
  }
}

function normalizeTelegramTarget(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const match = raw.match(/(?:https?:\/\/)?t\.me\/([^/?#]+)/i);
  if (match) return `@${match[1].replace(/^@/, "")}`;
  return raw;
}

function telegramErrorMessage(description) {
  const message = String(description || "");
  if (/chat not found/i.test(message)) {
    return "Telegram не нашел этот чат. Для личных сообщений нужен chat_id: пользователь должен сначала написать вашему боту.";
  }
  if (/bot was blocked/i.test(message)) {
    return "Пользователь заблокировал бота или не начинал с ним чат.";
  }
  return `Telegram не принял сообщение: ${message}`;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", chunk => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error("BODY_TOO_LARGE"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function readStore() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(STORE_FILE)) return null;
  return JSON.parse(fs.readFileSync(STORE_FILE, "utf8"));
}

function writeStore(store) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tempFile = `${STORE_FILE}.tmp-${process.pid}-${Date.now()}`;
  fs.writeFileSync(tempFile, JSON.stringify(store, null, 2), "utf8");
  fs.renameSync(tempFile, STORE_FILE);
}

function ensureDailyBackup() {
  if (!fs.existsSync(STORE_FILE)) return;
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const backupFile = path.join(BACKUP_DIR, `${now().slice(0, 10)}-before-report-save.json`);
  if (!fs.existsSync(backupFile)) fs.copyFileSync(STORE_FILE, backupFile);
  cleanupBackups();
}

function cleanupBackups() {
  if (!fs.existsSync(BACKUP_DIR)) return;
  const backups = fs.readdirSync(BACKUP_DIR)
    .filter(name => name.endsWith(".json"))
    .map(name => ({ name, file: path.join(BACKUP_DIR, name), time: fs.statSync(path.join(BACKUP_DIR, name)).mtimeMs }))
    .sort((a, b) => b.time - a.time);
  for (const backup of backups.slice(MAX_BACKUPS)) fs.rmSync(backup.file, { force: true });
}

function saveEmployeeReportToWorkspace(workspace, payload) {
  normalizeEmployeeRecords(workspace);
  const employees = workspace.sections?.employees;
  const people = employees?.people;
  if (!Array.isArray(people)) return null;

  const personId = String(payload.personId || "");
  const personName = normalizeName(payload.personName || "");
  const personIndex = people.findIndex((person, index) =>
    String(person?.id || "") === personId
      || `employee-${index}` === personId
      || (personName && normalizeName(person?.name) === personName)
  );
  if (personIndex < 0) return null;

  const time = now();
  const person = people[personIndex];
  person.reports = Array.isArray(person.reports) ? person.reports : [];
  const incoming = normalizeReportForSave(payload.report, time);
  const reportIndex = person.reports.findIndex(item => String(item?.id || "") === incoming.id);

  let savedReport;
  if (reportIndex >= 0) {
    const current = person.reports[reportIndex] || {};
    savedReport = { ...current, ...incoming, createdAt: current.createdAt || incoming.createdAt };
    savedReport.fieldUpdatedAt = { ...normalizeReportFieldTimestamps(current), ...incoming.fieldUpdatedAt };
    person.reports[reportIndex] = savedReport;
  } else {
    savedReport = incoming;
    person.reports.push(savedReport);
  }

  person.reports.sort(compareReportsByDate);
  person.updatedAt = maxTimestamp(person.updatedAt, savedReport.updatedAt, time);
  employees.updatedAt = maxTimestamp(employees.updatedAt, person.updatedAt, time);
  workspace.updatedAt = maxTimestamp(workspace.updatedAt, employees.updatedAt, time);
  return { person, personIndex, report: savedReport };
}

function normalizeEmployeeRecords(workspace) {
  const employees = workspace?.sections?.employees;
  if (!employees || !Array.isArray(employees.people)) return;
  const fallback = employees.updatedAt || workspace.updatedAt || now();
  employees.people.forEach((person, personIndex) => {
    if (!person || typeof person !== "object") return;
    if (!person.id) person.id = `employee-${personIndex}`;
    if (!person.updatedAt) person.updatedAt = fallback;
    person.reports = Array.isArray(person.reports) ? person.reports : [];
    person.reports.forEach((report, reportIndex) => {
      if (!report || typeof report !== "object") return;
      if (!report.id) report.id = `report-${person.id}-${reportIndex}`;
      if (!report.updatedAt) report.updatedAt = person.updatedAt || fallback;
      report.attachments = normalizeReportAttachments(report.attachments);
      report.fieldUpdatedAt = normalizeReportFieldTimestamps(report);
      if (!REPORT_STATUSES.has(report.status)) report.status = report.completed ? "done" : "plan";
      report.completed = report.status === "done";
    });
  });
}

function normalizeReportForSave(report, time) {
  const source = report && typeof report === "object" ? report : {};
  const status = REPORT_STATUSES.has(source.status) ? source.status : source.completed ? "done" : "plan";
  const date = validDate(source.date) ? source.date : time.slice(0, 10);
  return {
    ...source,
    id: String(source.id || `r-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`),
    title: String(source.title ?? ""),
    text: String(source.text ?? ""),
    date,
    status,
    completed: status === "done",
    attachments: normalizeReportAttachments(source.attachments),
    createdAt: source.createdAt || time,
    updatedAt: time,
    fieldUpdatedAt: REPORT_FIELDS.reduce((result, field) => {
      result[field] = time;
      return result;
    }, {})
  };
}

function normalizeReportFieldTimestamps(report) {
  const fallback = report?.updatedAt || now();
  const source = report?.fieldUpdatedAt && typeof report.fieldUpdatedAt === "object" ? report.fieldUpdatedAt : {};
  return REPORT_FIELDS.reduce((result, field) => {
    result[field] = source[field] || fallback;
    return result;
  }, {});
}

function normalizeReportAttachments(attachments) {
  return (Array.isArray(attachments) ? attachments : [])
    .filter(item => item && item.dataUrl && item.name)
    .map((item, index) => ({
      id: String(item.id || `file-${Date.now()}-${index}`),
      name: String(item.name || `Файл ${index + 1}`),
      type: String(item.type || dataUrlType(item.dataUrl) || "application/octet-stream"),
      size: Number(item.size) || estimateDataUrlSize(item.dataUrl),
      dataUrl: String(item.dataUrl || ""),
      createdAt: item.createdAt || now()
    }));
}

function dataUrlType(value) {
  const match = String(value || "").match(/^data:([^;,]+)/);
  return match ? match[1] : "";
}

function estimateDataUrlSize(value) {
  const base64 = String(value || "").split(",")[1] || "";
  return Math.max(0, Math.floor(base64.length * 0.75));
}

function compareReportsByDate(a, b) {
  return String(a?.date || "").localeCompare(String(b?.date || "")) || String(a?.title || "").localeCompare(String(b?.title || ""), "ru");
}

function maxTimestamp(...values) {
  return values.filter(Boolean).sort().at(-1) || now();
}

function validDate(value) {
  const date = String(value || "");
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isFinite(Date.parse(`${date}T00:00:00Z`));
}

function normalizeName(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function parseCookies(req) {
  const header = req.headers.cookie || "";
  const result = {};
  for (const item of header.split(";")) {
    const trimmed = item.trim();
    if (!trimmed) continue;
    const index = trimmed.indexOf("=");
    const key = safeDecode(index === -1 ? trimmed : trimmed.slice(0, index));
    const value = index === -1 ? "" : safeDecode(trimmed.slice(index + 1));
    result[key] = value;
  }
  return result;
}

function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch (error) {
    return value;
  }
}

function requireEditor(req, res) {
  if (!EDITOR_PASSWORD) return true;
  if (parseCookies(req)[AUTH_COOKIE] === AUTH_TOKEN) return true;
  sendJson(res, 401, { error: "AUTH_REQUIRED", requiresPassword: true, authenticated: false });
  return false;
}

function sendJson(res, status, payload) {
  if (res.headersSent || res.writableEnded) return;
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(body);
}
