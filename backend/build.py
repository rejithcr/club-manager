import os
import shutil
import zipfile

src = "src/"
dir_dst = "build/"

src_files = os.listdir(src)

#cleanup
shutil.rmtree(dir_dst)
os.mkdir(dir_dst)
try:
    os.remove("main.zip")
except OSError:
    pass

os.system(f"pip install --target {dir_dst} -r requirements.txt");

shutil.copytree(src, dir_dst+src, dirs_exist_ok=True)

def zipfolder(filename, target_dir):
    zip_obj = zipfile.ZipFile(filename + '.zip', 'w', zipfile.ZIP_DEFLATED)
    root_len = len(target_dir)
    for base, dirs, files in os.walk(target_dir):
        for file in files:
            fn = os.path.join(base, file)
            zip_obj.write(fn, fn[root_len:])

zipfolder('app', dir_dst) #insert your variables here
