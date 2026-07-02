const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = __dirname;
loadEnvFile(path.join(ROOT, ".env"));

const PORT = Number(process.env.PORT || 4174);
const HOST = process.env.HOST || "0.0.0.0";
const PUBLIC_DIR = path.join(ROOT, "public");
const DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(ROOT, "data");
const STORE_FILE = path.join(DATA_DIR, "store.json");
const PUBLIC_VIEW_URL_FILE = path.join(DATA_DIR, "public-view-base-url.txt");
const MAX_BODY_BYTES = 6 * 1024 * 1024;
const EDITOR_PASSWORD = process.env.EDITOR_PASSWORD || "";
const PUBLIC_BASE_URL = normalizeBaseUrl(process.env.PUBLIC_BASE_URL || "");
const PUBLIC_VIEW_BASE_URL = normalizeBaseUrl(process.env.PUBLIC_VIEW_BASE_URL || PUBLIC_BASE_URL);
const EDITOR_BASE_URL = normalizeBaseUrl(process.env.EDITOR_BASE_URL || "");
const AUTH_COOKIE = "marketing_editor_session";
const AUTH_SECRET = process.env.AUTH_SECRET || crypto.randomBytes(32).toString("hex");
const AUTH_TOKEN = EDITOR_PASSWORD
  ? crypto.createHmac("sha256", AUTH_SECRET).update(EDITOR_PASSWORD).digest("hex")
  : "";
let runtimePublicViewBaseUrl = "";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
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

function normalizeBaseUrl(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  return trimmed.replace(/\/+$/, "");
}

function now() {
  return new Date().toISOString();
}

function createDefaultWorkspace() {
  const updatedAt = now();

  return {
    title: "Система развития сайта и маркетинга",
    period: "2026",
    updatedAt,
    sections: {
      roadmap: {
        updatedAt,
        months: [
          { id: "jan", month: "Январь", task: "аудит сайта", status: "done", owner: "Маркетинг" },
          { id: "feb", month: "Февраль", task: "обновление каталога", status: "done", owner: "Контент" },
          { id: "mar", month: "Март", task: "SEO", status: "done", owner: "SEO" },
          { id: "apr", month: "Апрель", task: "выставка", status: "done", owner: "PR" },
          { id: "may", month: "Май", task: "новый раздел сайта", status: "done", owner: "Сайт" },
          { id: "jun", month: "Июнь", task: "аналитика", status: "done", owner: "Аналитика" }
        ]
      },
      content: {
        updatedAt,
        weeks: [
          { id: "w1", title: "Неделя 1", items: [
            { id: "c1", type: "статьи", title: "статья", status: "done" },
            { id: "c2", type: "новости", title: "новости", status: "done" }
          ] },
          { id: "w2", title: "Неделя 2", items: [
            { id: "c3", type: "кейсы", title: "кейс клиента", status: "done" }
          ] },
          { id: "w3", title: "Неделя 3", items: [
            { id: "c4", type: "соцсети", title: "видео производства", status: "done" }
          ] },
          { id: "w4", title: "Неделя 4", items: [
            { id: "c5", type: "статьи", title: "интервью инженера", status: "done" }
          ] }
        ]
      },
      board: {
        updatedAt,
        stages: ["Идеи", "В работе", "На согласовании", "Разработка", "Тестирование", "Готово"],
        projects: [
          { id: "p1", title: "Новый поиск", owner: "Сайт", stage: "Разработка", due: "2026-07-12" },
          { id: "p2", title: "Новый каталог", owner: "Контент", stage: "Идеи", due: "2026-08-01" },
          { id: "p3", title: "Новый фильтр", owner: "Разработка", stage: "Готово", due: "2026-06-20" },
          { id: "p4", title: "FAQ", owner: "Маркетинг", stage: "Идеи", due: "2026-07-03" }
        ]
      },
      improvements: {
        updatedAt,
        items: [
          { id: 12, idea: "Добавить калькулятор", priority: "высокий", status: "Планируется", cost: "40 тыс", effect: "Увеличение заявок", rating: 5 },
          { id: 13, idea: "Новый поиск", priority: "высокий", status: "разработка", cost: "60 тыс", effect: "Быстрее находят товар", rating: 5 },
          { id: 14, idea: "Новый каталог", priority: "средний", status: "план", cost: "80 тыс", effect: "Лучше структура ассортимента", rating: 4 },
          { id: 15, idea: "Новый фильтр", priority: "высокий", status: "готово", cost: "35 тыс", effect: "Больше переходов в карточки", rating: 5 },
          { id: 16, idea: "FAQ", priority: "низкий", status: "идея", cost: "15 тыс", effect: "Меньше повторных вопросов", rating: 3 }
        ]
      },
      journey: {
        updatedAt,
        steps: [
          { id: "google", title: "Google", loss: false, note: "" },
          { id: "site", title: "Сайт", loss: false, note: "" },
          { id: "catalog", title: "Каталог", loss: true, note: "Теряются при подборе товара" },
          { id: "request", title: "Заявка", loss: true, note: "Часть не завершает форму" },
          { id: "manager", title: "Менеджер", loss: false, note: "" },
          { id: "offer", title: "КП", loss: true, note: "Долгое согласование" },
          { id: "contract", title: "Договор", loss: false, note: "" },
          { id: "delivery", title: "Поставка", loss: false, note: "" },
          { id: "repeat", title: "Повторная покупка", loss: false, note: "" }
        ]
      },
      employees: {
        updatedAt,
        month: "2026-06",
        people: [
          { id: "ivanov", name: "Иванов", plan: 8, done: 7, reports: [
            { id: "r1", date: "2026-06-07", title: "SEO и структура", text: "Проверил посадочные страницы, подготовил список правок по каталогу.", completed: true },
            { id: "r2", date: "2026-06-21", title: "Контент", text: "Собрал темы для статей и вопросы для интервью инженера.", completed: true }
          ] },
          { id: "petrova", name: "Петрова", plan: 6, done: 6, reports: [
            { id: "r3", date: "2026-06-14", title: "Выставка", text: "Подготовила материалы, обновила презентацию и список лидов.", completed: true }
          ] },
          { id: "smirnov", name: "Смирнов", plan: 5, done: 3, reports: [
            { id: "r4", date: "2026-06-18", title: "Разработка", text: "Оценил калькулятор и новый фильтр, передал сроки.", completed: false }
          ] }
        ]
      }
    }
  };
}

function createStore() {
  return {
    publicToken: crypto.randomBytes(10).toString("hex"),
    workspace: createDefaultWorkspace()
  };
}

function ensureStore() {
  fs.mkdirSync(DATA_DIR, { recursive: true });

  if (!fs.existsSync(STORE_FILE)) {
    const store = createStore();
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), "utf8");
    return store;
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(STORE_FILE, "utf8"));
    if (!parsed.publicToken) parsed.publicToken = crypto.randomBytes(10).toString("hex");
    if (!parsed.workspace) parsed.workspace = createDefaultWorkspace();
    return parsed;
  } catch (error) {
    const backup = `${STORE_FILE}.broken-${Date.now()}`;
    fs.copyFileSync(STORE_FILE, backup);
    const store = createStore();
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), "utf8");
    return store;
  }
}

function writeStore(store) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), "utf8");
}

function sendJson(res, statusCode, payload, extraHeaders = {}) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...extraHeaders
  });
  res.end(JSON.stringify(payload));
}

function sendText(res, statusCode, body) {
  res.writeHead(statusCode, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(body);
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

function baseUrl(req) {
  const proto = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers.host || `localhost:${PORT}`;
  return `${proto}://${host}`;
}

function publicUrl(req, token) {
  return `${currentPublicViewBaseUrl() || baseUrl(req)}/view/${token}`;
}

function editorUrl(req) {
  return `${EDITOR_BASE_URL || baseUrl(req)}/`;
}

function readExternalPublicViewBaseUrl() {
  try {
    if (!fs.existsSync(PUBLIC_VIEW_URL_FILE)) return "";
    return normalizeBaseUrl(fs.readFileSync(PUBLIC_VIEW_URL_FILE, "utf8"));
  } catch (error) {
    return "";
  }
}

function currentPublicViewBaseUrl() {
  return PUBLIC_VIEW_BASE_URL || runtimePublicViewBaseUrl || readExternalPublicViewBaseUrl();
}

function saveExternalPublicViewBaseUrl(value) {
  const baseUrlValue = normalizeBaseUrl(value);
  if (baseUrlValue && !baseUrlValue.startsWith("https://")) {
    throw new Error("PUBLIC_URL_MUST_BE_HTTPS");
  }

  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (baseUrlValue) {
    fs.writeFileSync(PUBLIC_VIEW_URL_FILE, baseUrlValue, "utf8");
  } else if (fs.existsSync(PUBLIC_VIEW_URL_FILE)) {
    fs.unlinkSync(PUBLIC_VIEW_URL_FILE);
  }

  runtimePublicViewBaseUrl = baseUrlValue;
  return baseUrlValue;
}

function startPublicTunnel() {
  const readyUrl = currentPublicViewBaseUrl();
  if (readyUrl) return Promise.resolve(readyUrl);
  return Promise.reject(new Error("Публичная HTTPS-ссылка не настроена. Для безопасного просмотра с любого компьютера нужен публичный адрес сервера."));
}

function parseCookies(req) {
  const header = req.headers.cookie || "";
  return Object.fromEntries(
    header
      .split(";")
      .map(item => item.trim())
      .filter(Boolean)
      .map(item => {
        const index = item.indexOf("=");
        if (index === -1) return [item, ""];
        return [decodeURIComponent(item.slice(0, index)), decodeURIComponent(item.slice(index + 1))];
      })
  );
}

function authStatus(req) {
  if (!EDITOR_PASSWORD) {
    return { requiresPassword: false, authenticated: true };
  }

  const cookies = parseCookies(req);
  return {
    requiresPassword: true,
    authenticated: cookies[AUTH_COOKIE] === AUTH_TOKEN
  };
}

function cookieSuffix(req) {
  const secure = req.headers["x-forwarded-proto"] === "https" ? "; Secure" : "";
  return `HttpOnly; SameSite=Lax; Path=/; Max-Age=2592000${secure}`;
}

function requireEditor(req, res) {
  const status = authStatus(req);
  if (status.authenticated) return true;
  sendJson(res, 401, { error: "AUTH_REQUIRED", ...status });
  return false;
}

async function handleLogin(req, res) {
  if (!EDITOR_PASSWORD) {
    sendJson(res, 200, { ok: true, requiresPassword: false, authenticated: true });
    return;
  }

  try {
    const body = await readBody(req);
    const payload = JSON.parse(body || "{}");

    if (payload.password !== EDITOR_PASSWORD) {
      sendJson(res, 401, { error: "INVALID_PASSWORD", requiresPassword: true, authenticated: false });
      return;
    }

    sendJson(
      res,
      200,
      { ok: true, requiresPassword: true, authenticated: true },
      { "Set-Cookie": `${AUTH_COOKIE}=${encodeURIComponent(AUTH_TOKEN)}; ${cookieSuffix(req)}` }
    );
  } catch (error) {
    sendJson(res, 400, { error: "Invalid login request" });
  }
}

function serveStatic(req, res, pathname) {
  const routePath = pathname === "/" || pathname.startsWith("/view/") ? "/index.html" : pathname;
  const safePath = path.normalize(decodeURIComponent(routePath)).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(PUBLIC_DIR, safePath);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    sendText(res, 403, "Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      sendText(res, 404, "Not found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=3600"
    });
    res.end(content);
  });
}

async function handleApi(req, res, pathname) {
  if (req.method === "GET" && pathname === "/api/health") {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method === "GET" && pathname === "/api/auth") {
    sendJson(res, 200, authStatus(req));
    return;
  }

  if (req.method === "POST" && pathname === "/api/login") {
    await handleLogin(req, res);
    return;
  }

  if (req.method === "POST" && pathname === "/api/logout") {
    sendJson(
      res,
      200,
      { ok: true, requiresPassword: Boolean(EDITOR_PASSWORD), authenticated: false },
      { "Set-Cookie": `${AUTH_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0` }
    );
    return;
  }

  const store = ensureStore();

  if (req.method === "GET" && pathname === "/api/workspace") {
    if (!requireEditor(req, res)) return;
    sendJson(res, 200, {
      workspace: store.workspace,
      shareUrl: publicUrl(req, store.publicToken),
      editorUrl: editorUrl(req),
      publicBaseUrl: PUBLIC_BASE_URL,
      publicViewBaseUrl: currentPublicViewBaseUrl(),
      editorBaseUrl: EDITOR_BASE_URL
    });
    return;
  }

  if (req.method === "PUT" && pathname === "/api/workspace") {
    if (!requireEditor(req, res)) return;
    try {
      const body = await readBody(req);
      const payload = JSON.parse(body);

      if (!payload || typeof payload !== "object" || !payload.workspace) {
        sendJson(res, 400, { error: "Expected { workspace }" });
        return;
      }

      payload.workspace.updatedAt = now();
      store.workspace = payload.workspace;
      writeStore(store);

      sendJson(res, 200, {
        workspace: store.workspace,
        shareUrl: publicUrl(req, store.publicToken),
        editorUrl: editorUrl(req),
        publicBaseUrl: PUBLIC_BASE_URL,
        publicViewBaseUrl: currentPublicViewBaseUrl(),
        editorBaseUrl: EDITOR_BASE_URL
      });
    } catch (error) {
      sendJson(res, error.message === "BODY_TOO_LARGE" ? 413 : 400, { error: "Invalid workspace data" });
    }
    return;
  }

  if (req.method === "PUT" && pathname === "/api/public-url") {
    if (!requireEditor(req, res)) return;
    try {
      const body = await readBody(req);
      const payload = JSON.parse(body || "{}");
      const publicViewBaseUrl = saveExternalPublicViewBaseUrl(payload.publicViewBaseUrl || "");

      sendJson(res, 200, {
        shareUrl: publicUrl(req, store.publicToken),
        editorUrl: editorUrl(req),
        publicViewBaseUrl,
        runtimePublicViewBaseUrl: publicViewBaseUrl
      });
    } catch (error) {
      const message = error.message === "PUBLIC_URL_MUST_BE_HTTPS"
        ? "Адрес должен начинаться с https://"
        : "Не удалось сохранить публичный адрес";
      sendJson(res, 400, { error: message });
    }
    return;
  }

  if (req.method === "POST" && pathname === "/api/share") {
    if (!requireEditor(req, res)) return;
    if (!store.publicToken) {
      store.publicToken = crypto.randomBytes(10).toString("hex");
      writeStore(store);
    }
    let allowPublicTunnel = false;
    try {
      if (Number(req.headers["content-length"] || 0) > 0) {
        const body = await readBody(req);
        const payload = JSON.parse(body || "{}");
        allowPublicTunnel = payload.allowPublicTunnel === true;
      }
    } catch (error) {
      allowPublicTunnel = false;
    }
    let tunnelError = "";
    if (allowPublicTunnel) {
      try {
        await startPublicTunnel();
      } catch (error) {
        tunnelError = error.message || "Не удалось создать публичную ссылку";
      }
    } else if (!currentPublicViewBaseUrl()) {
      tunnelError = "Публичная HTTPS-ссылка не настроена. Нужен публичный адрес сервера.";
    }
    sendJson(res, 200, {
      shareUrl: publicUrl(req, store.publicToken),
      editorUrl: editorUrl(req),
      publicBaseUrl: PUBLIC_BASE_URL,
      publicViewBaseUrl: currentPublicViewBaseUrl(),
      runtimePublicViewBaseUrl: currentPublicViewBaseUrl(),
      editorBaseUrl: EDITOR_BASE_URL,
      tunnelError
    });
    return;
  }

  const publicMatch = pathname.match(/^\/api\/public\/([a-f0-9]{20})$/);
  if (req.method === "GET" && publicMatch) {
    if (publicMatch[1] !== store.publicToken) {
      sendJson(res, 404, { error: "Workspace not found" });
      return;
    }

    sendJson(res, 200, {
      workspace: store.workspace,
      updatedAt: store.workspace.updatedAt
    });
    return;
  }

  sendJson(res, 404, { error: "Unknown API route" });
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url.pathname);
      return;
    }
    serveStatic(req, res, url.pathname);
  } catch (error) {
    sendJson(res, 500, { error: "Server error" });
  }
});

server.listen(PORT, HOST, () => {
  const hostLabel = HOST === "0.0.0.0" ? "localhost" : HOST;
  console.log(`Marketing System: http://${hostLabel}:${PORT}`);
});
