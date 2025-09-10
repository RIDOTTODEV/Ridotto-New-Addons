import { api } from 'src/boot/axios'


export const statsService = {
  name: 'Stats',
  /**
   * Get Critical Events Stats
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.slotMachineId] - Slot Machine Id
   * @param {undefined} [data.interfaceId] - Interface Id
   * @param {undefined} [data.floorNo] - Floor No
   * @param {undefined} [data.slotMachineComponent] - Slot Machine Component
   * @param {undefined} [data.criticalEventTypes] - Critical Event Types
   * @param {undefined} [data.reason] - Reason
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
  getCriticalEvents(data = {}, options = {}) {
    if (!data.maxResultCount) {
      data.maxResultCount = 999
    }
    if (!data.skipCount) {
      data.skipCount = 0
    }
    return api.get('/api/Stats/GetCriticalEvents', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Hand Pay Activity Logs Stats
   *
   * @param {object} [data]
   * @param {undefined} [data.slotMachineId] - Slot Machine Id
   * @param {undefined} [data.interfaceId] - Interface Id
   * @param {undefined} [data.currencyId] - Currency Id
   * @param {undefined} [data.floorNo] - Floor No
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.handPayResetCode] - Hand Pay Reset Code
   * @param {undefined} [data.handPayActivityType] - Hand Pay Activity Type
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
  getHandPayActivityLogs(data = {}, options = {}) {
    if (!data.maxResultCount) {
      data.maxResultCount = 999
    }
    if (!data.skipCount) {
      data.skipCount = 0
    }
    return api.get('/api/Stats/GetHandPayActivityLogs', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Gm Event Logs Stats
   *
   * @param {object} [data]
   * @param {undefined} [data.slotMachineId] - Slot Machine Id
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.eventType] - Event Type
   * @param {undefined} [data.eventName] - Event Name
   * @param {undefined} [data.eventTypes] - Event Types
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.sorting] - Sorting
   * @param {undefined} [data.maxResultCount] - Max Result Count
   * @param {undefined} [data.skipCount] - Skip Count
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getGmEventLogs(data = {}, options = {}) {
    if (!data.maxResultCount) {
      data.maxResultCount = 999
    }
    if (!data.skipCount) {
      data.skipCount = 0
    }
    return api.get('/api/Stats/GetGmEventLogs', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
