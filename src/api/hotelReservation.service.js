import { api } from 'src/boot/axios'


export const hotelReservationService = {
  name: 'HotelReservation',
  /**
   * Get All Hotel Reservation
   *
   * @param {object} [data]
   * @param {undefined} [data.status] - Status
   * @param {undefined} [data.gamingDateId] - Gaming Date Id
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
  }
}
