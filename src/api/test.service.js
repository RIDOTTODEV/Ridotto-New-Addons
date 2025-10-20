import { api } from 'src/boot/axios'


export const testService = {
  name: 'Test',
  /**
   * Change Gaming Date Test
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  changeGamingDate(data = {}, options = {}) {
    return api.post('/api/Test/ChangeGamingDate', data, options)
      .then((response) => response)
      .catch((error) => error)
  }
}
