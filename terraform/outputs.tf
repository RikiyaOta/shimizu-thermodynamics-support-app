output "pages_project_name" {
  description = "Cloudflare Pages Project Name"
  value       = cloudflare_pages_project.support_app.name
}

output "pages_subdomain" {
  description = "Cloudflare Pages default subdomain URL"
  value       = cloudflare_pages_project.support_app.subdomain
}
