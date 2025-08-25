import { api } from 'src/boot/axios'


export const importService = {
  name: 'Import',
  /**
   * Excel Import Import
   *
   * @param {object} [data]
   * @param {undefined} [data.skipHeader] - Skip Header
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  excelImport(data = {}, options = {}) {
    return api.post('/api/Import/ExcelImport', data, options)
  }
}
