module "ses" {
  source              = "./modules/ses"
  ses_email           = var.ses_email
  ses_config_set_name = var.ses_config_set_name
}

module "s3" {
  source         = "./modules/s3"
  s3_bucket_name = var.s3_bucket_name
}

module "mongodb" {
  source                   = "./modules/mongodb"
  mongodbatlas_private_key = var.mongodbatlas_private_key
  mongodbatlas_public_key  = var.mongodbatlas_public_key
  mongodb_project_name     = var.mongodb_project_name
  mongodb_org_id           = var.mongodb_org_id
  cluster_region           = var.cluster_region
  cluster_name             = var.cluster_name
  cluster_size             = var.cluster_size
  db_username              = var.db_username
  db_password              = var.db_password
}
