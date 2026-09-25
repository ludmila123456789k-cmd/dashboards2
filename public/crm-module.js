(() => {
  const VERSION = "20260925-01";
  const CRM_KEY = "crmDevelopment";
  const ACTIVE_KEY = "konglomerat-crm-active";
  const STATUSES = ["Открыто", "В работе", "Подтверждение закрытия", "Пауза", "Отмена", "Закрыто"];
  const PRIORITIES = ["Очень низкий", "Низкий", "Обычный", "Высокий", "Очень высокий"];
  const RELATION_TYPES = ["Связана с", "Блокирует", "Заблокирована задачей", "Дублирует", "Дублируется задачей", "Клонирует", "Клонирована из"];
  const CLOSED_STATUSES = new Set(["Закрыто", "Отмена"]);
  const STORE_FALLBACK = "konglomerat-crm-fallback";

  let workspace = null;
  let crm = null;
  let view = "board";
  let openedTaskId = null;
  let filters = { assignees: ["all"], overdue: false, priority: "", search: "" };

  function boot() {
    injectStyles();
    wireGlobalEvents();
    waitForShell();
    window.addEventListener("hashchange", () => {
      if (isCrmRoute()) openCrm(readCrmViewFromHash());
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();

  function waitForShell() {
    ensureNavButton();
    if (isCrmRoute()) openCrm(readCrmViewFromHash());
    new MutationObserver(() => {
      ensureNavButton();
      if (isCrmRoute() && !document.querySelector(".crm-shell")) openCrm(readCrmViewFromHash());
    }).observe(document.documentElement, { childList: true, subtree: true });
  }

  function ensureNavButton() {
    const nav = document.querySelector(".nav");
    if (!nav || nav.querySelector("[data-crm-nav]")) return;
    const button = document.createElement("button");
    button.className = "nav-button";
    button.type = "button";
    button.dataset.crmNav = "true";
    button.innerHTML = `<span class="nav-icon">${svgIcon("kanban")}</span><span>Разработка CRM</span>`;
    const employees = nav.querySelector('[data-section="employees"]');
    if (employees?.nextSibling) nav.insertBefore(button, employees.nextSibling);
    else nav.appendChild(button);
  }

  function wireGlobalEvents() {
    document.addEventListener("click", async event => {
      const nav = event.target.closest?.("[data-crm-nav]");
      if (nav) {
        event.preventDefault();
        location.hash = "section=crm&crm=board";
        await openCrm("board");
        return;
      }
      const action = event.target.closest?.("[data-crm-action]");
      if (!action) return;
      event.preventDefault();
      await handleAction(action);
    });

    document.addEventListener("change", async event => {
      const input = event.target.closest?.("[data-crm-change]");
      if (!input) return;
      await handleChange(input, event);
    });

    document.addEventListener("input", event => {
      const input = event.target.closest?.("[data-crm-filter]");
      if (!input) return;
      updateFilter(input);
      renderCrm();
    });

    document.addEventListener("dragstart", event => {
      const card = event.target.closest?.("[data-crm-task]");
      if (!card) return;
      event.dataTransfer.setData("text/plain", card.dataset.crmTask);
      event.dataTransfer.effectAllowed = "move";
    });
    document.addEventListener("dragover", event => {
      if (event.target.closest?.("[data-crm-drop-status], [data-crm-drop-backlog]")) event.preventDefault();
    });
    document.addEventListener("drop", async event => {
      const target = event.target.closest?.("[data-crm-drop-status], [data-crm-drop-backlog]");
      if (!target) return;
      event.preventDefault();
      const taskId = event.dataTransfer.getData("text/plain");
      if (!taskId) return;
      if (target.dataset.crmDropStatus) await moveTaskToStatus(taskId, target.dataset.crmDropStatus);
      if (target.dataset.crmDropBacklog) await moveTaskToBacklog(taskId);
    });

    document.addEventListener("paste", async event => {
      const zone = event.target.closest?.("[data-crm-editor]");
      if (!zone || !openedTaskId) return;
      const files = [...(event.clipboardData?.files || [])].filter(file => file.type.startsWith("image/"));
      if (!files.length) return;
      event.preventDefault();
      await addFilesToTask(openedTaskId, files, "Вставлено изображение из буфера");
    });
  }

  async function openCrm(nextView = "board") {
    view = nextView || view;
    try { localStorage.setItem(ACTIVE_KEY, view); } catch (error) {}
    await loadWorkspace();
    renderCrm();
  }

  async function loadWorkspace() {
    try {
      const response = await fetch("/api/workspace", { cache: "no-store" });
      if (!response.ok) throw new Error("workspace");
      const payload = await response.json();
      workspace = payload.workspace || payload;
    } catch (error) {
      workspace = readFallbackWorkspace();
    }
    workspace.sections = workspace.sections || {};
    workspace.sections.employees = workspace.sections.employees || {};
    crm = normalizeCrm(workspace.sections.employees[CRM_KEY]);
    workspace.sections.employees[CRM_KEY] = crm;
  }

  async function saveCrm(message = "Сохранено") {
    if (!workspace || !crm) return;
    crm.updated_at = nowIso();
    workspace.updatedAt = crm.updated_at;
    workspace.sections.employees.updatedAt = crm.updated_at;
    workspace.sections.employees[CRM_KEY] = crm;
    try {
      const response = await fetch("/api/workspace", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspace })
      });
      if (!response.ok) throw new Error("save");
      const payload = await response.json().catch(() => ({}));
      if (payload.workspace) workspace = payload.workspace;
      crm = normalizeCrm(workspace.sections?.employees?.[CRM_KEY] || crm);
      showToast(message);
    } catch (error) {
      writeFallbackWorkspace(workspace);
      showToast("Сохранено локально. Сервер временно недоступен");
    }
  }

  function normalizeCrm(source) {
    const data = source && typeof source === "object" ? source : {};
    const assignees = Array.isArray(data.assignees) ? data.assignees : defaultAssignees();
    const tasks = Array.isArray(data.tasks) ? data.tasks : defaultTasks(assignees);
    return {
      version: 2,
      next_number: Math.max(Number(data.next_number) || 1, ...tasks.map(task => Number(task.number) || 0)) + 1,
      assignees: assignees.map(normalizeAssignee),
      tasks: tasks.map(normalizeTask),
      updated_at: data.updated_at || nowIso()
    };
  }

  function normalizeAssignee(item) {
    const nameParts = String(item.name || "").split(" ").filter(Boolean);
    return {
      id: item.id || newId("a"),
      first_name: item.first_name || nameParts[1] || item.name || "",
      last_name: item.last_name || nameParts[0] || "",
      position: item.position || "",
      telegram: item.telegram || "",
      active: item.active !== false
    };
  }

  function normalizeTask(item) {
    const time = nowIso();
    const task = {
      id: item.id || newId("t"),
      number: Number(item.number) || 0,
      title: item.title || "Новая задача",
      description: item.description || "",
      status: STATUSES.includes(item.status) ? item.status : "Открыто",
      priority: PRIORITIES.includes(item.priority) ? item.priority : "Обычный",
      rank: Number.isFinite(Number(item.rank)) ? Number(item.rank) : 1000,
      location: item.location === "BOARD" ? "BOARD" : "BACKLOG",
      assignee_id: item.assignee_id || "",
      author_name: item.author_name || "",
      start_date: item.start_date || "",
      due_date: item.due_date || "",
      labels: Array.isArray(item.labels) ? item.labels : [],
      attachments: Array.isArray(item.attachments) ? item.attachments : [],
      comments: Array.isArray(item.comments) ? item.comments : [],
      relations: Array.isArray(item.relations) ? item.relations : [],
      history: Array.isArray(item.history) ? item.history : [],
      created_at: item.created_at || time,
      updated_at: item.updated_at || time,
      closed_at: item.closed_at || "",
      deleted_at: item.deleted_at || "",
      restore_location: item.restore_location || item.location || "BACKLOG",
      restore_status: item.restore_status || item.status || "Открыто"
    };
    if (!task.number) task.number = nextNumberPreview();
    return task;
  }

  function defaultAssignees() {
    return [
      { id: "crm-a-1", first_name: "Людмила", last_name: "Жакешова", position: "CRM", active: true },
      { id: "crm-a-2", first_name: "Максим", last_name: "Войлов", position: "Разработка", active: true }
    ];
  }

  function defaultTasks(assignees) {
    const time = nowIso();
    return [
      makeTask({ number: 1, title: "Описать этапы CRM", priority: "Высокий", status: "Открыто", location: "BACKLOG", rank: 1, assignee_id: assignees[0]?.id || "", author_name: "Система", created_at: time, updated_at: time }),
      makeTask({ number: 2, title: "Собрать требования по отчетности", priority: "Обычный", status: "В работе", location: "BOARD", rank: 2, assignee_id: assignees[1]?.id || "", author_name: "Система", created_at: time, updated_at: time })
    ];
  }

  function makeTask(overrides = {}) {
    const time = nowIso();
    return normalizeTask({
      id: newId("t"), number: overrides.number || 0, title: overrides.title || "Новая задача", description: "",
      status: overrides.status || "Открыто", priority: overrides.priority || "Обычный", rank: overrides.rank || 1000,
      location: overrides.location || "BACKLOG", assignee_id: overrides.assignee_id || "", author_name: overrides.author_name || "",
      created_at: overrides.created_at || time, updated_at: overrides.updated_at || time,
      history: [{ id: newId("h"), at: time, action: "Задача создана", user: overrides.author_name || "Система" }]
    });
  }

  function renderCrm() {
    if (!crm) return;
    const content = document.querySelector(".content") || document.querySelector("main") || document.querySelector("#app");
    if (!content) return;
    document.querySelectorAll(".nav-button").forEach(button => button.classList.remove("active"));
    document.querySelector("[data-crm-nav]")?.classList.add("active");
    content.classList.remove("employees-content");
    content.innerHTML = `
      <section class="crm-shell">
        <div class="crm-header">
          <div>
            <div class="eyebrow">Разработка CRM</div>
            <h1>Kanban и Backlog</h1>
          </div>
          <div class="crm-actions">
            <button class="button" data-crm-action="new-board" type="button">${svgIcon("plus")} Задача на Kanban</button>
            <button class="button" data-crm-action="new-backlog" type="button">${svgIcon("plus")} Задача в Backlog</button>
          </div>
        </div>
        ${renderTabs()}
        ${view === "board" ? renderBoardView() : ""}
        ${view === "backlog" ? renderBacklogView() : ""}
        ${view === "assignees" ? renderAssigneesView() : ""}
        ${view === "deleted" ? renderDeletedView() : ""}
      </section>
      ${openedTaskId ? renderTaskDrawer(getTask(openedTaskId)) : ""}
    `;
    renderRichTextPreviews();
  }

  function renderTabs() {
    const tabs = [["board", "Kanban"], ["backlog", "Backlog"], ["assignees", "Исполнители"], ["deleted", "Удалённые"]];
    return `<div class="crm-tabs">${tabs.map(([id, label]) => `<button class="crm-tab ${view === id ? "active" : ""}" data-crm-action="tab" data-view="${id}" type="button">${label}</button>`).join("")}</div>`;
  }

  function renderFilters() {
    const activeAssignees = crm.assignees.filter(item => item.active);
    return `
      <div class="crm-filters">
        <label class="field-wrap"><span>Поиск</span><input class="field" data-crm-filter="search" value="${escapeAttr(filters.search)}" placeholder="#12 или название"></label>
        <label class="field-wrap"><span>Приоритет</span><select class="field" data-crm-filter="priority"><option value="">Все</option>${PRIORITIES.map(item => `<option ${filters.priority === item ? "selected" : ""}>${item}</option>`).join("")}</select></label>
        <label class="crm-check"><input type="checkbox" data-crm-filter="overdue" ${filters.overdue ? "checked" : ""}> Просроченные</label>
        <div class="crm-assignee-filter"><span>Исполнители</span><label><input type="checkbox" data-crm-filter="assignee" value="all" ${filters.assignees.includes("all") ? "checked" : ""}> Всего</label>${activeAssignees.map(item => `<label><input type="checkbox" data-crm-filter="assignee" value="${escapeAttr(item.id)}" ${filters.assignees.includes(item.id) ? "checked" : ""}> ${escapeHtml(assigneeName(item))}</label>`).join("")}</div>
      </div>`;
  }

  function renderBoardView() {
    return `${renderFilters()}<div class="crm-board">${STATUSES.map(status => {
      const tasks = filteredTasks().filter(task => task.location === "BOARD" && task.status === status && !task.deleted_at);
      return `<div class="crm-column" data-crm-drop-status="${escapeAttr(status)}"><div class="crm-column-head"><strong>${status}</strong><span>${tasks.length}</span></div>${tasks.map(renderTaskCard).join("") || `<div class="crm-empty">Нет задач</div>`}</div>`;
    }).join("")}</div>`;
  }

  function renderBacklogView() {
    const tasks = filteredTasks().filter(task => task.location === "BACKLOG" && !task.deleted_at).sort((a, b) => a.rank - b.rank);
    return `${renderFilters()}<div class="crm-backlog" data-crm-drop-backlog="true"><div class="crm-list-head"><span>Очередь</span><span>Приоритет</span><span>Исполнитель</span><span>Срок</span><span></span></div>${tasks.map((task, index) => renderBacklogRow(task, index)).join("") || `<div class="crm-empty">Backlog пуст</div>`}</div>`;
  }

  function renderTaskCard(task) {
    const overdue = isOverdue(task);
    return `<article class="crm-card ${overdue ? "overdue" : ""}" draggable="true" data-crm-task="${task.id}" data-crm-action="open-task" data-task-id="${task.id}">
      <div class="crm-card-top"><strong>#${task.number}</strong><span class="priority p-${priorityIndex(task.priority)}">${escapeHtml(task.priority)}</span></div>
      <div class="crm-card-title">${escapeHtml(task.title)}</div>
      <div class="crm-card-meta">${task.assignee_id ? `<span>${escapeHtml(assigneeNameById(task.assignee_id))}</span>` : ""}${task.due_date ? `<span class="${overdue ? "danger-text" : ""}">${formatDate(task.due_date)}</span>` : ""}${task.attachments.length ? `<span>📎 ${task.attachments.length}</span>` : ""}${task.author_name ? `<span>${escapeHtml(task.author_name)}</span>` : ""}</div>
      ${task.labels?.length ? `<div class="crm-labels">${task.labels.map(label => `<span>${escapeHtml(label)}</span>`).join("")}</div>` : ""}
    </article>`;
  }

  function renderBacklogRow(task, index) {
    return `<div class="crm-row ${isOverdue(task) ? "overdue" : ""}" draggable="true" data-crm-task="${task.id}">
      <button class="icon-button" data-crm-action="rank-up" data-task-id="${task.id}" ${index === 0 ? "disabled" : ""}>↑</button>
      <button class="icon-button" data-crm-action="rank-down" data-task-id="${task.id}">↓</button>
      <button class="link-button" data-crm-action="open-task" data-task-id="${task.id}">#${task.number} ${escapeHtml(task.title)}</button>
      <span class="priority p-${priorityIndex(task.priority)}">${escapeHtml(task.priority)}</span>
      <span>${escapeHtml(assigneeNameById(task.assignee_id) || "—")}</span>
      <span class="${isOverdue(task) ? "danger-text" : ""}">${task.due_date ? formatDate(task.due_date) : "—"}</span>
      <button class="button small" data-crm-action="take-to-board" data-task-id="${task.id}">Взять в работу</button>
    </div>`;
  }

  function renderAssigneesView() {
    return `<div class="panel crm-panel"><div class="crm-subhead"><h2>Исполнители</h2><button class="button" data-crm-action="add-assignee">${svgIcon("plus")} Добавить</button></div><div class="crm-assignee-list">${crm.assignees.map(item => `
      <div class="crm-assignee-card ${item.active ? "" : "muted"}">
        <input class="field" data-crm-change="assignee-field" data-id="${item.id}" data-field="last_name" value="${escapeAttr(item.last_name)}" placeholder="Фамилия">
        <input class="field" data-crm-change="assignee-field" data-id="${item.id}" data-field="first_name" value="${escapeAttr(item.first_name)}" placeholder="Имя">
        <input class="field" data-crm-change="assignee-field" data-id="${item.id}" data-field="position" value="${escapeAttr(item.position)}" placeholder="Должность">
        <input class="field" data-crm-change="assignee-field" data-id="${item.id}" data-field="telegram" value="${escapeAttr(item.telegram)}" placeholder="Telegram">
        <button class="button small" data-crm-action="toggle-assignee" data-id="${item.id}">${item.active ? "Деактивировать" : "Активировать"}</button>
      </div>`).join("")}</div></div>`;
  }

  function renderDeletedView() {
    const tasks = crm.tasks.filter(task => task.deleted_at).sort((a, b) => String(b.deleted_at).localeCompare(String(a.deleted_at)));
    return `<div class="panel crm-panel"><h2>Удалённые задачи</h2>${tasks.map(task => `<div class="crm-deleted-row"><button class="link-button" data-crm-action="open-task" data-task-id="${task.id}">#${task.number} ${escapeHtml(task.title)}</button><span>${formatDateTime(task.deleted_at)}</span><button class="button small" data-crm-action="restore-task" data-task-id="${task.id}">Восстановить</button></div>`).join("") || `<div class="crm-empty">Удалённых задач нет</div>`}</div>`;
  }

  function renderTaskDrawer(task) {
    if (!task) return "";
    const readonly = Boolean(task.deleted_at);
    return `<div class="crm-drawer-backdrop" data-crm-action="close-task"><aside class="crm-drawer" onclick="event.stopPropagation()">
      <div class="crm-drawer-head"><div><div class="eyebrow">#${task.number}</div><h2>${escapeHtml(task.title)}</h2></div><button class="icon-button" data-crm-action="close-task">×</button></div>
      <div class="crm-task-layout">
        <div class="crm-task-main">
          <label class="field-wrap"><span>Название</span><input class="field" data-crm-change="task-field" data-task-id="${task.id}" data-field="title" value="${escapeAttr(task.title)}" ${readonly ? "disabled" : ""}></label>
          <label class="field-wrap"><span>Описание</span><div class="crm-editor" contenteditable="${readonly ? "false" : "true"}" data-crm-editor="description" data-task-id="${task.id}">${task.description || ""}</div></label>
          <div class="crm-editor-tools"><button class="button small" data-crm-action="format" data-command="bold"><b>B</b></button><button class="button small" data-crm-action="format" data-command="italic"><i>I</i></button><button class="button small" data-crm-action="format" data-command="insertUnorderedList">• список</button><button class="button small" data-crm-action="save-description" data-task-id="${task.id}">Сохранить описание</button></div>
          <section class="crm-block"><h3>Вложения</h3>${readonly ? "" : `<label class="button small file-button">Прикрепить файл<input type="file" multiple data-crm-change="task-files" data-task-id="${task.id}"></label><div class="crm-dropzone" data-crm-action="noop" ondragover="event.preventDefault()" ondrop="window.__crmDropFiles && window.__crmDropFiles(event, '${task.id}')">Перетащите файлы сюда или вставьте изображение Ctrl+V в описание</div>`}${renderAttachments(task)}</section>
          <section class="crm-block"><h3>Комментарии</h3>${renderComments(task)}${readonly ? "" : `<textarea class="field crm-comment-input" data-comment-input="${task.id}" placeholder="Новый комментарий"></textarea><button class="button small" data-crm-action="add-comment" data-task-id="${task.id}">Добавить комментарий</button>`}</section>
          <section class="crm-block"><h3>Связанные задачи</h3>${renderRelations(task)}${readonly ? "" : renderRelationForm(task)}</section>
          <section class="crm-block"><h3>История</h3><div class="crm-history">${task.history.slice().reverse().map(item => `<div><span>${formatDateTime(item.at)}</span> ${escapeHtml(item.action)} ${item.from || item.to ? `<small>${escapeHtml(item.from || "")} → ${escapeHtml(item.to || "")}</small>` : ""}</div>`).join("")}</div></section>
        </div>
        <aside class="crm-side">
          ${selectField(task, "status", "Статус", STATUSES, readonly)}
          ${selectField(task, "priority", "Приоритет", PRIORITIES, readonly)}
          <label class="field-wrap"><span>Исполнитель</span><select class="field" data-crm-change="task-field" data-task-id="${task.id}" data-field="assignee_id" ${readonly ? "disabled" : ""}><option value="">Не назначен</option>${crm.assignees.map(item => `<option value="${item.id}" ${task.assignee_id === item.id ? "selected" : ""}>${escapeHtml(assigneeName(item))}${item.active ? "" : " (неактивен)"}</option>`).join("")}</select></label>
          <label class="field-wrap"><span>Автор</span><input class="field" data-crm-change="task-field" data-task-id="${task.id}" data-field="author_name" value="${escapeAttr(task.author_name)}" ${readonly ? "disabled" : ""}></label>
          <label class="field-wrap"><span>Дата начала</span><input class="field" type="date" data-crm-change="task-field" data-task-id="${task.id}" data-field="start_date" value="${escapeAttr(task.start_date)}" ${readonly ? "disabled" : ""}></label>
          <label class="field-wrap"><span>Срок</span><input class="field" type="date" data-crm-change="task-field" data-task-id="${task.id}" data-field="due_date" value="${escapeAttr(task.due_date)}" ${readonly ? "disabled" : ""}></label>
          <div class="crm-side-dates"><div>Создана: ${formatDateTime(task.created_at)}</div><div>Обновлена: ${formatDateTime(task.updated_at)}</div></div>
          ${task.location === "BOARD" && !readonly ? `<button class="button" data-crm-action="to-backlog" data-task-id="${task.id}">Вернуть в Backlog</button>` : ""}
          ${task.location === "BACKLOG" && !readonly ? `<button class="button" data-crm-action="take-to-board" data-task-id="${task.id}">Взять в работу</button>` : ""}
          ${readonly ? `<button class="button" data-crm-action="restore-task" data-task-id="${task.id}">Восстановить</button>` : `<button class="button danger" data-crm-action="delete-task" data-task-id="${task.id}">Удалить задачу</button>`}
        </aside>
      </div>
    </aside></div>`;
  }

  function selectField(task, field, label, options, readonly) {
    return `<label class="field-wrap"><span>${label}</span><select class="field" data-crm-change="task-field" data-task-id="${task.id}" data-field="${field}" ${readonly ? "disabled" : ""}>${options.map(item => `<option ${task[field] === item ? "selected" : ""}>${item}</option>`).join("")}</select></label>`;
  }

  function renderAttachments(task) {
    return `<div class="crm-attachments">${task.attachments.map(file => `<div class="crm-attachment"><a href="${escapeAttr(file.data_url || "#")}" download="${escapeAttr(file.name)}">${escapeHtml(file.name)}</a><span>${formatBytes(file.size)} · ${formatDateTime(file.uploaded_at)}</span><button class="icon-button" data-crm-action="remove-attachment" data-task-id="${task.id}" data-id="${file.id}">×</button></div>`).join("") || `<div class="crm-empty">Файлов пока нет</div>`}</div>`;
  }

  function renderComments(task) {
    return `<div class="crm-comments">${task.comments.map(comment => `<div class="crm-comment"><div>${escapeHtml(comment.text)}</div><small>${formatDateTime(comment.created_at)}${comment.updated_at && comment.updated_at !== comment.created_at ? " · изменён" : ""}</small><button class="link-button" data-crm-action="edit-comment" data-task-id="${task.id}" data-id="${comment.id}">Редактировать</button><button class="link-button danger-text" data-crm-action="remove-comment" data-task-id="${task.id}" data-id="${comment.id}">Удалить</button></div>`).join("") || `<div class="crm-empty">Комментариев пока нет</div>`}</div>`;
  }

  function renderRelations(task) {
    return `<div class="crm-relations">${task.relations.map(rel => { const target = getTask(rel.task_id); return `<div class="crm-relation"><span>${escapeHtml(rel.type)}</span><button class="link-button" data-crm-action="open-task" data-task-id="${rel.task_id}">#${target?.number || "?"} ${escapeHtml(target?.title || "Задача не найдена")}</button><button class="icon-button" data-crm-action="remove-relation" data-task-id="${task.id}" data-id="${rel.id}">×</button></div>`; }).join("") || `<div class="crm-empty">Связей пока нет</div>`}</div>`;
  }

  function renderRelationForm(task) {
    const candidates = crm.tasks.filter(item => item.id !== task.id && !item.deleted_at);
    return `<div class="crm-relation-form"><select class="field" data-relation-type="${task.id}">${RELATION_TYPES.map(item => `<option>${item}</option>`).join("")}</select><select class="field" data-relation-task="${task.id}">${candidates.map(item => `<option value="${item.id}">#${item.number} ${escapeHtml(item.title)}</option>`).join("")}</select><button class="button small" data-crm-action="add-relation" data-task-id="${task.id}">Добавить связь</button></div>`;
  }

  async function handleAction(button) {
    const action = button.dataset.crmAction;
    const taskId = button.dataset.taskId;
    if (action === "tab") { view = button.dataset.view || "board"; openedTaskId = null; location.hash = `section=crm&crm=${view}`; renderCrm(); return; }
    if (action === "new-board") return createTask("BOARD");
    if (action === "new-backlog") return createTask("BACKLOG");
    if (action === "open-task") { openedTaskId = taskId; renderCrm(); return; }
    if (action === "close-task") { openedTaskId = null; renderCrm(); return; }
    if (action === "take-to-board") return moveTaskToStatus(taskId, "Открыто");
    if (action === "to-backlog") return moveTaskToBacklog(taskId);
    if (action === "delete-task") return softDeleteTask(taskId);
    if (action === "restore-task") return restoreTask(taskId);
    if (action === "rank-up") return shiftRank(taskId, -1);
    if (action === "rank-down") return shiftRank(taskId, 1);
    if (action === "add-assignee") return addAssignee();
    if (action === "toggle-assignee") return toggleAssignee(button.dataset.id);
    if (action === "save-description") return saveDescription(taskId);
    if (action === "format") { document.execCommand(button.dataset.command, false, null); return; }
    if (action === "add-comment") return addComment(taskId);
    if (action === "edit-comment") return editComment(taskId, button.dataset.id);
    if (action === "remove-comment") return removeComment(taskId, button.dataset.id);
    if (action === "remove-attachment") return removeAttachment(taskId, button.dataset.id);
    if (action === "add-relation") return addRelation(taskId);
    if (action === "remove-relation") return removeRelation(taskId, button.dataset.id);
  }

  async function handleChange(input) {
    const change = input.dataset.crmChange;
    if (change === "task-field") return updateTaskField(input.dataset.taskId, input.dataset.field, input.value);
    if (change === "assignee-field") return updateAssigneeField(input.dataset.id, input.dataset.field, input.value);
    if (change === "task-files") return addFilesToTask(input.dataset.taskId, [...input.files], "Добавлен файл");
  }

  function updateFilter(input) {
    const key = input.dataset.crmFilter;
    if (key === "search") filters.search = input.value;
    if (key === "priority") filters.priority = input.value;
    if (key === "overdue") filters.overdue = input.checked;
    if (key === "assignee") {
      const boxes = [...document.querySelectorAll('[data-crm-filter="assignee"]')].filter(box => box.checked).map(box => box.value);
      filters.assignees = boxes.includes("all") || !boxes.length ? ["all"] : boxes;
    }
  }

  async function createTask(location) {
    const title = prompt("Название задачи");
    if (!title) return;
    const task = makeTask({ title, location, status: "Открыто", priority: "Обычный", number: crm.next_number++, rank: nextRank() });
    crm.tasks.push(task);
    addHistory(task, "Задача создана");
    openedTaskId = task.id;
    view = location === "BOARD" ? "board" : "backlog";
    await saveCrm("Задача создана");
    renderCrm();
  }

  async function updateTaskField(taskId, field, value) {
    const task = getTask(taskId); if (!task) return;
    const oldValue = task[field] || "";
    task[field] = value;
    if (field === "status") task.closed_at = value === "Закрыто" ? nowIso() : "";
    task.updated_at = nowIso();
    addHistory(task, historyLabel(field), oldValue, value);
    await saveCrm("Задача обновлена");
    renderCrm();
  }

  async function saveDescription(taskId) {
    const task = getTask(taskId); if (!task) return;
    const editor = document.querySelector(`[data-crm-editor][data-task-id="${cssEscape(taskId)}"]`);
    const next = editor?.innerHTML || "";
    if (next !== task.description) {
      task.description = next;
      task.updated_at = nowIso();
      addHistory(task, "Описание изменено");
      await saveCrm("Описание сохранено");
    }
    renderCrm();
  }

  async function moveTaskToStatus(taskId, status) {
    const task = getTask(taskId); if (!task || task.deleted_at) return;
    const fromLocation = task.location;
    const oldStatus = task.status;
    task.location = "BOARD";
    task.status = status;
    task.updated_at = nowIso();
    if (oldStatus !== status) addHistory(task, "Статус", oldStatus, status);
    if (fromLocation !== "BOARD") addHistory(task, "Перенос Backlog → Kanban");
    await saveCrm("Задача перенесена");
    renderCrm();
  }

  async function moveTaskToBacklog(taskId) {
    const task = getTask(taskId); if (!task || task.deleted_at) return;
    const oldLocation = task.location;
    const oldStatus = task.status;
    task.location = "BACKLOG";
    task.status = "Открыто";
    task.rank = nextRank();
    task.updated_at = nowIso();
    if (oldLocation !== "BACKLOG") addHistory(task, "Перенос Kanban → Backlog");
    if (oldStatus !== "Открыто") addHistory(task, "Статус", oldStatus, "Открыто");
    await saveCrm("Задача возвращена в Backlog");
    renderCrm();
  }

  async function softDeleteTask(taskId) {
    if (!confirm("Удалить задачу? Её можно будет восстановить.")) return;
    const task = getTask(taskId); if (!task) return;
    task.restore_location = task.location;
    task.restore_status = task.status;
    task.deleted_at = nowIso();
    task.updated_at = task.deleted_at;
    addHistory(task, "Задача удалена");
    openedTaskId = null;
    await saveCrm("Задача удалена");
    renderCrm();
  }

  async function restoreTask(taskId) {
    const task = getTask(taskId); if (!task) return;
    task.deleted_at = "";
    task.location = ["BACKLOG", "BOARD"].includes(task.restore_location) ? task.restore_location : "BACKLOG";
    task.status = STATUSES.includes(task.restore_status) ? task.restore_status : "Открыто";
    task.updated_at = nowIso();
    addHistory(task, "Задача восстановлена");
    await saveCrm("Задача восстановлена");
    renderCrm();
  }

  async function shiftRank(taskId, direction) {
    const tasks = crm.tasks.filter(task => task.location === "BACKLOG" && !task.deleted_at).sort((a, b) => a.rank - b.rank);
    const index = tasks.findIndex(task => task.id === taskId);
    const swap = tasks[index + direction];
    if (index < 0 || !swap) return;
    const current = tasks[index];
    [current.rank, swap.rank] = [swap.rank, current.rank];
    addHistory(current, "Изменён порядок Backlog");
    await saveCrm("Порядок обновлён");
    renderCrm();
  }

  async function addFilesToTask(taskId, files, action) {
    const task = getTask(taskId); if (!task || !files.length) return;
    const packed = await Promise.all(files.map(fileToAttachment));
    task.attachments.push(...packed);
    task.updated_at = nowIso();
    packed.forEach(file => addHistory(task, `${action}: ${file.name}`));
    await saveCrm("Файл добавлен");
    renderCrm();
  }

  window.__crmDropFiles = async (event, taskId) => {
    event.preventDefault();
    await addFilesToTask(taskId, [...event.dataTransfer.files], "Добавлен файл");
  };

  async function fileToAttachment(file) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve({ id: newId("f"), name: file.name, size: file.size, type: file.type, uploaded_at: nowIso(), uploaded_by: "", data_url: reader.result });
      reader.readAsDataURL(file);
    });
  }

  async function removeAttachment(taskId, fileId) {
    const task = getTask(taskId); if (!task) return;
    const file = task.attachments.find(item => item.id === fileId);
    task.attachments = task.attachments.filter(item => item.id !== fileId);
    addHistory(task, `Удалён файл${file ? `: ${file.name}` : ""}`);
    await saveCrm("Файл удалён");
    renderCrm();
  }

  async function addComment(taskId) {
    const input = document.querySelector(`[data-comment-input="${cssEscape(taskId)}"]`);
    const text = input?.value.trim();
    if (!text) return;
    const task = getTask(taskId); if (!task) return;
    task.comments.push({ id: newId("c"), text, created_at: nowIso(), updated_at: nowIso(), author: "" });
    addHistory(task, "Добавлен комментарий");
    await saveCrm("Комментарий добавлен");
    renderCrm();
  }

  async function editComment(taskId, commentId) {
    const task = getTask(taskId); const comment = task?.comments.find(item => item.id === commentId); if (!comment) return;
    const text = prompt("Комментарий", comment.text);
    if (text === null) return;
    comment.text = text;
    comment.updated_at = nowIso();
    addHistory(task, "Комментарий изменён");
    await saveCrm("Комментарий изменён");
    renderCrm();
  }

  async function removeComment(taskId, commentId) {
    const task = getTask(taskId); if (!task) return;
    task.comments = task.comments.filter(item => item.id !== commentId);
    addHistory(task, "Комментарий удалён");
    await saveCrm("Комментарий удалён");
    renderCrm();
  }

  async function addRelation(taskId) {
    const task = getTask(taskId); if (!task) return;
    const type = document.querySelector(`[data-relation-type="${cssEscape(taskId)}"]`)?.value;
    const relatedId = document.querySelector(`[data-relation-task="${cssEscape(taskId)}"]`)?.value;
    if (!relatedId) return;
    task.relations.push({ id: newId("r"), type, task_id: relatedId, created_at: nowIso() });
    addHistory(task, "Добавлена связь задач");
    const other = getTask(relatedId);
    if (other) {
      other.relations.push({ id: newId("r"), type: reverseRelation(type), task_id: taskId, created_at: nowIso() });
      addHistory(other, "Добавлена связь задач");
    }
    await saveCrm("Связь добавлена");
    renderCrm();
  }

  async function removeRelation(taskId, relationId) {
    const task = getTask(taskId); if (!task) return;
    task.relations = task.relations.filter(item => item.id !== relationId);
    addHistory(task, "Связь задач удалена");
    await saveCrm("Связь удалена");
    renderCrm();
  }

  async function addAssignee() {
    crm.assignees.push({ id: newId("a"), first_name: "", last_name: "Новый", position: "", telegram: "", active: true });
    await saveCrm("Исполнитель добавлен");
    renderCrm();
  }

  async function updateAssigneeField(id, field, value) {
    const item = crm.assignees.find(person => person.id === id); if (!item) return;
    item[field] = value;
    await saveCrm("Исполнитель обновлён");
  }

  async function toggleAssignee(id) {
    const item = crm.assignees.find(person => person.id === id); if (!item) return;
    item.active = !item.active;
    await saveCrm(item.active ? "Исполнитель активирован" : "Исполнитель деактивирован");
    renderCrm();
  }

  function filteredTasks() {
    return crm.tasks.filter(task => {
      const search = filters.search.trim().toLowerCase();
      if (search && !(`#${task.number}`.includes(search) || task.title.toLowerCase().includes(search))) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.overdue && !isOverdue(task)) return false;
      if (!filters.assignees.includes("all") && !filters.assignees.includes(task.assignee_id)) return false;
      return true;
    });
  }

  function getTask(id) { return crm.tasks.find(task => task.id === id); }
  function nextRank() { return Math.max(0, ...crm.tasks.filter(task => task.location === "BACKLOG").map(task => Number(task.rank) || 0)) + 1; }
  function nextNumberPreview() { return Math.max(0, ...((crm?.tasks || []).map(task => Number(task.number) || 0))) + 1; }
  function isOverdue(task) { return task.due_date && task.due_date < today() && !CLOSED_STATUSES.has(task.status) && !task.deleted_at; }
  function addHistory(task, action, from = "", to = "") { task.history.push({ id: newId("h"), at: nowIso(), action, from, to, user: "" }); }
  function historyLabel(field) { return ({ title: "Название", status: "Статус", assignee_id: "Исполнитель", author_name: "Автор", priority: "Приоритет", due_date: "Срок", start_date: "Дата начала" })[field] || "Поле изменено"; }
  function reverseRelation(type) { return ({ "Блокирует": "Заблокирована задачей", "Заблокирована задачей": "Блокирует", "Дублирует": "Дублируется задачей", "Дублируется задачей": "Дублирует", "Клонирует": "Клонирована из", "Клонирована из": "Клонирует" })[type] || type; }
  function assigneeNameById(id) { const item = crm.assignees.find(person => person.id === id); return item ? assigneeName(item) : ""; }
  function assigneeName(item) { return `${item.last_name || ""} ${item.first_name || ""}`.trim() || item.name || "Без имени"; }
  function priorityIndex(value) { return Math.max(0, PRIORITIES.indexOf(value)); }
  function renderRichTextPreviews() {}
  function isCrmRoute() { return new URLSearchParams(location.hash.replace(/^#/, "")).get("section") === "crm"; }
  function readCrmViewFromHash() { return new URLSearchParams(location.hash.replace(/^#/, "")).get("crm") || localStorage.getItem(ACTIVE_KEY) || "board"; }
  function readFallbackWorkspace() { try { return JSON.parse(localStorage.getItem(STORE_FALLBACK) || "{}"); } catch (error) { return {}; } }
  function writeFallbackWorkspace(value) { try { localStorage.setItem(STORE_FALLBACK, JSON.stringify(value)); } catch (error) {} }
  function showToast(message) { const toast = document.querySelector("#toast"); if (toast) { toast.textContent = message; toast.classList.add("show"); setTimeout(() => toast.classList.remove("show"), 2200); } }
  function today() { return new Date().toISOString().slice(0, 10); }
  function nowIso() { return new Date().toISOString(); }
  function newId(prefix) { return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`; }
  function formatDate(value) { return value ? value.split("-").reverse().join(".") : ""; }
  function formatDateTime(value) { if (!value) return "—"; try { return new Date(value).toLocaleString("ru-RU"); } catch (error) { return value; } }
  function formatBytes(value) { const size = Number(value) || 0; if (size > 1048576) return `${(size / 1048576).toFixed(1)} МБ`; if (size > 1024) return `${Math.round(size / 1024)} КБ`; return `${size} Б`; }
  function escapeHtml(value) { return String(value ?? "").replace(/[&<>"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char])); }
  function escapeAttr(value) { return escapeHtml(value).replace(/'/g, "&#39;"); }
  function cssEscape(value) { return window.CSS?.escape ? CSS.escape(value) : String(value).replace(/["'\\]/g, "\\$&"); }
  function svgIcon(name) {
    if (name === "plus") return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>`;
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h5v12H4zM10 6h5v12h-5zM16 6h4v12h-4z"/></svg>`;
  }
})();
