import { api } from 'src/boot/axios'


export const slotUiService = {
  name: 'SlotUi',
  /**
   * Get All Key Values Slot Ui
   *
   * @param {object} [data]
   * @param {undefined} [data.includeDeletedRows] - Include Deleted Rows
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getAllKeyValues(data = {}, options = {}) {
    return api.get('/api/SlotUi/GetAllKeyValues', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Ui Data By Mac Address Slot Ui
   *
   * @param {object} [data]
   * @param {undefined} [data.macAddress] - Mac Address
   * @param {undefined} [data.version] - Version
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getUiDataByMacAddress(data = {}, options = {}) {
    return api.get('/api/SlotUi/GetUiDataByMacAddress', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
