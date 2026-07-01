@echo off
REM ── Item Manager dev launcher (Laravel + Vue + PostgreSQL) ──
REM Uses Laragon's PHP 8.3 explicitly so it doesn't pick up old PHP 7.

set PHP="C:\laragon\bin\php\php-8.3.10\php.exe"

echo Starting Vite (frontend) and Laravel (backend)...
start "Vite"    cmd /k "npm run dev"
start "Laravel" cmd /k %PHP% artisan serve --host=127.0.0.1 --port=8000

echo.
echo  App:  http://127.0.0.1:8000
echo  (Keep both windows open. Close them to stop.)
