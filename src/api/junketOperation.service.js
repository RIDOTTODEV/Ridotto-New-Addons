import { api } from 'src/boot/axios'


export const junketOperationService = {
  name: 'JunketOperation',
  /**
   * Get Gc Junket Players Junket Operation
   *
   * @param {object} [data]
   * @param {undefined} [data.groupCodeId] - Group Code Id
   * @param {undefined} [data.playerCategoryId] - Player Category Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getGcJunketPlayers(data = {}, options = {}) {
    return api.get('/api/JunketOperation/GetGcJunketPlayers', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Gc Junket Result Junket Operation
   *
   * @param {object} [data]
   * @param {undefined} [data.groupCodeId] - Group Code Id
   * @param {undefined} [data.playerCategoryId] - Player Category Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getGcJunketResult(data = {}, options = {}) {
    return api.get('/api/JunketOperation/GetGcJunketResult', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Calculation Status Junket Operation
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updateCalculationStatus(data = {}, options = {}) {
    return api.post('/api/JunketOperation/UpdateCalculationStatus', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Junket Calculation Status Junket Operation
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updateJunketCalculationStatus(data = {}, options = {}) {
    return api.post('/api/JunketOperation/UpdateJunketCalculationStatus', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get New Group Code String Junket Operation
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getNewGroupCodeString(data = {}, options = {}) {
    return api.get('/api/JunketOperation/GetNewGroupCodeString', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Group Codes Junket Operation
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getGroupCodes(data = {}, options = {}) {
    return api.get('/api/JunketOperation/GetGroupCodes', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Create Group Code Junket Operation
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  createGroupCode(data = {}, options = {}) {
    return api.post('/api/JunketOperation/CreateGroupCode', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Group Code Junket Operation
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updateGroupCode(data = {}, options = {}) {
    return api.post('/api/JunketOperation/UpdateGroupCode', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Close Group Code Junket Operation
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  closeGroupCode(data = {}, options = {}) {
    return api.post('/api/JunketOperation/CloseGroupCode', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Delete Group Code Junket Operation
   *
   * @param {object} [data]
   * @param {undefined} [data.groupCodeId] - Group Code Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  deleteGroupCode(data = {}, options = {}) {
    return api.delete('/api/JunketOperation/DeleteGroupCode', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Create Payment Junket Operation
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  createPayment(data = {}, options = {}) {
    return api.post('/api/JunketOperation/CreatePayment', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Delete Payment Junket Operation
   *
   * @param {object} [data]
   * @param {undefined} [data.paymentId] - Payment Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  deletePayment(data = {}, options = {}) {
    return api.delete('/api/JunketOperation/DeletePayment', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Payments Junket Operation
   *
   * @param {object} [data]
   * @param {undefined} [data.groupCodeId] - Group Code Id
   * @param {undefined} [data.junketId] - Junket Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPayments(data = {}, options = {}) {
    return api.get('/api/JunketOperation/GetPayments', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Payments Total Junket Operation
   *
   * @param {object} [data]
   * @param {undefined} [data.groupCodeId] - Group Code Id
   * @param {undefined} [data.junketId] - Junket Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPaymentsTotal(data = {}, options = {}) {
    return api.get('/api/JunketOperation/GetPaymentsTotal', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
