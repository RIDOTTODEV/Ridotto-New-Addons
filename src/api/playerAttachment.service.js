import { api } from 'src/boot/axios'


export const playerAttachmentService = {
  name: 'PlayerAttachment',
  /**
   * Get All By Player Player Attachment
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getAllByPlayer(data = {}, options = {}) {
    return api.get('/api/PlayerAttachment/GetAllByPlayer', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Download File Player Attachment
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  downloadFile(data = {}, options = {}) {
    return api.get('/api/PlayerAttachment/DownloadFile', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Add Player Attachment
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  add(data = {}, options = {}) {
    return api.post('/api/PlayerAttachment/Add', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Delete Player Attachment
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  delete(data = {}, options = {}) {
    return api.delete('/api/PlayerAttachment/Delete', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
