import { api } from 'src/boot/axios'


export const exportService = {
  name: 'Export',
  /**
   * Get Slot Win Loss Export
   *
   * @param {object} [data]
   * @param {undefined} [data.exportFileType] - Export File Type
   * @param {undefined} [data.brandId] - Brand Id
   * @param {undefined} [data.modelId] - Model Id
   * @param {undefined} [data.bankId] - Bank Id
   * @param {undefined} [data.meterGroupId] - Meter Group Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getSlotWinLoss(data = {}, options = {}) {
    return api.get('/api/Export/GetSlotWinLoss', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Promo Player Win Loss Export
   *
   * @param {object} [data]
   * @param {undefined} [data.exportFileType] - Export File Type
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.queryType] - Query Type
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPromoPlayerWinLoss(data = {}, options = {}) {
    return api.get('/api/Export/GetPromoPlayerWinLoss', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Player Win Loss Export
   *
   * @param {object} [data]
   * @param {undefined} [data.exportFileType] - Export File Type
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.queryType] - Query Type
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerWinLoss(data = {}, options = {}) {
    return api.get('/api/Export/GetPlayerWinLoss', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Slot Statistics By Meter Export
   *
   * @param {object} [data]
   * @param {undefined} [data.exportFileType] - Export File Type
   * @param {undefined} [data.brandId] - Brand Id
   * @param {undefined} [data.modelId] - Model Id
   * @param {undefined} [data.bankId] - Bank Id
   * @param {undefined} [data.meterGroupId] - Meter Group Id
   * @param {undefined} [data.jackpotGroupId] - Jackpot Group Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getSlotStatisticsByMeter(data = {}, options = {}) {
    return api.get('/api/Export/GetSlotStatisticsByMeter', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Slot Statistics By Money Export Export
   *
   * @param {object} [data]
   * @param {undefined} [data.exportFileType] - Export File Type
   * @param {undefined} [data.brandId] - Brand Id
   * @param {undefined} [data.modelId] - Model Id
   * @param {undefined} [data.bankId] - Bank Id
   * @param {undefined} [data.meterGroupId] - Meter Group Id
   * @param {undefined} [data.jackpotGroupId] - Jackpot Group Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  slotStatisticsByMoneyExport(data = {}, options = {}) {
    return api.get('/api/Export/SlotStatisticsByMoneyExport', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Slot Statistics By Game Export Export
   *
   * @param {object} [data]
   * @param {undefined} [data.exportFileType] - Export File Type
   * @param {undefined} [data.brandId] - Brand Id
   * @param {undefined} [data.modelId] - Model Id
   * @param {undefined} [data.bankId] - Bank Id
   * @param {undefined} [data.meterGroupId] - Meter Group Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  slotStatisticsByGameExport(data = {}, options = {}) {
    return api.get('/api/Export/SlotStatisticsByGameExport', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Game Statistics By Slot Export Export
   *
   * @param {object} [data]
   * @param {undefined} [data.exportFileType] - Export File Type
   * @param {undefined} [data.brandId] - Brand Id
   * @param {undefined} [data.modelId] - Model Id
   * @param {undefined} [data.bankId] - Bank Id
   * @param {undefined} [data.meterGroupId] - Meter Group Id
   * @param {undefined} [data.jackpotGroupId] - Jackpot Group Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  gameStatisticsBySlotExport(data = {}, options = {}) {
    return api.get('/api/Export/GameStatisticsBySlotExport', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Master Report Export
   *
   * @param {object} [data]
   * @param {undefined} [data.exportFileType] - Export File Type
   * @param {undefined} [data.balanceCurrencyId] - Balance Currency Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getMasterReport(data = {}, options = {}) {
    return api.get('/api/Export/GetMasterReport', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Balance Report Export
   *
   * @param {object} [data]
   * @param {undefined} [data.exportFileType] - Export File Type
   * @param {undefined} [data.cashdeskId] - Cashdesk Id
   * @param {undefined} [data.balanceCurrencyId] - Balance Currency Id
   * @param {undefined} [data.date] - Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getBalanceReport(data = {}, options = {}) {
    return api.get('/api/Export/GetBalanceReport', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Player Portfolio Export
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.rating] - Rating
   * @param {undefined} [data.withResult] - With Result
   * @param {undefined} [data.birthDay] - Birth Day
   * @param {undefined} [data.spouseBirthDay] - Spouse Birth Day
   * @param {undefined} [data.weddingAnniversary] - Wedding Anniversary
   * @param {undefined} [data.defaultCurrencyId] - Default Currency Id
   * @param {undefined} [data.date] - Date
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.exportFileType] - Export File Type
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerPortfolio(data = {}, options = {}) {
    return api.get('/api/Export/GetPlayerPortfolio', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
