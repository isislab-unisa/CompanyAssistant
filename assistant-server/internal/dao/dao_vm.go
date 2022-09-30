package dao

import (
	"context"
	"crypto/md5"
	"errors"
	"fmt"
	"server/internal/db"
	"server/internal/model"
	"time"

	"go.mongodb.org/mongo-driver/bson"
)

const vmsCollectionName = "vms"

func GetAllVms() ([]model.Vm, error) {

	cursor, err := db.GetDBCollection(vmsCollectionName).Find(context.TODO(), bson.D{{}})

	if err != nil {
		return nil, err
	}

	defer cursor.Close(context.TODO())

	resultNum := cursor.RemainingBatchLength()
	var result = make([]model.Vm, resultNum)
	i := 0
	for cursor.Next(context.TODO()) {
		err := cursor.Decode(&result[i])
		if err != nil {
			return nil, err
		}
		i++
	}

	//Nasconde la password
	// for index := range result {

	// 	result[index].Password = ""

	// }

	return result, nil

}

func GetAllVmsInUse() ([]model.Vm, error) {

	cursor, err := db.GetDBCollection(vmsCollectionName).Find(context.TODO(), bson.D{{Key: "inuse", Value: true}})

	if err != nil {
		return nil, err
	}

	defer cursor.Close(context.TODO())

	resultNum := cursor.RemainingBatchLength()
	var result = make([]model.Vm, resultNum)
	i := 0
	for cursor.Next(context.TODO()) {
		err := cursor.Decode(&result[i])
		if err != nil {
			return nil, err
		}
		i++
	}

	return result, nil

}

func GetVmById(id string) (*model.Vm, error) {

	singleResult := db.GetDBCollection(vmsCollectionName).FindOne(context.TODO(), bson.D{{Key: "id", Value: id}})

	if singleResult == nil {
		return nil, errors.New("Impossible to find vm with id: " + id)
	}

	var result model.Vm
	err := singleResult.Decode(&result)
	if err != nil {

		return nil, err

	}
	// 	result.Password = ""

	return &result, nil

}

func GetVmsByName(name string) ([]model.Vm, error) {

	cursor, err := db.GetDBCollection(vmsCollectionName).Find(context.TODO(), bson.D{{Key: "name", Value: name}})

	if err != nil {
		return nil, err
	}

	defer cursor.Close(context.TODO())

	resultNum := cursor.RemainingBatchLength()
	var result = make([]model.Vm, resultNum)
	i := 0
	for cursor.Next(context.TODO()) {
		err := cursor.Decode(&result[i])
		if err != nil {
			return nil, err
		}
		i++
	}

	//Nasconde la password
	// for index := range result {

	// 	result[index].Password = ""

	// }

	return result, nil

}

func GetVmsByState(state string) ([]model.Vm, error) {

	cursor, err := db.GetDBCollection(vmsCollectionName).Find(context.TODO(), bson.D{{Key: "state", Value: state}})

	if err != nil {
		return nil, err
	}

	defer cursor.Close(context.TODO())

	resultNum := cursor.RemainingBatchLength()
	var result = make([]model.Vm, resultNum)
	i := 0
	for cursor.Next(context.TODO()) {
		err := cursor.Decode(&result[i])
		if err != nil {
			return nil, err
		}
		i++
	}

	//Nasconde la password
	// for index := range result {

	// 	result[index].Password = ""

	// }

	return result, nil

}

func IfExistByName(name string) (bool, error) {

	cursor, err := db.GetDBCollection(vmsCollectionName).Find(context.TODO(), bson.D{{Key: "name", Value: name}})

	if err != nil {
		return true, err
	}

	defer cursor.Close(context.TODO())

	if cursor.RemainingBatchLength() == 0 {
		return false, nil
	} else {
		return true, nil
	}
}

func InsertVm(vm model.Vm) error {

	stringId := fmt.Sprintf("%s_%s_%s", vm.Name, "vms", time.Now().String())

	id := fmt.Sprintf("%x", md5.Sum([]byte(stringId)))

	fmt.Printf("%x\n", md5.Sum([]byte(stringId)))

	vm.Resource.Id = id
	vm.Resource.Type = "vms"

	_, err := db.GetDBCollection(vmsCollectionName).InsertOne(context.TODO(), vm)

	if err != nil {
		return err
	}

	// _, err = db.GetDBCollection(resCollectionName).InsertOne(context.TODO(), vm)

	// if err != nil {
	// 	return err
	// }

	return nil
}

func DeleteVm(id string) error {

	_, err := db.GetDBCollection(vmsCollectionName).DeleteOne(context.TODO(), bson.D{{Key: "id", Value: id}})

	if err != nil {
		return err
	}
	return nil
}

func DeleteVmByName(name string) error {

	_, err := db.GetDBCollection(vmsCollectionName).DeleteOne(context.TODO(), bson.D{{Key: "name", Value: name}})

	if err != nil {
		return err
	}
	return nil
}

func UpdateVm(id string, update interface{}) error {

	_, err := db.GetDBCollection(vmsCollectionName).UpdateOne(context.TODO(), bson.D{{Key: "id", Value: id}}, update)

	if err != nil {
		return err
	}
	return nil
}

func UpdateVmByName(name string, update interface{}) error {

	fmt.Println(name)

	_, err := db.GetDBCollection(vmsCollectionName).UpdateOne(context.TODO(), bson.M{"name": bson.M{"$eq": name}}, update)

	if err != nil {
		return err
	}
	return nil
}

func GetVmsByTags(tags []string) ([]model.Vm, error) {

	cursor, err := db.GetDBCollection(vmsCollectionName).Find(context.TODO(), bson.M{"tags": bson.M{"$in": tags}})

	if err != nil {
		return nil, err
	}

	defer cursor.Close(context.TODO())

	resultNum := cursor.RemainingBatchLength()
	var result = make([]model.Vm, resultNum)
	i := 0
	for cursor.Next(context.TODO()) {
		err := cursor.Decode(&result[i])
		if err != nil {
			return nil, err
		}
		i++
	}

	//Nasconde la password
	// for index := range result {

	// 	result[index].Password = ""

	// }

	return result, nil
}

func GetVmsInUseByTags(tags []string) ([]model.Vm, error) {

	// TODO: verificarne il funzionamento
	cursor, err := db.GetDBCollection(vmsCollectionName).Find(context.TODO(), bson.M{"inuse": bson.M{"$eq": "true"}, "tags": bson.M{"$in": tags}})

	if err != nil {
		return nil, err
	}

	defer cursor.Close(context.TODO())

	resultNum := cursor.RemainingBatchLength()
	var result = make([]model.Vm, resultNum)
	i := 0
	for cursor.Next(context.TODO()) {
		err := cursor.Decode(&result[i])
		if err != nil {
			return nil, err
		}
		i++
	}

	return result, nil
}

func GetVmByResourceId(resourceId string) (model.Vm, error) {

	var result model.Vm

	cursor, err := db.GetDBCollection(vmsCollectionName).Find(context.TODO(), bson.D{{Key: "resource.id", Value: resourceId}})
	if err != nil {
		return result, err
	}
	defer cursor.Close(context.TODO())

	resultNum := cursor.RemainingBatchLength()
	if resultNum <= 0 {
		return result, errors.New("VM NOT EXIST")
	}

	var resultArray = make([]model.Vm, resultNum)
	i := 0
	for cursor.Next(context.TODO()) {
		err := cursor.Decode(&resultArray[i])
		if err != nil {
			return result, err
		}
		i++
	}

	//Nasconde la password
	// for index := range result {

	// 	result[index].Password = ""

	// }

	return resultArray[0], nil
}

func GetVmByProviderAccount(account string) ([]model.Vm, error) {

	var result []model.Vm

	cursor, err := db.GetDBCollection(vmsCollectionName).Find(context.TODO(), bson.D{{Key: "account", Value: account}})
	if err != nil {
		return result, err
	}
	defer cursor.Close(context.TODO())

	resultNum := cursor.RemainingBatchLength()
	if resultNum <= 0 {
		return result, nil
	}

	var resultArray = make([]model.Vm, resultNum)
	i := 0
	for cursor.Next(context.TODO()) {
		err := cursor.Decode(&resultArray[i])
		if err != nil {
			return result, err
		}
		i++
	}

	return resultArray, nil
}
