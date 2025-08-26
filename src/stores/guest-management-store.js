import { defineStore, acceptHMRUpdate } from 'pinia'
import {
  giftService,
  roomTypeService,
  playerCategoryService,
  expenseParameterService,
  expenseService,
  hotelReservationService,
} from 'src/api'
import { useAuthStore } from './auth-store'
export const useGuestManagementStore = defineStore('guestManagementStore', {
  state: () => ({
    gifts: [],
    roomTypes: [],
    playerCategories: [],
    expenseParameters: [],
    hotelGuestList: [],
    expenseTypes: [],
    visitorCategories: [],
    flightTicketTypes: [],
    boardTypes: [],
  }),
  getters: {},
  actions: {
    async fetchGifts(params) {
      const { data } = await giftService.getAll(params)
      this.gifts = data
      return data
    },
    async getGift(params) {
      const { data } = await giftService.get(params)
      return data
    },
    async createGift(params) {
      const { data } = await giftService.create(params)
      return data
    },
    async updateGift(params) {
      const { data } = await giftService.update(params)
      return data
    },
    async deleteGift(params) {
      const { data } = await giftService.delete(params)
      return data
    },
    async fetchRoomTypes(params) {
      const { data } = await roomTypeService.getAll(params)
      this.roomTypes = data.data
      return data
    },
    async getRoomType(params) {
      const { data } = await roomTypeService.get(params)
      return data
    },
    async createRoomType(params) {
      const { data } = await roomTypeService.create(params)
      return data
    },
    async updateRoomType(params) {
      const { data } = await roomTypeService.update(params)
      return data
    },
    async deleteRoomType(params) {
      const { data } = await roomTypeService.delete(params)
      return data
    },
    async fetchPlayerCategories(params) {
      const { data } = await playerCategoryService.getAll(params)
      this.playerCategories = data
      return data
    },
    async getPlayerCategory(params) {
      const { data } = await playerCategoryService.get(params)
      return data
    },
    async createPlayerCategory(params) {
      const { data } = await playerCategoryService.create(params)
      return data
    },
    async updatePlayerCategory(params) {
      const { data } = await playerCategoryService.update(params)
      return data
    },
    async deletePlayerCategory(params) {
      const { data } = await playerCategoryService.delete(params)
      return data
    },
    async fetchExpenseParameters(params) {
      const { data } = await expenseParameterService.getAll(params)
      this.expenseParameters = data.data
      return data
    },
    async getExpenseParameter(params) {
      const { data } = await expenseParameterService.get(params)
      return data
    },
    async createExpenseParameter(params) {
      const { data } = await expenseParameterService.create(params)
      return data
    },
    async updateExpenseParameter(params) {
      const { data } = await expenseParameterService.update(params)
      return data
    },
    async deleteExpenseParameter(params) {
      const { data } = await expenseParameterService.delete(params)
      return data
    },
    async fetchExpenseTypes(params) {
      const { data } = await expenseParameterService.getExpenseTypes(params)
      this.expenseTypes = data
        ? Object.keys(data).map((key) => {
            return {
              label: data[key],
              value: data[key],
            }
          })
        : []
      return this.expenseTypes
    },
    async fetchExpenses(params) {
      const { data } = await expenseService.getAll(params)
      return data
    },
    async updateHotelFlightInfo(params) {
      const { data } = await hotelReservationService.updateHotelFlightInfo(params)
      return data
    },
    async addHotelReservationExpense(params) {
      const { data } = await hotelReservationService.addHotelReservationExpense(params)
      return data
    },
    async addHotelReservationPlayer(params) {
      const { data } = await hotelReservationService.addHotelReservationPlayer(params)
      return data
    },
    async deleteHotelReservationPlayer(params) {
      const { data } = await hotelReservationService.deleteHotelReservationPlayer(params)
      return data
    },
    async fetchVisitorCategories(params) {
      const { data } = await playerCategoryService.getAll(params)
      this.visitorCategories = data.data
      return data
    },
    async fetchFlightTicketTypes(params) {
      const { data } = await hotelReservationService.getFlightTicketTypes(params)
      this.flightTicketTypes = data
        ? Object.keys(data).map((key) => {
            return {
              label: data[key],
              value: data[key],
            }
          })
        : []
      return this.flightTicketTypes
    },
    async fetchBoardTypes(params) {
      const { data } = await hotelReservationService.getBoardTypes(params)
      this.boardTypes = data
        ? Object.keys(data).map((key) => {
            return {
              label: data[key],
              value: data[key],
            }
          })
        : []
      return data
    },
    async removeHotelReservationExpense(params) {
      const { data } = await hotelReservationService.removeHotelReservationExpense(params)
      return data
    },
    async fetchHotelReservations(params) {
      const authStore = useAuthStore()
      const payload = {
        ...params,
        GamingDateId: authStore.defaultGamingDateInfo.id,
      }
      const { data } = await hotelReservationService.getAll(payload)
      this.hotelGuestList = data.data
      return data
    },
    async deleteHotelReservation(params) {
      const { data } = await hotelReservationService.deleteReservation(params)
      return data
    },
    async updateHotelReservation(params) {
      const { data } = await hotelReservationService.updateReservation(params)
      return data
    },
    async createHotelReservation(params) {
      const { data } = await hotelReservationService.createReservation(params)
      return data
    },
    async getHotelPlayerList(params) {
      const { data } = await hotelReservationService.getHotelPlayerList(params)
      return data
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGuestManagementStore, import.meta.hot))
}
