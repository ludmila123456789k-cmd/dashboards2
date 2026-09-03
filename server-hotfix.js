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
const REPORT_FIELDS = ["title", "text", "date", "status", "attachments"];
const REPORT_STATUSES = new Set(["plan", "progress", "done"]);

const originalCreateServer = http.createServer.bind(http);
http.createServer = function createPatchedServer(listener) {
  return originalCreateServer(async (req, res) => {
    try {
      const pathname = new URL(req.url || "/", "http://localhost").pathname;
      if (req.method === "PUT" && pathname === "/api/employees/report") {
        await handleSaveEmployeeReport(req, res);
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
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
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
