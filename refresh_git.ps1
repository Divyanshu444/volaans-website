# PowerShell script to refresh Git connections
# This script closes active Git processes and reconnects

Write-Host "Refreshing Git connections..." -ForegroundColor Cyan

# Check if Git is installed
if (Get-Command git -ErrorAction SilentlyContinue) {
    # Save current directory to return to it later
    $currentDir = Get-Location
    
    # End any running git processes (if needed)
    $gitProcesses = Get-Process | Where-Object { $_.Name -like "*git*" } -ErrorAction SilentlyContinue
    if ($gitProcesses) {
        Write-Host "Closing active Git processes..." -ForegroundColor Yellow
        $gitProcesses | ForEach-Object { 
            try {
                $_.CloseMainWindow() | Out-Null
                Start-Sleep -Milliseconds 500
                if (!$_.HasExited) {
                    $_.Kill()
                }
            } catch {
                Write-Host "Could not close process $($_.Name) (PID: $($_.Id))" -ForegroundColor Red
            }
        }
    }
    
    # Clear Git credential cache (optional)
    Write-Host "Clearing Git credential cache..." -ForegroundColor Yellow
    git credential-manager uninstall
    git credential-manager install
    
    # Reset Git configuration cache
    Write-Host "Resetting Git configuration cache..." -ForegroundColor Yellow
    git config --local --unset credential.helper
    git config --global --unset credential.helper
    git config --global credential.helper manager-core
    
    # Force refresh of Git status
    Write-Host "Refreshing Git status..." -ForegroundColor Yellow
    git status
    
    Write-Host "Git connections have been refreshed." -ForegroundColor Green
    Write-Host "You may need to provide your credentials on the next Git operation." -ForegroundColor Cyan
    
} else {
    Write-Host "Git is not installed or not in the PATH." -ForegroundColor Red
} 