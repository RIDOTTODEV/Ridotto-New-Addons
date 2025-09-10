import { api } from 'src/boot/axios'


export const exchangeRateService = {
  name: 'ExchangeRate',
  /**
   * Get All Exchange Rate
   *
   * @param {object} [data]
   * @param {undefined} [data.fromCurrencyId] - From Currency Id
   * @param {undefined} [data.toCurrencyId] - To Currency Id
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
    return api.get('/api/ExchangeRate/GetAll', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Create Range Exchange Rate
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  createRange(data = {}, options = {}) {
    return api.post('/api/ExchangeRate/CreateRange', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Latest Rates Exchange Rate
   *
   * @param {object} [data]
   * @param {undefined} [data.fromCurrencyId] - From Currency Id
   * @param {undefined} [data.toCurrencyId] - To Currency Id
   * @param {undefined} [data.beforeGamingDateId] - Before Gaming Date Id
   * @param {undefined} [data.onlyActiveCurrencies] - Only Active Currencies
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getLatestRates(data = {}, options = {}) {
    return api.get('/api/ExchangeRate/GetLatestRates', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Converted Amount Exchange Rate
   *
   * @param {object} [data]
   * @param {undefined} [data.fromCurrencyId] - From Currency Id
   * @param {undefined} [data.toCurrencyId] - To Currency Id
   * @param {undefined} [data.amount] - Amount
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getConvertedAmount(data = {}, options = {}) {
    return api.get('/api/ExchangeRate/GetConvertedAmount', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Exchange Rate
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  get(data = {}, options = {}) {
    return api.get('/api/ExchangeRate/Get', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Create Exchange Rate
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  create(data = {}, options = {}) {
    return api.post('/api/ExchangeRate/Create', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Exchange Rate
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  update(data = {}, options = {}) {
    return api.post('/api/ExchangeRate/Update', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Delete Exchange Rate
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  delete(data = {}, options = {}) {
    return api.delete('/api/ExchangeRate/Delete', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
