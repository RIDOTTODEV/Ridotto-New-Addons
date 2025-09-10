import { api } from 'src/boot/axios'


export const cashdeskCountService = {
  name: 'CashdeskCount',
  /**
   * Update Cashdesk Count
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  update(data = {}, options = {}) {
    return api.post('/api/CashdeskCount/Update', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Reset Cashdesk Balance Cashdesk Count
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  resetCashdeskBalance(data = {}, options = {}) {
    return api.post('/api/CashdeskCount/ResetCashdeskBalance', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get All Count Denomination Cashdesk Count
   *
   * @param {object} [data]
   * @param {undefined} [data.cashdeskId] - Cashdesk Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getAllCountDenomination(data = {}, options = {}) {
    return api.get('/api/CashdeskCount/GetAllCountDenomination', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Cashdesks Rate Effect Cashdesk Count
   *
   * @param {object} [data]
   * @param {undefined} [data.defaultCurrencyId] - Default Currency Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getCashdesksRateEffect(data = {}, options = {}) {
    return api.get('/api/CashdeskCount/GetCashdesksRateEffect', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Balance Cashdesk Count
   *
   * @param {object} [data]
   * @param {undefined} [data.cashdeskId] - Cashdesk Id
   * @param {undefined} [data.balanceCurrencyId] - Balance Currency Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getBalance(data = {}, options = {}) {
    return api.get('/api/CashdeskCount/GetBalance', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Count Histories Total Cashdesk Count
   *
   * @param {object} [data]
   * @param {undefined} [data.cashdeskId] - Cashdesk Id
   * @param {undefined} [data.maxResultCount] - Max Result Count
   * @param {undefined} [data.skipCount] - Skip Count
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getCountHistoriesTotal(data = {}, options = {}) {
    if (!data.maxResultCount) {
      data.maxResultCount = 999
    }
    if (!data.skipCount) {
      data.skipCount = 0
    }
    return api.get('/api/CashdeskCount/GetCountHistoriesTotal', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Cashdesk Chip Count History Total Cashdesk Count
   *
   * @param {object} [data]
   * @param {undefined} [data.cashdeskId] - Cashdesk Id
   * @param {undefined} [data.maxResultCount] - Max Result Count
   * @param {undefined} [data.skipCount] - Skip Count
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getCashdeskChipCountHistoryTotal(data = {}, options = {}) {
    if (!data.maxResultCount) {
      data.maxResultCount = 999
    }
    if (!data.skipCount) {
      data.skipCount = 0
    }
    return api.get('/api/CashdeskCount/GetCashdeskChipCountHistoryTotal', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
