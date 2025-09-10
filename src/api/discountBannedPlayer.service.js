import { api } from 'src/boot/axios'


export const discountBannedPlayerService = {
  name: 'DiscountBannedPlayer',
  /**
   * Get All Discount Banned Player
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getAll(data = {}, options = {}) {
    return api.get('/api/DiscountBannedPlayer/GetAll', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Discount Banned Player
   *
   * @param {object} [data]
   * @param {undefined} [data.discountBannedPlayerId] - Discount Banned Player Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  get(data = {}, options = {}) {
    return api.get('/api/DiscountBannedPlayer/Get', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Create Discount Banned Player
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  create(data = {}, options = {}) {
    return api.post('/api/DiscountBannedPlayer/Create', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Bulk Remove Discount Banned Player
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  bulkRemove(data = {}, options = {}) {
    return api.post('/api/DiscountBannedPlayer/BulkRemove', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Remove Discount Banned Player
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  remove(data = {}, options = {}) {
    return api.delete('/api/DiscountBannedPlayer/Remove', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
