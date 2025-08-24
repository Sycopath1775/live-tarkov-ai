@echo off
echo 🔄 Live Tarkov - AI Auto-Sync Starting...
echo.

REM Check if PowerShell is available
powershell -ExecutionPolicy Bypass -File "%~dp0auto-sync.ps1" %*

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Auto-sync failed. Check the error messages above.
    pause
) else (
    echo.
    echo ✅ Auto-sync completed successfully!
    echo.
)
