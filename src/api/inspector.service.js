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
  },
  /**
   * Follow Table Inspector
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  followTable(data = {}, options = {}) {
    return api.post('/api/Inspector/FollowTable', data, options)
  },
  /**
   * Unfollow Table Inspector
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  unfollowTable(data = {}, options = {}) {
    return api.post('/api/Inspector/UnfollowTable', data, options)
  }
}
