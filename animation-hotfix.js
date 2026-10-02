const fs = require("fs");

const originalReadFile = fs.readFile.bind(fs);

fs.readFile = function patchedReadFile(filePath, options, callback) {
  let readOptions = options;
  let done = callback;
  if (typeof readOptions === "function") {
    done = readOptions;
    readOptions = undefined;
  }

  return originalReadFile(filePath, readOptions, (error, data) => {
    if (error || typeof done !== "function") {
      if (typeof done === "function") done(error, data);
      return;
    }

    const normalized = String(filePath || "").replace(/\\/g, "/");
    const isText = typeof data === "string";
    let text = isText ? data : Buffer.isBuffer(data) ? data.toString("utf8") : String(data || "");
    let changed = false;

    if (normalized.endsWith("/public/app.js")) {
      const next = patchEmployeeEventApp(text);
      changed = next !== text;
      text = next;
    }

    if (normalized.endsWith("/public/styles.css")) {
      const next = patchEmployeeEventStyles(text);
      changed = next !== text;
      text = next;
    }

    done(null, changed ? (isText ? text : Buffer.from(text, "utf8")) : data);
  });
};

function patchEmployeeEventApp(source) {
  return String(source || "")
    .replaceAll("Осенняя анимация", "Осень")
    .replaceAll("Зимняя анимация", "Зима")
    .replaceAll("Весенняя анимация", "Весна")
    .replaceAll("Летняя анимация", "Лето")
    .replace(
      "container.innerHTML = `<div class=\"employee-lottie-fallback\">Анимация</div>`;",
      "container.innerHTML = `<div class=\"employee-lottie-fallback\" aria-hidden=\"true\"><span></span><span></span><span></span><span></span><span></span></div>`;"
    );
}

function patchEmployeeEventStyles(source) {
  const fallbackCss = `
.employee-lottie-fallback{position:absolute!important;inset:0!important;overflow:hidden!important;background:linear-gradient(180deg,#fff7ed 0%,#fef3c7 52%,#fff 100%)!important}
.employee-lottie-fallback span{position:absolute!important;top:-48px!important;width:46px!important;height:28px!important;border-radius:80% 0 80% 0!important;background:#f97316!important;box-shadow:0 10px 24px #92400e24!important;animation:employee-fallback-leaf 5.5s linear infinite!important;opacity:.88!important}
.employee-lottie-fallback span:nth-child(1){left:12%!important;animation-delay:-.4s!important;--dx:70px;--rot:420deg;background:#f97316!important}
.employee-lottie-fallback span:nth-child(2){left:32%!important;animation-delay:-1.7s!important;--dx:-42px;--rot:520deg;background:#dc2626!important;transform:scale(.78)!important}
.employee-lottie-fallback span:nth-child(3){left:53%!important;animation-delay:-2.8s!important;--dx:58px;--rot:460deg;background:#f59e0b!important;transform:scale(1.08)!important}
.employee-lottie-fallback span:nth-child(4){left:72%!important;animation-delay:-.9s!important;--dx:-66px;--rot:560deg;background:#b45309!important;transform:scale(.88)!important}
.employee-lottie-fallback span:nth-child(5){left:86%!important;animation-delay:-3.6s!important;--dx:-38px;--rot:500deg;background:#ef4444!important;transform:scale(.68)!important}
@keyframes employee-fallback-leaf{0%{translate:0 -40px;rotate:0deg;opacity:0}10%{opacity:.95}100%{translate:var(--dx,40px) 460px;rotate:var(--rot,480deg);opacity:.9}}
`;

  const clean = String(source || "").replace(
    /\.employee-lottie-fallback\{font-weight:800;color:#64748b;background:#fff;border-radius:999px;padding:10px 14px;box-shadow:0 8px 22px #0f172a14\}/g,
    ""
  );
  return clean.includes("@keyframes employee-fallback-leaf") ? clean : `${clean}\n${fallbackCss}`;
}

require("./server-hotfix.js");
