import { api } from 'src/boot/axios'


export const billAcceptorBrandService = {
  name: 'BillAcceptorBrand',
  /**
   * Get All Key Values Bill Acceptor Brand
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getAllKeyValues(data = {}, options = {}) {
    return api.get('/api/BillAcceptorBrand/GetAllKeyValues', { params: data, ...options })
  },
  /**
   * Get All Bill Acceptor Brand
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getAll(data = {}, options = {}) {
    return api.get('/api/BillAcceptorBrand/GetAll', { params: data, ...options })
  },
  /**
   * Get Bill Acceptor Brand
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  get(data = {}, options = {}) {
    return api.get('/api/BillAcceptorBrand/Get', { params: data, ...options })
  },
  /**
   * Create Bill Acceptor Brand
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  create(data = {}, options = {}) {
    return api.post('/api/BillAcceptorBrand/Create', data, options)
  },
  /**
   * Update Bill Acceptor Brand
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  update(data = {}, options = {}) {
    return api.post('/api/BillAcceptorBrand/Update', data, options)
  },
  /**
   * Delete Bill Acceptor Brand
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  delete(data = {}, options = {}) {
    return api.delete('/api/BillAcceptorBrand/Delete', { params: data, ...options })
  }
}
