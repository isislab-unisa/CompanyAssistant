package db

import (
	"context"
	"fmt"
	"os"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

var Client *mongo.Client

func InitClient() (*mongo.Client, error) {

	godotenv.Load()

	var err error

	//ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

	Client, err = mongo.Connect(context.TODO(), clientOptions(os.Getenv("DB_USR"), os.Getenv("DB_PWS")))
	if err != nil {
		return nil, err
	}

	// Ping the primary
	if err = Client.Ping(context.TODO(), readpref.Primary()); err != nil {
		return nil, err
	}

	return Client, nil
}

func GetDBCollection(name string) *mongo.Collection {

	return Client.Database("assistant").Collection(name)

}

func clientOptions(usr string, pwd string) *options.ClientOptions {
	fmt.Println("DB address: " + os.Getenv("DB_ADDRESS"))
	host := os.Getenv("DB_ADDRESS")
	return options.Client().ApplyURI(
		"mongodb://" + usr + ":" + pwd + "@" + host + ":27017",
	)
}
