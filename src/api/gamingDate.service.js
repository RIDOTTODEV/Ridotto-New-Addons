import { api } from 'src/boot/axios'


export const gamingDateService = {
  name: 'GamingDate',
  /**
   * Create Gaming Date
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  create(data = {}, options = {}) {
    return api.post('/api/GamingDate/Create', data, options)
  },
  /**
   * Set Gd Auto Switch Status Gaming Date
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  setGdAutoSwitchStatus(data = {}, options = {}) {
    return api.post('/api/GamingDate/SetGdAutoSwitchStatus', data, options)
  },
  /**
   * Gm Count Gaming Date
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  gmCount(data = {}, options = {}) {
    return api.post('/api/GamingDate/GmCount', data, options)
  },
  /**
   * Update Gaming Date Closed Gaming Date
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updateGamingDateClosed(data = {}, options = {}) {
    return api.post('/api/GamingDate/UpdateGamingDateClosed', data, options)
  },
  /**
   * Gm End Gaming Date Gaming Date
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  gmEndGamingDate(data = {}, options = {}) {
    return api.post('/api/GamingDate/GmEndGamingDate', data, options)
  },
  /**
   * Get Gm Count Detail Gaming Date
   *
   * @param {object} [data]
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.floorNo] - Floor No
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getGmCountDetail(data = {}, options = {}) {
    return api.get('/api/GamingDate/GetGmCountDetail', { params: data, ...options })
  },
  /**
   * Get Gm Count Details Gaming Date
   *
   * @param {object} [data]
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getGmCountDetails(data = {}, options = {}) {
    return api.get('/api/GamingDate/GetGmCountDetails', { params: data, ...options })
  },
  /**
   * Get Machine Gaming Date List Gaming Date
   *
   * @param {object} [data]
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.inGamingDate] - In Gaming Date
   * @param {undefined} [data.sorting] - Sorting
   * @param {undefined} [data.maxResultCount] - Max Result Count
   * @param {undefined} [data.skipCount] - Skip Count
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getMachineGamingDateList(data = {}, options = {}) {
    if (!data.maxResultCount) {
      data.maxResultCount = 999
    }
    if (!data.skipCount) {
      data.skipCount = 0
    }
    return api.get('/api/GamingDate/GetMachineGamingDateList', { params: data, ...options })
  },
  /**
   * Get Current Gaming Date Info Gaming Date
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getCurrentGamingDateInfo(data = {}, options = {}) {
    return api.get('/api/GamingDate/GetCurrentGamingDateInfo', { params: data, ...options })
  },
  /**
   * Get All Key Values Gaming Date
   *
   * @param {object} [data]
   * @param {undefined} [data.includeDeletedRows] - Include Deleted Rows
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getAllKeyValues(data = {}, options = {}) {
    return api.get('/api/GamingDate/GetAllKeyValues', { params: data, ...options })
  },
  /**
   * Get Gm Count Day By Day Gaming Date
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
  getGmCountDayByDay(data = {}, options = {}) {
    return api.get('/api/GamingDate/GetGmCountDayByDay', { params: data, ...options })
  },
  /**
   * Get Slot Machines Ddl By Gaming Date Gaming Date
   *
   * @param {object} [data]
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.sorting] - Sorting
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getSlotMachinesDdlByGamingDate(data = {}, options = {}) {
    return api.get('/api/GamingDate/GetSlotMachinesDdlByGamingDate', { params: data, ...options })
  },
  /**
   * Create Or Update Count Detail Gaming Date
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  createOrUpdateCountDetail(data = {}, options = {}) {
    return api.post('/api/GamingDate/CreateOrUpdateCountDetail', data, options)
  },
  /**
   * Get Gaming Date
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  get(data = {}, options = {}) {
    return api.get('/api/GamingDate/Get', { params: data, ...options })
  },
  /**
   * Get All Gaming Date
   *
   * @param {object} [data]
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
    return api.get('/api/GamingDate/GetAll', { params: data, ...options })
  },
  /**
   * Update Gaming Date
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  update(data = {}, options = {}) {
    return api.post('/api/GamingDate/Update', data, options)
  },
  /**
   * Delete Gaming Date
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  delete(data = {}, options = {}) {
    return api.delete('/api/GamingDate/Delete', { params: data, ...options })
  }
}
