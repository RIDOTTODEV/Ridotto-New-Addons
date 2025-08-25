import { api } from 'src/boot/axios'


export const slotUiLanguageService = {
  name: 'SlotUiLanguage',
  /**
   * Get Languages Ddl Slot Ui Language
   *
   * @param {object} [data]
   * @param {undefined} [data.showOnSlotUi] - Show On Slot Ui
   * @param {undefined} [data.searchStr] - Search Str
   * @param {undefined} [data.sorting] - Sorting
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getLanguagesDdl(data = {}, options = {}) {
    return api.get('/api/SlotUiLanguage/GetLanguagesDdl', { params: data, ...options })
  },
  /**
   * Get Slot Ui Language
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  get(data = {}, options = {}) {
    return api.get('/api/SlotUiLanguage/Get', { params: data, ...options })
  },
  /**
   * Get All Slot Ui Language
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
    return api.get('/api/SlotUiLanguage/GetAll', { params: data, ...options })
  },
  /**
   * Create Slot Ui Language
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  create(data = {}, options = {}) {
    return api.post('/api/SlotUiLanguage/Create', data, options)
  },
  /**
   * Update Slot Ui Language
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  update(data = {}, options = {}) {
    return api.post('/api/SlotUiLanguage/Update', data, options)
  },
  /**
   * Delete Slot Ui Language
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  delete(data = {}, options = {}) {
    return api.delete('/api/SlotUiLanguage/Delete', { params: data, ...options })
  }
}
