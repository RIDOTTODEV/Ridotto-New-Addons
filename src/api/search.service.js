import { api } from 'src/boot/axios'


export const searchService = {
  name: 'Search',
  /**
   * Raw Search
   *
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  raw(data = {}, options = {}) {
    return api.get('/api/Search/Raw', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Player Search
   *
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  player(data = {}, options = {}) {
    return api.get('/api/Search/Player', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
