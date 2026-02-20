import { Router } from 'express'
import {
  createFeeStructureController,
  createInvoiceController,
  getFeeStructureDetailController,
  getFeeStructuresController,
  getInvoiceDetailController,
  getInvoicesController
} from '~/controllers/financial.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const financialRouter = Router()

// Fee Structures
financialRouter.get(
  '/fees',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(getFeeStructuresController)
)
financialRouter.get(
  '/fees/:id',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(getFeeStructureDetailController)
)
financialRouter.post(
  '/fees',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(createFeeStructureController)
)

// Invoices
financialRouter.get('/invoices', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(getInvoicesController))
financialRouter.get(
  '/invoices/:id',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(getInvoiceDetailController)
)
financialRouter.post(
  '/invoices',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(createInvoiceController)
)

export default financialRouter
