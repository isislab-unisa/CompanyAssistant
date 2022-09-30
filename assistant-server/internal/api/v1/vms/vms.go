package vms

import (
	"encoding/json"
	"errors"
	"fmt"
	"server/internal/accessManagment"
	"server/internal/action"
	"server/internal/api/v1/tags"
	assistant_aws "server/internal/assistant"
	"server/internal/controller"
	"server/internal/dao"
	"server/internal/model"
	notificationsystem "server/internal/notificationSystem"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
)

const resourceType = "vms"

func CreateVm(c *fiber.Ctx) fiber.Map {

	bearerToken := string(c.Request().Header.Peek("Authorization"))

	var vm model.Vm
	vm.VmType = c.Params("vmType")
	vm.Name = c.Params("name")
	vm.Username = c.FormValue("username")
	vm.Password = c.FormValue("password")
	vm.Account = c.FormValue("account")

	var a_tags []string
	stringTags := c.FormValue("tags")
	json.Unmarshal([]byte(stringTags), &a_tags)
	vm.Tags = a_tags

	user, err := controller.VerifyUser(bearerToken)

	if err != nil {

		return fiber.Map{
			"error": err.Error(),
		}

	}

	permission, _ := accessManagment.CheckPermission(&user, action.CREATE, resourceType)

	if permission {
		err := tags.InsertTags(vm.Tags)

		if err != nil {

			return fiber.Map{
				"error": err.Error() + " while inserting tags",
			}

		}

		idVm, err := createVm(vm)

		if err != nil {
			c.Response().SetStatusCode(500)
			return fiber.Map{
				"error": err.Error(),
			}

		}
		return fiber.Map{
			"status": "Macchina creata",
			"Vm": fiber.Map{

				"id": idVm,
			},
		}
	} else {

		c.Response().SetStatusCode(405)

		return fiber.Map{
			"error": "not authorized",
		}

	}

}

func DeleteVm(c *fiber.Ctx) fiber.Map {

	bearerToken := string(c.Request().Header.Peek("Authorization"))

	user, err := controller.VerifyUser(bearerToken)

	if err != nil {

		return fiber.Map{
			"error": err.Error(),
		}

	}

	vm, err := dao.GetVmsByName(c.Params("name"))
	if err != nil {
		c.Response().SetStatusCode(500)
		return fiber.Map{
			"error": err.Error(),
		}
	}

	if len(vm) <= 0 {
		return fiber.Map{
			"status": "vm doesn't exist",
		}
	}

	access, _ := accessManagment.CheckAccess(&user, resourceType, vm[0].Resource.Id)
	permission, _ := accessManagment.CheckPermission(&user, action.DELETE, resourceType)

	if permission && access {
		err = deleteVm(vm[0])

		if err != nil {
			c.Response().SetStatusCode(500)
			return fiber.Map{
				"error": err.Error(),
			}

		}

		return fiber.Map{
			"status": "Macchina eliminata",
		}
	}

	c.Response().SetStatusCode(405)

	return fiber.Map{
		"error": "not authorized",
	}
}

func GetVms(c *fiber.Ctx) fiber.Map {

	bearerToken := string(c.Request().Header.Peek("Authorization"))

	user, err := controller.VerifyUser(bearerToken)

	if err != nil {

		return fiber.Map{
			"error": err.Error(),
		}

	}

	if user.Type == "admin" {
		result, err := dao.GetAllVms()
		if err != nil {

			return fiber.Map{
				"error": err.Error(),
			}

		}

		return fiber.Map{
			"vms": result,
		}
	}

	groups, err := dao.GetGroupByListNames(user.Groups)

	if err != nil {

		return fiber.Map{
			"error": err.Error(),
		}

	}

	var tags []string

	for _, group := range groups {
		for _, tag := range group.Tags {
			if !contains(tags, tag) {
				tags = append(tags, tag)
			}
		}
	}

	allVms, err := dao.GetVmsByTags(tags)

	if err != nil {
		c.Response().SetStatusCode(500)
		return fiber.Map{
			"error": err,
		}

	}

	return fiber.Map{
		"vms": allVms,
	}
}

func UseVm(c *fiber.Ctx) fiber.Map {

	bearerToken := string(c.Request().Header.Peek("Authorization"))

	user, err := controller.VerifyUser(bearerToken)

	if err != nil {

		return fiber.Map{
			"error": err.Error(),
		}

	}

	vms, err := dao.GetVmsByName(c.Params("vmName"))

	if err != nil {
		c.Response().SetStatusCode(500)
		return fiber.Map{
			"error": err.Error(),
		}
	}

	if len(vms) <= 0 {
		return fiber.Map{
			"status": "vm doesn't exist",
		}
	}

	access, _ := accessManagment.CheckAccess(&user, resourceType, vms[0].Resource.Id)
	permission, _ := accessManagment.CheckPermission(&user, action.USE, resourceType)

	if permission && access {

		if vms[0].InUse {
			err = stopVm(&vms[0])
		} else {
			err = startVm(&vms[0])
		}

		if err != nil {
			c.Response().SetStatusCode(500)
			return fiber.Map{
				"error": err.Error(),
			}
		}

		return fiber.Map{
			"used":   vms[0].InUse,
			"status": "ok",
		}

	} else {

		c.Response().SetStatusCode(405)

		return fiber.Map{
			"error": "not authorized",
		}

	}

}

// func GetVmById(id string) (*model.Vm, error) {
// 	return dao.GetVmById(id)
// }

// func GetVmByName(name string) (*model.Vm, error) {
// 	vms, err := dao.GetVmsByName(name)
// 	if len(vms) < 1 {
// 		return nil, errors.New("vm doesn't exist")
// 	}
// 	return &vms[0], err
// }

func GetVmsTypes(c *fiber.Ctx) fiber.Map {
	bearerToken := string(c.Request().Header.Peek("Authorization"))

	_, err := controller.VerifyUser(bearerToken)

	if err != nil {

		return fiber.Map{
			"error": err.Error(),
		}

	}

	allVmsTypes, err := dao.GetAllVmTypes()

	if err != nil {
		c.Response().SetStatusCode(500)
		return fiber.Map{
			"error": err.Error(),
		}

	}

	return fiber.Map{
		"vmTypes": allVmsTypes,
	}

}

func AssignIp(c *fiber.Ctx) fiber.Map {

	err := dao.UpdateVmByName(c.Params("name"), bson.M{"$set": bson.M{"ipaddr": c.Params("ip"), "state": "Ready"}})

	if err != nil {
		c.Response().SetStatusCode(500)
		return fiber.Map{
			"error": err.Error(),
		}

	}

	vm, err := dao.GetVmsByName(c.Params("name"))

	if err != nil {
		c.Response().SetStatusCode(500)
		return fiber.Map{
			"error": err.Error(),
		}

	}
	tagsString := `[`
	for _, tag := range vm[0].Tags {
		tagsString = tagsString + `"` + tag + `",`
	}
	tagsString = tagsString + `]`

	message := `{
		"tags" : ` + tagsString + `
	}`

	notificationsystem.PublishMessage(vm[0].Name, message)

	return fiber.Map{
		"status": "ok",
	}
}

// func UpdateVm(vm model.Vm) error {

// 	return dao.UpdateVm(vm.Id, vm)
// }

// func FreeVm(id string) error {

// 	return dao.UpdateVm(id, bson.D{{Key: "inuse", Value: false}})

// }

func IfVmExist(c *fiber.Ctx) fiber.Map {

	bearerToken := string(c.Request().Header.Peek("Authorization"))

	_, err := controller.VerifyUser(bearerToken)

	if err != nil {

		return fiber.Map{
			"result": false,
			"error":  err.Error(),
		}

	}

	vms, err := dao.GetVmsByName(c.Params("vmName"))

	if err != nil {
		c.Response().SetStatusCode(500)
		return fiber.Map{
			"result": false,
			"error":  err.Error(),
		}
	}

	if len(vms) <= 0 {
		return fiber.Map{
			"result": false,
		}
	}

	//	access, _ := accessManagment.CheckAccess(&user, resourceType, vms[0].Resource.Id)

	return fiber.Map{
		"result": true,
	}

}

func startVm(vm *model.Vm) error {
	provider, err := dao.GetVmTypeById(vm.VmType)

	if err != nil {
		return err
	}

	providerName := provider.Lookup("provider").StringValue()

	account, err := dao.GetProviderAccountByName(vm.Account)

	if err != nil {
		return errors.New("CreateVm: " + err.Error())
	}
	assistant, err := assistant_aws.SelectAssistant(providerName)
	if err != nil {
		return err
	}
	err = assistant.StartVM(vm, &account)
	if err != nil {
		return err
	}

	return dao.UpdateVmByName(vm.Name, bson.M{"$set": bson.M{"inuse": true}})

}

func stopVm(vm *model.Vm) error {
	provider, err := dao.GetVmTypeById(vm.VmType)

	if err != nil {
		return err
	}

	providerName := provider.Lookup("provider").StringValue()

	account, err := dao.GetProviderAccountByName(vm.Account)

	if err != nil {
		return errors.New("CreateVm: " + err.Error())
	}

	assistant, err := assistant_aws.SelectAssistant(providerName)
	if err != nil {
		return err
	}
	err = assistant.StopVM(vm, &account)
	if err != nil {
		return err
	}

	return dao.UpdateVmByName(vm.Name, bson.M{"$set": bson.M{"inuse": false}})

}

func createVm(vm model.Vm) (string, error) {
	provider, err := dao.GetVmTypeById(vm.VmType)

	if err != nil {
		return "", err
	}

	providerName := provider.Lookup("provider").StringValue()

	fmt.Println(vm.Account)

	account, err := dao.GetProviderAccountByName(vm.Account)

	if err != nil {
		return "", errors.New("CreateVm: " + err.Error())
	}

	assistant, err := assistant_aws.SelectAssistant(providerName)
	if err != nil {
		return "", err
	}

	_, err = assistant.CreateVM(&vm, &account)

	if err != nil {
		fmt.Println(err)
		return "", err
	}

	if vm.Tags == nil {
		vm.Tags = make([]string, 0)
	}

	err = dao.InsertVm(vm)

	if err != nil {

		return "", nil

	}

	return vm.Id, nil

}

func deleteVm(vm model.Vm) error {
	provider, err := dao.GetVmTypeById(vm.VmType)

	if err != nil {
		return err
	}

	if err != nil {
		return errors.New("can decode in db, error: " + err.Error())
	}

	providerName := provider.Lookup("provider").StringValue()

	account, err := dao.GetProviderAccountByName(vm.Account)

	if err != nil {
		return errors.New("DeleteVm: " + err.Error())
	}

	assistant, err := assistant_aws.SelectAssistant(providerName)
	if err != nil {
		return err
	}
	err = assistant.DeleteVM(vm, &account)

	if err != nil {
		return err
	}
	return dao.DeleteVmByName(vm.Name)

}

func contains(s []string, str string) bool {
	for _, v := range s {
		if v == str {
			return true
		}
	}

	return false
}

func Backup(c *fiber.Ctx) fiber.Map {

	bearerToken := string(c.Request().Header.Peek("Authorization"))

	vmName := c.Params("vmName")
	storage := c.FormValue("storage")

	user, err := controller.VerifyUser(bearerToken)

	if err != nil {

		return fiber.Map{
			"error": err.Error(),
		}

	}

	vms, err := dao.GetVmsByName(vmName)

	if err != nil {
		c.Response().SetStatusCode(500)
		return fiber.Map{
			"error": err.Error(),
		}
	}

	if len(vms) <= 0 {
		return fiber.Map{
			"status": "vm doesn't exist",
		}
	}

	storages, err := dao.GetStorageByName(storage)

	if err != nil {
		c.Response().SetStatusCode(500)
		return fiber.Map{
			"error": err.Error(),
		}
	}

	if len(storages) <= 0 {
		return fiber.Map{
			"status": "storage doesn't exist",
		}
	}

	access, _ := accessManagment.CheckAccess(&user, resourceType, vms[0].Resource.Id)
	permission, _ := accessManagment.CheckPermission(&user, action.UPDATE, resourceType)

	if permission && access {

		message := `{
			"actionType": "backup",
			"name": "` + storage + `"
		}`

		notificationsystem.SendMessageOnAQueue(vmName, message)

		if err != nil {
			c.Response().SetStatusCode(500)
			return fiber.Map{
				"error": err.Error(),
			}
		}

		return fiber.Map{
			"status": "ok",
		}

	} else {

		c.Response().SetStatusCode(405)

		return fiber.Map{
			"error": "not authorized",
		}

	}

}

func GetVmsInUse(c *fiber.Ctx) fiber.Map {

	bearerToken := string(c.Request().Header.Peek("Authorization"))

	user, err := controller.VerifyUser(bearerToken)

	if err != nil {

		return fiber.Map{
			"error": err.Error(),
		}

	}

	if user.Type == "admin" {
		result, err := dao.GetAllVmsInUse()
		if err != nil {

			return fiber.Map{
				"error": err.Error(),
			}

		}

		return fiber.Map{
			"vms": result,
		}
	}

	groups, err := dao.GetGroupByListNames(user.Groups)

	if err != nil {

		return fiber.Map{
			"error": err.Error(),
		}

	}

	var tags []string

	for _, group := range groups {
		for _, tag := range group.Tags {
			if !contains(tags, tag) {
				tags = append(tags, tag)
			}
		}
	}

	allVms, err := dao.GetVmsInUseByTags(tags)

	if err != nil {
		c.Response().SetStatusCode(500)
		return fiber.Map{
			"error": err,
		}

	}

	return fiber.Map{
		"vms": allVms,
	}
}
