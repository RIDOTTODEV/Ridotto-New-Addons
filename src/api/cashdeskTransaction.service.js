import { api } from 'src/boot/axios'


export const cashdeskTransactionService = {
  name: 'CashdeskTransaction',
  /**
   * Cashdesk Exchange Transaction Cashdesk Transaction
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  cashdeskExchangeTransaction(data = {}, options = {}) {
    return api.post('/api/CashdeskTransaction/CashdeskExchangeTransaction', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Cashdesk Between Transfer Transaction Cashdesk Transaction
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  cashdeskBetweenTransferTransaction(data = {}, options = {}) {
    return api.post('/api/CashdeskTransaction/CashdeskBetweenTransferTransaction', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Cashdesk In Out Transfer Transaction Cashdesk Transaction
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  cashdeskInOutTransferTransaction(data = {}, options = {}) {
    return api.post('/api/CashdeskTransaction/CashdeskInOutTransferTransaction', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Cashdesk Bank Transaction Cashdesk Transaction
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  cashdeskBankTransaction(data = {}, options = {}) {
    return api.post('/api/CashdeskTransaction/CashdeskBankTransaction', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Cashdesk Chip Transaction Cashdesk Transaction
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  cashdeskChipTransaction(data = {}, options = {}) {
    return api.post('/api/CashdeskTransaction/CashdeskChipTransaction', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Cashdesk Chip In Out Transfer Transaction Cashdesk Transaction
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  cashdeskChipInOutTransferTransaction(data = {}, options = {}) {
    return api.post('/api/CashdeskTransaction/CashdeskChipInOutTransferTransaction', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Cashdesk Between Chip Transfer Transaction Cashdesk Transaction
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  cashdeskBetweenChipTransferTransaction(data = {}, options = {}) {
    return api.post('/api/CashdeskTransaction/CashdeskBetweenChipTransferTransaction', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Cashdesk Table Fill Credit Transaction Cashdesk Transaction
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  cashdeskTableFillCreditTransaction(data = {}, options = {}) {
    return api.post('/api/CashdeskTransaction/CashdeskTableFillCreditTransaction', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Cashdesk Ticket Transaction Cashdesk Transaction
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  cashdeskTicketTransaction(data = {}, options = {}) {
    return api.post('/api/CashdeskTransaction/CashdeskTicketTransaction', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Other Transaction Cashdesk Transaction
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  otherTransaction(data = {}, options = {}) {
    return api.post('/api/CashdeskTransaction/OtherTransaction', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Cashdesk Rate Effect Transaction Cashdesk Transaction
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  cashdeskRateEffectTransaction(data = {}, options = {}) {
    return api.post('/api/CashdeskTransaction/CashdeskRateEffectTransaction', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Cashdesk Deposit Credit Transaction Cashdesk Transaction
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  cashdeskDepositCreditTransaction(data = {}, options = {}) {
    return api.post('/api/CashdeskTransaction/CashdeskDepositCreditTransaction', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Table Count Cash Transaction Cashdesk Transaction
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  tableCountCashTransaction(data = {}, options = {}) {
    return api.post('/api/CashdeskTransaction/TableCountCashTransaction', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Table Float Fill Transaction Cashdesk Transaction
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  tableFloatFillTransaction(data = {}, options = {}) {
    return api.post('/api/CashdeskTransaction/TableFloatFillTransaction', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get All Cashdesk Transaction
   *
   * @param {object} [data]
   * @param {undefined} [data.cashdeskAccountId] - Cashdesk Account Id
   * @param {undefined} [data.defaultCurrencyId] - Default Currency Id
   * @param {undefined} [data.transactionCodeId] - Transaction Code Id
   * @param {undefined} [data.cashdeskId] - Cashdesk Id
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.currencyId] - Currency Id
   * @param {undefined} [data.transactionType] - Transaction Type
   * @param {undefined} [data.cashdeskTransactionType] - Cashdesk Transaction Type
   * @param {undefined} [data.transType] - Trans Type
   * @param {undefined} [data.minAmount] - Min Amount
   * @param {undefined} [data.maxAmount] - Max Amount
   * @param {undefined} [data.maxResultCount] - Max Result Count
   * @param {undefined} [data.skipCount] - Skip Count
   * @param {undefined} [data.sorting] - Sorting
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
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
    return api.get('/api/CashdeskTransaction/GetAll', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get All Chip Transactions Cashdesk Transaction
   *
   * @param {object} [data]
   * @param {undefined} [data.cashdeskAccountId] - Cashdesk Account Id
   * @param {undefined} [data.defaultCurrencyId] - Default Currency Id
   * @param {undefined} [data.transactionCodeId] - Transaction Code Id
   * @param {undefined} [data.cashdeskId] - Cashdesk Id
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.currencyId] - Currency Id
   * @param {undefined} [data.transactionType] - Transaction Type
   * @param {undefined} [data.cashdeskTransactionType] - Cashdesk Transaction Type
   * @param {undefined} [data.transType] - Trans Type
   * @param {undefined} [data.minAmount] - Min Amount
   * @param {undefined} [data.maxAmount] - Max Amount
   * @param {undefined} [data.maxResultCount] - Max Result Count
   * @param {undefined} [data.skipCount] - Skip Count
   * @param {undefined} [data.sorting] - Sorting
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getAllChipTransactions(data = {}, options = {}) {
    if (!data.maxResultCount) {
      data.maxResultCount = 999
    }
    if (!data.skipCount) {
      data.skipCount = 0
    }
    return api.get('/api/CashdeskTransaction/GetAllChipTransactions', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Last Chip Transactions Cashdesk Transaction
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.sorting] - Sorting
   * @param {undefined} [data.maxResultCount] - Max Result Count
   * @param {undefined} [data.skipCount] - Skip Count
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getLastChipTransactions(data = {}, options = {}) {
    if (!data.maxResultCount) {
      data.maxResultCount = 999
    }
    if (!data.skipCount) {
      data.skipCount = 0
    }
    return api.get('/api/CashdeskTransaction/GetLastChipTransactions', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Chip Transaction Detail Cashdesk Transaction
   *
   * @param {object} [data]
   * @param {undefined} [data.cashdeskChipTransactionId] - Cashdesk Chip Transaction Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getChipTransactionDetail(data = {}, options = {}) {
    return api.get('/api/CashdeskTransaction/GetChipTransactionDetail', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Transaction Code Types Cashdesk Transaction
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getTransactionCodeTypes(data = {}, options = {}) {
    return api.get('/api/CashdeskTransaction/GetTransactionCodeTypes', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Trans Type Cashdesk Transaction
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getTransType(data = {}, options = {}) {
    return api.get('/api/CashdeskTransaction/GetTransType', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Cashdesk Transaction Types Cashdesk Transaction
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getCashdeskTransactionTypes(data = {}, options = {}) {
    return api.get('/api/CashdeskTransaction/GetCashdeskTransactionTypes', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Deposits And Credits Cashdesk Transaction
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.defaultCurrencyId] - Default Currency Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getDepositsAndCredits(data = {}, options = {}) {
    return api.get('/api/CashdeskTransaction/GetDepositsAndCredits', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Transaction Totals Cashdesk Transaction
   *
   * @param {object} [data]
   * @param {undefined} [data.cashdeskId] - Cashdesk Id
   * @param {undefined} [data.balanceCurrencyId] - Balance Currency Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getTransactionTotals(data = {}, options = {}) {
    return api.get('/api/CashdeskTransaction/GetTransactionTotals', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Fill Credit Transactions Cashdesk Transaction
   *
   * @param {object} [data]
   * @param {undefined} [data.date] - Date
   * @param {undefined} [data.defaultCurrencyId] - Default Currency Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getFillCreditTransactions(data = {}, options = {}) {
    return api.get('/api/CashdeskTransaction/GetFillCreditTransactions', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Chip Transactions Total Cashdesk Transaction
   *
   * @param {object} [data]
   * @param {undefined} [data.cashdeskId] - Cashdesk Id
   * @param {undefined} [data.balanceCurrencyId] - Balance Currency Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getChipTransactionsTotal(data = {}, options = {}) {
    return api.get('/api/CashdeskTransaction/GetChipTransactionsTotal', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Delete Cashdesk Transaction
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  delete(data = {}, options = {}) {
    return api.delete('/api/CashdeskTransaction/Delete', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
