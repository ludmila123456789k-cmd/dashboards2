const http = require("http");

const WORKING_APP_URL = "https://raw.githubusercontent.com/ludmila123456789k-cmd/dashboards2/fix-report-save-symbols-20260903/public/app.js";
const originalCreateServer = http.createServer.bind(http);

function patchAppScript(source) {
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
