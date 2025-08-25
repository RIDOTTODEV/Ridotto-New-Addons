import { api } from 'src/boot/axios'


export const transactionCodeService = {
  name: 'TransactionCode',
  /**
   * Get Transaction Code Group Types Transaction Code
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getTransactionCodeGroupTypes(data = {}, options = {}) {
    return api.get('/api/TransactionCode/GetTransactionCodeGroupTypes', { params: data, ...options })
  },
  /**
   * Get Transaction Code Types Transaction Code
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getTransactionCodeTypes(data = {}, options = {}) {
    return api.get('/api/TransactionCode/GetTransactionCodeTypes', { params: data, ...options })
  },
  /**
   * Get Transaction Codes By Group Type Transaction Code
   *
   * @param {object} [data]
   * @param {undefined} [data.transactionCodeGroupTypes] - Transaction Code Group Types
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getTransactionCodesByGroupType(data = {}, options = {}) {
    return api.get('/api/TransactionCode/GetTransactionCodesByGroupType', { params: data, ...options })
  },
  /**
   * Get Transaction Code
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  get(data = {}, options = {}) {
    return api.get('/api/TransactionCode/Get', { params: data, ...options })
  },
  /**
   * Get All Transaction Code
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
    return api.get('/api/TransactionCode/GetAll', { params: data, ...options })
  },
  /**
   * Create Transaction Code
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  create(data = {}, options = {}) {
    return api.post('/api/TransactionCode/Create', data, options)
  },
  /**
   * Update Transaction Code
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  update(data = {}, options = {}) {
    return api.post('/api/TransactionCode/Update', data, options)
  },
  /**
   * Delete Transaction Code
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  delete(data = {}, options = {}) {
    return api.delete('/api/TransactionCode/Delete', { params: data, ...options })
  }
}
