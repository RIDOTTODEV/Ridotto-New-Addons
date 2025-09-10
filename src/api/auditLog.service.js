import { api } from 'src/boot/axios'


export const auditLogService = {
  name: 'AuditLog',
  /**
   * Get All Audit Log
   *
   * @param {object} [data]
   * @param {undefined} [data.userId] - User Id
   * @param {undefined} [data.userName] - User Name
   * @param {undefined} [data.serviceName] - Service Name
   * @param {undefined} [data.methodName] - Method Name
   * @param {undefined} [data.startTime] - Start Time
   * @param {undefined} [data.endTime] - End Time
   * @param {undefined} [data.executionDuration] - Execution Duration
   * @param {undefined} [data.statusCode] - Status Code
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
    return api.get('/api/AuditLog/GetAll', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Audit Log
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  get(data = {}, options = {}) {
    return api.get('/api/AuditLog/Get', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
