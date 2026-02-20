import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'

export const createJoinRequestValidator = validate(
  checkSchema(
    {
      link_code: {
        notEmpty: {
          errorMessage: 'Link code is required'
        },
        isString: {
          errorMessage: 'Link code must be a string'
        },
        trim: true
      },
      full_name: {
        notEmpty: {
          errorMessage: 'Full name is required'
        },
        isString: {
          errorMessage: 'Full name must be a string'
        },
        trim: true,
        isLength: {
          options: { min: 1, max: 100 },
          errorMessage: 'Full name must be between 1 and 100 characters'
        }
      },
      student_code: {
        optional: true,
        isString: {
          errorMessage: 'Student code must be a string'
        },
        trim: true
      }
    },
    ['body']
  )
)

export const rejectJoinRequestValidator = validate(
  checkSchema(
    {
      reason: {
        optional: true,
        isString: {
          errorMessage: 'Reason must be a string'
        },
        trim: true,
        isLength: {
          options: { max: 500 },
          errorMessage: 'Reason must be less than 500 characters'
        }
      }
    },
    ['body']
  )
)
