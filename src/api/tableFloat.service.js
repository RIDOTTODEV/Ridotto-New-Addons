import { api } from 'src/boot/axios'


export const tableFloatService = {
  name: 'TableFloat',
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
      .then((response) => response)
      .catch((error) => error)
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
      .then((response) => response)
      .catch((error) => error)
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
      .then((response) => response)
      .catch((error) => error)
  }
}
