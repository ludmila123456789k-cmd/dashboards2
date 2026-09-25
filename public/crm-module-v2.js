(() => {
  'use strict';

  const CRM_VERSION = '20260925-02';
  const CRM_KEY = 'crmDevelopment';
  const SECTION_ID = 'crm-development';
  const STATUSES = ['Открыто', 'В работе', 'Подтверждение закрытия', 'Пауза', 'Отмена', 'Закрыто'];
  const PRIORITIES = ['Низкий', 'Средний', 'Высокий', 'Критичный'];
  const RELATION_TYPES = ['Связана', 'Блокирует', 'Заблокирована', 'Дубликат', 'Родительская', 'Дочерняя'];

  let workspace = null;
  let crm = null;
  let view = 'board';
  let selectedTaskId = null;
  let filters = { assignees: [], status: '', overdue: false, search: '', priority: '' };

  function boot() {
    injectStyles();
    wireEvents();
    waitForApp();
    console.info('[CRM]', CRM_VERSION);
  }

  function waitForApp() {
    const shell = document.querySelector('.sidebar nav, .sidebar, aside, [data-section]') || document.body;
    if (!document.querySelector('[data-crm-nav]')) addNavButton(shell);
    const hash = new URLSearchParams(location.hash.replace(/^#/, '')).get('section');
    if (hash === SECTION_ID) openCrm();
    window.addEventListener('hashchange', () => {
      const next = new URLSearchParams(location.hash.replace(/^#/, '')).get('section');
      if (next === SECTION_ID) openCrm();
    });
  }

  function addNavButton(shell) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'nav-item crm-nav-item';
    btn.dataset.crmNav = '1';
    btn.textContent = 'Разработка CRM';
    btn.addEventListener('click', () => {
      location.hash = 'section=' + SECTION_ID;
      openCrm();
    });
    const employeeNav = Array.from(document.querySelectorAll('button, a')).find((node) => /Отчеты сотрудников/i.test(node.textContent || ''));
    if (employeeNav && employeeNav.parentNode) employeeNav.parentNode.insertBefore(btn, employeeNav.nextSibling);
    else shell.prepend(btn);
  }

  async function openCrm() {
    setActiveNav();
    const content = document.querySelector('.content') || document.querySelector('main') || document.body;
    content.innerHTML = '<section class="crm-shell"><div class="crm-loading">Загружаю CRM...</div></section>';
    try {
      await loadWorkspace();
      render();
    } catch (error) {
      console.error(error);
      content.innerHTML = '<section class="crm-shell"><div class="crm-empty">Не удалось загрузить данные. Обновите страницу и попробуйте ещё раз.</div></section>';
    }
  }

  function setActiveNav() {
    document.querySelectorAll('.nav-item, [data-section]').forEach((node) => node.classList.remove('active'));
    document.querySelector('[data-crm-nav]')?.classList.add('active');
  }

  async function loadWorkspace() {
    const response = await fetch('/api/workspace', { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('workspace load failed');
    const data = await response.json();
    workspace = data.workspace || data;
    workspace.sections = workspace.sections || {};
    workspace.sections.employees = workspace.sections.employees || {};
    crm = normalizeCrm(workspace.sections.employees[CRM_KEY]);
    workspace.sections.employees[CRM_KEY] = crm;
  }

  async function saveCrm() {
    if (!workspace || !crm) return;
    crm.updated_at = new Date().toISOString();
    workspace.updatedAt = crm.updated_at;
    workspace.sections.employees[CRM_KEY] = crm;
    const response = await fetch('/api/workspace', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ workspace })
    });
    if (!response.ok) throw new Error('workspace save failed');
  }

  function normalizeCrm(data) {
    const base = data && typeof data === 'object' ? data : {};
    const assignees = Array.isArray(base.assignees) && base.assignees.length ? base.assignees : [
      assignee('a-crm-1', 'Жакешова Людмила'),
      assignee('a-crm-2', 'Войлов Максим'),
      assignee('a-crm-3', 'Власова Анастасия')
    ];
    const tasks = Array.isArray(base.tasks) ? base.tasks.map(normalizeTask) : [];
    const maxNumber = tasks.reduce((max, task) => Math.max(max, Number(task.number) || 0), 0);
    return {
      project: 'Разработка CRM',
      next_number: Math.max(Number(base.next_number) || 1, maxNumber + 1),
      assignees,
      tasks,
      attachments: Array.isArray(base.attachments) ? base.attachments : [],
      comments: Array.isArray(base.comments) ? base.comments : [],
      relations: Array.isArray(base.relations) ? base.relations : [],
      history: Array.isArray(base.history) ? base.history : [],
      updated_at: base.updated_at || new Date().toISOString()
    };
  }

  function assignee(id, name) {
    return { id, name, active: true, role: '', created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  }

  function normalizeTask(task) {
    const now = new Date().toISOString();
    return {
      id: task.id || uid('task'),
      number: Number(task.number) || 0,
      title: task.title || 'Новая задача',
      description: task.description || '',
      status: STATUSES.includes(task.status) ? task.status : 'Открыто',
      priority: PRIORITIES.includes(task.priority) ? task.priority : 'Средний',
      rank: Number(task.rank) || Date.now(),
      location: task.location === 'BACKLOG' ? 'BACKLOG' : 'BOARD',
      assignee_id: task.assignee_id || '',
      author_name: task.author_name || 'Команда',
      start_date: task.start_date || '',
      due_date: task.due_date || '',
      created_at: task.created_at || now,
      updated_at: task.updated_at || now,
      deleted_at: task.deleted_at || ''
    };
  }

  function render() {
    const content = document.querySelector('.content') || document.querySelector('main') || document.body;
    content.innerHTML = `
      <section class="crm-shell">
        <header class="crm-header">
          <div><p class="crm-kicker">Проект</p><h1>Разработка CRM</h1><span>${activeTasks().length} активных задач</span></div>
          <button class="crm-primary" data-crm-action="new-task">+ Задача</button>
        </header>
        <div class="crm-tabs">
          ${tab('board', 'Доска')}${tab('backlog', 'Бэклог')}${tab('assignees', 'Исполнители')}${tab('deleted', 'Удаленные')}
        </div>
        ${view === 'assignees' ? renderAssignees() : view === 'deleted' ? renderDeleted() : renderWorkArea()}
      </section>`;
    if (selectedTaskId) renderDrawer(selectedTaskId);
  }

  function tab(id, label) {
    return `<button class="${view === id ? 'active' : ''}" data-crm-view="${id}">${label}</button>`;
  }

  function renderWorkArea() {
    const visible = filteredTasks().filter((task) => view === 'backlog' ? task.location === 'BACKLOG' : task.location === 'BOARD');
    return `
      <section class="crm-filters">
        <input data-crm-filter="search" value="${esc(filters.search)}" placeholder="Поиск по номеру или названию">
        <select data-crm-filter="status"><option value="">Все статусы</option>${STATUSES.map((s) => opt(s, filters.status)).join('')}</select>
        <select data-crm-filter="priority"><option value="">Все приоритеты</option>${PRIORITIES.map((p) => opt(p, filters.priority)).join('')}</select>
        <label><input type="checkbox" data-crm-filter="overdue" ${filters.overdue ? 'checked' : ''}> Просроченные</label>
      </section>
      ${view === 'backlog' ? renderBacklog(visible) : renderBoard(visible)}`;
  }

  function renderBoard(tasks) {
    return `<section class="crm-board">${STATUSES.map((status) => {
      const list = tasks.filter((task) => task.status === status).sort(byRank);
      return `<div class="crm-column" data-drop-status="${esc(status)}"><h2>${status}<span>${list.length}</span></h2>${list.map(renderTaskCard).join('') || '<div class="crm-empty-small">Нет задач</div>'}</div>`;
    }).join('')}</section>`;
  }

  function renderBacklog(tasks) {
    const list = tasks.sort(byRank);
    return `<section class="crm-list"><header><h2>Бэклог</h2><button data-crm-action="new-task-backlog">+ В бэклог</button></header>${list.map(renderTaskRow).join('') || '<div class="crm-empty">В бэклоге пока нет задач</div>'}</section>`;
  }

  function renderTaskCard(task) {
    return `<article class="crm-card ${overdue(task) ? 'overdue' : ''}" draggable="true" data-task-id="${task.id}">
      <div><b>#${task.number} ${esc(task.title)}</b><button data-crm-open="${task.id}">Открыть</button></div>
      <p>${task.description ? strip(task.description).slice(0, 120) : 'Описание не заполнено'}</p>
      <footer><span>${esc(task.priority)}</span><span>${assigneeName(task.assignee_id) || 'Без исполнителя'}</span>${task.due_date ? `<span>до ${dateRu(task.due_date)}</span>` : ''}</footer>
    </article>`;
  }

  function renderTaskRow(task) {
    return `<article class="crm-row" data-task-id="${task.id}"><b>#${task.number} ${esc(task.title)}</b><span>${esc(task.status)}</span><span>${assigneeName(task.assignee_id) || 'Без исполнителя'}</span><button data-crm-action="to-board" data-id="${task.id}">На доску</button><button data-crm-open="${task.id}">Открыть</button></article>`;
  }

  function renderAssignees() {
    return `<section class="crm-list"><header><h2>Исполнители</h2><button data-crm-action="new-assignee">+ Исполнитель</button></header>${crm.assignees.map((person) => `<article class="crm-row"><b>${esc(person.name)}</b><span>${person.active ? 'Активен' : 'Отключен'}</span><button data-crm-action="edit-assignee" data-id="${person.id}">Изменить</button><button data-crm-action="toggle-assignee" data-id="${person.id}">${person.active ? 'Отключить' : 'Вернуть'}</button></article>`).join('')}</section>`;
  }

  function renderDeleted() {
    const list = crm.tasks.filter((task) => task.deleted_at).sort((a, b) => b.deleted_at.localeCompare(a.deleted_at));
    return `<section class="crm-list"><header><h2>Удаленные задачи</h2></header>${list.map((task) => `<article class="crm-row"><b>#${task.number} ${esc(task.title)}</b><span>${dateRu(task.deleted_at)}</span><button data-crm-action="restore-task" data-id="${task.id}">Восстановить</button></article>`).join('') || '<div class="crm-empty">Удаленных задач нет</div>'}</section>`;
  }

  function renderDrawer(id) {
    const task = crm.tasks.find((item) => item.id === id);
    if (!task || task.deleted_at) { selectedTaskId = null; return; }
    document.querySelector('.crm-drawer')?.remove();
    document.body.insertAdjacentHTML('beforeend', `
      <aside class="crm-drawer">
        <button class="crm-close" data-crm-action="close-drawer">×</button>
        <p class="crm-kicker">Задача #${task.number}</p>
        <input class="crm-title-input" data-task-field="title" data-id="${task.id}" value="${esc(task.title)}">
        <div class="crm-side-grid">
          <label>Статус<select data-task-field="status" data-id="${task.id}">${STATUSES.map((s) => opt(s, task.status)).join('')}</select></label>
          <label>Приоритет<select data-task-field="priority" data-id="${task.id}">${PRIORITIES.map((p) => opt(p, task.priority)).join('')}</select></label>
          <label>Исполнитель<select data-task-field="assignee_id" data-id="${task.id}"><option value="">Не выбран</option>${crm.assignees.filter((a) => a.active || a.id === task.assignee_id).map((a) => opt(a.id, task.assignee_id, a.name)).join('')}</select></label>
          <label>Срок<input type="date" data-task-field="due_date" data-id="${task.id}" value="${esc(task.due_date)}"></label>
        </div>
        <div class="crm-richbar"><button data-rich="bold"><b>B</b></button><button data-rich="insertUnorderedList">Список</button><button data-rich="formatBlock" data-value="h3">Заголовок</button><button data-rich="createLink">Ссылка</button></div>
        <div class="crm-editor" contenteditable="true" data-description="${task.id}">${sanitize(task.description)}</div>
        <div class="crm-actions"><button data-crm-action="save-description" data-id="${task.id}">Сохранить описание</button><button data-crm-action="to-backlog" data-id="${task.id}">В бэклог</button><button class="danger" data-crm-action="delete-task" data-id="${task.id}">Удалить</button></div>
        ${renderAttachments(task.id)}
        ${renderComments(task.id)}
        ${renderRelations(task.id)}
        ${renderHistory(task.id)}
      </aside>`);
  }

  function renderAttachments(taskId) {
    const list = crm.attachments.filter((file) => file.task_id === taskId);
    return `<section class="crm-box"><h3>Файлы</h3><label class="crm-upload">Прикрепить файл<input type="file" multiple data-attach="${taskId}"></label><div class="crm-drop" data-drop-files="${taskId}">Перетащите файл или вставьте изображение из буфера</div>${list.map((file) => `<div class="crm-mini-row"><a href="${file.data_url}" download="${esc(file.name)}">${esc(file.name)}</a><button data-crm-action="delete-attachment" data-id="${file.id}">Удалить</button></div>`).join('')}</section>`;
  }

  function renderComments(taskId) {
    const list = crm.comments.filter((comment) => comment.task_id === taskId && !comment.deleted_at);
    return `<section class="crm-box"><h3>Комментарии</h3><button data-crm-action="new-comment" data-id="${taskId}">+ Комментарий</button>${list.map((comment) => `<div class="crm-comment"><b>${esc(comment.author_name)}</b><button data-crm-action="edit-comment" data-id="${comment.id}">Изменить</button><button data-crm-action="delete-comment" data-id="${comment.id}">Удалить</button><p>${sanitize(comment.body)}</p></div>`).join('') || '<p class="crm-muted">Комментариев нет</p>'}</section>`;
  }

  function renderRelations(taskId) {
    const list = crm.relations.filter((rel) => rel.from_task_id === taskId || rel.to_task_id === taskId);
    return `<section class="crm-box"><h3>Связи</h3><button data-crm-action="new-relation" data-id="${taskId}">+ Связь</button>${list.map((rel) => `<div class="crm-mini-row"><span>${esc(rel.type)}: #${taskNumber(rel.from_task_id === taskId ? rel.to_task_id : rel.from_task_id)}</span><button data-crm-action="delete-relation" data-id="${rel.id}">Удалить</button></div>`).join('') || '<p class="crm-muted">Связей нет</p>'}</section>`;
  }

  function renderHistory(taskId) {
    const list = crm.history.filter((item) => item.task_id === taskId).slice(-20).reverse();
    return `<section class="crm-box"><h3>История</h3>${list.map((item) => `<div class="crm-history"><span>${dateRu(item.created_at)}</span><p>${esc(item.message)}</p></div>`).join('') || '<p class="crm-muted">История пока пустая</p>'}</section>`;
  }

  function wireEvents() {
    document.addEventListener('click', async (event) => {
      const viewButton = event.target.closest('[data-crm-view]');
      if (viewButton) { view = viewButton.dataset.crmView; selectedTaskId = null; render(); return; }
      const openButton = event.target.closest('[data-crm-open]');
      if (openButton) { selectedTaskId = openButton.dataset.crmOpen; renderDrawer(selectedTaskId); return; }
      const actionButton = event.target.closest('[data-crm-action]');
      if (!actionButton) return;
      await handleAction(actionButton.dataset.crmAction, actionButton.dataset.id);
    });

    document.addEventListener('change', async (event) => {
      const filter = event.target.closest('[data-crm-filter]');
      if (filter) { applyFilter(filter); render(); return; }
      const field = event.target.closest('[data-task-field]');
      if (field) await updateTaskField(field.dataset.id, field.dataset.taskField, field.value);
      const attach = event.target.closest('[data-attach]');
      if (attach?.files?.length) await addFiles(attach.dataset.attach, Array.from(attach.files));
    });

    document.addEventListener('input', debounce((event) => {
      const filter = event.target.closest('[data-crm-filter="search"]');
      if (filter) { filters.search = filter.value; render(); }
    }, 250));

    document.addEventListener('dragstart', (event) => {
      const card = event.target.closest('[data-task-id]');
      if (card) event.dataTransfer.setData('text/plain', card.dataset.taskId);
    });
    document.addEventListener('dragover', (event) => {
      if (event.target.closest('[data-drop-status], [data-drop-files]')) event.preventDefault();
    });
    document.addEventListener('drop', async (event) => {
      const fileDrop = event.target.closest('[data-drop-files]');
      if (fileDrop && event.dataTransfer.files.length) { event.preventDefault(); await addFiles(fileDrop.dataset.dropFiles, Array.from(event.dataTransfer.files)); return; }
      const column = event.target.closest('[data-drop-status]');
      if (column) { event.preventDefault(); await updateTaskField(event.dataTransfer.getData('text/plain'), 'status', column.dataset.dropStatus); }
    });
    document.addEventListener('paste', async (event) => {
      const editor = event.target.closest('.crm-editor');
      if (!editor) return;
      const files = Array.from(event.clipboardData?.files || []);
      if (files.length) await addFiles(editor.dataset.description, files);
    });
  }

  async function handleAction(action, id) {
    if (action === 'new-task' || action === 'new-task-backlog') return createTask(action === 'new-task-backlog' ? 'BACKLOG' : 'BOARD');
    if (action === 'close-drawer') { selectedTaskId = null; document.querySelector('.crm-drawer')?.remove(); return; }
    if (action === 'save-description') return saveDescription(id);
    if (action === 'to-backlog') return moveLocation(id, 'BACKLOG');
    if (action === 'to-board') return moveLocation(id, 'BOARD');
    if (action === 'delete-task') return deleteTask(id);
    if (action === 'restore-task') return restoreTask(id);
    if (action === 'new-assignee') return newAssignee();
    if (action === 'edit-assignee') return editAssignee(id);
    if (action === 'toggle-assignee') return toggleAssignee(id);
    if (action === 'new-comment') return newComment(id);
    if (action === 'edit-comment') return editComment(id);
    if (action === 'delete-comment') return deleteComment(id);
    if (action === 'new-relation') return newRelation(id);
    if (action === 'delete-relation') return deleteRelation(id);
    if (action === 'delete-attachment') return deleteAttachment(id);
  }

  async function createTask(location) {
    const title = prompt('Название задачи');
    if (!title) return;
    const task = normalizeTask({ id: uid('task'), number: crm.next_number++, title, location, rank: Date.now(), created_at: new Date().toISOString() });
    crm.tasks.push(task);
    addHistory(task.id, 'Задача создана');
    await persistAndRender(task.id);
  }

  async function updateTaskField(id, field, value) {
    const task = findTask(id);
    if (!task) return;
    const before = task[field];
    task[field] = value;
    task.updated_at = new Date().toISOString();
    if (before !== value) addHistory(id, `${fieldLabel(field)}: ${before || 'пусто'} → ${value || 'пусто'}`);
    await persistAndRender(id);
  }

  async function saveDescription(id) {
    const task = findTask(id);
    const editor = document.querySelector(`[data-description="${id}"]`);
    if (!task || !editor) return;
    task.description = sanitize(editor.innerHTML);
    task.updated_at = new Date().toISOString();
    addHistory(id, 'Описание обновлено');
    await persistAndRender(id);
  }

  async function moveLocation(id, location) {
    const task = findTask(id);
    if (!task) return;
    task.location = location;
    task.updated_at = new Date().toISOString();
    addHistory(id, location === 'BACKLOG' ? 'Перенесено в бэклог' : 'Перенесено на доску');
    await persistAndRender(id);
  }

  async function deleteTask(id) {
    if (!confirm('Удалить задачу? Ее можно будет восстановить.')) return;
    const task = findTask(id);
    if (!task) return;
    task.deleted_at = new Date().toISOString();
    addHistory(id, 'Задача удалена');
    selectedTaskId = null;
    await persistAndRender();
  }

  async function restoreTask(id) {
    const task = findTask(id, true);
    if (!task) return;
    task.deleted_at = '';
    addHistory(id, 'Задача восстановлена');
    await persistAndRender(id);
  }

  async function newAssignee() {
    const name = prompt('Имя исполнителя');
    if (!name) return;
    crm.assignees.push(assignee(uid('a'), name));
    await persistAndRender();
  }

  async function editAssignee(id) {
    const person = crm.assignees.find((item) => item.id === id);
    if (!person) return;
    const name = prompt('Имя исполнителя', person.name);
    if (!name) return;
    person.name = name;
    person.updated_at = new Date().toISOString();
    await persistAndRender();
  }

  async function toggleAssignee(id) {
    const person = crm.assignees.find((item) => item.id === id);
    if (!person) return;
    person.active = !person.active;
    person.updated_at = new Date().toISOString();
    await persistAndRender();
  }

  async function newComment(taskId) {
    const body = prompt('Комментарий');
    if (!body) return;
    crm.comments.push({ id: uid('comment'), task_id: taskId, body: esc(body), author_name: 'Команда', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), deleted_at: '' });
    addHistory(taskId, 'Добавлен комментарий');
    await persistAndRender(taskId);
  }

  async function editComment(id) {
    const comment = crm.comments.find((item) => item.id === id);
    if (!comment) return;
    const body = prompt('Комментарий', strip(comment.body));
    if (!body) return;
    comment.body = esc(body);
    comment.updated_at = new Date().toISOString();
    addHistory(comment.task_id, 'Комментарий изменен');
    await persistAndRender(comment.task_id);
  }

  async function deleteComment(id) {
    const comment = crm.comments.find((item) => item.id === id);
    if (!comment) return;
    comment.deleted_at = new Date().toISOString();
    addHistory(comment.task_id, 'Комментарий удален');
    await persistAndRender(comment.task_id);
  }

  async function newRelation(taskId) {
    const number = prompt('Номер связанной задачи');
    const other = crm.tasks.find((task) => String(task.number) === String(number));
    if (!other || other.id === taskId) return alert('Задача не найдена');
    const type = prompt('Тип связи', RELATION_TYPES[0]) || RELATION_TYPES[0];
    crm.relations.push({ id: uid('rel'), from_task_id: taskId, to_task_id: other.id, type, created_at: new Date().toISOString() });
    addHistory(taskId, `Добавлена связь с #${other.number}`);
    await persistAndRender(taskId);
  }

  async function deleteRelation(id) {
    const rel = crm.relations.find((item) => item.id === id);
    crm.relations = crm.relations.filter((item) => item.id !== id);
    if (rel) addHistory(rel.from_task_id, 'Связь удалена');
    await persistAndRender(rel?.from_task_id);
  }

  async function addFiles(taskId, files) {
    for (const file of files) {
      const dataUrl = await readFile(file);
      crm.attachments.push({ id: uid('file'), task_id: taskId, name: file.name || 'clipboard-image.png', type: file.type || 'application/octet-stream', size: file.size || 0, data_url: dataUrl, created_at: new Date().toISOString() });
    }
    addHistory(taskId, `Добавлено файлов: ${files.length}`);
    await persistAndRender(taskId);
  }

  async function deleteAttachment(id) {
    const file = crm.attachments.find((item) => item.id === id);
    crm.attachments = crm.attachments.filter((item) => item.id !== id);
    if (file) addHistory(file.task_id, `Файл удален: ${file.name}`);
    await persistAndRender(file?.task_id);
  }

  async function persistAndRender(openId) {
    await saveCrm();
    selectedTaskId = openId || selectedTaskId;
    render();
  }

  function activeTasks() { return crm.tasks.filter((task) => !task.deleted_at); }
  function filteredTasks() {
    const term = filters.search.trim().toLowerCase();
    return activeTasks().filter((task) => {
      if (filters.status && task.status !== filters.status) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.overdue && !overdue(task)) return false;
      if (term && !(`#${task.number} ${task.title}`.toLowerCase().includes(term))) return false;
      return true;
    });
  }
  function findTask(id, includeDeleted = false) { return crm.tasks.find((task) => task.id === id && (includeDeleted || !task.deleted_at)); }
  function addHistory(taskId, message) { crm.history.push({ id: uid('hist'), task_id: taskId, message, created_at: new Date().toISOString(), author_name: 'Команда' }); }
  function taskNumber(id) { return crm.tasks.find((task) => task.id === id)?.number || '?'; }
  function assigneeName(id) { return crm.assignees.find((person) => person.id === id)?.name || ''; }
  function byRank(a, b) { return (a.rank || 0) - (b.rank || 0); }
  function overdue(task) { return task.due_date && task.status !== 'Закрыто' && new Date(task.due_date + 'T23:59:59') < new Date(); }
  function applyFilter(input) { filters[input.dataset.crmFilter] = input.type === 'checkbox' ? input.checked : input.value; }
  function opt(value, selected, label = value) { return `<option value="${esc(value)}" ${value === selected ? 'selected' : ''}>${esc(label)}</option>`; }
  function fieldLabel(field) { return ({ status: 'Статус', priority: 'Приоритет', assignee_id: 'Исполнитель', due_date: 'Срок', title: 'Название' })[field] || field; }
  function uid(prefix) { return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`; }
  function dateRu(value) { if (!value) return ''; return new Date(value).toLocaleDateString('ru-RU'); }
  function esc(value) { return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]); }
  function strip(value) { const div = document.createElement('div'); div.innerHTML = sanitize(value || ''); return div.textContent || ''; }
  function sanitize(html) {
    const template = document.createElement('template');
    template.innerHTML = String(html || '');
    template.content.querySelectorAll('script, iframe, object, embed, link, meta, style').forEach((node) => node.remove());
    template.content.querySelectorAll('*').forEach((node) => {
      [...node.attributes].forEach((attr) => {
        const name = attr.name.toLowerCase();
        const value = attr.value || '';
        if (name.startsWith('on') || value.toLowerCase().startsWith('javascript:')) node.removeAttribute(attr.name);
      });
    });
    return template.innerHTML;
  }
  function readFile(file) { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file); }); }
  function debounce(fn, wait) { let timer; return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), wait); }; }

  function injectStyles() {
    if (document.getElementById('crm-module-v2-style')) return;
    const style = document.createElement('style');
    style.id = 'crm-module-v2-style';
    style.textContent = `
      .crm-nav-item{width:100%;text-align:left}.crm-shell{padding:24px;max-width:1680px;margin:0 auto;color:#111827}.crm-header{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:18px}.crm-header h1{font-size:30px;margin:0 0 4px}.crm-kicker{margin:0 0 4px;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:.04em}.crm-primary,.crm-tabs button,.crm-list button,.crm-actions button,.crm-card button,.crm-row button,.crm-upload{border:1px solid #cbd5e1;background:#fff;border-radius:8px;padding:9px 12px;font-weight:700;cursor:pointer}.crm-primary,.crm-actions button{background:#111827;color:#fff}.crm-actions .danger{background:#fee2e2;color:#991b1b;border-color:#fecaca}.crm-tabs{display:flex;gap:8px;margin-bottom:16px}.crm-tabs button.active{background:#111827;color:#fff}.crm-filters{display:grid;grid-template-columns:minmax(220px,1fr) 180px 180px auto;gap:10px;margin-bottom:16px}.crm-filters input,.crm-filters select,.crm-side-grid input,.crm-side-grid select,.crm-title-input{border:1px solid #cbd5e1;border-radius:8px;padding:10px;background:#fff}.crm-board{display:grid;grid-template-columns:repeat(6,minmax(210px,1fr));gap:12px;overflow:auto;padding-bottom:10px}.crm-column{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:10px;min-height:360px}.crm-column h2{font-size:15px;margin:0 0 10px;display:flex;justify-content:space-between}.crm-column h2 span{background:#e2e8f0;border-radius:999px;padding:2px 8px}.crm-card,.crm-row,.crm-box{background:#fff;border:1px solid #dbe3ef;border-radius:10px;padding:12px;margin-bottom:10px}.crm-card{box-shadow:0 1px 2px rgba(15,23,42,.04)}.crm-card.overdue{border-color:#ef4444}.crm-card div,.crm-card footer,.crm-mini-row{display:flex;align-items:center;justify-content:space-between;gap:8px}.crm-card p{color:#475569;min-height:34px}.crm-card footer{font-size:12px;color:#64748b;flex-wrap:wrap}.crm-list{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:14px}.crm-list header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}.crm-row{display:grid;grid-template-columns:minmax(240px,1fr) 150px 190px auto auto;align-items:center;gap:10px}.crm-empty,.crm-loading{border:1px dashed #cbd5e1;border-radius:10px;padding:28px;text-align:center;color:#64748b;background:#fff}.crm-empty-small{border:1px dashed #cbd5e1;border-radius:8px;padding:14px;text-align:center;color:#64748b}.crm-drawer{position:fixed;inset:0 0 0 auto;width:min(720px,96vw);z-index:9999;background:#fff;box-shadow:-12px 0 34px rgba(15,23,42,.18);padding:24px;overflow:auto}.crm-close{position:absolute;right:18px;top:14px;border:0;background:#f1f5f9;border-radius:8px;font-size:26px;width:40px;height:40px;cursor:pointer}.crm-title-input{width:100%;font-size:22px;font-weight:800;margin:8px 0 12px}.crm-side-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}.crm-side-grid label{display:grid;gap:5px;font-size:13px;color:#475569}.crm-richbar{display:flex;gap:6px;margin-bottom:6px}.crm-richbar button{border:1px solid #cbd5e1;background:#fff;border-radius:7px;padding:7px 9px}.crm-editor{min-height:160px;border:1px solid #cbd5e1;border-radius:10px;padding:12px;margin-bottom:10px}.crm-editor h1,.crm-editor h2,.crm-editor h3{margin:8px 0}.crm-editor ul,.crm-editor ol{padding-left:24px}.crm-editor code{background:#f1f5f9;padding:2px 4px;border-radius:4px}.crm-actions{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}.crm-box h3{margin:0 0 10px}.crm-upload{display:inline-block;margin-bottom:8px}.crm-upload input{display:none}.crm-drop{border:1px dashed #94a3b8;border-radius:10px;padding:14px;text-align:center;color:#64748b;margin-bottom:10px}.crm-comment{border-top:1px solid #e2e8f0;padding-top:10px;margin-top:10px}.crm-comment button{margin-left:6px}.crm-history{border-left:3px solid #cbd5e1;padding-left:10px;margin-bottom:8px}.crm-history span,.crm-muted{color:#64748b;font-size:12px}@media(max-width:1100px){.crm-board{grid-template-columns:repeat(2,minmax(240px,1fr))}.crm-filters{grid-template-columns:1fr 1fr}.crm-row{grid-template-columns:1fr;align-items:start}}@media(max-width:720px){.crm-shell{padding:14px}.crm-header{align-items:flex-start;flex-direction:column}.crm-board,.crm-filters,.crm-side-grid{grid-template-columns:1fr}.crm-drawer{width:100%;padding:18px}.crm-card div{align-items:flex-start;flex-direction:column}.crm-actions button{width:100%}}`;
    document.head.appendChild(style);
  }

  document.addEventListener('click', (event) => {
    const rich = event.target.closest('[data-rich]');
    if (!rich) return;
    const command = rich.dataset.rich;
    let value = rich.dataset.value || null;
    if (command === 'createLink') value = prompt('Ссылка') || '';
    document.execCommand(command, false, value);
  });

  boot();
})();
