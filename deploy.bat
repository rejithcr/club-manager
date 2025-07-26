@echo off
cmd /c npx expo export --platform web --output-dir ./firebase/public
cd firebase
cmd /c firebase deploy --only hosting
cd ..\