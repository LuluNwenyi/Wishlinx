// set config set for ses
resource "aws_ses_configuration_set" "ses_config_set" {
  name = var.ses_config_set_name

  delivery_options {
    tls_policy = "Require"
  }
}

// create ses email identity
resource "aws_ses_email_identity" "ses_email_identity" {
  email = var.ses_email
}
