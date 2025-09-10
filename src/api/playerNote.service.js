import { api } from 'src/boot/axios'


export const playerNoteService = {
  name: 'PlayerNote',
  /**
   * Get Player Notes Player Note
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.source] - Source
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerNotes(data = {}, options = {}) {
    return api.get('/api/PlayerNote/GetPlayerNotes', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Transaction Code Group Types Player Note
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getTransactionCodeGroupTypes(data = {}, options = {}) {
    return api.get('/api/PlayerNote/GetTransactionCodeGroupTypes', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Player Note
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  get(data = {}, options = {}) {
    return api.get('/api/PlayerNote/Get', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get All Player Note
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.source] - Source
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
    return api.get('/api/PlayerNote/GetAll', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Create Player Note
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  create(data = {}, options = {}) {
    return api.post('/api/PlayerNote/Create', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Player Note
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  update(data = {}, options = {}) {
    return api.post('/api/PlayerNote/Update', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Delete Player Note
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  delete(data = {}, options = {}) {
    return api.delete('/api/PlayerNote/Delete', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
