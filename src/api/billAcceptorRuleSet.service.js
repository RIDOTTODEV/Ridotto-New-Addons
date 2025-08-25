import { api } from 'src/boot/axios'


export const billAcceptorRuleSetService = {
  name: 'BillAcceptorRuleSet',
  /**
   * Get All Bill Acceptor Rule Set
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getAll(data = {}, options = {}) {
    return api.get('/api/BillAcceptorRuleSet/GetAll', { params: data, ...options })
  },
  /**
   * Get All Key Values Bill Acceptor Rule Set
   *
   * @param {object} [data]
   * @param {undefined} [data.includeDeletedRows] - Include Deleted Rows
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getAllKeyValues(data = {}, options = {}) {
    return api.get('/api/BillAcceptorRuleSet/GetAllKeyValues', { params: data, ...options })
  },
  /**
   * Create Bill Acceptor Rule Set
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  create(data = {}, options = {}) {
    return api.post('/api/BillAcceptorRuleSet/Create', data, options)
  },
  /**
   * Update Bill Acceptor Rule Set
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  update(data = {}, options = {}) {
    return api.post('/api/BillAcceptorRuleSet/Update', data, options)
  },
  /**
   * Create Or Update Bill Acceptor Rule Set
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  createOrUpdate(data = {}, options = {}) {
    return api.post('/api/BillAcceptorRuleSet/CreateOrUpdate', data, options)
  },
  /**
   * Get Bill Acceptor Rule Set
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  get(data = {}, options = {}) {
    return api.get('/api/BillAcceptorRuleSet/Get', { params: data, ...options })
  },
  /**
   * Delete Bill Acceptor Rule Set
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  delete(data = {}, options = {}) {
    return api.delete('/api/BillAcceptorRuleSet/Delete', { params: data, ...options })
  }
}
