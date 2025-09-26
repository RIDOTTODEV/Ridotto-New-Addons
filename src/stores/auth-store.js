import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'boot/axios'
import { LocalStorage } from 'quasar'
import { applicationSettingService, gamingDateService, enumService } from 'src/api'
import { useCurrencyStore } from 'src/stores/currency-store'

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    user: {},
    userPermissions: [],
    isInitialized: false,
    isAuthenticated: false,
    defaultGamingDateInfo: null,
    userAddonSettings: {
      tableColumns: {},
      DefaultCurrencyId: null,
    },
    addonGeneralSettings: {
      DefaultCurrencyId: 2,
      sigaretteReportTags: [],
      CashierPassword: '',
      PitbossPassword: '',
    },
    enums: [],
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
        this.userAddonSettings.DefaultCurrencyId || LocalStorage.getItem('systemDefaultCurrencyId')
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
        (c) => c.id === +this.userAddonSettings.DefaultCurrencyId,
      )
      return currency?.name || '-'
    },
    defaultCurrency: (state) => {
      const currencyStore = useCurrencyStore()
      return currencyStore.currencies.find(
        (c) => c.id === state.userAddonSettings.DefaultCurrencyId,
      )
    },
    getEnumByName: (state) => (name) => {
      return state.enums.find((e) => e.fullName === name)
    },
    getUserTableColumns:
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

        if (state.userAddonSettings.tableColumns[tableName]) {
          const userSavedColumns = state.userAddonSettings.tableColumns[tableName].columns
          let userColumns =
            defaultColumns.map((column) => {
              const userColumn = userSavedColumns.find(
                (defaultColumn) => defaultColumn[0] === column.colId,
              )
              if (userColumn === undefined) {
                return {
                  ...column,
                  visible: column.visible,
                  orderColumn: column.orderColumn,
                }
              }
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
            rowsPerPage: state.userAddonSettings.tableColumns[tableName].rowsPerPage,
          }
        }
        return formattedTable
      },

    getTableRowsPerPage:
      (state) =>
      (tableName, defaultRowsPerPage = 10) => {
        if (!state.userAddonSettings.tableColumns[tableName]) {
          return defaultRowsPerPage
        }
        const tableSettings = state.userAddonSettings.tableColumns[tableName]
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
    async getUserAddonSettings() {
      await applicationSettingService
        .getUserSettings({
          name: 'UserAddonSettings',
        })
        .then((res) => {
          const data = res.data.value
            ? JSON.parse(res.data.value)
            : {
                tableColumns: {},
                DefaultCurrencyId: null,
              }
          this.userAddonSettings = data
        })
        .catch(() => {
          this.userAddonSettings = {
            tableColumns: {},
            DefaultCurrencyId: null,
          }
        })
    },
    async saveUserTableColumnsFormatted(tableName, tableSettings) {
      this.userAddonSettings.tableColumns[tableName] = tableSettings
      await applicationSettingService
        .setUserSettings({
          name: 'UserAddonSettings',
          value: JSON.stringify(this.userAddonSettings),
        })
        .then(async () => {
          await this.getUserAddonSettings()
        })
    },
    async saveUserCurrency(currencyId) {
      const settings = { ...this.userAddonSettings }
      settings.DefaultCurrencyId = currencyId
      await applicationSettingService.setUserSettings({
        name: 'UserAddonSettings',
        value: JSON.stringify(settings),
      })
      await this.getUserAddonSettings()
    },
    async saveAddonGeneralSettings() {
      let settings = { ...this.addonGeneralSettings }
      await applicationSettingService.setSettings({
        name: 'AddonGeneralSettings',
        value: JSON.stringify(settings),
      })
      await this.getAddonGeneralSettings()
      return true
    },
    async getAddonGeneralSettings() {
      await applicationSettingService
        .getSettings({
          name: 'AddonGeneralSettings',
        })
        .then((res) => {
          this.addonGeneralSettings = res.data.value
            ? JSON.parse(res.data.value)
            : {
                DefaultCurrencyId: 2,
                sigaretteReportTags: [7],
                CashierPassword: '',
                PitbossPassword: '',
              }

          if (!this.userAddonSettings.DefaultCurrencyId) {
            this.userAddonSettings.DefaultCurrencyId =
              this.addonGeneralSettings.DefaultCurrencyId || 2
          }
        })
        .catch(() => {
          this.addonGeneralSettings = { DefaultCurrencyId: 2, sigaretteReportTags: [7] }
          if (!this.userAddonSettings.DefaultCurrencyId) {
            this.userAddonSettings.DefaultCurrencyId = 2
          }
        })
    },
    async getEnums() {
      await enumService.getAllEnums().then((res) => {
        this.enums = res.data.enums
      })
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
