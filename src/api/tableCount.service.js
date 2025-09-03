import { api } from 'src/boot/axios'


export const tableCountService = {
  name: 'TableCount',
  /**
   * Get Table Count
   *
   * @param {object} [data]
   * @param {undefined} [data.tableId] - Table Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.floatSetId] - Float Set Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  get(data = {}, options = {}) {
    return api.get('/api/TableCount/Get', { params: data, ...options })
  },
  /**
   * Get All Table Count
   *
   * @param {object} [data]
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getAll(data = {}, options = {}) {
    return api.get('/api/TableCount/GetAll', { params: data, ...options })
  },
  /**
   * Update Table Count
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  update(data = {}, options = {}) {
    return api.post('/api/TableCount/Update', data, options)
  },
  /**
   * Chip Count Save Table Count
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  chipCountSave(data = {}, options = {}) {
    return api.post('/api/TableCount/ChipCountSave', data, options)
  },
  /**
   * Table Count Plaque And Cash Edit Check Table Count
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  tableCountPlaqueAndCashEditCheck(data = {}, options = {}) {
    return api.post('/api/TableCount/TableCountPlaqueAndCashEditCheck', data, options)
  },
  /**
   * Table Count Chip Save Edit Check Table Count
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  tableCountChipSaveEditCheck(data = {}, options = {}) {
    return api.post('/api/TableCount/TableCountChipSaveEditCheck', data, options)
  }
}
