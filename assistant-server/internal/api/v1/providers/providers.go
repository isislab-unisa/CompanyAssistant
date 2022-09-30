package providers

import (
	"server/internal/accessManagment"
	"server/internal/action"
	assistant_aws "server/internal/assistant"
	"server/internal/controller"
	"server/internal/dao"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
)

const resourceType = "providerAccounts"

func GetProviderParameters(c *fiber.Ctx) fiber.Map {
	bearerToken := string(c.Request().Header.Peek("Authorization"))

	_, err := controller.VerifyUser(bearerToken)

	if err != nil {
		c.Response().SetStatusCode(500)
		return fiber.Map{
			"error": err.Error(),
		}

	}

	result, err := dao.GetAllProviderParameters()

	if err != nil {
		c.Response().SetStatusCode(500)
		return fiber.Map{
			"error": err.Error(),
		}

	}

	return fiber.Map{
		"providers": result,
	}
}

func CreateAccount(c *fiber.Ctx) fiber.Map {
	bearerToken := string(c.Request().Header.Peek("Authorization"))

	user, err := controller.VerifyUser(bearerToken)

	if err != nil {
		c.Response().SetStatusCode(500)
		return fiber.Map{
			"error": err.Error(),
		}
	}

	permission, _ := accessManagment.CheckPermission(&user, action.CREATE, resourceType)

	if permission {
		err := dao.InsertProviderAccount(string(c.Request().Body()))
		if err != nil {
			c.Response().SetStatusCode(500)
			return fiber.Map{
				"error": err.Error(),
			}
		}
		return fiber.Map{
			"ok": "ok",
		}
	}

	c.Response().SetStatusCode(405)

	return fiber.Map{
		"error": "not authorized",
	}
}

func EditAccount(c *fiber.Ctx) fiber.Map {
	bearerToken := string(c.Request().Header.Peek("Authorization"))

	user, err := controller.VerifyUser(bearerToken)

	if err != nil {
		c.Response().SetStatusCode(500)
		return fiber.Map{
			"error": err.Error(),
		}
	}

	//CONTROLLO ACCESS
	//access, _ := accessManagment.CheckAccess(&user, vms[0].Resource.Id)
	permission, _ := accessManagment.CheckPermission(&user, action.UPDATE, resourceType)
	if permission {
		err := dao.EditProviderAccount(c.Params("name"), string(c.Request().Body()))
		if err != nil {
			c.Response().SetStatusCode(500)
			return fiber.Map{
				"error": err.Error(),
			}
		}
		return fiber.Map{
			"ok": "ok",
		}
	}

	c.Response().SetStatusCode(405)

	return fiber.Map{
		"error": "not authorized",
	}
}

func GetAll() ([]byte, error) {
	return dao.GetAllProviderAccount()
}

func GetAllNames() ([]map[string]interface{}, error) {
	return dao.GetProviderAccountNames()
}

func GetByName(name string) (bson.Raw, error) {
	return dao.GetProviderAccountByName(name)
}

func IfAccountExist(c *fiber.Ctx) fiber.Map {

	bearerToken := string(c.Request().Header.Peek("Authorization"))

	_, err := controller.VerifyUser(bearerToken)

	if err != nil {

		return fiber.Map{
			"result": false,
			"error":  err.Error(),
		}

	}

	results, err := dao.GetProviderAccountByName(c.Params("name"))

	if err != nil {
		c.Response().SetStatusCode(500)
		return fiber.Map{
			"result": false,
			"error":  err.Error(),
		}
	}

	if len(results) <= 0 {
		return fiber.Map{
			"result": false,
		}
	}

	//access, _ := accessManagment.CheckAccess(&user, resourceType, "results[0].Resource.Id")

	return fiber.Map{
		"result": true,
	}

}

func CheckStatus(c *fiber.Ctx) fiber.Map {
	bearerToken := string(c.Request().Header.Peek("Authorization"))

	_, err := controller.VerifyUser(bearerToken)

	if err != nil {

		return fiber.Map{
			"result": false,
			"error":  err.Error(),
		}

	}

	results, err := dao.GetProviderAccountByName(c.Params("name"))

	if err != nil {
		c.Response().SetStatusCode(500)
		return fiber.Map{
			"result": false,
			"error":  err.Error(),
		}
	}

	if len(results) <= 0 {
		return fiber.Map{
			"result": false,
		}
	}

	providerName := results.Lookup("provider").StringValue()

	assistant, err := assistant_aws.SelectAssistant(providerName)
	if err != nil {
		return fiber.Map{
			"error":  err.Error(),
			"result": false,
		}
	}

	err = assistant.CheckStatus(&results)
	if err != nil {
		return fiber.Map{
			"result": false,
		}
	}

	return fiber.Map{
		"result": true,
	}

}

func DeleteProviderAccount(c *fiber.Ctx) fiber.Map {
	bearerToken := string(c.Request().Header.Peek("Authorization"))

	user, err := controller.VerifyUser(bearerToken)

	if err != nil {

		return fiber.Map{
			"error": err.Error(),
		}

	}

	if accessManagment.CheckAdmin(&user) {

		vms, err := dao.GetVmByProviderAccount(c.Params("name"))

		if err != nil {
			return fiber.Map{
				"error": err.Error(),
			}
		}

		if len(vms) > 0 {
			return fiber.Map{
				"error": "there are vms linked with this account",
			}
		}

		err = dao.DeleteProviderAccountByName(c.Params("name"))

		if err != nil {
			return fiber.Map{
				"error": err.Error(),
			}
		}

		return fiber.Map{
			"status": "account " + c.Params("name") + " deleted",
		}
	} else {
		c.Response().SetStatusCode(405)

		return fiber.Map{
			"error": "not authorized",
		}
	}

}
