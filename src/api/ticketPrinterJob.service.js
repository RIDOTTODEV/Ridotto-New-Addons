import { api } from 'src/boot/axios'


export const ticketPrinterJobService = {
  name: 'TicketPrinterJob',
  /**
   * Get Ticket Printer Job
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  get(data = {}, options = {}) {
    return api.get('/api/TicketPrinterJob/Get', { params: data, ...options })
  },
  /**
   * Get All Ticket Printer Job
   *
   * @param {object} [data]
   * @param {undefined} [data.slotMachineId] - Slot Machine Id
   * @param {undefined} [data.cashDeskId] - Cash Desk Id
   * @param {undefined} [data.cashDeskType] - Cash Desk Type
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.currencyId] - Currency Id
   * @param {undefined} [data.currencyCode] - Currency Code
   * @param {undefined} [data.ticketPrintJobStatus] - Ticket Print Job Status
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.floorNo] - Floor No
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
    return api.get('/api/TicketPrinterJob/GetAll', { params: data, ...options })
  },
  /**
   * Create Ticket Printer Job
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  create(data = {}, options = {}) {
    return api.post('/api/TicketPrinterJob/Create', data, options)
  },
  /**
   * Update Ticket Printer Job
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  update(data = {}, options = {}) {
    return api.post('/api/TicketPrinterJob/Update', data, options)
  },
  /**
   * Delete Ticket Printer Job
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  delete(data = {}, options = {}) {
    return api.delete('/api/TicketPrinterJob/Delete', { params: data, ...options })
  }
}
