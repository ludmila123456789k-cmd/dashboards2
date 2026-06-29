$ErrorActionPreference = "Stop"

$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = 4174
$editorBaseUrl = "http://localhost:$port"
$nodeOutLog = Join-Path $projectDir "server.out.log"
$nodeErrLog = Join-Path $projectDir "server.err.log"
$bundledNode = Join-Path $env:USERPROFILE ".cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
$systemNode = Get-Command node -ErrorAction SilentlyContinue

function Get-NodePath {
  if (Test-Path $bundledNode) { return $bundledNode }
  if ($systemNode) { return $systemNode.Source }
  throw "Node.js was not found. Run this app from Codex or install Node.js 18+."
}

function Test-LocalServer {
  try {
    Invoke-RestMethod -Method Get -Uri "$editorBaseUrl/api/health" -TimeoutSec 2 | Out-Null
    return $true
  } catch {
    return $false
  }
}

function Wait-ForLocalServer {
  for ($i = 0; $i -lt 40; $i++) {
    if (Test-LocalServer) { return }
    Start-Sleep -Milliseconds 500
  }
  throw "Could not start the local editor at $editorBaseUrl."
}

$node = Get-NodePath
$serverProcess = $null
$startedHere = $false

try {
  if (-not (Test-LocalServer)) {
    $env:HOST = "0.0.0.0"
    $env:PORT = "$port"
    $env:EDITOR_BASE_URL = $editorBaseUrl
    $serverProcess = Start-Process -FilePath $node -ArgumentList "server.js" -WorkingDirectory $projectDir -RedirectStandardOutput $nodeOutLog -RedirectStandardError $nodeErrLog -WindowStyle Hidden -PassThru
    $startedHere = $true
    Wait-ForLocalServer
  }

  $share = Invoke-RestMethod -Method Post -Uri "$editorBaseUrl/api/share"

  if ($share.shareUrl -notmatch "^https://") {
    Write-Host ""
    Write-Host "Public HTTPS view link is not configured yet." -ForegroundColor Yellow
    Write-Host "Use a stable public server/domain and set PUBLIC_VIEW_BASE_URL, then this button will copy the manager link." -ForegroundColor Yellow
    Write-Host "Editor link: $editorBaseUrl" -ForegroundColor Green
    exit 0
  }

  Write-Host ""
  Write-Host "Editor link: $editorBaseUrl" -ForegroundColor Green
  Write-Host "Manager public view link: $($share.shareUrl)" -ForegroundColor Cyan
  Write-Host ""
  Write-Host "Keep the local editor running while the public link is needed." -ForegroundColor DarkGray

  if ($startedHere -and $serverProcess) {
    Wait-Process -Id $serverProcess.Id
  }
} finally {
  if ($startedHere -and $serverProcess -and -not $serverProcess.HasExited) {
    Stop-Process -Id $serverProcess.Id -Force
  }
}
