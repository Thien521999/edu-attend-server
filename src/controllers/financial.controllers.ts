import { NextFunction, Request, Response } from 'express'
import { FINANCIAL_MESSAGES } from '~/constants/messages'
import financialService from '~/services/financial.services'
// import financialService from '~/services/financial.services'

// Fee Structures
export const createFeeStructureController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await financialService.createFeeStructure(req.body)
  res.json({
    message: FINANCIAL_MESSAGES.CREATE_FEE_STRUCTURE_SUCCESS,
    result
  })
}

export const getFeeStructuresController = async (req: Request, res: Response, next: NextFunction) => {
  const { page, limit } = req.query
  const result = await financialService.getFeeStructures({
    page: Number(page as string) || 1,
    limit: Number(limit as string) || 10
  })
  res.json({
    message: FINANCIAL_MESSAGES.GET_FEE_STRUCTURES_SUCCESS,
    result
  })
}

export const getFeeStructureDetailController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const result = await financialService.getFeeStructureDetail(id as string)
  if (!result) {
    res.status(404).json({
      message: FINANCIAL_MESSAGES.FEE_STRUCTURE_NOT_FOUND
    })
    return
  }
  res.json({
    message: FINANCIAL_MESSAGES.GET_FEE_STRUCTURE_DETAIL_SUCCESS,
    result
  })
}

// Invoices
export const createInvoiceController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await financialService.createInvoice(req.body)
  res.json({
    message: FINANCIAL_MESSAGES.CREATE_INVOICE_SUCCESS,
    result
  })
}

export const getInvoicesController = async (req: Request, res: Response, next: NextFunction) => {
  const { page, limit } = req.query
  const result = await financialService.getInvoices({
    page: Number(page as string) || 1,
    limit: Number(limit as string) || 10
  })
  res.json({
    message: FINANCIAL_MESSAGES.GET_INVOICES_SUCCESS,
    result
  })
}

export const getInvoiceDetailController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const result = await financialService.getInvoiceDetail(id as string)
  if (!result) {
    res.status(404).json({
      message: FINANCIAL_MESSAGES.INVOICE_NOT_FOUND
    })
    return
  }
  res.json({
    message: FINANCIAL_MESSAGES.GET_INVOICE_DETAIL_SUCCESS,
    result
  })
}
