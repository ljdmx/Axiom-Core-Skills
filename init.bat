@echo off
echo Initializing Axiom Core Skills via Node.js / Python...
where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
    node init.js
    goto :EOF
)

where python >nul 2>nul
if %ERRORLEVEL% equ 0 (
    python init.py
    goto :EOF
)

echo Error: Neither Node.js nor Python is installed. Please install one to initialize the environment.
exit /b 1
