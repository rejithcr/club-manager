@echo off
cmd /c npx expo export --platform web --output-dir ./firebase/public
cd firebase
copy .\404.html .\public\
cmd /c firebase deploy --only hosting
cd ..\