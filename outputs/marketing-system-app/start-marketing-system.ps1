$ErrorActionPreference = "Stop"

$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$bundledNode = Join-Path $env:USERPROFILE ".cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
$systemNode = Get-Command node -ErrorAction SilentlyContinue

if (Test-Path $bundledNode) {
  $node = $bundledNode
} elseif ($systemNode) {
  $node = $systemNode.Source
} else {
  Write-Host "Node.js не найден. Установите Node.js 18+ или запустите приложение из Codex." -ForegroundColor Red
  exit 1
}

Write-Host "Marketing System: http://localhost:4174" -ForegroundColor Green
Write-Host "Оставьте это окно открытым, пока нужна программа." -ForegroundColor DarkGray
Set-Location $projectDir
& $node server.js
