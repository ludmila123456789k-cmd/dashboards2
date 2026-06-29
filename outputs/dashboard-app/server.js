const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = __dirname;
loadEnvFile(path.join(ROOT, ".env"));

const PORT = Number(process.env.PORT || 4173);
const HOST = process.env.HOST || "0.0.0.0";
const PUBLIC_DIR = path.join(ROOT, "public");
const DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(ROOT, "data");
const STORE_FILE = path.join(DATA_DIR, "store.json");
const PUBLIC_VIEW_URL_FILE = path.join(DATA_DIR, "public-view-base-url.txt");
const MAX_BODY_BYTES = 5 * 1024 * 1024;
const EDITOR_PASSWORD = process.env.EDITOR_PASSWORD || "";
const PUBLIC_BASE_URL = normalizeBaseUrl(process.env.PUBLIC_BASE_URL || "");
const PUBLIC_VIEW_BASE_URL = normalizeBaseUrl(process.env.PUBLIC_VIEW_BASE_URL || PUBLIC_BASE_URL);
const EDITOR_BASE_URL = normalizeBaseUrl(process.env.EDITOR_BASE_URL || "");
const AUTH_COOKIE = "dashboard_editor_session";
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
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp"
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

function createDefaultDashboard() {
  const updatedAt = now();

  return {
    title: "Дашборд компании",
    period: "Июнь 2026",
    updatedAt,
    sections: {
      site: {
        updatedAt,
        metrics: [
          { id: "visitors", label: "Посетители", value: 18420, plan: 18000, suffix: "" },
          { id: "pageViews", label: "Просмотры страниц", value: 51200, plan: 48000, suffix: "" },
          { id: "topSources", label: "Источники трафика", value: 6, plan: 5, suffix: "" },
          { id: "topPages", label: "Популярные страницы", value: 8, plan: 6, suffix: "" },
          { id: "conversion", label: "Конверсия в заявку", value: 3.1, plan: 2.8, suffix: "%" }
        ],
        rows: [
          { date: "2026-06-01", source: "Поиск", page: "/services", visitors: 3200, pageviews: 9100, leads: 106 },
          { date: "2026-06-08", source: "Реклама", page: "/cases", visitors: 4100, pageviews: 11800, leads: 142 },
          { date: "2026-06-15", source: "Прямые", page: "/contacts", visitors: 2950, pageviews: 8200, leads: 91 },
          { date: "2026-06-22", source: "Соцсети", page: "/blog", visitors: 3700, pageviews: 10100, leads: 96 },
          { date: "2026-06-26", source: "Email", page: "/pricing", visitors: 4470, pageviews: 12000, leads: 135 }
        ],
        analysis: {}
      },
      leads: {
        updatedAt,
        metrics: [
          { id: "siteRequests", label: "Заявки с сайта", value: 235, plan: 200, suffix: "" },
          { id: "phoneCalls", label: "Телефонные звонки", value: 86, plan: 75, suffix: "" },
          { id: "email", label: "Email", value: 42, plan: 40, suffix: "" },
          { id: "feedbackForms", label: "Формы обратной связи", value: 68, plan: 60, suffix: "" }
        ],
        rows: [
          { date: "2026-06-01", channel: "Сайт", count: 52 },
          { date: "2026-06-08", channel: "Телефон", count: 21 },
          { date: "2026-06-15", channel: "Email", count: 18 },
          { date: "2026-06-22", channel: "Форма", count: 31 },
          { date: "2026-06-26", channel: "Сайт", count: 183 }
        ],
        analysis: {}
      },
      sales: {
        updatedAt,
        metrics: [
          { id: "processed", label: "Обработано заявок", value: 321, plan: 300, suffix: "" },
          { id: "unprocessed", label: "Необработано", value: 18, plan: 20, suffix: "" },
          { id: "responseTime", label: "Среднее время ответа", value: 24, plan: 30, suffix: " мин" },
          { id: "lost", label: "Потерянные обращения", value: 12, plan: 15, suffix: "" }
        ],
        rows: [
          { date: "2026-06-01", processed: 68, unprocessed: 6, response_minutes: 28, lost: 3 },
          { date: "2026-06-08", processed: 72, unprocessed: 4, response_minutes: 25, lost: 2 },
          { date: "2026-06-15", processed: 79, unprocessed: 3, response_minutes: 23, lost: 4 },
          { date: "2026-06-22", processed: 61, unprocessed: 3, response_minutes: 22, lost: 2 },
          { date: "2026-06-26", processed: 41, unprocessed: 2, response_minutes: 21, lost: 1 }
        ],
        analysis: {}
      },
      marketing: {
        updatedAt,
        metrics: [
          { id: "exhibitions", label: "Выставки", value: 2, plan: 2, suffix: "" },
          { id: "campaigns", label: "Рекламные кампании", value: 7, plan: 6, suffix: "" },
          { id: "articles", label: "Выпущенные статьи", value: 5, plan: 4, suffix: "" },
          { id: "cases", label: "Кейсы", value: 3, plan: 2, suffix: "" },
          { id: "news", label: "Новости", value: 9, plan: 8, suffix: "" }
        ],
        rows: [
          { date: "2026-06-01", type: "Статья", count: 2 },
          { date: "2026-06-08", type: "Кейс", count: 1 },
          { date: "2026-06-15", type: "Кампания", count: 4 },
          { date: "2026-06-22", type: "Новость", count: 5 },
          { date: "2026-06-26", type: "Выставка", count: 2 }
        ],
        analysis: {}
      },
      executive: {
        updatedAt,
        kpis: [
          { id: "requests", label: "Заявки", plan: 200, fact: 235 },
          { id: "newClients", label: "Новые клиенты", plan: 35, fact: 39 },
          { id: "siteConversion", label: "Конверсия сайта", plan: 2.8, fact: 3.1, suffix: "%" },
          { id: "newArticles", label: "Новые статьи", plan: 4, fact: 5 },
          { id: "cases", label: "Кейсы", plan: 2, fact: 3 }
        ]
      }
    }
  };
}

function createStore() {
  return {
    publicToken: crypto.randomBytes(10).toString("hex"),
    dashboard: createDefaultDashboard()
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
    if (!parsed.dashboard) parsed.dashboard = createDefaultDashboard();
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
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...extraHeaders
  });
  res.end(body);
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

  if (req.method === "GET" && pathname === "/api/dashboard") {
    if (!requireEditor(req, res)) return;
    sendJson(res, 200, {
      dashboard: store.dashboard,
      shareUrl: publicUrl(req, store.publicToken),
      editorUrl: editorUrl(req),
      publicBaseUrl: PUBLIC_BASE_URL,
      publicViewBaseUrl: currentPublicViewBaseUrl(),
      editorBaseUrl: EDITOR_BASE_URL
    });
    return;
  }

  if (req.method === "PUT" && pathname === "/api/dashboard") {
    if (!requireEditor(req, res)) return;
    try {
      const body = await readBody(req);
      const payload = JSON.parse(body);

      if (!payload || typeof payload !== "object" || !payload.dashboard) {
        sendJson(res, 400, { error: "Expected { dashboard }" });
        return;
      }

      payload.dashboard.updatedAt = now();
      store.dashboard = payload.dashboard;
      writeStore(store);

      sendJson(res, 200, {
        dashboard: store.dashboard,
        shareUrl: publicUrl(req, store.publicToken),
        editorUrl: editorUrl(req),
        publicBaseUrl: PUBLIC_BASE_URL,
        publicViewBaseUrl: currentPublicViewBaseUrl(),
        editorBaseUrl: EDITOR_BASE_URL
      });
    } catch (error) {
      sendJson(res, error.message === "BODY_TOO_LARGE" ? 413 : 400, { error: "Invalid dashboard data" });
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
      sendJson(res, 404, { error: "Dashboard not found" });
      return;
    }

    sendJson(res, 200, {
      dashboard: store.dashboard,
      updatedAt: store.dashboard.updatedAt
    });
    return;
  }

  sendJson(res, 404, { error: "Unknown API route" });
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const pathname = url.pathname;

    if (pathname.startsWith("/api/")) {
      await handleApi(req, res, pathname);
      return;
    }

    serveStatic(req, res, pathname);
  } catch (error) {
    sendJson(res, 500, { error: "Server error" });
  }
});

server.listen(PORT, HOST, () => {
  const hostLabel = HOST === "0.0.0.0" ? "localhost" : HOST;
  console.log(`Dashboard Studio: http://${hostLabel}:${PORT}`);
});
