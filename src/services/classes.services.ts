import { ObjectId } from 'mongodb'
import { RoleCode } from '~/constants/enums'
import { CreateClassReqBody, UpdateClassReqBody, GetClassesQuery } from '~/models/requests/Class.requests'
import Class from '~/models/schemas/Class.schema'
import databaseService from '~/services/database.services'

class ClassesService {
  async createClass(owner_id: string, payload: CreateClassReqBody) {
    const class_id = new ObjectId()
    const result = await databaseService.classes.insertOne(
      new Class({
        ...payload,
        _id: class_id,
        owner_id: new ObjectId(owner_id),
        grade_id: new ObjectId(payload.grade_id),
        school_id: new ObjectId(payload.school_id),
        academic_year_id: new ObjectId(payload.academic_year_id),
        link_code: payload.link_code || Math.random().toString(36).substring(2, 8).toUpperCase(),
        created_at: new Date(),
        updated_at: new Date()
      })
    )
    return await databaseService.classes.findOne({ _id: result.insertedId })
  }

  async getClasses({ user_id, role, query }: { user_id: string; role: string; query: GetClassesQuery }) {
    // Chuẩn bị các biến cho pagination
    const page = Number(query.page) || 1 // Trang hiện tại, mặc định là 1
    const limit = Number(query.limit) || 10 // Số items mỗi trang, mặc định là 10
    const skip = (page - 1) * limit // Số documents cần bỏ qua. VD: trang 2 → skip = (2-1)*10 = 10

    console.log({ query }) // Log query để debug

    // Tạo điều kiện filter cơ bản dựa trên role
    // SUPER_ADMIN: lấy tất cả classes (không filter owner)
    // TEACHER: chỉ lấy classes do chính họ tạo (filter theo owner_id)
    const matchStage: any = role === RoleCode.SUPER_ADMIN ? {} : { owner_id: new ObjectId(user_id) }

    // Nếu có filter theo tên class
    if (query.name) {
      // Tìm kiếm theo pattern, case-insensitive (không phân biệt hoa thường)
      // VD: "10A" sẽ match "Lớp 10A1", "10A2", "lớp 10a3"
      matchStage.name = { $regex: query.name, $options: 'i' }
    }

    // Nếu có filter theo mã class
    if (query.code) {
      // Tương tự như filter name, tìm kiếm case-insensitive
      matchStage.code = { $regex: query.code, $options: 'i' }
    }

    // Nếu có filter theo academic_year_id
    if (query.academic_year_id) {
      matchStage.academic_year_id = new ObjectId(query.academic_year_id)
    }

    // Sử dụng aggregate với $facet để lấy cả data và count trong 1 query duy nhất
    // Thay vì chạy 2 queries riêng biệt (find + countDocuments) → hiệu năng tốt hơn
    const result = await databaseService.classes
      .aggregate([
        // Stage 1: Lọc documents theo các điều kiện (owner_id, name, code)
        { $match: matchStage },
        // Stage 2: Join với collection users để lấy thông tin owner
        {
          $lookup: {
            from: 'users',
            localField: 'owner_id',
            foreignField: '_id',
            as: 'owner_info' // Đổi tên tạm để tránh conflict
          }
        },
        // Stage 3: Join với collection grades để lấy thông tin khối
        {
          $lookup: {
            from: 'grades',
            localField: 'grade_id',
            foreignField: '_id',
            as: 'grade_info'
          }
        },
        // Stage 4: Join với collection schools để lấy thông tin trường
        {
          $lookup: {
            from: 'schools',
            localField: 'school_id',
            foreignField: '_id',
            as: 'school_info'
          }
        },
        // Stage 5: Join với collection academic_years để lấy thông tin năm học
        {
          $lookup: {
            from: 'academic_years',
            localField: 'academic_year_id',
            foreignField: '_id',
            as: 'academic_year_info'
          }
        },
        // Stage 6: Chuyển các array từ $lookup thành object (lấy phần tử đầu tiên)
        {
          $addFields: {
            owner_id: { $arrayElemAt: ['$owner_info', 0] }, // Lấy phần tử đầu tiên của array
            grade_id: { $arrayElemAt: ['$grade_info', 0] },
            school_id: { $arrayElemAt: ['$school_info', 0] },
            academic_year_id: { $arrayElemAt: ['$academic_year_info', 0] }
          }
        },
        // Stage 7: Xóa các field tạm (_info) không cần thiết
        {
          $project: {
            owner_info: 0,
            grade_info: 0,
            school_info: 0,
            academic_year_info: 0
          }
        },
        {
          // Stage 8: Chạy 2 pipeline song song
          $facet: {
            // Pipeline 1: Đếm tổng số documents match được
            metadata: [{ $count: 'total' }],
            // Pipeline 2: Lấy dữ liệu với pagination
            data: [
              { $skip: skip }, // Bỏ qua n documents đầu
              { $limit: limit } // Chỉ lấy tối đa n documents
            ]
          }
        }
      ])
      .toArray()

    // Trích xuất kết quả từ $facet
    const classes = result[0]?.data || [] // Danh sách classes của trang hiện tại
    const total = result[0]?.metadata[0]?.total || 0 // Tổng số classes (sau khi filter)

    // Trả về object chứa đầy đủ thông tin pagination
    return {
      classes, // Danh sách classes
      total, // Tổng số classes
      page, // Trang hiện tại
      limit, // Số items mỗi trang
      total_pages: Math.ceil(total / limit) // Tổng số trang (làm tròn lên)
    }
  }

  // async getBlogs({
  //   user_id,
  //   audience,
  //   creatorId,
  //   topic_id,
  //   type,
  //   limit,
  //   page,
  //   followedUserIds
  // }: {
  //   user_id: string
  //   audience: BlogAudience
  //   creatorId?: string
  //   topic_id?: number
  //   type?: number
  //   limit: number
  //   page: number
  //   followedUserIds: string[]
  // }) {
  //   // const inc = user_id ? { user_views: 1 } : { guest_views: 1 }
  //   // console.log({ topic_id, type })

  //   let matchCondition = {}

  //   // 1 : Lấy blogs của user(Người đã login) và blogs những người đã follow(show ở new feeds)
  //   // 2 : Lấy blogs không thuộc về creatorId
  //   // 3 : Lấy blogs theo user(Người đã login)
  //   // 4 : Lọc theo topic_id để lấy blogs theo chủ đề.
  //   if (type === 1) {
  //     matchCondition = {
  //       $or: [
  //         { user_id: new ObjectId(user_id) }, // Hiển thị bài của user
  //         { user_id: { $in: followedUserIds.map((item) => new ObjectId(item)) } } // Hiển thị bài của những người đã follow
  //       ]
  //     }
  //   } else if (type === 2) {
  //     matchCondition = {
  //       user_id: {
  //         $ne: new ObjectId(creatorId)
  //       }
  //     }
  //   } else if (type === 3) {
  //     matchCondition = {
  //       user_id: new ObjectId(user_id)
  //     }
  //   } else if (type === 4) {
  //     matchCondition = {
  //       topic_id
  //     }
  //   }

  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   const aggregationPipeline: any[] = [
  //     {
  //       $match: matchCondition
  //     },
  //     {
  //       $lookup: {
  //         from: 'hashtags',
  //         localField: 'hashtags',
  //         foreignField: '_id',
  //         as: 'hashtags'
  //       }
  //     },
  //     {
  //       $lookup: {
  //         from: 'users',
  //         localField: 'mentions',
  //         foreignField: '_id',
  //         as: 'mentions'
  //       }
  //     },
  //     {
  //       $lookup: {
  //         from: 'users',
  //         localField: 'user_id',
  //         foreignField: '_id',
  //         as: 'user'
  //       }
  //     },
  //     {
  //       $addFields: {
  //         user: {
  //           $arrayElemAt: [
  //             {
  //               $map: {
  //                 input: '$user',
  //                 as: 'item',
  //                 in: {
  //                   _id: '$$item._id',
  //                   name: '$$item.name',
  //                   avatar: '$$item.avatar',
  //                   cover_photo: '$$item.cover_photo',
  //                   bio: '$$item.bio',
  //                   location: '$$item.location',
  //                   created_at: '$$item.created_at'
  //                 }
  //               }
  //             },
  //             0
  //           ]
  //         }
  //       }
  //     },
  //     {
  //       $lookup: {
  //         from: 'bookmarks',
  //         localField: '_id',
  //         foreignField: 'blog_id',
  //         as: 'bookmarks'
  //       }
  //     },
  //     {
  //       $lookup: {
  //         from: 'likes',
  //         localField: '_id',
  //         foreignField: 'blog_id',
  //         as: 'likes'
  //       }
  //     },
  //     {
  //       $addFields: {
  //         bookmarks: {
  //           $size: '$bookmarks'
  //         },
  //         likes: {
  //           $size: '$likes'
  //         }
  //         // views: {
  //         //   $add: ['$user_views', '$guest_views']
  //         // }
  //       }
  //     },
  //     {
  //       $sort: {
  //         created_at: -1 // Sắp xếp giảm dần theo ngày tạo
  //       }
  //     }
  //   ]

  //   if (type !== 2) {
  //     aggregationPipeline.push({ $skip: limit * ((page || 1) - 1) }, { $limit: limit })
  //   } else {
  //     aggregationPipeline.push({ $sample: { size: limit } }) // Random khi type = 2
  //   }

  //   const blogs = await databaseService.blogs.aggregate(aggregationPipeline).toArray()

  //   if ([1, 3, 4].includes(type as number)) {
  //     const total = await databaseService.blogs.countDocuments(matchCondition)
  //     return { blogs, total_page: Math.ceil(total / limit) }
  //   } else {
  //     return blogs
  //   }
  // }

  async getClassDetail(id: string) {
    const result = await databaseService.classes
      .aggregate([
        {
          $match: {
            _id: new ObjectId(id)
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'owner_id',
            foreignField: '_id',
            as: 'owner_info'
          }
        },
        {
          $lookup: {
            from: 'grades',
            localField: 'grade_id',
            foreignField: '_id',
            as: 'grade_info'
          }
        },
        {
          $lookup: {
            from: 'schools',
            localField: 'school_id',
            foreignField: '_id',
            as: 'school_info'
          }
        },
        {
          $lookup: {
            from: 'academic_years',
            localField: 'academic_year_id',
            foreignField: '_id',
            as: 'academic_year_info'
          }
        },
        {
          $addFields: {
            owner_id: { $arrayElemAt: ['$owner_info', 0] },
            grade_id: { $arrayElemAt: ['$grade_info', 0] },
            school_id: { $arrayElemAt: ['$school_info', 0] },
            academic_year_id: { $arrayElemAt: ['$academic_year_info', 0] }
          }
        },
        {
          $project: {
            owner_info: 0,
            grade_info: 0,
            school_info: 0,
            academic_year_info: 0
          }
        }
      ])
      .toArray()

    // aggregate trả về array, lấy phần tử đầu tiên
    return result[0] || null
  }

  async updateClass(id: string, payload: UpdateClassReqBody) {
    const updateData = {
      ...payload,
      grade_id: payload.grade_id ? new ObjectId(payload.grade_id) : undefined,
      school_id: payload.school_id ? new ObjectId(payload.school_id) : undefined,
      academic_year_id: payload.academic_year_id ? new ObjectId(payload.academic_year_id) : undefined,
      updated_at: new Date()
    }

    // Remove undefined fields
    Object.keys(updateData).forEach((key) => {
      if ((updateData as any)[key] === undefined) {
        delete (updateData as any)[key]
      }
    })

    const result = await databaseService.classes.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' } // returnDocument: 'after' là option của findOneAndUpdate, dùng để trả về document sau khi update
    )
    return result
  }

  async deleteClass(id: string) {
    const result = await databaseService.classes.deleteOne({ _id: new ObjectId(id) })
    return result
  }
}

const classesService = new ClassesService()
export default classesService
