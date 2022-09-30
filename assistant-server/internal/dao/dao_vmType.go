package dao

import (
	"context"
	"errors"
	"fmt"
	"server/internal/db"
	"server/internal/model"

	"go.mongodb.org/mongo-driver/bson"
)

const vmTypeCollectionName = "vmTypes"

func GetAllVmTypes() ([]model.VmType, error) {

	cursor, err := db.GetDBCollection(vmTypeCollectionName).Find(context.TODO(), bson.D{{}})

	if err != nil {
		fmt.Println("Errore")
		return nil, err
	}

	defer cursor.Close(context.TODO())

	resultNum := cursor.RemainingBatchLength()
	var result = make([]model.VmType, resultNum)
	i := 0
	for cursor.Next(context.TODO()) {
		err := cursor.Decode(&result[i])
		if err != nil {
			fmt.Println("Errore Decode: " + err.Error())
			return nil, err
		}
		i++
	}

	return result, nil

}

func GetVmTypeById(id string) (bson.Raw, error) {

	singleResult := db.GetDBCollection(vmTypeCollectionName).FindOne(context.TODO(), bson.D{{Key: "id", Value: id}})

	if singleResult == nil {
		return nil, errors.New("Impossible to find vm type with id: " + id)
	}

	result, err := singleResult.DecodeBytes()
	if err != nil {

		return nil, err

	}
	// 	result.Password = ""

	return result, nil

}
