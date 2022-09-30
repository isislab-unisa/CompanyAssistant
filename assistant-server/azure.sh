resGroupName="companyTest"  #Update me
region=westeurope


echo "CREATING RESOURCE GROUP..."

az group create -l $region -n $resGroupName



echo "CREATING VIRTUAL NETWORK..."

az network vnet create -n Default-vnet -g $resGroupName --subnet-name default



echo "CREATING NETWORK SECURITY GROUP.."

az network nsg create -g $resGroupName -n Default-nsg

az network nsg rule create --resource-group $resGroupName --nsg-name Default-nsg --name ssh --protocol tcp --priority 300 --destination-port-range 22

az network nsg rule create --resource-group $resGroupName --nsg-name Default-nsg --name rdp --protocol tcp --priority 301 --destination-port-range 3389

az network nsg rule create --resource-group $resGroupName --nsg-name Default-nsg --name vnc --protocol tcp --priority 302 --destination-port-range 5901
