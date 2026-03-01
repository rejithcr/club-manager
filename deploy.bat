@echo off
setlocal EnableDelayedExpansion

echo ========================================
echo     🚀 Starting Deployment Script       
echo ========================================

:: Check for required commands
where npx >nul 2>nul
if %errorlevel% neq 0 (
    echo npx is required but not installed. Aborting.
    exit /b 1
)
where aws >nul 2>nul
if %errorlevel% neq 0 (
    echo aws CLI is required but not installed. Aborting.
    exit /b 1
)
where flyway >nul 2>nul
if %errorlevel% neq 0 (
    echo flyway CLI is required but not installed. Aborting.
    exit /b 1
)

:: Variables (These should be set in environment or CI/CD runner)
set AWS_REGION=ap-south-1
set S3_BUCKET=s3://sportsclubsmanager.com
:: set CLOUDFRONT_DIST_ID="EXXXXXXXXXXXXX" 

:: 1. Database Migrations
echo 📦 Running Flyway Database Migrations...
if "%FLYWAY_URL%"=="" goto SkipMigrations
if "%FLYWAY_USER%"=="" goto SkipMigrations
if "%FLYWAY_PASSWORD%"=="" goto SkipMigrations

pushd .\db
flyway migrate -url="%FLYWAY_URL%" -user="%FLYWAY_USER%" -password="%FLYWAY_PASSWORD%"
popd
echo ✅ Migrations completed successfully.
goto MigrationsDone

:SkipMigrations
echo ⚠️ Flyway credentials not found in environment (FLYWAY_URL, FLYWAY_USER, FLYWAY_PASSWORD).
echo ⚠️ Skipping migrations. Please export these variables if migrations are needed.

:MigrationsDone

:: 2. Build the React Native web app
echo 🏗️ Building Expo Web App...
echo Running npx expo export -p web
call npx expo export -p web
echo ✅ Web App Built Successfully (output in .\dist).

:: 3. Upload to S3
echo ☁️ Uploading artifacts to S3 Bucket (%S3_BUCKET%)...
call aws s3 sync .\dist %S3_BUCKET% --delete --region %AWS_REGION%
echo ✅ Upload completed.

:: 4. Bundle and Upload Backend App
echo 🐍 Bundling Python Backend...
pushd .\backend
if exist app.zip del app.zip
:: Use PowerShell to zip the src folder and requirements
powershell -Command "Compress-Archive -Path '.\src' -DestinationPath '.\app.zip'"
powershell -Command "Compress-Archive -Path '.\requirements.txt' -DestinationPath '.\app.zip' -Update"
echo ☁️ Uploading backend to S3 (ccm-common-storage)...
call aws s3 cp .\app.zip s3://ccm-common-storage/deploy/backend-app.zip --region %AWS_REGION%
popd
echo ✅ Backend uploaded successfully.

:: 5. (Optional) Invalidate CloudFront Cache
if defined CLOUDFRONT_DIST_ID (
    echo 🔄 Invalidating CloudFront Cache for Distribution %CLOUDFRONT_DIST_ID%...
    call aws cloudfront create-invalidation --distribution-id %CLOUDFRONT_DIST_ID% --paths "/*"
    echo ✅ Cache invalidation triggered.
) else (
    echo ℹ️ No CLOUDFRONT_DIST_ID provided, skipping cache invalidation.
)

echo ========================================
echo     🎉 Deployment Complete!            
echo ========================================