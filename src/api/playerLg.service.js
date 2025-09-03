import { api } from 'src/boot/axios'


export const playerLgService = {
  name: 'PlayerLg',
  /**
   * Update Player Avg Bet Player Lg
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updatePlayerAvgBet(data = {}, options = {}) {
    return api.post('/api/PlayerLg/UpdatePlayerAvgBet', data, options)
  },
  /**
   * Player Chip In Out Player Lg
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  playerChipInOut(data = {}, options = {}) {
    return api.post('/api/PlayerLg/PlayerChipInOut', data, options)
  },
  /**
   * Player Marker In Out Player Lg
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  playerMarkerInOut(data = {}, options = {}) {
    return api.post('/api/PlayerLg/PlayerMarkerInOut', data, options)
  },
  /**
   * Player Cash In Player Lg
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  playerCashIn(data = {}, options = {}) {
    return api.post('/api/PlayerLg/PlayerCashIn', data, options)
  },
  /**
   * Player Sit Player Lg
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  playerSit(data = {}, options = {}) {
    return api.post('/api/PlayerLg/PlayerSit', data, options)
  },
  /**
   * Player Pause Or Resume Player Lg
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  playerPauseOrResume(data = {}, options = {}) {
    return api.post('/api/PlayerLg/PlayerPauseOrResume', data, options)
  },
  /**
   * Player Leave Player Lg
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  playerLeave(data = {}, options = {}) {
    return api.post('/api/PlayerLg/PlayerLeave', data, options)
  },
  /**
   * Player Sit Delete Player Lg
   *
   * @param {object} [data]
   * @param {undefined} [data.playerLgTimeInOutId] - Player Lg Time In Out Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  playerSitDelete(data = {}, options = {}) {
    return api.delete('/api/PlayerLg/PlayerSitDelete', { params: data, ...options })
  },
  /**
   * Get Chip Drop Histories Player Lg
   *
   * @param {object} [data]
   * @param {undefined} [data.tableId] - Table Id
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.chipTransactionType] - Chip Transaction Type
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getChipDropHistories(data = {}, options = {}) {
    return api.get('/api/PlayerLg/GetChipDropHistories', { params: data, ...options })
  },
  /**
   * Get Chip Drop Detail Histories Player Lg
   *
   * @param {object} [data]
   * @param {undefined} [data.tableId] - Table Id
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.createdAt] - Created At
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getChipDropDetailHistories(data = {}, options = {}) {
    return api.get('/api/PlayerLg/GetChipDropDetailHistories', { params: data, ...options })
  },
  /**
   * Get Drop Histories Player Lg
   *
   * @param {object} [data]
   * @param {undefined} [data.tableId] - Table Id
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getDropHistories(data = {}, options = {}) {
    return api.get('/api/PlayerLg/GetDropHistories', { params: data, ...options })
  },
  /**
   * Get Cash Drop Detail Histories Player Lg
   *
   * @param {object} [data]
   * @param {undefined} [data.tableId] - Table Id
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.createdAt] - Created At
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getCashDropDetailHistories(data = {}, options = {}) {
    return api.get('/api/PlayerLg/GetCashDropDetailHistories', { params: data, ...options })
  },
  /**
   * Get Sit Player Histories Player Lg
   *
   * @param {object} [data]
   * @param {undefined} [data.tableId] - Table Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getSitPlayerHistories(data = {}, options = {}) {
    return api.get('/api/PlayerLg/GetSitPlayerHistories', { params: data, ...options })
  },
  /**
   * Get Sit Players Player Lg
   *
   * @param {object} [data]
   * @param {undefined} [data.tableId] - Table Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getSitPlayers(data = {}, options = {}) {
    return api.get('/api/PlayerLg/GetSitPlayers', { params: data, ...options })
  },
  /**
   * Get Player Table In Out Transactions Player Lg
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.billType] - Bill Type
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerTableInOutTransactions(data = {}, options = {}) {
    return api.get('/api/PlayerLg/GetPlayerTableInOutTransactions', { params: data, ...options })
  },
  /**
   * Get Table Report Player Lg
   *
   * @param {object} [data]
   * @param {undefined} [data.tableId] - Table Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getTableReport(data = {}, options = {}) {
    return api.get('/api/PlayerLg/GetTableReport', { params: data, ...options })
  },
  /**
   * Get Table Total Drop Player Lg
   *
   * @param {object} [data]
   * @param {undefined} [data.tableId] - Table Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getTableTotalDrop(data = {}, options = {}) {
    return api.get('/api/PlayerLg/GetTableTotalDrop', { params: data, ...options })
  },
  /**
   * Get Player Lg Info Player Lg
   *
   * @param {object} [data]
   * @param {undefined} [data.tableId] - Table Id
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerLgInfo(data = {}, options = {}) {
    return api.get('/api/PlayerLg/GetPlayerLgInfo', { params: data, ...options })
  },
  /**
   * Player Sit Today History Player Lg
   *
   * @param {object} [data]
   * @param {undefined} [data.tableId] - Table Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  playerSitTodayHistory(data = {}, options = {}) {
    return api.get('/api/PlayerLg/PlayerSitTodayHistory', { params: data, ...options })
  }
}
