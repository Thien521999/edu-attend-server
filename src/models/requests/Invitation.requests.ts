export interface InviteTeacherReqBody {
  email: string
  name: string
}

export interface AcceptInvitationReqBody {
  token: string
  password: string
}
