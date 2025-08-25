import { api } from 'src/boot/axios'


export const floorMapService = {
  name: 'FloorMap',
  /**
   * Get Heatmap By Field Floor Map
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
    return api.get('/api/FloorMap/GetHeatmapByField', { params: data, ...options })
  },
  /**
   * Get Heatmap By Sit Times Floor Map
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
    return api.get('/api/FloorMap/GetHeatmapBySitTimes', { params: data, ...options })
  },
  /**
   * Get Floors Floor Map
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getFloors(data = {}, options = {}) {
    return api.get('/api/FloorMap/GetFloors', { params: data, ...options })
  },
  /**
   * Get Floor Zones Floor Map
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getFloorZones(data = {}, options = {}) {
    return api.get('/api/FloorMap/GetFloorZones', { params: data, ...options })
  },
  /**
   * Save Floor Map Floor Map
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  saveFloorMap(data = {}, options = {}) {
    return api.post('/api/FloorMap/SaveFloorMap', data, options)
  },
  /**
   * Save Floor Floor Map
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  saveFloor(data = {}, options = {}) {
    return api.post('/api/FloorMap/SaveFloor', data, options)
  },
  /**
   * Save Floor Zone Floor Map
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  saveFloorZone(data = {}, options = {}) {
    return api.post('/api/FloorMap/SaveFloorZone', data, options)
  },
  /**
   * Get Floor Map
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  get(data = {}, options = {}) {
    return api.get('/api/FloorMap/Get', { params: data, ...options })
  },
  /**
   * Get All Floor Map
   *
   * @param {object} [data]
   * @param {undefined} [data.floorId] - Floor Id
   * @param {undefined} [data.floorZoneId] - Floor Zone Id
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
    return api.get('/api/FloorMap/GetAll', { params: data, ...options })
  },
  /**
   * Create Floor Map
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  create(data = {}, options = {}) {
    return api.post('/api/FloorMap/Create', data, options)
  },
  /**
   * Update Floor Map
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  update(data = {}, options = {}) {
    return api.post('/api/FloorMap/Update', data, options)
  },
  /**
   * Delete Floor Map
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  delete(data = {}, options = {}) {
    return api.delete('/api/FloorMap/Delete', { params: data, ...options })
  }
}
