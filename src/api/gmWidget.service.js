import { api } from 'src/boot/axios'


export const gmWidgetService = {
  name: 'GmWidget',
  /**
   * Get Top N Players Gm Widget
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
    return api.get('/api/GmWidget/GetTopNPlayers', { params: data, ...options })
  },
  /**
   * Get Top N Slots Gm Widget
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
    return api.get('/api/GmWidget/GetTopNSlots', { params: data, ...options })
  },
  /**
   * Get Top N Player Play Time Gm Widget
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.reportDirection] - Report Direction
   * @param {undefined} [data.count] - Count
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.queryType] - Query Type
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getTopNPlayerPlayTime(data = {}, options = {}) {
    return api.get('/api/GmWidget/GetTopNPlayerPlayTime', { params: data, ...options })
  },
  /**
   * Get Top N Slot Brands Gm Widget
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
    return api.get('/api/GmWidget/GetTopNSlotBrands', { params: data, ...options })
  },
  /**
   * Get Top N Slot Banks Gm Widget
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
    return api.get('/api/GmWidget/GetTopNSlotBanks', { params: data, ...options })
  }
}
