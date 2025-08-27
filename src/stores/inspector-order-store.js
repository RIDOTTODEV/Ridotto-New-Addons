import { defineStore, acceptHMRUpdate } from 'pinia'
import { posApi } from 'src/boot/axios'
import { i18n } from 'boot/i18n'
import { fireNotify } from 'src/helpers/helpers'
export const useInspectorOrderStore = defineStore('inspectorOrderStore', {
  state: () => ({
    posSettings: null,
    terminal: null,
    terminalMenu: [],
    portionSets: [],
    extraSets: [],
  }),
  getters: {
    getPortionSet: (state) => (id) => {
      return state.portionSets.find((portionSet) => portionSet.id === id)
    },
    getExtraSet: (state) => (id) => {
      return state.extraSets.find((extraSet) => extraSet.id === id)
    },
    showCancelOrderBtn: (state) => (orderTagId) => {
      return state.terminal.restore?.includes(orderTagId)
    },
  },
  actions: {
    async fetchPosSettings() {
      await posApi
        .get('/api/PosSetting/GetAll')
        .then((res) => {
          this.posSettings = res.data.data[0]
          this.fetchTerminalByUid()
        })
        .catch((err) => {
          fireNotify('error', i18n.t('fetch_error'), err.response.data.message)
        })
    },
    async fetchTerminalByUid() {
      await posApi
        .get(`/api/Terminal/GetTerminalSettings?uid=${this.posSettings?.inspectorTerminalUid}`)
        .then((res) => {
          this.terminal = res.data
          this.fetchTerminalMenus()
          this.fetchPortionSets()
        })
        .catch((err) => {
          fireNotify('error', i18n.t('fetch_error'), err.response.data.message)
        })
    },
    async fetchTerminalMenus() {
      await posApi
        .get(`/api/Terminal/GetTerminalMenu?uid=${this.terminal?.uid}`)
        .then((res) => {
          this.terminalMenu = res.data
        })
        .catch((err) => {
          fireNotify('error', i18n.global.t('fetch_error'), err.response.data.message)
        })
    },
    async fetchPortionSets() {
      await posApi
        .get(`/api/PortionSet/GetAll`, {
          params: {
            Take: 999,
          },
        })
        .then((res) => {
          this.portionSets = res.data.data
        })
        .catch(() => {})
    },
    async searchProducts(params) {
      return await posApi.get('/api/Product/GetSearchProducts', { params })
    },
    async createOrder(order) {
      return await posApi
        .post('/api/Order/Create', order)
        .then(() => {
          fireNotify(i18n.global.t('orderCreated'), 'created', 'bottom-right', 1500, 'positive')
          return true
        })
        .catch(() => {
          fireNotify(i18n.global.t('orderNotCreated'), 'created', 'bottom-right', 1500, 'negative')
          return false
        })
    },
    async fetchPlayerOrders(params) {
      return await posApi.get('/api/Order/GetAll', { params })
    },
    async cancelOrderDetail(params) {
      return await posApi.post('/api/Order/UpdateOrderDetailStatus', params).then((res) => {
        fireNotify(
          i18n.global.t('orderItemCancelled'),
          'cancelled',
          'bottom-right',
          1500,
          'positive',
        )
        return res
      })
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useInspectorOrderStore, import.meta.hot))
}
