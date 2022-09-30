package dao

import (
	"context"
	"server/internal/db"
	"server/internal/model"

	"go.mongodb.org/mongo-driver/bson"
)

const rolesCollectionName = "roles"

func GetAllRoles() ([]model.Role, error) {

	cursor, err := db.GetDBCollection(rolesCollectionName).Find(context.TODO(), bson.D{{}})

	if err != nil {
		return nil, err
	}

	defer cursor.Close(context.TODO())

	resultNum := cursor.RemainingBatchLength()
	var result = make([]model.Role, resultNum)
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

func GetRolesByName(name string) ([]model.Role, error) {

	cursor, err := db.GetDBCollection(rolesCollectionName).Find(context.TODO(), bson.D{{Key: "name", Value: name}})

	if err != nil {
		return nil, err
	}

	defer cursor.Close(context.TODO())

	resultNum := cursor.RemainingBatchLength()
	var result = make([]model.Role, resultNum)
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

func IfRoleExistByName(name string) (bool, error) {

	cursor, err := db.GetDBCollection(rolesCollectionName).Find(context.TODO(), bson.D{{Key: "name", Value: name}})

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

func InsertRole(role model.Role) error {

	_, err := db.GetDBCollection(rolesCollectionName).InsertOne(context.TODO(), role)

	if err != nil {
		return err
	}

	return nil
}

func DeleteRoleByName(name string) error {

	_, err := db.GetDBCollection(rolesCollectionName).DeleteOne(context.TODO(), bson.D{{Key: "name", Value: name}})

	if err != nil {
		return err
	}
	return nil
}
