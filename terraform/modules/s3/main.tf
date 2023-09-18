
// create s3 bucket
resource "aws_s3_bucket" "s3_bucket" {
  bucket = var.s3_bucket_name
  tags = {
    ManagedBy = "Terraform"
  }
}

resource "aws_s3_bucket_ownership_controls" "s3_bucket_ownership_controls" {
  bucket = aws_s3_bucket.s3_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "s3_bucket_public_access_block" {
  bucket = aws_s3_bucket.s3_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "s3_bucket_acl" {
  depends_on = [
    aws_s3_bucket_ownership_controls.s3_bucket_ownership_controls,
    aws_s3_bucket_public_access_block.s3_bucket_public_access_block,
  ]

  bucket = aws_s3_bucket.s3_bucket.id
  acl    = "private"
}

resource "aws_s3_bucket_policy" "allow_public_access" {
  bucket = aws_s3_bucket.s3_bucket.id
  policy = data.aws_iam_policy_document.allow_public_access.json
}

data "aws_iam_policy_document" "allow_public_access" {
  statement {
    principals {
      type        = "*"
      identifiers = ["*"]
    }

    actions = [
      "s3:GetObject",
      "s3:ListBucket",
    ]

    resources = [
      aws_s3_bucket.s3_bucket.arn,
      "${aws_s3_bucket.s3_bucket.arn}/*",
    ]
  }
}
