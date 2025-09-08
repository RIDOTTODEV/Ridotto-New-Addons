import { api } from 'src/boot/axios'


export const reportService = {
  name: 'Report',
  /**
   * Get Master Report Report
   *
   * @param {object} [data]
   * @param {undefined} [data.balanceCurrencyId] - Balance Currency Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getMasterReport(data = {}, options = {}) {
    return api.get('/api/Report/GetMasterReport', { params: data, ...options })
  },
  /**
   * Get Balance Report Report
   *
   * @param {object} [data]
   * @param {undefined} [data.cashdeskId] - Cashdesk Id
   * @param {undefined} [data.balanceCurrencyId] - Balance Currency Id
   * @param {undefined} [data.date] - Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getBalanceReport(data = {}, options = {}) {
    return api.get('/api/Report/GetBalanceReport', { params: data, ...options })
  },
  /**
   * Get Table Count Report Report
   *
   * @param {object} [data]
   * @param {undefined} [data.tableIds] - Table Ids
   * @param {undefined} [data.date] - Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getTableCountReport(data = {}, options = {}) {
    return api.get('/api/Report/GetTableCountReport', { params: data, ...options })
  },
  /**
   * Get Table Counts Report
   *
   * @param {object} [data]
   * @param {undefined} [data.tableCountIds] - Table Count Ids
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getTableCounts(data = {}, options = {}) {
    return api.get('/api/Report/GetTableCounts', { params: data, ...options })
  },
  /**
   * Get Active Floor List Report Report
   *
   * @param {object} [data]
   * @param {undefined} [data.defaultCurrencyId] - Default Currency Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getActiveFloorListReport(data = {}, options = {}) {
    return api.get('/api/Report/GetActiveFloorListReport', { params: data, ...options })
  },
  /**
   * Get Live Game Floor Result Report
   *
   * @param {object} [data]
   * @param {undefined} [data.date] - Date
   * @param {undefined} [data.timezoneOffsetHours] - Timezone Offset Hours
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getLiveGameFloorResult(data = {}, options = {}) {
    return api.get('/api/Report/GetLiveGameFloorResult', { params: data, ...options })
  },
  /**
   * Get Game Result Report Report
   *
   * @param {object} [data]
   * @param {undefined} [data.date] - Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getGameResultReport(data = {}, options = {}) {
    return api.get('/api/Report/GetGameResultReport', { params: data, ...options })
  },
  /**
   * Get Player Win Loss Analysis Report Report
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.balanceCurrencyId] - Balance Currency Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerWinLossAnalysisReport(data = {}, options = {}) {
    return api.get('/api/Report/GetPlayerWinLossAnalysisReport', { params: data, ...options })
  },
  /**
   * Get Player Info Audit Logs Report
   *
   * @param {object} [data]
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.maxResultCount] - Max Result Count
   * @param {undefined} [data.skipCount] - Skip Count
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerInfoAuditLogs(data = {}, options = {}) {
    if (!data.maxResultCount) {
      data.maxResultCount = 999
    }
    if (!data.skipCount) {
      data.skipCount = 0
    }
    return api.get('/api/Report/GetPlayerInfoAuditLogs', { params: data, ...options })
  },
  /**
   * Get Player Lookup Audit Logs Report
   *
   * @param {object} [data]
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.maxResultCount] - Max Result Count
   * @param {undefined} [data.skipCount] - Skip Count
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerLookupAuditLogs(data = {}, options = {}) {
    if (!data.maxResultCount) {
      data.maxResultCount = 999
    }
    if (!data.skipCount) {
      data.skipCount = 0
    }
    return api.get('/api/Report/GetPlayerLookupAuditLogs', { params: data, ...options })
  }
}
