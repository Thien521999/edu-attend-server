import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation'

export const createClassValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: true,
        isString: true,
        trim: true,
        isLength: {
          options: { min: 1, max: 100 }
        },
        custom: {
          options: async (value) => {
            const classExists = await databaseService.classes.findOne({ name: value })
            if (classExists) {
              throw new Error('Class name already exists')
            }
            return true
          }
        }
      },
      code: {
        notEmpty: true,
        isString: true,
        trim: true,
        custom: {
          options: async (value) => {
            const classExists = await databaseService.classes.findOne({ code: value })
            if (classExists) {
              throw new Error('Class code already exists')
            }
            return true
          }
        }
      },
      grade_id: {
        custom: {
          options: (value) => {
            if (!ObjectId.isValid(value)) {
              throw new Error('Invalid grade_id')
            }
            return true
          }
        }
      },
      school_id: {
        custom: {
          options: (value) => {
            if (!ObjectId.isValid(value)) {
              throw new Error('Invalid school_id')
            }
            return true
          }
        }
      },
      academic_year_id: {
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
    ['body']
  )
)

export const updateClassValidator = validate(
  checkSchema(
    {
      name: {
        optional: true,
        isString: true,
        trim: true,
        isLength: {
          options: { min: 1, max: 100 }
        }
      },
      grade_id: {
        optional: true,
        custom: {
          options: (value) => {
            if (!ObjectId.isValid(value)) {
              throw new Error('Invalid grade_id')
            }
            return true
          }
        }
      },
      school_id: {
        optional: true,
        custom: {
          options: (value) => {
            if (!ObjectId.isValid(value)) {
              throw new Error('Invalid school_id')
            }
            return true
          }
        }
      },
      academic_year_id: {
        optional: true,
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
    ['body']
  )
)

export const classIdValidator = validate(
  checkSchema(
    {
      id: {
        custom: {
          options: (value) => {
            if (!ObjectId.isValid(value)) {
              throw new Error('Invalid class_id')
            }
            return true
          }
        }
      }
    },
    ['params']
  )
)
