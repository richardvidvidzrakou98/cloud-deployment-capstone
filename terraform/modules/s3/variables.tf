variable "project_name" {
  type = string
}

variable "bucket_name" {
  type = string
}

variable "assets_dir" {
  description = "Local directory whose contents get uploaded to the bucket"
  type        = string
}

variable "mime_types" {
  description = "Extension -> content-type map used when uploading assets"
  type        = map(string)
  default = {
    "html" = "text/html"
    "css"  = "text/css"
    "js"   = "application/javascript"
    "png"  = "image/png"
    "jpg"  = "image/jpeg"
    "jpeg" = "image/jpeg"
    "svg"  = "image/svg+xml"
    "gif"  = "image/gif"
    "ico"  = "image/x-icon"
    "json" = "application/json"
  }
}
