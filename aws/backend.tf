terraform {
  backend "s3" {
    bucket = "ccm-common-storage"
    key    = "tf.state"
    region = "ap-south-1"
  }
}

