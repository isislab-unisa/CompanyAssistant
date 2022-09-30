package users

import (
	"encoding/json"
	"server/internal/accessManagment"
	"server/internal/action"
	"server/internal/controller"
	"server/internal/dao"
	"server/internal/model"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

const resourceType = "users"

func CreateUser(c *fiber.Ctx) fiber.Map {

	bearerToken := string(c.Request().Header.Peek("Authorization"))

	user, err := controller.VerifyUser(bearerToken)

	if err != nil {
		return fiber.Map{
			"error": err.Error(),
		}
	}

	permission, _ := accessManagment.CheckPermission(&user, action.CREATE, resourceType)

	if !permission {
		c.Response().SetStatusCode(405)
		return fiber.Map{
			"error": "not authorized",
		}

	}

	c.Response().Header.Set("Content-Type", "application/json")

	var newUser model.User

	newUser.Username = c.FormValue("username")
	newUser.Password = c.FormValue("password")
	newUser.LastName = c.FormValue("lastname")
	newUser.Email = c.FormValue("email")
	newUser.FirstName = c.FormValue("name")
	newUser.Type = "user" //TODO
	newUser.Role = c.FormValue("role")

	var groups []string
	strinGroups := c.FormValue("groups")
	json.Unmarshal([]byte(strinGroups), &groups)
	newUser.Groups = groups

	users, err := dao.GetUserByUsername(newUser.Username)
	if err != nil {
		c.Response().SetStatusCode(500)
		return fiber.Map{
			"error": err.Error(),
		}
	}
	if len(users) > 0 {
		return fiber.Map{
			"status": "user already exist",
		}
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(newUser.Password), 5)

	if err != nil {
		c.Response().SetStatusCode(500)
		return fiber.Map{
			"error": "error While Hashing Password, Try Again",
		}
	}
	newUser.Password = string(hash)

	err = dao.InsertUser(newUser)
	if err != nil {
		c.Response().SetStatusCode(500)
		return fiber.Map{
			"error": "error While Creating User, Try Again",
		}
	}
	return fiber.Map{
		"status": "registration successful",
	}
}

func DeleteUser(c *fiber.Ctx) fiber.Map {

	username := c.Params("username")

	bearerToken := string(c.Request().Header.Peek("Authorization"))

	user, err := controller.VerifyUser(bearerToken)

	if err != nil {
		return fiber.Map{
			"Error": err.Error(),
		}
	}

	users, err := dao.GetUserByUsername(username)

	if err != nil {
		return fiber.Map{
			"error": err.Error(),
		}
	}

	if len(users) <= 0 {
		return fiber.Map{
			"status": "user doesn't exist",
		}
	}

	access, _ := accessManagment.CheckAccess(&user, resourceType, users[0].Resource.Id)
	permission, _ := accessManagment.CheckPermission(&user, action.DELETE, resourceType)

	if permission && access {
		err := dao.DeleteUser(username)
		if err != nil {
			c.Response().SetStatusCode(500)
			return fiber.Map{
				"Error": "can't detete user",
			}
		}
		return fiber.Map{
			"status": "user deleted : " + username,
		}
	}

	c.Response().SetStatusCode(405)

	return fiber.Map{
		"Error": "not authorized",
	}
}

func GetUsers(c *fiber.Ctx) fiber.Map {

	bearerToken := string(c.Request().Header.Peek("Authorization"))

	user, err := controller.VerifyUser(bearerToken)

	if err != nil {

		return fiber.Map{
			"error": err.Error(),
		}

	}
	var result []model.User
	if user.Type == "admin" {
		result, err = dao.GetAllUsers()
	} else {
		result, err = dao.GetUserByUserGroups(user.Groups)
	}

	if err != nil {
		c.Response().SetStatusCode(500)
		return fiber.Map{
			"error": err.Error(),
		}

	}

	return fiber.Map{
		"users": result,
	}
}

func GetUserRole(c *fiber.Ctx) fiber.Map {

	bearerToken := string(c.Request().Header.Peek("Authorization"))

	user, err := controller.VerifyUser(bearerToken)

	if err != nil {

		return fiber.Map{
			"error": err.Error(),
		}

	}

	us, err := dao.GetUserByUsername(user.Username)
	if err != nil {

		return fiber.Map{
			"error": err.Error(),
		}

	}

	if len(us) <= 0 {
		return fiber.Map{
			"error": "user doesn't exist",
		}
	}

	access, _ := accessManagment.CheckAccess(&user, resourceType, us[0].Resource.Id)

	if access {
		roles, err := dao.GetRolesByName(us[0].Role)
		if err != nil {

			return fiber.Map{
				"error": err.Error(),
			}

		}

		if len(roles) <= 0 {
			return fiber.Map{
				"error": "no role found",
			}
		}

		return fiber.Map{
			"role": roles[0],
		}
	} else {
		c.Response().SetStatusCode(405)

		return fiber.Map{
			"error": "Not Authorized",
		}
	}

}

func SetUserGroups(c *fiber.Ctx) fiber.Map {

	bearerToken := string(c.Request().Header.Peek("Authorization"))

	username := c.Params("username")
	var groups []string
	stringGroups := c.FormValue("groups")
	json.Unmarshal([]byte(stringGroups), &groups)

	users, err := dao.GetUserByUsername(username)

	if err != nil || len(groups) <= 0 {

		return fiber.Map{
			"error": "Error while deleting user",
		}

	}

	userToModify := users[0]

	user, err := controller.VerifyUser(bearerToken)

	if err != nil {

		return fiber.Map{
			"error": "Error while verifing user",
		}

	}

	access, _ := accessManagment.CheckAccess(&user, resourceType, userToModify.Resource.Id)
	permission, _ := accessManagment.CheckPermission(&user, action.UPDATE, resourceType)

	if permission && access {

		userToModify.Groups = groups

		err := dao.UpdateUserGroups(userToModify)

		if err != nil {
			c.Response().SetStatusCode(500)
			return fiber.Map{
				"error": "Error while updating user groups:" + user.Username,
			}

		}

		return fiber.Map{
			"status": "Utente aggiornato",
			"User": fiber.Map{

				"name": user.Username,
			},
		}
	} else {

		c.Response().SetStatusCode(405)

		return fiber.Map{
			"error": "Not Authorized",
		}

	}
}

func DeleteGroupFromUser(c *fiber.Ctx) fiber.Map {

	bearerToken := string(c.Request().Header.Peek("Authorization"))

	username := c.Params("username")
	group := c.FormValue("group")

	users, err := dao.GetUserByUsername(username)

	if err != nil {
		return fiber.Map{
			"error": "Error while deleting group from user: User not found",
		}
	}

	userToModify := users[0]

	user, err := controller.VerifyUser(bearerToken)

	if err != nil {

		return fiber.Map{
			"error": "Error while verifing user",
		}

	}

	access, _ := accessManagment.CheckAccess(&user, resourceType, userToModify.Resource.Id)
	permission, _ := accessManagment.CheckPermission(&user, action.UPDATE, resourceType)

	if permission && access {

		var newGroups []string
		for _, item := range userToModify.Groups {
			if item != group {
				newGroups = append(newGroups, item)
			}
		}

		userToModify.Groups = newGroups

		err := dao.UpdateUserGroups(userToModify)

		if err != nil {
			c.Response().SetStatusCode(500)
			return fiber.Map{
				"error": "Error while updating user groups:" + user.Username,
			}

		}

		return fiber.Map{
			"status": "Utente aggiornato",
			"User": fiber.Map{

				"name": user.Username,
			},
		}
	} else {

		c.Response().SetStatusCode(405)

		return fiber.Map{
			"error": "Not Authorized",
		}

	}
}

func IfUserExist(c *fiber.Ctx) fiber.Map {

	bearerToken := string(c.Request().Header.Peek("Authorization"))

	_, err := controller.VerifyUser(bearerToken)

	if err != nil {

		return fiber.Map{
			"result": false,
			"error":  err.Error(),
		}

	}

	users, err := dao.GetUserByUsername(c.Params("username"))
	if err != nil {
		c.Response().SetStatusCode(500)
		return fiber.Map{
			"result": false,
			"error":  err.Error(),
		}
	}

	if len(users) <= 0 {
		return fiber.Map{
			"result": false,
		}
	}

	//access, _ := accessManagment.CheckAccess(&user, resourceType, users[0].Resource.Id)

	return fiber.Map{
		"result": true,
	}

}
