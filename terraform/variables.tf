variable "cloudflare_account_id" {
  description = "Cloudflare Account ID"
  type        = string
}

variable "cloudflare_api_token" {
  description = "Cloudflare API Token with Pages edit permissions"
  type        = string
  sensitive   = true
}

variable "project_name" {
  description = "Cloudflare Pages project name"
  type        = string
  default     = "shimizu-thermodynamics-support-app"
}
