import { api } from 'src/boot/axios'


export const userService = {
  name: 'User',
  /**
   * Get Roles User
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getRoles(data = {}, options = {}) {
    return api.get('/api/User/GetRoles', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Claims User
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getClaims(data = {}, options = {}) {
    return api.get('/api/User/GetClaims', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * User Save User
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  userSave(data = {}, options = {}) {
    return api.post('/api/User/UserSave', data, options)
      .then((response) => response)
      .catch((error) => error)
  }
}
