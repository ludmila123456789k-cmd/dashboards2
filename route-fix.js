const http = require("http");

const originalEnd = http.ServerResponse.prototype.end;

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

http.ServerResponse.prototype.end = function patchedEnd(chunk, encoding, callback) {
  const contentType = String(this.getHeader("Content-Type") || "");
  if (contentType.includes("application/javascript") && chunk) {
    const asString = Buffer.isBuffer(chunk) ? chunk.toString("utf8") : String(chunk);
    const patched = patchAppScript(asString);
    if (patched !== asString) chunk = Buffer.isBuffer(chunk) ? Buffer.from(patched, "utf8") : patched;
  }
  return originalEnd.call(this, chunk, encoding, callback);
};

require("./server-hotfix.js");
