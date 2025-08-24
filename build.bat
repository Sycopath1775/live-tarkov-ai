@echo off
REM Windows Batch Build Script for Live Tarkov - AI Mod
REM This script won't get stuck and properly handles the build process

echo Building Live Tarkov - AI Mod...
echo IMPORTANT: mod.js will be preserved for SPT compatibility

REM Change to the mod directory
cd "Live Tarkov - AI"

REM Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found! Please install Node.js first.
    echo You can download it from: https://nodejs.org/
    pause
    exit /b 1
)

REM Run the build script
echo Running build script...
node build.mjs
if %errorlevel% equ 0 (
    echo ✓ Build completed successfully!
    echo ✓ mod.js integrity maintained for SPT compatibility
    echo ✓ All TypeScript files compiled
    echo ✓ Mod package created
) else (
    echo Build failed with exit code: %errorlevel%
    pause
    exit /b %errorlevel%
)

REM Return to original directory
cd ..

echo Build process completed!
echo You can now restart your SPT server to test the mod.
pause
