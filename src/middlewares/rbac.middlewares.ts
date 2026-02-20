import { NextFunction, Request, Response } from 'express'
import { RoleCode, PermissionCode } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Error'
import { TokenPayload } from '~/models/requests/User.requests'

export const permissionValidator = (requiredPermission: PermissionCode) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { permissions } = req.decoded_authorization as TokenPayload
    if (!permissions || !permissions.includes(requiredPermission as unknown as string)) {
      return next(
        new ErrorWithStatus({
          message: 'Forbidden: You do not have the required permission',
          status: HTTP_STATUS.FORBIDDEN
        })
      )
    }
    next()
  }
}

export const roleValidator = (requiredRole: RoleCode) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { role } = req.decoded_authorization as TokenPayload
    if (role !== requiredRole) {
      return next(
        new ErrorWithStatus({
          message: 'Forbidden: You do not have the required role',
          status: HTTP_STATUS.FORBIDDEN
        })
      )
    }
    next()
  }
}
