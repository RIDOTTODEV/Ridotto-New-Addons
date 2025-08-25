import { api } from 'src/boot/axios'


export const meterStatsService = {
  name: 'MeterStats',
  /**
   * Get Player Win Loss Meter Stats
   *
   * @param {object} [data]
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerWinLoss(data = {}, options = {}) {
    return api.get('/api/MeterStats/GetPlayerWinLoss', { params: data, ...options })
  },
  /**
   * Get Promo Player Win Loss Meter Stats
   *
   * @param {object} [data]
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPromoPlayerWinLoss(data = {}, options = {}) {
    return api.get('/api/MeterStats/GetPromoPlayerWinLoss', { params: data, ...options })
  },
  /**
   * Get Slot Win Loss Meter Stats
   *
   * @param {object} [data]
   * @param {undefined} [data.brandId] - Brand Id
   * @param {undefined} [data.modelId] - Model Id
   * @param {undefined} [data.bankId] - Bank Id
   * @param {undefined} [data.meterGroupId] - Meter Group Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getSlotWinLoss(data = {}, options = {}) {
    return api.get('/api/MeterStats/GetSlotWinLoss', { params: data, ...options })
  },
  /**
   * Get Slot Statistics By Money Meter Stats
   *
   * @param {object} [data]
   * @param {undefined} [data.brandId] - Brand Id
   * @param {undefined} [data.modelId] - Model Id
   * @param {undefined} [data.bankId] - Bank Id
   * @param {undefined} [data.meterGroupId] - Meter Group Id
   * @param {undefined} [data.jackpotGroupId] - Jackpot Group Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getSlotStatisticsByMoney(data = {}, options = {}) {
    return api.get('/api/MeterStats/GetSlotStatisticsByMoney', { params: data, ...options })
  },
  /**
   * Get Slot Statistics By Meter Meter Stats
   *
   * @param {object} [data]
   * @param {undefined} [data.brandId] - Brand Id
   * @param {undefined} [data.modelId] - Model Id
   * @param {undefined} [data.bankId] - Bank Id
   * @param {undefined} [data.meterGroupId] - Meter Group Id
   * @param {undefined} [data.jackpotGroupId] - Jackpot Group Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getSlotStatisticsByMeter(data = {}, options = {}) {
    return api.get('/api/MeterStats/GetSlotStatisticsByMeter', { params: data, ...options })
  },
  /**
   * Get Slot Statistics By Game Meter Stats
   *
   * @param {object} [data]
   * @param {undefined} [data.brandId] - Brand Id
   * @param {undefined} [data.modelId] - Model Id
   * @param {undefined} [data.bankId] - Bank Id
   * @param {undefined} [data.meterGroupId] - Meter Group Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getSlotStatisticsByGame(data = {}, options = {}) {
    return api.get('/api/MeterStats/GetSlotStatisticsByGame', { params: data, ...options })
  },
  /**
   * Get Game Statistics By Slot Meter Stats
   *
   * @param {object} [data]
   * @param {undefined} [data.brandId] - Brand Id
   * @param {undefined} [data.modelId] - Model Id
   * @param {undefined} [data.bankId] - Bank Id
   * @param {undefined} [data.meterGroupId] - Meter Group Id
   * @param {undefined} [data.jackpotGroupId] - Jackpot Group Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getGameStatisticsBySlot(data = {}, options = {}) {
    return api.get('/api/MeterStats/GetGameStatisticsBySlot', { params: data, ...options })
  },
  /**
   * Get Gm Latest Meters Meter Stats
   *
   * @param {object} [data]
   * @param {undefined} [data.slotMachineId] - Slot Machine Id
   * @param {undefined} [data.floorNo] - Floor No
   * @param {undefined} [data.brandId] - Brand Id
   * @param {undefined} [data.modelId] - Model Id
   * @param {undefined} [data.bankId] - Bank Id
   * @param {undefined} [data.meterGroupId] - Meter Group Id
   * @param {undefined} [data.jackpotGroupId] - Jackpot Group Id
   * @param {undefined} [data.isActive] - Is Active
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getGmLatestMeters(data = {}, options = {}) {
    return api.get('/api/MeterStats/GetGmLatestMeters', { params: data, ...options })
  },
  /**
   * Get Player Summary By Machine Meter Stats
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.slotMachineId] - Slot Machine Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerSummaryByMachine(data = {}, options = {}) {
    return api.get('/api/MeterStats/GetPlayerSummaryByMachine', { params: data, ...options })
  },
  /**
   * Get Player Statistics Meter Stats
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.balanceCurrencyId] - Balance Currency Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerStatistics(data = {}, options = {}) {
    return api.get('/api/MeterStats/GetPlayerStatistics', { params: data, ...options })
  },
  /**
   * Get Player Roulette Stats Meter Stats
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerRouletteStats(data = {}, options = {}) {
    return api.get('/api/MeterStats/GetPlayerRouletteStats', { params: data, ...options })
  },
  /**
   * Get Gm Last Bets Meter Stats
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getGmLastBets(data = {}, options = {}) {
    return api.get('/api/MeterStats/GetGmLastBets', { params: data, ...options })
  },
  /**
   * Get Double Bets Meter Stats
   *
   * @param {object} [data]
   * @param {undefined} [data.currencyId] - Currency Id
   * @param {undefined} [data.greaterThan] - Greater Than
   * @param {undefined} [data.rouletteOnly] - Roulette Only
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getDoubleBets(data = {}, options = {}) {
    return api.get('/api/MeterStats/GetDoubleBets', { params: data, ...options })
  },
  /**
   * Get Player Slot Turnover Meter Stats
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.targetCurrencyId] - Target Currency Id
   * @param {undefined} [data.days] - Days
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerSlotTurnover(data = {}, options = {}) {
    return api.get('/api/MeterStats/GetPlayerSlotTurnover', { params: data, ...options })
  }
}
