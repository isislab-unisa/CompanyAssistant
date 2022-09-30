package main

import (
	"context"
	"fmt"
	"server/internal/api/v1/groups"
	"server/internal/api/v1/policies"
	"server/internal/api/v1/providers"
	"server/internal/api/v1/roles"
	"server/internal/api/v1/storage"
	"server/internal/api/v1/tags"
	"server/internal/api/v1/users"
	"server/internal/api/v1/vms"
	"server/internal/controller"
	"server/internal/db"
	notificationsystem "server/internal/notificationSystem"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {

	app := fiber.New()
	// Default config
	app.Use(cors.New())

	godotenv.Load()

	go notificationsystem.StartReciving()

	client, err := db.InitClient()
	defer func() {
		if err = client.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()

	if err != nil {
		panic(err)
	}

	app.Get("/", func(c *fiber.Ctx) error {
		fmt.Println(c)
		return c.SendString("Connected")
	})

	app.Post("/login", func(c *fiber.Ctx) error {
		controller.LoginHandler(c)
		return c.Send(c.Response().Body())
	})

	//VMS
	app.Put("/api/v1/vms/create/:name/:vmType", func(c *fiber.Ctx) error {
		fmt.Println(c)
		return c.JSON(vms.CreateVm(c))
	})

	app.Delete("/api/v1/vms/delete/:name", func(c *fiber.Ctx) error {
		fmt.Println(c)
		return c.JSON(vms.DeleteVm(c))
	})

	app.Get("/api/v1/vms/getAll", func(c *fiber.Ctx) error {
		fmt.Println(c)
		return c.JSON(vms.GetVms(c))
	})

	app.Put("/api/v1/vms/use/:vmName", func(c *fiber.Ctx) error {
		fmt.Println(c)
		return c.JSON(vms.UseVm(c))
	})

	app.Get("/api/v1/vms/getVmTypes", func(c *fiber.Ctx) error {
		fmt.Println(c)
		return c.JSON(vms.GetVmsTypes(c))
	})

	app.Get("/api/v1/vms/assignIp/:ip/:name", func(c *fiber.Ctx) error {
		fmt.Println(c)
		return c.JSON(vms.AssignIp(c))
	})

	app.Get("/api/v1/vms/exist/:vmName", func(c *fiber.Ctx) error {
		fmt.Println(c)
		return c.JSON(vms.IfVmExist(c))
	})

	app.Put("/api/v1/vms/backup/:vmName", func(c *fiber.Ctx) error {
		fmt.Println(c)
		return c.JSON(vms.Backup(c))
	})

	app.Get("/api/v1/vms/getAllInUse", func(c *fiber.Ctx) error {
		fmt.Println(c)
		return c.JSON(vms.GetVmsInUse(c))
	})

	//USERS
	app.Put("/api/v1/users/create", func(c *fiber.Ctx) error {
		fmt.Println(c)
		return c.JSON(users.CreateUser(c))
	})

	app.Get("/api/v1/users/getAll", func(c *fiber.Ctx) error {
		fmt.Println(c)
		return c.JSON(users.GetUsers(c))
	})

	app.Delete("/api/v1/users/get/:username", func(c *fiber.Ctx) error {
		fmt.Println(c)
		return c.JSON(users.DeleteUser(c))
	})

	app.Patch("/api/v1/users/deleteSingleGroup/:username", func(c *fiber.Ctx) error {
		fmt.Println(c)
		return c.JSON(users.DeleteGroupFromUser(c))
	})

	app.Get("/api/v1/users/exist/:username", func(c *fiber.Ctx) error {
		fmt.Println(c)
		return c.JSON(users.IfUserExist(c))
	})

	app.Get("/api/v1/users/role/", func(c *fiber.Ctx) error {
		fmt.Println(c)
		return c.JSON(users.GetUserRole(c))
	})

	//PROVIDERS_ACCOUNTS
	app.Get("/api/v1/providers/getAllParameters", func(c *fiber.Ctx) error {
		fmt.Println(c)
		return c.JSON(providers.GetProviderParameters(c))
	})

	app.Put("/api/v1/providers/create", func(c *fiber.Ctx) error {
		fmt.Println(c)
		return c.JSON(providers.CreateAccount(c))
	})

	app.Patch("/api/v1/providers/edit/:name", func(c *fiber.Ctx) error {
		fmt.Println(c)
		return c.JSON(providers.EditAccount(c))
	})

	app.Get("/api/v1/providers/exist/:name", func(c *fiber.Ctx) error {
		fmt.Println(c)
		return c.JSON(providers.IfAccountExist(c))
	})

	app.Delete("/api/v1/providers/delete/:name", func(c *fiber.Ctx) error {
		fmt.Println(c)
		return c.JSON(providers.DeleteProviderAccount(c))
	})

	app.Get("/api/v1/providers/checkStatus/:name", func(c *fiber.Ctx) error {
		fmt.Println(c)
		return c.JSON(providers.CheckStatus(c))
	})

	app.Get("/api/v1/providers/getAll", func(c *fiber.Ctx) error {
		fmt.Println(c)

		bearerToken := string(c.Request().Header.Peek("Authorization"))

		_, err := controller.VerifyUser(bearerToken)

		if err != nil {

			return c.JSON(fiber.Map{
				"error": err.Error(),
			})

		}

		result, err := providers.GetAll()

		if err != nil {
			c.Response().SetStatusCode(500)
			return c.JSON(fiber.Map{
				"error": err.Error(),
			})

		}
		c.Response().Header.SetContentType("application/json")
		return c.Send([]byte(result))
	})

	app.Get("/api/v1/providers/getAllNames", func(c *fiber.Ctx) error {
		fmt.Println(c)

		bearerToken := string(c.Request().Header.Peek("Authorization"))

		_, err := controller.VerifyUser(bearerToken)

		if err != nil {

			return c.JSON(fiber.Map{
				"error": err.Error(),
			})

		}

		result, err := providers.GetAllNames()

		if err != nil {
			c.Response().SetStatusCode(500)
			return c.JSON(fiber.Map{
				"error": err.Error(),
			})

		}
		c.Response().Header.SetContentType("application/json")
		return c.JSON(fiber.Map{
			"accounts": result,
		})
	})

	//GROUPS

	app.Delete("/api/v1/groups/:name", func(c *fiber.Ctx) error {
		fmt.Println(c)
		return c.JSON(groups.DeleteGroup(c))
	})

	app.Put("/api/v1/groups/create/:name", func(c *fiber.Ctx) error {
		fmt.Println(c)
		return c.JSON(groups.CreateGroup(c))
	})

	app.Get("/api/v1/groups/getAll", func(c *fiber.Ctx) error {
		fmt.Println(c)
		return c.JSON(groups.GetGroups(c))
	})

	app.Patch("/api/v1/groups/setTags/:name", func(c *fiber.Ctx) error {
		fmt.Println(c)
		return c.JSON(groups.SetGroupTags(c))
	})

	app.Get("/api/v1/groups/exist/:name", func(c *fiber.Ctx) error {
		fmt.Println(c)
		return c.JSON(groups.IfGroupExist(c))
	})

	//ROLES
	app.Put("/api/v1/roles/:name", func(c *fiber.Ctx) error {
		fmt.Println(c)
		return c.JSON(roles.CreateRole(c))
	})

	app.Delete("/api/v1/roles/:name", func(c *fiber.Ctx) error {
		fmt.Println(c)
		return c.JSON(roles.DeleteRole(c))
	})

	app.Get("/api/v1/roles/getAll", func(c *fiber.Ctx) error {
		fmt.Println(c)
		return c.JSON(roles.GetRoles(c))
	})

	app.Get("/api/v1/roles/exist/:name", func(c *fiber.Ctx) error {
		fmt.Println(c)
		return c.JSON(roles.IfRoleExist(c))
	})

	//POLICIES
	app.Get("/api/v1/policies/getAll", func(c *fiber.Ctx) error {
		fmt.Println(c)
		return c.JSON(policies.GetPolicies(c))
	})

	//TAGS
	app.Get("/api/v1/tags/getAll", func(c *fiber.Ctx) error {
		fmt.Println(c)
		return c.JSON(tags.GetTags(c))
	})

	//STORAGE
	app.Put("/api/v1/storage/create/:name", func(c *fiber.Ctx) error {
		fmt.Println(c)
		return c.JSON(storage.CreateStorage(c))
	})

	app.Delete("/api/v1/storage/delete/:name", func(c *fiber.Ctx) error {
		fmt.Println(c)
		return c.JSON(storage.DeleteStorage(c))
	})

	app.Get("/api/v1/storage/getAll", func(c *fiber.Ctx) error {
		fmt.Println(c)
		return c.JSON(storage.GetStorage(c))
	})

	app.Get("/ciao", func(c *fiber.Ctx) error {
		fmt.Println(c)
		return c.JSON(storage.GetStorage(c))
	})

	app.Listen(":80")
}
