// declaring module outputs

output "bucket_id" {
  value       = aws_s3_bucket.s3_bucket.id
  description = "value of the s3 bucket id"
}

output "bucket_arn" {
  value       = aws_s3_bucket.s3_bucket.arn
  description = "value of the s3 bucket arn"
}
