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
      .then((response) => response)
      .catch((error) => error)
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
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Table Chip Balance Table Count
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getTableChipBalance(data = {}, options = {}) {
    return api.get('/api/TableCount/GetTableChipBalance', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Chip Table Balance Detail Table Count
   *
   * @param {object} [data]
   * @param {undefined} [data.tableId] - Table Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getChipTableBalanceDetail(data = {}, options = {}) {
    return api.get('/api/TableCount/GetChipTableBalanceDetail', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
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
      .then((response) => response)
      .catch((error) => error)
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
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Table Count Plaque And Cash Edit Cashier Password Table Count
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  tableCountPlaqueAndCashEditCashierPassword(data = {}, options = {}) {
    return api.post('/api/TableCount/TableCountPlaqueAndCashEditCashierPassword', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Table Count Plaque And Cash Edit Pit Boss Password Table Count
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  tableCountPlaqueAndCashEditPitBossPassword(data = {}, options = {}) {
    return api.post('/api/TableCount/TableCountPlaqueAndCashEditPitBossPassword', data, options)
      .then((response) => response)
      .catch((error) => error)
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
      .then((response) => response)
      .catch((error) => error)
  }
}
