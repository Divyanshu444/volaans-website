# PowerShell script to add gesture navigation script to all HTML files
Write-Host "Adding gesture navigation script to all HTML files..."

# Get all HTML files in the current directory
$htmlFiles = Get-ChildItem -Path . -Filter "*.html"

# Our script tag to insert
$scriptTag = "`n<!-- Gesture Navigation Script for track pad and touchscreen swipe navigation -->`n<script src=`"assets/js/gesture-navigation.js`"></script>`n</body>"

# Count for tracking progress
$updatedFiles = 0

foreach ($file in $htmlFiles) {
    Write-Host "Processing $($file.Name)..."
    
    # Read the file content
    $content = Get-Content -Path $file.FullName -Raw
    
    # Check if the script is already added
    if ($content -match "gesture-navigation\.js") {
        Write-Host "  Script already added to $($file.Name), skipping..." -ForegroundColor Yellow
        continue
    }
    
    # Replace the closing body tag with our script + closing body tag
    $updatedContent = $content -replace "</body>", $scriptTag
    
    # Write the content back to the file
    Set-Content -Path $file.FullName -Value $updatedContent
    
    $updatedFiles++
    Write-Host "  Successfully updated $($file.Name)" -ForegroundColor Green
}

Write-Host "Completed! Updated $updatedFiles HTML files." -ForegroundColor Cyan 