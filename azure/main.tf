terraform {
  required_version = ">= 1.7.0"

  required_providers {
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.5"
    }

    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }
}

provider "azurerm" {
  features {}
}

locals {
  frontend_dist_dir = abspath("${path.module}/../frontend/dist")
  frontend_app_name = "${var.app_name}-frontend"
  backend_app_name  = "${var.app_name}-backend"
}

resource "azurerm_resource_group" "this" {
  name     = var.resource_group_name
  location = var.location
}

resource "azurerm_service_plan" "this" {
  name                = "${var.app_name}-plan"
  resource_group_name = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location
  os_type             = "Linux"
  sku_name            = var.service_plan_sku
}

data "archive_file" "frontend" {
  type        = "zip"
  source_dir  = local.frontend_dist_dir
  output_path = "${path.module}/.terraform/${local.frontend_app_name}.zip"
}

resource "azurerm_linux_web_app" "frontend" {
  name                = local.frontend_app_name
  resource_group_name = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location
  service_plan_id     = azurerm_service_plan.this.id

  site_config {
    always_on        = true
    app_command_line = "pm2 serve /home/site/wwwroot --no-daemon --spa -p 8080"

    application_stack {
      node_version = "20-lts"
    }
  }

  app_settings = {
    WEBSITE_NODE_DEFAULT_VERSION   = "20-lts"
    WEBSITES_PORT                  = "8080"
    WEBSITE_RUN_FROM_PACKAGE       = "1"
    SCM_DO_BUILD_DURING_DEPLOYMENT = "false"
  }

  zip_deploy_file = data.archive_file.frontend.output_path
}

resource "azurerm_linux_web_app" "backend" {
  name                = local.backend_app_name
  resource_group_name = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location
  service_plan_id     = azurerm_service_plan.this.id

  site_config {
    always_on        = true
    app_command_line = "node dist/src/index.js"

    application_stack {
      node_version = "20-lts"
    }
  }

  app_settings = {
    WEBSITE_NODE_DEFAULT_VERSION   = "20-lts"
    WEBSITES_PORT                  = "8000"
    WEBSITE_RUN_FROM_PACKAGE       = "1"
    SCM_DO_BUILD_DURING_DEPLOYMENT = "false"
    NODE_ENV                       = "production"
    PORT                           = "8000"
    DB_PATH                        = "/home/site/database.db"
    LOG_DIR                        = "/home/site/logs"
    CORS_ORIGIN                    = "https://${azurerm_linux_web_app.frontend.default_hostname}"
    JWT_SECRET                     = var.jwt_secret
    JWT_EXPIRES_IN                 = var.jwt_expires_in
    DEFAULT_ADMIN_PASSWORD         = var.default_admin_password
    LOG_LEVEL                      = "info"
  }
}
