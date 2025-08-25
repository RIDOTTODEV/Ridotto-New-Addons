import { api } from 'src/boot/axios'


export const reportCorrectService = {
  name: 'ReportCorrect',
  /**
   * Report Correct Report Correct
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  reportCorrect(data = {}, options = {}) {
    return api.post('/api/ReportCorrect/ReportCorrect', data, options)
  }
}
