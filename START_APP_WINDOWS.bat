@echo off
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  start "" "http://127.0.0.1:4173/#home"
  py -m http.server 4173 --bind 127.0.0.1
) else (
  start "" "http://127.0.0.1:4173/#home"
  python -m http.server 4173 --bind 127.0.0.1
)
