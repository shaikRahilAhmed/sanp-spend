@echo off
echo Installing PDF support for backend...
cd backend
npm install pdf-parse axios
echo.
echo Installation complete!
echo.
echo Next steps:
echo 1. Make sure your backend/.env has GEMINI_API_KEY
echo 2. Restart your backend server
echo 3. Go to /analyzer page and upload a PDF or CSV!
echo.
pause
