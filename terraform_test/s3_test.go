package test

import (
	"os"
	"testing"
	"github.com/gruntwork-io/terratest/modules/terraform"
)

func TestS3Module(t *testing.T) {
	// retryable errors in terraform testing.
	terraformOptions := terraform.WithDefaultRetryableErrors(t, &terraform.Options{
		TerraformDir: "../terraform/modules/s3",
		Vars: map[string]interface{}{
			"region": os.Getenv("AWS_REGION"),
			"aws_access_key": os.Getenv("AWS_ACCESS_KEY"),
			"aws_secret_key": os.Getenv("AWS_SECRET_KEY"),
			"s3_bucket_name": os.Getenv("S3_BUCKET_NAME"),
		},
	})

	defer terraform.Destroy(t, terraformOptions)
	terraform.InitAndApply(t, terraformOptions)
}
