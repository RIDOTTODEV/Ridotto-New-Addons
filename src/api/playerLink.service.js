import { api } from 'src/boot/axios'


export const playerLinkService = {
  name: 'PlayerLink',
  /**
   * Get Linked Players By Player Player Link
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getLinkedPlayersByPlayer(data = {}, options = {}) {
    return api.get('/api/PlayerLink/GetLinkedPlayersByPlayer', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Add Player Link
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  add(data = {}, options = {}) {
    return api.post('/api/PlayerLink/Add', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Delete Player Link
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  delete(data = {}, options = {}) {
    return api.delete('/api/PlayerLink/Delete', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
