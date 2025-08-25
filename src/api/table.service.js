import { api } from 'src/boot/axios'


export const tableService = {
  name: 'Table',
  /**
   * Create Table
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  create(data = {}, options = {}) {
    return api.post('/api/Table/Create', data, options)
  },
  /**
   * Update Table Game Table
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updateTableGame(data = {}, options = {}) {
    return api.post('/api/Table/UpdateTableGame', data, options)
  },
  /**
   * Change Gaming Date Table
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  changeGamingDate(data = {}, options = {}) {
    return api.post('/api/Table/ChangeGamingDate', data, options)
  },
  /**
   * Get Transactions Table
   *
   * @param {object} [data]
   * @param {undefined} [data.tableId] - Table Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.sorting] - Sorting
   * @param {undefined} [data.maxResultCount] - Max Result Count
   * @param {undefined} [data.skipCount] - Skip Count
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getTransactions(data = {}, options = {}) {
    if (!data.maxResultCount) {
      data.maxResultCount = 999
    }
    if (!data.skipCount) {
      data.skipCount = 0
    }
    return api.get('/api/Table/GetTransactions', { params: data, ...options })
  },
  /**
   * Get Expected Table Count Table
   *
   * @param {object} [data]
   * @param {undefined} [data.tableId] - Table Id
   * @param {undefined} [data.floatSetId] - Float Set Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getExpectedTableCount(data = {}, options = {}) {
    return api.get('/api/Table/GetExpectedTableCount', { params: data, ...options })
  },
  /**
   * Bulk Update Table Game Table
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  bulkUpdateTableGame(data = {}, options = {}) {
    return api.post('/api/Table/BulkUpdateTableGame', data, options)
  },
  /**
   * Bulk Update Table Float Set Table
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  bulkUpdateTableFloatSet(data = {}, options = {}) {
    return api.post('/api/Table/BulkUpdateTableFloatSet', data, options)
  },
  /**
   * Bulk Change Table Gaming Date Table
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  bulkChangeTableGamingDate(data = {}, options = {}) {
    return api.post('/api/Table/BulkChangeTableGamingDate', data, options)
  },
  /**
   * Get Table
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  get(data = {}, options = {}) {
    return api.get('/api/Table/Get', { params: data, ...options })
  },
  /**
   * Get All Table
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
    return api.get('/api/Table/GetAll', { params: data, ...options })
  },
  /**
   * Update Table
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  update(data = {}, options = {}) {
    return api.post('/api/Table/Update', data, options)
  },
  /**
   * Delete Table
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  delete(data = {}, options = {}) {
    return api.delete('/api/Table/Delete', { params: data, ...options })
  }
}
