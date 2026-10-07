const http = require("http");

const WORKING_BRANCH = "fix-report-save-symbols-20260903";
const WORKING_APP_URL = `https://raw.githubusercontent.com/ludmila123456789k-cmd/dashboards2/${WORKING_BRANCH}/public/app.js`;
const EVENT_ASSET_BASE_URL = `https://raw.githubusercontent.com/ludmila123456789k-cmd/dashboards2/${WORKING_BRANCH}/public/event-assets/`;
const originalCreateServer = http.createServer.bind(http);

function patchOuterAppScript(source) {
  return source
    .replace(/\{ id: "project2", label: "Доска проектов 2", icon: "board" \}/g, '{ id: "project2", label: "Доска проектов", icon: "board" }')
    .replace(/title="Доска проектов 2"/g, 'title="Доска проектов"')
    .replace(/<section class="project2-embed">\s*<iframe class="project2-frame" title="Доска проектов"><\/iframe>\s*<\/section>/g, '<section class="project2-embed" style="margin:0;padding:0;width:100%;height:calc(100vh - 100px);min-height:780px;overflow:visible"><iframe class="project2-frame" title="Доска проектов" style="display:block;width:100%;height:100%;min-height:780px;border:0;background:#f6f8fb"></iframe></section>')
    .replace(/const section = SECTIONS\.find\(item => item\.id === activeSection\) \|\| SECTIONS\[0\];/, 'if (activeSection === "board") activeSection = "project2";\n  const section = SECTIONS.find(item => item.id === activeSection) || SECTIONS[0];')
    .replace(/function navigateToSection\(sectionId\) \{\n  if \(!SECTIONS\.some\(item => item\.id === sectionId\)\) return;/, 'function navigateToSection(sectionId) {\n  if (sectionId === "board") sectionId = "project2";\n  if (!SECTIONS.some(item => item.id === sectionId)) return;')
    .replace(/const fromUrl = readViewStateParam\("section"\);\n    if \(SECTIONS\.some\(item => item\.id === fromUrl\)\) return fromUrl;/, 'const fromUrl = readViewStateParam("section");\n    if (fromUrl === "board" && SECTIONS.some(item => item.id === "project2")) return "project2";\n    if (SECTIONS.some(item => item.id === fromUrl)) return fromUrl;')
    .replace(/return SECTIONS\.some\(item => item\.id === stored\) \? stored : "roadmap";/, 'return stored === "board" && SECTIONS.some(item => item.id === "project2") ? "project2" : SECTIONS.some(item => item.id === stored) ? stored : "roadmap";')
    .replace(/localStorage\.setItem\(ACTIVE_SECTION_KEY, activeSection\);/g, 'localStorage.setItem(ACTIVE_SECTION_KEY, activeSection === "board" ? "project2" : activeSection);')
    .replace(/localStorage\.setItem\(ACTIVE_SECTION_KEY, sectionId\);/g, 'localStorage.setItem(ACTIVE_SECTION_KEY, sectionId === "board" ? "project2" : sectionId);');
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
    'function renderBirthdayEvent(birthday, day, type) {\n  return `<aside class="employee-event employee-event-birthday">${employeeEventCloseButton(day, type)}<div class="employee-event-picture"><img src="/event-assets/${escapeAttribute(birthday.image)}" alt="${escapeAttribute(birthday.text)}"><strong>${escapeHtml(birthday.text)}</strong></div></aside>`;\n}'
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
    "async function loadProject2State(){const localState=readLocalProject2State();applyProject2State(localState);try{const response=await fetch('/api/project2',{cache:'no-store'});if(!response.ok)return;const payload=await response.json();const shared=payload?.project2;if(project2HasContent(shared)){applyProject2State(shared);writeLocalProject2State(project2StateSnapshot());exportDoneTasksToEmployees();render();return}if(project2HasContent(localState)||tasks.length||backlog.length)saveProject2State(false)}catch(e){}}",
    "async function loadProject2State(){try{const response=await fetch('/api/project2',{cache:'no-store'});if(response.ok){const payload=await response.json();const shared=payload?.project2;if(shared&&shared.initialized){applyProject2State(shared);writeLocalProject2State(project2StateSnapshot());exportDoneTasksToEmployees();render();return}}}catch(e){}const localState=readLocalProject2State();if(project2HasContent(localState)){applyProject2State(localState);exportDoneTasksToEmployees();render();}}"
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
  if (!html.includes("function saveProject2PeopleDraft()")) {
    html = html.replace(
      "function persistProject2(){saveProject2State(false)}",
      "function saveProject2PeopleDraft(){const state=project2StateSnapshot();try{writeLocalProject2State(state)}catch(e){}try{exportDoneTasksToEmployees()}catch(e){}clearTimeout(project2SaveTimer);project2SaveTimer=setTimeout(()=>{fetch('/api/project2',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({project2:state})}).catch(()=>{})},500)}function persistProject2(){saveProject2State(false)}"
    );
  }
  html = html.replace(
    "async function refreshProject2FromServer(){if(document.getElementById('backdrop'))return;try{const response=await fetch('/api/project2',{cache:'no-store'});if(!response.ok)return;const payload=await response.json();const shared=payload?.project2;if(project2HasContent(shared)){applyProject2State(shared);writeLocalProject2State(project2StateSnapshot());exportDoneTasksToEmployees();render()}}catch(e){}}",
    "function project2InputHasFocus(){const el=document.activeElement;return Boolean(el&&['INPUT','TEXTAREA','SELECT'].includes(el.tagName))}async function refreshProject2FromServer(){if(document.getElementById('backdrop')||project2InputHasFocus())return;try{const response=await fetch('/api/project2',{cache:'no-store'});if(!response.ok)return;const payload=await response.json();const shared=payload?.project2;if(project2HasContent(shared)){applyProject2State(shared);writeLocalProject2State(project2StateSnapshot());exportDoneTasksToEmployees();render()}}catch(e){}}"
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
    "if(Array.isArray(saved.tasks)){const deletedTaskSet=new Set(deletedTaskIds);tasks.splice(0,tasks.length,...saved.tasks.filter(t=>!project2DeleteKeys(t).some(key=>deletedTaskSet.has(key))).map(normalizeProject2Task));}if(Array.isArray(saved.backlog)){const deletedBacklogSet=new Set(deletedBacklogIds);backlog.splice(0,backlog.length,...saved.backlog.filter(t=>!project2DeleteKeys(t).some(key=>deletedBacklogSet.has(key))).map(normalizeProject2Task));}"
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

  return source.replace(match[1], Buffer.from(html, "utf8").toString("base64"));
}

function patchAppScript(source) {
  return patchEmployeeEvents(patchProject2Html(patchOuterAppScript(source)));
}

function eventAssetContentType(assetPath) {
  const value = String(assetPath || "").toLowerCase();
  if (value.endsWith(".json")) return "application/json; charset=utf-8";
  if (value.endsWith(".png")) return "image/png";
  if (value.endsWith(".webp")) return "image/webp";
  return "application/octet-stream";
}

async function fetchWorkingAppScript() {
  const response = await fetch(WORKING_APP_URL, { cache: "no-store" });
  if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
  return patchAppScript(await response.text());
}

async function serveEventAsset(pathname, res) {
  const assetName = decodeURIComponent(pathname.slice("/event-assets/".length));
  if (!/^[a-zA-Z0-9._ -]+$/.test(assetName)) {
    res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" });
    res.end("Bad asset path");
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
        const script = await fetchWorkingAppScript();
        res.writeHead(200, {
          "Content-Type": "application/javascript; charset=utf-8",
          "Cache-Control": "no-store, no-cache, must-revalidate"
        });
        res.end(script);
      } catch (error) {
        res.writeHead(502, { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" });
        res.end(`Не удалось загрузить новый интерфейс: ${error.message}`);
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

require("./server-hotfix.js");
