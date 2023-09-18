// declaring input variables

variable "ses_email" {
  description = "The email address to use for SES"
  type        = string
  // default = "oluchinwenyi@gmail.com"
}

variable "ses_config_set_name" {
  description = "The name of the SES configuration set"
  type        = string
  // default = "wishlinx_config_set"
}

variable "s3_bucket_name" {
  description = "The name of the S3 bucket to use"
  type        = string
  // default     = "wishlinx-bucket"
}

// declaring variables for the cluster module

variable "mongodbatlas_private_key" {
  type        = string
  description = "MongoDB Atlas private key"
  sensitive   = true
}

variable "mongodbatlas_public_key" {
  type        = string
  description = "MongoDB Atlas public key"
  sensitive   = true
}

variable "mongodb_project_name" {
  type        = string
  description = "Name of the MongoDB Atlas project"
}

variable "mongodb_org_id" {
  type        = string
  description = "ID of the MongoDB Atlas organization"
}

variable "cluster_name" {
  type        = string
  description = "Name of the MongoDB Atlas cluster"
}

variable "cluster_size" {
  type        = string
  description = "Size of the MongoDB Atlas cluster"
}

variable "cluster_region" {
  type        = string
  description = "Region name"
}

variable "db_username" {
  type        = string
  description = "Database username"
}

variable "db_password" {
  type        = string
  description = "Database password"
}
