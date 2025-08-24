@echo off
chcp 65001 >nul
echo 🎯 Building Live Tarkov - AI Release Package...

REM Configuration
set "modName=Live Tarkov - AI"
set "version=1.0.0"
set "releaseName=%modName%-v%version%"
set "tempDir=temp-release"
set "zipName=%releaseName%.zip"

REM Clean up previous builds
if exist "%tempDir%" rmdir /s /q "%tempDir%"
if exist "%zipName%" del /f "%zipName%"

REM Create temp directory structure
mkdir "%tempDir%" 2>nul
mkdir "%tempDir%\user\mods" 2>nul

echo 📁 Copying mod files...
xcopy "src" "%tempDir%\user\mods\%modName%\src\" /e /i /y >nul
xcopy "config" "%tempDir%\user\mods\%modName%\config\" /e /i /y >nul
copy "package.json" "%tempDir%\user\mods\%modName%\" >nul

echo 📄 Copying documentation...
copy "README.md" "%tempDir%\" >nul
copy "LICENSE" "%tempDir%\" >nul

echo 🗜️ Creating zip file...

REM Try to use PowerShell for compression
powershell -Command "try { Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::CreateFromDirectory('$tempDir', '$zipName'); Write-Host '✅ Zip file created successfully: $zipName' -ForegroundColor Green } catch { Write-Host '❌ Failed to create zip file' -ForegroundColor Red; exit 1 }" 2>nul

if exist "%zipName%" (
    echo ✅ Zip file created successfully: %zipName%
) else (
    echo ❌ Failed to create zip file. Please install 7-Zip or WinRAR and manually create the zip.
    echo 📁 Files are ready in the %tempDir% folder
    pause
    exit /b 1
)

REM Clean up temp directory
rmdir /s /q "%tempDir%"

echo.
echo 📦 Release package structure:
echo   %zipName%
echo   ├── LICENSE
echo   ├── README.md
echo   └── user/
echo       └── mods/
echo           └── %modName%/
echo               ├── package.json
echo               ├── src/
echo               └── config/

echo.
echo 🎉 Release package ready for distribution!
echo 📤 Upload %zipName% to the SPT mod page
echo 📋 Users can simply extract and drag the 'user' folder to their SPT directory
echo.
pause
