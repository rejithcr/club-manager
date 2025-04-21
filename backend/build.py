import os
import shutil
import zipfile

src = "./"
dir_dst = "build/"

src_files = os.listdir(src)

#cleanup
#shutil.rmtree(dir_dst)
os.mkdir(dir_dst)
os.remove("main.zip")

#os.system(f"pip install --target {dir_dst} -r requirements.txt");


for file_name in src_files:
    if file_name.endswith('.py') \
        and not file_name.endswith('.zip') \
        and not file_name.endswith('build1.py') \
        and not file_name.endswith('test.py'):
        print(file_name)
        shutil.copy(file_name, dir_dst)
    

def zipfolder(foldername, target_dir):            
    zipobj = zipfile.ZipFile(foldername + '.zip', 'w', zipfile.ZIP_DEFLATED)
    rootlen = len(target_dir) 
    for base, dirs, files in os.walk(target_dir):
        for file in files:
            fn = os.path.join(base, file)
            zipobj.write(fn, fn[rootlen:])

zipfolder('main', dir_dst) #insert your variables here
