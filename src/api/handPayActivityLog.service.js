import { api } from 'src/boot/axios'


export const handPayActivityLogService = {
  name: 'HandPayActivityLog',
  /**
   * Get Hand Pay Activity Log
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  get(data = {}, options = {}) {
    return api.get('/api/HandPayActivityLog/Get', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get All Hand Pay Activity Log
   *
   * @param {object} [data]
   * @param {undefined} [data.slotMachineId] - Slot Machine Id
   * @param {undefined} [data.currencyId] - Currency Id
   * @param {undefined} [data.floorNo] - Floor No
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.handPayResetCode] - Hand Pay Reset Code
   * @param {undefined} [data.handPayActivityType] - Hand Pay Activity Type
   * @param {undefined} [data.sorting] - Sorting
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
    return api.get('/api/HandPayActivityLog/GetAll', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Create Hand Pay Activity Log
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  create(data = {}, options = {}) {
    return api.post('/api/HandPayActivityLog/Create', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Hand Pay Activity Log
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  update(data = {}, options = {}) {
    return api.post('/api/HandPayActivityLog/Update', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Delete Hand Pay Activity Log
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  delete(data = {}, options = {}) {
    return api.delete('/api/HandPayActivityLog/Delete', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
