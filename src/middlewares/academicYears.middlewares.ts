import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { validate } from '~/utils/validation'

export const createAcademicYearValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: true,
        isString: true,
        trim: true
      },
      start_date: {
        isISO8601: true
      },
      end_date: {
        isISO8601: true
      },
      is_active: {
        isBoolean: true
      }
    },
    ['body']
  )
)

export const updateAcademicYearValidator = validate(
  checkSchema(
    {
      name: {
        optional: true,
        isString: true,
        trim: true
      },
      start_date: {
        optional: true,
        isISO8601: true
      },
      end_date: {
        optional: true,
        isISO8601: true
      },
      is_active: {
        optional: true,
        isBoolean: true
      }
    },
    ['body']
  )
)

export const academicYearIdValidator = validate(
  checkSchema(
    {
      id: {
        custom: {
          options: (value) => {
            if (!ObjectId.isValid(value)) {
              throw new Error('Invalid academic_year_id')
            }
            return true
          }
        }
      }
    },
    ['params']
  )
)
