@echo off
echo Starting CivicPulse Spring Boot Backend (Java)...
if exist "%~dp0maven\apache-maven-3.8.8\bin\mvn.cmd" (
    "%~dp0maven\apache-maven-3.8.8\bin\mvn.cmd" spring-boot:run
) else if exist "%~dp0mvnw.cmd" (
    "%~dp0mvnw.cmd" spring-boot:run
) else (
    mvn spring-boot:run
)
pause
