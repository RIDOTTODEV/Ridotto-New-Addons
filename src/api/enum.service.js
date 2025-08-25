import { api } from 'src/boot/axios'


export const enumService = {
  name: 'Enum',
  /**
   * Get All Enums Enum
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getAllEnums(data = {}, options = {}) {
    return api.get('/api/Enum/GetAllEnums', { params: data, ...options })
  }
}
