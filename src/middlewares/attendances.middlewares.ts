import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { validate } from '~/utils/validation'

export const createAttendanceSessionValidator = validate(
  checkSchema(
    {
      class_id: {
        custom: {
          options: (value) => {
            if (!ObjectId.isValid(value)) {
              throw new Error('Invalid class_id')
            }
            return true
          }
        }
      },
      subject_id: {
        custom: {
          options: (value) => {
            if (!ObjectId.isValid(value)) {
              throw new Error('Invalid subject_id')
            }
            return true
          }
        }
      },
      teacher_id: {
        custom: {
          options: (value) => {
            if (!ObjectId.isValid(value)) {
              throw new Error('Invalid teacher_id')
            }
            return true
          }
        }
      },
      date: {
        isISO8601: true
      },
      type: {
        isString: true,
        isIn: {
          options: ['MORNING', 'AFTERNOON', 'FULL_DAY', 'SUBJECT']
        }
      },
      status: {
        isString: true,
        isIn: {
          options: ['OPEN', 'CLOSED']
        }
      }
    },
    ['body']
  )
)
export const updateAttendanceSessionValidator = validate(
  checkSchema(
    {
      class_id: {
        optional: true,
        custom: {
          options: (value) => {
            if (!ObjectId.isValid(value)) {
              throw new Error('Invalid class_id')
            }
            return true
          }
        }
      },
      subject_id: {
        optional: true,
        custom: {
          options: (value) => {
            if (!ObjectId.isValid(value)) {
              throw new Error('Invalid subject_id')
            }
            return true
          }
        }
      },
      teacher_id: {
        optional: true,
        custom: {
          options: (value) => {
            if (!ObjectId.isValid(value)) {
              throw new Error('Invalid teacher_id')
            }
            return true
          }
        }
      },
      date: {
        optional: true,
        isISO8601: true
      },
      type: {
        optional: true,
        isString: true,
        isIn: {
          options: ['MORNING', 'AFTERNOON', 'FULL_DAY', 'SUBJECT']
        }
      },
      status: {
        optional: true,
        isString: true,
        isIn: {
          options: ['OPEN', 'LOCKED']
        }
      }
    },
    ['body']
  )
)
