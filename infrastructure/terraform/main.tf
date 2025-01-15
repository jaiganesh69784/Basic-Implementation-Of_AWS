provider "aws" {
  region = var.aws_region
}

# S3 Bucket
resource "aws_s3_bucket" "image_bucket" {
  bucket = var.bucket_name
}

resource "aws_s3_bucket_public_access_block" "image_bucket" {
  bucket = aws_s3_bucket.image_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# IAM Role for Lambda
resource "aws_iam_role" "lambda_role" {
  name = "image_processor_lambda_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# Lambda Functions
resource "aws_lambda_function" "upload_handler" {
  filename         = "../../src/handlers/uploadHandler.js"
  function_name    = "image-upload-handler"
  role            = aws_iam_role.lambda_role.arn
  handler         = "uploadHandler.handler"
  runtime         = "nodejs16.x"

  environment {
    variables = {
      BUCKET_NAME = aws_s3_bucket.image_bucket.id
    }
  }
}

resource "aws_lambda_function" "process_handler" {
  filename         = "../../src/handlers/processHandler.js"
  function_name    = "image-process-handler"
  role            = aws_iam_role.lambda_role.arn
  handler         = "processHandler.handler"
  runtime         = "nodejs16.x"

  environment {
    variables = {
      BUCKET_NAME = aws_s3_bucket.image_bucket.id
    }
  }
}