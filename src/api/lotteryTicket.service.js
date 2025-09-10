import { api } from 'src/boot/axios'


export const lotteryTicketService = {
  name: 'LotteryTicket',
  /**
   * Get All Lottery Ticket
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
  getAll(data = {}, options = {}) {
    if (!data.maxResultCount) {
      data.maxResultCount = 999
    }
    if (!data.skipCount) {
      data.skipCount = 0
    }
    return api.get('/api/LotteryTicket/GetAll', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Tickets Printed Status Lottery Ticket
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updateTicketsPrintedStatus(data = {}, options = {}) {
    return api.post('/api/LotteryTicket/UpdateTicketsPrintedStatus', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Players Not Printed Their Lottery Tickets Lottery Ticket
   *
   * @param {object} [data]
   * @param {undefined} [data.lotteryId] - Lottery Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayersNotPrintedTheirLotteryTickets(data = {}, options = {}) {
    return api.get('/api/LotteryTicket/GetPlayersNotPrintedTheirLotteryTickets', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Lottery Ticket Range Lottery Ticket
   *
   * @param {object} [data]
   * @param {undefined} [data.lotteryId] - Lottery Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getLotteryTicketRange(data = {}, options = {}) {
    return api.get('/api/LotteryTicket/GetLotteryTicketRange', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Lottery Ticket Count And Turn Over Lottery Ticket
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
    return api.get('/api/LotteryTicket/GetLotteryTicketCountAndTurnOver', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Lottery Winner Ticket Lottery Ticket
   *
   * @param {object} [data]
   * @param {undefined} [data.lotteryId] - Lottery Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getLotteryWinnerTicket(data = {}, options = {}) {
    return api.get('/api/LotteryTicket/GetLotteryWinnerTicket', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Lottery Ticket
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  get(data = {}, options = {}) {
    return api.get('/api/LotteryTicket/Get', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Create Lottery Ticket
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  create(data = {}, options = {}) {
    return api.post('/api/LotteryTicket/Create', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Lottery Ticket
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  update(data = {}, options = {}) {
    return api.post('/api/LotteryTicket/Update', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Delete Lottery Ticket
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  delete(data = {}, options = {}) {
    return api.delete('/api/LotteryTicket/Delete', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
