package assistant_aws

import (
	b64 "encoding/base64"
	"fmt"
	"io/ioutil"
	"os"
	"server/internal/dao"
	"server/internal/model"
	"strings"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ec2"
	"github.com/aws/aws-sdk-go/service/storagegateway"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
)

type Assistant_aws struct{}

func (a *Assistant_aws) CreateVM(vm *model.Vm, account *bson.Raw) (string, error) {

	godotenv.Load()

	content, err := ioutil.ReadFile("init.sh")

	if err != nil {
		return "", err
	}

	stringCommand := string(content)
	command := strings.Replace(stringCommand, "vmName", vm.Name, -1)
	command = strings.Replace(command, "vmUser", vm.Username, -1)
	command = strings.Replace(command, "userPassword", vm.Password, -1)
	command = strings.Replace(command, "serverIp", os.Getenv("SERVER_EXSTERNAL_URL"), -1)

	commandB64 := b64.StdEncoding.EncodeToString([]byte(command))

	sess, err := getSession(account)

	if err != nil {
		fmt.Println("Could not create aws session", err)
		return "", err
	}

	vmTypes, err := dao.GetVmTypeById(vm.VmType)

	if err != nil {
		return "", err
	}

	svc := ec2.New(sess)

	runResult, err := svc.RunInstances(&ec2.RunInstancesInput{
		ImageId:      aws.String(vmTypes.Lookup("image").StringValue()),
		InstanceType: aws.String(vmTypes.Lookup("instanceType").StringValue()),
		MinCount:     aws.Int64(1),
		MaxCount:     aws.Int64(1),
		KeyName:      aws.String(account.Lookup("key_pair").StringValue()),
		UserData:     aws.String(commandB64),
	})

	if err != nil {
		fmt.Println("Could not create instance", err)
		return "", err
	}

	vm.Id = *runResult.Instances[0].InstanceId
	vm.State = "In creation"
	vm.InUse = false
	vm.Description = "Descrizione da aggiungere"

	return vm.Id, nil

}

func getSession(account *bson.Raw) (*session.Session, error) {
	// aws.NewConfig().WithEC2MetadataDisableTimeoutOverride(true).WithCredentialsChainVerboseErrors(true))
	// svc := sts.New(session.New(
	// 	&aws.Config{
	// 		Region: aws.String("us-east-1"),
	// 	}))
	// input := &sts.GetSessionTokenInput{
	// 	DurationSeconds: aws.Int64(3600),
	// 	SerialNumber:    aws.String(""),
	// 	TokenCode:       aws.String("541270"),
	// }

	// result, err := svc.GetSessionToken(input)
	// if err != nil {
	// 	fmt.Println(err.Error())
	// }

	// fmt.Printf(result.String())
	// mfaDeviceArn := ""
	// mfaCode := "230303"

	// fmt.Println("MFA Device ARN is ", mfaDeviceArn, " and MFA code is ", mfaCode)

	// fmt.Println("Initiating Session with AWS")
	// sess, err := session.NewSession()

	// if err != nil {
	// 	fmt.Println("Error creating session ", err)
	// 	return nil, err
	// }
	// fmt.Println("Constructing a Service Client with STS")
	// stsClient := sts.New(sess)
	// params := &sts.GetSessionTokenInput{
	// 	DurationSeconds: aws.Int64(36000),
	// 	SerialNumber:    &mfaDeviceArn,
	// 	TokenCode:       &mfaCode,
	// }
	// // sending a request using the GetSessionTokenRequest method.
	// req, resp := stsClient.GetSessionTokenRequest(params)
	// err = req.Send()
	// if err != nil {
	// 	fmt.Println(err)
	// 	return nil, err
	// }
	// fmt.Println("Printing Session Token:")
	// fmt.Println(resp.Credentials)

	return session.NewSession(&aws.Config{
		Region:      aws.String(account.Lookup("region").StringValue()),
		Credentials: credentials.NewStaticCredentials(account.Lookup("access_key").StringValue(), account.Lookup("secret_access_key").StringValue(), account.Lookup("session_token").StringValue()),
	})
}

func (a *Assistant_aws) DeleteVM(vm model.Vm, account *bson.Raw) error {

	godotenv.Load()

	sess, err := getSession(account)

	if err != nil {
		fmt.Println("Could not create aws session", err)
		return err
	}

	svc := ec2.New(sess)

	_, err = svc.TerminateInstances(&ec2.TerminateInstancesInput{
		InstanceIds: []*string{
			aws.String(vm.Id),
		},
	})

	if err != nil {
		fmt.Println("Could not delete instance", err)
		return err
	}

	fmt.Println("Deleted instance")

	err = dao.DeleteVm(vm.Id)
	if err != nil {
		return err
	}
	return nil

}

func (a *Assistant_aws) StopVM(vm *model.Vm, account *bson.Raw) error {

	godotenv.Load()

	sess, err := getSession(account)

	if err != nil {
		fmt.Println("Could not create aws session", err)
		return err
	}

	svc := ec2.New(sess)

	_, err = svc.StopInstances(&ec2.StopInstancesInput{
		InstanceIds: []*string{
			aws.String(vm.Id),
		},
	})

	if err != nil {
		fmt.Println("Could not stop instance", err)
		return err
	}

	fmt.Println("Stopped instance: " + vm.Id)
	return nil

}

func (a *Assistant_aws) StartVM(vm *model.Vm, account *bson.Raw) error {

	godotenv.Load()

	sess, err := getSession(account)

	if err != nil {
		fmt.Println("Could not create aws session", err)
		return err
	}

	svc := ec2.New(sess)

	_, err = svc.StartInstances(&ec2.StartInstancesInput{
		InstanceIds: []*string{
			aws.String(vm.Id),
		},
	})

	if err != nil {
		fmt.Println("Could not start instance", err)
		return err
	}

	fmt.Println("Stopped instance: " + vm.Id)
	return nil
}

func (a *Assistant_aws) CheckStatus(account *bson.Raw) error {

	godotenv.Load()

	sess, err := getSession(account)

	if err != nil {
		fmt.Println("Could not create aws session", err)
		return err
	}

	svc := ec2.New(sess)

	_, err = svc.DescribeInstances(&ec2.DescribeInstancesInput{})

	if err != nil {
		fmt.Println("Could not delete instance", err)
		return err
	}

	fmt.Println("Deleted instance")

	if err != nil {
		return err
	}
	return nil

}

func (a *Assistant_aws) CreateStorage(storage *model.Storage, account *bson.Raw) (string, error) {
	godotenv.Load()

	sess, err := getSession(account)

	if err != nil {
		fmt.Println("Could not create aws session", err)
		return "", err
	}

	fmt.Println("Creo StorageGateway")

	svc := storagegateway.New(sess)
	res, err := svc.ActivateGateway(&storagegateway.ActivateGatewayInput{
		ActivationKey:   aws.String("V83B2-63ASG-3DSE7-H3H3I-F6HAN"),
		GatewayName:     aws.String("compgateway"),
		GatewayTimezone: aws.String("GMT+1:00"),
		GatewayRegion:   aws.String("us-east-1"),
		GatewayType:     aws.String("FILE_S3"),
	})

	if err != nil {
		fmt.Println("Could not create gateway", err)
		return "", err
	}

	fmt.Println(res.String())

	// (func(c *StorageGateway) ActivateGateway)(input*ActivateGatewayInput)(*ActivateGatewayOutput, error)

	return "", nil

}

func (a *Assistant_aws) DeleteStorage(storage *model.Storage, account *bson.Raw) error {
	//TODO
	return nil
}
