package assistant_aws

import (
	"context"
	"fmt"
	"io/ioutil"
	"os"
	"server/internal/dao"
	"server/internal/model"
	"strings"

	compute "cloud.google.com/go/compute/apiv1"
	"cloud.google.com/go/storage"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"google.golang.org/api/option"
	computepb "google.golang.org/genproto/googleapis/cloud/compute/v1"
	"google.golang.org/protobuf/proto"
)

type Assistant_google struct{}

func (a *Assistant_google) CreateVM(vm *model.Vm, account *bson.Raw) (string, error) {

	vmTypes, err := dao.GetVmTypeById(vm.VmType)

	if err != nil {
		return "", err
	}

	projectID := account.Lookup("project_id").StringValue()
	zone := account.Lookup("region").StringValue()
	instanceName := vm.Name
	machineType := vmTypes.Lookup("instanceType").StringValue()
	sourceImage := vmTypes.Lookup("image").StringValue()
	networkName := "global/networks/default"

	startupFile, err := ioutil.ReadFile("init.sh")

	if err != nil {
		return "", err
	}

	startupScript := string(startupFile)
	startupScript = strings.Replace(startupScript, "vmName", vm.Name, -1)
	startupScript = strings.Replace(startupScript, "vmUser", vm.Username, -1)
	startupScript = strings.Replace(startupScript, "userPassword", vm.Password, -1)
	startupScript = strings.Replace(startupScript, "serverIp", os.Getenv("SERVER_EXSTERNAL_URL"), -1)

	godotenv.Load()
	ctx := context.Background()

	client, err := compute.NewInstancesRESTClient(ctx, option.WithCredentialsFile(os.Getenv("GOOGLE_APPLICATION_CREDENTIALS")))
	if err != nil {
		return "", err
	}
	defer client.Close()

	req := &computepb.InsertInstanceRequest{
		Project: projectID,
		Zone:    zone,
		InstanceResource: &computepb.Instance{
			Name: proto.String(instanceName),
			Disks: []*computepb.AttachedDisk{
				{
					InitializeParams: &computepb.AttachedDiskInitializeParams{
						DiskSizeGb:  proto.Int64(10),
						SourceImage: proto.String(sourceImage),
					},
					AutoDelete: proto.Bool(true),
					Boot:       proto.Bool(true),
					Type:       proto.String(computepb.AttachedDisk_PERSISTENT.String()),
				},
			},
			MachineType: proto.String(fmt.Sprintf("zones/%s/machineTypes/%s", zone, machineType)),
			NetworkInterfaces: []*computepb.NetworkInterface{
				{
					Name: proto.String(networkName),
					AccessConfigs: []*computepb.AccessConfig{
						{
							Name: proto.String("External NAT"),
							Type: proto.String("ONE_TO_ONE_NAT"),
						},
					},
				},
			},
			Metadata: &computepb.Metadata{
				Items: []*computepb.Items{
					{
						Key:   proto.String("startup-script"),
						Value: &startupScript,
					},
				},
			},
		},
	}

	op, err := client.Insert(ctx, req)
	if err != nil {
		return "", fmt.Errorf("unable to create instance: %v", err)
	}

	if err = op.Wait(ctx); err != nil {
		return "", fmt.Errorf("unable to wait for the operation: %v", err)
	}

	fmt.Printf("Instance created\n")

	return "", nil

}

func (a *Assistant_google) DeleteVM(vm model.Vm, account *bson.Raw) error {

	projectID := account.Lookup("project_id").StringValue()
	zone := account.Lookup("region").StringValue()
	instanceName := vm.Name
	ctx := context.Background()
	instancesClient, err := compute.NewInstancesRESTClient(ctx)
	if err != nil {
		return fmt.Errorf("NewInstancesRESTClient: %v", err)
	}
	defer instancesClient.Close()

	req := &computepb.DeleteInstanceRequest{
		Project:  projectID,
		Zone:     zone,
		Instance: instanceName,
	}

	op, err := instancesClient.Delete(ctx, req)
	if err != nil {
		return fmt.Errorf("unable to delete instance: %v", err)
	}

	if err = op.Wait(ctx); err != nil {
		return fmt.Errorf("unable to wait for the operation: %v", err)
	}

	fmt.Printf("Instance deleted\n")

	return nil

}

func (a *Assistant_google) StopVM(vm *model.Vm, account *bson.Raw) error {

	projectID := account.Lookup("project_id").StringValue()
	zone := account.Lookup("region").StringValue()

	godotenv.Load()
	ctx := context.Background()

	client, err := compute.NewInstancesRESTClient(ctx, option.WithCredentialsFile(os.Getenv("GOOGLE_APPLICATION_CREDENTIALS")))
	if err != nil {
		return err
	}
	defer client.Close()

	req := &computepb.StopInstanceRequest{
		Instance: vm.Name,
		Project:  projectID,
		Zone:     zone,
	}

	op, err := client.Stop(ctx, req)
	if err != nil {
		return fmt.Errorf("unable to chenge machine type: %v", err)
	}

	if err = op.Wait(ctx); err != nil {
		return fmt.Errorf("unable to wait for the operation: %v", err)
	}

	fmt.Printf("Machien type changed\n")

	return nil

}

func (a *Assistant_google) StartVM(vm *model.Vm, account *bson.Raw) error {

	projectID := account.Lookup("project_id").StringValue()
	zone := account.Lookup("region").StringValue()

	godotenv.Load()
	ctx := context.Background()

	client, err := compute.NewInstancesRESTClient(ctx, option.WithCredentialsFile(os.Getenv("GOOGLE_APPLICATION_CREDENTIALS")))
	if err != nil {
		return err
	}
	defer client.Close()

	req := &computepb.StartInstanceRequest{
		Instance: vm.Name,
		Project:  projectID,
		Zone:     zone,
	}

	op, err := client.Start(ctx, req)
	if err != nil {
		return fmt.Errorf("unable to chenge machine type: %v", err)
	}

	if err = op.Wait(ctx); err != nil {
		return fmt.Errorf("unable to wait for the operation: %v", err)
	}

	fmt.Printf("Machien type changed\n")

	return nil
}

func (a *Assistant_google) CheckStatus(account *bson.Raw) error {

	return nil

}

func (a *Assistant_google) CreateStorage(storage *model.Storage, account *bson.Raw) (string, error) {

	_, err := createStorage(storage, account)

	if err != nil {
		return "", err
	}

	return "", nil

}

func createStorage(newStorage *model.Storage, account *bson.Raw) (string, error) {

	projectID := account.Lookup("project_id").StringValue()
	//zone := account.Lookup("region").StringValue()
	//accountName := account.Lookup("name").StringValue()

	//diskSize, _ := strconv.Atoi(storage.Size)

	godotenv.Load()
	ctx := context.Background()

	client, err := storage.NewClient(ctx, option.WithCredentialsFile(os.Getenv("GOOGLE_APPLICATION_CREDENTIALS")))
	if err != nil {
		return "", err
	}

	defer client.Close()

	storageClassAndLocation := &storage.BucketAttrs{
		StorageClass: "COLDLINE",
		Location:     "EU",
	}
	bucket := client.Bucket(newStorage.Name)
	if err := bucket.Create(ctx, projectID, storageClassAndLocation); err != nil {
		fmt.Println("unable to wait for the creation of Insance Group: %v", err)
		return "", err
	}

	defer client.Close()
	//fmt.Fprintf(w, "Created bucket %v in %v with storage class %v\n", storaged.Name, storageClassAndLocation.Location, storageClassAndLocation.StorageClass)

	// 	message := `{
	// 		"actionType": "googleMount",
	// 		"name": "` + storage.Name + `",
	// 		"key": "` + res + `"
	// 	}`

	// 	notificationsystem.SendMessageOnAQueue("gateway-companyassistant", message)

	return newStorage.Name, nil
}

func (a *Assistant_google) DeleteStorage(newStorage *model.Storage, account *bson.Raw) error {

	//projectID := account.Lookup("project_id").StringValue()
	//zone := account.Lookup("region").StringValue()
	//accountName := account.Lookup("name").StringValue()

	//diskSize, _ := strconv.Atoi(storage.Size)

	godotenv.Load()
	ctx := context.Background()

	client, err := storage.NewClient(ctx, option.WithCredentialsFile(os.Getenv("GOOGLE_APPLICATION_CREDENTIALS")))
	if err != nil {
		return err
	}

	defer client.Close()

	bucket := client.Bucket(newStorage.Name)
	if err := bucket.Delete(ctx); err != nil {
		fmt.Println("unable to delete The Bucket: %v", err)
		return err
	}

	defer client.Close()
	//fmt.Fprintf(w, "Created bucket %v in %v with storage class %v\n", storaged.Name, storageClassAndLocation.Location, storageClassAndLocation.StorageClass)
	return nil

}
