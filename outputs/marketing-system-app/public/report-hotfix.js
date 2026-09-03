(() => {
  const VERSION = "20260903-03";
  const USAGE_KEY = "konglomerat-report-symbols";
  const draftCache = new Map();
  let lastSelection = null;

  const emojiAliases = new Map([
    ["✓", "✅"], ["✔", "✅"], ["✔️", "✅"], ["☑", "☑️"], ["✕", "❌"], ["✖", "❌"], ["✖️", "❌"],
    ["•", "🔹"], ["◦", "🔸"], ["▪", "▪️"], ["▫", "▫️"], ["◆", "🔹"], ["◇", "🔸"], ["●", "🟢"], ["○", "⚪"],
    ["■", "🟦"], ["□", "⬜"], ["▸", "▶️"], ["▹", "▶️"], ["★", "⭐"], ["☆", "🌟"], ["✦", "✨"], ["✧", "✨"],
    ["→", "➡️"], ["←", "⬅️"], ["↑", "⬆️"], ["↓", "⬇️"], ["↗", "↗️"], ["↘", "↘️"], ["↙", "↙️"], ["↖", "↖️"],
    ["✉", "✉️"], ["☎", "☎️"], ["⚙", "⚙️"], ["🛠", "🛠️"], ["🖥", "🖥️"], ["🗂", "🗂️"], ["🗓", "🗓️"],
    ["⌨", "⌨️"], ["🖱", "🖱️"], ["⚠", "⚠️"], ["ℹ", "ℹ️"], ["©", "©️"], ["®", "®️"], ["™", "™️"]
  ]);

  const symbolGroups = [
    { title: "Статусы и проверка", symbols: ["✅", "☑️", "✔️", "❌", "✖️", "⛔", "⚠️", "ℹ️", "🟢", "🟡", "🔴", "🔵", "🟣", "⚪", "⚫", "⏳", "⌛", "🕐", "🧭"] },
    { title: "Приоритеты и акценты", symbols: ["⭐", "🌟", "✨", "🔥", "🚨", "📌", "🎯", "💎", "🏆", "🥇", "💯", "🔝", "📍", "🔔", "🧨", "💡"] },
    { title: "Задачи и документы", symbols: ["📝", "📄", "📃", "📑", "📋", "🧾", "🗒️", "📚", "🔖", "📎", "📂", "📁", "🗂️", "🗃️", "🗄️", "📦"] },
    { title: "Работа и процессы", symbols: ["📊", "📈", "📉", "🧮", "🗓️", "📅", "⏰", "⏱️", "⌚", "🔎", "🧩", "⚙️", "🛠️", "🔧", "🧪", "🔒"] },
    { title: "Команда и согласование", symbols: ["👍", "👎", "👌", "🤝", "🙌", "👏", "💪", "🙏", "💬", "🗣️", "📣", "📢", "✉️", "☎️", "📞", "🧑‍💻"] },
    { title: "Маркетинг и продажи", symbols: ["🎯", "🚀", "📈", "📊", "🛒", "🏷️", "💰", "💵", "💳", "🧲", "💡", "🔍", "📷", "🎬", "📰", "📩"] },
    { title: "Сайт и техника", symbols: ["💻", "🖥️", "📱", "🌐", "🔗", "⚡", "🔌", "🔋", "⌨️", "🖱️", "📡", "🛰️", "🧱", "🧬", "🧰", "🛡️"] },
    { title: "Контент и дизайн", symbols: ["🎨", "🖌️", "🖼️", "✏️", "📝", "📸", "🎥", "🎞️", "🎙️", "🔠", "🔤", "🧠", "💡", "🪄", "🧵", "📐"] },
    { title: "Файлы и медиа", symbols: ["📎", "📁", "📂", "🗃️", "🗄️", "🖼️", "📷", "🎥", "🎬", "🎧", "📄", "📑", "📦", "⬇️", "⬆️", "🔗"] },
    { title: "Пункты и списки", symbols: ["🔹", "🔸", "◾", "◽", "▪️", "▫️", "🟦", "🟩", "🟨", "🟥", "🟪", "🟧", "🔘", "⭕", "✅", "☑️"] },
    { title: "Стрелки и навигация", symbols: ["➡️", "⬅️", "⬆️", "⬇️", "↗️", "↘️", "↙️", "↖️", "↔️", "↕️", "🔜", "🔙", "🔝", "🔚", "⏩", "⏪"] },
    { title: "Цифры и этапы", symbols: ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟", "0️⃣", "🔢", "🥇", "🥈", "🥉", "💯"] },
    { title: "Настроение", symbols: ["🙂", "😀", "😎", "🤩", "😍", "🥳", "😊", "😌", "😐", "😕", "🤔", "😅", "❤️", "💚", "💙", "💜"] },
    { title: "Разное", symbols: ["❗", "❓", "➕", "➖", "✖️", "➗", "♾️", "⚖️", "©️", "®️", "™️", "§️", "♻️", "✅", "🔁", "🔄"] }
  ];

  const ready = callback => {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", callback, { once: true });
    else callback();
  };

  ready(() => {
    injectStyles();
    enhanceAll();
    document.addEventListener("mousedown", handleMouseDown, true);
    document.addEventListener("click", handleClick, true);
    document.addEventListener("input", handleDraftInput, true);
    document.addEventListener("change", handleDraftInput, true);
    document.addEventListener("keyup", handleSelectionEvent, true);
    document.addEventListener("mouseup", handleSelectionEvent, true);
    document.addEventListener("select", handleSelectionEvent, true);
    document.addEventListener("paste", handlePaste, true);
    new MutationObserver(enhanceAll).observe(document.documentElement, { childList: true, subtree: true });
  });

  function injectStyles() {
    if (document.getElementById("report-hotfix-style")) return;
    const style = document.createElement("style");
    style.id = "report-hotfix-style";
    style.textContent = `
      :root { --emoji-font: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Twemoji Mozilla", emoji, sans-serif; }
      .symbol-button,
      .report-description,
      .report-title,
      .report-textarea,
      .report-modal-textarea { font-family: inherit, var(--emoji-font); }
      .symbol-button {
        min-width: 38px;
        min-height: 34px;
        font-family: var(--emoji-font);
        font-size: 18px;
        line-height: 1;
        background: linear-gradient(180deg, #fff 0%, #f8fafc 100%);
        box-shadow: inset 0 1px 0 rgba(255,255,255,.95), 0 2px 6px rgba(15,23,42,.08);
      }
      .symbol-panel .report-tool-section { margin-bottom: 12px; }
      .symbol-panel .report-tool-title { color: #64748b; font-size: 12px; font-weight: 700; margin: 8px 0 6px; }
      .symbol-panel .report-symbol-grid { display: flex; flex-wrap: wrap; gap: 6px; }
      .report-hotfix-saving { opacity: .68; pointer-events: none; }
    `;
    document.head.appendChild(style);
  }

  function enhanceAll() {
    enhanceSymbolPanel();
    removeActiveFilterOption();
  }

  function enhanceSymbolPanel() {
    const panel = document.querySelector(".symbol-panel");
    if (!panel || panel.dataset.hotfixVersion === VERSION) return;
    panel.dataset.hotfixVersion = VERSION;
    const recent = readRecentSymbols();
    panel.innerHTML = [
      recent.length ? renderSymbolSection("Часто используемые", recent) : "",
      ...symbolGroups.map(group => renderSymbolSection(group.title, group.symbols))
    ].join("");
  }

  function renderSymbolSection(title, symbols) {
    return `<div class="report-tool-section"><div class="report-tool-title">${escapeHtml(title)}</div><div class="report-symbol-grid">${symbols.map(renderSymbolButton).join("")}</div></div>`;
  }

  function renderSymbolButton(symbol) {
    const normalized = emojiPresentation(symbol);
    return `<button class="symbol-button" type="button" data-action="insert-report-symbol" data-symbol="${escapeAttr(normalized)}" title="Вставить ${escapeAttr(normalized)}">${escapeHtml(normalized)}</button>`;
  }

  function removeActiveFilterOption() {
    document.querySelectorAll("select[data-change='employee-task-filter'] option[value='active']").forEach(option => option.remove());
  }

  function handleMouseDown(event) {
    const symbolButton = event.target.closest?.("[data-action='insert-report-symbol']");
    if (symbolButton) event.preventDefault();
  }

  async function handleClick(event) {
    const actionButton = event.target.closest?.("[data-action]");
    if (!actionButton) return;

    const action = actionButton.dataset.action;
    if (action === "insert-report-symbol") {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      insertSymbol(actionButton.dataset.symbol || actionButton.textContent || "");
      return;
    }

    if (action === "save-report-form" || action === "save-report-modal" || action === "finish-report-edit") {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      await saveReportFromForm(actionButton);
    }
  }

  function handleDraftInput(event) {
    const input = event.target.closest?.("[data-report-draft-field]");
    if (!input) return;
    rememberSelection(input);
    const id = reportIdFromElement(input);
    const cache = cacheFor(id);
    cache[input.dataset.reportDraftField] = input.value;
    cache.personId = input.dataset.personId || cache.personId || personIdFromUrl();
    cache.reportId = id;
  }

  function handleSelectionEvent(event) {
    rememberSelection(event.target);
  }

  function handlePaste(event) {
    const textarea = event.target.closest?.("textarea.report-modal-textarea, textarea.report-textarea");
    if (!textarea) return;
    rememberSelection(textarea);
    const files = [...(event.clipboardData?.files || [])].filter(file => file.type.startsWith("image/"));
    if (!files.length) return;

    const reportId = reportIdFromElement(textarea);
    Promise.all(files.map(readAttachmentFile)).then(attachments => {
      const cache = cacheFor(reportId);
      cache.attachments = mergeAttachments(cache.attachments, attachments.filter(Boolean));
      showToast("Скриншот добавлен в медиа");
    }).catch(() => showToast("Не удалось добавить скриншот"));
  }

  function insertSymbol(symbol) {
    const textarea = currentTextarea();
    if (!textarea) return;
    const value = emojiPresentation(symbol);
    const selection = selectionFor(textarea);
    textarea.focus();
    textarea.setSelectionRange(selection.start, selection.end);
    textarea.setRangeText(value, selection.start, selection.end, "end");
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    rememberSelection(textarea);
    rememberRecentSymbol(value);
  }

  function currentTextarea() {
    const active = document.activeElement;
    if (active?.matches?.("textarea.report-modal-textarea, textarea.report-textarea")) return active;
    if (lastSelection?.reportId) {
      const remembered = document.querySelector(`textarea[data-report-id='${cssEscape(lastSelection.reportId)}']`);
      if (remembered) return remembered;
    }
    return document.querySelector("textarea.report-modal-textarea, textarea.report-textarea");
  }

  function rememberSelection(element) {
    if (!element?.matches?.("textarea.report-modal-textarea, textarea.report-textarea")) return;
    lastSelection = {
      reportId: reportIdFromElement(element),
      start: Number(element.selectionStart) || 0,
      end: Number(element.selectionEnd) || 0
    };
  }

  function selectionFor(textarea) {
    const valueLength = textarea.value.length;
    const same = lastSelection?.reportId === reportIdFromElement(textarea);
    return {
      start: clamp(same ? lastSelection.start : textarea.selectionStart, 0, valueLength),
      end: clamp(same ? lastSelection.end : textarea.selectionEnd, 0, valueLength)
    };
  }

  async function saveReportFromForm(button) {
    const form = button.closest(".task-form, [data-modal-panel]") || document;
    const titleInput = form.querySelector("[data-report-draft-field='title']");
    const dateInput = form.querySelector("[data-report-draft-field='date']");
    const statusInput = form.querySelector("[data-report-draft-field='status']");
    const textInput = form.querySelector("[data-report-draft-field='text']");
    const reportId = reportIdFromElement(button) || reportIdFromUrl() || `r-${Date.now()}`;
    const personId = titleInput?.dataset.personId || dateInput?.dataset.personId || statusInput?.dataset.personId || textInput?.dataset.personId || personIdFromUrl();

    if (!personId) {
      showToast("Не найден сотрудник для сохранения");
      return;
    }

    const cache = cacheFor(reportId);
    if (textInput) cache.text = textInput.value;
    if (titleInput) cache.title = titleInput.value;
    if (dateInput) cache.date = dateInput.value;
    if (statusInput) cache.status = statusInput.value;

    setSaving(form, true);
    try {
      const workspacePayload = await fetchWorkspace();
      const personMatch = findPerson(workspacePayload.workspace, personId);
      const person = personMatch?.person;
      const existing = findReport(person, reportId)?.report || {};
      const report = {
        ...existing,
        id: reportId,
        title: cache.title ?? titleInput?.value ?? existing.title ?? "",
        text: cache.text ?? textInput?.value ?? existing.text ?? "",
        date: validDate(cache.date) ? cache.date : validDate(dateInput?.value) ? dateInput.value : validDate(existing.date) ? existing.date : new Date().toISOString().slice(0, 10),
        status: ["plan", "progress", "done"].includes(cache.status) ? cache.status : ["plan", "progress", "done"].includes(statusInput?.value) ? statusInput.value : existing.status || "plan",
        attachments: mergeAttachments(existing.attachments, collectDomAttachments(form), cache.attachments)
      };
      report.completed = report.status === "done";

      const saved = await saveViaReportEndpoint(personId, person?.name || "", report);
      if (!saved.ok) await saveViaWorkspaceEndpoint(workspacePayload.workspace, personId, person?.name || "", report);

      showToast("Сохранено");
      redirectAfterSave(personId, report.date);
    } catch (error) {
      showToast(error.message || "Не удалось сохранить задачу");
    } finally {
      setSaving(form, false);
    }
  }

  async function fetchWorkspace() {
    const response = await fetch("/api/workspace", { credentials: "same-origin", cache: "no-store" });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.workspace) throw new Error(payload.error === "AUTH_REQUIRED" ? "Нужно войти в режим редактора" : "Не удалось прочитать текущий отчет");
    return payload;
  }

  async function saveViaReportEndpoint(personId, personName, report) {
    const response = await fetch("/api/employees/report", {
      method: "PUT",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personId, personName, report })
    });
    if (response.status === 404 || response.status === 405) return { ok: false };
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || "Не удалось сохранить задачу");
    return { ok: true, payload };
  }

  async function saveViaWorkspaceEndpoint(workspace, personId, personName, report) {
    const match = findPerson(workspace, personId, personName);
    if (!match?.person) throw new Error("Сотрудник для сохранения не найден");
    const reports = Array.isArray(match.person.reports) ? match.person.reports : [];
    const index = reports.findIndex(item => String(item?.id || "") === String(report.id));
    const time = new Date().toISOString();
    const nextReport = { ...report, updatedAt: time, completed: report.status === "done" };
    if (!nextReport.createdAt) nextReport.createdAt = time;
    if (index >= 0) reports[index] = { ...reports[index], ...nextReport };
    else reports.push(nextReport);
    match.person.reports = reports;
    match.person.updatedAt = time;
    workspace.sections.employees.updatedAt = time;
    workspace.updatedAt = time;

    const response = await fetch("/api/workspace", {
      method: "PUT",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workspace })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || "Не удалось сохранить задачу");
  }

  function redirectAfterSave(personId, date) {
    const returnUrl = returnUrlFromPage() || `/#section=employees&employee=${encodeURIComponent(personId)}&day=${encodeURIComponent(date)}`;
    setTimeout(() => {
      try { history.replaceState(null, "", returnUrl); } catch (error) { location.href = returnUrl; return; }
      location.reload();
    }, 500);
  }

  function setSaving(form, saving) {
    form.classList.toggle("report-hotfix-saving", saving);
    form.querySelectorAll("[data-action='save-report-form'], [data-action='save-report-modal'], [data-action='finish-report-edit']").forEach(button => {
      button.disabled = saving;
      if (saving) {
        button.dataset.hotfixText = button.textContent;
        button.textContent = "Сохраняю...";
      } else if (button.dataset.hotfixText) {
        button.textContent = button.dataset.hotfixText;
        delete button.dataset.hotfixText;
      }
    });
  }

  function findPerson(workspace, personId, personName = "") {
    const people = workspace?.sections?.employees?.people || [];
    const normalizedName = normalizeName(personName);
    const index = people.findIndex((person, personIndex) =>
      String(person?.id || "") === String(personId || "")
        || `employee-${personIndex}` === String(personId || "")
        || (normalizedName && normalizeName(person?.name) === normalizedName)
    );
    return index >= 0 ? { person: people[index], index } : null;
  }

  function findReport(person, reportId) {
    const reports = person?.reports || [];
    const index = reports.findIndex(report => String(report?.id || "") === String(reportId || ""));
    return index >= 0 ? { report: reports[index], index } : null;
  }

  function collectDomAttachments(form) {
    return [...form.querySelectorAll(".report-media-card")].map((card, index) => {
      const link = card.querySelector("a[href^='data:']");
      const image = card.querySelector("img[src^='data:']");
      const dataUrl = image?.src || link?.href || "";
      if (!dataUrl) return null;
      const name = image?.alt || card.querySelector(".report-media-meta span, .file-info a")?.textContent?.trim() || `Файл ${index + 1}`;
      return {
        id: card.querySelector("[data-attachment-id]")?.dataset.attachmentId || `file-${Date.now()}-${index}`,
        name,
        type: dataUrlType(dataUrl),
        size: estimateDataUrlSize(dataUrl),
        dataUrl,
        createdAt: new Date().toISOString()
      };
    }).filter(Boolean);
  }

  function readAttachmentFile(file) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve({
        id: `file-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        name: file.name || `screenshot-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.png`,
        type: file.type || "image/png",
        size: file.size || 0,
        dataUrl: String(reader.result || ""),
        createdAt: new Date().toISOString()
      });
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  }

  function mergeAttachments(...groups) {
    const map = new Map();
    groups.flat().filter(Boolean).forEach(item => {
      if (!item.dataUrl) return;
      map.set(item.id || item.dataUrl, {
        id: item.id || `file-${Date.now()}-${map.size}`,
        name: item.name || `Файл ${map.size + 1}`,
        type: item.type || dataUrlType(item.dataUrl),
        size: Number(item.size) || estimateDataUrlSize(item.dataUrl),
        dataUrl: item.dataUrl,
        createdAt: item.createdAt || new Date().toISOString()
      });
    });
    return [...map.values()];
  }

  function reportIdFromElement(element) {
    return String(element?.dataset?.reportId || element?.closest?.("[data-report-id]")?.dataset.reportId || reportIdFromUrl() || "");
  }

  function reportIdFromUrl() {
    const match = location.pathname.match(/^\/tasks\/([^/]+)\/edit$/);
    return match ? decodeURIComponent(match[1]) : "";
  }

  function personIdFromUrl() {
    const search = new URLSearchParams(location.search);
    if (search.get("person")) return search.get("person");
    const hash = new URLSearchParams((location.hash || "").replace(/^#/, ""));
    return hash.get("employee") || "";
  }

  function returnUrlFromPage() {
    const search = new URLSearchParams(location.search);
    const value = search.get("return") || sessionStorage.getItem("konglomerat-task-form-return") || "";
    if (!value) return "";
    if (value.startsWith("/") || value.startsWith("#")) return value.startsWith("#") ? `/${value}` : value;
    return "";
  }

  function cacheFor(reportId) {
    const id = reportId || "new";
    if (!draftCache.has(id)) draftCache.set(id, { reportId: id, attachments: [] });
    return draftCache.get(id);
  }

  function readRecentSymbols() {
    try {
      const parsed = JSON.parse(localStorage.getItem(USAGE_KEY) || "[]");
      return [...new Set(parsed.map(emojiPresentation).filter(Boolean))].slice(0, 12);
    } catch (error) {
      return [];
    }
  }

  function rememberRecentSymbol(symbol) {
    const normalized = emojiPresentation(symbol);
    const next = [normalized, ...readRecentSymbols().filter(item => item !== normalized)].slice(0, 20);
    try { localStorage.setItem(USAGE_KEY, JSON.stringify(next)); } catch (error) {}
    document.querySelectorAll(".symbol-panel").forEach(panel => delete panel.dataset.hotfixVersion);
    enhanceSymbolPanel();
  }

  function emojiPresentation(symbol) {
    const value = emojiAliases.get(symbol) || symbol;
    return String(value || "").replace(/[\u2600-\u27BF](?!\uFE0F)/gu, match => `${match}\uFE0F`);
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  function dataUrlType(value) {
    const match = String(value || "").match(/^data:([^;,]+)/);
    return match ? match[1] : "application/octet-stream";
  }

  function estimateDataUrlSize(value) {
    const base64 = String(value || "").split(",")[1] || "";
    return Math.max(0, Math.floor(base64.length * 0.75));
  }

  function validDate(value) {
    return /^\d{4}-\d{2}-\d{2}$/.test(String(value || ""));
  }

  function normalizeName(value) {
    return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number(value) || 0));
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/'/g, "&#39;");
  }

  function cssEscape(value) {
    if (window.CSS?.escape) return CSS.escape(value);
    return String(value).replace(/["'\\]/g, "\\$&");
  }
})();
