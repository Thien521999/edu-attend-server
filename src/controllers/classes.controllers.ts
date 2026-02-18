import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CLASSES_MESSAGES } from '~/constants/messages'
import { CreateClassReqBody, UpdateClassReqBody, ClassParams, GetClassesQuery } from '~/models/requests/Class.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import classesService from '~/services/classes.services'

export const createClassController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await classesService.createClass(user_id, req.body)
  res.json({
    message: CLASSES_MESSAGES.CREATE_CLASS_SUCCESS,
    result
  })
}

export const getClassesController = async (
  req: Request<ParamsDictionary, any, any, GetClassesQuery>,
  res: Response,
  next: NextFunction
) => {
  const { user_id, role = '' } = req.decoded_authorization as TokenPayload
  const query = req.query
  const result = await classesService.getClasses({ user_id, role, query })
  res.json({
    message: CLASSES_MESSAGES.GET_CLASSES_SUCCESS,
    result
  })
}

// export const getBlogsController = async (req: Request, res: Response) => {
//   const { user_id } = req.decoded_authorization as TokenPayload
//   const limit = Number(req.query.limit as string)
//   const page = Number(req.query.page as string)
//   const audience = Number(req.query.audience as string) as BlogAudience
//   const creatorId = req.query.creatorId as string
//   const topic_id = Number(req.query.topic_id as string)
//   const type = Number(req.query.type as string)

//   const user = await usersService.getMe(user_id)

//   const result = await blogsServices.getBlogs({
//     user_id,
//     audience,
//     creatorId,
//     topic_id,
//     type,
//     limit,
//     page,
//     followedUserIds: user?.blog_circle?.map((id) => id.toString()) || []
//   })

//   let blogs: Document[]
//   let total_page: number

//   if (Array.isArray(result)) {
//     blogs = result
//     total_page = 1
//   } else {
//     blogs = result.blogs
//     total_page = result.total_page
//   }

//   const customBlogs = blogs.map((blog) => ({
//     ...blog,
//     user_views: blog?.user_views,
//     guest_views: blog?.guest_views
//   }))

//   res.json({
//     message: BLOG_MESSAGES.GET_ALL_BLOG_SUCCESSFULLY,
//     data: {
//       blogs: customBlogs,
//       page,
//       limit,
//       total_page
//     }
//   })
// }

export const getClassDetailController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params as ClassParams
  const result = await classesService.getClassDetail(id)
  if (!result) {
    res.status(404).json({
      message: CLASSES_MESSAGES.CLASS_NOT_FOUND
    })
    return
  }
  res.json({
    message: CLASSES_MESSAGES.GET_CLASS_DETAIL_SUCCESS,
    result
  })
}

export const updateClassController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params as ClassParams
  const result = await classesService.updateClass(id, req.body)
  res.json({
    message: CLASSES_MESSAGES.UPDATE_CLASS_SUCCESS,
    result
  })
}

export const deleteClassController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params as ClassParams
  const result = await classesService.deleteClass(id)
  res.json({
    message: CLASSES_MESSAGES.DELETE_CLASS_SUCCESS,
    result
  })
}
