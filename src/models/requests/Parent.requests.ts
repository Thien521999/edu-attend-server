export interface CreateParentReqBody {
  full_name: string
  phone: string
  email?: string
  address?: string
  job?: string
}

export interface UpdateParentReqBody {
  full_name?: string
  phone?: string
  email?: string
  address?: string
  job?: string
}
