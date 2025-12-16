@echo off
echo ========================================
echo   Demarrage du Frontend Next.js
echo ========================================
echo.

cd front

echo Verification de Node.js...
node -version
if %errorlevel% neq 0 (
    echo ERREUR: Node.js n'est pas installe ou pas dans le PATH
    pause
    exit /b 1
)

echo.
echo Verification de npm...
npm -version
if %errorlevel% neq 0 (
    echo ERREUR: npm n'est pas installe
    pause
    exit /b 1
)

echo.
if not exist "node_modules" (
    echo Installation des dependances (premiere fois)...
    call npm install
    if %errorlevel% neq 0 (
        echo ERREUR: L'installation des dependances a echoue
        pause
        exit /b 1
    )
    echo.
) else (
    echo Les dependances sont deja installees
    echo.
)

echo Demarrage du frontend sur http://localhost:3000
echo Appuyez sur Ctrl+C pour arreter
echo.
call npm run dev

pause


