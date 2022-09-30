package dao

import (
	"context"
	"fmt"
	"server/internal/db"
	"server/internal/model"

	"go.mongodb.org/mongo-driver/bson"
)

const providerPatametersCollectionName = "providerParameters"

func GetAllProviderParameters() ([]model.ProviderParameters, error) {

	cursor, err := db.GetDBCollection(providerPatametersCollectionName).Find(context.TODO(), bson.D{{}})

	if err != nil {
		fmt.Println("Errore")
		return nil, err
	}

	defer cursor.Close(context.TODO())

	resultNum := cursor.RemainingBatchLength()
	var result = make([]model.ProviderParameters, resultNum)
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
