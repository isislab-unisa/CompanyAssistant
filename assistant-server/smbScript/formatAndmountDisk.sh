diskname=$1
mountPath=$2

echo "y"|sudo mkfs.ext4 -m 0 -E lazy_itable_init=0,lazy_journal_init=0,discard $diskname

sudo mount $diskname $mountPath 

sudo bash -c "echo \"${diskname} ${mountPath} ext4 default 0 0 \" >> /etc/fstab"
