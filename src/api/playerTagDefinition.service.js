import { api } from 'src/boot/axios'


export const playerTagDefinitionService = {
  name: 'PlayerTagDefinition',
  /**
   * Get All Key Values Player Tag Definition
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getAllKeyValues(data = {}, options = {}) {
    return api.get('/api/PlayerTagDefinition/GetAllKeyValues', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Player Tag Definition
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  get(data = {}, options = {}) {
    return api.get('/api/PlayerTagDefinition/Get', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get All Player Tag Definition
   *
   * @param {object} [data]
   * @param {undefined} [data.sorting] - Sorting
   * @param {undefined} [data.maxResultCount] - Max Result Count
   * @param {undefined} [data.skipCount] - Skip Count
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getAll(data = {}, options = {}) {
    if (!data.maxResultCount) {
      data.maxResultCount = 999
    }
    if (!data.skipCount) {
      data.skipCount = 0
    }
    return api.get('/api/PlayerTagDefinition/GetAll', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Create Player Tag Definition
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  create(data = {}, options = {}) {
    return api.post('/api/PlayerTagDefinition/Create', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Player Tag Definition
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  update(data = {}, options = {}) {
    return api.post('/api/PlayerTagDefinition/Update', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Delete Player Tag Definition
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  delete(data = {}, options = {}) {
    return api.delete('/api/PlayerTagDefinition/Delete', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
