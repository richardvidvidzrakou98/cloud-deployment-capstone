variable "project_name" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "ssh_cidr" {
  type    = string
  default = ""
}

variable "allow_direct_public_http" {
  type    = bool
  default = false
}
