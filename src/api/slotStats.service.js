import { api } from 'src/boot/axios'


export const slotStatsService = {
  name: 'SlotStats',
  /**
   * Get Slot Daily Player Detail Slot Stats
   *
   * @param {object} [data]
   * @param {undefined} [data.slotMachineId] - Slot Machine Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.reportDirection] - Report Direction
   * @param {undefined} [data.sorting] - Sorting
   * @param {undefined} [data.maxResultCount] - Max Result Count
   * @param {undefined} [data.skipCount] - Skip Count
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getSlotDailyPlayerDetail(data = {}, options = {}) {
    if (!data.maxResultCount) {
      data.maxResultCount = 999
    }
    if (!data.skipCount) {
      data.skipCount = 0
    }
    return api.get('/api/SlotStats/GetSlotDailyPlayerDetail', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Slot Machine Top10 Games Slot Stats
   *
   * @param {object} [data]
   * @param {undefined} [data.slotMachineId] - Slot Machine Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.reportDirection] - Report Direction
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getSlotMachineTop10Games(data = {}, options = {}) {
    return api.get('/api/SlotStats/GetSlotMachineTop10Games', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Slot Machine Top10 Players Slot Stats
   *
   * @param {object} [data]
   * @param {undefined} [data.slotMachineId] - Slot Machine Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.reportDirection] - Report Direction
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getSlotMachineTop10Players(data = {}, options = {}) {
    return api.get('/api/SlotStats/GetSlotMachineTop10Players', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Slot Brand Summary Games Played Slot Stats
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
  slotBrandSummaryGamesPlayed(data = {}, options = {}) {
    return api.get('/api/SlotStats/SlotBrandSummaryGamesPlayed', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Slot Result By Gaming Date Graph Slot Stats
   *
   * @param {object} [data]
   * @param {undefined} [data.slotMachineId] - Slot Machine Id
   * @param {undefined} [data.reportDirection] - Report Direction
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.queryType] - Query Type
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getSlotResultByGamingDateGraph(data = {}, options = {}) {
    return api.get('/api/SlotStats/GetSlotResultByGamingDateGraph', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Top N Games By Bet And Games Played Slot Stats
   *
   * @param {object} [data]
   * @param {undefined} [data.count] - Count
   * @param {undefined} [data.gamesByResultType] - Games By Result Type
   * @param {undefined} [data.reportDirection] - Report Direction
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.queryType] - Query Type
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getTopNGamesByBetAndGamesPlayed(data = {}, options = {}) {
    return api.get('/api/SlotStats/GetTopNGamesByBetAndGamesPlayed', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
