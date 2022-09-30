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

const userCollectionName = "users"

func GetAllUsers() ([]model.User, error) {

	cursor, err := db.GetDBCollection(userCollectionName).Find(context.TODO(), bson.D{{}})

	if err != nil {
		return nil, err
	}

	defer cursor.Close(context.TODO())

	resultNum := cursor.RemainingBatchLength()
	var result = make([]model.User, resultNum)
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

func GetUserByUsername(username string) ([]model.User, error) {

	cursor, err := db.GetDBCollection(userCollectionName).Find(context.TODO(), bson.D{{Key: "username", Value: username}})

	if err != nil {
		return nil, err
	}

	defer cursor.Close(context.TODO())

	resultNum := cursor.RemainingBatchLength()
	var result = make([]model.User, resultNum)
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

func GetUserByName(name string) ([]model.User, error) {

	cursor, err := db.GetDBCollection(userCollectionName).Find(context.TODO(), bson.D{{Key: "name", Value: name}})

	if err != nil {
		return nil, err
	}

	defer cursor.Close(context.TODO())

	resultNum := cursor.RemainingBatchLength()
	var result = make([]model.User, resultNum)
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

func GetUserByLastname(lastname string) ([]model.User, error) {

	cursor, err := db.GetDBCollection(userCollectionName).Find(context.TODO(), bson.D{{Key: "lastname", Value: lastname}})

	if err != nil {
		return nil, err
	}

	defer cursor.Close(context.TODO())

	resultNum := cursor.RemainingBatchLength()
	var result = make([]model.User, resultNum)
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

func GetUserByUserType(userType string) ([]model.User, error) {

	cursor, err := db.GetDBCollection(userCollectionName).Find(context.TODO(), bson.D{{Key: "type", Value: userType}})

	if err != nil {
		return nil, err
	}

	defer cursor.Close(context.TODO())

	resultNum := cursor.RemainingBatchLength()
	var result = make([]model.User, resultNum)
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

func InsertUser(user model.User) error {

	stringId := fmt.Sprintf("%s_%s_%s", user.Username, "users", time.Now().String())

	id := fmt.Sprintf("%x", md5.Sum([]byte(stringId)))

	user.Resource.Id = id
	user.Resource.Type = "users"

	_, err := db.GetDBCollection(userCollectionName).InsertOne(context.TODO(), user)

	if err != nil {
		return err
	}
	return nil
}

func DeleteUser(username string) error {

	_, err := db.GetDBCollection(userCollectionName).DeleteOne(context.TODO(), bson.D{{Key: "username", Value: username}})

	if err != nil {
		return err
	}
	return nil
}

func GetUserByUserGroups(groupsNames []string) ([]model.User, error) {

	cursor, err := db.GetDBCollection(userCollectionName).Find(context.TODO(), bson.M{"groups": bson.M{"$in": groupsNames}})

	if err != nil {
		return nil, err
	}

	defer cursor.Close(context.TODO())

	resultNum := cursor.RemainingBatchLength()
	var result = make([]model.User, resultNum)
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

func GetUserByResourceId(resourceId string) (model.User, error) {

	var result model.User

	cursor, err := db.GetDBCollection(userCollectionName).Find(context.TODO(), bson.D{{Key: "resource.id", Value: resourceId}})
	if err != nil {
		return result, err
	}
	defer cursor.Close(context.TODO())

	resultNum := cursor.RemainingBatchLength()
	if resultNum <= 0 {
		return result, errors.New("USER NOT EXIST")
	}

	var resultArray = make([]model.User, resultNum)
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

func UpdateUserGroups(user model.User) error {

	_, err := db.GetDBCollection(userCollectionName).UpdateOne(context.TODO(), bson.M{"username": bson.M{"$eq": user.Username}}, bson.M{"$set": bson.M{"groups": user.Groups}})

	if err != nil {
		return err
	}

	return nil
}
