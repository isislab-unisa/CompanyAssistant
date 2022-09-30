package accessManagment

import (
	"errors"
	"server/internal/dao"
	"server/internal/model"
)

func CheckPermission(user *model.User, action string, resourceType string) (bool, error) {

	if user.Type == "admin" {
		return true, nil
	}

	role, err := dao.GetRolesByName(user.Role)

	if err != nil {
		return false, err
	}

	if len(role) <= 0 {
		return false, nil
	}
	policies, err := dao.GetPoliciesByListNamesAndType(role[0].Policies, resourceType)

	if err != nil {
		return false, err
	}

	if len(policies) <= 0 {
		return false, nil
	}

	for _, v := range policies {
		if v.Action == action {
			return true, nil
		}
	}

	return false, nil

}

//IMPELMENTARE TODO
func CheckAccess(user *model.User, resType, resourceId string) (bool, error) {

	if user.Type == "admin" {
		return true, nil
	}

	switch resType {
	case "vms":
		return checkAccessVm(user, resourceId)
	case "storage":
		return checkAccessStorage(user, resourceId)
	case "groups":
		return checkAccessGroup(user, resourceId)
	case "users":
		return checkAccessUser(user, resourceId)
	case "providerAccounts":
		return true, nil
	default:
		return false, errors.New("error: ")

	}
}

func checkAccessVm(user *model.User, resoiurceId string) (bool, error) {

	vm, err := dao.GetVmByResourceId(resoiurceId)

	if err != nil {
		return false, err
	}

	groups, err := dao.GetGroupByListNames(user.Groups)

	if err != nil {

		return false, err

	}

	var tags []string

	for _, group := range groups {
		for _, tag := range group.Tags {
			if !contains(tags, tag) {
				tags = append(tags, tag)
			}
		}
	}

	for _, tag := range tags {
		if contains(vm.Tags, tag) {
			return true, nil
		}
	}

	return false, nil
}

func checkAccessStorage(user *model.User, resoiurceId string) (bool, error) {

	vm, err := dao.GetStorageByResourceId(resoiurceId)

	if err != nil {
		return false, err
	}

	groups, err := dao.GetGroupByListNames(user.Groups)

	if err != nil {

		return false, err

	}

	var tags []string

	for _, group := range groups {
		for _, tag := range group.Tags {
			if !contains(tags, tag) {
				tags = append(tags, tag)
			}
		}
	}

	for _, tag := range tags {
		if contains(vm.Tags, tag) {
			return true, nil
		}
	}

	return false, nil
}

func checkAccessGroup(user *model.User, resourceId string) (bool, error) {

	group, err := dao.GetGroupByResourceId(resourceId)

	if err != nil {
		return false, err
	}

	if contains(user.Groups, group.Name) {
		return true, nil
	}

	return false, nil

}

func checkAccessUser(user *model.User, resourceId string) (bool, error) {
	us, err := dao.GetUserByResourceId(resourceId)
	if err != nil {
		return false, err
	}

	for _, group := range us.Groups {
		if contains(user.Groups, group) {
			return true, nil
		}
	}
	return false, nil

}

func CheckAdmin(user *model.User) bool {
	if user.Type == "admin" {
		return true
	} else {
		return false
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
