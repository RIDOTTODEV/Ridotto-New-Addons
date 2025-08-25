import { api } from 'src/boot/axios'


export const xLotteryService = {
  name: 'XLottery',
  /**
   * Get All X Lottery
   *
   * @param {object} [data]
   * @param {undefined} [data.participationStartDate] - Participation Start Date
   * @param {undefined} [data.participationEndDate] - Participation End Date
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
    return api.get('/api/XLottery/GetAll', { params: data, ...options })
  },
  /**
   * Create Lottery X Lottery
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  createLottery(data = {}, options = {}) {
    return api.post('/api/XLottery/CreateLottery', data, options)
  },
  /**
   * Get Highlight Lottery X Lottery
   *
   * @param {object} [data]
   * @param {undefined} [data.lotteryId] - Lottery Id
   * @param {undefined} [data.playerId] - Player Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getHighlightLottery(data = {}, options = {}) {
    return api.get('/api/XLottery/GetHighlightLottery', { params: data, ...options })
  },
  /**
   * Get Lottery X Lottery
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getLottery(data = {}, options = {}) {
    return api.get('/api/XLottery/GetLottery', { params: data, ...options })
  },
  /**
   * Update Lottery X Lottery
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updateLottery(data = {}, options = {}) {
    return api.post('/api/XLottery/UpdateLottery', data, options)
  },
  /**
   * Get Player Lottery Point X Lottery
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.lotteryId] - Lottery Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerLotteryPoint(data = {}, options = {}) {
    return api.get('/api/XLottery/GetPlayerLotteryPoint', { params: data, ...options })
  },
  /**
   * Get Player Lotteries X Lottery
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.filterClosedLotteries] - Filter Closed Lotteries
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerLotteries(data = {}, options = {}) {
    return api.get('/api/XLottery/GetPlayerLotteries', { params: data, ...options })
  },
  /**
   * Get Lottery Player Point Totals X Lottery
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
  getLotteryPlayerPointTotals(data = {}, options = {}) {
    return api.get('/api/XLottery/GetLotteryPlayerPointTotals', { params: data, ...options })
  },
  /**
   * Get Lottery Player Points X Lottery
   *
   * @param {object} [data]
   * @param {undefined} [data.casinoId] - Casino Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.lotteryId] - Lottery Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.sorting] - Sorting
   * @param {undefined} [data.maxResultCount] - Max Result Count
   * @param {undefined} [data.skipCount] - Skip Count
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getLotteryPlayerPoints(data = {}, options = {}) {
    if (!data.maxResultCount) {
      data.maxResultCount = 999
    }
    if (!data.skipCount) {
      data.skipCount = 0
    }
    return api.get('/api/XLottery/GetLotteryPlayerPoints', { params: data, ...options })
  },
  /**
   * Get Lottery Winner Ticket X Lottery
   *
   * @param {object} [data]
   * @param {undefined} [data.lotteryId] - Lottery Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getLotteryWinnerTicket(data = {}, options = {}) {
    return api.get('/api/XLottery/GetLotteryWinnerTicket', { params: data, ...options })
  },
  /**
   * Get All Tickets X Lottery
   *
   * @param {object} [data]
   * @param {undefined} [data.lotteryId] - Lottery Id
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.ticketNo] - Ticket No
   * @param {undefined} [data.sorting] - Sorting
   * @param {undefined} [data.maxResultCount] - Max Result Count
   * @param {undefined} [data.skipCount] - Skip Count
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getAllTickets(data = {}, options = {}) {
    if (!data.maxResultCount) {
      data.maxResultCount = 999
    }
    if (!data.skipCount) {
      data.skipCount = 0
    }
    return api.get('/api/XLottery/GetAllTickets', { params: data, ...options })
  },
  /**
   * Get Lottery Ticket Count And Turn Over X Lottery
   *
   * @param {object} [data]
   * @param {undefined} [data.lotteryId] - Lottery Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.casinoId] - Casino Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getLotteryTicketCountAndTurnOver(data = {}, options = {}) {
    return api.get('/api/XLottery/GetLotteryTicketCountAndTurnOver', { params: data, ...options })
  }
}
