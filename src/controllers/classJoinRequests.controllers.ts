import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import classJoinRequestsService from '~/services/classJoinRequests.services'
import {
  CreateJoinRequestReqBody,
  GetJoinRequestsQuery,
  RejectJoinRequestReqBody
} from '~/models/requests/ClassJoinRequest.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import { JOIN_REQUEST_MESSAGES } from '~/constants/messages'

// Học sinh submit join request
export const createJoinRequestController = async (
  req: Request<ParamsDictionary, any, CreateJoinRequestReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await classJoinRequestsService.createJoinRequest({
    user_id,
    payload: req.body
  })
  res.json({
    message: JOIN_REQUEST_MESSAGES.CREATE_JOIN_REQUEST_SUCCESS,
    result
  })
}

// Giáo viên xem join requests của lớp
export const getJoinRequestsByClassController = async (
  req: Request<ParamsDictionary, any, any, GetJoinRequestsQuery>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const class_id = req.params.class_id as string
  const query = req.query

  const result = await classJoinRequestsService.getJoinRequestsByClass({
    class_id,
    owner_id: user_id,
    query
  })

  res.json({
    message: JOIN_REQUEST_MESSAGES.GET_JOIN_REQUESTS_SUCCESS,
    result
  })
}

// Giáo viên approve join request
export const approveJoinRequestController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const request_id = req.params.request_id as string

  const result = await classJoinRequestsService.approveJoinRequest({
    request_id,
    owner_id: user_id
  })

  res.json(result)
}

// Giáo viên reject join request
export const rejectJoinRequestController = async (
  req: Request<ParamsDictionary, any, RejectJoinRequestReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const request_id = req.params.request_id as string

  const result = await classJoinRequestsService.rejectJoinRequest({
    request_id,
    owner_id: user_id,
    payload: req.body
  })

  res.json(result)
}

// Học sinh xem join requests của mình
export const getMyJoinRequestsController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload

  const result = await classJoinRequestsService.getMyJoinRequests({ user_id })

  res.json({
    message: JOIN_REQUEST_MESSAGES.GET_JOIN_REQUESTS_SUCCESS,
    result
  })
}
