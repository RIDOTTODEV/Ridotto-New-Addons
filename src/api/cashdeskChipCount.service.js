import { api } from 'src/boot/axios'


export const cashdeskChipCountService = {
  name: 'CashdeskChipCount',
  /**
   * Update Cashdesk Chip Count
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  update(data = {}, options = {}) {
    return api.post('/api/CashdeskChipCount/Update', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Reset Cashdesk Chip Balance Cashdesk Chip Count
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  resetCashdeskChipBalance(data = {}, options = {}) {
    return api.post('/api/CashdeskChipCount/ResetCashdeskChipBalance', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get All Chip Count Denomination Cashdesk Chip Count
   *
   * @param {object} [data]
   * @param {undefined} [data.cashdeskId] - Cashdesk Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getAllChipCountDenomination(data = {}, options = {}) {
    return api.get('/api/CashdeskChipCount/GetAllChipCountDenomination', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Balance Cashdesk Chip Count
   *
   * @param {object} [data]
   * @param {undefined} [data.cashdeskId] - Cashdesk Id
   * @param {undefined} [data.balanceCurrencyId] - Balance Currency Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getBalance(data = {}, options = {}) {
    return api.get('/api/CashdeskChipCount/GetBalance', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
