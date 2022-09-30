

# How to install disk on cloud in general


#### first of all

```sh 
  sudo apt-get update 
  sudo apt-get -y install cifs-utils 
   
  # samba installation
  sudo apt install samba -y
  #ufw Config 
  sudo ufw allow 'Samba' 
```


#### then 
- execute file "smbmount.sh"



#### if you want to mount google storage

```sh 
  curl -L -O https://github.com/GoogleCloudPlatform/gcsfuse/releases/download/v0.39.2/gcsfuse_0.39.2_amd64.deb
  sudo dpkg --install gcsfuse_0.39.2_amd64.deb 
  rm gcsfuse_0.39.2_amd64.deb 
  sudo apt-get install realpath
```

#### create dir to mount storage
```sh 
  mkdir <yourdirname> 
  chmod 777 <yourdirname>
  gcsfuse --key-file <absoluteKeyFilePath> testmario <mountpath> 
```
