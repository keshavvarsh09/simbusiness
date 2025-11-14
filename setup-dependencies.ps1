# PowerShell script to install dependencies
# This script will find Node.js and install all required packages

Write-Host "Searching for Node.js installation..." -ForegroundColor Yellow

# Common Node.js installation paths
$nodePaths = @(
    "C:\Program Files\nodejs\node.exe",
    "C:\Program Files (x86)\nodejs\node.exe",
    "$env:APPDATA\npm\node.exe",
    "$env:LOCALAPPDATA\Programs\nodejs\node.exe",
    "$env:ProgramFiles\nodejs\node.exe"
)

$nodePath = $null
foreach ($path in $nodePaths) {
    if (Test-Path $path) {
        $nodePath = $path
        Write-Host "Found Node.js at: $path" -ForegroundColor Green
        break
    }
}

# Try to find via registry
if (-not $nodePath) {
    $regPath = "HKLM:\SOFTWARE\Node.js"
    if (Test-Path $regPath) {
        $nodeVersion = Get-ItemProperty $regPath | Select-Object -ExpandProperty "(default)" -ErrorAction SilentlyContinue
        if ($nodeVersion) {
            $possiblePath = "C:\Program Files\nodejs\node.exe"
            if (Test-Path $possiblePath) {
                $nodePath = $possiblePath
                Write-Host "Found Node.js via registry: $possiblePath" -ForegroundColor Green
            }
        }
    }
}

# Try Get-Command with full environment refresh
if (-not $nodePath) {
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    $nodeCmd = Get-Command node -ErrorAction SilentlyContinue
    if ($nodeCmd) {
        $nodePath = $nodeCmd.Source
        Write-Host "Found Node.js in PATH: $nodePath" -ForegroundColor Green
    }
}

if (-not $nodePath) {
    Write-Host "`nERROR: Node.js not found!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "After installing, restart your terminal and run this script again." -ForegroundColor Yellow
    exit 1
}

# Get npm path (usually in same directory as node)
$nodeDir = Split-Path $nodePath
$npmPath = Join-Path $nodeDir "npm.cmd"

if (-not (Test-Path $npmPath)) {
    Write-Host "ERROR: npm not found at expected location: $npmPath" -ForegroundColor Red
    exit 1
}

Write-Host "`nInstalling dependencies..." -ForegroundColor Yellow
Write-Host "Using npm at: $npmPath" -ForegroundColor Cyan

# Change to script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

# Run npm install
& $npmPath install

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nDependencies installed successfully!" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Cyan
    Write-Host "1. Restart your TypeScript server in your IDE" -ForegroundColor White
    Write-Host "2. Create a .env file with your environment variables" -ForegroundColor White
    Write-Host "3. Run 'npm run dev' to start the development server" -ForegroundColor White
} else {
    Write-Host "`nInstallation failed. Check the error messages above." -ForegroundColor Red
    exit 1
}

