package notificationsystem

import (
	"testing"
)

func TestHelloMqtt(t *testing.T) {
	PublishMessage("topic1", "we")
}
