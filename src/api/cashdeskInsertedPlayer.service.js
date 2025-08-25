import { api } from 'src/boot/axios'


export const cashdeskInsertedPlayerService = {
  name: 'CashdeskInsertedPlayer',
  /**
   * Get All Cash Desk Card Reader Logs Cashdesk Inserted Player
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {undefined} [data.cashdeskId] - Cashdesk Id
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.firstName] - First Name
   * @param {undefined} [data.surname] - Surname
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.sorting] - Sorting
   * @param {undefined} [data.maxResultCount] - Max Result Count
   * @param {undefined} [data.skipCount] - Skip Count
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getAllCashDeskCardReaderLogs(data = {}, options = {}) {
    if (!data.maxResultCount) {
      data.maxResultCount = 999
    }
    if (!data.skipCount) {
      data.skipCount = 0
    }
    return api.get('/api/CashdeskInsertedPlayer/GetAllCashDeskCardReaderLogs', { params: data, ...options })
  },
  /**
   * Create Cashdesk Inserted Player
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  create(data = {}, options = {}) {
    return api.post('/api/CashdeskInsertedPlayer/Create', data, options)
  }
}
