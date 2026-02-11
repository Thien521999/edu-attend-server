import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { validate } from '~/utils/validation'

export const createGradeValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: true,
        isString: true,
        trim: true
      },
      level: {
        notEmpty: true,
        isNumeric: true
      }
    },
    ['body']
  )
)

export const updateGradeValidator = validate(
  checkSchema(
    {
      name: {
        optional: true,
        isString: true,
        trim: true
      },
      level: {
        optional: true,
        isNumeric: true
      }
    },
    ['body']
  )
)

export const gradeIdValidator = validate(
  checkSchema(
    {
      id: {
        custom: {
          options: (value) => {
            if (!ObjectId.isValid(value)) {
              throw new Error('Invalid grade_id')
            }
            return true
          }
        }
      }
    },
    ['params']
  )
)
