terraform {
  required_version = ">= 1.10.0"
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }

  # Remote State Management via Cloudflare R2 (S3 Compatible API)
  backend "s3" {
    bucket                      = "shimizu-tfstate"
    key                         = "cloudflare-pages/terraform.tfstate"
    region                      = "auto"
    skip_credentials_validation = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
    skip_metadata_api_check     = true
    use_path_style              = true
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# Direct Upload Cloudflare Pages Project (Deployed automatically via GitHub Actions cloudflare/pages-action)
resource "cloudflare_pages_project" "support_app" {
  account_id        = var.cloudflare_account_id
  name              = var.project_name
  production_branch = "main"

  build_config {
    build_command   = "pnpm build"
    destination_dir = "dist"
    root_dir        = ""
  }
}

# Look up Cloudflare Zone for DNS management
data "cloudflare_zone" "zone" {
  account_id = var.cloudflare_account_id
  name       = var.domain_zone
}

# Custom domain mapping for Cloudflare Pages project
resource "cloudflare_pages_domain" "custom_domain" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.support_app.name
  domain       = var.custom_domain
}

# CNAME DNS record routing to the Pages project
resource "cloudflare_record" "custom_domain_cname" {
  zone_id = data.cloudflare_zone.zone.id
  name    = var.custom_domain
  value   = "${cloudflare_pages_project.support_app.name}.pages.dev"
  type    = "CNAME"
  proxied = true
  ttl     = 1
}
