@echo off
echo 🚀 Starting BB84 QKD Demo for Hackathon...
echo.

echo 📦 Installing dependencies...
call npm install
call cd frontend && npm install
call cd backend && pip install -r requirements.txt

echo.
echo 🎯 Starting services...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.

echo 🌐 HACKATHON SETUP:
echo 1. Note your IP address: 
ipconfig | findstr IPv4
echo.
echo 2. Share these URLs with other laptops:
echo    Alice: http://[YOUR_IP]:3000?user=alice
echo    Bob:   http://[YOUR_IP]:3000?user=bob
echo    Eve:   http://[YOUR_IP]:3000?user=eve
echo.

echo Starting backend server...
start "BB84 Backend" cmd /k "cd backend && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting frontend server...
start "BB84 Frontend" cmd /k "cd frontend && npm start"

echo.
echo ✅ BB84 QKD Demo is starting!
echo.
echo 🌐 Access the interfaces:
echo   Alice: http://localhost:3000?user=alice
echo   Bob:   http://localhost:3000?user=bob
echo   Eve:   http://localhost:3000?user=eve
echo.
echo 🔥 HACKATHON READY! Share your IP with other laptops.
echo.
echo Press any key to exit...
pause > nul
