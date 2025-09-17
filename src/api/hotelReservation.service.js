import { api } from 'src/boot/axios'


export const hotelReservationService = {
  name: 'HotelReservation',
  /**
   * Get All Hotel Reservation
   *
   * @param {object} [data]
   * @param {undefined} [data.status] - Status
   * @param {undefined} [data.isDeleted] - Is Deleted
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {undefined} [data.checkInDate] - Check In Date
   * @param {undefined} [data.checkOutDate] - Check Out Date
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
    return api.get('/api/HotelReservation/GetAll', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Copy Reservation Hotel Reservation
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  copyReservation(data = {}, options = {}) {
    return api.post('/api/HotelReservation/CopyReservation', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Copy Bulk Reservation Hotel Reservation
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  copyBulkReservation(data = {}, options = {}) {
    return api.post('/api/HotelReservation/CopyBulkReservation', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Create Reservation Hotel Reservation
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  createReservation(data = {}, options = {}) {
    return api.post('/api/HotelReservation/CreateReservation', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Reservation Hotel Reservation
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updateReservation(data = {}, options = {}) {
    return api.post('/api/HotelReservation/UpdateReservation', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Delete Reservation Hotel Reservation
   *
   * @param {object} [data]
   * @param {undefined} [data.hotelReservationId] - Hotel Reservation Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  deleteReservation(data = {}, options = {}) {
    return api.delete('/api/HotelReservation/DeleteReservation', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Hotel Flight Info Hotel Reservation
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updateHotelFlightInfo(data = {}, options = {}) {
    return api.post('/api/HotelReservation/UpdateHotelFlightInfo', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Add Hotel Reservation Player Hotel Reservation
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  addHotelReservationPlayer(data = {}, options = {}) {
    return api.post('/api/HotelReservation/AddHotelReservationPlayer', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Delete Hotel Reservation Player Hotel Reservation
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  deleteHotelReservationPlayer(data = {}, options = {}) {
    return api.post('/api/HotelReservation/DeleteHotelReservationPlayer', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Add Hotel Reservation Expense Hotel Reservation
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  addHotelReservationExpense(data = {}, options = {}) {
    return api.post('/api/HotelReservation/AddHotelReservationExpense', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Remove Hotel Reservation Expense Hotel Reservation
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  removeHotelReservationExpense(data = {}, options = {}) {
    return api.post('/api/HotelReservation/RemoveHotelReservationExpense', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Hotel Reservation Status Hotel Reservation
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updateHotelReservationStatus(data = {}, options = {}) {
    return api.post('/api/HotelReservation/UpdateHotelReservationStatus', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Reservation Date Hotel Reservation
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updateReservationDate(data = {}, options = {}) {
    return api.put('/api/HotelReservation/UpdateReservationDate', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Board Types Hotel Reservation
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getBoardTypes(data = {}, options = {}) {
    return api.get('/api/HotelReservation/GetBoardTypes', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Flight Ticket Types Hotel Reservation
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getFlightTicketTypes(data = {}, options = {}) {
    return api.get('/api/HotelReservation/GetFlightTicketTypes', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Expense Directions Types Hotel Reservation
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getExpenseDirectionsTypes(data = {}, options = {}) {
    return api.get('/api/HotelReservation/GetExpenseDirectionsTypes', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Guest List Hotel Reservation
   *
   * @param {object} [data]
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getGuestList(data = {}, options = {}) {
    return api.get('/api/HotelReservation/GetGuestList', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Hotel Player List Hotel Reservation
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getHotelPlayerList(data = {}, options = {}) {
    return api.get('/api/HotelReservation/GetHotelPlayerList', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Hotel Player Hotel Reservation
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {undefined} [data.date] - Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getHotelPlayer(data = {}, options = {}) {
    return api.get('/api/HotelReservation/GetHotelPlayer', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Hotel Reservation Widget Count Report Hotel Reservation
   *
   * @param {object} [data]
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getHotelReservationWidgetCountReport(data = {}, options = {}) {
    return api.get('/api/HotelReservation/GetHotelReservationWidgetCountReport', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Room Count By Days Hotel Reservation
   *
   * @param {object} [data]
   * @param {undefined} [data.startDate] - Start Date
   * @param {undefined} [data.endDate] - End Date
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getRoomCountByDays(data = {}, options = {}) {
    return api.get('/api/HotelReservation/GetRoomCountByDays', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Find Hotel Guest By Player Id Hotel Reservation
   *
   * @param {object} [data]
   * @param {undefined} [data.playerId] - Player Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  findHotelGuestByPlayerId(data = {}, options = {}) {
    return api.get('/api/HotelReservation/FindHotelGuestByPlayerId', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Reservation Status Hotel Reservation
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getReservationStatus(data = {}, options = {}) {
    return api.get('/api/HotelReservation/GetReservationStatus', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
