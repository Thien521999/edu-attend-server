import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { validate } from '~/utils/validation'

export const createSchoolValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: true,
        isString: true,
        trim: true
      },
      code: {
        notEmpty: true,
        isString: true,
        trim: true
      },
      address: {
        notEmpty: true,
        isString: true,
        trim: true
      },
      phone: {
        notEmpty: true,
        isString: true,
        trim: true
      },
      email: {
        notEmpty: true,
        isEmail: true,
        trim: true
      }
    },
    ['body']
  )
)

export const updateSchoolValidator = validate(
  checkSchema(
    {
      name: {
        optional: true,
        isString: true,
        trim: true
      },
      code: {
        optional: true,
        isString: true,
        trim: true
      },
      address: {
        optional: true,
        isString: true,
        trim: true
      },
      phone: {
        optional: true,
        isString: true,
        trim: true
      },
      email: {
        optional: true,
        isEmail: true,
        trim: true
      }
    },
    ['body']
  )
)

export const schoolIdValidator = validate(
  checkSchema(
    {
      id: {
        custom: {
          options: (value) => {
            if (!ObjectId.isValid(value)) {
              throw new Error('Invalid school_id')
            }
            return true
          }
        }
      }
    },
    ['params']
  )
)
