import { JoinRequestStatus } from '~/constants/enums'

export interface CreateJoinRequestReqBody {
  link_code: string
  full_name: string
  student_code?: string
}

export interface ApproveJoinRequestReqBody {
  // No body needed, just the request_id from params
}

export interface RejectJoinRequestReqBody {
  reason?: string
}

export interface GetJoinRequestsQuery {
  status?: JoinRequestStatus
  page?: string
  limit?: string
}
