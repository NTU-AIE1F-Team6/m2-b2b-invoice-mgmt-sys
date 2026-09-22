# Build InvoiceNow SG and publish it to https://artificialintelligence.sg/invoicenow/
#
#   powershell -ExecutionPolicy Bypass -File scripts\deploy.ps1            # build + copy to site repo + NAS
#   powershell -ExecutionPolicy Bypass -File scripts\deploy.ps1 -SkipNas   # build + copy to site repo only
#
# npm cannot install into a Google Drive folder (EBADF), so the source is mirrored to a local
# build folder first. The site repo has no git remote: the live site is whatever sits on the NAS.
param(
    [switch]$SkipNas,
    [string]$SiteRepo = 'G:\My Drive\2. Work\Web project\artificialintelligence.sg',
    [string]$NasRoot = '\DXP4800PLUS-6DD\docker\artificial_intelligence\html'
)
$ErrorActionPreference = 'Stop'
$src = Split-Path -Parent $PSScriptRoot
$build = Join-Path $env:LOCALAPPDATA 'invoicenow-sg-build'

Write-Host "1/4 Mirroring source to $build"
New-Item -ItemType Directory -Force $build | Out-Null
robocopy $src $build /MIR /XD node_modules dist .git /NFL /NDL /NJH /NJS /NP | Out-Null
if ($LASTEXITCODE -ge 8) { throw "robocopy failed with code $LASTEXITCODE" }

Push-Location $build
try {
    Write-Host "2/4 npm install + build"
    if (-not (Test-Path 'node_modules')) { npm install --no-audit --no-fund; if ($LASTEXITCODE) { throw 'npm install failed' } }
    else { npm install --no-audit --no-fund --prefer-offline; if ($LASTEXITCODE) { throw 'npm install failed' } }
    $env:BASE_PATH = '/invoicenow/'   # sub-folder deploy; Vercel builds use the default "/"
    npm run build
    if ($LASTEXITCODE) { throw 'npm run build failed' }
} finally { Pop-Location }

$dist = Join-Path $build 'dist'
$siteTarget = Join-Path $SiteRepo 'invoicenow'
Write-Host "3/4 Copying dist to $siteTarget"
robocopy $dist $siteTarget /MIR /NFL /NDL /NJH /NJS /NP | Out-Null
if ($LASTEXITCODE -ge 8) { throw "robocopy to site repo failed with code $LASTEXITCODE" }

if ($SkipNas) { Write-Host 'Skipped NAS copy (-SkipNas).'; exit 0 }

$nasTarget = Join-Path $NasRoot 'invoicenow'
Write-Host "4/4 Copying dist to $nasTarget"
robocopy $dist $nasTarget /MIR /NFL /NDL /NJH /NJS /NP | Out-Null
if ($LASTEXITCODE -ge 8) { throw "robocopy to NAS failed with code $LASTEXITCODE" }

Write-Host 'Verifying live URL...'
try {
    $r = Invoke-WebRequest -Uri 'https://artificialintelligence.sg/invoicenow/' -UseBasicParsing -TimeoutSec 20
    Write-Host "Live: HTTP $($r.StatusCode), $($r.Content.Length) bytes"
} catch { Write-Warning "Live check failed: $($_.Exception.Message)" }
