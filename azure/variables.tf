variable "location" {
  description = "Azure region for the deployment."
  type        = string
  default     = "westeurope"
}

variable "resource_group_name" {
  description = "Name of the Azure resource group."
  type        = string
  default     = "rg-bka"
}

variable "app_name" {
  description = "Base name used to create frontend and backend app names."
  type        = string
  default     = "basiakasiaasia"
}

variable "service_plan_sku" {
  description = "App Service plan SKU."
  type        = string
  default     = "B1"
}

variable "jwt_secret" {
  description = "JWT secret used by backend app."
  type        = string
  sensitive   = true
}

variable "jwt_expires_in" {
  description = "JWT expiration window used by backend app."
  type        = string
  default     = "24h"
}

variable "default_admin_password" {
  description = "Initial admin password used by backend app."
  type        = string
  sensitive   = true
}
