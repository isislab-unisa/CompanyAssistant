package assistant_aws

import (
	"server/internal/model"

	"go.mongodb.org/mongo-driver/bson"
)

type Provider interface {
	CreateVM(vm *model.Vm, account *bson.Raw) (string, error)
	DeleteVM(vm model.Vm, account *bson.Raw) error
	StopVM(vm *model.Vm, account *bson.Raw) error
	StartVM(vm *model.Vm, account *bson.Raw) error
	CheckStatus(account *bson.Raw) error
	CreateStorage(storage *model.Storage, account *bson.Raw) (string, error)
	DeleteStorage(storage *model.Storage, account *bson.Raw) error
}
