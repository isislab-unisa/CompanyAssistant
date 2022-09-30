package notificationsystem

import (
	"crypto/tls"
	"crypto/x509"
	"fmt"
	"io/ioutil"
	"sync"

	mqtt "github.com/eclipse/paho.mqtt.golang"
)

var messagePubHandler mqtt.MessageHandler = func(client mqtt.Client, msg mqtt.Message) {
	messageToJson := msg.Payload()
	fmt.Printf("Received message: %s from topic: %s\n", messageToJson, msg.Topic())
	switch msg.Topic() {
	case "main":
		fmt.Println("two")
	default:
		fmt.Println("two")
	}
}

var connectHandler mqtt.OnConnectHandler = func(client mqtt.Client) {
	fmt.Println("Connected")
}

var connectLostHandler mqtt.ConnectionLostHandler = func(client mqtt.Client, err error) {
	fmt.Printf("Connect lost: %v", err)
}

var lock = &sync.Mutex{}

var clientInstance mqtt.Client

func connect() mqtt.Client {

	var broker = "93.41.148.169"
	var port = 8883
	opts := mqtt.NewClientOptions()
	opts.AddBroker(fmt.Sprintf("mqtts://%s:%d", broker, port))
	opts.SetClientID("go_mqtt_client")
	opts.SetDefaultPublishHandler(messagePubHandler)
	opts.OnConnect = connectHandler
	opts.OnConnectionLost = connectLostHandler
	opts.SetTLSConfig(newTlsConfig())
	client := mqtt.NewClient(opts)
	if token := client.Connect(); token.Wait() && token.Error() != nil {
		fmt.Println(token.Error())
	}
	sub(client, "main")
	return client
}

func sub(client mqtt.Client, topic string) {
	token := client.Subscribe(topic, 1, nil)
	token.Wait()
	fmt.Printf("Subscribed to topic: %s", topic)
}

func GetMqttClient() {
	if clientInstance == nil {
		lock.Lock()
		defer lock.Unlock()
		if clientInstance == nil {
			clientInstance = connect()
		} else {
			return
		}
	} else {
		return
	}
}

func PublishMessage(topic, message string) {
	GetMqttClient()
	fmt.Println("Topic: " + topic + " mess: " + message)
	token := clientInstance.Publish(topic, 2, false, message)
	token.Wait()
}

func newTlsConfig() *tls.Config {
	certpool := x509.NewCertPool()
	ca, err := ioutil.ReadFile("")
	if err != nil {
		fmt.Println(err.Error())
	}
	certpool.AppendCertsFromPEM(ca)
	// Import client certificate/key pair
	clientKeyPair, err := tls.LoadX509KeyPair("", "")
	if err != nil {
		fmt.Println(err.Error())
	}
	return &tls.Config{
		RootCAs:            certpool,
		ClientAuth:         tls.NoClientCert,
		ClientCAs:          nil,
		InsecureSkipVerify: true,
		Certificates:       []tls.Certificate{clientKeyPair},
	}
}
