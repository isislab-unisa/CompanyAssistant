package roles

import (
	"encoding/json"
	"server/internal/controller"
	"server/internal/dao"
	"server/internal/model"

	"github.com/gofiber/fiber/v2"
)

func CreateRole(c *fiber.Ctx) fiber.Map {

	bearerToken := string(c.Request().Header.Peek("Authorization"))

	var role model.Role
	role.Name = c.Params("name")
	var policies []string
	stringPolicies := c.FormValue("policies")

	json.Unmarshal([]byte(stringPolicies), &policies)

	role.Policies = policies

	user, err := controller.VerifyUser(bearerToken)

	if err != nil {

		return fiber.Map{
			"error": "Error while verifing user",
		}

	}

	if user.Type == "admin" {
		err := dao.InsertRole(role)

		if err != nil {
			c.Response().SetStatusCode(500)
			return fiber.Map{
				"error": "Error while inserting role:" + role.Name,
			}

		}

		return fiber.Map{
			"status": "Ruolo creato",
			"Role": fiber.Map{

				"name": role.Name,
			},
		}
	} else {

		c.Response().SetStatusCode(405)

		return fiber.Map{
			"error": "Not Authorized",
		}

	}
}

func DeleteRole(c *fiber.Ctx) fiber.Map {
	bearerToken := string(c.Request().Header.Peek("Authorization"))

	var role model.Role
	role.Name = c.Params("name")
	//group.Tags = c.FormValue("tags")

	user, err := controller.VerifyUser(bearerToken)

	if err != nil {

		return fiber.Map{
			"error": "Error while verifing user",
		}

	}

	if user.Type == "admin" {
		err := dao.DeleteRoleByName(role.Name)

		if err != nil {
			c.Response().SetStatusCode(500)
			return fiber.Map{
				"error": "Error while deleting role:" + role.Name,
			}

		}

		return fiber.Map{
			"status": "RRuolo eliminato",
			"Role": fiber.Map{

				"name": role.Name,
			},
		}
	} else {

		c.Response().SetStatusCode(405)

		return fiber.Map{
			"error": "Not Authorized",
		}

	}
}

func GetRoles(c *fiber.Ctx) fiber.Map {

	bearerToken := string(c.Request().Header.Peek("Authorization"))

	_, err := controller.VerifyUser(bearerToken)

	if err != nil {

		return fiber.Map{
			"error": err.Error(),
		}

	}

	result, err := dao.GetAllRoles()

	if err != nil {
		c.Response().SetStatusCode(500)
		return fiber.Map{
			"error": err.Error(),
		}

	}

	return fiber.Map{
		"roles": result,
	}
}

func IfRoleExist(c *fiber.Ctx) fiber.Map {

	bearerToken := string(c.Request().Header.Peek("Authorization"))

	_, err := controller.VerifyUser(bearerToken)

	if err != nil {

		return fiber.Map{
			"result": false,
			"error":  err.Error(),
		}

	}

	results, err := dao.GetRolesByName(c.Params("name"))

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

	//access, _ := accessManagment.CheckAccess(&user, resourceType, results[0].Resource.Id)

	return fiber.Map{
		"result": true,
	}

}
