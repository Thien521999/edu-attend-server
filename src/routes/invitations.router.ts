import { Router } from 'express'
import { inviteTeacherController, acceptInvitationController } from '~/controllers/invitations.controllers'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { roleValidator } from '~/middlewares/rbac.middlewares'
import { RoleCode } from '~/constants/enums'
import { wrapRequestHandler } from '~/utils/handler'

const invitationsRouter = Router()

/**
 * Description: Invite a teacher
 * Path: /invite
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { email: string, name: string }
 */
invitationsRouter.post(
  '/invite',
  accessTokenValidator,
  roleValidator(RoleCode.SUPER_ADMIN),
  wrapRequestHandler(inviteTeacherController)
)

/**
 * Description: Accept invitation
 * Path: /accept
 * Method: POST
 * Body: { token: string, password: string }
 */
invitationsRouter.post('/accept', wrapRequestHandler(acceptInvitationController))

export default invitationsRouter
