$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

function Print-Section($title) {
  Write-Host ("`n==== {0} ====" -f $title) -ForegroundColor Cyan
}

# 1) Health
Print-Section "HEALTH"
$health = Invoke-RestMethod -Uri http://127.0.0.1:8000/health -Method GET
$health | ConvertTo-Json -Depth 5

# Generate a unique email for this run
$stamp = Get-Date -Format 'yyyyMMddHHmmss'
$email = "tester_${stamp}@example.com"

# 2) Register
Print-Section "REGISTER"
$regBody = @"
{
  "email": "$email",
  "password": "Passw0rd!",
  "role": "user"
}
"@
$reg = Invoke-RestMethod -Uri http://127.0.0.1:8000/api/v1/auth/register -Method POST -ContentType 'application/json' -Body $regBody
$reg | ConvertTo-Json -Depth 6

# 3) Login
Print-Section "LOGIN"
$loginBody = @"
{
  "email": "$email",
  "password": "Passw0rd!"
}
"@
$login = Invoke-RestMethod -Uri http://127.0.0.1:8000/api/v1/auth/login -Method POST -ContentType 'application/json' -Body $loginBody
$login | ConvertTo-Json -Depth 6

# 4) Me (Authenticated)
Print-Section "ME"
$token = $login.token
$me = Invoke-RestMethod -Uri http://127.0.0.1:8000/api/v1/auth/me -Headers @{ Authorization = ("Bearer " + $token) }
$me | ConvertTo-Json -Depth 6
