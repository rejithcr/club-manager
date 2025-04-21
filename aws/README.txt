
sudo yum install -y yum-utils shadow-utils
sudo yum-config-manager --add-repo https://rpm.releases.hashicorp.com/AmazonLinux/hashicorp.repo
sudo yum -y install terraform



aws s3 sync . s3://ccm-common-storage/tf-src/ --exclude '.terraform/*' 


aws s3 sync s3://ccm-common-storage/tf-src/ . 

