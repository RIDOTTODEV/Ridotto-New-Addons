import { api } from 'src/boot/axios'


export const gmMeterSummaryService = {
  name: 'GmMeterSummary',
  /**
   * Get All Gm Meter Summary
   *
   * @param {object} [data]
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
    return api.get('/api/GmMeterSummary/GetAll', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
