# 1. Login to get token
$loginBody = @{
    email    = "admin@hostel.com"
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri http://localhost:5000/api/auth/login -Method Post -ContentType "application/json" -Body $loginBody
    $token = $loginResponse.token
    Write-Host "Login Successful." -ForegroundColor Green
}
catch {
    Write-Host "Login Failed: $_" -ForegroundColor Red
    exit
}

$headers = @{
    Authorization = "Bearer $token"
}

# 2. Verify Grocery Requests Endpoint
try {
    $grocery = Invoke-RestMethod -Uri http://localhost:5000/api/grocery -Method Get -Headers $headers
    Write-Host "Grocery Endpoint: Success. Found $($grocery.Count) requests." -ForegroundColor Green
}
catch {
    Write-Host "Grocery Endpoint Failed: $_" -ForegroundColor Red
}

# 3. Verify Notices Endpoint
try {
    $notices = Invoke-RestMethod -Uri http://localhost:5000/api/notices -Method Get -Headers $headers
    Write-Host "Notices Endpoint: Success. Found $($notices.Count) notices." -ForegroundColor Green
}
catch {
    Write-Host "Notices Endpoint Failed: $_" -ForegroundColor Red
}
