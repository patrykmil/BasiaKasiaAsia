output "resource_group_name" {
  value = azurerm_resource_group.this.name
}

output "frontend_web_app_name" {
  value = azurerm_linux_web_app.frontend.name
}

output "frontend_web_app_url" {
  value = "https://${azurerm_linux_web_app.frontend.default_hostname}"
}

output "backend_web_app_name" {
  value = azurerm_linux_web_app.backend.name
}

output "backend_web_app_url" {
  value = "https://${azurerm_linux_web_app.backend.default_hostname}"
}
