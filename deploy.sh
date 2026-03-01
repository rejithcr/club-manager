#!/bin/bash
set -e

echo "========================================"
echo "    🚀 Starting Deployment Script       "
echo "========================================"

# Check for required commands
command -v npx >/dev/null 2>&1 || { echo >&2 "npx is required but not installed. Aborting."; exit 1; }
command -v aws >/dev/null 2>&1 || { echo >&2 "aws CLI is required but not installed. Aborting."; exit 1; }
command -v flyway >/dev/null 2>&1 || { echo >&2 "flyway CLI is required but not installed. Aborting."; exit 1; }

# Variables (These should be set in environment or CI/CD runner)
AWS_REGION="us-east-1"
S3_BUCKET="s3://sportsclubsmanager.com"
# CLOUDFRONT_DIST_ID="EXXXXXXXXXXXXX" # Set this if you want cache invalidation

# 1. Database Migrations
echo "📦 Running Flyway Database Migrations..."
if [ -z "$FLYWAY_URL" ] || [ -z "$FLYWAY_USER" ] || [ -z "$FLYWAY_PASSWORD" ]; then
  echo "⚠️ Flyway credentials not found in environment (FLYWAY_URL, FLYWAY_USER, FLYWAY_PASSWORD)."
  echo "⚠️ Skipping migrations. Please export these variables if migrations are needed."
else
  cd ./db || exit 1
  flyway migrate -url="$FLYWAY_URL" -user="$FLYWAY_USER" -password="$FLYWAY_PASSWORD"
  cd ..
  echo "✅ Migrations completed successfully."
fi

# 2. Build the React Native web app
echo "🏗️ Building Expo Web App..."
echo "Running npx expo export -p web"
npx expo export -p web
echo "✅ Web App Built Successfully (output in ./dist)."

# 3. Upload to S3
echo "☁️ Uploading artifacts to S3 Bucket ($S3_BUCKET)..."
# Make sure the user running this script is authenticated with AWS CLI
aws s3 sync ./dist $S3_BUCKET --delete --region $AWS_REGION
echo "✅ Upload completed."

# 4. Bundle and Upload Backend App
echo "🐍 Bundling Python Backend..."
cd ./backend || exit 1
# Remove old zip if exists
[ -f app.zip ] && rm app.zip
# Create zip containing just src and requirements.txt
zip -r app.zip src/ requirements.txt > /dev/null
echo "☁️ Uploading backend to S3 (ccm-common-storage)..."
aws s3 cp app.zip s3://ccm-common-storage/deploy/backend-app.zip --region $AWS_REGION
cd ..
echo "✅ Backend uploaded successfully."

# 5. (Optional) Invalidate CloudFront Cache
if [ -n "$CLOUDFRONT_DIST_ID" ]; then
    echo "🔄 Invalidating CloudFront Cache for Distribution $CLOUDFRONT_DIST_ID..."
    aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DIST_ID --paths "/*"
    echo "✅ Cache invalidation triggered."
else
    echo "ℹ️ No CLOUDFRONT_DIST_ID provided, skipping cache invalidation."
fi

echo "========================================"
echo "    🎉 Deployment Complete!            "
echo "========================================"
