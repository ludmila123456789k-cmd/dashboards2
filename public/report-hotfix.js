(() => {
  const VERSION = "20260903-04";
  const USAGE_KEY = "konglomerat-report-symbols";
  let lastSelection = null;

  const symbolGroups = [
    { title: "Статусы и проверка", symbols: ["✅", "☑️", "✔️", "❌", "✖️", "⛔", "⚠️", "ℹ️", "🟢", "🟡", "🔴", "🔵", "🟣", "⚪", "⚫", "⏳", "⌛", "🕐", "🧭", "📍", "🔔"] },
    { title: "Приоритеты и акценты", symbols: ["⭐", "🌟", "✨", "🔥", "🚨", "📌", "🎯", "💎", "🏆", "🥇", "🥈", "🥉", "💯", "🔝", "🧨", "💡", "❗", "❓"] },
    { title: "Задачи и документы", symbols: ["📝", "📄", "📃", "📑", "📋", "🧾", "🗒️", "📚", "🔖", "📎", "📂", "📁", "🗂️", "🗃️", "🗄️", "📦", "🧷", "✂️"] },
    { title: "Работа и процессы", symbols: ["📊", "📈", "📉", "🧮", "🗓️", "📅", "⏰", "⏱️", "⌚", "🔎", "🧩", "⚙️", "🛠️", "🔧", "🧪", "🔒", "🔓", "🧰"] },
    { title: "Команда и согласование", symbols: ["👍", "👎", "👌", "🤝", "🙌", "👏", "💪", "🙏", "💬", "🗣️", "📣", "📢", "✉️", "☎️", "📞", "🧑‍💻", "👥", "🧑‍🏫"] },
    { title: "Маркетинг и продажи", symbols: ["🎯", "🚀", "📈", "📊", "🛒", "🏷️", "💰", "💵", "💳", "🧲", "💡", "🔍", "📷", "🎬", "📰", "📩", "📨", "🪧", "🎁", "🏁"] },
    { title: "Сайт и техника", symbols: ["💻", "🖥️", "📱", "🌐", "🔗", "⚡", "🔌", "🔋", "⌨️", "🖱️", "📡", "🛰️", "🧱", "🧬", "🧰", "🛡️", "🔐", "🧲", "🖨️", "📟"] },
    { title: "Контент и дизайн", symbols: ["🎨", "🖌️", "🖼️", "✏️", "📝", "📸", "🎥", "🎞️", "🎙️", "🔠", "🔤", "🧠", "💡", "🪄", "🧵", "📐", "📏", "🖊️", "🖋️", "🖍️"] },
    { title: "Файлы и медиа", symbols: ["📎", "📁", "📂", "🗃️", "🗄️", "🖼️", "📷", "🎥", "🎬", "🎧", "📄", "📑", "📦", "⬇️", "⬆️", "🔗", "💾", "🗜️"] },
    { title: "Пункты и списки", symbols: ["🔹", "🔸", "◾", "◽", "▪️", "▫️", "🟦", "🟩", "🟨", "🟥", "🟪", "🟧", "🔘", "⭕", "✅", "☑️", "➖", "➕"] },
    { title: "Стрелки и навигация", symbols: ["➡️", "⬅️", "⬆️", "⬇️", "↗️", "↘️", "↙️", "↖️", "↔️", "↕️", "🔜", "🔙", "🔝", "🔚", "⏩", "⏪", "🔁", "🔄"] },
    { title: "Цифры и этапы", symbols: ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟", "🔢", "#️⃣", "*️⃣", "💯"] },
    { title: "Настроение", symbols: ["🙂", "😀", "😎", "🤩", "😍", "🥳", "😊", "😌", "😐", "😕", "🤔", "😅", "❤️", "💚", "💙", "💜", "🧡", "💛"] },
    { title: "Разное", symbols: ["❗", "❓", "№", "%", "➕", "➖", "✖️", "➗", "♾️", "⚖️", "©️", "®️", "™️", "§️", "♻️", "✅", "≈", "≠", "≤", "≥"] }
  ];

  const aliases = new Map([
    ["✓", "✅"], ["✔", "✅"], ["✔️", "✅"], ["☑", "☑️"], ["✕", "❌"], ["✖", "❌"], ["✖️", "❌"],
    ["•", "🔹"], ["◦", "🔸"], ["★", "⭐"], ["☆", "🌟"], ["→", "➡️"], ["←", "⬅️"], ["↑", "⬆️"], ["↓", "⬇️"]
  ]);

  function start() {
    injectStyles();
    rebuildSymbols();
    bindOnce();
    new MutationObserver(rebuildSymbols).observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();

  function injectStyles() {
    if (document.getElementById("report-symbols-hotfix-style")) return;
    const style = document.createElement("style");
    style.id = "report-symbols-hotfix-style";
    style.textContent = `
      :root { --emoji-font: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Twemoji Mozilla", emoji, sans-serif; }
      .symbol-button { font-family: var(--emoji-font); font-size: 18px; min-width: 38px; min-height: 34px; line-height: 1; background: linear-gradient(180deg,#fff,#f8fafc); box-shadow: inset 0 1px 0 rgba(255,255,255,.95),0 2px 6px rgba(15,23,42,.08); }
      .report-description,.report-title,.report-textarea,.report-modal-textarea { font-family: inherit, var(--emoji-font); }
      .symbol-panel .report-tool-section { margin-bottom: 12px; }
      .symbol-panel .report-tool-title { color: #64748b; font-size: 12px; font-weight: 700; margin: 8px 0 6px; }
      .symbol-panel .report-symbol-grid { display: flex; flex-wrap: wrap; gap: 6px; }
    `;
    document.head.appendChild(style);
  }

  function bindOnce() {
    if (document.documentElement.dataset.reportSymbolsHotfix === VERSION) return;
    document.documentElement.dataset.reportSymbolsHotfix = VERSION;
    document.addEventListener("mousedown", event => {
      if (event.target.closest?.("[data-action='insert-report-symbol']")) event.preventDefault();
    }, true);
    document.addEventListener("click", event => {
      const button = event.target.closest?.("[data-action='insert-report-symbol']");
      if (!button) return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      insertSymbol(button.dataset.symbol || button.textContent || "");
    }, true);
    ["focus", "click", "keyup", "mouseup", "select", "input"].forEach(type => {
      document.addEventListener(type, event => rememberSelection(event.target), true);
    });
  }

  function rebuildSymbols() {
    const panel = document.querySelector(".symbol-panel");
    if (!panel || panel.dataset.symbolsHotfix === VERSION) return;
    panel.dataset.symbolsHotfix = VERSION;
    const recent = readRecentSymbols();
    panel.innerHTML = [
      recent.length ? renderGroup("Часто используемые", recent) : "",
      ...symbolGroups.map(group => renderGroup(group.title, group.symbols))
    ].join("");
  }

  function renderGroup(title, symbols) {
    return `<div class="report-tool-section"><div class="report-tool-title">${escapeHtml(title)}</div><div class="report-symbol-grid">${symbols.map(renderButton).join("")}</div></div>`;
  }

  function renderButton(symbol) {
    const value = emoji(symbol);
    return `<button class="symbol-button" type="button" data-action="insert-report-symbol" data-symbol="${escapeAttr(value)}" title="Вставить ${escapeAttr(value)}">${escapeHtml(value)}</button>`;
  }

  function insertSymbol(symbol) {
    const textarea = currentTextarea();
    if (!textarea) return;
    const value = emoji(symbol);
    const length = textarea.value.length;
    const same = lastSelection?.id === textarea.dataset.reportId;
    const start = clamp(same ? lastSelection.start : textarea.selectionStart, 0, length);
    const end = clamp(same ? lastSelection.end : textarea.selectionEnd, 0, length);
    textarea.focus();
    textarea.setSelectionRange(start, end);
    textarea.setRangeText(value, start, end, "end");
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    rememberSelection(textarea);
    rememberRecent(value);
  }

  function currentTextarea() {
    const active = document.activeElement;
    if (active?.matches?.("textarea.report-modal-textarea, textarea.report-textarea")) return active;
    if (lastSelection?.id) {
      const remembered = document.querySelector(`textarea[data-report-id="${cssEscape(lastSelection.id)}"]`);
      if (remembered) return remembered;
    }
    return document.querySelector("textarea.report-modal-textarea, textarea.report-textarea");
  }

  function rememberSelection(element) {
    if (!element?.matches?.("textarea.report-modal-textarea, textarea.report-textarea")) return;
    lastSelection = { id: element.dataset.reportId || "", start: element.selectionStart || 0, end: element.selectionEnd || 0 };
  }

  function readRecentSymbols() {
    try {
      return [...new Set(JSON.parse(localStorage.getItem(USAGE_KEY) || "[]").map(emoji).filter(Boolean))].slice(0, 12);
    } catch (error) {
      return [];
    }
  }

  function rememberRecent(symbol) {
    const value = emoji(symbol);
    const next = [value, ...readRecentSymbols().filter(item => item !== value)].slice(0, 20);
    try { localStorage.setItem(USAGE_KEY, JSON.stringify(next)); } catch (error) {}
    document.querySelectorAll(".symbol-panel").forEach(panel => delete panel.dataset.symbolsHotfix);
    rebuildSymbols();
  }

  function emoji(symbol) {
    const value = aliases.get(symbol) || symbol;
    return String(value || "").replace(/[\u2600-\u27BF](?!\uFE0F)/gu, match => `${match}\uFE0F`);
  }

  function clamp(value, min, max) { return Math.max(min, Math.min(max, Number(value) || 0)); }
  function cssEscape(value) { return window.CSS?.escape ? CSS.escape(value) : String(value).replace(/["'\\]/g, "\\$&"); }
  function escapeHtml(value) { return String(value ?? "").replace(/[&<>"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char])); }
  function escapeAttr(value) { return escapeHtml(value).replace(/'/g, "&#39;"); }
})();
