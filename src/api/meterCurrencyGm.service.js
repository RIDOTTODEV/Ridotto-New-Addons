import { api } from 'src/boot/axios'


export const meterCurrencyGmService = {
  name: 'MeterCurrencyGm',
  /**
   * Get Jackpots Meter Currency Gm
   *
   * @param {object} [data]
   * @param {undefined} [data.minAmount] - Min Amount
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
  getJackpots(data = {}, options = {}) {
    if (!data.maxResultCount) {
      data.maxResultCount = 999
    }
    if (!data.skipCount) {
      data.skipCount = 0
    }
    return api.get('/api/MeterCurrencyGm/GetJackpots', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Big Wins Meter Currency Gm
   *
   * @param {object} [data]
   * @param {undefined} [data.minAmount] - Min Amount
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
  getBigWins(data = {}, options = {}) {
    if (!data.maxResultCount) {
      data.maxResultCount = 999
    }
    if (!data.skipCount) {
      data.skipCount = 0
    }
    return api.get('/api/MeterCurrencyGm/GetBigWins', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
