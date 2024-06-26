variable "prefix" {
  type        = string
  description = "Prefix for all resources created by this module."
}

variable "iam_permissions" {
  type        = any
  default     = []
  description = "IAM permissions to be given to the lambda role."
}


variable "image_uri" {
  type        = string
  description = "Image uri for the lambda to run."
}

variable "image_cmd" {
  type        = string
  description = "CMD override for the lambda image."
}

variable "timeout" {
  type        = number
  default     = 30
  description = "Lambda timeout."
}

variable "max_concurrency" {
  type        = number
  default     = 1
  description = "Maximum number of concurrent lambda that can be spun up."
}

variable "layers" {
  type        = list(string)
  default     = []
  description = "List of layer arns to be used by the lambda."
}

variable "env_vars" {
  type        = map(string)
  default     = {}
  description = "Map of environment variables to be used by the lambda."
}
