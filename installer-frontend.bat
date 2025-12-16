@echo off
echo ========================================
echo   Installation des dependances Frontend
echo ========================================
echo.

cd front

echo Verification de Node.js...
node -version
if %errorlevel% neq 0 (
    echo ERREUR: Node.js n'est pas installe
    echo Veuillez installer Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo Installation des dependances...
echo Cela peut prendre quelques minutes...
echo.

call npm install

if %errorlevel% neq 0 (
    echo.
    echo ERREUR: L'installation a echoue
    echo Essayez de supprimer node_modules et package-lock.json puis reessayez
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Installation terminee avec succes !
echo ========================================
echo.
echo Vous pouvez maintenant lancer le frontend avec:
echo   npm run dev
echo ou
echo   demarrer-frontend.bat
echo.
pause


