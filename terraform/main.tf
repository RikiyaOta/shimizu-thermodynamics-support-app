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

# Custom domain mapping for Cloudflare Pages project (External DNS managed via Onamae.com)
resource "cloudflare_pages_domain" "custom_domain" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.support_app.name
  domain       = var.custom_domain
}
