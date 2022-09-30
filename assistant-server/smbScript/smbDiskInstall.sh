#!/bin/bash
#2
# ./smbDiskInstall.sh lorenzo lorenzo /mnt/lorenzo
username=$1
password=$2
diskPath=$3

path=$diskPath/samba/$username

temp=$(mktemp)

#samba dir creation
sudo mkdir $diskPath/samba
sudo chgrp sambashare $diskPath/samba

#Ubunut user creation
sudo useradd -M -d $diskPath/samba/$username -s /usr/sbin/nologin -G sambashare $username
sudo mkdir $diskPath/samba/$username
sudo chown $username:sambashare $diskPath/samba/$username
sudo chmod 2770 $diskPath/samba/$username

#Smb user creation 
(echo "$password"; sleep 1; echo "$password" ) | sudo smbpasswd -s -a $username
sudo smbpasswd -e $username

#Smb configuraion

sudo echo "

[global]
   workgroup = WORKGROUP

    server string = %h server (Samba, Ubuntu)


   dns proxy = no

   log file = /var/log/samba/log.%m

   max log size = 1000

   syslog = 0

   panic action = /usr/share/samba/panic-action %d


   server role = standalone server

   passdb backend = tdbsam

   obey pam restrictions = yes

   unix password sync = yes


   passwd program = /usr/bin/passwd %u
   passwd chat = *Enter\snew\s*\spassword:* %n\n *Retype\snew\s*\spassword:* %n\n *password\supdated\ssuccessfully* .


   pam password change = yes

   map to guest = bad user



[$username]
    path = $path
    browseable = yes
    read only = no
    force create mode = 0660
    force directory mode = 2770
    valid users = $username

" > $temp

sudo cp $temp /etc/samba/smb.conf

#smb restart
sudo systemctl restart smbd
sudo systemctl restart nmbd

