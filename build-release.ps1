# Live Tarkov - AI Release Builder
# Creates a properly structured zip file for SPT mod distribution

Write-Host "Building Live Tarkov - AI Release Package..." -ForegroundColor Green

# Configuration
$modName = "Live Tarkov - AI"
$version = "1.0.0"
$releaseName = "$modName-v$version"
$tempDir = "temp-release"
$zipName = "$releaseName.zip"

# Clean up previous builds
if (Test-Path $tempDir) {
    Remove-Item -Recurse -Force $tempDir
}
if (Test-Path $zipName) {
    Remove-Item -Force $zipName
}

# Create temp directory structure
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
New-Item -ItemType Directory -Path "$tempDir/user/mods" -Force | Out-Null

# Copy mod files to temp directory
Write-Host "Copying mod files..." -ForegroundColor Yellow
Copy-Item -Path "src" -Destination "$tempDir/user/mods/$modName/" -Recurse -Force
Copy-Item -Path "config" -Destination "$tempDir/user/mods/$modName/" -Recurse -Force
Copy-Item -Path "package.json" -Destination "$tempDir/user/mods/$modName/" -Force

# Copy documentation files to root of temp directory
Write-Host "Copying documentation..." -ForegroundColor Yellow
Copy-Item -Path "README.md" -Destination "$tempDir/" -Force
Copy-Item -Path "LICENSE" -Destination "$tempDir/" -Force
Copy-Item -Path "INSTALLATION.md" -Destination "$tempDir/" -Force
Copy-Item -Path "CHANGELOG.md" -Destination "$tempDir/" -Force

# Create zip file
Write-Host "Creating zip file..." -ForegroundColor Yellow
try {
    # Use .NET compression if available (Windows 10+)
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    [System.IO.Compression.ZipFile]::CreateFromDirectory($tempDir, $zipName)
    Write-Host "Zip file created successfully: $zipName" -ForegroundColor Green
} catch {
    Write-Host ".NET compression failed, trying PowerShell alternative..." -ForegroundColor Yellow
    try {
        # PowerShell alternative using Compress-Archive
        Compress-Archive -Path "$tempDir/*" -DestinationPath $zipName -Force
        Write-Host "Zip file created successfully: $zipName" -Force
    } catch {
        Write-Host "Failed to create zip file. Please install 7-Zip or WinRAR and manually create the zip." -ForegroundColor Red
        Write-Host "Files are ready in the $tempDir folder" -ForegroundColor Yellow
        exit 1
    }
}

# Clean up temp directory
Remove-Item -Recurse -Force $tempDir

# Show final structure
Write-Host ""
Write-Host "Release package structure:" -ForegroundColor Cyan
Write-Host "  $zipName" -ForegroundColor White
Write-Host "  ├── LICENSE" -ForegroundColor White
Write-Host "  ├── README.md" -ForegroundColor White
Write-Host "  ├── INSTALLATION.md" -ForegroundColor White
Write-Host "  ├── CHANGELOG.md" -ForegroundColor White
Write-Host "  └── user/" -ForegroundColor White
Write-Host "      └── mods/" -ForegroundColor White
Write-Host "          └── $modName/" -ForegroundColor White
Write-Host "              ├── package.json" -ForegroundColor White
Write-Host "              ├── src/" -ForegroundColor White
Write-Host "              └── config/" -ForegroundColor White

Write-Host ""
Write-Host "Release package ready for distribution!" -ForegroundColor Green
Write-Host "Upload $zipName to the SPT mod page and GitHub releases" -ForegroundColor Cyan
Write-Host "Users can simply extract and drag the 'user' folder to their SPT directory" -ForegroundColor Cyan
Write-Host ""
Write-Host "GitHub Release Information:" -ForegroundColor Yellow
Write-Host "Title: Live Tarkov - AI v1.0.0 - Initial Release" -ForegroundColor White
Write-Host "Tag: v1.0.0" -ForegroundColor White
Write-Host "Target: main" -ForegroundColor White
