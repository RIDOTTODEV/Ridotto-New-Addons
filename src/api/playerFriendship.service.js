import { api } from 'src/boot/axios'


export const playerFriendshipService = {
  name: 'PlayerFriendship',
  /**
   * Get Player Friendship Player Friendship
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerFriendship(data = {}, options = {}) {
    return api.get('/api/PlayerFriendship/GetPlayerFriendship', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Create Player Friendship
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  create(data = {}, options = {}) {
    return api.post('/api/PlayerFriendship/Create', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Delete Player Friendship
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  delete(data = {}, options = {}) {
    return api.delete('/api/PlayerFriendship/Delete', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
