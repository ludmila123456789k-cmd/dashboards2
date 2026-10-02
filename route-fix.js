const http = require("http");

const WORKING_APP_URL = "https://raw.githubusercontent.com/ludmila123456789k-cmd/dashboards2/fix-report-save-symbols-20260903/public/app.js";
const originalCreateServer = http.createServer.bind(http);

function patchOuterAppScript(source) {
  return source
    .replace(/\{ id: "project2", label: "Доска проектов 2", icon: "board" \}/g, '{ id: "project2", label: "Доска проектов", icon: "board" }')
    .replace(/title="Доска проектов 2"/g, 'title="Доска проектов"')
    .replace(/<section class="project2-embed">\s*<iframe class="project2-frame" title="Доска проектов"><\/iframe>\s*<\/section>/g, '<section class="project2-embed" style="margin:0;padding:0;width:100%;height:calc(100vh - 100px);min-height:780px;overflow:visible"><iframe class="project2-frame" title="Доска проектов" style="display:block;width:100%;height:100%;min-height:780px;border:0;background:#f6f8fb"></iframe></section>')
    .replace(/const section = SECTIONS\.find\(item => item\.id === activeSection\) \|\| SECTIONS\[0\];/, 'if (activeSection === "board") activeSection = "project2";\n  const section = SECTIONS.find(item => item.id === activeSection) || SECTIONS[0];')
    .replace(/localStorage\.setItem\(ACTIVE_SECTION_KEY, activeSection\);/g, 'localStorage.setItem(ACTIVE_SECTION_KEY, activeSection === "board" ? "project2" : activeSection);');
}

function patchEmployeeEvents(source) {
  let result = source;
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
    'function renderLottieEvent(kind, label, day, fileName) {\n  return `<aside class="employee-event employee-event-${kind}">${employeeEventCloseButton(day, kind)}<div class="employee-lottie" data-lottie-src="/event-assets/${escapeAttribute(fileName)}" aria-label="${escapeAttribute(label)}"></div><div class="employee-lottie-caption">${escapeHtml(label)}</div></aside>`;\n}'
  );
  const style = `
const employeeEventStyle = document.createElement("style");
employeeEventStyle.textContent = ` + JSON.stringify(`
.employee-detail-with-event{display:grid!important;grid-template-columns:minmax(0,1fr) 300px!important;gap:16px!important;align-items:start!important;overflow:visible!important}
.employee-main-column{min-width:0!important}
.employee-event{position:sticky!important;top:18px!important;display:block!important;min-height:300px!important;border:1px solid #dbe3ef!important;border-radius:14px!important;background:#fff!important;box-shadow:0 14px 32px rgba(15,23,42,.08)!important;overflow:hidden!important;z-index:2!important}
.employee-lottie{width:100%!important;height:300px!important;background:#fff!important}
.employee-lottie svg{width:100%!important;height:100%!important;display:block!important}
.employee-lottie-caption{position:absolute!important;left:12px!important;right:12px!important;bottom:12px!important;padding:8px 10px!important;border-radius:999px!important;background:rgba(255,255,255,.86)!important;font-weight:800!important;text-align:center!important;color:#0f172a!important}
.employee-event-picture{min-height:300px!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:10px!important;padding:14px!important;text-align:center!important}
.employee-event-picture img{max-width:100%!important;max-height:240px!important;object-fit:contain!important;display:block!important}
.employee-event-picture strong{font-size:18px!important;line-height:1.2!important;color:#0f172a!important}
.employee-event-close{position:absolute!important;right:8px!important;top:8px!important;width:28px!important;height:28px!important;border-radius:999px!important;border:1px solid #dbe3ef!important;background:#fff!important;color:#64748b!important;z-index:3!important;cursor:pointer!important}
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

  html = html.replace(
    /<button id="navBoard"[^>]*data-nav="board"[^>]*>Доска проектов<\/button>/,
    ""
  );
  html = html.replace(
    /(<button id="navProjects"[^>]*>)[^<]*(<\/button>)/,
    "$1Доска проектов$2"
  );
  html = html.replaceAll("Доска проектов 2", "Доска проектов");
  html = html.replace(
    "function render(){document.querySelectorAll('[data-nav]').forEach(btn=>btn.classList.toggle('active',btn.dataset.nav===section));root.innerHTML=section==='reports'?reportsView():section==='projects'?projectView():section==='marketing'?marketingView():section==='calendar'?calendarView():section==='board'?boardView():settingsView();initSeasonalLotties()}",
    "function render(){if(section==='board')section='projects';document.querySelectorAll('[data-nav]').forEach(btn=>btn.classList.toggle('active',btn.dataset.nav===section));root.innerHTML=section==='reports'?reportsView():section==='projects'?projectView():section==='marketing'?marketingView():section==='calendar'?calendarView():settingsView();initSeasonalLotties()}"
  );
  html = html.replace(
    "function setSection(s){section=s;render()}",
    "function setSection(s){section=s==='board'?'projects':s;render()}"
  );

  return source.replace(match[1], Buffer.from(html, "utf8").toString("base64"));
}

function patchAppScript(source) {
  return patchEmployeeEvents(patchProject2Html(patchOuterAppScript(source)));
}

async function fetchWorkingAppScript() {
  const response = await fetch(WORKING_APP_URL, { cache: "no-store" });
  if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
  return patchAppScript(await response.text());
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
        res.writeHead(502, {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store"
        });
        res.end(`Не удалось загрузить новый интерфейс: ${error.message}`);
      }
      return;
    }

    if (typeof listener === "function") return listener(req, res);
    res.statusCode = 404;
    res.end("Not found");
  });
};

require("./server-hotfix.js");
