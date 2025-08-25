import { api } from 'src/boot/axios'


export const casinoChipStockService = {
  name: 'CasinoChipStock',
  /**
   * Get All Casino Chip Stock
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getAll(data = {}, options = {}) {
    return api.get('/api/CasinoChipStock/GetAll', { params: data, ...options })
  },
  /**
   * Get Histories Casino Chip Stock
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getHistories(data = {}, options = {}) {
    return api.get('/api/CasinoChipStock/GetHistories', { params: data, ...options })
  },
  /**
   * Chip Stock In Out Casino Chip Stock
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  chipStockInOut(data = {}, options = {}) {
    return api.post('/api/CasinoChipStock/ChipStockInOut', data, options)
  }
}
