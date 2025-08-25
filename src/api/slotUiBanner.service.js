import { api } from 'src/boot/axios'


export const slotUiBannerService = {
  name: 'SlotUiBanner',
  /**
   * Get Banner As Jpeg Slot Ui Banner
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getBannerAsJpeg(data = {}, options = {}) {
    return api.get('/api/SlotUiBanner/GetBannerAsJpeg', { params: data, ...options })
  },
  /**
   * Delete Slot Ui Banner
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  delete(data = {}, options = {}) {
    return api.delete('/api/SlotUiBanner/Delete', { params: data, ...options })
  }
}
