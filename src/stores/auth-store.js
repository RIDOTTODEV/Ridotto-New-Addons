import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'boot/axios'
import { LocalStorage } from 'quasar'
import { applicationSettingService, gamingDateService } from 'src/api'
import { useCurrencyStore } from 'src/stores/currency-store'

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    user: {},
    userPermissions: [],
    isAuthenticated: false,
    defaultGamingDateInfo: null,
    userPanelSettings: {
      tableColumns: {},
      DefaultCurrencyId: 2,
    },
    isInitialized: false,
    defaultSettings: {
      DefaultCurrencyId: 2,
      sigaretteReportTags: [],
    },
  }),
  getters: {
    hasPermission: (state) => (permission) => {
      return state.userPermissions.includes(permission) || true
      //return state.userPermissions.includes(permission) || false
    },
    isInspector: (state) => {
      if (state.userPermissions.length === 0) {
        return false
      }
      return (
        state.userPermissions?.every((permission) => permission.startsWith('Addon.Inspector')) ||
        false
      )
    },
    isAuthorityUser: (state) => {
      const distictRoles = ['Addon Pit', 'Addon Inspector']
      const isDistricted = distictRoles.some((role) => state.user.details?.role === role)
      return !isDistricted
    },
    getUserNameSurname: (state) => {
      return {
        fullName: state.user.profile?.name,
        email: state.user.profile?.emailAddress,
        shortName: state.user.profile?.name,
      }
    },
    getDefaultCurrencyId() {
      const defaultCurrencyId =
        this.defaultSettings.DefaultCurrencyId || LocalStorage.getItem('systemDefaultCurrencyId')
      return defaultCurrencyId
    },
    getDefaultGamingDateId() {
      return this.defaultGamingDateInfo?.id
    },
    getDefaultCurrencyName() {
      const currencyStore = useCurrencyStore()
      if (currencyStore.currencies.length === 0) {
        return '-'
      }
      const currency = currencyStore.currencies.find(
        (c) => c.id === +this.defaultSettings.DefaultCurrencyId,
      )
      return currency?.name || '-'
    },
    defaultCurrency: (state) => {
      const currencyStore = useCurrencyStore()
      return currencyStore.currencies.find((c) => c.id === state.defaultSettings.DefaultCurrencyId)
    },

    getUserTableColumnsFormatted:
      (state) =>
      (tableName, defaultColumns, defaultRowsPerPage = 10) => {
        let formattedTable = {
          columns: defaultColumns,
          rowsPerPage: defaultRowsPerPage,
          visibleColumns: defaultColumns.map((column) => column.name),
        }
        if (!tableName) {
          return formattedTable
        }
        if (state.userPanelSettings.tableColumns[tableName]) {
          const userSavedColumns = state.userPanelSettings.tableColumns[tableName].columns
          let userColumns =
            defaultColumns.map((column) => {
              const userColumn = userSavedColumns.find(
                (defaultColumn) => defaultColumn[0] === column.colId,
              )
              return {
                ...column,
                visible: userColumn[2] === 1,
                orderColumn: userColumn[1],
              }
            }) || []
          userColumns = userColumns.sort((a, b) => a.orderColumn - b.orderColumn)
          return {
            columns: userColumns,
            visibleColumns: userColumns
              .filter((column) => column.visible)
              .map((column) => column.name),
            rowsPerPage: state.userPanelSettings.tableColumns[tableName].rowsPerPage,
          }
        }
        return formattedTable
      },

    getTableRowsPerPage:
      (state) =>
      (tableName, defaultRowsPerPage = 10) => {
        if (!state.userPanelSettings.tableColumns[tableName]) {
          return defaultRowsPerPage
        }
        const tableSettings = state.userPanelSettings.tableColumns[tableName]
        return tableSettings?.rowsPerPage || defaultRowsPerPage
      },
  },
  actions: {
    setIsInitialized(value) {
      this.isInitialized = value
    },
    async setCurrentUser(user) {
      this.user = { ...user }
      api.defaults.headers.common['Authorization'] = `${user.token_type} ${user.access_token}`
      this.isAuthenticated = true
      await this.setUserPermissions()
    },
    async setUserPermissions() {
      const permissionsType = typeof this.user.permissions
      if (permissionsType === 'string') {
        this.userPermissions = [this.user.permissions]
      } else {
        this.userPermissions = this.user.permissions
      }

      const permissions = this.user.profile.permissions || []
      const PREFIX = 'Addon'
      this.userPermissions = permissions.filter((permission) => permission.startsWith(PREFIX))
    },
    async fetchDefaultGamingDateInfo() {
      await gamingDateService
        .getCurrentGamingDateInfo()
        .then((res) => {
          this.defaultGamingDateInfo = res.data
        })
        .catch((err) => {
          console.log(err)
        })
    },
    async getUserPanelSettings() {
      await applicationSettingService
        .getUserSettings({
          name: 'AddonSettings',
        })
        .then((res) => {
          const data = res.data.value
            ? JSON.parse(res.data.value)
            : {
                tableColumns: {},
                DefaultCurrencyId: 2,
              }
          this.userPanelSettings = data
        })
        .catch((err) => {
          console.log(err)
        })
    },
    async saveUserTableColumnsFormatted(tableName, tableSettings) {
      this.userPanelSettings.tableColumns[tableName] = tableSettings
      await applicationSettingService
        .setUserSettings({
          name: 'AddonSettings',
          value: JSON.stringify(this.userPanelSettings),
        })
        .then(async () => {
          await this.getUserPanelSettings()
        })
    },
    async saveDefaultSettings(reloadPage = false) {
      let settings = { ...this.defaultSettings }
      await applicationSettingService.setUserSettings({
        name: 'AddonDefaultSettings',
        value: JSON.stringify(settings),
      })

      if (reloadPage && reloadPage === true) {
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        await this.getDefaultSettings()
      }
    },
    async getDefaultSettings() {
      await applicationSettingService
        .getUserSettings({
          name: 'AddonDefaultSettings',
        })
        .then((res) => {
          this.defaultSettings = res.data.value
            ? JSON.parse(res.data.value)
            : { DefaultCurrencyId: 2 }
        })
        .catch(() => {
          this.defaultSettings = { DefaultCurrencyId: 2, sigaretteReportTags: [7] }
        })
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
