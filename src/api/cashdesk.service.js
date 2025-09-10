import { api } from 'src/boot/axios'


export const cashdeskService = {
  name: 'Cashdesk',
  /**
   * Get All Cashdesk
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
    return api.get('/api/Cashdesk/GetAll', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Cash Count Balance Cashdesk
   *
   * @param {object} [data]
   * @param {undefined} [data.cashdeskId] - Cashdesk Id
   * @param {undefined} [data.balanceCurrencyId] - Balance Currency Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getCashCountBalance(data = {}, options = {}) {
    return api.get('/api/Cashdesk/GetCashCountBalance', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Chip Count Balance Cashdesk
   *
   * @param {object} [data]
   * @param {undefined} [data.cashdeskId] - Cashdesk Id
   * @param {undefined} [data.balanceCurrencyId] - Balance Currency Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getChipCountBalance(data = {}, options = {}) {
    return api.get('/api/Cashdesk/GetChipCountBalance', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Count Active Cashdesk
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updateCountActive(data = {}, options = {}) {
    return api.post('/api/Cashdesk/UpdateCountActive', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Set As Main Cashdesk Cashdesk
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  setAsMainCashdesk(data = {}, options = {}) {
    return api.post('/api/Cashdesk/SetAsMainCashdesk', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Cashdesk Change Gaming Date Cashdesk
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  cashdeskChangeGamingDate(data = {}, options = {}) {
    return api.post('/api/Cashdesk/CashdeskChangeGamingDate', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Cashdesks Cashdesk
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getCashdesks(data = {}, options = {}) {
    return api.get('/api/Cashdesk/GetCashdesks', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Gaming Date By Cashdesk Id Cashdesk
   *
   * @param {object} [data]
   * @param {undefined} [data.cashdeskId] - Cashdesk Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getGamingDateByCashdeskId(data = {}, options = {}) {
    return api.get('/api/Cashdesk/GetGamingDateByCashdeskId', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Cashdesk
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  get(data = {}, options = {}) {
    return api.get('/api/Cashdesk/Get', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Create Cashdesk
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  create(data = {}, options = {}) {
    return api.post('/api/Cashdesk/Create', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Cashdesk
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  update(data = {}, options = {}) {
    return api.post('/api/Cashdesk/Update', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Delete Cashdesk
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  delete(data = {}, options = {}) {
    return api.delete('/api/Cashdesk/Delete', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
