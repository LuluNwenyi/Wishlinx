// declaring module outputs

output "ses_config_set_id" {
  value       = aws_ses_configuration_set.ses_config_set.id
  description = "value of the ses configuration set id"
}

output "ses_email" {
  value       = aws_ses_email_identity.ses_email_identity.email
  description = "value of the ses email"
}
