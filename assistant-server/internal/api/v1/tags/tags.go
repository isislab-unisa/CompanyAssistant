package tags

import (
	"errors"
	"server/internal/controller"
	"server/internal/dao"
	"server/internal/model"

	"github.com/gofiber/fiber/v2"
)

func GetTags(c *fiber.Ctx) fiber.Map {

	bearerToken := string(c.Request().Header.Peek("Authorization"))

	user, err := controller.VerifyUser(bearerToken)

	if err != nil {

		return fiber.Map{
			"error": err.Error(),
		}

	}

	if user.Type == "admin" {
		result, err := dao.GetAllTags()

		if err != nil {
			c.Response().SetStatusCode(500)
			return fiber.Map{
				"error": err.Error(),
			}
		}

		return fiber.Map{
			"tags": result,
		}
	}

	//TODO tag by groups
	groups, err := dao.GetGroupByListNames(user.Groups)

	if err != nil {
		c.Response().SetStatusCode(500)
		return fiber.Map{
			"error": err.Error(),
		}
	}

	var tags []model.Tag

	for _, group := range groups {
		for _, tag := range group.Tags {
			if !contains(&tags, &tag) {
				var newTag model.Tag
				newTag.Name = tag
				tags = append(tags, newTag)
			}
		}
	}

	return fiber.Map{
		"tags": tags,
	}
}

func InsertTags(tags []string) error {

	for _, stringTag := range tags {
		var tag model.Tag
		tag.Name = stringTag
		err := dao.InsertTag(tag)
		if err != nil {
			return errors.New(err.Error() + " tag: " + tag.Name)
		}
	}

	return nil
}

func contains(s *[]model.Tag, str *string) bool {
	for _, v := range *s {
		if v.Name == *str {
			return true
		}
	}

	return false
}
