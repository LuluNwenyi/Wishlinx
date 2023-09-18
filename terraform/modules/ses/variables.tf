// declaring input variables

variable "ses_email" {
  description = "The email address to use for SES"
  type        = string
}

variable "ses_config_set_name" {
  description = "The name of the SES configuration set"
  type        = string
}
