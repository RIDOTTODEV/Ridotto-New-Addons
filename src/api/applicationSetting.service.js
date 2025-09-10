import { api } from 'src/boot/axios'


export const applicationSettingService = {
  name: 'ApplicationSetting',
  /**
   * Set Settings Application Setting
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  setSettings(data = {}, options = {}) {
    return api.post('/api/ApplicationSetting/SetSettings', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Set Gm Meter Report Time Application Setting
   *
   * @param {object} [data]
   * @param {undefined} [data.hour] - Hour
   * @param {undefined} [data.minute] - Minute
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  setGmMeterReportTime(data = {}, options = {}) {
    return api.post('/api/ApplicationSetting/SetGmMeterReportTime', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Set User Settings Application Setting
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  setUserSettings(data = {}, options = {}) {
    return api.post('/api/ApplicationSetting/SetUserSettings', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get User Settings Application Setting
   *
   * @param {object} [data]
   * @param {undefined} [data.name] - Name
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getUserSettings(data = {}, options = {}) {
    return api.get('/api/ApplicationSetting/GetUserSettings', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Settings Application Setting
   *
   * @param {object} [data]
   * @param {undefined} [data.name] - Name
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getSettings(data = {}, options = {}) {
    return api.get('/api/ApplicationSetting/GetSettings', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
