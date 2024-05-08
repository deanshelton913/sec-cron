variable "environment" {
  type        = string
  default     = "staging"
  description = "The environment to deploy to ('staging' or 'production')."

  validation {
    condition     = var.environment == "staging" || var.environment == "production"
    error_message = "The environment must be 'staging' or 'production'."
  }
}

