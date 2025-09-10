import { api } from 'src/boot/axios'


export const jackpotGroupService = {
  name: 'JackpotGroup',
  /**
   * Get All Key Values Jackpot Group
   *
   * @param {object} [data]
   * @param {undefined} [data.includeDeletedRows] - Include Deleted Rows
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getAllKeyValues(data = {}, options = {}) {
    return api.get('/api/JackpotGroup/GetAllKeyValues', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Jackpot Group
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  get(data = {}, options = {}) {
    return api.get('/api/JackpotGroup/Get', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get All Jackpot Group
   *
   * @param {object} [data]
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
    return api.get('/api/JackpotGroup/GetAll', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Create Jackpot Group
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  create(data = {}, options = {}) {
    return api.post('/api/JackpotGroup/Create', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Jackpot Group
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  update(data = {}, options = {}) {
    return api.post('/api/JackpotGroup/Update', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Delete Jackpot Group
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  delete(data = {}, options = {}) {
    return api.delete('/api/JackpotGroup/Delete', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
