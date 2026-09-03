(() => {
  if (window.__konglomeratReportHotfixLoader) return;
  window.__konglomeratReportHotfixLoader = true;
  const script = document.createElement("script");
  script.src = "/outputs/marketing-system-app/public/report-hotfix.js?v=20260903-03";
  script.defer = true;
  document.head.appendChild(script);
})();
