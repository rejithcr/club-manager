import os
import shutil
import zipfile
import subprocess
import sys

# Constants
SRC_DIR = "src"
BUILD_DIR = "build"
ZIP_NAME = "app.zip"
TARGET_PYTHON = "3.12"

def run_command(command):
    print(f"Executing: {command}")
    result = subprocess.run(command, shell=True)
    if result.returncode != 0:
        print(f"❌ Command failed with exit code {result.returncode}")
        sys.exit(1)

# 1. Cleanup
print("🧹 Cleaning up old build artifacts...")
if os.path.exists(BUILD_DIR):
    shutil.rmtree(BUILD_DIR)
os.makedirs(BUILD_DIR)

if os.path.exists(ZIP_NAME):
    os.remove(ZIP_NAME)

# 2. Robust Installation for AWS Lambda
print(f"📦 Installing dependencies (Pass 1: Generic & Isolated for Python {TARGET_PYTHON})...")
run_command(f"pip install --isolated --target {BUILD_DIR} -r requirements.txt")

print(f"📦 Installing dependencies (Pass 2: Linux-native binaries for Python {TARGET_PYTHON})...")
# Specifically overwrite binary packages with Linux-compatible versions
# We target 3.12 because 3.13 has ABI/symbol issues on Lambda currently.
# Including Brotli and zstandard to fix common Lambda import errors.
binary_packages = "psycopg2-binary sqlalchemy cryptography serverless-wsgi gunicorn Brotli zstandard"
pip_linux_cmd = (
    f"pip install --isolated --target {BUILD_DIR} "
    f"--platform manylinux2014_x86_64 --only-binary=:all: "
    f"--python-version {TARGET_PYTHON} --implementation cp --abi cp312 "
    f"--upgrade {binary_packages}"
)
run_command(pip_linux_cmd)

# 3. Copy Source Code
print("📄 Copying source code...")
shutil.copytree(SRC_DIR, os.path.join(BUILD_DIR, SRC_DIR), dirs_exist_ok=True)

# 4. Correct Zipping for Lambda
def zip_for_lambda(filename, target_dir):
    # Ensure filename is absolute or relative to where this script runs (backend root)
    abs_zip_path = os.path.abspath(filename)
    print(f"🤐 Zipping {target_dir} into {abs_zip_path}...")
    with zipfile.ZipFile(abs_zip_path, 'w', zipfile.ZIP_DEFLATED) as zip_obj:
        for root, dirs, files in os.walk(target_dir):
            for file in files:
                full_path = os.path.join(root, file)
                archive_name = os.path.relpath(full_path, target_dir)
                zip_obj.write(full_path, archive_name)

zip_for_lambda(ZIP_NAME, BUILD_DIR)
print(f"✅ Build complete: {os.path.abspath(ZIP_NAME)} created successfully.")
