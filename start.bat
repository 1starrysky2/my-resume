@echo off
setlocal

cd /d "%~dp0"

echo ==========================================
echo Resume Site - One Click Start
echo ==========================================
echo.

where npm >nul 2>nul
if errorlevel 1 (
  echo [ERROR] npm not found. Please install Node.js LTS first.
  echo         https://nodejs.org/
  echo.
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 (
    echo.
    echo [ERROR] npm install failed.
    pause
    exit /b 1

)

echo.
echo Starting dev server...
echo.
call npm run dev

echo.
pause

