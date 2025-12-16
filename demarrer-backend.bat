@echo off
echo ========================================
echo   Demarrage du Backend Spring Boot
echo ========================================
echo.

cd JEEproject

echo Verification de Java...
java -version
if %errorlevel% neq 0 (
    echo ERREUR: Java n'est pas installe ou pas dans le PATH
    pause
    exit /b 1
)

echo.
echo Verification de Maven...
mvn -version
if %errorlevel% neq 0 (
    echo ERREUR: Maven n'est pas installe ou pas dans le PATH
    pause
    exit /b 1
)

echo.
echo Compilation du projet...
call mvn clean install -DskipTests
if %errorlevel% neq 0 (
    echo ERREUR: La compilation a echoue
    pause
    exit /b 1
)

echo.
echo Demarrage du backend sur http://localhost:8080
echo Appuyez sur Ctrl+C pour arreter
echo.
call mvn spring-boot:run

pause


