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



