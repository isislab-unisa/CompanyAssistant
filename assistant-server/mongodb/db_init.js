
db.users.insert({
    "username": "admin",
    "name": "admin",
    "lastname": "admin",
    "password": "$2a$05$qrCsUZ2vMZdNIeyqP31iCe9BX/U.W0K8k76z5Qslhk9Hmo8dBRkF2",
    "type": "admin",
    "role": "admin"
});

db.groups.insert({
    "name": "admin",
    "tags": ["test"],
    "users": ["admin"]
});

db.roles.insert({
    "name": "admin",
    "policies": ["CreateVm", "DeleteVm", "UpdateVm", "UseVm", "CreateStorage", "UpdateStorage", "DeleteStorage", "CreateGroup", "DeleteGroup", "UpdateGroup", "CreateUser", "DeleteUser", "UpdateUser", "CreateProviderAccount", "DeleteProviderAccount", "UpdateProviderAccount"],
});

db.providerAccounts.insert({
    "provider": "aws",
    "access_key": "REPLACE",
    "secret_access_key": "REPLACE",
    "session_token": "REPLACE",
    "key_pair": "REPLACE",
    "region": "us-east-1",
    "name": "awsTEST"
});

db.providerAccounts.insert({
    "provider":"azure",
    "name":"AzureTEST",
    "sub_id":"REPLACE",
    "tenant":"REPLACE",
    "region":"westeurope",
    "client_id":"REPLACE",
    "client_secret":"REPLACE"
});

db.providerAccounts.insert({
    "provider":"google",
    "region":"europe-central2-b",
    "name":"GoogleTEST",
    "project_id":"REPLACE"
});


db.vmTypes.insert({
    "id": "ubuntu_aws_t2.micro",
    "provider": "aws",
    "os": "ubuntu",
    "image": "ami-09e67e426f25ce0d7",
    "instanceType": "t2.micro",
    "size": "1 vCPU 1 GB"
});

db.vmTypes.insert({
    "id": "ubuntu_aws_t2.medium",
    "provider": "aws",
    "os": "ubuntu",
    "image": "ami-09e67e426f25ce0d7",
    "instanceType": "t2.medium",
    "size": "2_vCPU_4_GB"
});

db.vmTypes.insert({
    "id": "ubuntu_azure_Standard_B1s",
    "provider": "azure",
    "os": "ubuntu",
    "image": "UbuntuServer",
    "instanceType": "Standard_B1s",
    "size": "1 vCPU 1 GB"
});

db.vmTypes.insert({
    "id": "ubuntu_azure_Standard_B2s",
    "provider": "azure",
    "os": "ubuntu",
    "image": "UbuntuServer",
    "instanceType": "Standard_B2s",
    "size": "2 vCPU 4 GB"
});

db.vmTypes.insert({
    "id": "ubuntu_google_e2-medium",
    "provider": "google",
    "os": "ubuntu",
    "image": "projects/ubuntu-os-cloud/global/images/ubuntu-1804-bionic-v20220131",
    "instanceType": "e2-medium",
    "size": "2 vCPU 4 GB"
});

db.vmTypes.insert({
    "id": "ubuntu_google_e2-micro",
    "provider": "google",
    "os": "ubuntu",
    "image": "projects/ubuntu-os-cloud/global/images/ubuntu-1804-bionic-v20220131",
    "instanceType": "e2-micro",
    "size": "2 vCPU 1 GB"
});

db.providerParameters.insert({
    "name": "aws",
    "parameters": ["region", "access_key", "secret_access_key", "session_token", "key_pair"]
});

db.providerParameters.insert({
    "name": "azure",
    "parameters": ["client_id", "client_secret", "tenant", "region", "sub_id"]
});

db.providerParameters.insert({
    "name": "google",
    "parameters": ["service_agent_credentials", "region", "projectID"]
});



db.policies.insert({
    "name": "CreateVm",
    "action": "create",
    "resourceType": "vms"
});

db.policies.insert({
    "name": "DeleteVm",
    "action": "delete",
    "resourceType": "vms"
});

db.policies.insert({
    "name": "UpdateVm",
    "action": "update",
    "resourceType": "vms"
});

db.policies.insert({
    "name": "UseVm",
    "action": "use",
    "resourceType": "vms"
});

db.policies.insert({
    "name": "CreateStorage",
    "action": "create",
    "resourceType": "storage"
});

db.policies.insert({
    "name": "DeleteStorage",
    "action": "delete",
    "resourceType": "storage"
});

db.policies.insert({
    "name": "UpdateStorage",
    "action": "update",
    "resourceType": "storage"
});


db.policies.insert({
    "name": "CreateGroup",
    "action": "create",
    "resourceType": "groups"
});

db.policies.insert({
    "name": "DeleteGroup",
    "action": "delete",
    "resourceType": "groups"
});

db.policies.insert({
    "name": "UpdateGroup",
    "action": "update",
    "resourceType": "groups"
});

db.policies.insert({
    "name": "CreateUser",
    "action": "create",
    "resourceType": "users"
});

db.policies.insert({
    "name": "DeleteUser",
    "action": "delete",
    "resourceType": "users"
});

db.policies.insert({
    "name": "UpdateUser",
    "action": "update",
    "resourceType": "users"
});

db.policies.insert({
    "name": "CreateProviderAccount",
    "action": "create",
    "resourceType": "providerAccounts"
});

db.policies.insert({
    "name": "DeleteProviderAccount",
    "action": "delete",
    "resourceType": "providerAccounts"
});

db.policies.insert({
    "name": "UpdateProviderAccount",
    "action": "update",
    "resourceType": "providerAccounts"
});


db.tags.insert({
    "name": "science",
});
db.tags.insert({
    "name": "graphics",
});




