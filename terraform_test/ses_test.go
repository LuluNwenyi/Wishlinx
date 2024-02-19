package test

import (
	"os"
	"testing"
	"github.com/gruntwork-io/terratest/modules/terraform"
)

func TestSESModule(t *testing.T) {
	// retryable errors in terraform testing.
	terraformOptions := terraform.WithDefaultRetryableErrors(t, &terraform.Options{
		TerraformDir: "../terraform/modules/ses",
		Vars: map[string]interface{}{
			"region": os.Getenv("AWS_REGION"),
			"aws_access_key": os.Getenv("AWS_ACCESS_KEY"),
			"aws_secret_key": os.Getenv("AWS_SECRET_KEY"),
			"ses_email": os.Getenv("SES_EMAIL"),
			"ses_config_set_name": os.Getenv("SES_CONFIG_SET_NAME"),
		},
	})

	defer terraform.Destroy(t, terraformOptions)
	terraform.InitAndApply(t, terraformOptions)
}
