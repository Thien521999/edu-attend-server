import { NextFunction, Request, Response } from 'express'
import { PERMISSION_MESSAGES } from '~/constants/messages'
import permissionsService from '~/services/permissions.services'
// import permissionsService from '~/services/permissions.services'

export const getPermissionsController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await permissionsService.getPermissions()
  res.json({
    message: PERMISSION_MESSAGES.GET_PERMISSIONS_SUCCESS,
    result
  })
}

export const getPermissionDetailController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const result = await permissionsService.getPermissionDetail(id as string)
  if (!result) {
    res.status(404).json({
      message: PERMISSION_MESSAGES.PERMISSION_NOT_FOUND
    })
    return
  }
  res.json({
    message: PERMISSION_MESSAGES.GET_PERMISSION_DETAIL_SUCCESS,
    result
  })
}
