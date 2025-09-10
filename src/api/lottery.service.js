import { api } from 'src/boot/axios'


export const lotteryService = {
  name: 'Lottery',
  /**
   * Get Highlight Lottery Lottery
   *
   * @param {object} [data]
   * @param {undefined} [data.lotteryId] - Lottery Id
   * @param {undefined} [data.playerId] - Player Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getHighlightLottery(data = {}, options = {}) {
    return api.get('/api/Lottery/GetHighlightLottery', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Ddl Lottery
   *
   * @param {object} [data]
   * @param {undefined} [data.name] - Name
   * @param {undefined} [data.description] - Description
   * @param {undefined} [data.rewards] - Rewards
   * @param {undefined} [data.welcomeBonusTicket] - Welcome Bonus Ticket
   * @param {undefined} [data.isClosed] - Is Closed
   * @param {undefined} [data.calculationStartDate] - Calculation Start Date
   * @param {undefined} [data.calculationEndDate] - Calculation End Date
   * @param {undefined} [data.betMultiplier] - Bet Multiplier
   * @param {undefined} [data.ticketPrice] - Ticket Price
   * @param {undefined} [data.calculationType] - Calculation Type
   * @param {undefined} [data.extraFactorType] - Extra Factor Type
   * @param {undefined} [data.participationStartDate] - Participation Start Date
   * @param {undefined} [data.participationEndDate] - Participation End Date
   * @param {undefined} [data.showHighlightLotteryInTickets] - Show Highlight Lottery In Tickets
   * @param {undefined} [data.sorting] - Sorting
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getDdl(data = {}, options = {}) {
    return api.get('/api/Lottery/GetDdl', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Player Lottery Credit Lottery
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.lotteryId] - Lottery Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerLotteryCredit(data = {}, options = {}) {
    return api.get('/api/Lottery/GetPlayerLotteryCredit', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Player Lotteries Credit Lottery
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.filterClosedLotteries] - Filter Closed Lotteries
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerLotteriesCredit(data = {}, options = {}) {
    return api.get('/api/Lottery/GetPlayerLotteriesCredit', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Top N Lottery Lottery
   *
   * @param {object} [data]
   * @param {undefined} data.count - Count
   * @param {undefined} [data.reportDirection] - Report Direction
   * @param {undefined} [data.lotteryReportType] - Lottery Report Type
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getTopNLottery(data = {}, options = {}) {
    return api.get('/api/Lottery/GetTopNLottery', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Top N Lottery Ticket Detail Lottery
   *
   * @param {object} [data]
   * @param {undefined} data.lotteryId - Lottery Id
   * @param {undefined} data.count - Count
   * @param {undefined} [data.reportDirection] - Report Direction
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getTopNLotteryTicketDetail(data = {}, options = {}) {
    return api.get('/api/Lottery/GetTopNLotteryTicketDetail', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Player Lotteries Credit For Panel Lottery
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.filterClosedLotteries] - Filter Closed Lotteries
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerLotteriesCreditForPanel(data = {}, options = {}) {
    return api.get('/api/Lottery/GetPlayerLotteriesCreditForPanel', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Player Lottery Credit For Panel Lottery
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.lotteryId] - Lottery Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerLotteryCreditForPanel(data = {}, options = {}) {
    return api.get('/api/Lottery/GetPlayerLotteryCreditForPanel', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Lottery Player Point Totals For Panel Lottery
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
    return api.get('/api/Lottery/GetLotteryPlayerPointTotalsForPanel', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Simple Create Lottery
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  simpleCreate(data = {}, options = {}) {
    return api.post('/api/Lottery/SimpleCreate', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Simple Update Lottery
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  simpleUpdate(data = {}, options = {}) {
    return api.post('/api/Lottery/SimpleUpdate', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Create Or Update Lottery
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  createOrUpdate(data = {}, options = {}) {
    return api.post('/api/Lottery/CreateOrUpdate', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Manuel End Lottery
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  manuelEnd(data = {}, options = {}) {
    return api.post('/api/Lottery/ManuelEnd', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Lottery Closed Lottery
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updateLotteryClosed(data = {}, options = {}) {
    return api.post('/api/Lottery/UpdateLotteryClosed', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Lottery
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  get(data = {}, options = {}) {
    return api.get('/api/Lottery/Get', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get All Lottery
   *
   * @param {object} [data]
   * @param {undefined} [data.calculationType] - Calculation Type
   * @param {undefined} [data.extraFactorType] - Extra Factor Type
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
    return api.get('/api/Lottery/GetAll', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Create Lottery
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  create(data = {}, options = {}) {
    return api.post('/api/Lottery/Create', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Lottery
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  update(data = {}, options = {}) {
    return api.post('/api/Lottery/Update', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Delete Lottery
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  delete(data = {}, options = {}) {
    return api.delete('/api/Lottery/Delete', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
