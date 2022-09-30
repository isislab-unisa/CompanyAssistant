package storage

import (
	"encoding/json"
	"errors"
	"server/internal/accessManagment"
	"server/internal/action"
	"server/internal/api/v1/tags"
	assistant_aws "server/internal/assistant"
	"server/internal/controller"
	"server/internal/dao"
	"server/internal/model"

	"github.com/gofiber/fiber/v2"
)

const resourceType = "storage"

func CreateStorage(c *fiber.Ctx) fiber.Map {

	bearerToken := string(c.Request().Header.Peek("Authorization"))

	var storage model.Storage
	storage.Name = c.Params("name")
	storage.Account = c.FormValue("account")
	storage.Size = c.FormValue("size")

	var a_tags []string
	stringTags := c.FormValue("tags")
	json.Unmarshal([]byte(stringTags), &a_tags)
	storage.Tags = a_tags

	user, err := controller.VerifyUser(bearerToken)

	if err != nil {

		return fiber.Map{
			"error": err.Error(),
		}

	}

	permission, _ := accessManagment.CheckPermission(&user, action.CREATE, resourceType)

	if permission {
		err := tags.InsertTags(storage.Tags)

		if err != nil {

			return fiber.Map{
				"error": err.Error() + " while inserting tags",
			}

		}

		idSt, err := createStorage(storage)

		if err != nil {

			return fiber.Map{
				"error": err.Error() + " while creating storage",
			}

		}

		return fiber.Map{
			"result": idSt,
		}

	}
	return fiber.Map{
		"error": "No permission",
	}
}

func GetStorage(c *fiber.Ctx) fiber.Map {

	bearerToken := string(c.Request().Header.Peek("Authorization"))

	user, err := controller.VerifyUser(bearerToken)

	if err != nil {

		return fiber.Map{
			"error": err.Error(),
		}

	}

	if user.Type == "admin" {
		result, err := dao.GetAllStorages()
		if err != nil {

			return fiber.Map{
				"error": err.Error(),
			}

		}

		return fiber.Map{
			"storage": result,
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

	allStorage, err := dao.GetStorageByTags(tags)

	if err != nil {
		c.Response().SetStatusCode(500)
		return fiber.Map{
			"error": err,
		}

	}

	return fiber.Map{
		"storage": allStorage,
	}
}

func DeleteStorage(c *fiber.Ctx) fiber.Map {

	bearerToken := string(c.Request().Header.Peek("Authorization"))

	user, err := controller.VerifyUser(bearerToken)

	if err != nil {

		return fiber.Map{
			"error": err.Error(),
		}

	}

	storage, err := dao.GetStorageByName(c.Params("name"))
	if err != nil {
		c.Response().SetStatusCode(500)
		return fiber.Map{
			"error": err.Error(),
		}
	}

	if len(storage) <= 0 {
		return fiber.Map{
			"status": "storage doesn't exist",
		}
	}

	access, _ := accessManagment.CheckAccess(&user, resourceType, storage[0].Resource.Id)
	permission, _ := accessManagment.CheckPermission(&user, action.DELETE, resourceType)

	if permission && access {
		err = deleteStorage(storage[0])

		if err != nil {
			c.Response().SetStatusCode(500)
			return fiber.Map{
				"error": err.Error(),
			}

		}

		return fiber.Map{
			"status": "Storage eliminated",
		}
	}

	c.Response().SetStatusCode(405)

	return fiber.Map{
		"error": "not authorized",
	}
}

func createStorage(storage model.Storage) (string, error) {

	account, err := dao.GetProviderAccountByName(storage.Account)
	if err != nil {
		return "", err
	}

	providerName := account.Lookup("provider").StringValue()

	assistant, err := assistant_aws.SelectAssistant(providerName)
	if err != nil {
		return "", err
	}

	_, err = assistant.CreateStorage(&storage, &account)

	if err != nil {
		return "", err
	}

	if storage.Tags == nil {
		storage.Tags = make([]string, 0)
	}

	err = dao.InsertStorage(storage)

	if err != nil {

		return "", nil

	}

	return storage.Id, nil
}

func deleteStorage(storage model.Storage) error {
	account, err := dao.GetProviderAccountByName(storage.Account)

	providerName := account.Lookup("provider").StringValue()

	if err != nil {
		return errors.New("DeleteStorage: " + err.Error())
	}

	assistant, err := assistant_aws.SelectAssistant(providerName)
	if err != nil {
		return err
	}
	err = assistant.DeleteStorage(&storage, &account)

	if err != nil {
		return err
	}
	return dao.DeleteStorageByName(storage.Name)

}

func contains(s []string, str string) bool {
	for _, v := range s {
		if v == str {
			return true
		}
	}

	return false
}
