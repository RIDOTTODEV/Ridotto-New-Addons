import { api } from 'src/boot/axios'


export const sasConfigSetService = {
  name: 'SasConfigSet',
  /**
   * Get Ddl Sas Config Set
   *
   * @param {object} [data]
   * @param {undefined} [data.name] - Name
   * @param {undefined} [data.value] - Value
   * @param {undefined} [data.sorting] - Sorting
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getDdl(data = {}, options = {}) {
    return api.get('/api/SasConfigSet/GetDdl', { params: data, ...options })
  },
  /**
   * Get Sas Config Set
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  get(data = {}, options = {}) {
    return api.get('/api/SasConfigSet/Get', { params: data, ...options })
  },
  /**
   * Get All Sas Config Set
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
    return api.get('/api/SasConfigSet/GetAll', { params: data, ...options })
  },
  /**
   * Create Sas Config Set
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  create(data = {}, options = {}) {
    return api.post('/api/SasConfigSet/Create', data, options)
  },
  /**
   * Update Sas Config Set
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  update(data = {}, options = {}) {
    return api.post('/api/SasConfigSet/Update', data, options)
  },
  /**
   * Delete Sas Config Set
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  delete(data = {}, options = {}) {
    return api.delete('/api/SasConfigSet/Delete', { params: data, ...options })
  }
}
