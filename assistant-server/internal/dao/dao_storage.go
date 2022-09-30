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

const storageCollectionName = "storage"

func GetAllStorages() ([]model.Storage, error) {

	cursor, err := db.GetDBCollection(storageCollectionName).Find(context.TODO(), bson.D{{}})

	if err != nil {
		return nil, err
	}

	defer cursor.Close(context.TODO())

	resultNum := cursor.RemainingBatchLength()
	var result = make([]model.Storage, resultNum)
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

func GetStorageById(id string) (*model.Storage, error) {

	singleResult := db.GetDBCollection(storageCollectionName).FindOne(context.TODO(), bson.D{{Key: "id", Value: id}})

	if singleResult == nil {
		return nil, errors.New("Impossible to find storage with id: " + id)
	}

	var result model.Storage
	err := singleResult.Decode(&result)
	if err != nil {

		return nil, err

	}

	return &result, nil

}

func GetStorageByName(name string) ([]model.Storage, error) {

	cursor, err := db.GetDBCollection(storageCollectionName).Find(context.TODO(), bson.D{{Key: "name", Value: name}})

	if err != nil {
		return nil, err
	}

	defer cursor.Close(context.TODO())

	resultNum := cursor.RemainingBatchLength()
	var result = make([]model.Storage, resultNum)
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

func IfStorageExistByName(name string) (bool, error) {

	cursor, err := db.GetDBCollection(storageCollectionName).Find(context.TODO(), bson.D{{Key: "name", Value: name}})

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

func InsertStorage(storage model.Storage) error {

	stringId := fmt.Sprintf("%s_%s_%s", storage.Name, "storage", time.Now().String())

	id := fmt.Sprintf("%x", md5.Sum([]byte(stringId)))

	fmt.Printf("%x\n", md5.Sum([]byte(stringId)))

	storage.Resource.Id = id
	storage.Resource.Type = "storage"

	_, err := db.GetDBCollection(storageCollectionName).InsertOne(context.TODO(), storage)

	if err != nil {
		return err
	}

	return nil
}

func DeleteStorage(id string) error {

	_, err := db.GetDBCollection(storageCollectionName).DeleteOne(context.TODO(), bson.D{{Key: "id", Value: id}})

	if err != nil {
		return err
	}
	return nil
}

func DeleteStorageByName(name string) error {

	_, err := db.GetDBCollection(storageCollectionName).DeleteOne(context.TODO(), bson.D{{Key: "name", Value: name}})

	if err != nil {
		return err
	}
	return nil
}

func UpdateStorage(id string, update interface{}) error {

	_, err := db.GetDBCollection(storageCollectionName).UpdateOne(context.TODO(), bson.D{{Key: "id", Value: id}}, update)

	if err != nil {
		return err
	}
	return nil
}

func UpdateStorageByName(name string, update interface{}) error {

	fmt.Println(name)

	_, err := db.GetDBCollection(storageCollectionName).UpdateOne(context.TODO(), bson.M{"name": bson.M{"$eq": name}}, update)

	if err != nil {
		return err
	}
	return nil
}

func GetStorageByTags(tags []string) ([]model.Storage, error) {

	cursor, err := db.GetDBCollection(storageCollectionName).Find(context.TODO(), bson.M{"tags": bson.M{"$in": tags}})

	if err != nil {
		return nil, err
	}

	defer cursor.Close(context.TODO())

	resultNum := cursor.RemainingBatchLength()
	var result = make([]model.Storage, resultNum)
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

func GetStorageByResourceId(resourceId string) (model.Storage, error) {

	var result model.Storage

	cursor, err := db.GetDBCollection(storageCollectionName).Find(context.TODO(), bson.D{{Key: "resource.id", Value: resourceId}})
	if err != nil {
		return result, err
	}
	defer cursor.Close(context.TODO())

	resultNum := cursor.RemainingBatchLength()
	if resultNum <= 0 {
		return result, errors.New("SATORAGE NOT EXIST")
	}

	var resultArray = make([]model.Storage, resultNum)
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
