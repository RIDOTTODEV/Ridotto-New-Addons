import { api } from 'src/boot/axios'


export const slotMachineService = {
  name: 'SlotMachine',
  /**
   * Get Last Empty Date Slot Machine
   *
   * @param {object} [data]
   * @param {undefined} [data.floorNo] - Floor No
   * @param {undefined} [data.slotInterfaceId] - Slot Interface Id
   * @param {undefined} [data.slotMachineId] - Slot Machine Id
   * @param {undefined} [data.billAcceptorId] - Bill Acceptor Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getLastEmptyDate(data = {}, options = {}) {
    return api.get('/api/SlotMachine/GetLastEmptyDate', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Copy Machine Slot Machine
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  copyMachine(data = {}, options = {}) {
    return api.post('/api/SlotMachine/CopyMachine', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Gm With Online Players Slot Machine
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getGmWithOnlinePlayers(data = {}, options = {}) {
    return api.post('/api/SlotMachine/GetGmWithOnlinePlayers', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get By Mac Address Slot Machine
   *
   * @param {object} [data]
   * @param {undefined} [data.macAddress] - Mac Address
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getByMacAddress(data = {}, options = {}) {
    return api.get('/api/SlotMachine/GetByMacAddress', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Slot Machines Ddl Slot Machine
   *
   * @param {object} [data]
   * @param {undefined} [data.slotBrandId] - Slot Brand Id
   * @param {undefined} [data.isActive] - Is Active
   * @param {undefined} [data.slotModelId] - Slot Model Id
   * @param {undefined} [data.sorting] - Sorting
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getSlotMachinesDdl(data = {}, options = {}) {
    return api.get('/api/SlotMachine/GetSlotMachinesDdl', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Gms With Floor Map Slot Machine
   *
   * @param {object} [data]
   * @param {undefined} [data.mapped] - Mapped
   * @param {undefined} [data.isActive] - Is Active
   * @param {undefined} [data.floorId] - Floor Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getGmsWithFloorMap(data = {}, options = {}) {
    return api.get('/api/SlotMachine/GetGmsWithFloorMap', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Slot Machines For Bulk Actions Slot Machine
   *
   * @param {object} [data]
   * @param {undefined} [data.casinoId] - Casino Id
   * @param {undefined} [data.isActive] - Is Active
   * @param {undefined} [data.sorting] - Sorting
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getSlotMachinesForBulkActions(data = {}, options = {}) {
    return api.get('/api/SlotMachine/GetSlotMachinesForBulkActions', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Slot Machines Games Slot Machine
   *
   * @param {object} [data]
   * @param {undefined} data.slotMachineIds - Slot Machine Ids
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getSlotMachinesGames(data = {}, options = {}) {
    return api.get('/api/SlotMachine/GetSlotMachinesGames', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Slot Machine Tech Details Slot Machine
   *
   * @param {object} [data]
   * @param {undefined} [data.slotMachineId] - Slot Machine Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getSlotMachineTechDetails(data = {}, options = {}) {
    return api.get('/api/SlotMachine/GetSlotMachineTechDetails', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Slot Machine Sas Config Slot Machine
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updateSlotMachineSasConfig(data = {}, options = {}) {
    return api.post('/api/SlotMachine/UpdateSlotMachineSasConfig', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Gm Accepted Currencies Slot Machine
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updateGmAcceptedCurrencies(data = {}, options = {}) {
    return api.post('/api/SlotMachine/UpdateGmAcceptedCurrencies', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Slot Machine Ip Ddl Slot Machine
   *
   * @param {object} [data]
   * @param {undefined} [data.slotBrandId] - Slot Brand Id
   * @param {undefined} [data.casinoId] - Casino Id
   * @param {undefined} [data.isActive] - Is Active
   * @param {undefined} [data.slotModelId] - Slot Model Id
   * @param {undefined} [data.sorting] - Sorting
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  getSlotMachineIpDdl(data = {}, options = {}) {
    return api.get('/api/SlotMachine/GetSlotMachineIpDdl', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Set Gm Slot Bank Slot Machine
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  setGmSlotBank(data = {}, options = {}) {
    return api.post('/api/SlotMachine/SetGmSlotBank', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Set Gm Slot Brand Slot Machine
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  setGmSlotBrand(data = {}, options = {}) {
    return api.post('/api/SlotMachine/SetGmSlotBrand', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Set Gm Slot Model Slot Machine
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  setGmSlotModel(data = {}, options = {}) {
    return api.post('/api/SlotMachine/SetGmSlotModel', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Set Gm Meter Group Slot Machine
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  setGmMeterGroup(data = {}, options = {}) {
    return api.post('/api/SlotMachine/SetGmMeterGroup', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Set Gm Jackpot Group Slot Machine
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  setGmJackpotGroup(data = {}, options = {}) {
    return api.post('/api/SlotMachine/SetGmJackpotGroup', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Set Gm Special Code2 Slot Machine
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  setGmSpecialCode2(data = {}, options = {}) {
    return api.post('/api/SlotMachine/SetGmSpecialCode2', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Slot Machine Detail Slot Machine
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updateSlotMachineDetail(data = {}, options = {}) {
    return api.post('/api/SlotMachine/UpdateSlotMachineDetail', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Slot Interface Detail Slot Machine
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updateSlotInterfaceDetail(data = {}, options = {}) {
    return api.post('/api/SlotMachine/UpdateSlotInterfaceDetail', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Slot Ui Detail Slot Machine
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updateSlotUiDetail(data = {}, options = {}) {
    return api.post('/api/SlotMachine/UpdateSlotUiDetail', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Bill Acceptor Detail Slot Machine
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updateBillAcceptorDetail(data = {}, options = {}) {
    return api.post('/api/SlotMachine/UpdateBillAcceptorDetail', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Card Reader Detail Slot Machine
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updateCardReaderDetail(data = {}, options = {}) {
    return api.post('/api/SlotMachine/UpdateCardReaderDetail', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Ticket Printer Detail Slot Machine
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  updateTicketPrinterDetail(data = {}, options = {}) {
    return api.post('/api/SlotMachine/UpdateTicketPrinterDetail', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get Slot Machine
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  get(data = {}, options = {}) {
    return api.get('/api/SlotMachine/Get', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Get All Slot Machine
   *
   * @param {object} [data]
   * @param {undefined} [data.serialNo] - Serial No
   * @param {undefined} [data.specialCode] - Special Code
   * @param {undefined} [data.slotInterfaceId] - Slot Interface Id
   * @param {undefined} [data.slotBrandId] - Slot Brand Id
   * @param {undefined} [data.casinoId] - Casino Id
   * @param {undefined} [data.floorNo] - Floor No
   * @param {undefined} [data.isActive] - Is Active
   * @param {undefined} [data.slotModelId] - Slot Model Id
   * @param {undefined} [data.cageBalanceGroupId] - Cage Balance Group Id
   * @param {undefined} [data.jackpotGroupId] - Jackpot Group Id
   * @param {undefined} [data.meterGroupId] - Meter Group Id
   * @param {undefined} [data.gameTypeId] - Game Type Id
   * @param {undefined} [data.maxBet] - Max Bet
   * @param {undefined} [data.maxPay] - Max Pay
   * @param {undefined} [data.numberOfLines] - Number Of Lines
   * @param {undefined} [data.activateDateStart] - Activate Date Start
   * @param {undefined} [data.activateDateEnd] - Activate Date End
   * @param {undefined} [data.productionYear] - Production Year
   * @param {undefined} [data.cabinetTypeId] - Cabinet Type Id
   * @param {undefined} [data.balancer] - Balancer
   * @param {undefined} [data.slotBankId] - Slot Bank Id
   * @param {undefined} [data.sasVersion] - Sas Version
   * @param {undefined} [data.slotBannerSetId] - Slot Banner Set Id
   * @param {undefined} [data.posTerminalId] - Pos Terminal Id
   * @param {undefined} [data.posTableNo] - Pos Table No
   * @param {undefined} [data.registerAftOnStartup] - Register Aft On Startup
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
    return api.get('/api/SlotMachine/GetAll', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Create Slot Machine
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  create(data = {}, options = {}) {
    return api.post('/api/SlotMachine/Create', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Update Slot Machine
   *
   * @param {object} [data]
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  update(data = {}, options = {}) {
    return api.post('/api/SlotMachine/Update', data, options)
      .then((response) => response)
      .catch((error) => error)
  },
  /**
   * Delete Slot Machine
   *
   * @param {object} [data]
   * @param {undefined} [data.id] - Id
   * @param {object} [options] - Axios Options
   * @param {object} [options.headers] - Request Headers
   * @param {string} [options.responseType] - Response Type
   */
  delete(data = {}, options = {}) {
    return api.delete('/api/SlotMachine/Delete', { params: data, ...options })
      .then((response) => response)
      .catch((error) => error)
  }
}
