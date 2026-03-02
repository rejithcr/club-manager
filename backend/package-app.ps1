Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Club Manager - App Packaging" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

$buildDir = ".\build"
if (Test-Path $buildDir) {
    Remove-Item -Path $buildDir -Recurse -Force
}
New-Item -ItemType Directory -Path $buildDir | Out-Null

Write-Host "Packaging application..."

# Compressing
Compress-Archive -Path ".\src" -DestinationPath "$buildDir\app.zip"
Compress-Archive -Path ".\requirements.txt" -DestinationPath "$buildDir\app.zip" -Update

# Upload to S3
Write-Host "Uploading to S3..." -ForegroundColor Cyan

aws s3 cp "$buildDir\app.zip" s3://ccm-common-storage/deploy/app.zip
