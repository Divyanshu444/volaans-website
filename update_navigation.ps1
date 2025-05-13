# PowerShell script to update all HTML files by replacing the home dropdown with a single link

$htmlFiles = Get-ChildItem -Path . -Filter "*.html" | Where-Object { $_.Name -ne "index.html" -and $_.Name -ne "about.html" }

foreach ($file in $htmlFiles) {
    Write-Host "Processing $($file.Name)..."
    
    $content = Get-Content -Path $file.FullName -Raw
    
    # Define the patterns to search for and replace
    $homeDropdownPattern = '(?s)<li class="has-dropdown">\s*<a href="#">Home <span><i class="fa-solid fa-angle-down d-lg-inline d-none"></i></span></a>.*?<div class="vl-mega-menu">.*?</div>\s*</li>'
    $replacementString = '<li>
                                  <a href="index.html">Home</a>
                              </li>'
    
    # Replace the pattern
    $updatedContent = $content -replace $homeDropdownPattern, $replacementString
    
    # Write the updated content back to the file
    $updatedContent | Set-Content -Path $file.FullName
}

Write-Host "Navigation update complete!" 