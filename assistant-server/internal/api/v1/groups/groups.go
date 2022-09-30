package groups

import (
	"encoding/json"
	"server/internal/accessManagment"
	"server/internal/action"
	"server/internal/controller"
	"server/internal/dao"
	"server/internal/model"

	"github.com/gofiber/fiber/v2"
)

const resourceType = "groups"

func CreateGroup(c *fiber.Ctx) fiber.Map {

	bearerToken := string(c.Request().Header.Peek("Authorization"))

	var group model.Group
	group.Name = c.Params("name")
	var tags []string
	stringTags := c.FormValue("tags")
	json.Unmarshal([]byte(stringTags), &tags)
	group.Tags = tags

	var users []string
	stringUsers := c.FormValue("users")
	json.Unmarshal([]byte(stringUsers), &users)

	user, err := controller.VerifyUser(bearerToken)

	if err != nil {

		return fiber.Map{
			"error": "Error while verifing user",
		}

	}

	permission, _ := accessManagment.CheckPermission(&user, action.CREATE, resourceType)

	if permission {
		err := dao.InsertGroup(group)

		if err != nil {
			c.Response().SetStatusCode(500)
			return fiber.Map{
				"error": "Error while inserting group:" + group.Name,
			}

		}

		for _, usr := range users {
			u, err := dao.GetUserByUsername(usr)

			if err != nil {
				c.Response().SetStatusCode(500)
				return fiber.Map{
					"error": "wrgwrtg error while inserting group to user:" + usr,
				}
			}

			if !contains(u[0].Groups, group.Name) {
				u[0].Groups = append(u[0].Groups, group.Name)
				err = dao.UpdateUserGroups(u[0])
				if err != nil {
					c.Response().SetStatusCode(500)
					return fiber.Map{
						"error": "error while inserting group to user:" + usr + " " + err.Error(),
					}
				}
			}
		}

		return fiber.Map{
			"status": "Gruppo creato",
			"Group": fiber.Map{

				"name": group.Name,
			},
		}
	} else {

		c.Response().SetStatusCode(405)

		return fiber.Map{
			"error": "Not Authorized",
		}

	}
}

func DeleteGroup(c *fiber.Ctx) fiber.Map {
	bearerToken := string(c.Request().Header.Peek("Authorization"))

	var group model.Group
	group.Name = c.Params("name")
	//group.Tags = c.FormValue("tags")

	groups, err := dao.GetGroupByName(group.Name)

	if err != nil || len(groups) <= 0 {

		return fiber.Map{
			"error": "Error while deleting user",
		}

	}

	group = groups[0]

	user, err := controller.VerifyUser(bearerToken)

	if err != nil {

		return fiber.Map{
			"error": "Error while verifing user",
		}

	}

	access, _ := accessManagment.CheckAccess(&user, resourceType, group.Resource.Id)
	permission, _ := accessManagment.CheckPermission(&user, action.DELETE, resourceType)

	if permission && access {
		err := dao.DeleteGroupByName(group.Name)

		if err != nil {
			c.Response().SetStatusCode(500)
			return fiber.Map{
				"error": "Error while deleting group:" + group.Name,
			}

		}

		return fiber.Map{
			"status": "Gruppo eliminato",
			"Group": fiber.Map{

				"name": group.Name,
			},
		}
	} else {

		c.Response().SetStatusCode(405)

		return fiber.Map{
			"error": "Not Authorized",
		}

	}
}

func GetGroups(c *fiber.Ctx) fiber.Map {

	bearerToken := string(c.Request().Header.Peek("Authorization"))

	user, err := controller.VerifyUser(bearerToken)

	if err != nil {

		return fiber.Map{
			"error": err.Error(),
		}

	}

	var result []model.Group
	if user.Type == "admin" {
		result, err = dao.GetAllGroups()
	} else {
		result, err = dao.GetGroupByListNames(user.Groups)
	}

	if err != nil {
		c.Response().SetStatusCode(500)
		return fiber.Map{
			"error": err.Error(),
		}

	}

	return fiber.Map{
		"groups": result,
	}
}

func contains(s []string, str string) bool {
	for _, v := range s {
		if v == str {
			return true
		}
	}

	return false
}

func SetGroupTags(c *fiber.Ctx) fiber.Map {

	bearerToken := string(c.Request().Header.Peek("Authorization"))

	groupName := c.Params("name")
	var tags []string
	stringTags := c.FormValue("tags")
	json.Unmarshal([]byte(stringTags), &tags)
	groupTags := tags

	groups, err := dao.GetGroupByName(groupName)

	if err != nil || len(groups) <= 0 {

		return fiber.Map{
			"error": "Error while deleting user",
		}

	}

	group := groups[0]

	user, err := controller.VerifyUser(bearerToken)

	if err != nil {

		return fiber.Map{
			"error": "Error while verifing user",
		}

	}

	access, _ := accessManagment.CheckAccess(&user, resourceType, group.Resource.Id)
	permission, _ := accessManagment.CheckPermission(&user, action.UPDATE, resourceType)

	if permission && access {
		err := dao.UpdateGroupTags(groupName, groupTags)

		if err != nil {
			c.Response().SetStatusCode(500)
			return fiber.Map{
				"error": "Error while updating group:" + groupName,
			}

		}

		return fiber.Map{
			"status": "Gruppo aggiornato",
			"Group": fiber.Map{

				"name": groupName,
			},
		}
	} else {

		c.Response().SetStatusCode(405)

		return fiber.Map{
			"error": "Not Authorized",
		}

	}
}

func IfGroupExist(c *fiber.Ctx) fiber.Map {

	bearerToken := string(c.Request().Header.Peek("Authorization"))

	_, err := controller.VerifyUser(bearerToken)

	if err != nil {

		return fiber.Map{
			"result": false,
			"error":  err.Error(),
		}

	}

	results, err := dao.GetGroupByName(c.Params("name"))

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
