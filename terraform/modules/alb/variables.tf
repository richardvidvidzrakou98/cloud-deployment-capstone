variable "project_name" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "public_subnet_ids" {
  type = list(string)
}

variable "alb_sg_id" {
  type = string
}

variable "instance_ids" {
  type = list(string)
}

variable "certificate_arn" {
  type    = string
  default = ""
}

variable "health_check_path" {
  type    = string
  default = "/"
}
