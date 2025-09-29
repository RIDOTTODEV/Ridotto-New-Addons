import { api } from 'src/boot/axios'


export const slotPlayerTransactionService = {
  name: 'SlotPlayerTransaction',
  /**
   * Get All Slot Player Transaction
   *
   * @param {object} [data]
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.transactionCode] - Transaction Code
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.floorNo] - Floor No
   * @param {undefined} [data.balanceCurrencyId] - Balance Currency Id
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
    return api.get('/api/SlotPlayerTransaction/GetAll', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Player Slot Transactions Slot Player Transaction
   *
   * @param {object} [data]
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.balanceCurrencyId] - Balance Currency Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerSlotTransactions(data = {}, options = {}) {
    return api.get('/api/SlotPlayerTransaction/GetPlayerSlotTransactions', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Create Slot Player Transaction
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  create(data = {}, options = {}) {
    return api.post('/api/SlotPlayerTransaction/Create', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Delete Slot Player Transaction
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  delete(data = {}, options = {}) {
    return api.delete('/api/SlotPlayerTransaction/Delete', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
