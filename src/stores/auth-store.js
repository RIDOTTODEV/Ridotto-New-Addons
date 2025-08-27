import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'boot/axios'
import { LocalStorage } from 'quasar'
import { applicationSettingService, gamingDateService } from 'src/api'
import { useCurrencyStore } from 'src/stores/currency-store'
import { Loading } from 'quasar'
export const useAuthStore = defineStore('authStore', {
  state: () => ({
    user: {},
    userPermissions: [],
    isAuthenticated: false,
    defaultGamingDateInfo: null,
    userPanelSettings: {},
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
        fullName: state.user.details?.name,
        email: state.user.details?.emailAddress,
        shortName: state.user.details?.name,
      }
    },
    getDefaultCurrencyId() {
      const defaultCurrencyId =
        this.userPanelSettings.DefaultCurrencyId || LocalStorage.getItem('systemDefaultCurrencyId')
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
        (c) => c.id === +this.userPanelSettings.DefaultCurrencyId,
      )
      return currency?.name || '-'
    },
    defaultCurrency: (state) => {
      const currencyStore = useCurrencyStore()
      return currencyStore.currencies.find((c) => c.id === state.defaultCurrencyId)
    },
    getUserTableColumns: (state) => (tableName, defaultColumns) => {
      if (!tableName) {
        return defaultColumns
      }
      if (Object.keys(state.userPanelSettings).length === 0) {
        return defaultColumns
      }
      if (!state.userPanelSettings.tableColumns) {
        return defaultColumns
      }
      const userColumns = state.userPanelSettings.tableColumns[tableName]?.columns

      if (userColumns) {
        return defaultColumns.map((column) => {
          const columnProperties = userColumns.find(
            (defaultColumn) => defaultColumn.name === column.name,
          )
          if (columnProperties === undefined) {
            return {
              ...column,
              visible: true,
            }
          }
          const findIndex = defaultColumns.findIndex(
            (defaultColumn) => defaultColumn.name === columnProperties.name,
          )
          return {
            ...defaultColumns[findIndex],
            visible: column.visible,
          }
        })
      }
      return defaultColumns
    },
    getUserTableVisibleColumns: (state) => (tableName, defaultColumns) => {
      if (Object.keys(state.userPanelSettings).length === 0) {
        return defaultColumns.map((column) => column.name)
      }
      if (!state.userPanelSettings.tableColumns) {
        return defaultColumns.map((column) => column.name)
      }
      if (!state.userPanelSettings.tableColumns[tableName]) {
        return defaultColumns.map((column) => column.name)
      }

      const userColumns = state.userPanelSettings.tableColumns[tableName]?.columns

      if (userColumns) {
        return userColumns.filter((column) => column.visible).map((column) => column.name)
      }
      return defaultColumns.map((column) => column.name)
    },
    getTableRowsPerPage:
      (state) =>
      (tableName, defaultRowsPerPage = 10) => {
        if (Object.keys(state.userPanelSettings).length === 0) {
          return defaultRowsPerPage
        }
        if (!state.userPanelSettings.tableColumns) {
          return defaultRowsPerPage
        }
        if (!state.userPanelSettings.tableColumns[tableName]) {
          return defaultRowsPerPage
        }
        const tableSettings = state.userPanelSettings.tableColumns[tableName]
        return tableSettings?.rowsPerPage || defaultRowsPerPage
      },
  },
  actions: {
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
    setUserDefaultCurrency(currency, reloadPage = false) {
      if (!currency?.id) {
        return
      }

      if (this.userPanelSettings.DefaultCurrencyId !== currency.id) {
        this.userPanelSettings.DefaultCurrencyId = currency.id
        applicationSettingService
          .setUserSettings({
            name: 'AddonSettings',
            value: JSON.stringify({ ...this.userPanelSettings, DefaultCurrencyId: currency.id }),
          })
          .then(() => {
            console.log('success')
          })
          .catch((err) => {
            console.log(err)
          })
        const currencyStore = useCurrencyStore()
        currencyStore.setDefaultCurrency(this.userPanelSettings.DefaultCurrencyId)
        if (reloadPage) {
          Loading.show({
            message: 'Updating currency...',
          })
          setTimeout(() => {
            Loading.hide()
            window.location.reload()
          }, 2000)
        }
      }

      LocalStorage.set('systemDefaultCurrencyId', currency.id)
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
    async saveUserTableColumns(tableName, visibleColumnsNames, columns, rowsPerPage = 10) {
      let columnsToSave = columns
        .map((column) => {
          let index = visibleColumnsNames.indexOf(column.name)
          return {
            name: column.name,
            visible: index !== -1,
            order: index !== -1 ? index : visibleColumnsNames.length,
          }
        })
        .sort((a, b) => a.order - b.order)
      if (!this.userPanelSettings.tableColumns[tableName]) {
        this.userPanelSettings.tableColumns[tableName] = {}
      }
      this.userPanelSettings.tableColumns[tableName].columns = columnsToSave
      this.userPanelSettings.tableColumns[tableName].rowsPerPage = rowsPerPage

      applicationSettingService
        .setUserSettings({
          name: 'AddonSettings',
          value: JSON.stringify(this.userPanelSettings),
        })
        .then(async () => {
          await this.getUserPanelSettings()
        })
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
