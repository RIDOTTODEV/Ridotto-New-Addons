import { api } from 'src/boot/axios'


export const marketerOperationService = {
  name: 'MarketerOperation',
  /**
   * Get Gc Marketer Players Marketer Operation
   *
   * @param {object} [data]
   * @param {undefined} [data.groupCodeId] - Group Code Id
   * @param {undefined} [data.marketerId] - Marketer Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getGcMarketerPlayers(data = {}, options = {}) {
    return api.get('/api/MarketerOperation/GetGcMarketerPlayers', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Gc Marketer Result Marketer Operation
   *
   * @param {object} [data]
   * @param {undefined} [data.groupCodeId] - Group Code Id
   * @param {undefined} [data.marketerId] - Marketer Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getGcMarketerResult(data = {}, options = {}) {
    return api.get('/api/MarketerOperation/GetGcMarketerResult', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Calculation Status Marketer Operation
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updateCalculationStatus(data = {}, options = {}) {
    return api.post('/api/MarketerOperation/UpdateCalculationStatus', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Marketer Calculation Status Marketer Operation
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updateMarketerCalculationStatus(data = {}, options = {}) {
    return api.post('/api/MarketerOperation/UpdateMarketerCalculationStatus', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get New Group Code String Marketer Operation
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getNewGroupCodeString(data = {}, options = {}) {
    return api.get('/api/MarketerOperation/GetNewGroupCodeString', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Group Codes Marketer Operation
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getGroupCodes(data = {}, options = {}) {
    return api.get('/api/MarketerOperation/GetGroupCodes', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Create Group Code Marketer Operation
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  createGroupCode(data = {}, options = {}) {
    return api.post('/api/MarketerOperation/CreateGroupCode', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Group Code Marketer Operation
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updateGroupCode(data = {}, options = {}) {
    return api.post('/api/MarketerOperation/UpdateGroupCode', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Close Group Code Marketer Operation
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  closeGroupCode(data = {}, options = {}) {
    return api.post('/api/MarketerOperation/CloseGroupCode', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Delete Group Code Marketer Operation
   *
   * @param {object} [data]
   * @param {undefined} [data.groupCodeId] - Group Code Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  deleteGroupCode(data = {}, options = {}) {
    return api.delete('/api/MarketerOperation/DeleteGroupCode', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Create Payment Marketer Operation
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  createPayment(data = {}, options = {}) {
    return api.post('/api/MarketerOperation/CreatePayment', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Delete Payment Marketer Operation
   *
   * @param {object} [data]
   * @param {undefined} [data.paymentId] - Payment Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  deletePayment(data = {}, options = {}) {
    return api.delete('/api/MarketerOperation/DeletePayment', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Payments Marketer Operation
   *
   * @param {object} [data]
   * @param {undefined} [data.groupCodeId] - Group Code Id
   * @param {undefined} [data.marketerId] - Marketer Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPayments(data = {}, options = {}) {
    return api.get('/api/MarketerOperation/GetPayments', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Payments Total Marketer Operation
   *
   * @param {object} [data]
   * @param {undefined} [data.groupCodeId] - Group Code Id
   * @param {undefined} [data.marketerId] - Marketer Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPaymentsTotal(data = {}, options = {}) {
    return api.get('/api/MarketerOperation/GetPaymentsTotal', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
