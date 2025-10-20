import { api } from 'src/boot/axios'


export const playerTransactionService = {
  name: 'PlayerTransaction',
  /**
   * Update Location Player Transaction
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updateLocation(data = {}, options = {}) {
    return api.post('/api/PlayerTransaction/UpdateLocation', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Transaction Date Player Transaction
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updateTransactionDate(data = {}, options = {}) {
    return api.post('/api/PlayerTransaction/UpdateTransactionDate', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Transaction Code Player Transaction
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updateTransactionCode(data = {}, options = {}) {
    return api.post('/api/PlayerTransaction/UpdateTransactionCode', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Group Code Player Transaction
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updateGroupCode(data = {}, options = {}) {
    return api.post('/api/PlayerTransaction/UpdateGroupCode', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Transaction Detail Report Player Transaction
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.cashdeskId] - Cashdesk Id
   * @param {undefined} [data.locationId] - Location Id
   * @param {undefined} [data.marketerId] - Marketer Id
   * @param {undefined} [data.transactionCodeId] - Transaction Code Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.maxResultCount] - Max Result Count
   * @param {undefined} [data.skipCount] - Skip Count
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getTransactionDetailReport(data = {}, options = {}) {
    if (!data.maxResultCount) {
      data.maxResultCount = 999
    }
    if (!data.skipCount) {
      data.skipCount = 0
    }
    return api.get('/api/PlayerTransaction/GetTransactionDetailReport', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Transaction Report Player Transaction
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.cashdeskId] - Cashdesk Id
   * @param {undefined} [data.locationId] - Location Id
   * @param {undefined} [data.marketerId] - Marketer Id
   * @param {undefined} [data.transactionCodeIds] - Transaction Code Ids
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.maxResultCount] - Max Result Count
   * @param {undefined} [data.skipCount] - Skip Count
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getTransactionReport(data = {}, options = {}) {
    if (!data.maxResultCount) {
      data.maxResultCount = 999
    }
    if (!data.skipCount) {
      data.skipCount = 0
    }
    return api.get('/api/PlayerTransaction/GetTransactionReport', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
