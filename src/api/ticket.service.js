import { api } from 'src/boot/axios'


export const ticketService = {
  name: 'Ticket',
  /**
   * Get All Ticket
   *
   * @param {object} [data]
   * @param {undefined} [data.defaultCurrencyId] - Default Currency Id
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.playerName] - Player Name
   * @param {undefined} [data.ticketNo] - Ticket No
   * @param {undefined} [data.currencyId] - Currency Id
   * @param {undefined} [data.minAmount] - Min Amount
   * @param {undefined} [data.maxAmount] - Max Amount
   * @param {undefined} [data.status] - Status
   * @param {undefined} [data.cashDeskId] - Cash Desk Id
   * @param {undefined} [data.ticketType] - Ticket Type
   * @param {undefined} [data.cashDeskType] - Cash Desk Type
   * @param {undefined} [data.expiryDateStart] - Expiry Date Start
   * @param {undefined} [data.expiryDateEnd] - Expiry Date End
   * @param {undefined} [data.redeemedDateStart] - Redeemed Date Start
   * @param {undefined} [data.redeemedDateEnd] - Redeemed Date End
   * @param {undefined} [data.creationTimeStart] - Creation Time Start
   * @param {undefined} [data.creationTimeEnd] - Creation Time End
   * @param {undefined} [data.redeemedCashDeskId] - Redeemed Cash Desk Id
   * @param {undefined} [data.redeemedCashDeskType] - Redeemed Cash Desk Type
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
    return api.get('/api/Ticket/GetAll', { params: data, ...options })
  },
  /**
   * Create Ticket
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  create(data = {}, options = {}) {
    return api.post('/api/Ticket/Create', data, options)
  },
  /**
   * Get Ticket Ticket
   *
   * @param {object} [data]
   * @param {undefined} [data.ticketId] - Ticket Id
   * @param {undefined} [data.ticketNo] - Ticket No
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getTicket(data = {}, options = {}) {
    return api.get('/api/Ticket/GetTicket', { params: data, ...options })
  },
  /**
   * Update Status Ticket
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updateStatus(data = {}, options = {}) {
    return api.post('/api/Ticket/UpdateStatus', data, options)
  },
  /**
   * Get All For Panel Ticket
   *
   * @param {object} [data]
   * @param {undefined} [data.floorNo] - Floor No
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.playerName] - Player Name
   * @param {undefined} [data.ticketNo] - Ticket No
   * @param {undefined} [data.currencyId] - Currency Id
   * @param {undefined} [data.minAmount] - Min Amount
   * @param {undefined} [data.maxAmount] - Max Amount
   * @param {undefined} [data.status] - Status
   * @param {undefined} [data.cashDeskId] - Cash Desk Id
   * @param {undefined} [data.ticketType] - Ticket Type
   * @param {undefined} [data.cashDeskType] - Cash Desk Type
   * @param {undefined} [data.redeemedCashDeskId] - Redeemed Cash Desk Id
   * @param {undefined} [data.redeemedCashDeskType] - Redeemed Cash Desk Type
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
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
  getAllForPanel(data = {}, options = {}) {
    if (!data.maxResultCount) {
      data.maxResultCount = 999
    }
    if (!data.skipCount) {
      data.skipCount = 0
    }
    return api.get('/api/Ticket/GetAllForPanel', { params: data, ...options })
  },
  /**
   * Get Ticket Summaries Ticket
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.currencyId] - Currency Id
   * @param {undefined} [data.status] - Status
   * @param {undefined} [data.creatorCashDeskId] - Creator Cash Desk Id
   * @param {undefined} [data.creatorCashDeskType] - Creator Cash Desk Type
   * @param {undefined} [data.redeemedCashDeskId] - Redeemed Cash Desk Id
   * @param {undefined} [data.redeemedCashDeskType] - Redeemed Cash Desk Type
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getTicketSummaries(data = {}, options = {}) {
    return api.get('/api/Ticket/GetTicketSummaries', { params: data, ...options })
  },
  /**
   * Get Ticket History Ticket
   *
   * @param {object} [data]
   * @param {undefined} [data.ticketNo] - Ticket No
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getTicketHistory(data = {}, options = {}) {
    return api.get('/api/Ticket/GetTicketHistory', { params: data, ...options })
  }
}
