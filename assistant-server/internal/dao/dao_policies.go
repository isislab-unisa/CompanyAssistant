package dao

import (
	"context"
	"server/internal/db"
	"server/internal/model"

	"go.mongodb.org/mongo-driver/bson"
)

const policiesCollectionName = "policies"

func GetAllPolicies() ([]model.Policy, error) {

	cursor, err := db.GetDBCollection(policiesCollectionName).Find(context.TODO(), bson.D{{}})

	if err != nil {
		return nil, err
	}

	defer cursor.Close(context.TODO())

	resultNum := cursor.RemainingBatchLength()
	var result = make([]model.Policy, resultNum)
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

func GetPoliciesByName(name string) ([]model.Policy, error) {

	cursor, err := db.GetDBCollection(policiesCollectionName).Find(context.TODO(), bson.D{{Key: "name", Value: name}})

	if err != nil {
		return nil, err
	}

	defer cursor.Close(context.TODO())

	resultNum := cursor.RemainingBatchLength()
	var result = make([]model.Policy, resultNum)
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

func GetPoliciesByListNamesAndType(names []string, resourceType string) ([]model.Policy, error) {

	cursor, err := db.GetDBCollection(policiesCollectionName).Find(context.TODO(), bson.M{"$and": bson.A{bson.M{"resourceType": bson.M{"$eq": resourceType}}, bson.M{"name": bson.M{"$in": names}}}})

	if err != nil {
		return nil, err
	}

	defer cursor.Close(context.TODO())

	resultNum := cursor.RemainingBatchLength()
	var result = make([]model.Policy, resultNum)
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

func GetPoliciesByType(resourceType string) ([]model.Policy, error) {

	cursor, err := db.GetDBCollection(policiesCollectionName).Find(context.TODO(), bson.D{{Key: "resourceType", Value: resourceType}})

	if err != nil {
		return nil, err
	}

	defer cursor.Close(context.TODO())

	resultNum := cursor.RemainingBatchLength()
	var result = make([]model.Policy, resultNum)
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

func IfPolicyExistByName(name string) (bool, error) {

	cursor, err := db.GetDBCollection(policiesCollectionName).Find(context.TODO(), bson.D{{Key: "name", Value: name}})

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
