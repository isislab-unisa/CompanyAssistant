#!/bin/bash

username=$1
password=$2
diskPath=$3

path=$diskPath/samba/$username


#samba dir creation
if [ ! -d "${diskPath}/samba" ]; then
 sudo mkdir $diskPath/samba
 sudo chgrp sambashare $diskPath/samba
fi

#Ubunut user creation
sudo useradd -M -d $diskPath/samba/$username -s /usr/sbin/nologin -G sambashare $username
sudo mkdir $diskPath/samba/$username
sudo chown $username:sambashare $diskPath/samba/$username
sudo chmod 2770 $diskPath/samba/$username

#Smb user creation 
(echo "$password"; sleep 1; echo "$password" ) | sudo smbpasswd -s -a $username
sudo smbpasswd -e $username

#Smb configuraion

sudo bash -c " echo \"
[$username]
    path = $path
    browseable = yes
    read only = no
    force create mode = 0660
    force directory mode = 2770
    valid users = $username \"  >> /etc/samba/smb.conf"
#smb restart
sudo systemctl restart smbd
sudo systemctl restart nmbd

