# PowerShell script to start host, remote, and admin apps
# This script starts the remote app first, then the admin app, then the host app

Write-Host "Starting Module Federation Apps..." -ForegroundColor Green

# Start remote app in background
Write-Host "Starting remote app on port 5001..." -ForegroundColor Yellow
$remoteJob = Start-Job -ScriptBlock {
    Set-Location ".\remote-app"
    npm run dev
}

# Wait a moment for remote app to start
Start-Sleep -Seconds 3

# Start admin app in background
Write-Host "Starting admin app on port 5002..." -ForegroundColor Yellow
$adminJob = Start-Job -ScriptBlock {
    Set-Location ".\admin-app"
    npm run dev
}

# Wait a moment for admin app to start
Start-Sleep -Seconds 3

# Start host app
Write-Host "Starting host app on port 5173..." -ForegroundColor Yellow
$hostJob = Start-Job -ScriptBlock {
    Set-Location ".\host-app"
    npm run dev
}

Write-Host "All apps are starting up..." -ForegroundColor Green
Write-Host "Remote app: http://localhost:5001" -ForegroundColor Cyan
Write-Host "Admin app: http://localhost:5002" -ForegroundColor Cyan
Write-Host "Host app: http://localhost:5173" -ForegroundColor Cyan

# Keep the script running to maintain the jobs
Write-Host "Press Ctrl+C to stop both applications" -ForegroundColor Red

# Wait for user to stop
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    Write-Host "Stopping applications..." -ForegroundColor Yellow
    Stop-Job $remoteJob
    Stop-Job $adminJob
    Stop-Job $hostJob
    Remove-Job $remoteJob
    Remove-Job $adminJob
    Remove-Job $hostJob
    Write-Host "Applications stopped." -ForegroundColor Green
}
