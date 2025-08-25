import { api } from 'src/boot/axios'


export const meterLogService = {
  name: 'MeterLog',
  /**
   * Get Player Today Result Meter Log
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.slotMachineId] - Slot Machine Id
   * @param {undefined} [data.posTableNo] - Pos Table No
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerTodayResult(data = {}, options = {}) {
    return api.get('/api/MeterLog/GetPlayerTodayResult', { params: data, ...options })
  },
  /**
   * Get Cash Box Occupancy Meter Log
   *
   * @param {object} [data]
   * @param {undefined} [data.slotMachineId] - Slot Machine Id
   * @param {undefined} [data.floorNo] - Floor No
   * @param {undefined} [data.currencyId] - Currency Id
   * @param {undefined} [data.denom] - Denom
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getCashBoxOccupancy(data = {}, options = {}) {
    return api.get('/api/MeterLog/GetCashBoxOccupancy', { params: data, ...options })
  },
  /**
   * Get Cash Box Occupancy Details Meter Log
   *
   * @param {object} [data]
   * @param {undefined} [data.slotMachineId] - Slot Machine Id
   * @param {undefined} [data.currencyId] - Currency Id
   * @param {undefined} [data.transactionType] - Transaction Type
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getCashBoxOccupancyDetails(data = {}, options = {}) {
    return api.get('/api/MeterLog/GetCashBoxOccupancyDetails', { params: data, ...options })
  },
  /**
   * Get Meter Logs Meter Log
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
  getMeterLogs(data = {}, options = {}) {
    if (!data.maxResultCount) {
      data.maxResultCount = 999
    }
    if (!data.skipCount) {
      data.skipCount = 0
    }
    return api.get('/api/MeterLog/GetMeterLogs', { params: data, ...options })
  },
  /**
   * Get Last Meter Info Meter Log
   *
   * @param {object} [data]
   * @param {undefined} [data.slotMachineId] - Slot Machine Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getLastMeterInfo(data = {}, options = {}) {
    return api.get('/api/MeterLog/GetLastMeterInfo', { params: data, ...options })
  },
  /**
   * Get Hall Volume Meter Log
   *
   * @param {object} [data]
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.queryType] - Query Type
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getHallVolume(data = {}, options = {}) {
    return api.get('/api/MeterLog/GetHallVolume', { params: data, ...options })
  },
  /**
   * Meter Result Meter Log
   *
   * @param {object} [data]
   * @param {undefined} [data.date] - Date
   * @param {undefined} [data.floorNo] - Floor No
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  meterResult(data = {}, options = {}) {
    return api.get('/api/MeterLog/MeterResult', { params: data, ...options })
  },
  /**
   * Meter Result2 Meter Log
   *
   * @param {object} [data]
   * @param {undefined} [data.date] - Date
   * @param {undefined} [data.floorNo] - Floor No
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  meterResult2(data = {}, options = {}) {
    return api.get('/api/MeterLog/MeterResult2', { params: data, ...options })
  },
  /**
   * Get Promo Player Win Loss Meter Log
   *
   * @param {object} [data]
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.queryType] - Query Type
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPromoPlayerWinLoss(data = {}, options = {}) {
    return api.get('/api/MeterLog/GetPromoPlayerWinLoss', { params: data, ...options })
  },
  /**
   * Get Player Win Loss Meter Log
   *
   * @param {object} [data]
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.queryType] - Query Type
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerWinLoss(data = {}, options = {}) {
    return api.get('/api/MeterLog/GetPlayerWinLoss', { params: data, ...options })
  },
  /**
   * Get Slot Win Loss Meter Log
   *
   * @param {object} [data]
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.brandId] - Brand Id
   * @param {undefined} [data.modelId] - Model Id
   * @param {undefined} [data.bankId] - Bank Id
   * @param {undefined} [data.meterGroupId] - Meter Group Id
   * @param {undefined} [data.jackpotGroupId] - Jackpot Group Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getSlotWinLoss(data = {}, options = {}) {
    return api.get('/api/MeterLog/GetSlotWinLoss', { params: data, ...options })
  },
  /**
   * Get Money Stat Summary Meter Log
   *
   * @param {object} [data]
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.brandId] - Brand Id
   * @param {undefined} [data.modelId] - Model Id
   * @param {undefined} [data.bankId] - Bank Id
   * @param {undefined} [data.meterGroupId] - Meter Group Id
   * @param {undefined} [data.jackpotGroupId] - Jackpot Group Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getMoneyStatSummary(data = {}, options = {}) {
    return api.get('/api/MeterLog/GetMoneyStatSummary', { params: data, ...options })
  },
  /**
   * Get Player Meter Graph Meter Log
   *
   * @param {object} [data]
   * @param {undefined} [data.casinoId] - Casino Id
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.slotMachineId] - Slot Machine Id
   * @param {undefined} [data.currencyId] - Currency Id
   * @param {undefined} [data.isAscending] - Is Ascending
   * @param {undefined} [data.interval] - Interval
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.queryType] - Query Type
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerMeterGraph(data = {}, options = {}) {
    return api.get('/api/MeterLog/GetPlayerMeterGraph', { params: data, ...options })
  },
  /**
   * Get Player Machine Today Result Meter Log
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.slotMachineId] - Slot Machine Id
   * @param {undefined} [data.posTableNo] - Pos Table No
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerMachineTodayResult(data = {}, options = {}) {
    return api.get('/api/MeterLog/GetPlayerMachineTodayResult', { params: data, ...options })
  },
  /**
   * Get Slot Machine Meter Graph Meter Log
   *
   * @param {object} [data]
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.casinoId] - Casino Id
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.slotMachineId] - Slot Machine Id
   * @param {undefined} [data.currencyId] - Currency Id
   * @param {undefined} [data.isAscending] - Is Ascending
   * @param {undefined} [data.interval] - Interval
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getSlotMachineMeterGraph(data = {}, options = {}) {
    return api.get('/api/MeterLog/GetSlotMachineMeterGraph', { params: data, ...options })
  },
  /**
   * Get Player History By Machine Meter Log
   *
   * @param {object} [data]
   * @param {undefined} [data.casinoId] - Casino Id
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.queryType] - Query Type
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerHistoryByMachine(data = {}, options = {}) {
    return api.get('/api/MeterLog/GetPlayerHistoryByMachine', { params: data, ...options })
  },
  /**
   * Get Today Player History By Machine Meter Log
   *
   * @param {object} [data]
   * @param {undefined} [data.casinoId] - Casino Id
   * @param {undefined} [data.playerId] - Player Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getTodayPlayerHistoryByMachine(data = {}, options = {}) {
    return api.get('/api/MeterLog/GetTodayPlayerHistoryByMachine', { params: data, ...options })
  },
  /**
   * Get Slot Statistics By Money Meter Log
   *
   * @param {object} [data]
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.brandId] - Brand Id
   * @param {undefined} [data.modelId] - Model Id
   * @param {undefined} [data.bankId] - Bank Id
   * @param {undefined} [data.meterGroupId] - Meter Group Id
   * @param {undefined} [data.jackpotGroupId] - Jackpot Group Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getSlotStatisticsByMoney(data = {}, options = {}) {
    return api.get('/api/MeterLog/GetSlotStatisticsByMoney', { params: data, ...options })
  },
  /**
   * Get Slot Statistics By Meter Meter Log
   *
   * @param {object} [data]
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.brandId] - Brand Id
   * @param {undefined} [data.modelId] - Model Id
   * @param {undefined} [data.bankId] - Bank Id
   * @param {undefined} [data.meterGroupId] - Meter Group Id
   * @param {undefined} [data.jackpotGroupId] - Jackpot Group Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getSlotStatisticsByMeter(data = {}, options = {}) {
    return api.get('/api/MeterLog/GetSlotStatisticsByMeter', { params: data, ...options })
  },
  /**
   * Get Slot Statistics By Game Meter Log
   *
   * @param {object} [data]
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.brandId] - Brand Id
   * @param {undefined} [data.modelId] - Model Id
   * @param {undefined} [data.bankId] - Bank Id
   * @param {undefined} [data.meterGroupId] - Meter Group Id
   * @param {undefined} [data.jackpotGroupId] - Jackpot Group Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getSlotStatisticsByGame(data = {}, options = {}) {
    return api.get('/api/MeterLog/GetSlotStatisticsByGame', { params: data, ...options })
  },
  /**
   * Get Game Statistics By Slot Meter Log
   *
   * @param {object} [data]
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.casinoId] - Casino Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.brandId] - Brand Id
   * @param {undefined} [data.modelId] - Model Id
   * @param {undefined} [data.bankId] - Bank Id
   * @param {undefined} [data.meterGroupId] - Meter Group Id
   * @param {undefined} [data.jackpotGroupId] - Jackpot Group Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getGameStatisticsBySlot(data = {}, options = {}) {
    return api.get('/api/MeterLog/GetGameStatisticsBySlot', { params: data, ...options })
  },
  /**
   * Get Minus Meters Meter Log
   *
   * @param {object} [data]
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
  getMinusMeters(data = {}, options = {}) {
    if (!data.maxResultCount) {
      data.maxResultCount = 999
    }
    if (!data.skipCount) {
      data.skipCount = 0
    }
    return api.get('/api/MeterLog/GetMinusMeters', { params: data, ...options })
  },
  /**
   * Delete Meter Log Meter Log
   *
   * @param {object} [data]
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.slotMachineId] - Slot Machine Id
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.currencyId] - Currency Id
   * @param {undefined} [data.timeUuid] - Time Uuid
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  deleteMeterLog(data = {}, options = {}) {
    return api.delete('/api/MeterLog/DeleteMeterLog', { params: data, ...options })
  }
}
