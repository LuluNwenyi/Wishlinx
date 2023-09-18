// declaring outputs

output "mongodb_project_id" {
    value       = mongodbatlas_project.project.id
    description = "value of the mongodb project id"
}

output "mongodb_project_created" {
    value       = mongodbatlas_project.project.created
    description = "value of the mongodb project created"
}

output "mongodb_project_cluster_count" {
    value = mongodbatlas_project.project.cluster_count
}

output "mongodb_project_name" {
    value       = mongodbatlas_project.project.name
    description = "value of the mongodb project name"
}

output "mongodb_cluster_id" {
  value       = mongodbatlas_cluster.cluster.cluster_id
  description = "value of the mongodb cluster id"
}

output "mongodb_cluster_name" {
  value       = mongodbatlas_cluster.cluster.name
  description = "value of the mongodb cluster name"
}

output "mongodb_uri" {
  value       = mongodbatlas_cluster.cluster.connection_strings[0].standard_srv
  description = "value of the mongodb connection string"
}

output "mongodb_cluster_version" {
  value       = mongodbatlas_cluster.cluster.mongo_db_version
  description = "value of the mongodb cluster version"
}
