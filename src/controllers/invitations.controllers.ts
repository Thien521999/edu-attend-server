import { Request, Response } from 'express'
import { NextFunction } from 'express-serve-static-core'
import { InviteTeacherReqBody, AcceptInvitationReqBody } from '~/models/requests/Invitation.requests'
import usersService from '~/services/users.services'
import { TokenPayload } from '~/models/requests/User.requests'

export const inviteTeacherController = async (
  req: Request<any, any, InviteTeacherReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await usersService.inviteTeacher({
    ...req.body,
    inviter_id: user_id
  })
  return res.json({
    message: 'Invitation sent successfully',
    result
  })
}

export const acceptInvitationController = async (
  req: Request<any, any, AcceptInvitationReqBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await usersService.acceptInvitation(req.body)
  return res.json({
    message: 'Invitation accepted successfully',
    result
  })
}
