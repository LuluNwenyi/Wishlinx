// create mongodb project

resource "mongodbatlas_project" "project" {
  name = var.mongodb_project_name // desired project name
  org_id = var.mongodb_org_id     // the mongodb atlas organization id
}

// create mongodb cluster
resource "mongodbatlas_cluster" "cluster" {
  //depends_on = [mongodbatlas_project.project,] // to ensure the project is created first
  project_id   = mongodbatlas_project.project.id   // the mongodb atlas project id
  name         = var.cluster_name // desired cluster name
  disk_size_gb = 2                // desired disk size in GB

  // provider settings
  provider_name               = "TENANT"
  backing_provider_name       = "AWS"
  provider_instance_size_name = var.cluster_size // could be anything above M2. M0 is not supported via this provider
  provider_region_name        = var.cluster_region       // desired region
}

// create mongodb database user
resource "mongodbatlas_database_user" "user" {
  username           = var.db_username
  password           = var.db_password
  project_id         = mongodbatlas_project.project.id 
  auth_database_name = "wishlinx"


  roles {
    role_name     = "readWrite"
    database_name = "wishlinx"
  }

  labels {
    key   = "role"
    value = "Project Owner"
  }

  scopes {
    name = var.cluster_name
    type = "CLUSTER"
  }

}
