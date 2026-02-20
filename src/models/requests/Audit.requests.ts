export interface CreateAuditLogReqBody {
  user_id: string
  action: string
  resource: string // Collection name or Entity
  resource_id?: string
  details?: any
  ip_address?: string
  user_agent?: string
}
