import { api } from 'src/boot/axios'


export const gmOccupancyService = {
  name: 'GmOccupancy',
  /**
   * Get Gm Sit Times Gm Occupancy
   *
   * @param {object} [data]
   * @param {undefined} [data.slotMachineId] - Slot Machine Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getGmSitTimes(data = {}, options = {}) {
    return api.get('/api/GmOccupancy/GetGmSitTimes', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Gm Brand Occupancy Gm Occupancy
   *
   * @param {object} [data]
   * @param {undefined} [data.date] - Date
   * @param {undefined} [data.timeZone] - Time Zone
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getGmBrandOccupancy(data = {}, options = {}) {
    return api.get('/api/GmOccupancy/GetGmBrandOccupancy', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
