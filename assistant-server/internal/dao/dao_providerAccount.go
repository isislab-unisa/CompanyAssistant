package dao

import (
	"context"
	"errors"
	"fmt"
	"server/internal/db"

	"go.mongodb.org/mongo-driver/bson"
)

const providerAccountCollectionName = "providerAccounts"

func GetAllProviderAccount() ([]byte, error) {

	cursor, err := db.GetDBCollection(providerAccountCollectionName).Find(context.TODO(), bson.D{{}})

	if err != nil {
		fmt.Println("Errore")
		return nil, err
	}

	defer cursor.Close(context.TODO())

	var result []byte
	for cursor.Next(context.TODO()) {
		result = append(result, []byte(cursor.Current.String())...)
	}

	return result, nil

}

func InsertProviderAccount(account string) error {

	var bdoc interface{}
	err := bson.UnmarshalExtJSON([]byte(account), true, &bdoc)
	if err != nil {
		return err
	}

	// stringId := fmt.Sprintf("%s_%s_%s", bdoc.name, "users", time.Now().String())

	// id := fmt.Sprintf("%x", md5.Sum([]byte(stringId)))

	// var resource model.Resource

	// resource.Id = id
	// resource.Type = "providerAccounts"

	// bdoc.resource = resource
	_, err = db.GetDBCollection(providerAccountCollectionName).InsertOne(context.TODO(), bdoc)

	if err != nil {
		return err
	}
	return nil

}

func EditProviderAccount(name string, account string) error {

	var bdoc interface{}
	err := bson.UnmarshalExtJSON([]byte(account), true, &bdoc)
	if err != nil {
		fmt.Println(err)
		return err
	}

	fmt.Println(" --- Acc --- ")
	fmt.Println(account)
	fmt.Println(" --- --- --- ")

	_, err = db.GetDBCollection(providerAccountCollectionName).UpdateOne(context.TODO(), bson.M{"name": bson.M{"$eq": name}}, bson.M{"$set": bdoc})

	if err != nil {
		fmt.Println(err.Error())
		return err
	}
	return nil

}

func GetProviderAccountByName(name string) (bson.Raw, error) {

	singleResult := db.GetDBCollection(providerAccountCollectionName).FindOne(context.TODO(), bson.D{{Key: "name", Value: name}})

	if singleResult == nil {
		return nil, errors.New("Impossible to find account with id: " + name)
	}

	result, err := singleResult.DecodeBytes()

	if err != nil {
		return nil, errors.New("GetProviderAccountByName: " + err.Error())
	}
	fmt.Println(name)
	fmt.Println(singleResult)
	return result, nil

}

func GetProviderAccountNames() ([]map[string]interface{}, error) {

	cursor, err := db.GetDBCollection(providerAccountCollectionName).Find(context.TODO(), bson.D{{}})

	if err != nil {
		fmt.Println("Errore")
		return nil, err
	}

	defer cursor.Close(context.TODO())

	var result []map[string]interface{}
	for cursor.Next(context.TODO()) {
		name := cursor.Current.Lookup("name").StringValue()
		provider := cursor.Current.Lookup("provider").StringValue()
		result = append(result, map[string]interface{}{"name": name, "provider": provider})
	}

	return result, nil

}

func DeleteProviderAccountByName(name string) error {

	_, err := db.GetDBCollection(providerAccountCollectionName).DeleteOne(context.TODO(), bson.D{{Key: "name", Value: name}})

	if err != nil {
		return err
	}
	return nil
}

// func GetVmTypeById(id string) (bson.Raw, error) {

// 	singleResult := db.GetDBCollection(vmTypeCollectionName).FindOne(context.TODO(), bson.D{{Key: "id", Value: id}})

// 	if singleResult == nil {
// 		return nil, errors.New("Impossible to find vm type with id: " + id)
// 	}

// 	result, err := singleResult.DecodeBytes()
// 	if err != nil {

// 		return nil, err

// 	}
// 	// 	result.Password = ""

// 	return result, nil

// }
