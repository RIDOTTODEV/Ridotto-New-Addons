import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'boot/axios'
import { LocalStorage } from 'quasar'
import { errorHandle, fireNotify } from 'src/helpers/helpers'

import { i18n } from 'boot/i18n'
import { useAuthStore } from 'src/stores/auth-store'

export const useInspectorStore = defineStore('inspectorStore', {
  state: () => ({
    tables: [],
    currentTable: null,
    tableFloatDenoms: null,
    inspectorTables: [],
    tableSitPlayers: [],
    currentPlayer: null,
    currentPlayerChipHistory: [],
    currentPlayerCashHistory: [],
  }),
  getters: {
    getActiveTablesCount() {
      return this.tables.filter((t) => t.active).length
    },
    getPassiveTablesCount() {
      return this.tables.filter((t) => !t.active).length
    },
    getTableFloatDenomsAsGroup() {
      const group = this.tableFloatDenoms?.reduce((acc, curr) => {
        if (!acc[curr.chipType]) {
          acc[curr.chipType] = []
        }
        acc[curr.chipType].push(curr)
        return acc
      }, {})
      return group
    },
  },
  actions: {
    async validateSavedTables() {
      let existCurrentTable = null
      const savedTables = await api.get('/api/Inspector/GetInspectorFollowedTables').then((res) => {
        return res.data
      })
      const savedCurrentTable = LocalStorage.getItem('currentTable') || null
      if (savedTables) {
        this.inspectorTables = this.tables.filter((t) => {
          return !!savedTables.find((table) => table.tableId === t.id)
        })

        existCurrentTable = !!savedTables.find((table) => {
          if (table.tableId === savedCurrentTable?.id) {
            return this.tables.find((t) => t.id === table.tableId)
          }
          return false
        })
      }
      return existCurrentTable ? savedCurrentTable : this.inspectorTables[0] || null
    },
    async inspectorFollowTable(tableId) {
      return await api
        .post('/api/Inspector/FollowTable', { tableId })
        .then(() => {
          return true
        })
        .catch(() => {
          return false
        })
    },
    async inspectorUnfollowTable(tableId) {
      return await api
        .post('/api/Inspector/UnfollowTable', { tableId })
        .then(() => {
          return true
        })
        .catch(() => {
          return false
        })
    },
    async fetchTable(tableId) {
      await api
        .get(`/api/Table/Get?Id=${tableId}`)
        .then((res) => {
          this.currentTable = res.data
        })
        .catch((err) => {
          errorHandle(err)
        })
    },
    async fetchTables(params) {
      await api
        .get('/api/Table/GetAll', { params: params })
        .then((res) => {
          this.tables = res.data.data
        })
        .catch((err) => {
          this.tables = [{ id: 1, name: 'Test Table 1', gameId: 1 }]
          errorHandle(err)
        })
    },
    async fetchCurrentTableFloatDenominations() {
      await api.get(`/api/TableFloat/GeTAll?TableId=${this.currentTable?.id}`).then((res) => {
        this.tableFloatDenoms = res.data[0]?.tableFloatDenoms || []
      })
    },
    async playerLgPlayerChipInOut(data) {
      await api
        .post('/api/PlayerLg/PlayerChipInOut', data)
        .then(() => {
          fireNotify(
            i18n.global.t('createdSuccessfully', {
              name: data?.chipTransactionType,
            }),
            'created',
            3000,
            'positive',
          )
        })
        .catch((err) => {
          errorHandle(err)
        })
    },
    async playerLgPlayerMarkerInOut(data) {
      await api
        .post('/api/PlayerLg/PlayerMarkerInOut', data)
        .then(() => {
          fireNotify(
            i18n.global.t('createdSuccessfully', { name: 'Marker In' }),
            'created',
            3000,
            'positive',
          )
        })
        .catch((err) => {
          errorHandle(err)
        })
    },
    async playerLgPlayerCashIn(data) {
      await api
        .post('/api/PlayerLg/PlayerCashIn', data)
        .then(() => {
          fireNotify(
            i18n.global.t('createdSuccessfully', { name: 'Cash In' }),
            'created',
            3000,
            'positive',
          )
        })
        .catch((err) => {
          errorHandle(err)
        })
    },
    async timeInPLayer(data) {
      return await api
        .post('/api/PlayerLg/PlayerSit', data)
        .then(() => {
          return true
        })
        .catch((err) => {
          errorHandle(err)
        })
    },
    async fetchSitPlayers() {
      const authStore = useAuthStore()

      await api
        .get('/api/PlayerLg/GetSitPlayers', {
          params: {
            tableId: this.currentTable?.id,
            gamingDateId: authStore.getDefaultGamingDateId,
          },
        })
        .then((res) => {
          this.tableSitPlayers = res.data || []
        })
        .catch((err) => {
          errorHandle(err)
        })
    },
    async fetchPlayers(searchString) {
      return await api
        .get(`/api/Player/SearchReturnWithProfilePhotos?searchString=${searchString}`)
        .then((res) => {
          return res.data
        })
        .catch((err) => {
          errorHandle(err)
        })
    },
    async playerTimePauseOrResume(data) {
      return await api
        .post('/api/PlayerLg/PlayerPauseOrResume', data)
        .then(() => {
          fireNotify(i18n.global.t('playerPauseOrResumeSuccessfully'), 'updated', 3000, 'positive')
          return true
        })
        .catch((err) => {
          errorHandle(err)
        })
    },
    async definePlayerAvgBet(data) {
      return await api
        .post('/api/PlayerLg/UpdatePlayerAvgBet', data)
        .then(() => {
          fireNotify(
            i18n.global.t('updatedSuccessfully', {
              name: 'Player Avg Bet',
            }),
            'updated',
            3000,
            'positive',
          )
          return true
        })
        .catch((err) => {
          errorHandle(err)
        })
    },
    async timeOutPlayer(data) {
      return await api
        .post('/api/PlayerLg/PlayerLeave', data)
        .then(() => {
          return true
        })
        .catch((err) => {
          errorHandle(err)
        })
    },
    async fetchChipHistory(params) {
      return await api
        .get('/api/PlayerLg/GetChipDropHistories', { params: params })
        .then((res) => {
          return res.data
        })
        .catch((err) => {
          errorHandle(err)
        })
    },
    async fetchCurrentPlayerChipHistory(params) {
      return await api
        .get('/api/PlayerLg/GetChipDropHistories', { params: params })
        .then((res) => {
          this.currentPlayerChipHistory = res.data
        })
        .catch((err) => {
          errorHandle(err)
        })
    },
    async fetchCurrentPlayerCashHistory(params) {
      return await api
        .get('/api/PlayerLg/GetDropHistories', { params: params })
        .then((res) => {
          this.currentPlayerCashHistory = res.data
        })
        .catch((err) => {
          errorHandle(err)
        })
    },
    async fetchChipHistoryDetail(params) {
      return await api
        .get('/api/PlayerLg/GetChipDropDetailHistories', { params: params })
        .then((res) => {
          return res.data
        })
        .catch((err) => {
          errorHandle(err)
        })
    },
    async fetchCashHistory(params) {
      return await api
        .get('/api/PlayerLg/GetDropHistories', { params: params })
        .then((res) => {
          return res.data
        })
        .catch((err) => {
          errorHandle(err)
        })
    },
    async fetchTableReport(params) {
      return await api
        .get('/api/PlayerLg/GetTableReport', { params: params })
        .then((res) => {
          return res.data
        })
        .catch((err) => {
          errorHandle(err)
        })
    },
    async playerSitDelete(data) {
      return await api
        .delete('/api/PlayerLg/PlayerSitDelete', { params: data })
        .then((res) => {
          return res.data
        })
        .catch((err) => {
          errorHandle(err)
        })
    },
    async getTableTotalDrop(params) {
      return await api
        .get('/api/PlayerLg/GetTableTotalDrop', { params: params })
        .then((res) => {
          return res.data
        })
        .catch((err) => {
          errorHandle(err)
        })
    },
    async getPlayerLgInfo(params) {
      return await api.get('/api/PlayerLg/GetPlayerLgInfo', { params: params }).then((res) => {
        return res.data
      })
    },
    async playerSitTodayHistory(params) {
      return await api
        .get('/api/PlayerLg/PlayerSitTodayHistory', { params: params })
        .then((res) => {
          return res.data
        })
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useInspectorStore, import.meta.hot))
}
