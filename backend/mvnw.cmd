@echo off
setlocal
set "DIR=%~dp0"

if exist "%DIR%maven\apache-maven-3.8.8\bin\mvn.cmd" (
    call "%DIR%maven\apache-maven-3.8.8\bin\mvn.cmd" %*
    exit /b %ERRORLEVEL%
)

where mvn >nul 2>nul
if %ERRORLEVEL% equ 0 (
    call mvn %*
    exit /b %ERRORLEVEL%
)

echo [ERROR] Maven binary not found in %DIR%maven\apache-maven-3.8.8\bin\mvn.cmd or PATH.
exit /b 1
