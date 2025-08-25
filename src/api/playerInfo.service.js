import { api } from 'src/boot/axios'


export const playerInfoService = {
  name: 'PlayerInfo',
  /**
   * Get Player Information Detail Player Info
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.day] - Day
   * @param {undefined} [data.defaultCurrencyId] - Default Currency Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerInformationDetail(data = {}, options = {}) {
    return api.get('/api/PlayerInfo/GetPlayerInformationDetail', { params: data, ...options })
  },
  /**
   * Get Player Information Meta Detail Player Info
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.day] - Day
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerInformationMetaDetail(data = {}, options = {}) {
    return api.get('/api/PlayerInfo/GetPlayerInformationMetaDetail', { params: data, ...options })
  }
}
