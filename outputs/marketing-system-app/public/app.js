const SECTIONS = [
  { id: "roadmap", label: "Marketing Roadmap", icon: "map" },
  { id: "content", label: "Контент-календарь", icon: "calendar" },
  { id: "board", label: "Доска проектов", icon: "board" },
  { id: "improvements", label: "Реестр улучшений", icon: "star" },
  { id: "journey", label: "Путь клиента", icon: "path" },
  { id: "employees", label: "Отчеты сотрудников", icon: "users" }
];

const CONTENT_TYPES = ["статьи", "новости", "кейсы", "соцсети", "email", "выставки"];
const ROADMAP_STATUSES = [
  { value: "done", label: "Выполнено" },
  { value: "progress", label: "В работе" },
  { value: "plan", label: "План" }
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
      await loadPublicWorkspace();
      startPolling();
    } else {
      await checkAuth();
      if (authState.requiresPassword && !authState.authenticated) {
        renderLogin();
        return;
      }
      await loadOwnerWorkspace();
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

  return merged;
}

function render() {
  const section = SECTIONS.find(item => item.id === activeSection) || SECTIONS[0];

  app.innerHTML = `
    <div class="shell">
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-mark">M</div>
          <div>
            <div class="brand-title">Marketing System</div>
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
          <div>
            <label class="sr-only" for="titleInput">Название</label>
            <input id="titleInput" class="title-input" value="${escapeAttribute(workspace.title)}" ${isPublicView ? "disabled" : ""}>
            <label class="sr-only" for="periodInput">Период</label>
            <input id="periodInput" class="period-input" value="${escapeAttribute(workspace.period)}" ${isPublicView ? "disabled" : ""}>
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
          ${!isPublicView ? renderSharePanel() : ""}
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
  const meta = getSectionMeta(section.id);
  return `
    <section>
      <div class="section-head">
        <div>
          <h1 class="section-title">${section.label}</h1>
          <div class="section-meta">${meta}</div>
        </div>
        ${renderSectionActions(section.id)}
      </div>
      ${renderStats(section.id)}
      ${renderSectionBody(section.id)}
    </section>
  `;
}

function renderSectionActions(sectionId) {
  if (isPublicView) return "";

  const addLabels = {
    roadmap: "Месяц",
    content: "Неделя",
    board: "Проект",
    improvements: "Идея",
    journey: "Шаг",
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
  if (sectionId === "journey") return renderJourney();
  if (sectionId === "employees") return renderEmployees();
  return "";
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
                <input class="field" type="month" data-change="employee-month" value="${escapeAttribute(data.month || "")}" style="width:150px">
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
            <input class="field" data-change="employee-field" data-person-index="${personIndex}" data-field="plan" value="${escapeAttribute(person.plan)}" placeholder="План" style="max-width:120px">
            <input class="field" data-change="employee-field" data-person-index="${personIndex}" data-field="done" value="${escapeAttribute(person.done)}" placeholder="Выполнил" style="max-width:120px">
          </div>
        `}
        ${reports.map(report => renderReport(report, personIndex)).join("") || `<div class="empty">Нет отчетов за выбранный месяц</div>`}
        ${isPublicView ? "" : `<button class="button small danger" type="button" data-action="remove-employee" data-person-index="${personIndex}">${icon("trash")} Удалить сотрудника</button>`}
      </div>
    </details>
  `;
}

function renderReport(report, personIndex) {
  const reportIndex = workspace.sections.employees.people[personIndex].reports.findIndex(item => item.id === report.id);
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
            <label class="loss-label" style="color:#166534">
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
      workspace.title = titleInput.value.trim() || DEFAULT_WORKSPACE.title;
      markUpdated();
      saveWorkspace();
      render();
    });
  }
  if (periodInput && !isPublicView) {
    periodInput.addEventListener("change", () => {
      workspace.period = periodInput.value.trim() || DEFAULT_WORKSPACE.period;
      markUpdated();
      saveWorkspace();
      render();
    });
  }

  if (!isPublicView) {
    app.querySelectorAll("[contenteditable][data-edit]").forEach(element => {
      element.addEventListener("blur", () => applyTextEdit(element.dataset.edit, element.textContent.trim()));
      element.addEventListener("keydown", event => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          element.blur();
        }
      });
    });

    app.querySelectorAll("[data-change]").forEach(input => {
      input.addEventListener("change", () => handleChange(input));
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

  if (action === "share") return createShareLink();
  if (action === "public-url") return focusPublicUrl();
  if (action === "copy-share") return copyShareLink();
  if (action === "copy-editor") return copyEditorLink();
  if (action === "save-public-url") return savePublicUrl();
  if (action === "logout") {
    await fetch("/api/logout", { method: "POST" });
    authState = { requiresPassword: true, authenticated: false };
    renderLogin();
    return;
  }
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

  if (isPublicView) return;

  if (action === "add-roadmap") addRoadmapMonth();
  if (action === "remove-roadmap") removeAt(workspace.sections.roadmap.months, Number(button.dataset.index), "roadmap");
  if (action === "add-content") addContentWeek();
  if (action === "remove-content-week") removeAt(workspace.sections.content.weeks, Number(button.dataset.weekIndex), "content");
  if (action === "add-content-item") addContentItem(Number(button.dataset.weekIndex));
  if (action === "toggle-content") toggleContent(Number(button.dataset.weekIndex), Number(button.dataset.itemIndex));
  if (action === "remove-content-item") removeContentItem(Number(button.dataset.weekIndex), Number(button.dataset.itemIndex));
  if (action === "add-board") addProject();
  if (action === "set-stage") setProjectStage(Number(button.dataset.index), button.dataset.stage);
  if (action === "remove-project") removeAt(workspace.sections.board.projects, Number(button.dataset.index), "board");
  if (action === "add-improvements") addImprovement();
  if (action === "remove-improvement") removeAt(workspace.sections.improvements.items, Number(button.dataset.index), "improvements");
  if (action === "add-journey") addJourneyStep();
  if (action === "remove-journey-step") removeAt(workspace.sections.journey.steps, Number(button.dataset.index), "journey");
  if (action === "add-employees") addEmployee();
  if (action === "remove-employee") removeAt(workspace.sections.employees.people, Number(button.dataset.personIndex), "employees");
  if (action === "add-report") addReport(Number(button.dataset.personIndex));
  if (action === "remove-report") removeReport(Number(button.dataset.personIndex), Number(button.dataset.reportIndex));
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

  if (change === "roadmap-status") {
    workspace.sections.roadmap.months[Number(input.dataset.index)].status = input.value;
    touch("roadmap");
  }
  if (change === "content-type") {
    workspace.sections.content.weeks[Number(input.dataset.weekIndex)].items[Number(input.dataset.itemIndex)].type = input.value;
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
  if (change === "journey-loss") {
    workspace.sections.journey.steps[Number(input.dataset.index)].loss = input.checked;
    touch("journey");
  }
  if (change === "journey-note") {
    workspace.sections.journey.steps[Number(input.dataset.index)].note = input.value;
    touch("journey");
  }
  if (change === "employee-month") {
    workspace.sections.employees.month = input.value || workspace.sections.employees.month;
    touch("employees", false);
    render();
    return;
  }
  if (change === "employee-field") {
    const person = workspace.sections.employees.people[Number(input.dataset.personIndex)];
    person[input.dataset.field] = parseNumber(input.value);
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
  if (key.startsWith("journey-title-")) {
    workspace.sections.journey.steps[Number(parts.at(-1))].title = value;
    touch("journey");
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
  workspace.sections.employees.people.push({
    id: newId("e"),
    name: "Новый сотрудник",
    plan: 0,
    done: 0,
    reports: []
  });
  touchAndRender("employees");
}

function addReport(personIndex) {
  const month = workspace.sections.employees.month || new Date().toISOString().slice(0, 7);
  workspace.sections.employees.people[personIndex].reports.push({
    id: newId("r"),
    date: `${month}-01`,
    title: "Новый отчет",
    text: "",
    completed: false
  });
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
      { label: "Материалов", value: String(items.length), note: "статьи, новости, кейсы" },
      { label: "Выполнено", value: String(done), note: `${Math.round(ratio(done, items.length) * 100)}%` },
      { label: "Каналов", value: String(new Set(items.map(item => item.type)).size), note: "типов контента" }
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
      { label: "Сотрудников", value: String(people.length), note: "в отчетах" },
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

function bestEmployee(people) {
  if (!people.length) return "нет";
  return [...people].sort((a, b) => ratio(b.done, b.plan) - ratio(a.done, a.plan))[0].name;
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

function icon(name) {
  const icons = {
    map: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3z"></path><path d="M9 3v15"></path><path d="M15 6v15"></path></svg>`,
    calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M16 2v4"></path><path d="M8 2v4"></path><path d="M3 10h18"></path></svg>`,
    board: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"></rect><path d="M9 4v16"></path><path d="M15 4v16"></path></svg>`,
    star: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3 6 7 .9-5 4.7 1.3 6.8L12 17l-6.3 3.4L7 13.6 2 8.9 9 8z"></path></svg>`,
    path: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="3"></circle><circle cx="18" cy="18" r="3"></circle><path d="M9 6h3a4 4 0 0 1 0 8h-1a4 4 0 0 0 0 8h4"></path></svg>`,
    users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.9"></path><path d="M16 3.1a4 4 0 0 1 0 7.8"></path></svg>`,
    plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>`,
    link: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1"></path><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"></path></svg>`,
    copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
    reset: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 3-6.7"></path><path d="M3 4v6h6"></path></svg>`,
    trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"></path><path d="M8 6V4h8v2"></path><path d="M19 6l-1 14H6L5 6"></path></svg>`,
    spark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"></path></svg>`,
    left: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"></path></svg>`,
    right: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"></path></svg>`
  };

  return `<span class="icon" aria-hidden="true">${icons[name] || icons.star}</span>`;
}
