import { api } from 'src/boot/axios'


export const gmAftInService = {
  name: 'GmAftIn',
  /**
   * Get Gm Aft Ins Gm Aft In
   *
   * @param {object} [data]
   * @param {undefined} [data.slotMachineId] - Slot Machine Id
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.sorting] - Sorting
   * @param {undefined} [data.maxResultCount] - Max Result Count
   * @param {undefined} [data.skipCount] - Skip Count
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getGmAftIns(data = {}, options = {}) {
    if (!data.maxResultCount) {
      data.maxResultCount = 999
    }
    if (!data.skipCount) {
      data.skipCount = 0
    }
    return api.get('/api/GmAftIn/GetGmAftIns', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Gm Aft In Outs Gm Aft In
   *
   * @param {object} [data]
   * @param {undefined} [data.slotMachineId] - Slot Machine Id
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.sorting] - Sorting
   * @param {undefined} [data.maxResultCount] - Max Result Count
   * @param {undefined} [data.skipCount] - Skip Count
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getGmAftInOuts(data = {}, options = {}) {
    if (!data.maxResultCount) {
      data.maxResultCount = 999
    }
    if (!data.skipCount) {
      data.skipCount = 0
    }
    return api.get('/api/GmAftIn/GetGmAftInOuts', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
