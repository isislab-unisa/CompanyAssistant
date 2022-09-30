package policies

import (
	"server/internal/controller"
	"server/internal/dao"

	"github.com/gofiber/fiber/v2"
)

func GetPolicies(c *fiber.Ctx) fiber.Map {

	bearerToken := string(c.Request().Header.Peek("Authorization"))

	_, err := controller.VerifyUser(bearerToken)

	if err != nil {

		return fiber.Map{
			"error": err.Error(),
		}

	}

	result, err := dao.GetAllPolicies()

	if err != nil {
		c.Response().SetStatusCode(500)
		return fiber.Map{
			"error": err.Error(),
		}

	}

	return fiber.Map{
		"policies": result,
	}
}
