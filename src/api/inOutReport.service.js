import { api } from 'src/boot/axios'


export const inOutReportService = {
  name: 'InOutReport',
  /**
   * Get In Out Report New In Out Report
   *
   * @param {object} [data]
   * @param {undefined} [data.balanceCurrencyId] - Balance Currency Id
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getInOutReportNew(data = {}, options = {}) {
    return api.get('/api/InOutReport/GetInOutReportNew', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get In Out Player Detail In Out Report
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.balanceCurrencyId] - Balance Currency Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getInOutPlayerDetail(data = {}, options = {}) {
    return api.get('/api/InOutReport/GetInOutPlayerDetail', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Report Detail In Out In Out Report
   *
   * @param {object} [data]
   * @param {undefined} [data.balanceCurrencyId] - Balance Currency Id
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getReportDetailInOut(data = {}, options = {}) {
    return api.get('/api/InOutReport/GetReportDetailInOut', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Report Detail Net In Out Report
   *
   * @param {object} [data]
   * @param {undefined} [data.balanceCurrencyId] - Balance Currency Id
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getReportDetailNet(data = {}, options = {}) {
    return api.get('/api/InOutReport/GetReportDetailNet', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Filtered Report In Out Report
   *
   * @param {object} [data]
   * @param {undefined} [data.balanceCurrencyId] - Balance Currency Id
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getFilteredReport(data = {}, options = {}) {
    return api.get('/api/InOutReport/GetFilteredReport', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Net Cash Report In Out Report
   *
   * @param {object} [data]
   * @param {undefined} [data.balanceCurrencyId] - Balance Currency Id
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getNetCashReport(data = {}, options = {}) {
    return api.get('/api/InOutReport/GetNetCashReport', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Net Cash Summary Report In Out Report
   *
   * @param {object} [data]
   * @param {undefined} [data.balanceCurrencyId] - Balance Currency Id
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getNetCashSummaryReport(data = {}, options = {}) {
    return api.get('/api/InOutReport/GetNetCashSummaryReport', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Player Missing Chip Details In Out Report
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.balanceCurrencyId] - Balance Currency Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerMissingChipDetails(data = {}, options = {}) {
    return api.get('/api/InOutReport/GetPlayerMissingChipDetails', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Player Net Cash In Out Report
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.balanceCurrencyId] - Balance Currency Id
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerNetCash(data = {}, options = {}) {
    return api.get('/api/InOutReport/GetPlayerNetCash', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Player Transaction History In Out Report
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerTransactionHistory(data = {}, options = {}) {
    return api.get('/api/InOutReport/GetPlayerTransactionHistory', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Slot In Out Report In Out Report
   *
   * @param {object} [data]
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.balanceCurrencyId] - Balance Currency Id
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.sorting] - Sorting
   * @param {undefined} [data.maxResultCount] - Max Result Count
   * @param {undefined} [data.skipCount] - Skip Count
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getSlotInOutReport(data = {}, options = {}) {
    if (!data.maxResultCount) {
      data.maxResultCount = 999
    }
    if (!data.skipCount) {
      data.skipCount = 0
    }
    return api.get('/api/InOutReport/GetSlotInOutReport', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
