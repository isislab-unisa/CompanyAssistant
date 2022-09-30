#1
#Formatta il disco nel FileSystem indicato e lo monta nel path specificato
drive=$1
fs_type=$2
diskname=$3

#./ifFormatted.sh /dev/sdb ext4 lorenzo

if [[ ! -z $drive ]]; then
    if [[ ! -z $fs_type ]]; then
        if [[ ! -z $diskname ]]; then
            current_fs=$(lsblk -no KNAME,FSTYPE $drive)
            mountPath="/mnt/${diskname}"
            if [[ $(echo $current_fs | wc -w) == 1 ]]; then
                echo "[INFO] '$drive' is not formatted. Formatting."

                sudo mkdir ${mountPath}
                sudo chmod 777 ${mountPath}

                echo "y" | sudo mkfs.ext4 -m 0 -E lazy_itable_init=0,lazy_journal_init=0,discard $drive

                sudo mount $drive $mountPath

                sudo bash -c "echo \"${drive} ${mountPath} ext4 default 0 0 \" >> /etc/fstab"
            else
                current_fs=$(echo $current_fs | awk '{print $2}')

                if [[ $current_fs == $fs_type ]]; then
                    echo "[INFO] '$drive' is formatted with correct fs type. Moving on."
                    sudo mkdir ${mountPath}
                    sudo chmod 777 ${mountPath}

                    sudo mount $drive $mountPath

                    sudo bash -c "echo \"${drive} ${mountPath} ext4 default 0 0 \" >> /etc/fstab"
                else
                    echo "[WARN] '$drive' is formatted, but with wrong fs type '$current_fs'. Formatting."
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
fi
