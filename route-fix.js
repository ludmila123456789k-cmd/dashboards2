const http = require("http");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const WORKING_BRANCH = "fix-report-save-symbols-20260903";
const WORKING_APP_URL = `https://raw.githubusercontent.com/ludmila123456789k-cmd/dashboards2/${WORKING_BRANCH}/public/app.js`;
const EVENT_ASSET_BASE_URL = `https://raw.githubusercontent.com/ludmila123456789k-cmd/dashboards2/${WORKING_BRANCH}/public/event-assets/`;
const APP_SCRIPT_CACHE_MS = 5 * 60 * 1000;
const APP_SCRIPT_DISK_CACHE = path.join(process.env.DATA_DIR || __dirname, "patched-app-cache.js");
const APP_SCRIPT_BUNDLED_CACHE = path.join(__dirname, "patched-app-cache.js");
const originalCreateServer = http.createServer.bind(http);
let appScriptCache = null;
let appScriptCacheAt = 0;
let appScriptFetchPromise = null;
let outerAppScriptCache = null;
let project2HtmlCache = null;

function readAppScriptDiskCache() {
  const cachePaths = Array.from(new Set([APP_SCRIPT_DISK_CACHE, APP_SCRIPT_BUNDLED_CACHE]));
  for (const cachePath of cachePaths) {
    try {
      const stat = fs.statSync(cachePath);
      const script = fs.readFileSync(cachePath, "utf8");
      if (script) {
        appScriptCache = script;
        appScriptCacheAt = stat.mtimeMs || Date.now();
        return script;
      }
    } catch (error) {}
  }
  return null;
}

function writeAppScriptDiskCache(script) {
  try {
    fs.mkdirSync(path.dirname(APP_SCRIPT_DISK_CACHE), { recursive: true });
    fs.writeFileSync(APP_SCRIPT_DISK_CACHE, script);
  } catch (error) {}
}

function stripProject2StartupAutosave(html) {
  return html.replace(
    /(\n\s*applyTelegramChatIdOverrides\(\);\s*\n\s*loadProject2State\(\);\s*)\n\s*applyTelegramChatIdOverrides\(\);\s*\n\s*persistProject2\(\);\s*\n\s*render\(\);/g,
    "$1"
  );
}

function patchOuterAppScript(source) {
  return source
    .replace(/\{ id: "project2", label: "Доска проектов 2", icon: "board" \}/g, '{ id: "project2", label: "Доска проектов", icon: "board" }')
    .replace(/title="Доска проектов 2"/g, 'title="Доска проектов"')
    .replace(/<section class="project2-embed">\s*<iframe class="project2-frame" title="Доска проектов"><\/iframe>\s*<\/section>/g, '<section class="project2-embed" style="margin:0;padding:0;width:100%;height:calc(100vh - 100px);min-height:780px;overflow:visible"><iframe class="project2-frame" title="Доска проектов" style="display:block;width:100%;height:100%;min-height:780px;border:0;background:#f6f8fb"></iframe></section>')
    .replace(/function mergeProject2SharedState\(current = \{\}, incoming = \{\}\) \{\n    return \{\n      \.\.\.current,\n      \.\.\.incoming,\n      people: Array\.isArray\(incoming\.people\) && incoming\.people\.length \? incoming\.people : current\.people,\n      categories: Array\.isArray\(incoming\.categories\) && incoming\.categories\.length \? incoming\.categories : current\.categories,\n      tasks: mergeProject2SharedList\(current\.tasks, incoming\.tasks\),\n      backlog: mergeProject2SharedList\(current\.backlog, incoming\.backlog\),\n      filters: \{ \.\.\.\(current\.filters \|\| \{\}\), \.\.\.\(incoming\.filters \|\| \{\}\) \},\n      initialized: true,\n      updatedAt: new Date\(\)\.toISOString\(\)\n    \};\n  \}/, 'function project2SharedPersonName(value) { return String(typeof value === "object" ? value?.name : value || "").trim().toLowerCase(); }\n  function project2SharedPersonKey(value) { const draftId = String(value?._draftId || value?.id || "").trim().toLowerCase(); if (draftId) return draftId; const telegram = String(value?.telegram || "").trim().toLowerCase(); return telegram || project2SharedPersonName(value); }\n  function mergeProject2SharedPeople(current = [], incoming = [], deletedNames = []) {\n    const deleted = new Set((Array.isArray(deletedNames) ? deletedNames : []).map(project2SharedPersonName).filter(Boolean));\n    const currentList = Array.isArray(current) ? current : [];\n    const people = new Map();\n    currentList.forEach(person => { const key = project2SharedPersonKey(person); if (key && !deleted.has(project2SharedPersonName(person))) people.set(key, person); });\n    (Array.isArray(incoming) ? incoming : []).forEach(person => {\n      let key = project2SharedPersonKey(person);\n      const name = project2SharedPersonName(person);\n      if (!key || deleted.has(name)) return;\n      if (!people.has(key) && name) { const sameName = [...people.entries()].find(([, item]) => project2SharedPersonName(item) === name); if (sameName) key = sameName[0]; }\n      const index = Number(person?._draftIndex);\n      if (!people.has(key) && Number.isInteger(index) && index >= 0 && index < currentList.length) { const currentKey = project2SharedPersonKey(currentList[index]); if (currentKey && !deleted.has(project2SharedPersonName(currentList[index]))) key = currentKey; }\n      people.set(key, { ...(people.get(key) || {}), ...person });\n    });\n    return Array.from(people.values());\n  }\n  function mergeProject2SharedState(current = {}, incoming = {}) {\n    const incomingNames = new Set((Array.isArray(incoming.people) ? incoming.people : []).map(project2SharedPersonName).filter(Boolean));\n    const deletedPersonNames = Array.from(new Set([...(current.deletedPersonNames || []), ...(incoming.deletedPersonNames || [])])).filter(name => !incomingNames.has(project2SharedPersonName(name))).slice(-1000);\n    return {\n      ...current,\n      ...incoming,\n      people: Array.isArray(incoming.people) ? mergeProject2SharedPeople(current.people, incoming.people, deletedPersonNames) : current.people,\n      categories: Array.isArray(incoming.categories) && incoming.categories.length ? incoming.categories : current.categories,\n      tasks: mergeProject2SharedList(current.tasks, incoming.tasks),\n      backlog: mergeProject2SharedList(current.backlog, incoming.backlog),\n      deletedPersonNames,\n      filters: { ...(current.filters || {}), ...(incoming.filters || {}) },\n      initialized: true,\n      updatedAt: new Date().toISOString()\n    };\n  }')
    .replace(/const deletedPersonNames = Array\.from\(new Set\(\[\.\.\.\(current\.deletedPersonNames \|\| \[\]\), \.\.\.\(incoming\.deletedPersonNames \|\| \[\]\)\]\)\)\.filter\(name => !incomingNames\.has\(project2SharedPersonName\(name\)\)\)\.slice\(-1000\);\n    return \{/, 'const deletedPersonNames = Array.from(new Set([...(current.deletedPersonNames || []), ...(incoming.deletedPersonNames || [])])).filter(name => !incomingNames.has(project2SharedPersonName(name))).slice(-1000);\n    const currentTaskTotal = (Array.isArray(current.tasks) ? current.tasks.length : 0) + (Array.isArray(current.backlog) ? current.backlog.length : 0);\n    const incomingTaskTotal = (Array.isArray(incoming.tasks) ? incoming.tasks.length : 0) + (Array.isArray(incoming.backlog) ? incoming.backlog.length : 0);\n    const incomingDeleteTotal = (Array.isArray(incoming.deletedTaskIds) ? incoming.deletedTaskIds.length : 0) + (Array.isArray(incoming.deletedBacklogIds) ? incoming.deletedBacklogIds.length : 0);\n    const ignoreTaskDeletes = currentTaskTotal > 0 && incomingTaskTotal === 0 && incomingDeleteTotal > 0;\n    const deletedTaskIds = ignoreTaskDeletes ? (current.deletedTaskIds || []) : Array.from(new Set([...(current.deletedTaskIds || []), ...(incoming.deletedTaskIds || [])])).slice(-1000);\n    const deletedBacklogIds = ignoreTaskDeletes ? (current.deletedBacklogIds || []) : Array.from(new Set([...(current.deletedBacklogIds || []), ...(incoming.deletedBacklogIds || [])])).slice(-1000);\n    return {')
    .replace(/      deletedPersonNames,\n      filters: \{ \.\.\.\(current\.filters \|\| \{\}\), \.\.\.\(incoming\.filters \|\| \{\}\) \},/, '      deletedTaskIds,\n      deletedBacklogIds,\n      deletedPersonNames,\n      filters: { ...(current.filters || {}), ...(incoming.filters || {}) },')
    .replace(/const section = SECTIONS\.find\(item => item\.id === activeSection\) \|\| SECTIONS\[0\];/, 'if (activeSection === "board") activeSection = "project2";\n  const section = SECTIONS.find(item => item.id === activeSection) || SECTIONS[0];')
    .replace(/function navigateToSection\(sectionId\) \{\n  if \(!SECTIONS\.some\(item => item\.id === sectionId\)\) return;/, 'function navigateToSection(sectionId) {\n  if (sectionId === "board") sectionId = "project2";\n  if (!SECTIONS.some(item => item.id === sectionId)) return;')
    .replace(/const fromUrl = readViewStateParam\("section"\);\n    if \(SECTIONS\.some\(item => item\.id === fromUrl\)\) return fromUrl;/, 'const fromUrl = readViewStateParam("section");\n    if (fromUrl === "board" && SECTIONS.some(item => item.id === "project2")) return "project2";\n    if (SECTIONS.some(item => item.id === fromUrl)) return fromUrl;')
    .replace(/return SECTIONS\.some\(item => item\.id === stored\) \? stored : "roadmap";/, 'return stored === "board" && SECTIONS.some(item => item.id === "project2") ? "project2" : SECTIONS.some(item => item.id === stored) ? stored : "roadmap";')
    .replace(/localStorage\.setItem\(ACTIVE_SECTION_KEY, activeSection\);/g, 'localStorage.setItem(ACTIVE_SECTION_KEY, activeSection === "board" ? "project2" : activeSection);')
    .replace(/localStorage\.setItem\(ACTIVE_SECTION_KEY, sectionId\);/g, 'localStorage.setItem(ACTIVE_SECTION_KEY, sectionId === "board" ? "project2" : sectionId);')
    .replace(/function sendProject2StateToFrame\(\) \{\n  const frameWindow = project2Frame\(\);\n  if \(!frameWindow \|\| !workspace\?\.sections\) return;\n  const state = workspace\.sections\.project2;\n  frameWindow\.postMessage\(\{\n    type: state\?\.initialized \? "project2-state" : "project2-state-missing",\n    state: state\?\.initialized \? clone\(state\) : null\n  \}, "\*"\);\n\}/, 'function sendProject2StateToFrame() {\n  const frameWindow = project2Frame();\n  if (!frameWindow) return;\n  frameWindow.postMessage({ type: "project2-state-missing", state: null }, "*");\n}')
    .replace(/function saveProject2SharedState\(state\) \{\n  if \(isPublicView \|\| !workspace\?\.sections \|\| !state \|\| typeof state !== "object"\) return;\n  workspace\.sections\.project2 = mergeProject2SharedState\(workspace\.sections\.project2 \|\| \{\}, state\);\n  touch\("project2", false\);\n  saveWorkspace\(\);\n\}/, 'function saveProject2SharedState(state) {\n  if (isPublicView || !workspace?.sections || !state || typeof state !== "object") return;\n  workspace.sections.project2 = clone(state);\n  touch("project2", false);\n  saveWorkspace();\n}');
}

function patchEmployeeEvents(source) {
  let result = source
    .replaceAll("Осенняя анимация", "Осень")
    .replaceAll("Зимняя анимация", "Зима")
    .replaceAll("Весенняя анимация", "Весна")
    .replaceAll("Летняя анимация", "Лето");

  result = result.replace(
    /function employeeEventClosed\(day, type\) \{[\s\S]*?\n\}/,
    'function employeeEventClosed(day, type) { return false; }'
  );
  result = result.replace(
    /function renderBirthdayEvent\(birthday, day, type\) \{[\s\S]*?\n\}/,
    'function renderBirthdayEvent(birthday, day, type) {\n  return `<aside class="employee-event employee-event-birthday">${employeeEventCloseButton(day, type)}<div class="employee-event-picture"><img src="/event-assets/${escapeAttribute(birthday.image)}" alt="${escapeAttribute(birthday.text)}" width="260" height="240" loading="eager" decoding="async" fetchpriority="high"><strong>${escapeHtml(birthday.text)}</strong></div></aside>`;\n}'
  );
  result = result.replace(
    /function renderLottieEvent\(kind, label, day, fileName\) \{[\s\S]*?\n\}/,
    'function renderLottieEvent(kind, label, day, fileName) {\n  return `<aside class="employee-event employee-event-${kind}">${employeeEventCloseButton(day, kind)}<div class="employee-lottie" data-lottie-src="/event-assets/${escapeAttribute(fileName)}" aria-label="${escapeAttribute(label)}"></div></aside>`;\n}'
  );
  result = result.replace(
    "container.innerHTML = `<div class=\"employee-lottie-fallback\">Анимация</div>`;",
    "container.innerHTML = `<div class=\"employee-lottie-fallback\" aria-hidden=\"true\"><span></span><span></span><span></span><span></span><span></span></div>`;"
  );

  const style = `
const employeeEventStyle = document.createElement("style");
employeeEventStyle.textContent = ` + JSON.stringify(`
.employee-detail-with-event{display:grid!important;grid-template-columns:minmax(0,1fr) 300px!important;gap:16px!important;align-items:start!important;overflow:visible!important}
.employee-main-column{min-width:0!important}
.employee-event{position:sticky!important;top:18px!important;display:block!important;min-height:300px!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;overflow:hidden!important;z-index:2!important}
.employee-lottie{position:absolute!important;inset:0!important;width:100%!important;height:300px!important;background:transparent!important;display:flex!important;align-items:center!important;justify-content:center!important}
.employee-lottie svg{width:100%!important;height:100%!important;max-width:100%!important;max-height:100%!important;display:block!important;background:transparent!important}
.employee-lottie-fallback{position:absolute!important;inset:0!important;overflow:hidden!important;background:linear-gradient(180deg,#fff7ed 0%,#fef3c7 52%,#fff 100%)!important}
.employee-lottie-fallback span{position:absolute!important;top:-48px!important;width:46px!important;height:28px!important;border-radius:80% 0 80% 0!important;background:#f97316!important;box-shadow:0 10px 24px #92400e24!important;animation:employee-fallback-leaf 5.5s linear infinite!important;opacity:.88!important}
.employee-lottie-fallback span:nth-child(1){left:12%!important;animation-delay:-.4s!important;--dx:70px;--rot:420deg;background:#f97316!important}
.employee-lottie-fallback span:nth-child(2){left:32%!important;animation-delay:-1.7s!important;--dx:-42px;--rot:520deg;background:#dc2626!important;transform:scale(.78)!important}
.employee-lottie-fallback span:nth-child(3){left:53%!important;animation-delay:-2.8s!important;--dx:58px;--rot:460deg;background:#f59e0b!important;transform:scale(1.08)!important}
.employee-lottie-fallback span:nth-child(4){left:72%!important;animation-delay:-.9s!important;--dx:-66px;--rot:560deg;background:#b45309!important;transform:scale(.88)!important}
.employee-lottie-fallback span:nth-child(5){left:86%!important;animation-delay:-3.6s!important;--dx:-38px;--rot:500deg;background:#ef4444!important;transform:scale(.68)!important}
@keyframes employee-fallback-leaf{0%{translate:0 -40px;rotate:0deg;opacity:0}10%{opacity:.95}100%{translate:var(--dx,40px) 460px;rotate:var(--rot,480deg);opacity:.9}}
.employee-event-picture{min-height:300px!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:10px!important;padding:14px!important;text-align:center!important;background:transparent!important}
.employee-event-picture img{max-width:100%!important;max-height:240px!important;object-fit:contain!important;display:block!important;background:transparent!important}
.employee-event-picture strong{font-size:18px!important;line-height:1.2!important;color:#0f172a!important}
.employee-event-close{position:absolute!important;right:8px!important;top:8px!important;width:28px!important;height:28px!important;border-radius:999px!important;border:1px solid #dbe3ef!important;background:#fff!important;color:#64748b!important;z-index:3!important;cursor:pointer!important;display:grid!important;place-items:center!important;padding:0!important;line-height:0!important;font-size:0!important;text-align:center!important;box-shadow:0 6px 18px rgba(15,23,42,.14)!important}
.employee-event-close::before{content:"×";display:block!important;font-size:22px!important;line-height:1!important;transform:translateY(-1px)!important}
@media(max-width:1100px){.employee-detail-with-event{grid-template-columns:1fr!important}.employee-event{position:relative!important;top:auto!important;order:-1!important}.employee-lottie{height:240px!important}}
`) + `;
document.head.appendChild(employeeEventStyle);
try { Object.keys(localStorage).filter(key => key.startsWith("konglomeratEmployeeEventClosed:")).forEach(key => localStorage.removeItem(key)); } catch (error) {}
`;
  if (!result.includes('employeeEventStyle.textContent')) {
    result = result.replace('window.addEventListener("hashchange", handleRouteChange);', `window.addEventListener("hashchange", handleRouteChange);\n${style}`);
  }
  return result;
}

function patchProject2Html(source) {
  if (typeof source !== "string") return source;
  const match = source.match(/const PROJECT2_HTML_BASE64 = '([^']+)'/);
  if (!match) return source;

  let html;
  try {
    html = Buffer.from(match[1], "base64").toString("utf8");
  } catch (error) {
    return source;
  }

  html = html.replace(/<button id="navBoard"[^>]*data-nav="board"[^>]*>Доска проектов<\/button>/, "");
  html = html.replace(/(<button id="navProjects"[^>]*>)[^<]*(<\/button>)/, "$1Доска проектов$2");
  html = html.replaceAll("Доска проектов 2", "Доска проектов");
  html = html.replace(
    "let filters={search:'',status:'',priority:'',assignee:'',category:'',overdue:false,month:'2026-09'};",
    "let filters={search:'',status:'',priority:'',assignee:'',category:'',overdue:false,month:new Date().toISOString().slice(0,7)};"
  );
  html = html.replace(
    /let tasks=\[[\s\S]*?\];\s*let backlog=\[[\s\S]*?\];\s*function task/,
    "let tasks=[];\n    let backlog=[];\n    function task"
  );
  html = html.replace(
    "function render(){document.querySelectorAll('[data-nav]').forEach(btn=>btn.classList.toggle('active',btn.dataset.nav===section));root.innerHTML=section==='reports'?reportsView():section==='projects'?projectView():section==='marketing'?marketingView():section==='calendar'?calendarView():section==='board'?boardView():settingsView();initSeasonalLotties()}",
    "function render(){if(section==='board')section='projects';document.querySelectorAll('[data-nav]').forEach(btn=>btn.classList.toggle('active',btn.dataset.nav===section));root.innerHTML=section==='reports'?reportsView():section==='projects'?projectView():section==='marketing'?marketingView():section==='calendar'?calendarView():settingsView();initSeasonalLotties()}"
  );
  html = html.replace("function setSection(s){section=s;render()}", "function setSection(s){section=s==='board'?'projects':s;render()}");

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
  html = html.replace(
    "function mergeProject2States(base={},extra={}){const taskDeletes=Array.from(new Set([...(base.deletedTaskIds||[]),...(extra.deletedTaskIds||[])]));const backlogDeletes=Array.from(new Set([...(base.deletedBacklogIds||[]),...(extra.deletedBacklogIds||[])]));return{...base,...extra,people:Array.isArray(extra.people)&&extra.people.length?extra.people:base.people,categories:Array.isArray(extra.categories)&&extra.categories.length?extra.categories:base.categories,deletedTaskIds:taskDeletes,deletedBacklogIds:backlogDeletes,tasks:mergeProject2List(base.tasks,extra.tasks,taskDeletes),backlog:mergeProject2List(base.backlog,extra.backlog,backlogDeletes),filters:{...(base.filters||{}),...(extra.filters||{})},initialized:true,updatedAt:new Date().toISOString()}}",
    "function mergeProject2States(base={},extra={}){const currentTaskTotal=(Array.isArray(base.tasks)?base.tasks.length:0)+(Array.isArray(base.backlog)?base.backlog.length:0);const incomingTaskTotal=(Array.isArray(extra.tasks)?extra.tasks.length:0)+(Array.isArray(extra.backlog)?extra.backlog.length:0);const incomingDeleteTotal=(Array.isArray(extra.deletedTaskIds)?extra.deletedTaskIds.length:0)+(Array.isArray(extra.deletedBacklogIds)?extra.deletedBacklogIds.length:0);const ignoreTaskDeletes=currentTaskTotal>0&&incomingTaskTotal===0&&incomingDeleteTotal>0;const taskDeletes=ignoreTaskDeletes?(base.deletedTaskIds||[]):Array.from(new Set([...(base.deletedTaskIds||[]),...(extra.deletedTaskIds||[])]));const backlogDeletes=ignoreTaskDeletes?(base.deletedBacklogIds||[]):Array.from(new Set([...(base.deletedBacklogIds||[]),...(extra.deletedBacklogIds||[])]));return{...base,...extra,people:Array.isArray(extra.people)&&extra.people.length?extra.people:base.people,categories:Array.isArray(extra.categories)&&extra.categories.length?extra.categories:base.categories,deletedTaskIds:taskDeletes,deletedBacklogIds:backlogDeletes,tasks:mergeProject2List(base.tasks,extra.tasks,taskDeletes),backlog:mergeProject2List(base.backlog,extra.backlog,backlogDeletes),filters:{...(base.filters||{}),...(extra.filters||{})},initialized:true,updatedAt:new Date().toISOString()}}"
  );
  html = html.replace(
    "async function loadProject2State(){const localState=readLocalProject2State();applyProject2State(localState);try{const response=await fetch('/api/project2',{cache:'no-store'});if(!response.ok)return;const payload=await response.json();const shared=payload?.project2;if(project2HasContent(shared)){applyProject2State(shared);writeLocalProject2State(project2StateSnapshot());exportDoneTasksToEmployees();render();return}if(project2HasContent(localState)||tasks.length||backlog.length)saveProject2State(false)}catch(e){}}",
    "async function loadProject2State(){const localState=readLocalProject2State();try{const response=await fetch('/api/project2',{cache:'no-store'});if(response.ok){const payload=await response.json();const shared=payload?.project2;if(shared&&shared.initialized){const sharedItems=(Array.isArray(shared.tasks)?shared.tasks.length:0)+(Array.isArray(shared.backlog)?shared.backlog.length:0);const localItems=(Array.isArray(localState?.tasks)?localState.tasks.length:0)+(Array.isArray(localState?.backlog)?localState.backlog.length:0);if(sharedItems===0&&localItems>0){applyProject2State(localState);exportDoneTasksToEmployees();render();saveProject2State(false);return}applyProject2State(shared);writeLocalProject2State(project2StateSnapshot());exportDoneTasksToEmployees();render();return}}}catch(e){}if(project2HasContent(localState)){applyProject2State(localState);exportDoneTasksToEmployees();render();saveProject2State(false);}}"
  );
  html = html.replace(
    /function readLocalProject2State\(\)\{try\{return JSON\.parse\(localStorage\.getItem\(PROJECT2_STATE_KEY\)\|\|'\{\}'\)\}catch\(e\)\{return \{\}\}\}\s*function writeLocalProject2State\(state\)\{try\{localStorage\.setItem\(PROJECT2_STATE_KEY,JSON\.stringify\(state\)\)\}catch\(e\)\{\}\}\s*async function loadProject2State\(\)\{[\s\S]*?\}\s*function exportDoneTasksToEmployees/,
    "function readLocalProject2State(){return {}}\n    function writeLocalProject2State(state){}\n    async function loadProject2State(){try{const response=await fetch('/api/project2',{cache:'no-store'});if(response.ok){const payload=await response.json();const shared=payload?.project2;if(shared&&shared.initialized){applyProject2State(shared);exportDoneTasksToEmployees();render();return}}}catch(e){}render()}\n    function exportDoneTasksToEmployees"
  );
  html = html.replace(
    "function currentModalTask(){const arr=editSource==='tasks'?tasks:backlog;return arr.find(x=>x.id===editId)}function persistModalTask(){const t=currentModalTask();if(!t)return null;t.title=mTitle.value;t.status=mStatus.value;t.priority=mPriority.value;t.category=mCategory.value;t.assignee=mAssignee.value;t.start=mStart.value;t.due=mDue.value;t.description=mDesc.innerHTML;t.files=mFiles.value;t.attachments=readModalAttachments();t.comments=readModalComments();t.updatedAt=new Date().toISOString();t.createdAt=t.createdAt||t.updatedAt;persistProject2();dirty=false;return t}",
    "function modalField(id){return document.getElementById(id)}function currentModalTask(){const arr=editSource==='tasks'?tasks:backlog;return arr.find(x=>x.id===editId)}function removeUnsavedModalDraft(){const arr=editSource==='tasks'?tasks:backlog;const idx=arr.findIndex(x=>x.id===editId&&x._draftNew);if(idx>-1)arr.splice(idx,1)}function persistModalTask(){const t=currentModalTask();if(!t)return null;const titleEl=modalField('mTitle'),statusEl=modalField('mStatus'),priorityEl=modalField('mPriority'),categoryEl=modalField('mCategory'),assigneeEl=modalField('mAssignee'),startEl=modalField('mStart'),dueEl=modalField('mDue'),descEl=modalField('mDesc'),filesEl=modalField('mFiles');t.title=titleEl?.value||t.title||'Новая задача';t.status=statusEl?.value||t.status;t.priority=priorityEl?.value||t.priority;t.category=categoryEl?.value||t.category;t.assignee=assigneeEl?.value||'';t.start=startEl?.value||'';t.due=dueEl?.value||'';t.description=descEl?.innerHTML||'';t.files=filesEl?.value||'';t.attachments=readModalAttachments();t.comments=readModalComments();t.updatedAt=new Date().toISOString();t.createdAt=t.createdAt||t.updatedAt;t._localPending=true;delete t._draftNew;persistProject2();dirty=false;return t}"
  );
  html = html.replace(
    "function closeConfirm(){document.getElementById('confirm')?.remove()}function closeModal(){document.getElementById('backdrop')?.remove();dirty=false;editId=null}",
    "function closeConfirm(){document.getElementById('confirm')?.remove()}function closeModal(){removeUnsavedModalDraft?.();document.getElementById('backdrop')?.remove();dirty=false;editId=null}"
  );
  html = html.replace(
    "function dragModal(){const m=modal,h=modalHead;let sx=0,sy=0,l=0,t=0,d=false;",
    "function dragModal(){const m=document.getElementById('modal'),h=document.getElementById('modalHead');if(!m||!h)return;let sx=0,sy=0,l=0,t=0,d=false;"
  );
  html = html.replace(
    "async function saveProject2State(showMessage){try{const state=project2StateSnapshot();writeLocalProject2State(state);exportDoneTasksToEmployees();clearTimeout(project2SaveTimer);project2SaveTimer=setTimeout(()=>saveProject2ToServer(state,showMessage),showMessage?0:250);if(showMessage)alert('Сохранено');}catch(e){alert('Не удалось сохранить. Проверьте доступ к памяти браузера.')}}",
    "async function saveProject2State(showMessage){const state=project2StateSnapshot();if(project2ItemCount(state)===0&&project2DeleteCount(state)===0){if(showMessage)alert('Нет задач для сохранения');return}try{writeLocalProject2State(state)}catch(e){}try{exportDoneTasksToEmployees()}catch(e){}clearTimeout(project2SaveTimer);if(showMessage){const ok=await saveProject2ToServer(state,true);if(ok)alert('Сохранено');return}project2SaveTimer=setTimeout(()=>saveProject2ToServer(state,false),250)}"
  );
  html = html.replace(
    "async function saveProject2State(showMessage){try{const state=project2StateSnapshot();if(project2ItemCount(state)===0&&project2DeleteCount(state)===0){if(showMessage)alert('Нет задач для сохранения');return}writeLocalProject2State(state);exportDoneTasksToEmployees();clearTimeout(project2SaveTimer);project2SaveTimer=setTimeout(()=>saveProject2ToServer(state,showMessage),showMessage?0:250);if(showMessage)alert('Сохранено');}catch(e){alert('Не удалось сохранить. Проверьте доступ к памяти браузера.')}}",
    "async function saveProject2State(showMessage){const state=project2StateSnapshot();if(project2ItemCount(state)===0&&project2DeleteCount(state)===0){if(showMessage)alert('Нет задач для сохранения');return}try{writeLocalProject2State(state)}catch(e){}try{exportDoneTasksToEmployees()}catch(e){}clearTimeout(project2SaveTimer);if(showMessage){const ok=await saveProject2ToServer(state,true);if(ok)alert('Сохранено');return}project2SaveTimer=setTimeout(()=>saveProject2ToServer(state,false),250)}"
  );
  html = html.replace(
    "async function saveProject2ToServer(state,showErrors=false){try{const response=await fetch('/api/project2',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({project2:state})});if(!response.ok&&showErrors)alert('Не удалось сохранить общую доску на сервер')}catch(e){if(showErrors)alert('Не удалось сохранить общую доску на сервер')}}",
    "async function saveProject2ToServer(state,showErrors=false){try{const response=await fetch('/api/project2',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({project2:state})});if(!response.ok){if(showErrors)alert('Не удалось сохранить общую доску на сервер');return false}const payload=await response.json().catch(()=>({}));const shared=payload?.project2;if(shared&&shared.initialized){applyProject2State(shared);writeLocalProject2State(project2StateSnapshot());exportDoneTasksToEmployees();render()}return true}catch(e){if(showErrors)alert('Не удалось сохранить общую доску на сервер');return false}}"
  );
  html = html.replace(
    "function saveModal(closeAfter=true){const t=currentModalTask();if(!t)return;const oldAssignee=t.assignee;persistModalTask();if(t.assignee&&t.assignee!==oldAssignee)sendTelegram(t.assignee,`Вам назначена задача #${t.number}: ${t.title}`);if(closeAfter){closeModal();render()}}",
    "async function saveModal(closeAfter=true){const t=currentModalTask();if(!t)return;const oldAssignee=t.assignee;persistModalTask();const ok=await saveProject2ToServer(project2StateSnapshot(),true);if(!ok)return;if(t.assignee&&t.assignee!==oldAssignee)sendTelegram(t.assignee,`Вам назначена задача #${t.number}: ${t.title}`);if(closeAfter){closeModal();render()}}"
  );
  if (!html.includes("function saveProject2PeopleDraft()")) {
    html = html.replace(
      "function persistProject2(){saveProject2State(false)}",
      "function saveProject2PeopleDraft(){const state=project2StateSnapshot();try{writeLocalProject2State(state)}catch(e){}try{exportDoneTasksToEmployees()}catch(e){}clearTimeout(project2SaveTimer);project2SaveTimer=setTimeout(()=>{fetch('/api/project2',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({project2:state})}).catch(()=>{})},500)}function persistProject2(){saveProject2State(false)}"
    );
  }
  html = html.replace(
    /function saveProject2PeopleDraft\(\)\{const state=project2StateSnapshot\(\);try\{writeLocalProject2State\(state\)\}catch\(e\)\{\}try\{exportDoneTasksToEmployees\(\)\}catch\(e\)\{\}clearTimeout\(project2SaveTimer\);project2SaveTimer=setTimeout\(\(\)=>\{fetch\('\/api\/project2',\{method:'PUT',headers:\{'Content-Type':'application\/json'\},body:JSON\.stringify\(\{project2:state\}\)\}\)\.catch\(\(\)=>\{\}\)\},500\)\}/,
    "function saveProject2PeopleDraft(){const state=project2StateSnapshot();try{exportDoneTasksToEmployees()}catch(e){}clearTimeout(project2SaveTimer);project2SaveTimer=setTimeout(()=>{saveProject2ToServer(state,false)},500)}"
  );
  html = html.replace(
    "async function refreshProject2FromServer(){if(document.getElementById('backdrop'))return;try{const response=await fetch('/api/project2',{cache:'no-store'});if(!response.ok)return;const payload=await response.json();const shared=payload?.project2;if(project2HasContent(shared)){applyProject2State(shared);writeLocalProject2State(project2StateSnapshot());exportDoneTasksToEmployees();render()}}catch(e){}}",
    "function project2InputHasFocus(){const el=document.activeElement;return Boolean(el&&['INPUT','TEXTAREA','SELECT'].includes(el.tagName))}async function refreshProject2FromServer(){if(document.getElementById('backdrop')||project2InputHasFocus())return;try{const response=await fetch('/api/project2',{cache:'no-store'});if(!response.ok)return;const payload=await response.json();const shared=payload?.project2;if(shared&&shared.initialized){applyProject2State(shared);exportDoneTasksToEmployees();render()}}catch(e){}}"
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
  html = html.replace(
    "function newTask(){const id='t'+Date.now();const d=visibleNewTaskDefaults();const item=task(id,nextTaskNumber(),'Новая задача',d.status,d.priority,d.assignee,'',d.category);item.start=d.start;item.due=d.due;tasks.push(item);persistProject2();render();setTimeout(()=>openTask(id,'tasks'),0)}function newBacklog(){const id='b'+Date.now();const d=visibleNewTaskDefaults();const item=task(id,nextTaskNumber(),'Новая задача',d.status,d.priority,d.assignee,'',d.category);item.start=d.start;item.due=d.due;backlog.push(item);persistProject2();render();setTimeout(()=>openTask(id,'backlog'),0)}",
    "function newTask(){const id='t'+Date.now();const d=visibleNewTaskDefaults();const item=task(id,nextTaskNumber(),'Новая задача',d.status,d.priority,d.assignee,'',d.category);item.start=d.start;item.due=d.due;item._draftNew=true;tasks.push(item);openTask(id,'tasks')}function newBacklog(){const id='b'+Date.now();const d=visibleNewTaskDefaults();const item=task(id,nextTaskNumber(),'Новая задача',d.status,d.priority,d.assignee,'',d.category);item.start=d.start;item.due=d.due;item._draftNew=true;backlog.push(item);openTask(id,'backlog')}"
  );
  if (!html.includes("let deletedPersonNames=[]")) {
    html = html.replace("let deletedTaskIds=[];let deletedBacklogIds=[];", "let deletedTaskIds=[];let deletedBacklogIds=[];let deletedPersonNames=[];");
  }
  html = html.replace(
    "function project2StateSnapshot(){return{people,categories,tasks,backlog,filters,deletedTaskIds,deletedBacklogIds,initialized:true,updatedAt:new Date().toISOString()}}",
    "function project2StateSnapshot(){return{people,categories,tasks,backlog,filters,deletedTaskIds,deletedBacklogIds,deletedPersonNames,initialized:true,updatedAt:new Date().toISOString()}}"
  );
  html = html.replace(
    "function applyProject2State(value){const saved=normalizeProject2State(value);if(saved.filters&&typeof saved.filters==='object')filters={...filters,...saved.filters};if(Array.isArray(saved.people)){people.splice(0,people.length,...saved.people.map((p,i)=>({...people[i],...p})));}if(Array.isArray(saved.categories)&&saved.categories.length){categories.splice(0,categories.length,...saved.categories);}",
    "function project2PersonName(value){return String(typeof value==='object'?value?.name:value||'').trim().toLowerCase()}function project2PersonKey(value){const draftId=String(value?._draftId||value?.id||'').trim().toLowerCase();if(draftId)return draftId;const telegram=String(value?.telegram||'').trim().toLowerCase();return telegram||project2PersonName(value)}function applyProject2State(value){const saved=normalizeProject2State(value);if(saved.filters&&typeof saved.filters==='object')filters={...filters,...saved.filters};if(Array.isArray(saved.deletedPersonNames))deletedPersonNames=Array.from(new Set(saved.deletedPersonNames.map(project2PersonName).filter(Boolean))).slice(-1000);if(Array.isArray(saved.people)){const deleted=new Set(deletedPersonNames);const nextMap=new Map();saved.people.forEach((p,i)=>{const key=project2PersonKey(p)||`saved-${i}`;if(!deleted.has(project2PersonName(p)))nextMap.set(key,{...people[i],...p})});people.filter(p=>p&&p._draft).forEach(p=>{let key=project2PersonKey(p);const name=project2PersonName(p);if(!key||deleted.has(name))return;if(!nextMap.has(key)&&name){const sameName=[...nextMap.entries()].find(([,item])=>project2PersonName(item)===name);if(sameName)key=sameName[0]}const index=Number(p._draftIndex);if(!nextMap.has(key)&&Number.isInteger(index)&&index>=0&&index<saved.people.length){const currentKey=project2PersonKey(saved.people[index]);if(currentKey&&!deleted.has(project2PersonName(saved.people[index])))key=currentKey}nextMap.set(key,{...(nextMap.get(key)||{}),...p})});people.splice(0,people.length,...Array.from(nextMap.values()));}if(Array.isArray(saved.categories)&&saved.categories.length){categories.splice(0,categories.length,...saved.categories);}"
  );
  html = html.replace(
    "if(Array.isArray(saved.tasks)){tasks.splice(0,tasks.length,...saved.tasks.filter(t=>!deletedTaskIds.includes(String(t.id||''))).map(normalizeProject2Task));}if(Array.isArray(saved.backlog)){backlog.splice(0,backlog.length,...saved.backlog.filter(t=>!deletedBacklogIds.includes(String(t.id||''))).map(normalizeProject2Task));}",
    "if(Array.isArray(saved.tasks)){const draftTasks=tasks.filter(t=>t&&(t._draftNew||t._localPending));const deletedTaskSet=new Set(deletedTaskIds);const nextTasks=saved.tasks.filter(t=>!project2DeleteKeys(t).some(key=>deletedTaskSet.has(key))).map(normalizeProject2Task);draftTasks.forEach(draft=>{if(!nextTasks.some(t=>t.id===draft.id))nextTasks.push(draft)});tasks.splice(0,tasks.length,...nextTasks);}if(Array.isArray(saved.backlog)){const draftBacklog=backlog.filter(t=>t&&(t._draftNew||t._localPending));const deletedBacklogSet=new Set(deletedBacklogIds);const nextBacklog=saved.backlog.filter(t=>!project2DeleteKeys(t).some(key=>deletedBacklogSet.has(key))).map(normalizeProject2Task);draftBacklog.forEach(draft=>{if(!nextBacklog.some(t=>t.id===draft.id))nextBacklog.push(draft)});backlog.splice(0,backlog.length,...nextBacklog);}"
  );
  html = html.replace(
    "function rememberProject2Delete(id,source){if(!id)return;if(source==='backlog')deletedBacklogIds=Array.from(new Set([...deletedBacklogIds,String(id)])).slice(-1000);else deletedTaskIds=Array.from(new Set([...deletedTaskIds,String(id)])).slice(-1000)}function deleteCurrentTask(){if(confirm('Удалить эту задачу?')){const arr=editSource==='tasks'?tasks:backlog;const idx=arr.findIndex(t=>t.id===editId);if(idx>-1){rememberProject2Delete(editId,editSource);arr.splice(idx,1)}persistProject2();closeModal();render()}}function deleteTaskFromCard(event,id,source){event?.stopPropagation?.();if(!confirm('Удалить эту задачу?'))return;const arr=source==='backlog'?backlog:tasks;const idx=arr.findIndex(t=>t.id===id);if(idx>-1){rememberProject2Delete(id,source);arr.splice(idx,1);persistProject2();render()}}",
    "function project2DeleteKeys(itemOrId){const item=typeof itemOrId==='object'?itemOrId:null;const keys=item?[item.id,item.number]:[itemOrId];if(item&&!item.id&&!item.number)keys.push(item.title);return Array.from(new Set(keys.map(value=>String(value||'')).filter(Boolean)))}function rememberProject2Delete(itemOrId,source){const keys=project2DeleteKeys(itemOrId);if(!keys.length)return;if(source==='backlog')deletedBacklogIds=Array.from(new Set([...deletedBacklogIds,...keys])).slice(-1000);else deletedTaskIds=Array.from(new Set([...deletedTaskIds,...keys])).slice(-1000)}function deleteCurrentTask(){if(confirm('Удалить эту задачу?')){const arr=editSource==='tasks'?tasks:backlog;const idx=arr.findIndex(t=>t.id===editId);if(idx>-1){rememberProject2Delete(arr[idx],editSource);arr.splice(idx,1)}persistProject2();closeModal();render()}}function deleteTaskFromCard(event,id,source){event?.stopPropagation?.();if(!confirm('Удалить эту задачу?'))return;const arr=source==='backlog'?backlog:tasks;const idx=arr.findIndex(t=>t.id===id);if(idx>-1){rememberProject2Delete(arr[idx],source);arr.splice(idx,1);persistProject2();render()}}"
  );
  html = html.replace(
    "function deleteReportTask(id){if(confirm('Удалить эту задачу?')){const i=tasks.findIndex(t=>t.id===id);if(i>-1)tasks.splice(i,1);persistProject2();render()}}",
    "function deleteReportTask(id){if(confirm('Удалить эту задачу?')){const i=tasks.findIndex(t=>t.id===id);if(i>-1){rememberProject2Delete(tasks[i],'tasks');tasks.splice(i,1)}persistProject2();render()}}"
  );
  html = html.replace(
    "function addPerson(){people.push({name:'Новый исполнитель',telegram:''});render()}function updatePerson(i,name){const old=people[i].name;people[i].name=name;if(reportEmployee===old)reportEmployee=name;tasks.forEach(t=>{if(t.assignee===old)t.assignee=name});backlog.forEach(t=>{if(t.assignee===old)t.assignee=name})}function updateTelegram(i,value){people[i].telegram=value}function deletePerson(i){if(confirm('Удалить пользователя навсегда?')){const old=people[i].name;people.splice(i,1);tasks.forEach(t=>{if(t.assignee===old)t.assignee=''});backlog.forEach(t=>{if(t.assignee===old)t.assignee=''});if(reportEmployee===old)reportEmployee=people[0]?.name||'';render()}}",
    "function addPerson(){const base='Новый исполнитель';let n=people.length+1;let name=base;const used=()=>people.some(p=>String(p?.name||'')===name)||deletedPersonNames.includes(name);while(used()){name=`${base} ${n++}`}deletedPersonNames=deletedPersonNames.filter(item=>item!==name);people.push({name,telegram:'',_draft:true,_draftId:`draft-${Date.now()}-${Math.random().toString(36).slice(2)}`,_draftIndex:people.length});saveProject2PeopleDraft();render()}function updatePerson(i,name){const person=people[i];if(!person)return;const old=person.name;person.name=name;person._draft=true;person._draftIndex=i;person._draftId=person._draftId||`draft-${Date.now()}-${Math.random().toString(36).slice(2)}`;deletedPersonNames=deletedPersonNames.filter(item=>item!==name);if(reportEmployee===old)reportEmployee=name;tasks.forEach(t=>{if(t.assignee===old){t.assignee=name;touchProject2Item(t)}});backlog.forEach(t=>{if(t.assignee===old){t.assignee=name;touchProject2Item(t)}});saveProject2PeopleDraft()}function updateTelegram(i,value){const person=people[i];if(!person)return;person.telegram=value;person._draft=true;person._draftIndex=i;person._draftId=person._draftId||`draft-${Date.now()}-${Math.random().toString(36).slice(2)}`;saveProject2PeopleDraft()}function deletePerson(i){if(confirm('Удалить пользователя навсегда?')){const old=people[i].name;deletedPersonNames=Array.from(new Set([...deletedPersonNames,old])).slice(-1000);people.splice(i,1);tasks.forEach(t=>{if(t.assignee===old){t.assignee='';touchProject2Item(t)}});backlog.forEach(t=>{if(t.assignee===old){t.assignee='';touchProject2Item(t)}});if(reportEmployee===old)reportEmployee=people[0]?.name||'';persistProject2();render()}}"
  );

  html = stripProject2StartupAutosave(html);
  return source.replace(match[1], Buffer.from(html, "utf8").toString("base64"));
}

function patchAppScript(source) {
  return patchEmployeeEvents(patchProject2Html(patchOuterAppScript(source)));
}

function patchLocalOuterAppScript(source) {
  return patchEmployeeEvents(source
    .replace(/\{ id: "board", label: "Доска проектов", icon: "board" \}/g, '{ id: "project2", label: "Доска проектов", icon: "board" }')
    .replace(/activeSection === "board"/g, 'activeSection === "project2"')
    .replace(/section\.id === "board"/g, 'section.id === "project2"')
    .replace(/\$\{!isPublicView && activeSection === "project2" \? renderBoardCategorySidebar\(\) : ""\}/g, "")
    .replace(/\$\{section\.id === "project2" \? renderBoardToolbar\(\) : ""\}/g, "")
    .replace(/if \(sectionId === "settings"\) return "";/g, 'if (sectionId === "settings" || sectionId === "project2") return "";')
    .replace(/if \(sectionId === "board"\) return renderBoard\(\);/, 'if (sectionId === "project2") return renderProject2Embed();\n  if (sectionId === "board") return renderBoard();')
    .replace(/function renderBoard\(\) \{/, 'function renderProject2Embed() {\n  return `<section class="project2-embed" style="margin:0;padding:0;width:100%;height:calc(100vh - 100px);min-height:780px;overflow:visible"><iframe class="project2-frame" title="Доска проектов" src="/project2.html?v=server-truth-20261007" style="display:block;width:100%;height:100%;min-height:780px;border:0;background:#f6f8fb"></iframe></section>`;\n}\n\nfunction renderBoard() {')
    .replace(/const fromUrl = readViewStateParam\("section"\);\n    if \(SECTIONS\.some\(item => item\.id === fromUrl\)\) return fromUrl;/, 'const fromUrl = readViewStateParam("section");\n    if (fromUrl === "board") return "project2";\n    if (SECTIONS.some(item => item.id === fromUrl)) return fromUrl;')
    .replace(/return SECTIONS\.some\(item => item\.id === stored\) \? stored : "roadmap";/, 'return stored === "board" ? "project2" : SECTIONS.some(item => item.id === stored) ? stored : "roadmap";')
  );
}

function sendContent(req, res, body, contentType, cacheControl = "private, max-age=60") {
  const accepts = String(req.headers["accept-encoding"] || "");
  const buffer = Buffer.isBuffer(body) ? body : Buffer.from(String(body), "utf8");
  if (accepts.includes("br")) {
    const encoded = zlib.brotliCompressSync(buffer, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 } });
    res.writeHead(200, { "Content-Type": contentType, "Content-Encoding": "br", "Cache-Control": cacheControl, "Vary": "Accept-Encoding" });
    res.end(encoded);
    return;
  }
  if (accepts.includes("gzip")) {
    const encoded = zlib.gzipSync(buffer, { level: 6 });
    res.writeHead(200, { "Content-Type": contentType, "Content-Encoding": "gzip", "Cache-Control": cacheControl, "Vary": "Accept-Encoding" });
    res.end(encoded);
    return;
  }
  res.writeHead(200, { "Content-Type": contentType, "Cache-Control": cacheControl, "Vary": "Accept-Encoding" });
  res.end(buffer);
}

function fetchOuterAppScript() {
  if (outerAppScriptCache) return outerAppScriptCache;
  const appPath = path.join(__dirname, "public", "app.js");
  outerAppScriptCache = patchLocalOuterAppScript(fs.readFileSync(appPath, "utf8"));
  return outerAppScriptCache;
}

async function fetchProject2Html() {
  if (project2HtmlCache) return project2HtmlCache;
  const script = readAppScriptDiskCache() || await fetchWorkingAppScript();
  const match = script.match(/const PROJECT2_HTML_BASE64 = '([^']+)'/);
  if (!match) throw new Error("Доска проектов не найдена");
  project2HtmlCache = stripProject2StartupAutosave(Buffer.from(match[1], "base64").toString("utf8"))
    .replace(
      "</style>",
      `.app{display:block!important;min-height:100vh!important}
.sidebar{display:none!important}
.content{padding:26px!important;width:100%!important;max-width:none!important;box-sizing:border-box!important}
.board{grid-template-columns:repeat(5,minmax(0,1fr))!important;overflow-x:hidden!important;width:100%!important;box-sizing:border-box!important}
.col{min-width:0!important;min-height:430px!important}
.filters{display:grid!important;grid-template-columns:minmax(180px,1fr) repeat(4,minmax(130px,170px)) auto!important;gap:10px!important;overflow:hidden!important}
.card{min-width:0!important}
.meta{gap:4px!important}
.card button{padding:8px 9px!important}
html,body{overflow-x:hidden!important;background:#fff!important}
.content{background:#fff!important}</style>`
    );
  return project2HtmlCache;
}

function eventAssetContentType(assetPath) {
  const value = String(assetPath || "").toLowerCase();
  if (value.endsWith(".json")) return "application/json; charset=utf-8";
  if (value.endsWith(".png")) return "image/png";
  if (value.endsWith(".webp")) return "image/webp";
  return "application/octet-stream";
}

async function fetchWorkingAppScript() {
  const now = Date.now();
  if (appScriptCache && now - appScriptCacheAt < APP_SCRIPT_CACHE_MS) return appScriptCache;
  const diskCache = readAppScriptDiskCache();
  if (diskCache) {
    if (!appScriptFetchPromise) appScriptFetchPromise = refreshWorkingAppScript().catch(() => diskCache).finally(() => { appScriptFetchPromise = null; });
    return diskCache;
  }
  if (appScriptFetchPromise) return appScriptFetchPromise;
  appScriptFetchPromise = refreshWorkingAppScript();
  try {
    return await appScriptFetchPromise;
  } finally {
    appScriptFetchPromise = null;
  }
}

async function refreshWorkingAppScript() {
  const response = await fetch(WORKING_APP_URL, { cache: "no-store" });
  if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
  const patched = patchAppScript(await response.text());
  appScriptCache = patched;
  appScriptCacheAt = Date.now();
  writeAppScriptDiskCache(patched);
  return patched;
}

async function serveEventAsset(pathname, res) {
  const assetName = decodeURIComponent(pathname.slice("/event-assets/".length));
  if (!/^[a-zA-Z0-9._ -]+$/.test(assetName)) {
    res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" });
    res.end("Bad asset path");
    return;
  }
  const localAssetPath = path.join(__dirname, "public", "event-assets", assetName);
  if (fs.existsSync(localAssetPath) && fs.statSync(localAssetPath).isFile()) {
    res.writeHead(200, { "Content-Type": eventAssetContentType(assetName), "Cache-Control": "public, max-age=300" });
    res.end(fs.readFileSync(localAssetPath));
    return;
  }
  const response = await fetch(EVENT_ASSET_BASE_URL + encodeURIComponent(assetName).replace(/%20/g, "%20"), { cache: "no-store" });
  if (!response.ok) {
    res.writeHead(response.status, { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" });
    res.end("Asset not found");
    return;
  }
  const body = Buffer.from(await response.arrayBuffer());
  res.writeHead(200, { "Content-Type": eventAssetContentType(assetName), "Cache-Control": "public, max-age=300" });
  res.end(body);
}

http.createServer = function createRouteFixedServer(listener) {
  return originalCreateServer(async (req, res) => {
    const pathname = new URL(req.url || "/", "http://localhost").pathname;
    if (req.method === "GET" && pathname === "/app.js") {
      try {
        sendContent(req, res, fetchOuterAppScript(), "application/javascript; charset=utf-8", "no-store");
      } catch (error) {
        res.writeHead(502, { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" });
        res.end(`Не удалось загрузить новый интерфейс: ${error.message}`);
      }
      return;
    }

    if (req.method === "GET" && pathname === "/project2.html") {
      try {
        sendContent(req, res, await fetchProject2Html(), "text/html; charset=utf-8", "no-store");
      } catch (error) {
        res.writeHead(502, { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" });
        res.end(`Не удалось загрузить доску проектов: ${error.message}`);
      }
      return;
    }

    if (req.method === "GET" && pathname.startsWith("/event-assets/")) {
      try {
        await serveEventAsset(pathname, res);
      } catch (error) {
        res.writeHead(502, { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" });
        res.end(`Не удалось загрузить анимацию: ${error.message}`);
      }
      return;
    }

    if (typeof listener === "function") return listener(req, res);
    res.statusCode = 404;
    res.end("Not found");
  });
};

fetchWorkingAppScript().catch(() => {});
require("./server-hotfix.js");
