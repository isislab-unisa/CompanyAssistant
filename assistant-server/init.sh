#!/bin/bash

sudo mkdir /etc/companyAssistant
sudo chmod 755 companyAssistant/


echo '#!/bin/bash

ip=$(curl -s http://checkip.amazonaws.com || printf "0.0.0.0")
while : ;do
    sleep 5
    ip=$(curl -s http://checkip.amazonaws.com || printf "0.0.0.0")
    echo $ip
    if [[ $ip != "unavailable" ]]; then
    break
    fi
done

curl serverIp/api/v1/vms/assignIp/$ip/vmName

echo "ok" >> /logOnRun' > onRun

echo '
#!/bin/bash
storageName=$1
key=$2

sudo mkdir /mnt/$storageName
if [ ! -d "/etc/smbcredentials" ]; then
sudo mkdir /etc/smbcredentials
fi
if [ ! -f "/etc/smbcredentials/${storageName}.cred" ]; then
    sudo bash -c "echo \"username=${storageName}storage\">> /etc/smbcredentials/${storageName}storage.cred"
    sudo bash -c "echo \"password=${key}\" >> /etc/smbcredentials/${storageName}storage.cred"
fi/et
sudo chmod 600 /etc/smbcredentials/${storageName}storage.cred

sudo bash -c "echo \"//${storageName}storage.file.core.windows.net/${storageName} /mnt/${storageName} cifs nofail,vers=3.0,credentials=/etc/smbcredentials/${storageName}storage.cred,dir_mode=0777,file_mode=0777,serverino\" >> /etc/fstab"
sudo mount -t cifs //${storageName}storage.file.core.windows.net/${storageName} /mnt/${storageName} -o vers=3.0,credentials=/etc/smbcredentials/${storageName}storage.cred,dir_mode=0777,file_mode=0777,serverino

' > mount.sh

echo '/home' > /etc/companyAssistant/backup_config.conf  

echo '
#!/bin/bash
input="/etc/companyAssistant/backup_config.conf"
sudo zip -r /mnt/$1/backup_$(hostname)_$(date +"%m-%d-%y_%H-%M-%S").zip $(cat $input)
python3 /sendMessage.py main "{\"actionType\":\"backupCompleted\", \"name\":\"$(hostname)\", \"storage\":\"$1\"}"
' > /etc/companyAssistant/backup.sh

echo '
#!/usr/bin/env python
import sys,pika

credentials = pika.PlainCredentials("guest", "Lorenzo98!")
connection = pika.BlockingConnection(pika.ConnectionParameters(host="93.41.148.169",credentials=credentials))
channel = connection.channel()

channel.queue_declare(queue=str(sys.argv[1]))

channel.basic_publish(exchange="", routing_key=str(sys.argv[1]), body=str(sys.argv[2]))
connection.close()
' > /etc/companyAssistant/sendMessage.py



echo '#!/usr/bin/env python
import pika, sys, os, json



def main():
    file = open("/etc/companyAssistant/log/log.txt","a+")
    credentials = pika.PlainCredentials("guest", "Lorenzo98!")
    connection = pika.BlockingConnection(pika.ConnectionParameters(host="93.41.148.169",credentials=credentials))
    channel = connection.channel()

    channel.queue_declare(queue=str(sys.argv[1]))

    def callback(ch, method, properties, body):
        message =  body.decode(encoding="UTF-8")
        jsonMessage = json.loads(message)
      
        print(" [x] " + message)
        file.write(" [x] Received %r\n" + message)
        file.flush()
        if jsonMessage["actionType"] == "createStorage":
            os.system("./mount.sh "+jsonMessage["name"]+" "+jsonMessage["key"])
        if jsonMessage["actionType"] == "backup":
            os.system("./backup.sh "+jsonMessage["name"])
        if jsonMessage["actionType"] == "attachStorage":
            os.system("./backup.sh "+jsonMessage["name"])
       
        

    channel.basic_consume(queue=str(sys.argv[1]), on_message_callback=callback, auto_ack=True)

    print("[*] Waiting for messages. To exit press CTRL+C")
    channel.start_consuming()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("Interrupted")
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)'> /etc/companyAssistant/companyAssistantClient.py




echo '
diskname=$1
mountPath="/mnt/${diskname}"

sudo mkdir ${mountPath}
sudo chmod 777 ${mountPath}

echo "y"|sudo mkfs.ext4 -m 0 -E lazy_itable_init=0,lazy_journal_init=0,discard $diskname

sudo mount $diskname $mountPath 

sudo bash -c "echo \"${diskname} ${mountPath} ext4 default 0 0 \" >> /etc/fstab"
' > /etc/companyAssistant/formatAndMountDisk.sh

echo '
#!/bin/bash

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
sudo systemctl restart nmbd' > /etc/companyAssistant/smbDiskInstall.sh


echo '
drive=$1
fs_type=$2
diskname=$3

if [[ ! -z $drive ]]; then
    if [[ ! -z $fs_type ]]; then
        if [[ ! -z $diskname ]]; then
            current_fs=$(lsblk -no KNAME,FSTYPE $drive)
            mountPath="/mnt/${diskname}"
            if [[ $(echo $current_fs | wc -w) == 1 ]]; then
                echo "[INFO] $drive is not formatted. Formatting."

                sudo mkdir ${mountPath}
                sudo chmod 777 ${mountPath}

                echo "y" | sudo mkfs.ext4 -m 0 -E lazy_itable_init=0,lazy_journal_init=0,discard $drive

                sudo mount $drive $mountPath

                sudo bash -c "echo \"${drive} ${mountPath} ext4 default 0 0 \" >> /etc/fstab"
            else
                current_fs=$(echo $current_fs | awk "{print $2}")

                if [[ $current_fs == $fs_type ]]; then
                    echo "[INFO] $drive is formatted with correct fs type. Moving on."
                    sudo mkdir ${mountPath}
                    sudo chmod 777 ${mountPath}

                    sudo mount $drive $mountPath

                    sudo bash -c "echo \"${drive} ${mountPath} ext4 default 0 0 \" >> /etc/fstab"
                else
                    echo "[WARN] $drive is formatted, but with wrong fs type $current_fs. Formatting."
                fi
            fi
        else
            echo "[WARN] is_formatted() was called without specifying diskname. Formatting."
        fi
    else
        echo "[WARN] is_formatted() was called without specifying fs_type. Formatting."
    fi
else
    echo "[FATAL] is_formatted() was called without specifying a drive. Quitting."
fi' > /etc/companyAssistant/ifFormatted.sh

echo '
username=$1
password=$2
diskname=$3
id=$(ls -lart /dev/disk/by-id/google-storage | sed 's|.*/||')
drive=/dev/$id
echo $drive
if [[ ! -z $username ]]; then
    if [[ ! -z $password ]]; then
        if [[ ! -z $diskname ]]; then
            ./ifFormatted.sh $drive ext4 $diskname
            ./smbDiskInstall.sh $username $password /mnt/$diskname

        else
            echo "[FATAL]  was called without specifying diskname. Quitting."
        fi
    else
        echo "[FATAL]  was called without specifying password. Quitting."
    fi
else
    echo "[FATAL] was called without specifying username. Quitting."
fi
' > /etc/companyAssistant/diskAttached.sh


mkdir ciao

sudo touch /logOnRun



sudo chmod 777 /logOnRun

sudo chmod 777 mount.sh

sudo chmod 777 backup.sh 

chmod 777 onRun

echo '#!/bin/bash
/onRun' >> /etc/rc.local

chmod 755 /etc/rc.local

mkdir okokokok

sudo apt-get update

sudo apt-get install xrdp -y

sudo systemctl enable xrdp

sudo ufw allow from any port 3389 proto tcp

sudo apt-get update

#sudo DEBIAN_FRONTEND=noninteractive apt install xubuntu-desktop -y

#sudo apt install xfce4-session -y

sudo adduser --gecos "" --disabled-password vmUser

sudo chpasswd <<<"vmUser:userPassword"

sudo adduser vmUser sudo

sudo adduser vmUser ssl-cert

#echo xfce4-session >/home/vmUser/.xsession

#sudo service xrdp restart

sudo apt install -y zip 

sudo mkdir /home/ca
sudo mkdir /etc/companyAssistant/log
sudo touch /etc/companyAssistant/log/log.txt
sudo chmod -R 777 /etc/companyAssistant
sudo chmod 777 /etc/companyAssistant/log/log.txt


sudo apt-get -y install python3.8
sudo apt-get -y install python3-pip
pip3 install pika

python3 /etc/companyAssistant/companyAssistantClient.py vmName >> logFileCA &

sudo apt-get -y install cifs-utils

#Samba installation
sudo apt install samba -y

#ufw Config
sudo ufw allow 'Samba'

mkdir FINITO

/onRun


#sudo shutdown now
