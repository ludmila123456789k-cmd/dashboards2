const SECTIONS = [
  { id: "roadmap", label: "Marketing Roadmap", icon: "map" },
  { id: "content", label: "Контент-календарь", icon: "calendar" },
  { id: "board", label: "Доска проектов", icon: "board" },
  { id: "employees", label: "Отчеты сотрудников", icon: "users" },
  { id: "settings", label: "Настройки", icon: "settings" }
];

const CONTENT_TYPES = ["статьи", "новости", "кейсы", "соцсети", "email", "выставки", "категории", "товары", "отзывы", "съемка видео", "съемка фото"];
const ROADMAP_STATUSES = [
  { value: "done", label: "Выполнено" },
  { value: "progress", label: "В работе" },
  { value: "plan", label: "План" }
];
const REPORT_STATUSES = [
  { value: "plan", label: "План" },
  { value: "progress", label: "В работе" },
  { value: "done", label: "Выполнено" }
];
const PRIORITIES = ["высокий", "средний", "низкий"];
const IMPROVEMENT_STATUSES = ["идея", "план", "Планируется", "разработка", "тестирование", "готово"];

const DEFAULT_WORKSPACE = {
  title: "Система развития сайта и маркетинга",
  period: "2026",
  updatedAt: new Date().toISOString(),
  sections: {
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
        { id: 12, idea: "Добавить калькулятор", priority: "высокий", status: "Планируется", cost: "40 тыс", effect: "Увеличение заявок", rating: 5 },
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
      day: "2026-06-07",
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

const app = document.querySelector("#app");
const toast = document.querySelector("#toast");
const publicMatch = location.pathname.match(/^\/view\/([a-f0-9]{20})/);
const isPublicView = Boolean(publicMatch);
const publicToken = publicMatch ? publicMatch[1] : null;
const canUseServer = location.protocol !== "file:";

let workspace = null;
let activeSection = "roadmap";
let activeEmployeeId = "";
let shareUrl = "";
let editorUrl = "";
let publicViewBaseUrl = "";
let saveTimer = null;
let pollTimer = null;
let lastSavedAt = "";
let authState = { requiresPassword: false, authenticated: true };
let backups = [];
const undoStack = [];
const expandedCalendarMonths = new Set();

bootstrap();

async function bootstrap() {
  try {
    if (isPublicView) {
      await loadPublicWorkspace();
      startPolling();
    } else {
      await checkAuth();
      if (authState.requiresPassword && !authState.authenticated) {
        renderLogin();
        return;
      }
      await loadOwnerWorkspace();
      await loadBackups(false);
    }
    render();
  } catch (error) {
    if (error.message === "AUTH_REQUIRED") return;
    workspace = loadLocalWorkspace();
    render();
    showToast("Сервер недоступен, изменения сохраняются только в этом браузере");
  }
}

async function checkAuth() {
  if (!canUseServer || isPublicView) return;
  const response = await fetch("/api/auth", { cache: "no-store" });
  if (!response.ok) return;
  authState = await response.json();
}

async function loadOwnerWorkspace() {
  if (!canUseServer) {
    workspace = loadLocalWorkspace();
    return;
  }

  const response = await fetch("/api/workspace", { cache: "no-store" });
  if (response.status === 401) {
    authState = { requiresPassword: true, authenticated: false };
    renderLogin();
    throw new Error("AUTH_REQUIRED");
  }
  if (!response.ok) throw new Error("Не удалось загрузить данные");
  const payload = await response.json();
  workspace = mergeWorkspace(payload.workspace);
  shareUrl = payload.shareUrl || "";
  editorUrl = payload.editorUrl || location.origin + "/";
  publicViewBaseUrl = payload.publicViewBaseUrl || "";
}

async function loadPublicWorkspace() {
  const response = await fetch(`/api/public/${publicToken}`, { cache: "no-store" });
  if (!response.ok) throw new Error("Ссылка недоступна");
  const payload = await response.json();
  workspace = mergeWorkspace(payload.workspace);
  lastSavedAt = payload.updatedAt || workspace.updatedAt || "";
}

function loadLocalWorkspace() {
  try {
    const stored = localStorage.getItem("marketing-system-workspace");
    return mergeWorkspace(stored ? JSON.parse(stored) : DEFAULT_WORKSPACE);
  } catch (error) {
    return mergeWorkspace(DEFAULT_WORKSPACE);
  }
}

function mergeWorkspace(source) {
  const merged = clone(DEFAULT_WORKSPACE);
  const incoming = source && typeof source === "object" ? source : {};

  merged.title = incoming.title || merged.title;
  merged.period = incoming.period || merged.period;
  merged.updatedAt = incoming.updatedAt || merged.updatedAt;

  for (const item of SECTIONS) {
    if (incoming.sections && incoming.sections[item.id]) {
      merged.sections[item.id] = {
        ...merged.sections[item.id],
        ...incoming.sections[item.id]
      };
    }
  }

  upgradeCalendarData(merged);
  return merged;
}

function upgradeCalendarData(target) {
  const fallbackMonth = "2026-06";
  const roadmap = target.sections.roadmap;
  roadmap.calendarMonth = validMonthValue(roadmap.calendarMonth) ? roadmap.calendarMonth : fallbackMonth;
  roadmap.hiddenMonths = Array.isArray(roadmap.hiddenMonths) ? roadmap.hiddenMonths.filter(validMonthValue) : [];
  (roadmap.months || []).forEach((item, index) => {
    if (!validDateValue(item.date)) {
      item.date = `${target.period || "2026"}-${String((index % 12) + 1).padStart(2, "0")}-01`;
    }
  });

  const content = target.sections.content;
  content.calendarMonth = validMonthValue(content.calendarMonth) ? content.calendarMonth : fallbackMonth;
  content.hiddenMonths = Array.isArray(content.hiddenMonths) ? content.hiddenMonths.filter(validMonthValue) : [];
  (content.weeks || []).forEach((week, weekIndex) => {
    (week.items || []).forEach((item, itemIndex) => {
      if (!validDateValue(item.date)) {
        const day = Math.min(28, 1 + weekIndex * 7 + itemIndex);
        item.date = `${content.calendarMonth}-${String(day).padStart(2, "0")}`;
      }
      item.types = normalizeContentTypes(item);
      item.type = item.types[0] || "";
    });
  });

  const employees = target.sections.employees;
  employees.month = validMonthValue(employees.month) ? employees.month : fallbackMonth;
  const employeeReports = (employees.people || []).flatMap(person => person.reports || []);
  employeeReports.forEach(report => {
    if (!REPORT_STATUSES.some(status => status.value === report.status)) {
      report.status = report.completed ? "done" : "plan";
    }
    report.completed = report.status === "done";
  });
  const firstReportInMonth = employeeReports
    .map(report => report.date)
    .filter(date => validDateValue(date) && monthFromDate(date) === employees.month)
    .sort()[0];
  if (!validDateValue(employees.day) || monthFromDate(employees.day) !== employees.month) {
    employees.day = firstReportInMonth || `${employees.month}-01`;
  }
  employees.month = monthFromDate(employees.day) || employees.month;
}

function render() {
  const section = SECTIONS.find(item => item.id === activeSection) || SECTIONS[0];
  activeSection = section.id;

  app.innerHTML = `
    <div class="shell">
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-mark">K</div>
          <div>
            <div class="brand-title">konglomerat</div>
            <div class="brand-subtitle">${isPublicView ? "Просмотр руководителя" : "Редактор"}</div>
          </div>
        </div>
        <nav class="nav" aria-label="Разделы">
          ${SECTIONS.map(item => `
            <button class="nav-button ${item.id === activeSection ? "active" : ""}" type="button" data-section="${item.id}">
              <span class="nav-icon">${icon(item.icon)}</span>
              <span>${item.label}</span>
            </button>
          `).join("")}
        </nav>
        <div class="sidebar-footer">
          <div>Обновлено: ${formatDateTime(workspace.updatedAt)}</div>
          <div>${isPublicView ? "Автообновление каждые 15 секунд" : "Изменения сохраняются автоматически"}</div>
        </div>
      </aside>

      <main class="main">
        <header class="topbar">
          <div class="top-actions">
            ${isPublicView ? "" : `
              <button class="button" type="button" data-action="public-url">${icon("link")} Публичный адрес</button>
              <button class="button" type="button" data-action="copy-editor">${icon("copy")} Ссылка редактора</button>
              <button class="button" type="button" data-action="undo" ${undoStack.length ? "" : "disabled"}>${icon("undo")} Назад</button>
              ${authState.requiresPassword ? `<button class="button ghost" type="button" data-action="logout">${icon("reset")} Выйти</button>` : ""}
            `}
          </div>
        </header>

        <div class="content">
          ${isPublicView ? renderViewBanner() : ""}
          ${renderSection(section)}
        </div>
      </main>
    </div>
  `;

  bindEvents();
}

function renderLogin() {
  app.innerHTML = `
    <div class="login-wrap">
      <form class="login-card" id="loginForm">
        <div>
          <div class="login-title">Вход в редактор</div>
          <div class="login-note">Публичная ссылка для руководителя работает без пароля. Пароль нужен только для изменения системы.</div>
        </div>
        <label>
          <span class="sr-only">Пароль</span>
          <input class="field" id="passwordInput" type="password" placeholder="Пароль редактора" autocomplete="current-password" required>
        </label>
        <button class="button primary" type="submit">${icon("link")} Войти</button>
      </form>
    </div>
  `;

  const form = app.querySelector("#loginForm");
  form.addEventListener("submit", async event => {
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

function renderViewBanner() {
  return `
    <div class="view-banner">
      <strong>Режим просмотра</strong>
      <span>Последнее обновление: ${formatDateTime(workspace.updatedAt)}</span>
    </div>
  `;
}

function renderSharePanel() {
  const managerLink = shareUrl && shareUrl.startsWith("https://") ? shareUrl : "";
  return `
    <div class="share-panel">
      <label for="shareInput">Ссылка для руководителя</label>
      <div class="share-row">
        <input id="shareInput" class="share-input" readonly value="${escapeAttribute(managerLink || "Нажмите «Ссылка руководителю», чтобы создать публичную ссылку")}">
        <button class="button" type="button" data-action="copy-share">${icon("copy")} Копировать</button>
      </div>
      <label for="publicBaseInput">Публичный адрес сервера</label>
      <div class="share-row">
        <input id="publicBaseInput" class="share-input" value="${escapeAttribute(publicViewBaseUrl)}" placeholder="https://ваш-домен">
        <button class="button" type="button" data-action="save-public-url">Сохранить</button>
      </div>
      <div class="share-hint">Сохраните адрес один раз, потом кнопка будет копировать ссылку руководителю автоматически.</div>
      <label for="editorInput">Ссылка редактора</label>
      <div class="share-row">
        <input id="editorInput" class="share-input" readonly value="${escapeAttribute(editorUrl || location.origin + "/")}">
        <button class="button" type="button" data-action="copy-editor">${icon("copy")} Копировать</button>
      </div>
    </div>
  `;
}

function renderSection(section) {
  return `
    <section>
      ${renderSectionActions(section.id)}
      ${section.id === "employees" ? "" : renderStats(section.id)}
      ${renderSectionBody(section.id)}
    </section>
  `;
}

function renderSectionActions(sectionId) {
  if (isPublicView) return "";
  if (sectionId === "settings") return "";

  if (sectionId === "employees") {
    const people = workspace.sections.employees.people || [];
    const selectedIndex = getActiveEmployeeIndex(people);
    return `
      <div class="section-actions">
        <button class="button" type="button" data-action="add-employees">${icon("plus")} Сотрудник</button>
        ${selectedIndex >= 0 ? `<button class="button danger" type="button" data-action="remove-employee" data-person-index="${selectedIndex}">${icon("trash")} Удалить сотрудника</button>` : ""}
      </div>
    `;
  }

  const addLabels = {
    roadmap: "Месяц",
    content: "Неделя",
    board: "Проект",
    improvements: "Идея",
    employees: "Сотрудник"
  };

  return `
    <div class="section-actions">
      <button class="button" type="button" data-action="add-${sectionId}">${icon("plus")} ${addLabels[sectionId]}</button>
    </div>
  `;
}

function renderStats(sectionId) {
  const stats = getStats(sectionId);
  if (!stats.length) return "";

  return `
    <div class="stats-grid">
      ${stats.map(item => `
        <article class="stat-card">
          <div class="stat-label">${escapeHtml(item.label)}</div>
          <div class="stat-value">${escapeHtml(item.value)}</div>
          <div class="stat-note">${escapeHtml(item.note || "")}</div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderSectionBody(sectionId) {
  if (sectionId === "roadmap") return renderRoadmap();
  if (sectionId === "content") return renderContent();
  if (sectionId === "board") return renderBoard();
  if (sectionId === "improvements") return renderImprovements();
  if (sectionId === "employees") return renderEmployees();
  if (sectionId === "settings") return renderSettings();
  return "";
}

function renderSectionActions(sectionId) {
  if (isPublicView) return "";
  if (sectionId === "settings") return "";

  if (sectionId === "employees") {
    const people = workspace.sections.employees.people || [];
    const selectedIndex = getActiveEmployeeIndex(people);
    return `
      <div class="section-actions">
        <button class="button" type="button" data-action="add-employees">${icon("plus")} Сотрудник</button>
        ${selectedIndex >= 0 ? `<button class="button danger" type="button" data-action="remove-employee" data-person-index="${selectedIndex}">${icon("trash")} Удалить сотрудника</button>` : ""}
      </div>
    `;
  }

  const addLabels = {
    roadmap: "Месяц",
    content: "Материал",
    board: "Проект",
    improvements: "Идея",
    employees: "Сотрудник"
  };

  return `
    <div class="section-actions">
      <button class="button" type="button" data-action="add-${sectionId}">${icon("plus")} ${addLabels[sectionId] || "Добавить"}</button>
    </div>
  `;
}

function renderRoadmap() {
  const data = workspace.sections.roadmap;
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
  const data = workspace.sections.content;
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
  const board = workspace.sections.board;
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
  const index = workspace.sections.board.projects.findIndex(item => item.id === project.id);
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
          ${workspace.sections.board.stages.map(stage => `
            <button class="stage-button ${stage === project.stage ? "active" : ""}" type="button" data-action="set-stage" data-index="${index}" data-stage="${escapeAttribute(stage)}">${escapeHtml(stage)}</button>
          `).join("")}
        </div>
        <button class="button small danger" type="button" data-action="remove-project" data-index="${index}">${icon("trash")} Удалить</button>
      `}
    </article>
  `;
}

function renderImprovements() {
  const items = workspace.sections.improvements.items;
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
  const steps = workspace.sections.journey.steps;
  return `
    <div class="panel">
      <div class="panel-title">Карта пути клиента <span>красным отмечены места потерь</span></div>
      <div class="journey">
        ${steps.map((step, index) => `
          <article class="journey-step ${step.loss ? "loss" : ""}">
            <div class="journey-index">${index + 1}</div>
            <div>
              ${editableText(step.title, `journey-title-${index}`, "journey-title")}
              ${step.loss ? `<div class="loss-label">● Где теряются клиенты</div>` : ""}
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
  const data = workspace.sections.employees;
  const selectedDay = validDateValue(data.day) ? data.day : `${data.month || "2026-06"}-01`;
  const selectedMonth = monthFromDate(selectedDay) || data.month || "2026-06";
  const dayLabel = formatDate(selectedDay);
  const people = Array.isArray(data.people) ? data.people : [];
  const selectedIndex = getActiveEmployeeIndex(people);
  const selectedPerson = selectedIndex >= 0 ? people[selectedIndex] : null;
  return `
    <div class="employee-workspace">
      <aside class="panel employee-sidebar">
        <div class="panel-title">
          Сотрудники
          ${isPublicView ? "" : `<button class="button small" type="button" data-action="add-employees">${icon("plus")} Сотрудник</button>`}
        </div>
        <div class="employee-tabs">
          ${people.map((person, personIndex) => renderEmployeeTab(person, personIndex)).join("") || `<div class="empty">Добавьте сотрудника</div>`}
        </div>
      </aside>

      <div class="panel employee-detail-panel">
        <div class="panel-title">
          Задачи за ${escapeHtml(dayLabel)}
          ${isPublicView ? "" : `
            <span class="inline-actions">
              <button class="button small" type="button" data-action="prev-day">${icon("left")} День</button>
              <input class="field" type="date" data-change="employee-day" value="${escapeAttribute(selectedDay)}" style="width:160px">
              <button class="button small" type="button" data-action="next-day">День ${icon("right")}</button>
            </span>
          `}
        </div>
        ${selectedPerson ? renderEmployee(selectedPerson, selectedIndex, selectedDay, selectedMonth) : `<div class="empty">Выберите сотрудника слева</div>`}
      </div>
    </div>
  `;
}

function renderEmployeeTab(person, personIndex) {
  const employeeId = employeeKey(person, personIndex);
  const isActive = employeeId === activeEmployeeId;
  const completedCount = employeeCompletedReportsForMonth(person, selectedEmployeeMonth());
  return `
    <div class="employee-tab ${isActive ? "active" : ""}">
      <button class="employee-tab-button" type="button" data-action="select-employee" data-employee-id="${escapeAttribute(employeeId)}">
        <span>${escapeHtml(person.name || "Сотрудник")}</span>
        <span class="count-pill">${completedCount}</span>
      </button>
      ${isPublicView ? "" : `
        <input class="employee-tab-input" data-change="employee-name-field" data-person-index="${personIndex}" value="${escapeAttribute(person.name || "")}" placeholder="Фамилия">
      `}
    </div>
  `;
}

function selectedEmployeeMonth() {
  const data = workspace.sections.employees || {};
  return monthFromDate(data.day) || data.month || "";
}

function employeeCompletedReportsForMonth(person, month) {
  return (person.reports || []).filter(report =>
    (!month || String(report.date || "").startsWith(month)) && reportStatusValue(report) === "done"
  ).length;
}

function renderEmployee(person, personIndex, day, month) {
  const monthReports = (person.reports || [])
    .filter(report => !month || String(report.date || "").startsWith(month))
    .sort(compareReportsByDate);
  const reports = monthReports
    .filter(report => !day || String(report.date || "") === day)
    .sort(compareReportsByDate);

  return `
    <section class="employee-card employee-detail-card">
      <div class="employee-summary">
        <div>
          <div class="employee-name">${escapeHtml(person.name || "Сотрудник")}</div>
        </div>
        ${isPublicView ? "" : `<button class="button small" type="button" data-action="add-report" data-person-index="${personIndex}">${icon("plus")} Задача</button>`}
      </div>
      <div class="employee-body">
        ${renderEmployeeMonthlySummary(person, monthReports, month)}
        ${reports.map(report => renderReport(report, personIndex)).join("") || `<div class="empty">Нет задач за выбранный день</div>`}
      </div>
    </section>
  `;
}

function renderEmployeeMonthlySummary(person, reports, month) {
  const completed = reports.filter(report => reportStatusValue(report) === "done").length;
  const inProgress = reports.filter(report => reportStatusValue(report) === "progress").length;
  const planned = reports.filter(report => reportStatusValue(report) === "plan").length;
  const dateRange = reports.length ? `${formatDate(reports[0].date)} - ${formatDate(reports[reports.length - 1].date)}` : "нет задач";
  const reportTitles = reports.map(report => report.title || "Без названия").join(", ") || "Нет задач за месяц";

  return `
    <details class="monthly-summary">
      <summary class="monthly-summary-title">
        <span>Сводка за месяц</span>
        <span class="count-pill">${reports.length}</span>
      </summary>
      <div class="monthly-summary-body">
        <div><strong>${escapeHtml(person.name || "Сотрудник")}</strong></div>
        <div>Период: ${escapeHtml(formatMonth(month))}</div>
        <div>Задач: ${reports.length}</div>
        <div>Выполнено: ${completed}</div>
        <div>В работе: ${inProgress}</div>
        <div>В плане: ${planned}</div>
        <div>Даты: ${escapeHtml(dateRange)}</div>
        <div>Темы: ${escapeHtml(reportTitles)}</div>
      </div>
    </details>
  `;
}

function renderReport(report, personIndex) {
  const reportIndex = workspace.sections.employees.people[personIndex].reports.findIndex(item => item.id === report.id);
  const status = reportStatusValue(report);
  return `
    <details class="report-card">
      <summary class="report-summary">
        <div>
          ${editableText(report.title, `report-title-${personIndex}-${reportIndex}`, "report-title")}
          <div class="report-date">${escapeHtml(formatDate(report.date))}</div>
        </div>
        <span class="check ${status}">${reportStatusLabel(status)}</span>
      </summary>
      <div class="report-body">
        ${isPublicView
          ? `<div>${escapeHtml(report.text || "")}</div>`
          : `
            <input class="field" type="date" data-change="report-field" data-person-index="${personIndex}" data-report-index="${reportIndex}" data-field="date" value="${escapeAttribute(report.date || "")}">
            <textarea class="textarea" data-change="report-field" data-person-index="${personIndex}" data-report-index="${reportIndex}" data-field="text">${escapeHtml(report.text || "")}</textarea>
            <select class="select" data-change="report-status" data-person-index="${personIndex}" data-report-index="${reportIndex}">
              ${REPORT_STATUSES.map(option => `<option value="${option.value}" ${option.value === status ? "selected" : ""}>${option.label}</option>`).join("")}
            </select>
            <button class="button small danger" type="button" data-action="remove-report" data-person-index="${personIndex}" data-report-index="${reportIndex}">${icon("trash")} Удалить задачу</button>
          `}
      </div>
    </details>
  `;
}

function renderSettings() {
  return `
    <div class="settings-grid">
      <section class="panel">
        <div class="panel-title">
          Быстрый откат
          <span>${undoStack.length ? `${undoStack.length} действий` : "нет действий"}</span>
        </div>
        <div class="settings-row">
          <div>
            <div class="settings-title">Действие назад</div>
            <div class="settings-note">Откатывает последнее изменение, сделанное после открытия этой страницы.</div>
          </div>
          <button class="button" type="button" data-action="undo" ${undoStack.length ? "" : "disabled"}>${icon("undo")} Назад</button>
        </div>
      </section>

      <section class="panel">
        <div class="panel-title">
          Резервные копии
          <span>${backups.length ? `${backups.length} копий` : "копий пока нет"}</span>
        </div>
        <div class="settings-actions">
          <button class="button primary" type="button" data-action="create-backup">${icon("save")} Создать копию</button>
          <button class="button" type="button" data-action="download-backup">${icon("download")} Скачать на компьютер</button>
          <button class="button" type="button" data-action="choose-backup-file">${icon("upload")} Загрузить обратно</button>
          <button class="button" type="button" data-action="refresh-backups">${icon("reset")} Обновить</button>
          <input class="sr-only" type="file" accept=".json,application/json" data-change="import-backup-file">
        </div>
        <div class="backup-list">
          ${backups.map(backup => `
            <article class="backup-item">
              <div>
                <div class="backup-date">${escapeHtml(formatDateTime(backup.createdAt))}</div>
                <div class="backup-meta">${escapeHtml(backupReasonLabel(backup.reason))} · данные от ${escapeHtml(formatDateTime(backup.workspaceUpdatedAt))}</div>
              </div>
              <button class="button small" type="button" data-action="restore-backup" data-backup-id="${escapeAttribute(backup.id)}">${icon("reset")} Восстановить</button>
            </article>
          `).join("") || `<div class="empty">Создайте первую резервную копию</div>`}
        </div>
      </section>
    </div>
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

function employeeKey(person, personIndex) {
  return person?.id || `employee-${personIndex}`;
}

function getActiveEmployeeIndex(people) {
  if (!people.length) return -1;
  const currentIndex = people.findIndex((person, index) => employeeKey(person, index) === activeEmployeeId);
  if (currentIndex >= 0) return currentIndex;
  activeEmployeeId = employeeKey(people[0], 0);
  return 0;
}

function bindEvents() {
  app.querySelectorAll("[data-section]").forEach(button => {
    button.addEventListener("click", () => {
      activeSection = button.dataset.section;
      render();
    });
  });

  if (!isPublicView) {
    app.querySelectorAll("[contenteditable][data-edit]").forEach(element => {
      element.addEventListener("blur", () => {
        rememberUndo();
        applyTextEdit(element.dataset.edit, element.textContent.trim());
      });
      element.addEventListener("keydown", event => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          element.blur();
        }
      });
    });

    app.querySelectorAll("[data-change]").forEach(input => {
      input.addEventListener("change", () => {
        rememberUndo();
        handleChange(input);
      });
    });
  }

  app.querySelectorAll("[data-action]").forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();
      handleAction(button);
    });
  });
}

async function handleAction(button) {
  const action = button.dataset.action;

  if (action === "undo") return undoLastChange();
  if (action === "share") return createShareLink();
  if (action === "public-url") return focusPublicUrl();
  if (action === "copy-share") return copyShareLink();
  if (action === "copy-editor") return copyEditorLink();
  if (action === "save-public-url") return savePublicUrl();
  if (action === "create-backup") return createBackup();
  if (action === "download-backup") return downloadWorkspaceBackup();
  if (action === "choose-backup-file") return app.querySelector('[data-change="import-backup-file"]')?.click();
  if (action === "refresh-backups") return loadBackups(true);
  if (action === "restore-backup") return restoreBackup(button.dataset.backupId);
  if (action === "select-employee") {
    activeEmployeeId = button.dataset.employeeId || "";
    render();
    return;
  }
  if (action === "logout") {
    await fetch("/api/logout", { method: "POST" });
    authState = { requiresPassword: true, authenticated: false };
    renderLogin();
    return;
  }

  if (!isPublicView && actionChangesWorkspace(action)) rememberUndo();

  if (action === "demo") {
    workspace = mergeWorkspace(DEFAULT_WORKSPACE);
    markUpdated();
    await saveWorkspace(true);
    showToast("Демо-данные восстановлены");
    render();
    return;
  }
  if (action === "reset") {
    if (!confirm("Сбросить текущие данные и вернуть демо-пример?")) return;
    workspace = mergeWorkspace(DEFAULT_WORKSPACE);
    markUpdated();
    await saveWorkspace(true);
    render();
    return;
  }
  if (action === "toggle-calendar-month") {
    toggleCalendarMonth(button.dataset.calendarSection, button.dataset.month);
    return;
  }

  if (isPublicView) return;

  if (action === "add-roadmap") addRoadmapVisibleMonth();
  if (action === "add-roadmap-day") addRoadmapMonth(button.dataset.date);
  if (action === "remove-roadmap-month") removeRoadmapMonthCard(button.dataset.month);
  if (action === "prev-calendar-month") shiftCalendarMonth(button.dataset.calendarSection, -1);
  if (action === "next-calendar-month") shiftCalendarMonth(button.dataset.calendarSection, 1);
  if (action === "remove-roadmap") removeAt(workspace.sections.roadmap.months, Number(button.dataset.index), "roadmap");
  if (action === "add-content") addContentWeek();
  if (action === "add-content-day") addContentItemForDate(button.dataset.date);
  if (action === "remove-content-month") removeContentMonthCard(button.dataset.month);
  if (action === "remove-content-week") removeAt(workspace.sections.content.weeks, Number(button.dataset.weekIndex), "content");
  if (action === "add-content-item") addContentItem(Number(button.dataset.weekIndex));
  if (action === "add-content-type") addContentType(button);
  if (action === "remove-content-type") removeContentType(Number(button.dataset.weekIndex), Number(button.dataset.itemIndex), button.dataset.type);
  if (action === "toggle-content") toggleContent(Number(button.dataset.weekIndex), Number(button.dataset.itemIndex));
  if (action === "remove-content-item") removeContentItem(Number(button.dataset.weekIndex), Number(button.dataset.itemIndex));
  if (action === "add-board") addProject();
  if (action === "set-stage") setProjectStage(Number(button.dataset.index), button.dataset.stage);
  if (action === "remove-project") removeAt(workspace.sections.board.projects, Number(button.dataset.index), "board");
  if (action === "add-improvements") addImprovement();
  if (action === "remove-improvement") removeAt(workspace.sections.improvements.items, Number(button.dataset.index), "improvements");
  if (action === "add-employees") addEmployee();
  if (action === "remove-employee") removeAt(workspace.sections.employees.people, Number(button.dataset.personIndex), "employees");
  if (action === "add-report") addReport(Number(button.dataset.personIndex));
  if (action === "remove-report") removeReport(Number(button.dataset.personIndex), Number(button.dataset.reportIndex));
  if (action === "prev-day") shiftEmployeeDay(-1);
  if (action === "next-day") shiftEmployeeDay(1);
  if (action === "prev-month") shiftMonth(-1);
  if (action === "next-month") shiftMonth(1);
}

function focusPublicUrl() {
  const input = app.querySelector("#publicBaseInput");
  if (!input) {
    showToast("Поле публичного адреса находится в блоке ссылок");
    return;
  }
  input.scrollIntoView({ behavior: "smooth", block: "center" });
  input.focus();
  input.select();
}

function handleChange(input) {
  const change = input.dataset.change;

  if (change === "import-backup-file") {
    importWorkspaceBackup(input);
    return;
  }

  if (change === "roadmap-status") {
    workspace.sections.roadmap.months[Number(input.dataset.index)].status = input.value;
    touch("roadmap");
  }
  if (change === "roadmap-date") {
    const item = workspace.sections.roadmap.months[Number(input.dataset.index)];
    item.date = input.value || item.date;
    workspace.sections.roadmap.calendarMonth = monthFromDate(item.date) || workspace.sections.roadmap.calendarMonth;
    touch("roadmap");
  }
  if (change === "calendar-month") {
    const sectionId = input.dataset.calendarSection;
    if (workspace.sections[sectionId]) {
      workspace.sections[sectionId].calendarMonth = input.value || workspace.sections[sectionId].calendarMonth;
      touch(sectionId, false);
      saveWorkspace();
      render();
      return;
    }
  }
  if (change === "calendar-year") {
    const sectionId = input.dataset.calendarSection;
    if (workspace.sections[sectionId]) {
      const current = workspace.sections[sectionId].calendarMonth || "2026-06";
      const month = current.slice(5, 7) || "01";
      const year = String(input.value || current.slice(0, 4)).padStart(4, "0");
      workspace.sections[sectionId].calendarMonth = `${year}-${month}`;
      touch(sectionId, false);
      saveWorkspace();
      render();
      return;
    }
  }
  if (change === "content-type") {
    const item = workspace.sections.content.weeks[Number(input.dataset.weekIndex)].items[Number(input.dataset.itemIndex)];
    item.type = input.value;
    item.types = [input.value];
    touch("content");
  }
  if (change === "content-date") {
    const item = workspace.sections.content.weeks[Number(input.dataset.weekIndex)].items[Number(input.dataset.itemIndex)];
    item.date = input.value || item.date;
    workspace.sections.content.calendarMonth = monthFromDate(item.date) || workspace.sections.content.calendarMonth;
    touch("content");
  }
  if (change === "project-due") {
    workspace.sections.board.projects[Number(input.dataset.index)].due = input.value;
    touch("board");
  }
  if (change === "improvement-field") {
    const item = workspace.sections.improvements.items[Number(input.dataset.index)];
    const field = input.dataset.field;
    item[field] = field === "rating" ? parseNumber(input.value) : input.value;
    touch("improvements");
  }
  if (change === "employee-month") {
    workspace.sections.employees.month = input.value || workspace.sections.employees.month;
    workspace.sections.employees.day = `${workspace.sections.employees.month}-01`;
    touch("employees", false);
    render();
    return;
  }
  if (change === "employee-day") {
    const nextDay = input.value || workspace.sections.employees.day;
    workspace.sections.employees.day = nextDay;
    workspace.sections.employees.month = monthFromDate(nextDay) || workspace.sections.employees.month;
    touch("employees", false);
    render();
    return;
  }
  if (change === "employee-name-field") {
    const personIndex = Number(input.dataset.personIndex);
    const person = workspace.sections.employees.people[personIndex];
    person.name = input.value.trim() || "Сотрудник";
    activeEmployeeId = employeeKey(person, personIndex);
    touch("employees");
  }
  if (change === "employee-field") {
    const person = workspace.sections.employees.people[Number(input.dataset.personIndex)];
    person[input.dataset.field] = parseNumber(input.value);
    touch("employees");
  }
  if (change === "report-field") {
    const report = getReport(input);
    report[input.dataset.field] = input.value;
    if (input.dataset.field === "date" && validDateValue(input.value)) {
      workspace.sections.employees.day = input.value;
      workspace.sections.employees.month = monthFromDate(input.value) || workspace.sections.employees.month;
    }
    touch("employees");
  }
  if (change === "report-completed") {
    const report = getReport(input);
    report.completed = input.checked;
    report.status = input.checked ? "done" : "plan";
    touch("employees");
  }
  if (change === "report-status") {
    const report = getReport(input);
    report.status = input.value;
    report.completed = input.value === "done";
    touch("employees");
  }

  saveWorkspace();
  render();
}

function applyTextEdit(key, value) {
  const parts = key.split("-");
  if (!value) value = "Без названия";

  if (key.startsWith("roadmap-month-")) {
    workspace.sections.roadmap.months[Number(parts.at(-1))].month = value;
    touch("roadmap");
  }
  if (key.startsWith("roadmap-task-")) {
    workspace.sections.roadmap.months[Number(parts.at(-1))].task = value;
    touch("roadmap");
  }
  if (key.startsWith("roadmap-owner-")) {
    workspace.sections.roadmap.months[Number(parts.at(-1))].owner = value;
    touch("roadmap");
  }
  if (key.startsWith("content-week-title-")) {
    workspace.sections.content.weeks[Number(parts.at(-1))].title = value;
    touch("content");
  }
  if (key.startsWith("content-item-title-")) {
    const itemIndex = Number(parts.at(-1));
    const weekIndex = Number(parts.at(-2));
    workspace.sections.content.weeks[weekIndex].items[itemIndex].title = value;
    touch("content");
  }
  if (key.startsWith("project-title-")) {
    workspace.sections.board.projects[Number(parts.at(-1))].title = value;
    touch("board");
  }
  if (key.startsWith("project-owner-")) {
    workspace.sections.board.projects[Number(parts.at(-1))].owner = value;
    touch("board");
  }
  if (key.startsWith("improvement-idea-card-")) {
    workspace.sections.improvements.items[Number(parts.at(-1))].idea = value;
    touch("improvements");
  }
  if (key.startsWith("improvement-cost-")) {
    workspace.sections.improvements.items[Number(parts.at(-1))].cost = value;
    touch("improvements");
  }
  if (key.startsWith("improvement-effect-")) {
    workspace.sections.improvements.items[Number(parts.at(-1))].effect = value;
    touch("improvements");
  }
  if (key.startsWith("employee-name-")) {
    workspace.sections.employees.people[Number(parts.at(-1))].name = value;
    touch("employees");
  }
  if (key.startsWith("report-title-")) {
    const reportIndex = Number(parts.at(-1));
    const personIndex = Number(parts.at(-2));
    workspace.sections.employees.people[personIndex].reports[reportIndex].title = value;
    touch("employees");
  }

  saveWorkspace();
  render();
}

function addRoadmapMonth() {
  workspace.sections.roadmap.months.push({
    id: newId("m"),
    month: "Новый месяц",
    task: "Новая задача",
    status: "plan",
    owner: "Ответственный"
  });
  touchAndRender("roadmap");
}

function addContentWeek() {
  const weeks = workspace.sections.content.weeks;
  weeks.push({
    id: newId("w"),
    title: `Неделя ${weeks.length + 1}`,
    items: []
  });
  touchAndRender("content");
}

function addContentItem(weekIndex) {
  workspace.sections.content.weeks[weekIndex].items.push({
    id: newId("c"),
    type: "статьи",
    title: "Новый материал",
    status: "plan"
  });
  touchAndRender("content");
}

function toggleContent(weekIndex, itemIndex) {
  const item = workspace.sections.content.weeks[weekIndex].items[itemIndex];
  item.status = item.status === "done" ? "plan" : "done";
  touchAndRender("content");
}

function removeContentItem(weekIndex, itemIndex) {
  workspace.sections.content.weeks[weekIndex].items.splice(itemIndex, 1);
  touchAndRender("content");
}

function addProject() {
  workspace.sections.board.projects.push({
    id: newId("p"),
    title: "Новый проект",
    owner: "Ответственный",
    stage: workspace.sections.board.stages[0],
    due: ""
  });
  touchAndRender("board");
}

function setProjectStage(index, stage) {
  workspace.sections.board.projects[index].stage = stage;
  touchAndRender("board");
}

function addImprovement() {
  const items = workspace.sections.improvements.items;
  const maxId = Math.max(...items.map(item => Number(item.id) || 0), 0);
  items.push({
    id: maxId + 1,
    idea: "Новая идея",
    priority: "средний",
    status: "идея",
    cost: "",
    effect: "",
    rating: 3
  });
  touchAndRender("improvements");
}

function addJourneyStep() {
  workspace.sections.journey.steps.push({
    id: newId("j"),
    title: "Новый шаг",
    loss: false,
    note: ""
  });
  touchAndRender("journey");
}

function addEmployee() {
  const employee = {
    id: newId("e"),
    name: "Новая фамилия",
    plan: 0,
    done: 0,
    reports: []
  };
  workspace.sections.employees.people.push(employee);
  activeEmployeeId = employee.id;
  touchAndRender("employees");
}

function addReport(personIndex) {
  const day = workspace.sections.employees.day || `${workspace.sections.employees.month || new Date().toISOString().slice(0, 7)}-01`;
  workspace.sections.employees.people[personIndex].reports.push({
    id: newId("r"),
    date: day,
    title: "Новая задача",
    text: "",
    status: "plan",
    completed: false
  });
  workspace.sections.employees.month = monthFromDate(day) || workspace.sections.employees.month;
  touchAndRender("employees");
}

function removeReport(personIndex, reportIndex) {
  workspace.sections.employees.people[personIndex].reports.splice(reportIndex, 1);
  touchAndRender("employees");
}

function removeAt(list, index, sectionId) {
  list.splice(index, 1);
  touchAndRender(sectionId);
}

function shiftMonth(delta) {
  const current = workspace.sections.employees.month || new Date().toISOString().slice(0, 7);
  const [year, month] = current.split("-").map(Number);
  const date = new Date(year, month - 1 + delta, 1);
  workspace.sections.employees.month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  workspace.sections.employees.day = `${workspace.sections.employees.month}-01`;
  touch("employees", false);
  saveWorkspace();
  render();
}

function shiftEmployeeDay(delta) {
  const current = workspace.sections.employees.day || `${workspace.sections.employees.month || new Date().toISOString().slice(0, 7)}-01`;
  const date = new Date(`${current}T00:00:00`);
  if (Number.isNaN(date.getTime())) return;
  date.setDate(date.getDate() + delta);
  const nextDay = dateValue(date);
  workspace.sections.employees.day = nextDay;
  workspace.sections.employees.month = monthFromDate(nextDay) || workspace.sections.employees.month;
  touch("employees", false);
  saveWorkspace();
  render();
}

function touchAndRender(sectionId) {
  touch(sectionId);
  saveWorkspace();
  render();
}

function touch(sectionId, updateWorkspace = true) {
  const time = new Date().toISOString();
  if (updateWorkspace) workspace.updatedAt = time;
  if (sectionId && workspace.sections[sectionId]) workspace.sections[sectionId].updatedAt = time;
}

function markUpdated() {
  workspace.updatedAt = new Date().toISOString();
}

function rememberUndo() {
  if (isPublicView || !workspace) return;

  const snapshot = clone(workspace);
  const latest = undoStack[undoStack.length - 1];
  if (latest && JSON.stringify(latest) === JSON.stringify(snapshot)) return;

  undoStack.push(snapshot);
  if (undoStack.length > 30) undoStack.shift();
}

async function undoLastChange() {
  if (!undoStack.length) {
    showToast("Пока нечего откатывать");
    return;
  }

  workspace = mergeWorkspace(undoStack.pop());
  markUpdated();
  await saveWorkspace(true);
  showToast("Последнее действие отменено");
  render();
}

function actionChangesWorkspace(action) {
  return /^(add|remove|set|toggle)-/.test(action)
    || ["demo", "reset", "prev-day", "next-day", "prev-month", "next-month", "prev-calendar-month", "next-calendar-month"].includes(action);
}

async function saveWorkspace(immediate = false) {
  if (isPublicView) return;

  if (!immediate) {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => saveWorkspace(true), 350);
    return;
  }

  if (!canUseServer) {
    localStorage.setItem("marketing-system-workspace", JSON.stringify(workspace));
    return;
  }

  try {
    const response = await fetch("/api/workspace", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workspace })
    });
    const payload = await response.json();
    if (payload.workspace) workspace = mergeWorkspace(payload.workspace);
    if (payload.shareUrl) shareUrl = payload.shareUrl;
    if (payload.editorUrl) editorUrl = payload.editorUrl;
    publicViewBaseUrl = payload.publicViewBaseUrl || publicViewBaseUrl;
    lastSavedAt = workspace.updatedAt;
  } catch (error) {
    localStorage.setItem("marketing-system-workspace", JSON.stringify(workspace));
    showToast("Не удалось сохранить на сервере");
  }
}

async function loadBackups(shouldToast = false) {
  if (isPublicView) return;

  if (!canUseServer) {
    backups = JSON.parse(localStorage.getItem("marketing-system-backups") || "[]");
    if (shouldToast) showToast("Список копий обновлен");
    render();
    return;
  }

  try {
    const response = await fetch("/api/backups", { cache: "no-store" });
    const payload = await response.json();
    backups = Array.isArray(payload.backups) ? payload.backups : [];
    if (shouldToast) showToast("Список копий обновлен");
    render();
  } catch (error) {
    if (shouldToast) showToast("Не удалось загрузить резервные копии");
  }
}

async function createBackup() {
  await saveWorkspace(true);

  if (!canUseServer) {
    const backup = {
      id: new Date().toISOString().replace(/[:]/g, "-"),
      createdAt: new Date().toISOString(),
      reason: "manual",
      workspaceUpdatedAt: workspace.updatedAt,
      workspace: clone(workspace)
    };
    const storedBackups = JSON.parse(localStorage.getItem("marketing-system-backups") || "[]");
    storedBackups.unshift(backup);
    localStorage.setItem("marketing-system-backups", JSON.stringify(storedBackups.slice(0, 30)));
    backups = storedBackups.map(({ workspace: _workspace, ...summary }) => summary);
    showToast("Резервная копия создана");
    render();
    return;
  }

  try {
    const response = await fetch("/api/backups", { method: "POST" });
    const payload = await response.json();
    backups = Array.isArray(payload.backups) ? payload.backups : backups;
    showToast("Резервная копия создана");
    render();
  } catch (error) {
    showToast("Не удалось создать резервную копию");
  }
}

async function downloadWorkspaceBackup() {
  await saveWorkspace(true);

  const createdAt = new Date().toISOString();
  const backup = {
    app: "konglomerat",
    version: "20260703-03",
    createdAt,
    workspaceUpdatedAt: workspace.updatedAt,
    workspace: clone(workspace)
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const safeDate = createdAt.replace(/[:]/g, "-").replace(/\.\d{3}Z$/, "Z");
  link.href = url;
  link.download = `konglomerat-backup-${safeDate}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("Резервная копия скачана на компьютер");
}

async function importWorkspaceBackup(input) {
  const file = input.files?.[0];
  input.value = "";
  if (!file) return;

  try {
    const text = await file.text();
    const payload = JSON.parse(text);
    const nextWorkspace = payload.workspace || payload;

    if (!nextWorkspace || typeof nextWorkspace !== "object" || !nextWorkspace.sections) {
      showToast("Это не похоже на резервную копию konglomerat");
      return;
    }

    if (!confirm("Загрузить эту резервную копию обратно на сайт? Текущие данные будут заменены.")) return;

    rememberUndo();
    workspace = mergeWorkspace(nextWorkspace);
    markUpdated();
    await saveWorkspace(true);
    await loadBackups(false);
    showToast("Резервная копия загружена обратно");
    render();
  } catch (error) {
    showToast("Не удалось прочитать файл резервной копии");
  }
}

async function restoreBackup(backupId) {
  if (!backupId) return;
  if (!confirm("Восстановить данные из этой резервной копии? Текущее состояние тоже будет сохранено отдельной копией.")) return;

  rememberUndo();

  if (!canUseServer) {
    const storedBackups = JSON.parse(localStorage.getItem("marketing-system-backups") || "[]");
    const backup = storedBackups.find(item => item.id === backupId);
    if (!backup?.workspace) {
      showToast("Резервная копия не найдена");
      return;
    }
    workspace = mergeWorkspace(backup.workspace);
    markUpdated();
    await saveWorkspace(true);
    showToast("Резервная копия восстановлена");
    render();
    return;
  }

  try {
    const response = await fetch(`/api/backups/${encodeURIComponent(backupId)}/restore`, { method: "POST" });
    const payload = await response.json();
    if (!response.ok) {
      showToast(payload.error || "Не удалось восстановить копию");
      return;
    }

    workspace = mergeWorkspace(payload.workspace);
    backups = Array.isArray(payload.backups) ? payload.backups : backups;
    shareUrl = payload.shareUrl || shareUrl;
    editorUrl = payload.editorUrl || editorUrl;
    publicViewBaseUrl = payload.publicViewBaseUrl || publicViewBaseUrl;
    lastSavedAt = workspace.updatedAt;
    showToast("Резервная копия восстановлена");
    render();
  } catch (error) {
    showToast("Не удалось восстановить копию");
  }
}

async function createShareLink() {
  await saveWorkspace(true);

  if (!canUseServer) {
    showToast("Для ссылки нужен запущенный сервер");
    return;
  }
  const typedPublicUrl = app.querySelector("#publicBaseInput")?.value?.trim();
  if (typedPublicUrl && typedPublicUrl !== publicViewBaseUrl) {
    await savePublicUrl(false);
  }

  const response = await fetch("/api/share", { method: "POST" });
  const payload = await response.json();
  const nextShareUrl = payload.shareUrl || shareUrl;
  editorUrl = payload.editorUrl || editorUrl || location.origin + "/";
  if (!nextShareUrl || !nextShareUrl.startsWith("https://")) {
    shareUrl = nextShareUrl;
    showToast(payload.tunnelError || "Публичная HTTPS-ссылка не настроена");
    render();
    return;
  }
  shareUrl = nextShareUrl;
  await copyText(shareUrl);
  showToast("Публичная HTTPS-ссылка скопирована");
  render();
}

async function savePublicUrl(shouldToast = true) {
  if (!canUseServer) {
    showToast("Для сохранения нужен запущенный сервер");
    return false;
  }

  const input = app.querySelector("#publicBaseInput");
  const value = input?.value?.trim() || "";
  if (value && !value.startsWith("https://")) {
    showToast("Адрес должен начинаться с https://");
    return false;
  }

  const response = await fetch("/api/public-url", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publicViewBaseUrl: value })
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
  render();
  return true;
}

async function copyShareLink() {
  if (!shareUrl || !shareUrl.startsWith("https://")) {
    await createShareLink();
    return;
  }
  const input = app.querySelector("#shareInput");
  await copyText(input?.value || shareUrl);
  showToast("Ссылка скопирована");
}

async function copyEditorLink() {
  const value = editorUrl || location.origin + "/";
  await copyText(value);
  showToast(value.startsWith("https://") ? "HTTPS-ссылка редактора скопирована" : "Ссылка входа в редактор скопирована");
}

async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
  } catch (error) {
    const input = app.querySelector("#shareInput");
    if (input) {
      input.focus();
      input.select();
    }
  }
}

function startPolling() {
  clearInterval(pollTimer);
  pollTimer = setInterval(async () => {
    try {
      const response = await fetch(`/api/public/${publicToken}`, { cache: "no-store" });
      if (!response.ok) return;
      const payload = await response.json();
      if (payload.updatedAt && payload.updatedAt !== lastSavedAt) {
        workspace = mergeWorkspace(payload.workspace);
        lastSavedAt = payload.updatedAt;
        render();
      }
    } catch (error) {
      // Keep the last loaded version visible.
    }
  }, 15000);
}

function getSectionMeta(sectionId) {
  const section = workspace.sections[sectionId];
  return `Обновлено: ${formatDateTime(section.updatedAt || workspace.updatedAt)}`;
}

function getStats(sectionId) {
  if (sectionId === "roadmap") {
    const months = workspace.sections.roadmap.months;
    const done = months.filter(item => item.status === "done").length;
    return [
      { label: "Месяцев в плане", value: String(months.length), note: "roadmap" },
      { label: "Выполнено", value: String(done), note: `${Math.round(ratio(done, months.length) * 100)}%` },
      { label: "В работе", value: String(months.filter(item => item.status === "progress").length), note: "активные задачи" },
      { label: "План", value: String(months.filter(item => item.status === "plan").length), note: "следующие шаги" }
    ];
  }

  if (sectionId === "content") {
    const weeks = workspace.sections.content.weeks;
    const items = weeks.flatMap(week => week.items || []);
    const done = items.filter(item => item.status === "done").length;
    return [
      { label: "Недель", value: String(weeks.length), note: "не обычный календарь" },
      { label: "Материалов", value: String(items.length), note: "статьи, новости, кейсы, товары" },
      { label: "Выполнено", value: String(done), note: `${Math.round(ratio(done, items.length) * 100)}%` },
      { label: "Каналов", value: String(new Set(items.flatMap(item => normalizeContentTypes(item))).size), note: "типов контента" }
    ];
  }

  if (sectionId === "board") {
    const board = workspace.sections.board;
    return board.stages.slice(0, 4).map(stage => ({
      label: stage,
      value: String(board.projects.filter(project => project.stage === stage).length),
      note: "проектов"
    }));
  }

  if (sectionId === "improvements") {
    const items = workspace.sections.improvements.items;
    return [
      { label: "Идей", value: String(items.length), note: "реестр сайта" },
      { label: "Высокий приоритет", value: String(items.filter(item => item.priority === "высокий").length), note: "важно" },
      { label: "В разработке", value: String(items.filter(item => /разработ/i.test(item.status)).length), note: "сейчас" },
      { label: "Готово", value: String(items.filter(item => /готов/i.test(item.status)).length), note: "закрыто" }
    ];
  }

  if (sectionId === "journey") {
    const steps = workspace.sections.journey.steps;
    return [
      { label: "Шагов пути", value: String(steps.length), note: "от Google до повторной покупки" },
      { label: "Точки потерь", value: String(steps.filter(step => step.loss).length), note: "красные зоны" },
      { label: "Без риска", value: String(steps.filter(step => !step.loss).length), note: "стабильные шаги" },
      { label: "Фокус", value: steps.find(step => step.loss)?.title || "нет", note: "первое узкое место" }
    ];
  }

  if (sectionId === "employees") {
    const people = workspace.sections.employees.people;
    const plan = people.reduce((sum, person) => sum + parseNumber(person.plan), 0);
    const done = people.reduce((sum, person) => sum + parseNumber(person.done), 0);
    return [
      { label: "Сотрудников", value: String(people.length), note: "в задачах" },
      { label: "План", value: formatNumber(plan), note: "пунктов" },
      { label: "Выполнил", value: formatNumber(done), note: `${Math.round(ratio(done, plan) * 100)}%` },
      { label: "Лучший KPI", value: bestEmployee(people), note: "по выполнению плана" }
    ];
  }

  return [];
}

function editableText(value, key, className, placeholder = "") {
  if (isPublicView) return `<div class="${className}">${escapeHtml(value || placeholder)}</div>`;
  return `<div class="${className}" contenteditable="true" data-edit="${escapeAttribute(key)}" data-placeholder="${escapeAttribute(placeholder)}">${escapeHtml(value || placeholder)}</div>`;
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
      ${[1, 2, 3, 4, 5].map(rating => `<option value="${rating}" ${Number(value) === rating ? "selected" : ""}>${starText(rating)}</option>`).join("")}
    </select>
  `;
}

function priorityBadge(value) {
  const normalized = String(value || "").toLowerCase();
  const className = normalized.includes("выс") ? "high" : normalized.includes("сред") ? "medium" : "low";
  return `<span class="priority ${className}">${escapeHtml(value)}</span>`;
}

function statusSymbol(status) {
  if (status === "done") return "✓";
  if (status === "progress") return "→";
  return "план";
}

function stars(value) {
  const count = Math.max(1, Math.min(5, parseNumber(value) || 1));
  return `<span class="stars">${starText(count)}</span>`;
}

function starText(value) {
  const count = Math.max(1, Math.min(5, parseNumber(value) || 1));
  return `${"★".repeat(count)}${"☆".repeat(5 - count)}`;
}

function getReport(input) {
  return workspace.sections.employees.people[Number(input.dataset.personIndex)].reports[Number(input.dataset.reportIndex)];
}

function reportStatusValue(report) {
  if (REPORT_STATUSES.some(status => status.value === report?.status)) return report.status;
  return report?.completed ? "done" : "plan";
}

function reportStatusLabel(status) {
  if (status === "done") return "✓";
  if (status === "progress") return "в работе";
  return "план";
}

function backupReasonLabel(reason) {
  const labels = {
    manual: "ручная копия",
    auto: "автокопия за день",
    "before-restore": "перед восстановлением"
  };
  return labels[reason] || "резервная копия";
}

function bestEmployee(people) {
  if (!people.length) return "нет";
  return [...people].sort((a, b) => ratio(b.done, b.plan) - ratio(a.done, a.plan))[0].name;
}

function compareReportsByDate(a, b) {
  const left = Date.parse(a.date || "");
  const right = Date.parse(b.date || "");
  const leftSafe = Number.isFinite(left) ? left : Number.MAX_SAFE_INTEGER;
  const rightSafe = Number.isFinite(right) ? right : Number.MAX_SAFE_INTEGER;
  if (leftSafe !== rightSafe) return leftSafe - rightSafe;
  return String(a.title || "").localeCompare(String(b.title || ""), "ru");
}

function ratio(done, plan) {
  const p = parseNumber(plan);
  return p > 0 ? parseNumber(done) / p : 0;
}

function parseNumber(value) {
  const parsed = Number(String(value ?? "").replace(/\s/g, "").replace(",", ".").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatNumber(value) {
  return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 }).format(parseNumber(value));
}

function formatDate(value) {
  if (!value) return "без даты";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

function formatMonth(value) {
  if (!value) return "месяц не выбран";
  const [year, month] = value.split("-").map(Number);
  const date = new Date(year, month - 1, 1);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ru-RU", { month: "long", year: "numeric" }).format(date);
}

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "нет данных";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function newId(prefix) {
  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 10000)}`;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
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

function renderRoadmap() {
  const data = workspace.sections.roadmap;
  const selectedMonth = data.calendarMonth || "2026-06";
  const items = (data.months || []).map((item, index) => ({ ...item, index }));
  return `
    ${renderCalendarToolbar("roadmap", selectedMonth)}
    ${renderCalendarGrid("roadmap", selectedMonth, items, renderRoadmapCalendarItem)}
  `;
}

function renderContent() {
  const data = workspace.sections.content;
  const selectedMonth = data.calendarMonth || "2026-06";
  const items = flattenContentItems(data);
  return `
    ${renderCalendarToolbar("content", selectedMonth)}
    ${renderCalendarGrid("content", selectedMonth, items, renderContentCalendarItem)}
  `;
}

function renderCalendarToolbar(sectionId, selectedMonth) {
  return `
    <div class="calendar-toolbar">
      <div>
        <div class="calendar-title">${escapeHtml(formatMonth(selectedMonth))}</div>
        <div class="calendar-note">Данные сохраняются автоматически</div>
      </div>
      <div class="calendar-controls">
        ${isPublicView ? "" : `<button class="button small" type="button" data-action="prev-calendar-month" data-calendar-section="${sectionId}">${icon("left")} Месяц</button>`}
        <input class="field month-field" type="month" data-change="calendar-month" data-calendar-section="${sectionId}" value="${escapeAttribute(selectedMonth)}" ${isPublicView ? "disabled" : ""}>
        ${isPublicView ? "" : `<button class="button small" type="button" data-action="next-calendar-month" data-calendar-section="${sectionId}">Месяц ${icon("right")}</button>`}
      </div>
    </div>
  `;
}

function renderCalendarGrid(sectionId, selectedMonth, items, renderItem) {
  const days = calendarDays(selectedMonth);
  const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  return `
    <div class="calendar-board">
      ${weekDays.map(day => `<div class="calendar-weekday">${day}</div>`).join("")}
      ${days.map(day => {
        const dateItems = items.filter(item => item.date === day.value);
        return `
          <div class="calendar-day ${day.outside ? "outside" : ""}">
            <div class="calendar-day-head">
              <span>${day.day}</span>
              ${!isPublicView && !day.outside ? `<button class="icon-button" type="button" data-action="add-${sectionId}-day" data-date="${day.value}" aria-label="Добавить">${icon("plus")}</button>` : ""}
            </div>
            <div class="calendar-day-items">
              ${dateItems.map(item => renderItem(item)).join("") || `<div class="calendar-empty">Пусто</div>`}
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderRoadmapCalendarItem(item) {
  const index = item.index;
  return `
    <article class="calendar-item roadmap-item">
      <div class="calendar-item-top">
        <span class="check ${item.status}">${statusSymbol(item.status)}</span>
        ${isPublicView ? "" : `<button class="card-remove" type="button" data-action="remove-roadmap" data-index="${index}" aria-label="Удалить карточку">×</button>`}
      </div>
      ${editableText(item.task, `roadmap-task-${index}`, "task-title")}
      ${editableText(item.owner || "", `roadmap-owner-${index}`, "task-owner", "Ответственный")}
      ${isPublicView ? "" : `
        <select class="select" data-change="roadmap-status" data-index="${index}">
          ${ROADMAP_STATUSES.map(status => `<option value="${status.value}" ${status.value === item.status ? "selected" : ""}>${status.label}</option>`).join("")}
        </select>
      `}
    </article>
  `;
}

function renderContentCalendarItem(item) {
  const selectedTypes = normalizeContentTypes(item);
  return `
    <article class="calendar-item content-calendar-item">
      <div class="calendar-item-top">
        ${isPublicView
          ? `<span class="toggle ${item.status === "done" ? "done" : ""}">${item.status === "done" ? "✓" : ""}</span>`
          : `<button class="toggle ${item.status === "done" ? "done" : ""}" type="button" data-action="toggle-content" data-week-index="${item.weekIndex}" data-item-index="${item.itemIndex}">${item.status === "done" ? "✓" : ""}</button>`
        }
        ${isPublicView ? "" : `<button class="card-remove" type="button" data-action="remove-content-item" data-week-index="${item.weekIndex}" data-item-index="${item.itemIndex}" aria-label="Удалить карточку">×</button>`}
      </div>
      ${editableText(item.title, `content-item-title-${item.weekIndex}-${item.itemIndex}`, "task-title")}
      ${isPublicView
        ? renderContentTypeChips(selectedTypes, item.weekIndex, item.itemIndex, false)
        : `
          ${renderContentTypeChips(selectedTypes, item.weekIndex, item.itemIndex, true)}
          <div class="content-type-editor">
            <select class="select" data-role="content-type-picker">
              ${CONTENT_TYPES.map(type => `<option value="${type}" ${selectedTypes.includes(type) ? "disabled" : ""}>${type}</option>`).join("")}
            </select>
            <button class="button small" type="button" data-action="add-content-type" data-week-index="${item.weekIndex}" data-item-index="${item.itemIndex}">${icon("plus")} Добавить</button>
          </div>
        `
      }
    </article>
  `;
}

function renderContentTypeChips(types, weekIndex, itemIndex, editable) {
  if (!types.length) return `<div class="type-chip-list"><span class="type-chip muted-chip">Пункты не выбраны</span></div>`;
  return `
    <div class="type-chip-list">
      ${types.map(type => `
        <span class="type-chip removable-chip">
          ${escapeHtml(type)}
          ${editable ? `<button type="button" data-action="remove-content-type" data-week-index="${weekIndex}" data-item-index="${itemIndex}" data-type="${escapeAttribute(type)}" aria-label="Удалить ${escapeAttribute(type)}">×</button>` : ""}
        </span>
      `).join("")}
    </div>
  `;
}

function addContentType(button) {
  const item = getContentItemByIndex(Number(button.dataset.weekIndex), Number(button.dataset.itemIndex));
  if (!item) return;

  const select = button.closest(".content-type-editor")?.querySelector("[data-role='content-type-picker']");
  const type = select?.value || CONTENT_TYPES[0];
  const types = normalizeContentTypes(item);
  if (!types.includes(type)) types.push(type);
  item.types = types;
  item.type = types[0] || "";
  touchAndRender("content");
}

function removeContentType(weekIndex, itemIndex, type) {
  const item = getContentItemByIndex(weekIndex, itemIndex);
  if (!item) return;

  item.types = normalizeContentTypes(item).filter(current => current !== type);
  item.type = item.types[0] || "";
  touchAndRender("content");
}

function getContentItemByIndex(weekIndex, itemIndex) {
  return workspace.sections.content.weeks[weekIndex]?.items?.[itemIndex] || null;
}

function normalizeContentTypes(item) {
  const source = Array.isArray(item?.types) ? item.types : [item?.type];
  return [...new Set(source.filter(type => CONTENT_TYPES.includes(type)))];
}

function addRoadmapVisibleMonth() {
  const roadmap = workspace.sections.roadmap;
  const year = (roadmap.calendarMonth || "2026-06").slice(0, 4) || "2026";
  roadmap.hiddenMonths = Array.isArray(roadmap.hiddenMonths) ? roadmap.hiddenMonths : [];
  const months = yearMonths(year).map(month => month.value);
  const monthToRestore = months.find(month => roadmap.hiddenMonths.includes(month));

  if (monthToRestore) {
    roadmap.hiddenMonths = roadmap.hiddenMonths.filter(month => month !== monthToRestore);
    roadmap.calendarMonth = monthToRestore;
    touchAndRender("roadmap");
    return;
  }

  const lastVisible = [...months].reverse().find(month => !roadmap.hiddenMonths.includes(month));
  const nextMonth = lastVisible ? shiftMonthValue(lastVisible, 1) : `${year}-01`;
  roadmap.hiddenMonths = roadmap.hiddenMonths.filter(month => month !== nextMonth);
  roadmap.calendarMonth = nextMonth;
  touchAndRender("roadmap");
}

function removeRoadmapMonthCard(monthValue) {
  if (!validMonthValue(monthValue)) return;
  const roadmap = workspace.sections.roadmap;
  roadmap.hiddenMonths = Array.isArray(roadmap.hiddenMonths) ? roadmap.hiddenMonths : [];
  if (!roadmap.hiddenMonths.includes(monthValue)) roadmap.hiddenMonths.push(monthValue);
  roadmap.months = (roadmap.months || []).filter(item => monthFromDate(item.date) !== monthValue);
  touchAndRender("roadmap");
}

function removeContentMonthCard(monthValue) {
  if (!validMonthValue(monthValue)) return;
  const content = workspace.sections.content;
  content.hiddenMonths = Array.isArray(content.hiddenMonths) ? content.hiddenMonths : [];
  if (!content.hiddenMonths.includes(monthValue)) content.hiddenMonths.push(monthValue);
  content.weeks = (content.weeks || []).map(week => ({
    ...week,
    items: (week.items || []).filter(item => monthFromDate(item.date) !== monthValue)
  }));
  touchAndRender("content");
}

function addRoadmapMonth(date = "") {
  const selectedDate = validDateValue(date) ? date : `${workspace.sections.roadmap.calendarMonth || "2026-06"}-01`;
  const selectedMonth = monthFromDate(selectedDate);
  workspace.sections.roadmap.hiddenMonths = (workspace.sections.roadmap.hiddenMonths || []).filter(month => month !== monthFromDate(selectedDate));
  workspace.sections.roadmap.months.push({
    id: newId("m"),
    month: formatMonth(selectedMonth),
    task: "Новая задача",
    status: "plan",
    owner: "Ответственный",
    date: selectedDate
  });
  workspace.sections.roadmap.calendarMonth = selectedMonth || workspace.sections.roadmap.calendarMonth;
  if (selectedMonth) expandedCalendarMonths.add(calendarMonthKey("roadmap", selectedMonth));
  touchAndRender("roadmap");
}

function addContentWeek() {
  addContentItemForDate(`${workspace.sections.content.calendarMonth || "2026-06"}-01`);
}

function addContentItem(weekIndex, date = "") {
  const itemDate = validDateValue(date) ? date : `${workspace.sections.content.calendarMonth || "2026-06"}-01`;
  const itemMonth = monthFromDate(itemDate);
  workspace.sections.content.hiddenMonths = (workspace.sections.content.hiddenMonths || []).filter(month => month !== monthFromDate(itemDate));
  const week = workspace.sections.content.weeks[weekIndex] || ensureContentWeekForDate(itemDate);
  week.items.push({
    id: newId("c"),
    type: CONTENT_TYPES[0],
    types: [CONTENT_TYPES[0]],
    title: "Новый материал",
    status: "plan",
    date: itemDate
  });
  workspace.sections.content.calendarMonth = itemMonth || workspace.sections.content.calendarMonth;
  if (itemMonth) expandedCalendarMonths.add(calendarMonthKey("content", itemMonth));
  touchAndRender("content");
}

function addContentItemForDate(date) {
  const itemMonth = monthFromDate(date);
  workspace.sections.content.hiddenMonths = (workspace.sections.content.hiddenMonths || []).filter(month => month !== itemMonth);
  const week = ensureContentWeekForDate(date);
  week.items.push({
    id: newId("c"),
    type: CONTENT_TYPES[0],
    types: [CONTENT_TYPES[0]],
    title: "Новый материал",
    status: "plan",
    date
  });
  workspace.sections.content.calendarMonth = itemMonth || workspace.sections.content.calendarMonth;
  if (itemMonth) expandedCalendarMonths.add(calendarMonthKey("content", itemMonth));
  touchAndRender("content");
}

function shiftCalendarMonth(sectionId, delta) {
  if (!workspace.sections[sectionId]) return;
  const current = workspace.sections[sectionId].calendarMonth || "2026-06";
  workspace.sections[sectionId].calendarMonth = shiftMonthValue(current, delta);
  touch(sectionId, false);
  saveWorkspace();
  render();
}

function flattenContentItems(data) {
  return (data.weeks || []).flatMap((week, weekIndex) =>
    (week.items || []).map((item, itemIndex) => ({ ...item, weekIndex, itemIndex }))
  );
}

function ensureContentWeekForDate(date) {
  const data = workspace.sections.content;
  const day = Number(String(date).slice(-2)) || 1;
  const weekIndex = Math.max(0, Math.floor((day - 1) / 7));
  while (data.weeks.length <= weekIndex) {
    data.weeks.push({ id: newId("w"), title: `Неделя ${data.weeks.length + 1}`, items: [] });
  }
  return data.weeks[weekIndex];
}

function calendarDays(monthValue) {
  const [year, month] = String(monthValue || "2026-06").split("-").map(Number);
  const first = new Date(year, month - 1, 1);
  const startOffset = (first.getDay() + 6) % 7;
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(year, month - 1, 1 - startOffset + index);
    return {
      value: dateValue(date),
      day: date.getDate(),
      outside: date.getMonth() !== month - 1
    };
  });
}

function dateValue(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function monthFromDate(value) {
  return validDateValue(value) ? String(value).slice(0, 7) : "";
}

function shiftMonthValue(value, delta) {
  const [year, month] = String(value || "2026-06").split("-").map(Number);
  const date = new Date(year, month - 1 + delta, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function validMonthValue(value) {
  return /^\d{4}-\d{2}$/.test(String(value || ""));
}

function validDateValue(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || ""));
}

function renderCalendarToolbar(sectionId, selectedMonth) {
  const year = selectedMonth.slice(0, 4) || "2026";
  return `
    <div class="calendar-toolbar">
      <div>
        <div class="calendar-title">${escapeHtml(year)}</div>
        <div class="calendar-note">Карточки по месяцам, данные сохраняются автоматически</div>
      </div>
      <div class="calendar-controls">
        ${isPublicView ? "" : `<button class="button small" type="button" data-action="prev-calendar-month" data-calendar-section="${sectionId}">${icon("left")} Год</button>`}
        <input class="field year-field" type="number" min="2000" max="2100" data-change="calendar-year" data-calendar-section="${sectionId}" value="${escapeAttribute(year)}" ${isPublicView ? "disabled" : ""}>
        ${isPublicView ? "" : `<button class="button small" type="button" data-action="next-calendar-month" data-calendar-section="${sectionId}">Год ${icon("right")}</button>`}
      </div>
    </div>
  `;
}

function renderCalendarGrid(sectionId, selectedMonth, items, renderItem) {
  const year = selectedMonth.slice(0, 4) || "2026";
  const months = yearMonths(year);
  const hiddenMonths = workspace.sections[sectionId]?.hiddenMonths || [];
  const visibleMonths = months.filter(month => !hiddenMonths.includes(month.value));
  return `
    <div class="calendar-board month-calendar-board">
      ${visibleMonths.map(month => {
        const monthItems = items.filter(item => monthFromDate(item.date) === month.value);
        const monthKey = calendarMonthKey(sectionId, month.value);
        const isExpanded = expandedCalendarMonths.has(monthKey);
        return `
          <div class="calendar-day calendar-month-card ${isExpanded ? "expanded" : "collapsed"}">
            <div class="calendar-day-head month-card-head">
              <button class="month-title-button" type="button" data-action="toggle-calendar-month" data-calendar-section="${sectionId}" data-month="${month.value}">
                <span>${escapeHtml(month.label)}</span>
                <span class="month-card-summary">${monthItems.length ? `${monthItems.length}` : "пусто"}</span>
                <span class="month-toggle-indicator">${isExpanded ? "−" : "+"}</span>
              </button>
              ${!isPublicView ? `
                <span class="month-card-tools">
                  <button class="icon-button" type="button" data-action="add-${sectionId}-day" data-date="${month.value}-01" aria-label="Добавить">${icon("plus")}</button>
                  ${sectionId === "roadmap" ? `<button class="icon-button danger-icon" type="button" data-action="remove-roadmap-month" data-month="${month.value}" aria-label="Удалить месяц">${icon("trash")}</button>` : ""}
                  ${sectionId === "content" ? `<button class="icon-button danger-icon" type="button" data-action="remove-content-month" data-month="${month.value}" aria-label="Удалить месяц">${icon("trash")}</button>` : ""}
                </span>
              ` : ""}
            </div>
            ${isExpanded ? `
              <div class="calendar-day-items">
                ${monthItems.map(item => renderItem(item)).join("") || `<div class="calendar-empty">Пусто</div>`}
              </div>
            ` : ""}
          </div>
        `;
      }).join("") || `<div class="empty wide-empty">Все месяцы удалены. Нажмите верхнюю кнопку, чтобы вернуть месяц.</div>`}
    </div>
  `;
}

function toggleCalendarMonth(sectionId, monthValue) {
  if (!sectionId || !validMonthValue(monthValue)) return;
  const key = calendarMonthKey(sectionId, monthValue);
  if (expandedCalendarMonths.has(key)) {
    expandedCalendarMonths.delete(key);
  } else {
    expandedCalendarMonths.add(key);
  }
  render();
}

function calendarMonthKey(sectionId, monthValue) {
  return `${sectionId}:${monthValue}`;
}

function shiftCalendarMonth(sectionId, delta) {
  if (!workspace.sections[sectionId]) return;
  const current = workspace.sections[sectionId].calendarMonth || "2026-06";
  workspace.sections[sectionId].calendarMonth = shiftMonthValue(current, delta * 12);
  touch(sectionId, false);
  saveWorkspace();
  render();
}

function yearMonths(year) {
  return Array.from({ length: 12 }, (_, index) => {
    const value = `${year}-${String(index + 1).padStart(2, "0")}`;
    const date = new Date(Number(year), index, 1);
    return {
      value,
      label: new Intl.DateTimeFormat("ru-RU", { month: "long" }).format(date)
    };
  });
}

function icon(name) {
  const icons = {
    map: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3z"></path><path d="M9 3v15"></path><path d="M15 6v15"></path></svg>`,
    calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M16 2v4"></path><path d="M8 2v4"></path><path d="M3 10h18"></path></svg>`,
    board: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"></rect><path d="M9 4v16"></path><path d="M15 4v16"></path></svg>`,
    star: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3 6 7 .9-5 4.7 1.3 6.8L12 17l-6.3 3.4L7 13.6 2 8.9 9 8z"></path></svg>`,
    path: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="3"></circle><circle cx="18" cy="18" r="3"></circle><path d="M9 6h3a4 4 0 0 1 0 8h-1a4 4 0 0 0 0 8h4"></path></svg>`,
    users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.9"></path><path d="M16 3.1a4 4 0 0 1 0 7.8"></path></svg>`,
    settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2a2 2 0 1 1-4 0V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1A2 2 0 1 1 7.2 4.2l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 1 1 20 7.2l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.4 1z"></path></svg>`,
    plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>`,
    link: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1"></path><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"></path></svg>`,
    copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
    download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><path d="M7 10l5 5 5-5"></path><path d="M12 15V3"></path></svg>`,
    upload: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><path d="M17 8l-5-5-5 5"></path><path d="M12 3v12"></path></svg>`,
    save: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><path d="M17 21v-8H7v8"></path><path d="M7 3v5h8"></path></svg>`,
    undo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 14l-4-4 4-4"></path><path d="M5 10h9a5 5 0 1 1 0 10h-1"></path></svg>`,
    reset: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 3-6.7"></path><path d="M3 4v6h6"></path></svg>`,
    trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"></path><path d="M8 6V4h8v2"></path><path d="M19 6l-1 14H6L5 6"></path></svg>`,
    spark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"></path></svg>`,
    left: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"></path></svg>`,
    right: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"></path></svg>`
  };

  return `<span class="icon" aria-hidden="true">${icons[name] || icons.star}</span>`;
}
