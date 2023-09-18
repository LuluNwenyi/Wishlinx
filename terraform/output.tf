// module outputs

output "s3_bucket_id" {
  value       = module.s3.bucket_id
  description = "value of the s3 bucket id"
}

output "s3_bucket_arn" {
  value       = module.s3.bucket_arn
  description = "value of the s3 bucket arn"
}

output "ses_config_set_id" {
  value       = module.ses.ses_config_set_id
  description = "value of the ses configuration set id"
}

output "ses_email" {
  value       = module.ses.ses_email
  description = "value of the ses email"
}

// declaring outputs

output "mongodb_project_id" {
  value       = module.mongodb.mongodb_project_id
  description = "value of the mongodb project id"
}

output "mongodb_project_created" {
  value       = module.mongodb.mongodb_project_created
  description = "value of the mongodb project created"
}

output "mongodb_project_cluster_count" {
  value = module.mongodb.mongodb_project_cluster_count
  description = "value of the mongodb project cluster count"
}

output "mongodb_project_name" {
  value       = module.mongodb.mongodb_project_name
  description = "value of the mongodb project name"
}

output "mongodb_cluster_id" {
  value       = module.mongodb.mongodb_cluster_id
  description = "value of the mongodb cluster id"
}

output "mongodb_cluster_name" {
  value       = module.mongodb.mongodb_cluster_name
  description = "value of the mongodb cluster name"
}

output "mongodb_uri" {
  value       = module.mongodb.mongodb_uri
  description = "value of the mongodb connection string"
}

output "mongodb_cluster_version" {
  value       = module.mongodb.mongodb_cluster_version
  description = "value of the mongodb cluster version"
}
