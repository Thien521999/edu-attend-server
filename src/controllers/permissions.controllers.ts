import { NextFunction, Request, Response } from 'express'
import { PERMISSION_MESSAGES, RBAC_MESSAGES } from '~/constants/messages'
import permissionsService from '~/services/permissions.services'

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

export const assignPermissionController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await permissionsService.assignPermissionToRole(req.body)
  res.json({
    message: RBAC_MESSAGES.ASSIGN_PERMISSION_SUCCESS,
    result
  })
}

export const unassignPermissionController = async (req: Request, res: Response, next: NextFunction) => {
  const { role_id, permission_id } = req.params
  const result = await permissionsService.unassignPermissionFromRole(role_id as string, permission_id as string)
  res.json({
    message: RBAC_MESSAGES.UNASSIGN_PERMISSION_SUCCESS,
    result
  })
}

export const getRolePermissionsController = async (req: Request, res: Response, next: NextFunction) => {
  const { role_id } = req.params
  const result = await permissionsService.getRolePermissions(role_id as string)
  res.json({
    message: RBAC_MESSAGES.GET_ROLE_PERMISSIONS_SUCCESS,
    result
  })
}
