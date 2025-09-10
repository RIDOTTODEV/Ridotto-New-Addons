import { api } from 'src/boot/axios'


export const slotModelService = {
  name: 'SlotModel',
  /**
   * Get All Key Values Slot Model
   *
   * @param {object} [data]
   * @param {undefined} [data.includeDeletedRows] - Include Deleted Rows
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getAllKeyValues(data = {}, options = {}) {
    return api.get('/api/SlotModel/GetAllKeyValues', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Slot Model
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  get(data = {}, options = {}) {
    return api.get('/api/SlotModel/Get', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get All Slot Model
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
    return api.get('/api/SlotModel/GetAll', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Create Slot Model
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  create(data = {}, options = {}) {
    return api.post('/api/SlotModel/Create', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Slot Model
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  update(data = {}, options = {}) {
    return api.post('/api/SlotModel/Update', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Delete Slot Model
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  delete(data = {}, options = {}) {
    return api.delete('/api/SlotModel/Delete', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
