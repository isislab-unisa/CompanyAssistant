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

const groupCollectionName = "groups"

func GetAllGroups() ([]model.Group, error) {

	cursor, err := db.GetDBCollection(groupCollectionName).Find(context.TODO(), bson.D{{}})

	if err != nil {
		return nil, err
	}

	defer cursor.Close(context.TODO())

	resultNum := cursor.RemainingBatchLength()
	var result = make([]model.Group, resultNum)
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

func GetGroupByName(name string) ([]model.Group, error) {

	cursor, err := db.GetDBCollection(groupCollectionName).Find(context.TODO(), bson.D{{Key: "name", Value: name}})

	if err != nil {
		return nil, err
	}

	defer cursor.Close(context.TODO())

	resultNum := cursor.RemainingBatchLength()
	var result = make([]model.Group, resultNum)
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

func GetGroupByListNames(names []string) ([]model.Group, error) {

	cursor, err := db.GetDBCollection(groupCollectionName).Find(context.TODO(), bson.M{"name": bson.M{"$in": names}})

	if err != nil {
		return nil, err
	}

	defer cursor.Close(context.TODO())

	resultNum := cursor.RemainingBatchLength()
	var result = make([]model.Group, resultNum)
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

func IfGroupExistByName(name string) (bool, error) {

	cursor, err := db.GetDBCollection(groupCollectionName).Find(context.TODO(), bson.D{{Key: "name", Value: name}})

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

func InsertGroup(group model.Group) error {

	stringId := fmt.Sprintf("%s_%s_%s", group.Name, "groups", time.Now().String())

	id := fmt.Sprintf("%x", md5.Sum([]byte(stringId)))

	fmt.Printf("%x\n", md5.Sum([]byte(stringId)))

	group.Resource.Id = id
	group.Resource.Type = "groups"

	_, err := db.GetDBCollection(groupCollectionName).InsertOne(context.TODO(), group)

	if err != nil {
		return err
	}

	return nil
}

func DeleteGroupByName(name string) error {

	_, err := db.GetDBCollection(groupCollectionName).DeleteOne(context.TODO(), bson.D{{Key: "name", Value: name}})

	if err != nil {
		return err
	}
	return nil
}

func UpdateGroupTags(name string, tags []string) error {

	_, err := db.GetDBCollection(groupCollectionName).UpdateOne(context.TODO(), bson.M{"name": bson.M{"$eq": name}}, bson.M{"$set": bson.M{"tags": tags}})

	if err != nil {
		return err
	}

	return nil
}

func GetGroupByResourceId(resourceId string) (model.Group, error) {

	var result model.Group

	cursor, err := db.GetDBCollection(groupCollectionName).Find(context.TODO(), bson.D{{Key: "resource.id", Value: resourceId}})
	if err != nil {
		return result, err
	}
	defer cursor.Close(context.TODO())

	resultNum := cursor.RemainingBatchLength()
	if resultNum > 0 {
		var resultArray = make([]model.Group, resultNum)
		i := 0
		for cursor.Next(context.TODO()) {
			err := cursor.Decode(&resultArray[i])
			if err != nil {
				return result, err
			}
			i++
		}
		return resultArray[0], nil
	}
	return result, errors.New("GROUP NOT EXIST")

}
