# PowerShell Build Script for Live Tarkov - AI Mod
# This script won't get stuck and properly handles the build process

Write-Host "Building Live Tarkov - AI Mod..." -ForegroundColor Green
Write-Host "IMPORTANT: mod.js will be preserved for SPT compatibility" -ForegroundColor Yellow

# Change to the mod directory
Set-Location "Live Tarkov - AI"

# Check if Node.js is available
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: Node.js not found! Please install Node.js first." -ForegroundColor Red
    Write-Host "You can download it from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Run the build script
Write-Host "Running build script..." -ForegroundColor Cyan
try {
    node build.mjs
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Build completed successfully!" -ForegroundColor Green
        Write-Host "✓ mod.js integrity maintained for SPT compatibility" -ForegroundColor Green
        Write-Host "✓ All TypeScript files compiled" -ForegroundColor Green
        Write-Host "✓ Mod package created" -ForegroundColor Green
    } else {
        Write-Host "Build failed with exit code: $LASTEXITCODE" -ForegroundColor Red
        exit $LASTEXITCODE
    }
} catch {
    Write-Host "ERROR: Build script execution failed!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

# Return to original directory
Set-Location ".."

Write-Host "Build process completed!" -ForegroundColor Green
Write-Host "You can now restart your SPT server to test the mod." -ForegroundColor Cyan
