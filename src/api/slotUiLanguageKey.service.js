import { api } from 'src/boot/axios'


export const slotUiLanguageKeyService = {
  name: 'SlotUiLanguageKey',
  /**
   * Get Slot Ui Texts Slot Ui Language Key
   *
   * @param {object} [data]
   * @param {undefined} [data.key] - Key
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getSlotUiTexts(data = {}, options = {}) {
    return api.get('/api/SlotUiLanguageKey/GetSlotUiTexts', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Slot Ui Texts Slot Ui Language Key
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updateSlotUiTexts(data = {}, options = {}) {
    return api.post('/api/SlotUiLanguageKey/UpdateSlotUiTexts', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Slot Ui Key Slot Ui Language Key
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getSlotUiKey(data = {}, options = {}) {
    return api.get('/api/SlotUiLanguageKey/GetSlotUiKey', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Create Slot Ui Key Slot Ui Language Key
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  createSlotUiKey(data = {}, options = {}) {
    return api.post('/api/SlotUiLanguageKey/CreateSlotUiKey', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Slot Ui Key Slot Ui Language Key
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updateSlotUiKey(data = {}, options = {}) {
    return api.post('/api/SlotUiLanguageKey/UpdateSlotUiKey', data, options)
      .then((response) => response)
      .catch((error) => error)
  }
}
