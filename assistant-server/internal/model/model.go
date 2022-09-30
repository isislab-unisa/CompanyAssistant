package model

type Resource struct {
	Id   string `json:"id"`
	Type string `json:"type"`
}

type User struct {
	Resource  Resource `json:"resource"`
	Username  string   `json:"username"`
	Email     string   `json:"email"`
	FirstName string   `json:"name"`
	LastName  string   `json:"lastname"`
	Password  string   `json:"password"`
	Token     string   `json:"token"`
	Type      string   `json:"type"`
	Role      string   `json:"role"`
	Groups    []string `json:"groups"`
}

type Vm struct {
	Resource    Resource `json:"resource"`
	Id          string   `json:"id"`
	Name        string   `json:"name"`
	Username    string   `json:"username"`
	Account     string   `json:"account"`
	Password    string   `json:"password"`
	State       string   `json:"state"`
	InUse       bool     `json:"inUse"`
	IpAddr      string   `json:"ipAddr"`
	VmType      string   `json:"vmType"`
	Description string   `json:"description"`
	Tags        []string `json:"tags"`
	UserGroups  []string `json:"userGroups"`
}

type Storage struct {
	Resource Resource `json:"resource"`
	Id       string   `json:"id"`
	Name     string   `json:"name"`
	Account  string   `json:"account"`
	Key      string   `json:"key"`
	Size     string   `json:"size"`
	Tags     []string `json:"tags"`
}

type VmType struct {
	Id           string `json:"id"`
	Provider     string `json:"provider"`
	Os           string `json:"os"`
	Image        string `json:"image"`
	InstanceType string `json:"instanceType"`
	Size         string `json:"size"`
}

type Tag struct {
	Name string `json:"name"`
}

type Policy struct {
	Name         string `json:"name"`
	Action       string `json:"action"`
	ResourceType string `json:"resourceType"`
}

type Role struct {
	Name     string   `json:"name"`
	Policies []string `json:"policies"`
}

type Group struct {
	Resource Resource `json:"resource"`
	Name     string   `json:"name"`
	Tags     []string `json:"tags"`
}

type ProviderParameters struct {
	Name       string   `json:"name"`
	Parameters []string `json:"parameters"`
}

type ResponseResult struct {
	Error  string `json:"error"`
	Result string `json:"result"`
}
