param(
    [int]$ListenPort = 8000,
    [string]$ListenHost = "127.0.0.1"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

Write-Host "=== TherapyConnect Backend: Python venv runner ===" -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $scriptDir
try {
    $venvPath = Join-Path $scriptDir ".venv"

    if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
        Write-Error "Python is not installed or not on PATH. Install Python 3.11+ from https://www.python.org/downloads/windows/ and check 'Add python.exe to PATH'."
        exit 1
    }

    if (-not (Test-Path $venvPath)) {
        Write-Host "Creating virtual environment (.venv)..." -ForegroundColor Yellow
        python -m venv .venv
    }

    $activate = Join-Path $venvPath "Scripts\Activate.ps1"
    if (-not (Test-Path $activate)) {
        Write-Error "Activation script not found at $activate"
        exit 1
    }

    Write-Host "Activating venv..." -ForegroundColor Yellow
    & $activate

    Write-Host "Upgrading pip and installing dependencies..." -ForegroundColor Yellow
    python -m pip install --upgrade pip
    pip install -r requirements.txt

    $uploadsDir = Join-Path $scriptDir "uploads"
    if (-not (Test-Path $uploadsDir)) {
        New-Item -ItemType Directory -Path $uploadsDir | Out-Null
    }

    # Load environment variables from .env (root or backend) if present
    function Load-DotEnv([string]$filePath) {
        if (Test-Path $filePath) {
            Write-Host "Loading environment variables from $filePath" -ForegroundColor Yellow
            Get-Content $filePath | ForEach-Object {
                $line = $_.Trim()
                if ($line -and -not $line.StartsWith('#') -and $line.Contains('=')) {
                    $key, $value = $line.Split('=', 2)
                    $key = $key.Trim()
                    $value = $value.Trim().Trim('"').Trim("'")
                    if (-not [string]::IsNullOrWhiteSpace($key)) {
                        [System.Environment]::SetEnvironmentVariable($key, $value, 'Process')
                    }
                }
            }
        }
    }

    $rootEnv = Resolve-Path (Join-Path $scriptDir "..\.env") -ErrorAction SilentlyContinue
    if ($null -ne $rootEnv) { Load-DotEnv $rootEnv.Path }
    $localEnv = Join-Path $scriptDir ".env"
    if (Test-Path $localEnv) { Load-DotEnv $localEnv }

    if (-not $env:SECRET_KEY) {
        $env:SECRET_KEY = "dev-secret-key-change-me"
    }

    Write-Host "Starting FastAPI with Uvicorn on http://${ListenHost}:${ListenPort} ..." -ForegroundColor Green
    uvicorn main:app --host $ListenHost --port $ListenPort --reload
}
finally {
    Pop-Location
}
