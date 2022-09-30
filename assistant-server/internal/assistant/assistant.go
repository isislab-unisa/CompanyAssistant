package assistant_aws

import (
	"errors"
	"server/internal/model"

	"go.mongodb.org/mongo-driver/bson"
)

type Assistant struct {
	Provider Provider
}

func (a *Assistant) SetProvider(p Provider) {
	a.Provider = p
}

func NewAssistant(p Provider) *Assistant {
	return &Assistant{
		Provider: p,
	}
}

func (a *Assistant) CreateVM(vm *model.Vm, account *bson.Raw) (string, error) {
	return a.Provider.CreateVM(vm, account)
}

func (a *Assistant) CreateStorage(storage *model.Storage, account *bson.Raw) (string, error) {
	return a.Provider.CreateStorage(storage, account)
}

func (a *Assistant) DeleteStorage(storage *model.Storage, account *bson.Raw) error {
	return a.Provider.DeleteStorage(storage, account)
}

func (a *Assistant) DeleteVM(vm model.Vm, account *bson.Raw) error {
	return a.Provider.DeleteVM(vm, account)
}

func (a *Assistant) StartVM(vm *model.Vm, account *bson.Raw) error {
	return a.Provider.StartVM(vm, account)
}

func (a *Assistant) StopVM(vm *model.Vm, account *bson.Raw) error {
	return a.Provider.StopVM(vm, account)
}

func (a *Assistant) CheckStatus(account *bson.Raw) error {
	return a.Provider.CheckStatus(account)
}

func SelectAssistant(providerName string) (*Assistant, error) {
	switch providerName {
	case "aws":
		return NewAssistant(&Assistant_aws{}), nil
	case "azure":
		return NewAssistant(&Assistant_azure{}), nil
	case "google":
		return NewAssistant(&Assistant_google{}), nil
	default:
		return nil, errors.New("wrong provider")
	}
}
