import databaseService from './database.services'

class AuditLogsService {
  async getAuditLogs({ page, limit }: { page: number; limit: number }) {
    const logs = await databaseService.auditLogs
      .find({})
      .sort({ created_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    const total = await databaseService.auditLogs.countDocuments()
    return {
      logs,
      total_page: Math.ceil(total / limit),
      total
    }
  }
}

const auditLogsService = new AuditLogsService()
export default auditLogsService
