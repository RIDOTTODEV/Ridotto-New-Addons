import { api } from 'src/boot/axios'


export const lgLotteryPlayerPointService = {
  name: 'LgLotteryPlayerPoint',
  /**
   * Get Lg Lottery Player Point
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  get(data = {}, options = {}) {
    return api.get('/api/LgLotteryPlayerPoint/Get', { params: data, ...options })
  },
  /**
   * Get All Lg Lottery Player Point
   *
   * @param {object} [data]
   * @param {undefined} [data.lgLotteryId] - Lg Lottery Id
   * @param {undefined} [data.playerId] - Player Id
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
    return api.get('/api/LgLotteryPlayerPoint/GetAll', { params: data, ...options })
  },
  /**
   * Create Lg Lottery Player Point
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  create(data = {}, options = {}) {
    return api.post('/api/LgLotteryPlayerPoint/Create', data, options)
  },
  /**
   * Update Lg Lottery Player Point
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  update(data = {}, options = {}) {
    return api.post('/api/LgLotteryPlayerPoint/Update', data, options)
  },
  /**
   * Delete Lg Lottery Player Point
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  delete(data = {}, options = {}) {
    return api.delete('/api/LgLotteryPlayerPoint/Delete', { params: data, ...options })
  }
}
