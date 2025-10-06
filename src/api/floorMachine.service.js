import { api } from 'src/boot/axios'


export const floorMachineService = {
  name: 'FloorMachine',
  /**
   * Get Heatmap By Field Floor Machine
   *
   * @param {object} [data]
   * @param {undefined} [data.floor] - Floor
   * @param {undefined} [data.reportType] - Report Type
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getHeatmapByField(data = {}, options = {}) {
    return api.get('/api/FloorMachine/GetHeatmapByField', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Heatmap By Sit Times Floor Machine
   *
   * @param {object} [data]
   * @param {undefined} [data.brandId] - Brand Id
   * @param {undefined} [data.modelId] - Model Id
   * @param {undefined} [data.bankId] - Bank Id
   * @param {undefined} [data.meterGroupId] - Meter Group Id
   * @param {undefined} [data.jackpotGroupId] - Jackpot Group Id
   * @param {undefined} [data.floor] - Floor
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getHeatmapBySitTimes(data = {}, options = {}) {
    return api.get('/api/FloorMachine/GetHeatmapBySitTimes', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Floors Floor Machine
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getFloors(data = {}, options = {}) {
    return api.get('/api/FloorMachine/GetFloors', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Floor Sections Floor Machine
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getFloorSections(data = {}, options = {}) {
    return api.get('/api/FloorMachine/GetFloorSections', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Save Floor Machines Floor Machine
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  saveFloorMachines(data = {}, options = {}) {
    return api.post('/api/FloorMachine/SaveFloorMachines', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Save Floor Floor Machine
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  saveFloor(data = {}, options = {}) {
    return api.post('/api/FloorMachine/SaveFloor', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Save Floor Section Floor Machine
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  saveFloorSection(data = {}, options = {}) {
    return api.post('/api/FloorMachine/SaveFloorSection', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Floor Machine
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  get(data = {}, options = {}) {
    return api.get('/api/FloorMachine/Get', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get All Floor Machine
   *
   * @param {object} [data]
   * @param {undefined} [data.floorId] - Floor Id
   * @param {undefined} [data.floorSectionId] - Floor Section Id
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
    return api.get('/api/FloorMachine/GetAll', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Create Floor Machine
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  create(data = {}, options = {}) {
    return api.post('/api/FloorMachine/Create', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Floor Machine
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  update(data = {}, options = {}) {
    return api.post('/api/FloorMachine/Update', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Delete Floor Machine
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  delete(data = {}, options = {}) {
    return api.delete('/api/FloorMachine/Delete', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
