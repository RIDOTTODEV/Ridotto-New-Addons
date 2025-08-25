import { api } from 'src/boot/axios'


export const cashdeskAccountService = {
  name: 'CashdeskAccount',
  /**
   * Get Cashdesk Accounts By Cashdesk Id Cashdesk Account
   *
   * @param {object} [data]
   * @param {undefined} [data.cashdeskId] - Cashdesk Id
   * @param {undefined} [data.isActive] - Is Active
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getCashdeskAccountsByCashdeskId(data = {}, options = {}) {
    return api.get('/api/CashdeskAccount/GetCashdeskAccountsByCashdeskId', { params: data, ...options })
  },
  /**
   * Get Cashdesk Account
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  get(data = {}, options = {}) {
    return api.get('/api/CashdeskAccount/Get', { params: data, ...options })
  },
  /**
   * Get All Cashdesk Account
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
    return api.get('/api/CashdeskAccount/GetAll', { params: data, ...options })
  },
  /**
   * Create Cashdesk Account
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  create(data = {}, options = {}) {
    return api.post('/api/CashdeskAccount/Create', data, options)
  },
  /**
   * Update Cashdesk Account
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  update(data = {}, options = {}) {
    return api.post('/api/CashdeskAccount/Update', data, options)
  },
  /**
   * Delete Cashdesk Account
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  delete(data = {}, options = {}) {
    return api.delete('/api/CashdeskAccount/Delete', { params: data, ...options })
  }
}
