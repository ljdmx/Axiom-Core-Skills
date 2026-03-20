@echo off
SETLOCAL EnableDelayedExpansion

echo 🛡️  Axiom Core Skills v2.0: Initialization
echo ========================================

:: Detect target .agent/skills directory
SET "TARGET_DIR=.agent\skills"

IF NOT EXIST "%TARGET_DIR%" (
    echo [!] Target directory %TARGET_DIR% not found.
    echo [!] Creating %TARGET_DIR%...
    mkdir "%TARGET_DIR%"
)

echo [*] Linking skills to %TARGET_DIR%...

:: Define skills to link
SET "SKILLS=_core_axioms product-core frontend-core backend-core mobile-core web3-core threejs-core"

FOR %%S IN (%SKILLS%) DO (
    IF EXIST "skills\%%S" (
        echo   -^> Linking %%S...
        :: Using mklink /D for directory junctions to avoid disk bloat
        mklink /J "%TARGET_DIR%\%%S" "%~dp0skills\%%S" >nul
        IF !ERRORLEVEL! NEQ 0 (
            echo   [!] Failed to link %%S. Falling back to copy...
            xcopy /E /I /H /Y "skills\%%S" "%TARGET_DIR%\%%S" >nul
        )
    ) ELSE (
        echo   [?] Skill %%S not found in source. Skipping.
    )
)

echo.
echo ✅ Axiom Core Zenith v10.1 Linked Successfully.
echo [*] Orchestrator is ready to fire.
echo.
pause
