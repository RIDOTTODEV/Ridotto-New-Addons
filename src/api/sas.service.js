import { api } from 'src/boot/axios'


export const sasService = {
  name: 'Sas',
  /**
   * Get C Sas Debug Logs Sas
   *
   * @param {object} [data]
   * @param {undefined} [data.slotMachineId] - Slot Machine Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.currentPage] - Current Page
   * @param {undefined} [data.pagingState] - Paging State
   * @param {undefined} [data.sorting] - Sorting
   * @param {undefined} [data.maxResultCount] - Max Result Count
   * @param {undefined} [data.skipCount] - Skip Count
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getCSasDebugLogs(data = {}, options = {}) {
    if (!data.maxResultCount) {
      data.maxResultCount = 999
    }
    if (!data.skipCount) {
      data.skipCount = 0
    }
    return api.get('/api/Sas/GetCSasDebugLogs', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Sas Logs Sas
   *
   * @param {object} [data]
   * @param {undefined} [data.slotMachineId] - Slot Machine Id
   * @param {undefined} [data.interfaceId] - Interface Id
   * @param {undefined} [data.floorNo] - Floor No
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.externalPlayerId] - External Player Id
   * @param {undefined} [data.playerFullName] - Player Full Name
   * @param {undefined} [data.commandDescription] - Command Description
   * @param {undefined} [data.commandCode] - Command Code
   * @param {undefined} [data.commandData] - Command Data
   * @param {undefined} [data.details] - Details
   * @param {undefined} [data.debugInfo] - Debug Info
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
  getSasLogs(data = {}, options = {}) {
    if (!data.maxResultCount) {
      data.maxResultCount = 999
    }
    if (!data.skipCount) {
      data.skipCount = 0
    }
    return api.get('/api/Sas/GetSasLogs', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Sas Debug Logs Sas
   *
   * @param {object} [data]
   * @param {undefined} [data.casinoId] - Casino Id
   * @param {undefined} [data.slotMachineId] - Slot Machine Id
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
  getSasDebugLogs(data = {}, options = {}) {
    if (!data.maxResultCount) {
      data.maxResultCount = 999
    }
    if (!data.skipCount) {
      data.skipCount = 0
    }
    return api.get('/api/Sas/GetSasDebugLogs', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
