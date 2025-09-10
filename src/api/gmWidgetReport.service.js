import { api } from 'src/boot/axios'


export const gmWidgetReportService = {
  name: 'GmWidgetReport',
  /**
   * Get Top N Slots Gm Widget Report
   *
   * @param {object} [data]
   * @param {undefined} [data.currencyId] - Currency Id
   * @param {undefined} [data.count] - Count
   * @param {undefined} [data.slotMachineId] - Slot Machine Id
   * @param {undefined} [data.reportType] - Report Type
   * @param {undefined} [data.reportDirection] - Report Direction
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getTopNSlots(data = {}, options = {}) {
    return api.get('/api/GmWidgetReport/GetTopNSlots', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Top N Slot Brands Gm Widget Report
   *
   * @param {object} [data]
   * @param {undefined} [data.casinoId] - Casino Id
   * @param {undefined} [data.currencyId] - Currency Id
   * @param {undefined} [data.reportType] - Report Type
   * @param {undefined} [data.reportDirection] - Report Direction
   * @param {undefined} [data.count] - Count
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getTopNSlotBrands(data = {}, options = {}) {
    return api.get('/api/GmWidgetReport/GetTopNSlotBrands', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Top N Slot Banks Gm Widget Report
   *
   * @param {object} [data]
   * @param {undefined} [data.currencyId] - Currency Id
   * @param {undefined} [data.count] - Count
   * @param {undefined} [data.reportType] - Report Type
   * @param {undefined} [data.reportDirection] - Report Direction
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getTopNSlotBanks(data = {}, options = {}) {
    return api.get('/api/GmWidgetReport/GetTopNSlotBanks', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Money Stats Summary Gm Widget Report
   *
   * @param {object} [data]
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
  getMoneyStatsSummary(data = {}, options = {}) {
    return api.get('/api/GmWidgetReport/GetMoneyStatsSummary', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Top N Players Gm Widget Report
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.currencyId] - Currency Id
   * @param {undefined} [data.count] - Count
   * @param {undefined} [data.reportType] - Report Type
   * @param {undefined} [data.reportDirection] - Report Direction
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getTopNPlayers(data = {}, options = {}) {
    return api.get('/api/GmWidgetReport/GetTopNPlayers', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
