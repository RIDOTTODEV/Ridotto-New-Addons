import { api } from 'src/boot/axios'


export const inspectorService = {
  name: 'Inspector',
  /**
   * Get Inspector Followed Tables Inspector
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getInspectorFollowedTables(data = {}, options = {}) {
    return api.get('/api/Inspector/GetInspectorFollowedTables', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Reset Inspector Tables Inspector
   *
   * @param {object} [data]
   * @param {undefined} [data.userId] - User Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  resetInspectorTables(data = {}, options = {}) {
    return api.get('/api/Inspector/ResetInspectorTables', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
