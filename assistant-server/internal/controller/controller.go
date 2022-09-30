package controller

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"server/internal/db"
	"server/internal/model"
	"strings"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
)

func RegisterHandler(c *fiber.Ctx) {

	c.Response().Header.Set("Content-Type", "application/json")

	var user model.User

	user.Username = c.FormValue("username")
	user.Password = c.FormValue("password")
	user.LastName = c.FormValue("lastname")
	user.FirstName = c.FormValue("name")
	user.Type = c.FormValue("type")

	var res model.ResponseResult

	collection := db.GetDBCollection("users")

	/*if err != nil { //TODO
	res.Error = err.Error()
	json.NewEncoder(c.Response().BodyWriter()).Encode(res)
	return
	*/
	cursor, err := collection.Find(context.TODO(), bson.D{{Key: "username", Value: user.Username}})
	if err != nil {
		res.Result = err.Error()
		json.NewEncoder(c.Response().BodyWriter()).Encode(res)
		return
	}
	if cursor.RemainingBatchLength() > 0 {
		res.Result = "Username already Exists!!"
		json.NewEncoder(c.Response().BodyWriter()).Encode(res)
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(user.Password), 5)

	if err != nil {
		res.Error = "Error While Hashing Password, Try Again"
		json.NewEncoder(c.Response().BodyWriter()).Encode(res)
		return
	}
	user.Password = string(hash)

	_, err = collection.InsertOne(context.TODO(), user)
	if err != nil {
		res.Error = "Error While Creating User, Try Again"
		json.NewEncoder(c.Response().BodyWriter()).Encode(res)
		return
	}
	res.Result = "Registration Successful"
	json.NewEncoder(c.Response().BodyWriter()).Encode(res)
}

func LoginHandler(c *fiber.Ctx) {

	godotenv.Load()

	c.Response().Header.Set("Content-Type", "application/json")
	var user model.User

	user.Username = c.FormValue("username")
	user.Password = c.FormValue("password")

	collection := db.GetDBCollection("users")

	// if err != nil {
	// 	log.Fatal(err)
	// }
	var result model.User
	var res model.ResponseResult

	fmt.Println(user.Username)
	err := collection.FindOne(context.TODO(), bson.D{{Key: "username", Value: user.Username}}).Decode(&result)

	if err != nil {
		res.Error = "Invalid username"
		json.NewEncoder(c.Response().BodyWriter()).Encode(res)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(result.Password), []byte(user.Password))

	if err != nil {
		res.Error = "Invalid password"
		json.NewEncoder(c.Response().BodyWriter()).Encode(res)
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username":  result.Username,
		"firstname": result.FirstName,
		"lastname":  result.LastName,
		"role":      result.Role,
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))

	if err != nil {
		res.Error = "Error while generating token,Try again"
		json.NewEncoder(c.Response().BodyWriter()).Encode(res)
		return
	}

	result.Token = tokenString
	result.Password = ""

	json.NewEncoder(c.Response().BodyWriter()).Encode(result)

}

func VerifyUser(tokenString string) (model.User, error) {
	var result model.User
	godotenv.Load()
	tokenString = strings.Trim(tokenString, " ")
	if tokenString == "" {
		return result, errors.New("invalid token")
	}
	// c.Response().Header.Set("Content-Type", "application/json")
	// //w.Header().Set("Content-Type", "application/json")
	// tokenString := string(c.Request().Header.Peek("Authorization"))
	//tokenString := r.Header.Get("Authorization")
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	var res model.ResponseResult
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		result.Username = claims["username"].(string)
		result.FirstName = claims["firstname"].(string)
		result.LastName = claims["lastname"].(string)

		collection := db.GetDBCollection("users")

		err := collection.FindOne(context.TODO(), bson.D{{Key: "username", Value: result.Username}}).Decode(&result)

		if err != nil {
			return result, err
		}

		return result, nil
	} else {
		res.Error = err.Error()
		return result, err
	}

}
