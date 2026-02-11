import { NextFunction, Request, Response } from 'express'
import { ROLE_MESSAGES } from '~/constants/messages'
import rolesService from '~/services/roles.services'

export const getRolesController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await rolesService.getRoles()
  res.json({
    message: ROLE_MESSAGES.GET_ROLES_SUCCESS,
    result
  })
}

export const getRoleDetailController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const result = await rolesService.getRoleDetail(id as string)
  if (!result) {
    res.status(404).json({
      message: ROLE_MESSAGES.ROLE_NOT_FOUND
    })
    return
  }
  res.json({
    message: ROLE_MESSAGES.GET_ROLE_DETAIL_SUCCESS,
    result
  })
}
