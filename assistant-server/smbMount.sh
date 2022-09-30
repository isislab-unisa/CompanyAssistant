#!/bin/bash
storageName=$1
username=$2
key=$3
address=$4

sudo apt-get -y install cifs-utils

sudo mkdir /mnt/$storageName
if [ ! -d "/etc/smbcredentials" ]; then
sudo mkdir /etc/smbcredentials
fi
if [ ! -f "/etc/smbcredentials/${storageName}.cred" ]; then
    sudo bash -c "echo \"username=${username}\">> /etc/smbcredentials/${storageName}storage.cred"
    sudo bash -c "echo \"password=${key}\" >> /etc/smbcredentials/${storageName}storage.cred"
fi
sudo chmod 600 /etc/smbcredentials/${storageName}storage.cred

sudo mount -t cifs ${address} /mnt/${storageName} -o vers=3.0,credentials=/etc/smbcredentials/${storageName}storage.cred,dir_mode=0777,file_mode=0777,serverino

head -c 5G /dev/urandom > 1.txt
