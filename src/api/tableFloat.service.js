import { api } from 'src/boot/axios'


export const tableFloatService = {
  name: 'TableFloat',
  /**
   * Apply Table Counts To Floats Table Float
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  applyTableCountsToFloats(data = {}, options = {}) {
    return api.post('/api/TableFloat/ApplyTableCountsToFloats', data, options)
  },
  /**
   * Set Table Float Table Float
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  setTableFloat(data = {}, options = {}) {
    return api.post('/api/TableFloat/SetTableFloat', data, options)
  },
  /**
   * Get Expected Table Float Table Float
   *
   * @param {object} [data]
   * @param {undefined} [data.tableIds] - Table Ids
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getExpectedTableFloat(data = {}, options = {}) {
    return api.get('/api/TableFloat/GetExpectedTableFloat', { params: data, ...options })
  },
  /**
   * Get All Table Float
   *
   * @param {object} [data]
   * @param {undefined} [data.tableId] - Table Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getAll(data = {}, options = {}) {
    return api.get('/api/TableFloat/GetAll', { params: data, ...options })
  }
}
