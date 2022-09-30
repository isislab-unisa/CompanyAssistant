#1

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
