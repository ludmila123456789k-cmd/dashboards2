const http = require("http");

const originalEnd = http.ServerResponse.prototype.end;
const WORKING_APP_URL = "https://raw.githubusercontent.com/ludmila123456789k-cmd/dashboards2/fix-report-save-symbols-20260903/public/app.js";

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

async function getWorkingAppScript(fallback) {
  if (typeof fallback === "string" && fallback.includes("PROJECT2_HTML_BASE64")) return fallback;
  try {
    const response = await fetch(WORKING_APP_URL, { cache: "no-store" });
    if (response.ok) return await response.text();
  } catch (error) {}
  return fallback;
}

http.ServerResponse.prototype.end = function patchedEnd(chunk, encoding, callback) {
  const contentType = String(this.getHeader("Content-Type") || "");
  if (!contentType.includes("application/javascript") || !chunk) {
    return originalEnd.call(this, chunk, encoding, callback);
  }

  const asString = Buffer.isBuffer(chunk) ? chunk.toString("utf8") : String(chunk);
  getWorkingAppScript(asString).then(script => {
    const patched = patchAppScript(script);
    originalEnd.call(this, Buffer.isBuffer(chunk) ? Buffer.from(patched, "utf8") : patched, encoding, callback);
  }).catch(() => {
    originalEnd.call(this, chunk, encoding, callback);
  });
  return this;
};

require("./server-hotfix.js");
