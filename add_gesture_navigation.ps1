# Add gesture navigation script to all HTML files
Write-Host "Adding gesture navigation to HTML files..." -ForegroundColor Cyan

# Create plugins directory if it doesn't exist
$pluginsDir = "assets/js/plugins"
if (!(Test-Path $pluginsDir)) {
    New-Item -ItemType Directory -Force -Path $pluginsDir
    Write-Host "Created plugins directory: $pluginsDir" -ForegroundColor Yellow
}

# Get all HTML files
$htmlFiles = Get-ChildItem -Path . -Filter "*.html"

# Scripts to add - they must be placed BEFORE the closing body tag to ensure they load correctly
$polyfillScript = "`n<!-- Wheel Event Polyfill -->`n<script src=`"assets/js/plugins/wheel-event-polyfill.js`"></script>`n"
$gestureScript = "`n<!-- Gesture Navigation -->`n<script src=`"assets/js/gesture-navigation.js`"></script>`n"

# Count for stats
$filesUpdated = 0
$filesAlreadyHave = 0
$filesError = 0
$filesPlacementFixed = 0

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    $updated = $false
    
    # Check if the file already has the wheel polyfill script
    if (!($content -match "wheel-event-polyfill\.js")) {
        try {
            # Add the polyfill script right before the closing body tag
            if ($content -match "</body>") {
                $content = $content -replace "</body>", "$polyfillScript</body>"
                $updated = $true
                Write-Host "Added wheel polyfill to: $($file.Name)" -ForegroundColor Cyan
            }
        } catch {
            Write-Host "Error adding wheel polyfill to $($file.Name): $_" -ForegroundColor Red
            $filesError++
        }
    }
    
    # Check if the file already has the gesture navigation script
    if ($content -match "gesture-navigation\.js") {
        # Check if it's placed correctly - it should be before the </body> tag
        if ($content -match "gesture-navigation\.js.*</body>") {
            if (!$updated) {
                Write-Host "Already exists and correctly placed in: $($file.Name)" -ForegroundColor Green
                $filesAlreadyHave++
            }
        } else {
            # Fix the placement - remove the existing script tag and add it in the correct position
            $content = $content -replace "<script.*?gesture-navigation\.js.*?</script>", ""
            $content = $content -replace "</body>", "$gestureScript</body>"
            $updated = $true
            Write-Host "Fixed placement in: $($file.Name)" -ForegroundColor Yellow
            $filesPlacementFixed++
        }
    } else {
        # Add the gesture script right before the closing body tag
        try {
            if ($content -match "</body>") {
                $content = $content -replace "</body>", "$gestureScript</body>"
                $updated = $true
                Write-Host "Added gesture navigation to: $($file.Name)" -ForegroundColor Green
                $filesUpdated++
            } else {
                Write-Host "Cannot find </body> tag in: $($file.Name)" -ForegroundColor Red
                $filesError++
            }
        } catch {
            Write-Host "Error processing $($file.Name): $_" -ForegroundColor Red
            $filesError++
        }
    }
    
    # Save changes if file was updated
    if ($updated) {
        Set-Content -Path $file.FullName -Value $content
    }
}

Write-Host "`nSummary:" -ForegroundColor Cyan
Write-Host "Files updated: $filesUpdated" -ForegroundColor White
Write-Host "Files already containing script (correctly placed): $filesAlreadyHave" -ForegroundColor Green
Write-Host "Files with placement fixed: $filesPlacementFixed" -ForegroundColor Yellow
Write-Host "Files with errors: $filesError" -ForegroundColor Red
Write-Host "Total HTML files: $($htmlFiles.Count)" -ForegroundColor White 