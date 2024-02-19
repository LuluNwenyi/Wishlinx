package test

import (
	"os"
	"testing"
	"github.com/gruntwork-io/terratest/modules/terraform"
)

func TestMongoModule(t *testing.T) {
	// retryable errors in terraform testing.
	terraformOptions := terraform.WithDefaultRetryableErrors(t, &terraform.Options{
		TerraformDir: "../terraform/modules/mongodb",
		Vars: map[string]interface{}{
			"mongodbatlas_private_key": os.Getenv("MONGODB_ATLAS_PRIVATE_KEY"),
			"mongodbatlas_public_key": os.Getenv("MONGODB_ATLAS_PUBLIC_KEY"),
			"project_name": os.Getenv("MONGODB_PROJECT_NAME"),
			"org_id": os.Getenv("MONGODB_ORG_ID"),
			//"project_owner_id": os.Getenv("MONGODB_PROJECT_OWNER_ID"),
			"cluster_name": os.Getenv("MONGODB_CLUSTER_NAME"),
			"cluster_size": os.Getenv("MONGODB_CLUSTER_SIZE"),
			"cluster_region": os.Getenv("MONGODB_CLUSTER_REGION"),
		},
	})

	defer terraform.Destroy(t, terraformOptions)
	terraform.InitAndApply(t, terraformOptions)
}
