const SECTIONS = [
  { id: "site", label: "Сайт", icon: "globe" },
  { id: "marketing", label: "Маркетинг", icon: "megaphone" },
  { id: "roadmap", label: "Marketing Roadmap", icon: "map" },
  { id: "content", label: "Контент-календарь", icon: "calendar" },
  { id: "board", label: "Доска проектов", icon: "board" },
  { id: "improvements", label: "Реестр улучшений", icon: "star" },
  { id: "employees", label: "Отчеты сотрудников", icon: "users" },
  { id: "executive", label: "Руководителю", icon: "target" }
];

const CONTENT_TYPES = ["статьи", "новости", "кейсы", "соцсети", "email", "выставки"];
const ROADMAP_STATUSES = [
  { value: "done", label: "Выполнено" },
  { value: "progress", label: "В работе" },
  { value: "plan", label: "План" }
];
const PRIORITIES = ["высокий", "средний", "низкий"];
const IMPROVEMENT_STATUSES = ["идея", "план", "планируется", "разработка", "тестирование", "готово"];

const TEMPLATES = {
  site: [
    "date;source;page;visitors;pageviews;leads",
    "2026-06-01;Поиск;/services;3200;9100;106",
    "2026-06-08;Реклама;/cases;4100;11800;142"
  ].join("\n"),
  marketing: [
    "date;type;count",
    "2026-06-01;Статья;2",
    "2026-06-08;Кейс;1",
    "2026-06-15;Кампания;4",
    "2026-06-22;Новость;5"
  ].join("\n"),
  executive: [
    "kpi;plan;fact;suffix",
    "Заявки;200;235;",
    "Новые клиенты;35;39;",
    "Конверсия сайта;2,8;3,1;%",
    "Новые статьи;4;5;",
    "Кейсы;2;3;"
  ].join("\n")
};

const DEFAULT_DASHBOARD = {
  title: "Дашборд компании",
  period: "Июнь 2026",
  updatedAt: new Date().toISOString(),
  sections: {
    site: {
      updatedAt: new Date().toISOString(),
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
    marketing: {
      updatedAt: new Date().toISOString(),
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
    roadmap: {
      updatedAt: new Date().toISOString(),
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
      updatedAt: new Date().toISOString(),
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
      updatedAt: new Date().toISOString(),
      stages: ["Идеи", "В работе", "На согласовании", "Разработка", "Тестирование", "Готово"],
      projects: [
        { id: "p1", title: "Новый поиск", owner: "Сайт", stage: "Разработка", due: "2026-07-12" },
        { id: "p2", title: "Новый каталог", owner: "Контент", stage: "Идеи", due: "2026-08-01" },
        { id: "p3", title: "Новый фильтр", owner: "Разработка", stage: "Готово", due: "2026-06-20" },
        { id: "p4", title: "FAQ", owner: "Маркетинг", stage: "Идеи", due: "2026-07-03" }
      ]
    },
    improvements: {
      updatedAt: new Date().toISOString(),
      items: [
        { id: 12, idea: "Добавить калькулятор", priority: "высокий", status: "планируется", cost: "40 тыс", effect: "Увеличение заявок", rating: 5 },
        { id: 13, idea: "Новый поиск", priority: "высокий", status: "разработка", cost: "60 тыс", effect: "Быстрее находят товар", rating: 5 },
        { id: 14, idea: "Новый каталог", priority: "средний", status: "план", cost: "80 тыс", effect: "Лучше структура ассортимента", rating: 4 },
        { id: 15, idea: "Новый фильтр", priority: "высокий", status: "готово", cost: "35 тыс", effect: "Больше переходов в карточки", rating: 5 },
        { id: 16, idea: "FAQ", priority: "низкий", status: "идея", cost: "15 тыс", effect: "Меньше повторных вопросов", rating: 3 }
      ]
    },
    journey: {
      updatedAt: new Date().toISOString(),
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
      updatedAt: new Date().toISOString(),
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
    },
    executive: {
      updatedAt: new Date().toISOString(),
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

const app = document.querySelector("#app");
const toast = document.querySelector("#toast");

const publicMatch = location.pathname.match(/^\/view\/([a-f0-9]{20})/);
const isPublicView = Boolean(publicMatch);
const publicToken = publicMatch ? publicMatch[1] : null;
const canUseServer = location.protocol !== "file:";

let dashboard = null;
let activeSection = "site";
let shareUrl = "";
let editorUrl = "";
let publicViewBaseUrl = "";
let saveTimer = null;
let pollTimer = null;
let lastSavedAt = "";
let authState = { requiresPassword: false, authenticated: true };

bootstrap();

async function bootstrap() {
  try {
    if (isPublicView) {
      await loadPublicDashboard();
      startPolling();
    } else {
      await checkAuth();
      if (authState.requiresPassword && !authState.authenticated) {
        renderLogin();
        return;
      }
      await loadOwnerDashboard();
    }
    recomputeAll();
    render();
  } catch (error) {
    if (error.message === "AUTH_REQUIRED") return;
    dashboard = mergeDashboard(loadLocalDashboard());
    recomputeAll();
    render();
    showToast("Сервер недоступен, данные сохранены только в этом браузере");
  }
}

async function checkAuth() {
  if (!canUseServer || isPublicView) return;
  const response = await fetch("/api/auth", { cache: "no-store" });
  if (!response.ok) return;
  authState = await response.json();
}

async function loadOwnerDashboard() {
  if (!canUseServer) {
    dashboard = mergeDashboard(loadLocalDashboard());
    return;
  }

  const response = await fetch("/api/dashboard", { cache: "no-store" });
  if (response.status === 401) {
    authState = { requiresPassword: true, authenticated: false };
    renderLogin();
    throw new Error("AUTH_REQUIRED");
  }
  if (!response.ok) throw new Error("Не удалось загрузить дашборд");

  const payload = await response.json();
  dashboard = mergeDashboard(payload.dashboard || DEFAULT_DASHBOARD);
  shareUrl = payload.shareUrl || "";
  editorUrl = payload.editorUrl || location.origin + "/";
  publicViewBaseUrl = payload.publicViewBaseUrl || "";
}

async function loadPublicDashboard() {
  const response = await fetch(`/api/public/${publicToken}`, { cache: "no-store" });
  if (!response.ok) throw new Error("Ссылка недоступна");

  const payload = await response.json();
  dashboard = mergeDashboard(payload.dashboard || DEFAULT_DASHBOARD);
  shareUrl = location.href;
  editorUrl = "";
}

function loadLocalDashboard() {
  try {
    return JSON.parse(localStorage.getItem("dashboard-studio")) || DEFAULT_DASHBOARD;
  } catch (error) {
    return DEFAULT_DASHBOARD;
  }
}

function mergeDashboard(source) {
  const merged = structuredClone(DEFAULT_DASHBOARD);
  if (!source || typeof source !== "object") return merged;

  merged.title = source.title || merged.title;
  merged.period = source.period || merged.period;
  merged.updatedAt = source.updatedAt || merged.updatedAt;

  for (const sectionId of Object.keys(merged.sections)) {
    const current = source.sections?.[sectionId];
    if (!current || typeof current !== "object") continue;
    merged.sections[sectionId] = mergeDeep(merged.sections[sectionId], current);
  }

  return normalizeDashboard(merged);
}

function normalizeDashboard(data) {
  const defaults = DEFAULT_DASHBOARD.sections;
  const ensureArray = (sectionId, key) => {
    const section = data.sections[sectionId];
    if (!section || !Array.isArray(section[key])) {
      data.sections[sectionId][key] = structuredClone(defaults[sectionId][key]);
    }
  };

  ensureArray("site", "metrics");
  ensureArray("site", "rows");
  ensureArray("marketing", "metrics");
  ensureArray("marketing", "rows");
  ensureArray("executive", "kpis");
  ensureArray("roadmap", "months");
  ensureArray("content", "weeks");
  ensureArray("board", "stages");
  ensureArray("board", "projects");
  ensureArray("improvements", "items");
  ensureArray("journey", "steps");
  ensureArray("employees", "people");

  data.sections.content.weeks.forEach(week => {
    if (!Array.isArray(week.items)) week.items = [];
  });
  data.sections.employees.people.forEach(person => {
    if (!Array.isArray(person.reports)) person.reports = [];
  });

  return data;
}

function mergeDeep(base, incoming) {
  if (Array.isArray(base)) return Array.isArray(incoming) ? incoming : base;
  if (!base || typeof base !== "object") return incoming ?? base;

  const out = { ...base };
  for (const [key, value] of Object.entries(incoming || {})) {
    if (Array.isArray(value)) {
      out[key] = value;
    } else if (value && typeof value === "object" && base[key] && typeof base[key] === "object" && !Array.isArray(base[key])) {
      out[key] = mergeDeep(base[key], value);
    } else {
      out[key] = value;
    }
  }
  return out;
}

function renderLogin() {
  app.innerHTML = `
    <main class="login-shell">
      <form class="login-card" id="loginForm">
        <div class="brand-mark">${icon("target")}</div>
        <h1>Вход в редактор</h1>
        <p>Введите пароль редактора. Ссылка руководителя остается доступной только для просмотра.</p>
        <input class="field" id="passwordInput" type="password" placeholder="Пароль" autocomplete="current-password">
        <button class="button primary" type="submit">Войти</button>
      </form>
    </main>
  `;

  app.querySelector("#loginForm").addEventListener("submit", async event => {
    event.preventDefault();
    const password = app.querySelector("#passwordInput").value;
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    if (!response.ok) {
      showToast("Неверный пароль");
      return;
    }
    authState = await response.json();
    await bootstrap();
  });
}

function render() {
  if (!dashboard) return;
  if (!SECTIONS.some(section => section.id === activeSection)) activeSection = "site";
  const section = SECTIONS.find(item => item.id === activeSection) || SECTIONS[0];
  let sectionHtml = "";
  try {
    sectionHtml = renderSection(section);
  } catch (error) {
    console.error(error);
    sectionHtml = renderSectionProblem(section);
  }

  app.innerHTML = `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-mark">${icon("target")}</div>
          <div>
            <strong>Dashboard Studio</strong>
            <span>${isPublicView ? "просмотр" : "редактор"}</span>
          </div>
        </div>

        <nav class="nav-list" aria-label="Разделы">
          ${SECTIONS.map(item => `
            <button class="nav-button ${item.id === activeSection ? "active" : ""}" data-section="${item.id}" type="button">
              <span class="nav-icon">${icon(item.icon)}</span>
              <span>${item.label}</span>
            </button>
          `).join("")}
        </nav>
        <div class="sidebar-footer">
          <div>Обновлено: ${formatDateTime(dashboard.updatedAt)}</div>
          <div>${isPublicView ? "Автообновление каждые 15 секунд" : "Изменения сохраняются автоматически"}</div>
        </div>
      </aside>

      <main class="main">
        <header class="topbar">
          <div class="title-group">
            <label class="sr-only" for="titleInput">Название дашборда</label>
            <input id="titleInput" class="title-input" value="${escapeAttribute(dashboard.title)}" ${isPublicView ? "disabled" : ""}>
            <label class="sr-only" for="periodInput">Период</label>
            <input id="periodInput" class="period-input" value="${escapeAttribute(dashboard.period)}" ${isPublicView ? "disabled" : ""}>
          </div>
          <div class="top-actions">
            ${isPublicView ? "" : `
              <button class="button" type="button" data-action="demo">${icon("spark")} Демо-данные</button>
              <button class="button primary" type="button" data-action="share">${icon("link")} Ссылка руководителю</button>
              <button class="button" type="button" data-action="public-url">${icon("link")} Публичный адрес</button>
              <button class="button" type="button" data-action="copy-editor">${icon("copy")} Ссылка редактора</button>
              ${authState.requiresPassword ? `<button class="button ghost" type="button" data-action="logout">${icon("reset")} Выйти</button>` : ""}
              <button class="button ghost danger" type="button" data-action="reset">${icon("reset")} Сброс</button>
            `}
          </div>
        </header>

        <div class="content">
          ${isPublicView ? renderViewBanner() : ""}
          ${sectionHtml}
        </div>
      </main>
    </div>
  `;

  bindEvents();
}

function renderViewBanner() {
  return `
    <div class="view-banner">
      <strong>Режим просмотра</strong>
      <span>Последнее обновление: ${formatDateTime(dashboard.updatedAt)}</span>
    </div>
  `;
}

function renderSectionProblem(section) {
  return `
    <section>
      <div class="section-head">
        <div>
          <h1 class="section-title">${escapeHtml(section.label)}</h1>
          <div class="section-meta">Раздел восстановлен</div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-title">Данные раздела обновлены <span>обновите страницу</span></div>
        <div class="empty">Структура раздела восстановлена. Нажмите Ctrl + F5, если содержимое не появилось сразу.</div>
      </div>
    </section>
  `;
}

function renderSection(section) {
  if (section.id === "executive") return renderExecutiveSection(section);
  if (["roadmap", "content", "board", "improvements", "employees"].includes(section.id)) return renderSystemSection(section);
  return renderMetricSection(section);
}

function renderMetricSection(section) {
  const data = dashboard.sections[section.id];
  const rows = Array.isArray(data.rows) ? data.rows : [];

  return `
    <section>
      <div class="section-head">
        <div>
          <h1 class="section-title">${escapeHtml(section.label)}</h1>
          <div class="section-meta">Данные: ${rows.length} строк · ${formatDateTime(data.updatedAt || dashboard.updatedAt)}</div>
        </div>
        ${renderSectionActions(section.id)}
      </div>

      <div class="metrics-grid">
        ${data.metrics.map(metric => renderMetricCard(section.id, metric)).join("")}
      </div>

      <div class="dashboard-grid">
        <div class="panel">
          <div class="panel-title">
            ${chartTitle(section.id)}
            <span>${rows.length ? "по загруженным данным" : "ручные значения"}</span>
          </div>
          <div class="chart">${renderMainChart(section.id, data)}</div>
        </div>

        <div class="panel">
          <div class="panel-title">
            ${sideTitle(section.id)}
            <span>топ</span>
          </div>
          ${renderBreakdown(section.id, data)}
        </div>
      </div>

      <div class="data-area">
        <div class="panel">
          <div class="panel-title">
            Последние строки
            <span>${rows.length || "нет загруженных строк"}</span>
          </div>
          ${renderRowsTable(rows)}
        </div>
      </div>

      <input class="file-input" id="fileInput" type="file" accept=".csv,.json,text/csv,application/json">
    </section>
  `;
}

function renderSystemSection(section) {
  return `
    <section>
      <div class="section-head">
        <div>
          <h1 class="section-title">${escapeHtml(section.label)}</h1>
          <div class="section-meta">${formatDateTime(dashboard.sections[section.id]?.updatedAt || dashboard.updatedAt)}</div>
        </div>
        ${renderSystemActions(section.id)}
      </div>
      ${renderSystemBody(section.id)}
    </section>
  `;
}

function renderSystemActions(sectionId) {
  if (isPublicView) return "";
  const labels = {
    roadmap: "Месяц",
    content: "Неделя",
    board: "Проект",
    improvements: "Идея",
    employees: "Сотрудник"
  };
  return `
    <div class="section-actions">
      <button class="button" type="button" data-action="add-${sectionId}">${icon("plus")} ${labels[sectionId] || "Добавить"}</button>
    </div>
  `;
}

function renderSystemBody(sectionId) {
  if (sectionId === "roadmap") return renderRoadmap();
  if (sectionId === "content") return renderContent();
  if (sectionId === "board") return renderBoard();
  if (sectionId === "improvements") return renderImprovements();
  if (sectionId === "employees") return renderEmployees();
  return "";
}

function renderExecutiveSection(section) {
  const data = dashboard.sections.executive;
  const kpis = Array.isArray(data.kpis) ? data.kpis : [];

  return `
    <section>
      <div class="section-head">
        <div>
          <h1 class="section-title">${escapeHtml(section.label)}</h1>
          <div class="section-meta">Ключевые показатели · ${formatDateTime(data.updatedAt || dashboard.updatedAt)}</div>
        </div>
        ${renderSectionActions("executive")}
      </div>

      <div class="metrics-grid">
        ${kpis.slice(0, 5).map(item => renderKpiCard(item)).join("")}
      </div>

      <div class="panel">
        <div class="panel-title">
          KPI
          <span>план / факт</span>
        </div>
        ${renderKpiTable(kpis)}
      </div>

      <input class="file-input" id="fileInput" type="file" accept=".csv,.json,text/csv,application/json">
    </section>
  `;
}

function renderSectionActions(sectionId) {
  if (isPublicView) return "";
  const canImport = ["site", "marketing", "executive"].includes(sectionId);
  return `
    <div class="section-actions">
      ${canImport ? `<button class="button" type="button" data-action="upload">${icon("upload")} Загрузить</button>` : ""}
      ${TEMPLATES[sectionId] ? `<button class="button" type="button" data-action="template" data-template="${sectionId}">${icon("download")} Шаблон</button>` : ""}
      ${sectionId === "executive" ? `<button class="button" type="button" data-action="add-kpi">${icon("plus")} KPI</button>` : ""}
      <button class="button ghost danger" type="button" data-action="clear-section">${icon("trash")} Очистить</button>
    </div>
  `;
}

function renderMetricCard(sectionId, metric) {
  const value = toNumber(metric.value);
  const plan = toNumber(metric.plan);
  const ratioValue = plan > 0 ? value / plan : 1;
  const statusClass = normalStatus(ratioValue);
  const width = Math.min(Math.max(ratioValue * 100, 0), 100);

  return `
    <article class="metric-card">
      <div class="metric-label">${escapeHtml(metric.label)}</div>
      <div class="metric-value">${formatNumber(value)}${escapeHtml(metric.suffix || "")}</div>
      <div class="metric-plan">План: ${formatNumber(plan)}${escapeHtml(metric.suffix || "")}</div>
      <div class="metric-progress ${statusClass}">
        <span style="width:${width}%"></span>
      </div>
      ${isPublicView ? "" : `
        <div class="metric-edit-grid">
          <input class="metric-input" data-section-id="${sectionId}" data-metric-id="${metric.id}" data-field="value" value="${escapeAttribute(metric.value)}">
          <input class="metric-input" data-section-id="${sectionId}" data-metric-id="${metric.id}" data-field="plan" value="${escapeAttribute(metric.plan)}">
        </div>
      `}
    </article>
  `;
}

function renderKpiCard(item) {
  const ratioValue = toNumber(item.plan) > 0 ? toNumber(item.fact) / toNumber(item.plan) : 1;
  const statusClass = normalStatus(ratioValue);
  const width = Math.min(Math.max(ratioValue * 100, 0), 100);

  return `
    <article class="metric-card">
      <div class="metric-label">${escapeHtml(item.label)}</div>
      <div class="metric-value">${formatNumber(item.fact)}${escapeHtml(item.suffix || "")}</div>
      <div class="metric-plan">План: ${formatNumber(item.plan)}${escapeHtml(item.suffix || "")}</div>
      <div class="metric-progress ${statusClass}">
        <span style="width:${width}%"></span>
      </div>
    </article>
  `;
}

function renderKpiTable(kpis) {
  if (!kpis.length) return `<div class="empty">KPI пока не добавлены</div>`;

  return `
    <div class="table-wrap">
      <table class="kpi-table">
        <thead>
          <tr>
            <th>KPI</th>
            <th>План</th>
            <th>Факт</th>
            <th>Статус</th>
            ${isPublicView ? "" : "<th></th>"}
          </tr>
        </thead>
        <tbody>
          ${kpis.map((item, index) => {
            const ratioValue = toNumber(item.plan) > 0 ? toNumber(item.fact) / toNumber(item.plan) : 1;
            const pill = ratioValue >= 1 ? "good" : ratioValue >= 0.85 ? "neutral" : "bad";
            const percent = Math.round(ratioValue * 100);
            return `
              <tr>
                <td>${isPublicView ? escapeHtml(item.label) : `<input class="kpi-input" data-kpi-index="${index}" data-field="label" value="${escapeAttribute(item.label)}">`}</td>
                <td>${isPublicView ? formatNumber(item.plan) : `<input class="kpi-input" data-kpi-index="${index}" data-field="plan" value="${escapeAttribute(item.plan)}">`}</td>
                <td>${isPublicView ? formatNumber(item.fact) : `<input class="kpi-input" data-kpi-index="${index}" data-field="fact" value="${escapeAttribute(item.fact)}">`}</td>
                <td><span class="status-pill ${pill}">${percent}%</span></td>
                ${isPublicView ? "" : `<td><button class="icon-button" type="button" data-action="remove-kpi" data-kpi-index="${index}">${icon("trash")}</button></td>`}
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderRoadmap() {
  const data = dashboard.sections.roadmap;
  return `
    <div class="roadmap-grid">
      ${data.months.map((item, index) => `
        <article class="month-card">
          <div class="month-top">
            ${editableText(item.month, `roadmap-month-${index}`, "month-name")}
            <span class="check ${item.status}">${statusSymbol(item.status)}</span>
          </div>
          ${editableText(item.task, `roadmap-task-${index}`, "task-title")}
          ${editableText(item.owner || "", `roadmap-owner-${index}`, "task-owner", "Ответственный")}
          ${isPublicView ? "" : `
            <select class="select" data-change="roadmap-status" data-index="${index}">
              ${ROADMAP_STATUSES.map(status => `<option value="${status.value}" ${status.value === item.status ? "selected" : ""}>${status.label}</option>`).join("")}
            </select>
            <button class="button small danger" type="button" data-action="remove-roadmap" data-index="${index}">${icon("trash")} Удалить</button>
          `}
        </article>
      `).join("")}
    </div>
  `;
}

function renderContent() {
  const data = dashboard.sections.content;
  return `
    <div class="content-grid">
      ${data.weeks.map((week, weekIndex) => `
        <article class="week-card">
          <div class="week-head">
            ${editableText(week.title, `content-week-title-${weekIndex}`, "week-title")}
            ${isPublicView ? "" : `<button class="button small" type="button" data-action="add-content-item" data-week-index="${weekIndex}">${icon("plus")} Пункт</button>`}
          </div>
          ${(week.items || []).map((item, itemIndex) => `
            <div class="content-item">
              ${isPublicView
                ? `<span class="toggle ${item.status === "done" ? "done" : ""}">${item.status === "done" ? "✓" : ""}</span>`
                : `<button class="toggle ${item.status === "done" ? "done" : ""}" type="button" data-action="toggle-content" data-week-index="${weekIndex}" data-item-index="${itemIndex}">${item.status === "done" ? "✓" : ""}</button>`
              }
              <div>
                ${editableText(item.title, `content-item-title-${weekIndex}-${itemIndex}`, "task-title")}
                ${isPublicView
                  ? `<span class="type-chip">${escapeHtml(item.type)}</span>`
                  : `<select class="select" data-change="content-type" data-week-index="${weekIndex}" data-item-index="${itemIndex}">
                      ${CONTENT_TYPES.map(type => `<option value="${type}" ${type === item.type ? "selected" : ""}>${type}</option>`).join("")}
                    </select>`
                }
              </div>
              ${isPublicView ? "" : `<button class="button small danger" type="button" data-action="remove-content-item" data-week-index="${weekIndex}" data-item-index="${itemIndex}">${icon("trash")}</button>`}
            </div>
          `).join("") || `<div class="empty">Пока нет контента</div>`}
          ${isPublicView ? "" : `<button class="button small danger" type="button" data-action="remove-content-week" data-week-index="${weekIndex}">${icon("trash")} Удалить неделю</button>`}
        </article>
      `).join("")}
    </div>
  `;
}

function renderBoard() {
  const board = dashboard.sections.board;
  return `
    <div class="board">
      ${board.stages.map(stage => {
        const projects = board.projects.filter(project => project.stage === stage);
        return `
          <div class="board-column">
            <div class="column-title">
              <span>${escapeHtml(stage)}</span>
              <span class="count-pill">${projects.length}</span>
            </div>
            ${projects.map(project => renderProjectCard(project)).join("") || `<div class="empty">Пусто</div>`}
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderProjectCard(project) {
  const index = dashboard.sections.board.projects.findIndex(item => item.id === project.id);
  return `
    <article class="project-card">
      ${editableText(project.title, `project-title-${index}`, "project-title")}
      ${editableText(project.owner || "", `project-owner-${index}`, "project-meta", "Ответственный")}
      ${isPublicView
        ? `<div class="project-meta">Срок: ${escapeHtml(formatDate(project.due))}</div>`
        : `<input class="field" type="date" data-change="project-due" data-index="${index}" value="${escapeAttribute(project.due || "")}">`
      }
      ${isPublicView ? "" : `
        <div class="stage-buttons">
          ${dashboard.sections.board.stages.map(stage => `
            <button class="stage-button ${stage === project.stage ? "active" : ""}" type="button" data-action="set-stage" data-index="${index}" data-stage="${escapeAttribute(stage)}">${escapeHtml(stage)}</button>
          `).join("")}
        </div>
        <button class="button small danger" type="button" data-action="remove-project" data-index="${index}">${icon("trash")} Удалить</button>
      `}
    </article>
  `;
}

function renderImprovements() {
  const items = dashboard.sections.improvements.items;
  return `
    <div class="panel">
      <div class="panel-title">Реестр улучшений сайта <span>${items.length} идей</span></div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Идея</th>
              <th>Приоритет</th>
              <th>Статус</th>
              <th>Оценка</th>
              ${isPublicView ? "" : "<th></th>"}
            </tr>
          </thead>
          <tbody>
            ${items.map((item, index) => `
              <tr>
                <td>${isPublicView ? escapeHtml(item.idea) : `<input class="field" data-change="improvement-field" data-index="${index}" data-field="idea" value="${escapeAttribute(item.idea)}">`}</td>
                <td>${isPublicView ? priorityBadge(item.priority) : renderSelect("improvement-field", index, "priority", PRIORITIES, item.priority)}</td>
                <td>${isPublicView ? escapeHtml(item.status) : renderSelect("improvement-field", index, "status", IMPROVEMENT_STATUSES, item.status)}</td>
                <td>${isPublicView ? stars(item.rating) : renderRatingSelect(index, item.rating)}</td>
                ${isPublicView ? "" : `<td><button class="button small danger" type="button" data-action="remove-improvement" data-index="${index}">${icon("trash")}</button></td>`}
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>

    <div class="improvement-grid">
      ${items.map((item, index) => `
        <article class="improvement-card">
          <div class="record-number">№${escapeHtml(item.id)}</div>
          ${editableText(item.idea, `improvement-idea-card-${index}`, "record-title")}
          <div class="record-row">
            <div class="record-label">Стоимость</div>
            ${editableText(item.cost || "", `improvement-cost-${index}`, "record-value", "Стоимость")}
          </div>
          <div class="record-row">
            <div class="record-label">Эффект</div>
            ${editableText(item.effect || "", `improvement-effect-${index}`, "record-value", "Эффект")}
          </div>
          <div class="record-row">
            <div class="record-label">Статус</div>
            <div class="record-value">${escapeHtml(item.status)}</div>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderJourney() {
  const steps = dashboard.sections.journey.steps;
  return `
    <div class="panel">
      <div class="panel-title">Карта пути клиента <span>красным отмечены места потерь</span></div>
      <div class="journey">
        ${steps.map((step, index) => `
          <article class="journey-step ${step.loss ? "loss" : ""}">
            <div class="journey-index">${index + 1}</div>
            <div>
              ${editableText(step.title, `journey-title-${index}`, "journey-title")}
              ${step.loss ? `<div class="loss-label">Где теряются клиенты</div>` : ""}
              ${isPublicView
                ? `<div class="project-meta">${escapeHtml(step.note || "")}</div>`
                : `
                  <label class="loss-label">
                    <input type="checkbox" data-change="journey-loss" data-index="${index}" ${step.loss ? "checked" : ""}>
                    Где теряются клиенты
                  </label>
                  <textarea class="textarea" data-change="journey-note" data-index="${index}" placeholder="Комментарий по этому шагу">${escapeHtml(step.note || "")}</textarea>
                  <button class="button small danger" type="button" data-action="remove-journey-step" data-index="${index}">${icon("trash")} Удалить</button>
                `}
            </div>
          </article>
        `).join("")}
      </div>
    </div>
  `;
}

function renderEmployees() {
  const data = dashboard.sections.employees;
  const monthLabel = formatMonth(data.month);
  return `
    <div class="employee-layout">
      <div>
        <div class="panel">
          <div class="panel-title">
            Отчеты за ${escapeHtml(monthLabel)}
            ${isPublicView ? "" : `
              <span class="inline-actions">
                <button class="button small" type="button" data-action="prev-month">${icon("left")} Месяц</button>
                <input class="field month-field" type="month" data-change="employee-month" value="${escapeAttribute(data.month || "")}">
                <button class="button small" type="button" data-action="next-month">Месяц ${icon("right")}</button>
              </span>
            `}
          </div>
          <div class="employee-list">
            ${data.people.map((person, personIndex) => renderEmployee(person, personIndex, data.month)).join("")}
          </div>
        </div>
      </div>
      <aside class="panel">
        <div class="panel-title">Сводка KPI <span>выполнил / план</span></div>
        ${renderEmployeeKpis(data.people)}
      </aside>
    </div>
  `;
}

function renderEmployee(person, personIndex, month) {
  const reports = (person.reports || []).filter(report => !month || String(report.date || "").startsWith(month));
  const rate = ratio(person.done, person.plan);

  return `
    <details class="employee-card" open>
      <summary class="employee-summary">
        <div>
          ${editableText(person.name, `employee-name-${personIndex}`, "employee-name")}
          <div class="employee-rate">Выполнил ${formatNumber(person.done)} из ${formatNumber(person.plan)} · ${Math.round(rate * 100)}%</div>
        </div>
        ${isPublicView ? "" : `<button class="button small" type="button" data-action="add-report" data-person-index="${personIndex}">${icon("plus")} Отчет</button>`}
      </summary>
      <div class="employee-body">
        ${isPublicView ? "" : `
          <div class="inline-actions">
            <input class="field compact-field" data-change="employee-field" data-person-index="${personIndex}" data-field="plan" value="${escapeAttribute(person.plan)}" placeholder="План">
            <input class="field compact-field" data-change="employee-field" data-person-index="${personIndex}" data-field="done" value="${escapeAttribute(person.done)}" placeholder="Выполнил">
          </div>
        `}
        ${reports.map(report => renderReport(report, personIndex)).join("") || `<div class="empty">Нет отчетов за выбранный месяц</div>`}
        ${isPublicView ? "" : `<button class="button small danger" type="button" data-action="remove-employee" data-person-index="${personIndex}">${icon("trash")} Удалить сотрудника</button>`}
      </div>
    </details>
  `;
}

function renderReport(report, personIndex) {
  const reportIndex = dashboard.sections.employees.people[personIndex].reports.findIndex(item => item.id === report.id);
  return `
    <details class="report-card">
      <summary class="report-summary">
        <div>
          ${editableText(report.title, `report-title-${personIndex}-${reportIndex}`, "report-title")}
          <div class="report-date">${escapeHtml(formatDate(report.date))}</div>
        </div>
        <span class="check ${report.completed ? "done" : "plan"}">${report.completed ? "✓" : "план"}</span>
      </summary>
      <div class="report-body">
        ${isPublicView
          ? `<div>${escapeHtml(report.text || "")}</div>`
          : `
            <input class="field" type="date" data-change="report-field" data-person-index="${personIndex}" data-report-index="${reportIndex}" data-field="date" value="${escapeAttribute(report.date || "")}">
            <textarea class="textarea" data-change="report-field" data-person-index="${personIndex}" data-report-index="${reportIndex}" data-field="text">${escapeHtml(report.text || "")}</textarea>
            <label class="loss-label good-label">
              <input type="checkbox" data-change="report-completed" data-person-index="${personIndex}" data-report-index="${reportIndex}" ${report.completed ? "checked" : ""}>
              Выполнено
            </label>
            <button class="button small danger" type="button" data-action="remove-report" data-person-index="${personIndex}" data-report-index="${reportIndex}">${icon("trash")} Удалить отчет</button>
          `}
      </div>
    </details>
  `;
}

function renderEmployeeKpis(people) {
  return `
    <div class="kpi-list">
      ${people.map(person => {
        const value = ratio(person.done, person.plan);
        const width = Math.min(value * 100, 100);
        const className = value >= 1 ? "" : value >= 0.75 ? "warn" : "bad";
        return `
          <div class="kpi-row">
            <div class="kpi-top">
              <strong>${escapeHtml(person.name)}</strong>
              <span>${formatNumber(person.done)} / ${formatNumber(person.plan)}</span>
            </div>
            <div class="bar-track"><span class="bar-fill ${className}" style="width:${width}%"></span></div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function bindEvents() {
  app.querySelectorAll("[data-section]").forEach(button => {
    button.addEventListener("click", () => {
      activeSection = button.dataset.section;
      render();
    });
  });

  const titleInput = app.querySelector("#titleInput");
  const periodInput = app.querySelector("#periodInput");
  if (titleInput && !isPublicView) {
    titleInput.addEventListener("change", () => {
      dashboard.title = titleInput.value.trim() || DEFAULT_DASHBOARD.title;
      markUpdated();
      saveDashboard();
      render();
    });
  }
  if (periodInput && !isPublicView) {
    periodInput.addEventListener("change", () => {
      dashboard.period = periodInput.value.trim() || DEFAULT_DASHBOARD.period;
      markUpdated();
      saveDashboard();
      render();
    });
  }

  app.querySelectorAll("[data-action]").forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();
      handleAction(button);
    });
  });

  app.querySelectorAll(".metric-input").forEach(input => {
    input.addEventListener("change", () => {
      const section = dashboard.sections[input.dataset.sectionId];
      const metric = section.metrics.find(item => item.id === input.dataset.metricId);
      if (!metric) return;
      metric[input.dataset.field] = parseLooseNumber(input.value);
      markUpdated(input.dataset.sectionId);
      syncExecutiveFromSections();
      saveDashboard();
      render();
    });
  });

  app.querySelectorAll(".kpi-input").forEach(input => {
    input.addEventListener("change", () => {
      const item = dashboard.sections.executive.kpis[Number(input.dataset.kpiIndex)];
      if (!item) return;
      item[input.dataset.field] = input.dataset.field === "label" ? input.value.trim() : parseLooseNumber(input.value);
      if (!item.label) item.label = "Новый KPI";
      markUpdated("executive");
      saveDashboard();
      render();
    });
  });

  app.querySelectorAll("[data-change]").forEach(input => {
    input.addEventListener("change", () => handleChange(input));
  });

  app.querySelectorAll("[data-edit-key]").forEach(element => {
    element.addEventListener("blur", () => {
      if (isPublicView) return;
      const value = element.textContent.trim();
      if (value !== element.dataset.original) applyTextEdit(element.dataset.editKey, value);
    });
    element.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        event.preventDefault();
        element.blur();
      }
    });
  });

  const fileInput = app.querySelector("#fileInput");
  if (fileInput) {
    fileInput.addEventListener("change", event => {
      const file = event.target.files && event.target.files[0];
      if (file) handleFile(file);
    });
  }
}

async function handleAction(button) {
  const action = button.dataset.action;

  if (action === "upload") app.querySelector("#fileInput")?.click();
  if (action === "template") downloadTemplate(button.dataset.template);
  if (action === "share") await createShareLink();
  if (action === "public-url") await savePublicUrlFromPrompt();
  if (action === "copy-share") await createShareLink();
  if (action === "copy-editor") await copyEditorLink();
  if (action === "logout") {
    await fetch("/api/logout", { method: "POST" });
    authState = { requiresPassword: true, authenticated: false };
    renderLogin();
  }
  if (action === "demo") {
    dashboard = mergeDashboard(DEFAULT_DASHBOARD);
    recomputeAll();
    await saveDashboard(true);
    render();
    showToast("Демо-данные загружены");
  }
  if (action === "reset") {
    if (!confirm("Сбросить дашборд к демо-данным?")) return;
    dashboard = mergeDashboard(DEFAULT_DASHBOARD);
    recomputeAll();
    await saveDashboard(true);
    render();
    showToast("Дашборд сброшен");
  }
  if (action === "clear-section") clearSection(activeSection);
  if (action === "add-kpi") addKpi();
  if (action === "remove-kpi") removeKpi(Number(button.dataset.kpiIndex));
  if (action === "add-roadmap") addRoadmapMonth();
  if (action === "remove-roadmap") removeAt(dashboard.sections.roadmap.months, Number(button.dataset.index), "roadmap");
  if (action === "add-content") addContentWeek();
  if (action === "add-content-item") addContentItem(Number(button.dataset.weekIndex));
  if (action === "toggle-content") toggleContent(Number(button.dataset.weekIndex), Number(button.dataset.itemIndex));
  if (action === "remove-content-item") removeContentItem(Number(button.dataset.weekIndex), Number(button.dataset.itemIndex));
  if (action === "remove-content-week") removeAt(dashboard.sections.content.weeks, Number(button.dataset.weekIndex), "content");
  if (action === "add-board") addProject();
  if (action === "set-stage") setProjectStage(Number(button.dataset.index), button.dataset.stage);
  if (action === "remove-project") removeAt(dashboard.sections.board.projects, Number(button.dataset.index), "board");
  if (action === "add-improvements") addImprovement();
  if (action === "remove-improvement") removeAt(dashboard.sections.improvements.items, Number(button.dataset.index), "improvements");
  if (action === "add-journey") addJourneyStep();
  if (action === "remove-journey-step") removeAt(dashboard.sections.journey.steps, Number(button.dataset.index), "journey");
  if (action === "add-employees") addEmployee();
  if (action === "add-report") addReport(Number(button.dataset.personIndex));
  if (action === "remove-report") removeReport(Number(button.dataset.personIndex), Number(button.dataset.reportIndex));
  if (action === "remove-employee") removeAt(dashboard.sections.employees.people, Number(button.dataset.personIndex), "employees");
  if (action === "prev-month") shiftMonth(-1);
  if (action === "next-month") shiftMonth(1);
}

function handleChange(input) {
  const change = input.dataset.change;

  if (change === "roadmap-status") {
    dashboard.sections.roadmap.months[Number(input.dataset.index)].status = input.value;
    touch("roadmap");
  }
  if (change === "content-type") {
    dashboard.sections.content.weeks[Number(input.dataset.weekIndex)].items[Number(input.dataset.itemIndex)].type = input.value;
    touch("content");
  }
  if (change === "project-due") {
    dashboard.sections.board.projects[Number(input.dataset.index)].due = input.value;
    touch("board");
  }
  if (change === "improvement-field") {
    const item = dashboard.sections.improvements.items[Number(input.dataset.index)];
    const field = input.dataset.field;
    item[field] = field === "rating" ? parseLooseNumber(input.value) : input.value;
    touch("improvements");
  }
  if (change === "journey-loss") {
    dashboard.sections.journey.steps[Number(input.dataset.index)].loss = input.checked;
    touch("journey");
  }
  if (change === "journey-note") {
    dashboard.sections.journey.steps[Number(input.dataset.index)].note = input.value;
    touch("journey");
  }
  if (change === "employee-month") {
    dashboard.sections.employees.month = input.value || dashboard.sections.employees.month;
    touch("employees", false);
    saveDashboard();
    render();
    return;
  }
  if (change === "employee-field") {
    const person = dashboard.sections.employees.people[Number(input.dataset.personIndex)];
    person[input.dataset.field] = parseLooseNumber(input.value);
    touch("employees");
  }
  if (change === "report-field") {
    const report = getReport(input);
    report[input.dataset.field] = input.value;
    touch("employees");
  }
  if (change === "report-completed") {
    const report = getReport(input);
    report.completed = input.checked;
    touch("employees");
  }

  saveDashboard();
  render();
}

function applyTextEdit(key, value) {
  const parts = key.split("-");
  if (!value) value = "Без названия";

  if (key.startsWith("roadmap-month-")) dashboard.sections.roadmap.months[Number(parts.at(-1))].month = value, touch("roadmap");
  if (key.startsWith("roadmap-task-")) dashboard.sections.roadmap.months[Number(parts.at(-1))].task = value, touch("roadmap");
  if (key.startsWith("roadmap-owner-")) dashboard.sections.roadmap.months[Number(parts.at(-1))].owner = value, touch("roadmap");
  if (key.startsWith("content-week-title-")) dashboard.sections.content.weeks[Number(parts.at(-1))].title = value, touch("content");
  if (key.startsWith("content-item-title-")) {
    const itemIndex = Number(parts.at(-1));
    const weekIndex = Number(parts.at(-2));
    dashboard.sections.content.weeks[weekIndex].items[itemIndex].title = value;
    touch("content");
  }
  if (key.startsWith("project-title-")) dashboard.sections.board.projects[Number(parts.at(-1))].title = value, touch("board");
  if (key.startsWith("project-owner-")) dashboard.sections.board.projects[Number(parts.at(-1))].owner = value, touch("board");
  if (key.startsWith("improvement-idea-card-")) dashboard.sections.improvements.items[Number(parts.at(-1))].idea = value, touch("improvements");
  if (key.startsWith("improvement-cost-")) dashboard.sections.improvements.items[Number(parts.at(-1))].cost = value, touch("improvements");
  if (key.startsWith("improvement-effect-")) dashboard.sections.improvements.items[Number(parts.at(-1))].effect = value, touch("improvements");
  if (key.startsWith("journey-title-")) dashboard.sections.journey.steps[Number(parts.at(-1))].title = value, touch("journey");
  if (key.startsWith("employee-name-")) dashboard.sections.employees.people[Number(parts.at(-1))].name = value, touch("employees");
  if (key.startsWith("report-title-")) {
    const reportIndex = Number(parts.at(-1));
    const personIndex = Number(parts.at(-2));
    dashboard.sections.employees.people[personIndex].reports[reportIndex].title = value;
    touch("employees");
  }

  saveDashboard();
  render();
}

async function saveDashboard(immediate = false) {
  if (isPublicView) return;
  if (!immediate) {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => saveDashboard(true), 350);
    return;
  }

  dashboard.updatedAt = dashboard.updatedAt || new Date().toISOString();
  if (!canUseServer) {
    localStorage.setItem("dashboard-studio", JSON.stringify(dashboard));
    return;
  }

  try {
    const response = await fetch("/api/dashboard", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dashboard })
    });
    const payload = await response.json();
    if (payload.dashboard) dashboard = mergeDashboard(payload.dashboard);
    if (payload.shareUrl) shareUrl = payload.shareUrl;
    if (payload.editorUrl) editorUrl = payload.editorUrl;
    publicViewBaseUrl = payload.publicViewBaseUrl || publicViewBaseUrl;
    lastSavedAt = dashboard.updatedAt;
  } catch (error) {
    localStorage.setItem("dashboard-studio", JSON.stringify(dashboard));
    showToast("Не удалось сохранить на сервере");
  }
}

async function createShareLink() {
  await saveDashboard(true);

  if (!canUseServer) {
    showToast("Для публичной ссылки нужен запущенный сервер");
    return;
  }

  let response = await fetch("/api/share", { method: "POST" });
  let payload = await response.json();
  shareUrl = payload.shareUrl || shareUrl;
  editorUrl = payload.editorUrl || editorUrl || location.origin + "/";

  if (!shareUrl || !shareUrl.startsWith("https://")) {
    const saved = await savePublicUrlFromPrompt(false);
    if (!saved) {
      showToast("Сначала сохраните публичный HTTPS-адрес");
      return;
    }
    response = await fetch("/api/share", { method: "POST" });
    payload = await response.json();
    shareUrl = payload.shareUrl || shareUrl;
  }

  if (!shareUrl || !shareUrl.startsWith("https://")) {
    showToast(payload.tunnelError || "Публичная HTTPS-ссылка не настроена");
    return;
  }

  await copyText(shareUrl);
  showToast("Ссылка руководителю скопирована");
}

async function savePublicUrlFromPrompt(shouldToast = true) {
  const value = prompt("Вставьте публичный адрес сервера. Например: https://dashboard-studio.onrender.com", publicViewBaseUrl || "");
  if (value === null) return false;
  const publicUrl = value.trim().replace(/\/+$/, "");
  if (publicUrl && !publicUrl.startsWith("https://")) {
    showToast("Адрес должен начинаться с https://");
    return false;
  }

  const response = await fetch("/api/public-url", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publicViewBaseUrl: publicUrl })
  });
  const payload = await response.json();
  if (!response.ok) {
    showToast(payload.error || "Не удалось сохранить публичный адрес");
    return false;
  }

  publicViewBaseUrl = payload.publicViewBaseUrl || "";
  shareUrl = payload.shareUrl || shareUrl;
  editorUrl = payload.editorUrl || editorUrl || location.origin + "/";
  if (shouldToast) showToast(publicViewBaseUrl ? "Публичный адрес сохранен" : "Публичный адрес очищен");
  return true;
}

async function copyEditorLink() {
  const value = editorUrl || location.origin + "/";
  await copyText(value);
  showToast("Ссылка редактора скопирована");
}

async function copyText(value) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const area = document.createElement("textarea");
  area.value = value;
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  document.execCommand("copy");
  area.remove();
}

function addKpi() {
  dashboard.sections.executive.kpis.push({
    id: newId("kpi"),
    label: "Новый KPI",
    plan: 0,
    fact: 0
  });
  markUpdated("executive");
  saveDashboard();
  render();
}

function removeKpi(index) {
  dashboard.sections.executive.kpis.splice(index, 1);
  markUpdated("executive");
  saveDashboard();
  render();
}

function clearSection(sectionId) {
  if (!confirm("Очистить этот раздел?")) return;
  dashboard.sections[sectionId] = structuredClone(DEFAULT_DASHBOARD.sections[sectionId]);
  markUpdated(sectionId);
  recomputeAll();
  saveDashboard();
  render();
}

function addRoadmapMonth() {
  dashboard.sections.roadmap.months.push({ id: newId("m"), month: "Новый месяц", task: "Новая задача", status: "plan", owner: "Ответственный" });
  touchAndRender("roadmap");
}

function addContentWeek() {
  const weeks = dashboard.sections.content.weeks;
  weeks.push({ id: newId("w"), title: `Неделя ${weeks.length + 1}`, items: [] });
  touchAndRender("content");
}

function addContentItem(weekIndex) {
  dashboard.sections.content.weeks[weekIndex].items.push({ id: newId("c"), type: "статьи", title: "Новый материал", status: "plan" });
  touchAndRender("content");
}

function toggleContent(weekIndex, itemIndex) {
  const item = dashboard.sections.content.weeks[weekIndex].items[itemIndex];
  item.status = item.status === "done" ? "plan" : "done";
  touchAndRender("content");
}

function removeContentItem(weekIndex, itemIndex) {
  dashboard.sections.content.weeks[weekIndex].items.splice(itemIndex, 1);
  touchAndRender("content");
}

function addProject() {
  dashboard.sections.board.projects.push({
    id: newId("p"),
    title: "Новый проект",
    owner: "Ответственный",
    stage: dashboard.sections.board.stages[0],
    due: ""
  });
  touchAndRender("board");
}

function setProjectStage(index, stage) {
  dashboard.sections.board.projects[index].stage = stage;
  touchAndRender("board");
}

function addImprovement() {
  const items = dashboard.sections.improvements.items;
  const maxId = Math.max(...items.map(item => Number(item.id) || 0), 0);
  items.push({ id: maxId + 1, idea: "Новая идея", priority: "средний", status: "идея", cost: "", effect: "", rating: 3 });
  touchAndRender("improvements");
}

function addJourneyStep() {
  dashboard.sections.journey.steps.push({ id: newId("j"), title: "Новый шаг", loss: false, note: "" });
  touchAndRender("journey");
}

function addEmployee() {
  dashboard.sections.employees.people.push({ id: newId("e"), name: "Новый сотрудник", plan: 0, done: 0, reports: [] });
  touchAndRender("employees");
}

function addReport(personIndex) {
  const month = dashboard.sections.employees.month || new Date().toISOString().slice(0, 7);
  dashboard.sections.employees.people[personIndex].reports.push({
    id: newId("r"),
    date: `${month}-01`,
    title: "Новый отчет",
    text: "",
    completed: false
  });
  touchAndRender("employees");
}

function removeReport(personIndex, reportIndex) {
  dashboard.sections.employees.people[personIndex].reports.splice(reportIndex, 1);
  touchAndRender("employees");
}

function removeAt(list, index, sectionId) {
  list.splice(index, 1);
  touchAndRender(sectionId);
}

function shiftMonth(delta) {
  const current = dashboard.sections.employees.month || new Date().toISOString().slice(0, 7);
  const [year, month] = current.split("-").map(Number);
  const date = new Date(year, month - 1 + delta, 1);
  dashboard.sections.employees.month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  touch("employees", false);
  saveDashboard();
  render();
}

function getReport(input) {
  return dashboard.sections.employees.people[Number(input.dataset.personIndex)].reports[Number(input.dataset.reportIndex)];
}

function touchAndRender(sectionId) {
  touch(sectionId);
  saveDashboard();
  render();
}

function touch(sectionId, updateDashboard = true) {
  const time = new Date().toISOString();
  if (updateDashboard) dashboard.updatedAt = time;
  if (sectionId && dashboard.sections[sectionId]) dashboard.sections[sectionId].updatedAt = time;
}

function markUpdated(sectionId) {
  dashboard.updatedAt = new Date().toISOString();
  if (sectionId && dashboard.sections[sectionId]) dashboard.sections[sectionId].updatedAt = dashboard.updatedAt;
}

function editableText(value, key, className, placeholder = "") {
  const text = value || placeholder || "Без названия";
  if (isPublicView) return `<div class="${className}">${escapeHtml(text)}</div>`;
  return `<div class="${className} editable" contenteditable="true" data-edit-key="${escapeAttribute(key)}" data-original="${escapeAttribute(text)}">${escapeHtml(text)}</div>`;
}

function renderSelect(change, index, field, options, value) {
  return `
    <select class="select" data-change="${change}" data-index="${index}" data-field="${field}">
      ${options.map(option => `<option value="${escapeAttribute(option)}" ${option === value ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
    </select>
  `;
}

function renderRatingSelect(index, value) {
  return `
    <select class="select" data-change="improvement-field" data-index="${index}" data-field="rating">
      ${[1, 2, 3, 4, 5].map(item => `<option value="${item}" ${Number(value) === item ? "selected" : ""}>${item}</option>`).join("")}
    </select>
  `;
}

function renderRowsTable(rows) {
  if (!rows.length) return `<div class="empty">Загрузите CSV или JSON для этого раздела</div>`;
  const headers = Object.keys(rows[0]).slice(0, 8);
  const visibleRows = rows.slice(-8).reverse();

  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>${headers.map(header => `<th>${escapeHtml(header)}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${visibleRows.map(row => `
            <tr>${headers.map(header => `<td>${escapeHtml(row[header] ?? "")}</td>`).join("")}</tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderMainChart(sectionId, data) {
  if (sectionId === "site") return renderLineChart(data.analysis.trend || [], "visitors");
  if (sectionId === "marketing") return renderBars(data.analysis.types || metricItems(data.metrics), "blue");
  return "";
}

function renderBreakdown(sectionId, data) {
  if (sectionId === "site") {
    return `
      <div class="breakdown">
        ${renderBreakdownGroup("Источники трафика", data.analysis.sources || [])}
        ${renderBreakdownGroup("Популярные страницы", data.analysis.pages || [])}
      </div>
    `;
  }

  let items = [];
  if (sectionId === "marketing") items = data.analysis.types || metricItems(data.metrics);
  if (!items.length) return `<div class="empty">Нет данных для разбивки</div>`;
  return renderBreakdownRows(items);
}

function renderBreakdownGroup(title, items) {
  if (!items.length) {
    return `
      <div class="breakdown-group">
        <div class="breakdown-group-title">${escapeHtml(title)}</div>
        <div class="empty">Нет данных</div>
      </div>
    `;
  }
  return `
    <div class="breakdown-group">
      <div class="breakdown-group-title">${escapeHtml(title)}</div>
      ${renderBreakdownRows(items)}
    </div>
  `;
}

function renderBreakdownRows(items) {
  const max = Math.max(...items.map(item => toNumber(item.value)), 1);
  return `
    <div class="breakdown">
      ${items.slice(0, 8).map(item => {
        const width = Math.max((toNumber(item.value) / max) * 100, 2);
        return `
          <div class="breakdown-row">
            <div class="breakdown-top">
              <div class="breakdown-label">${escapeHtml(item.label)}</div>
              <div class="breakdown-value">${formatNumber(item.value)}</div>
            </div>
            <div class="bar-track"><span class="bar-fill" style="width:${width}%"></span></div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderLineChart(points, key) {
  const normalized = Array.isArray(points) && points.length
    ? points.map(item => ({ label: item.label || item.date || "", value: toNumber(item[key] ?? item.value) }))
    : [];
  if (!normalized.length) return `<div class="empty">График появится после загрузки данных</div>`;

  const width = 720;
  const height = 230;
  const pad = 28;
  const max = Math.max(...normalized.map(item => item.value), 1);
  const step = normalized.length > 1 ? (width - pad * 2) / (normalized.length - 1) : 0;
  const coords = normalized.map((item, index) => {
    const x = pad + index * step;
    const y = height - pad - (item.value / max) * (height - pad * 2);
    return { ...item, x, y };
  });
  const d = coords.map((point, index) => `${index ? "L" : "M"}${point.x},${point.y}`).join(" ");
  const area = `${d} L${coords.at(-1).x},${height - pad} L${coords[0].x},${height - pad} Z`;

  return `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Динамика показателя">
      <path d="${area}" fill="#ecfdf5"></path>
      <path d="${d}" fill="none" stroke="#10a37f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>
      ${coords.map(point => `<circle cx="${point.x}" cy="${point.y}" r="4" fill="#10a37f"></circle>`).join("")}
      <line x1="${pad}" y1="${height - pad}" x2="${width - pad}" y2="${height - pad}" stroke="#e5e7eb"></line>
      ${coords.map((point, index) => index % Math.ceil(coords.length / 4) === 0
        ? `<text x="${point.x}" y="${height - 6}" text-anchor="middle" fill="#6b7280" font-size="11">${escapeHtml(shortLabel(point.label))}</text>`
        : ""
      ).join("")}
      <text x="${pad}" y="16" fill="#6b7280" font-size="11">${formatNumber(max)}</text>
    </svg>
  `;
}

function renderBars(items, tone) {
  const list = Array.isArray(items) ? items.filter(item => toNumber(item.value) > 0).slice(0, 10) : [];
  if (!list.length) return `<div class="empty">График появится после загрузки данных</div>`;

  const width = 720;
  const height = 230;
  const pad = 28;
  const barGap = 12;
  const max = Math.max(...list.map(item => toNumber(item.value)), 1);
  const barWidth = Math.max((width - pad * 2 - barGap * (list.length - 1)) / list.length, 22);
  const color = tone === "blue" ? "#2563eb" : "#10a37f";

  return `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Сравнение показателей">
      <line x1="${pad}" y1="${height - pad}" x2="${width - pad}" y2="${height - pad}" stroke="#e5e7eb"></line>
      ${list.map((item, index) => {
        const value = toNumber(item.value);
        const h = Math.max((value / max) * (height - pad * 2), 2);
        const x = pad + index * (barWidth + barGap);
        const y = height - pad - h;
        return `
          <rect x="${x}" y="${y}" width="${barWidth}" height="${h}" rx="5" fill="${color}"></rect>
          <text x="${x + barWidth / 2}" y="${y - 6}" text-anchor="middle" fill="#374151" font-size="11">${formatNumber(value)}</text>
          <text x="${x + barWidth / 2}" y="${height - 6}" text-anchor="middle" fill="#6b7280" font-size="10">${escapeHtml(shortLabel(item.label))}</text>
        `;
      }).join("")}
    </svg>
  `;
}

function handleFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const text = String(reader.result || "");
      const rows = file.name.toLowerCase().endsWith(".json") ? JSON.parse(text) : parseCsv(text);
      applyRows(Array.isArray(rows) ? rows : rows.rows || []);
    } catch (error) {
      showToast("Не удалось прочитать файл");
    }
  };
  reader.readAsText(file, "utf-8");
}

function applyRows(rows) {
  const sectionId = activeSection;
  if (sectionId === "executive") {
    const kpis = rows.map((row, index) => ({
      id: row.id || newId(`kpi-${index}`),
      label: firstText(row, ["kpi", "label", "name", "показатель"]) || "KPI",
      plan: firstNumber(row, ["plan", "план"]),
      fact: firstNumber(row, ["fact", "факт", "value"]),
      suffix: firstText(row, ["suffix", "единица"]) || ""
    }));
    dashboard.sections.executive.kpis = kpis;
  } else if (["site", "marketing"].includes(sectionId)) {
    dashboard.sections[sectionId].rows = rows;
  } else {
    showToast("В этом разделе данные редактируются вручную");
    return;
  }

  markUpdated(sectionId);
  recomputeAll();
  saveDashboard();
  render();
  showToast("Данные загружены");
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const separator = lines[0].includes(";") ? ";" : ",";
  const headers = lines[0].split(separator).map(item => item.trim());
  return lines.slice(1).map(line => {
    const cells = line.split(separator);
    return Object.fromEntries(headers.map((header, index) => [header, cells[index]?.trim() ?? ""]));
  });
}

function downloadTemplate(sectionId) {
  const content = TEMPLATES[sectionId];
  if (!content) return;
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${sectionId}-template.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function recomputeAll() {
  aggregateSite(dashboard.sections.site);
  aggregateMarketing(dashboard.sections.marketing);
  syncExecutiveFromSections();
}

function aggregateSite(section) {
  const rows = section.rows || [];
  const visitors = sum(rows, ["visitors", "посетители"]);
  const pageviews = sum(rows, ["pageviews", "views", "просмотры"]);
  const leads = sum(rows, ["leads", "заявки"]);
  setMetric(section, "visitors", visitors);
  setMetric(section, "pageViews", pageviews);
  setMetric(section, "conversion", visitors ? round((leads / visitors) * 100, 1) : 0);
  const sources = groupRows(rows, ["source", "источник"], ["visitors", "посетители"]);
  const pages = groupRows(rows, ["page", "страница"], ["pageviews", "views", "просмотры"]);
  setMetric(section, "topSources", sources.length);
  setMetric(section, "topPages", pages.length);
  section.analysis = {
    trend: rows.map(row => ({ label: row.date || row.period || "", visitors: firstNumber(row, ["visitors", "посетители"]) })),
    sources,
    pages
  };
}

function aggregateMarketing(section) {
  const rows = section.rows || [];
  const types = groupRows(rows, ["type", "тип"], ["count", "value", "количество"]);
  setMetric(section, "exhibitions", valueFor(types, ["выстав", "exhibition"]));
  setMetric(section, "campaigns", valueFor(types, ["кампан", "campaign"]));
  setMetric(section, "articles", valueFor(types, ["стать", "article"]));
  setMetric(section, "cases", valueFor(types, ["кейс", "case"]));
  setMetric(section, "news", valueFor(types, ["новост", "news"]));
  section.analysis = { types };
}

function syncExecutiveFromSections() {
  const kpis = dashboard.sections.executive.kpis;
  updateKpi(kpis, "requests", sum(dashboard.sections.site.rows || [], ["leads", "заявки"]));
  updateKpi(kpis, "siteConversion", getMetric(dashboard.sections.site, "conversion"));
  updateKpi(kpis, "newArticles", getMetric(dashboard.sections.marketing, "articles"));
  updateKpi(kpis, "cases", getMetric(dashboard.sections.marketing, "cases"));
}

function updateKpi(kpis, id, value) {
  const item = kpis.find(kpi => kpi.id === id);
  if (item) item.fact = value;
}

function setMetric(section, id, value) {
  const metric = section.metrics.find(item => item.id === id);
  if (metric) metric.value = Number.isFinite(value) ? value : 0;
}

function getMetric(section, id) {
  return section.metrics.find(item => item.id === id)?.value ?? 0;
}

function groupRows(rows, labelAliases, valueAliases) {
  const map = new Map();
  for (const row of rows) {
    const label = firstText(row, labelAliases) || "Без категории";
    const value = firstNumber(row, valueAliases);
    map.set(label, (map.get(label) || 0) + value);
  }
  return [...map.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

function sum(rows, aliases) {
  return rows.reduce((total, row) => total + firstNumber(row, aliases), 0);
}

function firstText(row, aliases) {
  const entries = Object.entries(row || {});
  for (const alias of aliases) {
    const found = entries.find(([key]) => key.toLowerCase().trim() === alias.toLowerCase());
    if (found) return String(found[1] ?? "").trim();
  }
  for (const alias of aliases) {
    const found = entries.find(([key]) => key.toLowerCase().includes(alias.toLowerCase()));
    if (found) return String(found[1] ?? "").trim();
  }
  return "";
}

function firstNumber(row, aliases) {
  const direct = firstText(row, aliases);
  if (!direct) return 0;
  return parseLooseNumber(direct);
}

function valueFor(items, needles) {
  return items
    .filter(item => needles.some(needle => item.label.toLowerCase().includes(needle.toLowerCase())))
    .reduce((total, item) => total + toNumber(item.value), 0);
}

function metricItems(metrics) {
  return metrics.map(metric => ({ label: metric.label, value: metric.value }));
}

function chartTitle(sectionId) {
  return {
    site: "Динамика посетителей",
    marketing: "Активности маркетинга"
  }[sectionId] || "График";
}

function sideTitle(sectionId) {
  return {
    site: "Источники и страницы",
    marketing: "Типы активностей"
  }[sectionId] || "Разбивка";
}

function startPolling() {
  clearInterval(pollTimer);
  pollTimer = setInterval(async () => {
    try {
      const response = await fetch(`/api/public/${publicToken}`, { cache: "no-store" });
      if (!response.ok) return;
      const payload = await response.json();
      if (payload.dashboard?.updatedAt && payload.dashboard.updatedAt !== dashboard.updatedAt) {
        dashboard = mergeDashboard(payload.dashboard);
        recomputeAll();
        render();
      }
    } catch (error) {
      // keep the current view
    }
  }, 15000);
}

function parseLooseNumber(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const cleaned = String(value || "")
    .replace(/\s/g, "")
    .replace("%", "")
    .replace(",", ".")
    .replace(/[^0-9.-]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toNumber(value) {
  return Number.isFinite(Number(value)) ? Number(value) : parseLooseNumber(value);
}

function round(value, decimals) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function ratio(done, plan) {
  const denominator = toNumber(plan);
  if (!denominator) return 0;
  return toNumber(done) / denominator;
}

function normalStatus(ratioValue) {
  if (ratioValue >= 1) return "";
  if (ratioValue >= 0.85) return "low";
  return "bad";
}

function statusSymbol(status) {
  if (status === "done") return "✓";
  if (status === "progress") return "→";
  return "план";
}

function priorityBadge(priority) {
  const className = priority === "высокий" ? "bad" : priority === "средний" ? "neutral" : "good";
  return `<span class="status-pill ${className}">${escapeHtml(priority)}</span>`;
}

function stars(value) {
  return "★★★★★".slice(0, Math.max(0, Math.min(Number(value) || 0, 5)));
}

function formatNumber(value) {
  const number = toNumber(value);
  return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 }).format(number);
}

function formatDateTime(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function formatMonth(value) {
  if (!value) return "";
  const [year, month] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("ru-RU", { month: "long", year: "numeric" }).format(new Date(year, month - 1, 1));
}

function shortLabel(value) {
  const text = String(value || "");
  return text.length > 12 ? `${text.slice(0, 11)}…` : text;
}

function newId(prefix) {
  return `${prefix}-${Math.random().toString(16).slice(2)}-${Date.now().toString(16)}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function icon(name) {
  const icons = {
    globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M2 12h20"></path><path d="M12 2a15 15 0 0 1 0 20"></path><path d="M12 2a15 15 0 0 0 0 20"></path></svg>`,
    inbox: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-6l-2 3h-4l-2-3H2"></path><path d="M5.5 5h13L22 12v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6z"></path></svg>`,
    megaphone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 11 18-5v12L3 14z"></path><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path></svg>`,
    map: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18 3 21V6l6-3 6 3 6-3v15l-6 3z"></path><path d="M9 3v15"></path><path d="M15 6v15"></path></svg>`,
    calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M16 2v4"></path><path d="M8 2v4"></path><path d="M3 10h18"></path></svg>`,
    board: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"></rect><path d="M9 4v16"></path><path d="M15 4v16"></path></svg>`,
    star: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 2 3 7 7 .6-5.3 4.7 1.6 7L12 17.5 5.7 21.3l1.6-7L2 9.6 9 9z"></path></svg>`,
    path: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="3"></circle><circle cx="18" cy="18" r="3"></circle><path d="M9 6h3a6 6 0 0 1 0 12h-3"></path></svg>`,
    users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.9"></path><path d="M16 3.1a4 4 0 0 1 0 7.8"></path></svg>`,
    target: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`,
    spark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"></path><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"></path></svg>`,
    link: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1"></path><path d="M14 11a5 5 0 0 0-7.1 0l-2 2a5 5 0 0 0 7.1 7.1l1.1-1.1"></path></svg>`,
    copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"></rect><rect x="2" y="2" width="13" height="13" rx="2"></rect></svg>`,
    reset: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 3-6.7"></path><path d="M3 3v6h6"></path></svg>`,
    upload: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12"></path><path d="m7 8 5-5 5 5"></path><path d="M5 21h14"></path></svg>`,
    download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12"></path><path d="m7 10 5 5 5-5"></path><path d="M5 21h14"></path></svg>`,
    plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>`,
    trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"></path><path d="M8 6V4h8v2"></path><path d="m19 6-1 14H6L5 6"></path></svg>`,
    left: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"></path></svg>`,
    right: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"></path></svg>`
  };
  return icons[name] || icons.target;
}
