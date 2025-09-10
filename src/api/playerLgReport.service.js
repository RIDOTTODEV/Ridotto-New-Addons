import { api } from 'src/boot/axios'


export const playerLgReportService = {
  name: 'PlayerLgReport',
  /**
   * Get Time In Out Report By Table Player Lg Report
   *
   * @param {object} [data]
   * @param {undefined} [data.tableId] - Table Id
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getTimeInOutReportByTable(data = {}, options = {}) {
    return api.get('/api/PlayerLgReport/GetTimeInOutReportByTable', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Time In Out Report By Player Player Lg Report
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getTimeInOutReportByPlayer(data = {}, options = {}) {
    return api.get('/api/PlayerLgReport/GetTimeInOutReportByPlayer', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Player Result Report Player Lg Report
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerResultReport(data = {}, options = {}) {
    return api.get('/api/PlayerLgReport/GetPlayerResultReport', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Player Result Detail Report Player Lg Report
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerResultDetailReport(data = {}, options = {}) {
    return api.get('/api/PlayerLgReport/GetPlayerResultDetailReport', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Missing Chip Report Player Lg Report
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getMissingChipReport(data = {}, options = {}) {
    return api.get('/api/PlayerLgReport/GetMissingChipReport', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Time In Out Report Player Lg Report
   *
   * @param {object} [data]
   * @param {undefined} [data.tableId] - Table Id
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getTimeInOutReport(data = {}, options = {}) {
    return api.get('/api/PlayerLgReport/GetTimeInOutReport', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Active Floor Info Player Lg Report
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getActiveFloorInfo(data = {}, options = {}) {
    return api.get('/api/PlayerLgReport/GetActiveFloorInfo', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Active Floor Info New Player Lg Report
   *
   * @param {object} [data]
   * @param {undefined} [data.defaultCurrencyId] - Default Currency Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getActiveFloorInfoNew(data = {}, options = {}) {
    return api.get('/api/PlayerLgReport/GetActiveFloorInfoNew', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Missing Chip Report Detail Player Lg Report
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getMissingChipReportDetail(data = {}, options = {}) {
    return api.get('/api/PlayerLgReport/GetMissingChipReportDetail', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
