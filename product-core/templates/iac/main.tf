/**
 * Terraform Backend Boilerplate
 * Usage: Provides robust Infrastructure as Code (IaC) scaffold for Full-Stack Product Commander
 */

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  # Standardize on S3 backend for state locking and consistency
  backend "s3" {
    bucket         = "axiom-terraform-state-backend"
    key            = "global/s3/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "axiom-terraform-state-locks"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Environment = var.environment
      ManagedBy   = "Terraform"
      Project     = "Axiom-Core"
    }
  }
}

variable "aws_region" {
  description = "The AWS region to deploy into"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string
  default     = "prod"
}

# Example VPC abstraction ensuring private/public subnet isolation
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"

  name = "axiom-core-${var.environment}-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b", "us-east-1c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = var.environment == "prod" ? false : true
}

output "vpc_id" {
  value = module.vpc.vpc_id
}
