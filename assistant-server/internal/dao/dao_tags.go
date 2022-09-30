package dao

import (
	"context"
	"server/internal/db"
	"server/internal/model"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const tagsCollectionName = "tags"

func GetAllTags() ([]model.Tag, error) {

	cursor, err := db.GetDBCollection(tagsCollectionName).Find(context.TODO(), bson.D{{}})

	if err != nil {
		return nil, err
	}

	defer cursor.Close(context.TODO())

	resultNum := cursor.RemainingBatchLength()
	var result = make([]model.Tag, resultNum)
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

func GetAllTagsByGroups(groups []model.Group) ([]model.Tag, error) {

	cursor, err := db.GetDBCollection(tagsCollectionName).Find(context.TODO(), bson.D{{}})

	if err != nil {
		return nil, err
	}

	defer cursor.Close(context.TODO())

	resultNum := cursor.RemainingBatchLength()
	var result = make([]model.Tag, resultNum)
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

func InsertTag(tag model.Tag) error {

	_, err := db.GetDBCollection(tagsCollectionName).UpdateOne(context.TODO(), bson.M{"name": bson.M{"$eq": tag.Name}}, bson.M{"$set": bson.M{"name": tag.Name}}, options.Update().SetUpsert(true))

	if err != nil {
		return err
	}

	return nil
}
