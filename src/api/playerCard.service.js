import { api } from 'src/boot/axios'


export const playerCardService = {
  name: 'PlayerCard',
  /**
   * Get Player Cards Player Card
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerCards(data = {}, options = {}) {
    return api.get('/api/PlayerCard/GetPlayerCards', { params: data, ...options })
  },
  /**
   * Create Player Card Player Card
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  createPlayerCard(data = {}, options = {}) {
    return api.post('/api/PlayerCard/CreatePlayerCard', data, options)
  },
  /**
   * Update Player Card Player Card
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updatePlayerCard(data = {}, options = {}) {
    return api.post('/api/PlayerCard/UpdatePlayerCard', data, options)
  },
  /**
   * Disable Player Card Player Card
   *
   * @param {object} [data]
   * @param {undefined} [data.cardId] - Card Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  disablePlayerCard(data = {}, options = {}) {
    return api.delete('/api/PlayerCard/DisablePlayerCard', { params: data, ...options })
  },
  /**
   * Disable Player Card By Card Uid Player Card
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  disablePlayerCardByCardUid(data = {}, options = {}) {
    return api.post('/api/PlayerCard/DisablePlayerCardByCardUid', data, options)
  }
}
