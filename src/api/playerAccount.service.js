import { api } from 'src/boot/axios'


export const playerAccountService = {
  name: 'PlayerAccount',
  /**
   * Get All Player Account
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.currencyId] - Currency Id
   * @param {undefined} [data.accountType] - Account Type
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
    return api.get('/api/PlayerAccount/GetAll', { params: data, ...options })
  },
  /**
   * Get Player Accounts Player Account
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.currencyId] - Currency Id
   * @param {undefined} [data.accountType] - Account Type
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerAccounts(data = {}, options = {}) {
    return api.get('/api/PlayerAccount/GetPlayerAccounts', { params: data, ...options })
  },
  /**
   * Get All Player Accounts Player Account
   *
   * @param {object} [data]
   * @param {undefined} [data.currencyId] - Currency Id
   * @param {undefined} [data.accountType] - Account Type
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getAllPlayerAccounts(data = {}, options = {}) {
    return api.get('/api/PlayerAccount/GetAllPlayerAccounts', { params: data, ...options })
  },
  /**
   * Get Paged Player Accounts Player Account
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.playerSearchStr] - Player Search Str
   * @param {undefined} [data.currencyId] - Currency Id
   * @param {undefined} [data.greaterThan] - Greater Than
   * @param {undefined} [data.lessThan] - Less Than
   * @param {undefined} [data.accountType] - Account Type
   * @param {undefined} [data.sorting] - Sorting
   * @param {undefined} [data.maxResultCount] - Max Result Count
   * @param {undefined} [data.skipCount] - Skip Count
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPagedPlayerAccounts(data = {}, options = {}) {
    if (!data.maxResultCount) {
      data.maxResultCount = 999
    }
    if (!data.skipCount) {
      data.skipCount = 0
    }
    return api.get('/api/PlayerAccount/GetPagedPlayerAccounts', { params: data, ...options })
  },
  /**
   * Get Account Transactions Player Account
   *
   * @param {object} [data]
   * @param {undefined} [data.pending] - Pending
   * @param {undefined} [data.defaultCurrencyId] - Default Currency Id
   * @param {undefined} [data.cashlessTransactionType] - Cashless Transaction Type
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.playerSearchStr] - Player Search Str
   * @param {undefined} [data.playerAccountId] - Player Account Id
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.currencyId] - Currency Id
   * @param {undefined} [data.transactionType] - Transaction Type
   * @param {undefined} [data.transType] - Trans Type
   * @param {undefined} [data.minAmount] - Min Amount
   * @param {undefined} [data.maxAmount] - Max Amount
   * @param {undefined} [data.cashdeskId] - Cashdesk Id
   * @param {undefined} [data.floorNo] - Floor No
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
  getAccountTransactions(data = {}, options = {}) {
    if (!data.maxResultCount) {
      data.maxResultCount = 999
    }
    if (!data.skipCount) {
      data.skipCount = 0
    }
    return api.get('/api/PlayerAccount/GetAccountTransactions', { params: data, ...options })
  },
  /**
   * Get Pending Gm Transactions Player Account
   *
   * @param {object} [data]
   * @param {undefined} [data.pending] - Pending
   * @param {undefined} [data.defaultCurrencyId] - Default Currency Id
   * @param {undefined} [data.cashlessTransactionType] - Cashless Transaction Type
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.playerSearchStr] - Player Search Str
   * @param {undefined} [data.playerAccountId] - Player Account Id
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.currencyId] - Currency Id
   * @param {undefined} [data.transactionType] - Transaction Type
   * @param {undefined} [data.transType] - Trans Type
   * @param {undefined} [data.minAmount] - Min Amount
   * @param {undefined} [data.maxAmount] - Max Amount
   * @param {undefined} [data.cashdeskId] - Cashdesk Id
   * @param {undefined} [data.floorNo] - Floor No
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
  getPendingGmTransactions(data = {}, options = {}) {
    if (!data.maxResultCount) {
      data.maxResultCount = 999
    }
    if (!data.skipCount) {
      data.skipCount = 0
    }
    return api.get('/api/PlayerAccount/GetPendingGmTransactions', { params: data, ...options })
  },
  /**
   * Post Panel Transaction Pending Finalize Player Account
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  postPanelTransactionPendingFinalize(data = {}, options = {}) {
    return api.post('/api/PlayerAccount/PostPanelTransactionPendingFinalize', data, options)
  },
  /**
   * Post Cashdesk Transaction Player Account
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  postCashdeskTransaction(data = {}, options = {}) {
    return api.post('/api/PlayerAccount/PostCashdeskTransaction', data, options)
  },
  /**
   * Post Cashdesk Player In Out Transaction Player Account
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  postCashdeskPlayerInOutTransaction(data = {}, options = {}) {
    return api.post('/api/PlayerAccount/PostCashdeskPlayerInOutTransaction', data, options)
  },
  /**
   * Post Gm Transaction Player Account
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  postGmTransaction(data = {}, options = {}) {
    return api.post('/api/PlayerAccount/PostGmTransaction', data, options)
  },
  /**
   * Post Gm Transaction Pending Player Account
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  postGmTransactionPending(data = {}, options = {}) {
    return api.post('/api/PlayerAccount/PostGmTransactionPending', data, options)
  },
  /**
   * Get Player Meta Detail Player Account
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.noteSource] - Note Source
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.queryType] - Query Type
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerMetaDetail(data = {}, options = {}) {
    return api.get('/api/PlayerAccount/GetPlayerMetaDetail', { params: data, ...options })
  },
  /**
   * Get Accounts With Totals Player Account
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
  getAccountsWithTotals(data = {}, options = {}) {
    return api.get('/api/PlayerAccount/GetAccountsWithTotals', { params: data, ...options })
  },
  /**
   * Get Last Transactions Player Account
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
  getLastTransactions(data = {}, options = {}) {
    if (!data.maxResultCount) {
      data.maxResultCount = 999
    }
    if (!data.skipCount) {
      data.skipCount = 0
    }
    return api.get('/api/PlayerAccount/GetLastTransactions', { params: data, ...options })
  },
  /**
   * Get Last Cash Transactions Player Account
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
  getLastCashTransactions(data = {}, options = {}) {
    if (!data.maxResultCount) {
      data.maxResultCount = 999
    }
    if (!data.skipCount) {
      data.skipCount = 0
    }
    return api.get('/api/PlayerAccount/GetLastCashTransactions', { params: data, ...options })
  },
  /**
   * Get Player In Out Player Account
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
  getPlayerInOut(data = {}, options = {}) {
    return api.get('/api/PlayerAccount/GetPlayerInOut', { params: data, ...options })
  },
  /**
   * Get Player Account Types Player Account
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerAccountTypes(data = {}, options = {}) {
    return api.get('/api/PlayerAccount/GetPlayerAccountTypes', { params: data, ...options })
  },
  /**
   * Get Player Discount Player Account
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerDiscount(data = {}, options = {}) {
    return api.get('/api/PlayerAccount/GetPlayerDiscount', { params: data, ...options })
  },
  /**
   * Post Player Discount Player Account
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  postPlayerDiscount(data = {}, options = {}) {
    return api.post('/api/PlayerAccount/PostPlayerDiscount', data, options)
  }
}
