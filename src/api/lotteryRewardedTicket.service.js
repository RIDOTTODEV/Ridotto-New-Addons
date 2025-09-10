import { api } from 'src/boot/axios'


export const lotteryRewardedTicketService = {
  name: 'LotteryRewardedTicket',
  /**
   * Check And Save Lottery Rewarded Ticket
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  checkAndSave(data = {}, options = {}) {
    return api.post('/api/LotteryRewardedTicket/CheckAndSave', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Reward Ticket Lottery Rewarded Ticket
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updateRewardTicket(data = {}, options = {}) {
    return api.post('/api/LotteryRewardedTicket/UpdateRewardTicket', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Lottery Rewarded Ticket
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  get(data = {}, options = {}) {
    return api.get('/api/LotteryRewardedTicket/Get', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get All Lottery Rewarded Ticket
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
    return api.get('/api/LotteryRewardedTicket/GetAll', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Create Lottery Rewarded Ticket
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  create(data = {}, options = {}) {
    return api.post('/api/LotteryRewardedTicket/Create', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Lottery Rewarded Ticket
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  update(data = {}, options = {}) {
    return api.post('/api/LotteryRewardedTicket/Update', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Delete Lottery Rewarded Ticket
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  delete(data = {}, options = {}) {
    return api.delete('/api/LotteryRewardedTicket/Delete', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
