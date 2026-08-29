@echo off
title benosh.tech Admin
cd /d "%~dp0"

echo.
echo   benosh.tech Admin
echo   -----------------
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo   Node.js is not installed on this computer.
  echo   Install it from https://nodejs.org and run this again.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo   First run - setting things up. This takes a minute.
  echo.
  call npm install
  if errorlevel 1 (
    echo.
    echo   Setup failed. Check your internet connection and try again.
    echo.
    pause
    exit /b 1
  )
  echo.
)

echo   Starting the admin panel and the live preview...
echo   Your browser will open in a moment.
echo.

REM The panel starts the Next preview itself, so there is only ever one window
REM to close - and closing it stops the preview too.
node "admin\server.mjs"

echo.
echo   The admin panel has stopped.
pause
