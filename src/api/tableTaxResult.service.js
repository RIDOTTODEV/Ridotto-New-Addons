import { api } from 'src/boot/axios'


export const tableTaxResultService = {
  name: 'TableTaxResult',
  /**
   * Table Get All Result Table Tax Result
   *
   * @param {object} [data]
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  tableGetAllResult(data = {}, options = {}) {
    return api.get('/api/TableTaxResult/TableGetAllResult', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get All Table Tax Result
   *
   * @param {object} [data]
   * @param {undefined} [data.tableId] - Table Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getAll(data = {}, options = {}) {
    return api.get('/api/TableTaxResult/GetAll', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Create Or Update Table Tax Result
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  createOrUpdate(data = {}, options = {}) {
    return api.post('/api/TableTaxResult/CreateOrUpdate', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Delete Table Tax Result
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  delete(data = {}, options = {}) {
    return api.delete('/api/TableTaxResult/Delete', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
