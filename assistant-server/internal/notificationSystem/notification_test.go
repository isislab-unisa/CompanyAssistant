package notificationsystem

import (
	"testing"

	"github.com/joho/godotenv"
)

func TestHello(t *testing.T) {
	godotenv.Load()
	message := `{
		"actionType": "createStorage",
		"name": "22xs2sswsw",
		"key": "x122s3s4"
	}`

	//SendMessage("Mario")
	SendMessageOnAQueue("gateway-companyassistant", message)

}
