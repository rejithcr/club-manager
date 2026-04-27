@echo off
setlocal EnableDelayedExpansion

:: Initialize variables
set TASK=%1
if "%TASK%"=="" set TASK=all

echo ========================================
echo     🚀 Starting Deployment Script       
echo     🎯 Task: %TASK%
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
set CLOUDFRONT_DIST_ID="EFOOV3JU3MD4X" 

:: 1. Database Migrations
if /i "%TASK%"=="backend" goto SkipMigrations
if /i "%TASK%"=="frontend" goto SkipMigrations

echo 📦 Running Flyway Database Migrations...
if "%FLYWAY_URL%"=="" goto SkipMigrations
if "%FLYWAY_USER%"=="" goto SkipMigrations
if "%FLYWAY_PASSWORD%"=="" goto SkipMigrations

call flyway migrate -url="%FLYWAY_URL%" -user="%FLYWAY_USER%" -password="%FLYWAY_PASSWORD%" -locations=filesystem:db
echo ✅ Migrations completed successfully.
goto MigrationsDone

:SkipMigrations
if /i "%TASK%"=="flyway" goto MigrationsDone
echo ⚠️ Flyway credentials not found in environment (FLYWAY_URL, FLYWAY_USER, FLYWAY_PASSWORD).
echo ⚠️ Skipping migrations. Please export these variables if migrations are needed.

:MigrationsDone

:: 2. Build the React Native web app
if /i "%TASK%"=="flyway" goto SkipFrontend
if /i "%TASK%"=="backend" goto SkipFrontend
if /i "%TASK%"=="job" goto SkipFrontend

echo 🏗️ Building Expo Web App...
echo Running npx expo export -p web
call npx expo export -p web
echo ✅ Web App Built Successfully (output in .\dist).

:: 3. Upload to S3
echo ☁️ Uploading artifacts to S3 Bucket (%S3_BUCKET%)...
call aws s3 sync .\dist %S3_BUCKET% --delete --region %AWS_REGION%
echo ✅ Upload completed.

:: 5. (Optional) Invalidate CloudFront Cache
if defined CLOUDFRONT_DIST_ID (
    echo 🔄 Invalidating CloudFront Cache for Distribution %CLOUDFRONT_DIST_ID%...
    call aws cloudfront create-invalidation --distribution-id %CLOUDFRONT_DIST_ID% --paths "/*"
    echo ✅ Cache invalidation triggered.
) else (
    echo ℹ️ No CLOUDFRONT_DIST_ID provided, skipping cache invalidation.
)
:SkipFrontend

:: 4. Bundle and Upload Backend App
if /i "%TASK%"=="flyway" goto SkipBackend
if /i "%TASK%"=="frontend" goto SkipBackend
if /i "%TASK%"=="job" goto SkipBackend

echo 🐍 Bundling Python Backend for AWS Lambda (Linux)...
pushd .\backend

:: 1. Cleanup old build artifacts
if exist build rd /s /q build
if exist app.zip del app.zip
mkdir build

:: 2. Install dependencies (Pass 1: Generic)
echo 📦 Installing dependencies...
pip install --isolated --target build -r requirements.txt

:: 3. Install Linux-native binaries (Pass 2: Python 3.13)
echo 📦 Installing Linux-native binaries (Python 3.13)...
set "BINARY_PKGS=psycopg2-binary sqlalchemy cryptography serverless-wsgi gunicorn Brotli zstandard"
pip install --isolated --target build ^
    --platform manylinux2014_x86_64 --only-binary=:all: ^
    --python-version 3.13 --implementation cp --abi cp313 ^
    --upgrade %BINARY_PKGS%

:: 4. Copy Source Code and main.py
echo 📄 Copying source code and entry point...
xcopy /E /I /Y src build\src\

:: 5. Zip for Lambda using Python (Ensures forward slashes for AWS console)
echo 🤐 Zipping build directory into app.zip...
python -c "import zipfile, os; z = zipfile.ZipFile('app.zip', 'w', zipfile.ZIP_DEFLATED); [z.write(os.path.join(r, f), os.path.relpath(os.path.join(r, f), 'build').replace('\\', '/')) for r, d, files in os.walk('build') for f in files]; z.close()"

if not exist app.zip (
    echo ❌ Failed to create app.zip.
    popd
    exit /b 1
)

echo ✅ Backend app.zip created successfully. Upload the zip manually to aws lambda.
::echo ☁️ Uploading backend to S3 (ccm-common-storage)...
:: call aws s3 cp .\app.zip s3://ccm-common-storage/deploy/backend-app.zip --region %AWS_REGION%

:: Cleanup
rd /s /q build
popd
echo ✅ Backend completed successfully.
:SkipBackend

:: 6. Bundle Scheduled Jobs
if /i "%TASK%"=="flyway" goto SkipJob
if /i "%TASK%"=="frontend" goto SkipJob
if /i "%TASK%"=="backend" goto SkipJob

echo 🛠️ Bundling Scheduled Jobs (Notifier) for AWS Lambda (Linux)...
pushd .\scheduled-jobs\notifier

:: 1. Cleanup old build artifacts
if exist build rd /s /q build
if exist job.zip del job.zip
mkdir build

:: 2. Install dependencies for Linux (Python 3.13)
echo 📦 Installing dependencies for Linux...
pip install --isolated --target build ^
    --platform manylinux2014_x86_64 --only-binary=:all: ^
    --python-version 3.13 --implementation cp --abi cp313 ^
    -r requirements.txt

:: 3. Copy Source Code
echo 📄 Copying source code...
xcopy /E /I /Y src build\src\

:: 4. Zip for Lambda using Python (Ensures forward slashes for AWS console)
echo 🤐 Zipping build directory into job.zip...
python -c "import zipfile, os; z = zipfile.ZipFile('job.zip', 'w', zipfile.ZIP_DEFLATED); [z.write(os.path.join(r, f), os.path.relpath(os.path.join(r, f), 'build').replace('\\', '/')) for r, d, files in os.walk('build') for f in files]; z.close()"

if not exist job.zip (
    echo ❌ Failed to create job.zip.
    popd
    exit /b 1
)

:: Cleanup
rd /s /q build
popd
echo ✅ Scheduled jobs bundled successfully.
:SkipJob

echo ========================================
echo     🎉 Deployment Complete!            
echo ========================================
