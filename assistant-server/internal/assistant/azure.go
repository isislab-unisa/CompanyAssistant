package assistant_aws

import (
	"bytes"
	b64 "encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"os"
	"server/internal/dao"
	"server/internal/model"
	notificationsystem "server/internal/notificationSystem"
	"strings"
	"time"

	"github.com/joho/godotenv"
	"github.com/tidwall/gjson"
	"go.mongodb.org/mongo-driver/bson"
)

type Assistant_azure struct{}

func (a *Assistant_azure) CreateVM(vm *model.Vm, account *bson.Raw) (string, error) {

	token, err := getToken(account)

	region := account.Lookup("region").StringValue()
	subId := account.Lookup("sub_id").StringValue()

	if err != nil {
		return "", errors.New("CreateVM_Azure: can not get token for auth: " + err.Error())
	}

	vmType, err := dao.GetVmTypeById(vm.VmType)

	if err != nil {
		return "", errors.New("CreateVM_Azure: can not get vm types for auth: " + err.Error())
	}

	resGroupName, err := createResourceGroup(token, vm.Name, region, subId)

	if err != nil {
		return "", errors.New("CreateVM_Azure: can not create resource group: " + err.Error())
	}

	err = createFromArmTemplate(token, *vm, vmType, resGroupName, subId)

	if err != nil {
		return "", errors.New("CreateVM_Azure: can not create resources: " + err.Error())
	}

	return vm.Id, nil

}

func (a *Assistant_azure) DeleteVM(vm model.Vm, account *bson.Raw) error {

	godotenv.Load()
	token, err := getToken(account)

	subId := account.Lookup("sub_id").StringValue()

	if err != nil {
		return errors.New("DeleteVM_Azure: can not get token for auth: " + err.Error())
	}

	err = delateResourceGroup(token, vm.Name, subId)

	if err != nil {
		return errors.New("DeleteVM_Azure: can not delete resource Group: " + err.Error())
	}
	return nil

}

func (a *Assistant_azure) StopVM(vm *model.Vm, account *bson.Raw) error {

	godotenv.Load()
	token, err := getToken(account)

	region := account.Lookup("region").StringValue()
	subId := account.Lookup("sub_id").StringValue()

	if err != nil {
		return errors.New("StopVM_Azure: can not get token for auth: " + err.Error())
	}

	err = powerOffVm(&token, &vm.Name, &region, &subId)

	if err != nil {
		return errors.New("StopVM_Azure: can not stop vm: " + err.Error())
	}
	return nil

}

func (a *Assistant_azure) StartVM(vm *model.Vm, account *bson.Raw) error {

	godotenv.Load()
	token, err := getToken(account)

	region := account.Lookup("region").StringValue()
	subId := account.Lookup("sub_id").StringValue()

	if err != nil {
		return errors.New("StopVM_Azure: can not get token for auth: " + err.Error())
	}

	err = powerOnVm(&token, &vm.Name, &region, &subId)

	if err != nil {
		return errors.New("StopVM_Azure: can not stop vm: " + err.Error())
	}
	return nil

}

func (a *Assistant_azure) CheckStatus(account *bson.Raw) error {

	godotenv.Load()
	_, err := getToken(account)
	return err

}

func (a *Assistant_azure) CreateStorage(storage *model.Storage, account *bson.Raw) (string, error) {

	token, err := getToken(account)

	region := account.Lookup("region").StringValue()
	subId := account.Lookup("sub_id").StringValue()

	if err != nil {
		return "", errors.New("CreateStorage_Azure: can not get token for auth: " + err.Error())
	}

	resGroupName, err := createResourceGroup(token, storage.Name, region, subId)

	if err != nil {
		return "", errors.New("CreateStorage_Azure: can not create resource group: " + err.Error())
	}

	err = createStorageFromArmTemplate(token, storage, resGroupName, subId)

	if err != nil {
		return "", errors.New("CreateStorage_Azure: can not create resources: " + err.Error())
	}

	return storage.Id, nil

}

func (a *Assistant_azure) DeleteStorage(storage *model.Storage, account *bson.Raw) error {

	godotenv.Load()
	token, err := getToken(account)

	subId := account.Lookup("sub_id").StringValue()

	if err != nil {
		return errors.New("DeleteStorage_Azure: can not get token for auth: " + err.Error())
	}

	err = delateResourceGroup(token, storage.Name, subId)

	if err != nil {
		return errors.New("DeleteStorage_Azure: can not delete resource Group: " + err.Error())
	}
	return nil
}

func getToken(account *bson.Raw) (string, error) {

	godotenv.Load()

	body := url.Values{}
	body.Add("client_id", account.Lookup("client_id").StringValue())
	body.Add("client_secret", account.Lookup("client_secret").StringValue())
	body.Add("grant_type", "client_credentials")
	body.Add("scope", os.Getenv("AZURE_SCOPE"))

	resp, err := http.Post("https://login.microsoftonline.com/"+account.Lookup("tenant").StringValue()+"/oauth2/v2.0/token", "application/x-www-form-urlencoded", strings.NewReader(body.Encode()))
	if err != nil {
		return "", errors.New("Can not do request for get azure token: " + err.Error())
	}

	defer resp.Body.Close()

	if resp.StatusCode < 200 && resp.StatusCode > 299 {
		stringStatuscode := fmt.Sprintf("%d", resp.StatusCode)
		return "", errors.New("getToken: statusCode: " + stringStatuscode)
	}

	var objmap map[string]interface{}
	respBody, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		return "", errors.New("Can not read request for get azure token: " + err.Error())
	}

	if err := json.Unmarshal(respBody, &objmap); err != nil {
		return "", errors.New("Can not unmarshal request for get azure token: " + err.Error())
	}

	fmt.Println(string(respBody))

	if val, ok := objmap["error"]; ok {
		stringErr := fmt.Sprintf("%s", val)
		return "", errors.New(string(stringErr))
	}

	token := fmt.Sprintf("%s", objmap["access_token"])
	return token, nil

}

func createResourceGroup(token, vmName, region, subId string) (string, error) {

	var jsonStr = []byte(`{
		location: "` + region + `"
	}`)

	url := "https://management.azure.com/subscriptions/" + subId + "/resourceGroups/" + vmName + "_resGroup?api-version=2021-04-01"

	req, err := http.NewRequest("PUT", url, bytes.NewBuffer(jsonStr))
	if err != nil {

		return "", err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 && resp.StatusCode > 299 {
		stringStatuscode := fmt.Sprintf("%d", resp.StatusCode)
		return "", errors.New("createResourceGroup: statusCode: " + stringStatuscode)
	}

	var objmap map[string]interface{}
	respBody, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		return "", errors.New("Can not read request for create azure vm : " + err.Error())
	}

	if err := json.Unmarshal(respBody, &objmap); err != nil {
		return "", errors.New("Can not unmarshal request for create azure vm " + err.Error())
	}

	if val, ok := objmap["error"]; ok {
		stringErr := fmt.Sprintf("%s", val)
		return "", errors.New(string(stringErr))
	}
	return vmName + "_resGroup", nil

}

func delateResourceGroup(token string, name string, subId string) error {

	var jsonStr = []byte(``)

	url := "https://management.azure.com/subscriptions/" + subId + "/resourceGroups/" + name + "_resGroup?api-version=2021-04-01"

	req, err := http.NewRequest("DELETE", url, bytes.NewBuffer(jsonStr))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 && resp.StatusCode > 299 {
		stringStatuscode := fmt.Sprintf("%d", resp.StatusCode)
		return errors.New("delateResourceGroup: statusCode: " + stringStatuscode)
	}

	var objmap map[string]interface{}
	respBody, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		return errors.New("Can not read request for create azure vm : " + err.Error())
	}

	if len(respBody) != 0 {

		if err := json.Unmarshal(respBody, &objmap); err != nil {
			return errors.New("Can not unmarshal request for create azure vm " + err.Error())
		}

		if val, ok := objmap["error"]; ok {
			stringErr := fmt.Sprintf("%s", val)
			return errors.New(string(stringErr))
		}
	}

	return nil

}

func createFromArmTemplate(token string, vm model.Vm, vmType bson.Raw, resGroupName, subId string) error {

	contentArm, err := ioutil.ReadFile("arm.json")

	if err != nil {
		return err
	}

	contentCommand, err := ioutil.ReadFile("init.sh")

	if err != nil {
		return err
	}

	stringArm := string(contentArm)
	stringCommand := string(contentCommand)
	command := strings.Replace(stringCommand, "vmName", vm.Name, -1)
	command = strings.Replace(command, "serverIp", os.Getenv("SERVER_EXSTERNAL_URL"), -1)
	commandB64 := b64.StdEncoding.EncodeToString([]byte(command))

	var jsonStr = []byte(`{
							properties: {
								mode: "Incremental",
								template: {
									$schema: "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json",
									contentVersion: "1.0.0.0",
									parameters: {
										location: {
											type: "string",
											defaultValue: "[resourceGroup().location]",
											metadata: {
												description: "Location for all resources."
											}
										}
									},
									variables: {
										subId: "` + subId + `",
										vmName: "` + vm.Name + `",
										vmType: "` + vmType.Lookup("instanceType").StringValue() + `",
										image: "` + vmType.Lookup("image").StringValue() + `",
										username: "` + vm.Username + `",
										password: "` + vm.Password + `",
										command: "` + commandB64 + `",
									},
									resources: ` + stringArm + `
								}
							}
						}`)

	url := "https://management.azure.com/subscriptions/" + subId + "/resourceGroups/" + resGroupName + "/providers/Microsoft.Resources/deployments/primo?api-version=2020-10-01"

	req, err := http.NewRequest("PUT", url, bytes.NewBuffer(jsonStr))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 && resp.StatusCode > 299 {
		stringStatuscode := fmt.Sprintf("%d", resp.StatusCode)
		return errors.New("createFromArmTemplate: statusCode: " + stringStatuscode)
	}

	var objmap map[string]interface{}
	respBody, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		return errors.New("Can not read request for create azure vm : " + err.Error())
	}

	if err := json.Unmarshal(respBody, &objmap); err != nil {
		return errors.New("Can not unmarshal request for create azure vm " + err.Error())
	}

	if val, ok := objmap["error"]; ok {
		stringErr := fmt.Sprintf("%s", val)
		return errors.New(string(stringErr))
	}

	storages, err := dao.GetStorageByTags(vm.Tags)
	if err != nil {

		return nil

	}

	for _, storage := range storages {
		message := `{
			"actionType": "createStorage",
			"name": "` + storage.Name + `",
			"key": "` + storage.Key + `"
		}`
		notificationsystem.SendMessageOnAQueue(vm.Name, message)
	}

	return nil

}

func powerOffVm(token, vmName, region, subId *string) error {

	var jsonStr = []byte(`{
		location: "` + *region + `"
	}`)

	url := "https://management.azure.com/subscriptions/" + *subId + "/resourceGroups/" + *vmName + "_resGroup/providers/Microsoft.Compute/virtualMachines/" + *vmName + "/powerOff?api-version=2021-04-01"

	fmt.Println(url)

	req, err := http.NewRequest("PUT", url, bytes.NewBuffer(jsonStr))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+*token)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 && resp.StatusCode > 299 {
		stringStatuscode := fmt.Sprintf("%d", resp.StatusCode)
		return errors.New("powerOffVM: statusCode: " + stringStatuscode)
	}

	var objmap map[string]interface{}
	respBody, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		return errors.New("powerOffVM: Can not read response: " + err.Error())
	}

	if err := json.Unmarshal(respBody, &objmap); err != nil {
		return errors.New("powerOffVM: Can not unmarshal response " + err.Error())
	}

	if val, ok := objmap["error"]; ok {
		stringErr := fmt.Sprintf("%s", val)
		return errors.New(string(stringErr))
	}

	fmt.Println("power OFF Vm")

	return nil

}

func powerOnVm(token, vmName, region, subId *string) error {

	var jsonStr = []byte(`{
		location: "` + *region + `"
	}`)

	url := "https://management.azure.com/subscriptions/" + *subId + "/resourceGroups/" + *vmName + "_resGroup/providers/Microsoft.Compute/virtualMachines/" + *vmName + "/start?api-version=2021-04-01"

	req, err := http.NewRequest("PUT", url, bytes.NewBuffer(jsonStr))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+*token)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 && resp.StatusCode > 299 {
		stringStatuscode := fmt.Sprintf("%d", resp.StatusCode)
		return errors.New("powerOffVM: statusCode: " + stringStatuscode)
	}

	var objmap map[string]interface{}
	respBody, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		return errors.New("powerOffVM: Can not read response: " + err.Error())
	}

	if err := json.Unmarshal(respBody, &objmap); err != nil {
		return errors.New("powerOffVM: Can not unmarshal response " + err.Error())
	}

	if val, ok := objmap["error"]; ok {
		stringErr := fmt.Sprintf("%s", val)
		return errors.New(string(stringErr))
	}
	return nil
}

func createStorageFromArmTemplate(token string, storage *model.Storage, resGroupName, subId string) error {

	contentArm, err := ioutil.ReadFile("storageArm.json")

	if err != nil {
		return err
	}

	stringArm := string(contentArm)

	var jsonStr = []byte(`{
							properties: {
								mode: "Incremental",
								template: {
									$schema: "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json",
									contentVersion: "1.0.0.0",
									parameters: {
										location: {
											type: "string",
											defaultValue: "[resourceGroup().location]",
											metadata: {
												description: "Location for all resources."
											}
										}
									},
									variables: {
										subId: "` + subId + `",
										storageName: "` + storage.Name + `",
										size: "` + storage.Size + `",
									},
									resources: ` + stringArm + `
								}
							}
						}`)

	url := "https://management.azure.com/subscriptions/" + subId + "/resourceGroups/" + resGroupName + "/providers/Microsoft.Resources/deployments/primo?api-version=2020-10-01"

	req, err := http.NewRequest("PUT", url, bytes.NewBuffer(jsonStr))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 && resp.StatusCode > 299 {
		stringStatuscode := fmt.Sprintf("%d", resp.StatusCode)
		return errors.New("createFromArmTemplate: statusCode: " + stringStatuscode)
	}

	var objmap map[string]interface{}
	respBody, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		return errors.New("Can not read request for create azure vm : " + err.Error())
	}

	if err := json.Unmarshal(respBody, &objmap); err != nil {
		return errors.New("Can not unmarshal request for create azure vm " + err.Error())
	}

	fmt.Println(string(respBody))

	if val, ok := objmap["error"]; ok {
		stringErr := fmt.Sprintf("%s", val)
		return errors.New(string(stringErr))
	}

	storageName := storage.Name + "storage"

	exist, _ := checkStorageExistence(&token, &resGroupName, &storageName, &subId)
	i := 1
	for !exist {
		fmt.Print("Non esiste")
		if i > 10 {
			return errors.New("time out, storage doesn't exist")
		}
		exist, _ = checkStorageExistence(&token, &resGroupName, &storageName, &subId)
		time.Sleep(time.Duration(5*i) * time.Second)

	}

	fmt.Print("Esiste")
	key, err := listStorageKeys(&token, &resGroupName, &storageName, &subId)
	if err != nil {
		return errors.New("Can get key of storage: " + err.Error())
	}

	fmt.Print("Key, " + key)

	vms, err := dao.GetVmsByTags(storage.Tags)
	if err != nil {

		return nil

	}
	storage.Key = key

	message := `{
		"actionType": "createStorage",
		"name": "` + storage.Name + `",
		"key": "` + key + `"
	}`

	for _, vm := range vms {
		notificationsystem.SendMessageOnAQueue(vm.Name, message)
	}

	return nil

}

func listStorageKeys(token, resGroupName, accountName, subId *string) (string, error) {

	var jsonStr = []byte(``)

	url := "https://management.azure.com/subscriptions/" + *subId + "/resourceGroups/" + *resGroupName + "/providers/Microsoft.Storage/storageAccounts/" + *accountName + "/listKeys?api-version=2021-04-01"

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonStr))
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+*token)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 && resp.StatusCode > 299 {
		stringStatuscode := fmt.Sprintf("%d", resp.StatusCode)
		return "", errors.New("listStorageKeys: statusCode: " + stringStatuscode)
	}

	var objmap map[string]interface{}
	respBody, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		return "", errors.New("listStorageKeys: Can not read response: " + err.Error())
	}

	if err := json.Unmarshal(respBody, &objmap); err != nil {
		return "", errors.New("listStorageKeys: Can not unmarshal response " + err.Error())
	}

	fmt.Println(string(respBody))

	if val, ok := objmap["error"]; ok {
		stringErr := fmt.Sprintf("%s", val)
		return "", errors.New(string(stringErr))
	}

	key := gjson.Get(string(respBody), "keys.0.value").String()

	fmt.Println("KEY: " + key)

	return key, nil
}

func checkStorageExistence(token, resGroupName, accountName, subId *string) (bool, error) {

	var jsonStr = []byte(``)

	url := "https://management.azure.com/subscriptions/" + *subId + "/resourceGroups/" + *resGroupName + "/providers/Microsoft.Storage/storageAccounts/" + *accountName + "?api-version=2021-04-01"

	req, err := http.NewRequest("GET", url, bytes.NewBuffer(jsonStr))
	if err != nil {
		return false, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+*token)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return false, err
	}
	defer resp.Body.Close()
	fmt.Println(resp.StatusCode)
	if resp.StatusCode == 404 {
		return false, nil
	}
	if resp.StatusCode < 200 && resp.StatusCode > 299 {
		stringStatuscode := fmt.Sprintf("%d", resp.StatusCode)
		return false, errors.New("checkStorageExistence: statusCode: " + stringStatuscode)
	}

	respBody, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		return false, errors.New("listStorageKeys: Can not read response: " + err.Error())
	}

	provisioningState := gjson.Get(string(respBody), "properties.provisioningState").String()

	if provisioningState == "Succeeded" {
		return true, nil
	}

	return false, nil
}
