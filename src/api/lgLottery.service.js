import { api } from 'src/boot/axios'


export const lgLotteryService = {
  name: 'LgLottery',
  /**
   * Create Or Update Lg Lottery
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  createOrUpdate(data = {}, options = {}) {
    return api.post('/api/LgLottery/CreateOrUpdate', data, options)
  },
  /**
   * Update Lg Lottery Closed Lg Lottery
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updateLgLotteryClosed(data = {}, options = {}) {
    return api.post('/api/LgLottery/UpdateLgLotteryClosed', data, options)
  },
  /**
   * Manuel End Lg Lottery
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  manuelEnd(data = {}, options = {}) {
    return api.post('/api/LgLottery/ManuelEnd', data, options)
  },
  /**
   * Get Player Lg Lotteries Lg Lottery
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerLgLotteries(data = {}, options = {}) {
    return api.get('/api/LgLottery/GetPlayerLgLotteries', { params: data, ...options })
  },
  /**
   * Get Player Lotteries Credit For Panel Lg Lottery
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.filterClosedLotteries] - Filter Closed Lotteries
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerLotteriesCreditForPanel(data = {}, options = {}) {
    return api.get('/api/LgLottery/GetPlayerLotteriesCreditForPanel', { params: data, ...options })
  },
  /**
   * Get Lottery Player Point Totals For Panel Lg Lottery
   *
   * @param {object} [data]
   * @param {undefined} [data.casinoId] - Casino Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.lotteryId] - Lottery Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getLotteryPlayerPointTotalsForPanel(data = {}, options = {}) {
    return api.get('/api/LgLottery/GetLotteryPlayerPointTotalsForPanel', { params: data, ...options })
  },
  /**
   * Get Player Lg Lottery Credit Lg Lottery
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.lotteryId] - Lottery Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerLgLotteryCredit(data = {}, options = {}) {
    return api.get('/api/LgLottery/GetPlayerLgLotteryCredit', { params: data, ...options })
  },
  /**
   * Get Lg Lottery
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  get(data = {}, options = {}) {
    return api.get('/api/LgLottery/Get', { params: data, ...options })
  },
  /**
   * Get All Lg Lottery
   *
   * @param {object} [data]
   * @param {undefined} [data.calculationStartDate] - Calculation Start Date
   * @param {undefined} [data.calculationEndDate] - Calculation End Date
   * @param {undefined} [data.isClosed] - Is Closed
   * @param {undefined} [data.sorting] - Sorting
   * @param {undefined} [data.maxResultCount] - Max Result Count
   * @param {undefined} [data.skipCount] - Skip Count
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getAll(data = {}, options = {}) {
    if (!data.maxResultCount) {
      data.maxResultCount = 999
    }
    if (!data.skipCount) {
      data.skipCount = 0
    }
    return api.get('/api/LgLottery/GetAll', { params: data, ...options })
  },
  /**
   * Create Lg Lottery
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  create(data = {}, options = {}) {
    return api.post('/api/LgLottery/Create', data, options)
  },
  /**
   * Update Lg Lottery
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  update(data = {}, options = {}) {
    return api.post('/api/LgLottery/Update', data, options)
  },
  /**
   * Delete Lg Lottery
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  delete(data = {}, options = {}) {
    return api.delete('/api/LgLottery/Delete', { params: data, ...options })
  }
}
