import { api } from 'src/boot/axios'


export const junketOperationService = {
  name: 'JunketOperation',
  /**
   * Group List Junket Operation
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {undefined} [data.status] - Status
   * @param {undefined} [data.isDeleted] - Is Deleted
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.checkInDate] - Check In Date
   * @param {undefined} [data.checkOutDate] - Check Out Date
   * @param {undefined} [data.check] - Check
   * @param {undefined} [data.sorting] - Sorting
   * @param {undefined} [data.maxResultCount] - Max Result Count
   * @param {undefined} [data.skipCount] - Skip Count
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  groupList(data = {}, options = {}) {
    if (!data.maxResultCount) {
      data.maxResultCount = 999
    }
    if (!data.skipCount) {
      data.skipCount = 0
    }
    return api.get('/api/JunketOperation/GroupList', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
