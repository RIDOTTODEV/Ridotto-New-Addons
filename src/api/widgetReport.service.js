import { api } from 'src/boot/axios'


export const widgetReportService = {
  name: 'WidgetReport',
  /**
   * Get Cashdesk Widget Report Widget Report
   *
   * @param {object} [data]
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.queryType] - Query Type
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getCashdeskWidgetReport(data = {}, options = {}) {
    return api.get('/api/WidgetReport/GetCashdeskWidgetReport', { params: data, ...options })
  }
}
