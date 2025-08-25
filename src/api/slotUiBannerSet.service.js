import { api } from 'src/boot/axios'


export const slotUiBannerSetService = {
  name: 'SlotUiBannerSet',
  /**
   * Get All Key Values Slot Ui Banner Set
   *
   * @param {object} [data]
   * @param {undefined} [data.includeDeletedRows] - Include Deleted Rows
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getAllKeyValues(data = {}, options = {}) {
    return api.get('/api/SlotUiBannerSet/GetAllKeyValues', { params: data, ...options })
  },
  /**
   * Get Banner Set Slot Ui Banner Set
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getBannerSet(data = {}, options = {}) {
    return api.get('/api/SlotUiBannerSet/GetBannerSet', { params: data, ...options })
  },
  /**
   * Create Banner Set Slot Ui Banner Set
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  createBannerSet(data = {}, options = {}) {
    return api.post('/api/SlotUiBannerSet/CreateBannerSet', data, options)
  },
  /**
   * Update Banner Set Slot Ui Banner Set
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updateBannerSet(data = {}, options = {}) {
    return api.post('/api/SlotUiBannerSet/UpdateBannerSet', data, options)
  },
  /**
   * Get Slot Ui Banner Set
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  get(data = {}, options = {}) {
    return api.get('/api/SlotUiBannerSet/Get', { params: data, ...options })
  },
  /**
   * Get All Slot Ui Banner Set
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
    return api.get('/api/SlotUiBannerSet/GetAll', { params: data, ...options })
  },
  /**
   * Create Slot Ui Banner Set
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  create(data = {}, options = {}) {
    return api.post('/api/SlotUiBannerSet/Create', data, options)
  },
  /**
   * Update Slot Ui Banner Set
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  update(data = {}, options = {}) {
    return api.post('/api/SlotUiBannerSet/Update', data, options)
  },
  /**
   * Delete Slot Ui Banner Set
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  delete(data = {}, options = {}) {
    return api.delete('/api/SlotUiBannerSet/Delete', { params: data, ...options })
  }
}
