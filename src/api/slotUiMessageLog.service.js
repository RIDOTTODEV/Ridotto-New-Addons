import { api } from 'src/boot/axios'


export const slotUiMessageLogService = {
  name: 'SlotUiMessageLog',
  /**
   * Get Slot Ui User Messages Slot Ui Message Log
   *
   * @param {object} [data]
   * @param {undefined} [data.slotMachineId] - Slot Machine Id
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.sorting] - Sorting
   * @param {undefined} [data.maxResultCount] - Max Result Count
   * @param {undefined} [data.skipCount] - Skip Count
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getSlotUiUserMessages(data = {}, options = {}) {
    if (!data.maxResultCount) {
      data.maxResultCount = 999
    }
    if (!data.skipCount) {
      data.skipCount = 0
    }
    return api.get('/api/SlotUiMessageLog/GetSlotUiUserMessages', { params: data, ...options })
  },
  /**
   * Get C Slot Ui User Messages Slot Ui Message Log
   *
   * @param {object} [data]
   * @param {undefined} [data.slotMachineId] - Slot Machine Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.currentPage] - Current Page
   * @param {undefined} [data.pageSize] - Page Size
   * @param {undefined} [data.pagingState] - Paging State
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getCSlotUiUserMessages(data = {}, options = {}) {
    return api.get('/api/SlotUiMessageLog/GetCSlotUiUserMessages', { params: data, ...options })
  }
}
