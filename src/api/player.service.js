import { api } from 'src/boot/axios'


export const playerService = {
  name: 'Player',
  /**
   * Get All Player
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.countryId] - Country Id
   * @param {undefined} [data.name] - Name
   * @param {undefined} [data.surname] - Surname
   * @param {undefined} [data.registrationStart] - Registration Start
   * @param {undefined} [data.registrationEnd] - Registration End
   * @param {undefined} [data.lastSeenStart] - Last Seen Start
   * @param {undefined} [data.lastSeenEnd] - Last Seen End
   * @param {undefined} [data.birthDateStart] - Birth Date Start
   * @param {undefined} [data.birthDateEnd] - Birth Date End
   * @param {undefined} [data.isBlackListed] - Is Black Listed
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
    return api.get('/api/Player/GetAll', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Profile Player
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getProfile(data = {}, options = {}) {
    return api.get('/api/Player/GetProfile', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Player
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  get(data = {}, options = {}) {
    return api.get('/api/Player/Get', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Player Info Player
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerInfo(data = {}, options = {}) {
    return api.get('/api/Player/GetPlayerInfo', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Player Visit Dates Player
   *
   * @param {object} [data]
   * @param {undefined} [data.isAscending] - Is Ascending
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.queryType] - Query Type
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerVisitDates(data = {}, options = {}) {
    return api.get('/api/Player/GetPlayerVisitDates', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Search Return With Profile Photos Player
   *
   * @param {object} [data]
   * @param {undefined} [data.searchString] - Search String
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  searchReturnWithProfilePhotos(data = {}, options = {}) {
    return api.get('/api/Player/SearchReturnWithProfilePhotos', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Player Image Player
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerImage(data = {}, options = {}) {
    return api.get('/api/Player/GetPlayerImage', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Blacklist Info Player
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getBlacklistInfo(data = {}, options = {}) {
    return api.get('/api/Player/GetBlacklistInfo', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Day Total Time Player
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.queryType] - Query Type
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getDayTotalTime(data = {}, options = {}) {
    return api.get('/api/Player/GetDayTotalTime', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Discount Percentage Player
   *
   * @param {object} [data]
   * @param {undefined} [data.lostAmount] - Lost Amount
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.defaultCurrencyId] - Default Currency Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getDiscountPercentage(data = {}, options = {}) {
    return api.get('/api/Player/GetDiscountPercentage', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Player Portfolios Player
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.rating] - Rating
   * @param {undefined} [data.withResult] - With Result
   * @param {undefined} [data.birthDay] - Birth Day
   * @param {undefined} [data.spouseBirthDay] - Spouse Birth Day
   * @param {undefined} [data.weddingAnniversary] - Wedding Anniversary
   * @param {undefined} [data.defaultCurrencyId] - Default Currency Id
   * @param {undefined} [data.date] - Date
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.sorting] - Sorting
   * @param {undefined} [data.maxResultCount] - Max Result Count
   * @param {undefined} [data.skipCount] - Skip Count
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerPortfolios(data = {}, options = {}) {
    if (!data.maxResultCount) {
      data.maxResultCount = 999
    }
    if (!data.skipCount) {
      data.skipCount = 0
    }
    return api.get('/api/Player/GetPlayerPortfolios', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Player Transactions Player
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.transType] - Trans Type
   * @param {undefined} [data.transactionType] - Transaction Type
   * @param {undefined} [data.queryType] - Query Type
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPlayerTransactions(data = {}, options = {}) {
    return api.get('/api/Player/GetPlayerTransactions', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Save Profile Player
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  saveProfile(data = {}, options = {}) {
    return api.post('/api/Player/SaveProfile', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Profile Player
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updateProfile(data = {}, options = {}) {
    return api.post('/api/Player/UpdateProfile', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Create Or Update Player
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  createOrUpdate(data = {}, options = {}) {
    return api.post('/api/Player/CreateOrUpdate', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Set Player Active Player
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  setPlayerActive(data = {}, options = {}) {
    return api.post('/api/Player/SetPlayerActive', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Default Currency Player
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updateDefaultCurrency(data = {}, options = {}) {
    return api.post('/api/Player/UpdateDefaultCurrency', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Black List Player
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updateBlackList(data = {}, options = {}) {
    return api.post('/api/Player/UpdateBlackList', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Player Note Player
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updatePlayerNote(data = {}, options = {}) {
    return api.post('/api/Player/UpdatePlayerNote', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Player Meta Detail Player
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updatePlayerMetaDetail(data = {}, options = {}) {
    return api.post('/api/Player/UpdatePlayerMetaDetail', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Discount Player
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updateDiscount(data = {}, options = {}) {
    return api.post('/api/Player/UpdateDiscount', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update User Class Player
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updateUserClass(data = {}, options = {}) {
    return api.post('/api/Player/UpdateUserClass', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Player Status Flags Player
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updatePlayerStatusFlags(data = {}, options = {}) {
    return api.post('/api/Player/UpdatePlayerStatusFlags', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Save Profile Photo Player
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  saveProfilePhoto(data = {}, options = {}) {
    return api.put('/api/Player/SaveProfilePhoto', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Photo As Jpeg Player
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getPhotoAsJpeg(data = {}, options = {}) {
    return api.get('/api/Player/GetPhotoAsJpeg', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
