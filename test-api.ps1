# Test script to verify backend API endpoints
$baseUrl = "http://localhost:8000"

# Test registration
Write-Host "Testing registration..."
$registerBody = @{
    email = "test_$(Get-Date -Format 'yyyyMMddHHmmss')@example.com"
    password = "testpassword123"
    role = "user"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/api/v1/auth/register" `
        -Method Post `
        -Body $registerBody `
        -ContentType "application/json"
    
    Write-Host "✅ Registration successful!" -ForegroundColor Green
    $registerResponse | ConvertTo-Json -Depth 5 | Write-Host -ForegroundColor Cyan
    
    # Test login with registered credentials
    Write-Host "`nTesting login with registered credentials..." -ForegroundColor Yellow
    $loginBody = @{
        email = $registerResponse.user.email
        password = "testpassword123"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/v1/auth/login" `
        -Method Post `
        -Body $loginBody `
        -ContentType "application/json"
    
    Write-Host "✅ Login successful!" -ForegroundColor Green
    $loginResponse | ConvertTo-Json -Depth 5 | Write-Host -ForegroundColor Cyan
    
    # Test protected endpoint
    if ($loginResponse.token) {
        Write-Host "`nTesting protected endpoint..." -ForegroundColor Yellow
        $headers = @{
            "Authorization" = "Bearer $($loginResponse.token)"
        }
        
        $profileResponse = Invoke-RestMethod -Uri "$baseUrl/api/v1/auth/me" `
            -Headers $headers `
            -ContentType "application/json"
        
        Write-Host "✅ Protected endpoint successful!" -ForegroundColor Green
        $profileResponse | ConvertTo-Json -Depth 5 | Write-Host -ForegroundColor Cyan
    }
    
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    if($_.Exception.Response) {
        $errorResponse = $_.ErrorDetails.Message | ConvertFrom-Json
        $errorResponse | ConvertTo-Json -Depth 5 | Write-Host -ForegroundColor Red
    }
}
