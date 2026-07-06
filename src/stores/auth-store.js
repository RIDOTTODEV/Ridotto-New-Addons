import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'boot/axios'
import { LocalStorage } from 'quasar'
import { applicationSettingService, gamingDateService, enumService } from 'src/api'
import { useCurrencyStore } from 'src/stores/currency-store'


// Compact column tuple layout stored per table: [colId, orderIndex, visibleFlag]
const COL_ID = 0
const COL_ORDER = 1
const COL_VISIBLE = 2
let persistTimer = null

function buildTableState(stored, defaultColumns, defaultRowsPerPage) {
  const fallback = () => ({
    columns: defaultColumns.map((column, index) => ({
      ...column,
      visible: column.visible !== false,
      orderColumn: index,
    })),
    visibleColumns: defaultColumns
      .filter((column) => column.visible !== false)
      .map((column) => column.name),
    rowsPerPage: stored?.rowsPerPage ?? defaultRowsPerPage,
    sort: stored?.sort ?? null,
    filters: { ...(stored?.filters ?? {}) },
  })

  if (!stored || !Array.isArray(stored.columns) || stored.columns.length === 0) {
    return fallback()
  }

  const savedByColId = new Map(stored.columns.map((entry) => [entry[COL_ID], entry]))

  const merged = defaultColumns
    .map((column, index) => {
      const saved = savedByColId.get(column.colId)
      if (!saved) {
        // New column added in code after settings were saved: append at the end.
        return {
          ...column,
          visible: column.visible !== false,
          orderColumn: stored.columns.length + index,
        }
      }
      return {
        ...column,
        visible: saved[COL_VISIBLE] === 1,
        orderColumn: saved[COL_ORDER],
      }
    })
    .sort((a, b) => a.orderColumn - b.orderColumn)

  return {
    columns: merged,
    visibleColumns: merged.filter((column) => column.visible).map((column) => column.name),
    rowsPerPage: stored.rowsPerPage ?? defaultRowsPerPage,
    sort: stored.sort ?? null,
    filters: { ...(stored.filters ?? {}) },
  }
}
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
      DefaultPlayerTransactionLocationId: null,
    },
    enums: [],
    userDashboardLayout: {
      layout: [
        { x: 0, y: 0, w: 4, h: 2, i: '0', component: 'GetActiveGuests' },
        { x: 4, y: 0, w: 4, h: 4, i: '1', component: 'GetPendingGuests' },
        { x: 8, y: 0, w: 4, h: 2, i: '2', component: 'GetGuestTransferList' },
      ],
      draggable: true,
      resizable: true,
      responsive: true,
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
          sort: null,
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
            sort: state.userAddonSettings.tableColumns[tableName].sort,
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


      /***** datatable settings *****/
      getTableState:
      (state) =>
      (tableName, defaultColumns, defaultRowsPerPage = 10) => {
        const stored = tableName ? state.userAddonSettings.tableColumns[tableName] : null
        return buildTableState(stored, defaultColumns, defaultRowsPerPage)
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
    async saveUserCurrency(currencyId, reload = null) {
      const settings = { ...this.userAddonSettings }
      settings.DefaultCurrencyId = currencyId
      await applicationSettingService.setUserSettings({
        name: 'UserAddonSettings',
        value: JSON.stringify(settings),
      })
      if (reload && reload === true) {
        setTimeout(() => {
          window.location.reload()
        }, 100)
      } else {
        await this.getUserAddonSettings()
      }
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
    async updateUserDashboardLayout(layout) {
      this.userDashboardLayout = layout
      await applicationSettingService.setUserSettings({
        name: 'UserDashboardLayout',
        value: JSON.stringify(this.userDashboardLayout),
      })
    },
    async getUserDashboardLayout() {
      await applicationSettingService
        .getSettings({
          name: 'UserDashboardLayout',
        })
        .then((res) => {
          this.userDashboardLayout = res.data.value
            ? JSON.parse(res.data.value)
            : {
                layout: [
                  { x: 0, y: 0, w: 4, h: 2, i: '0', component: 'GetActiveGuests' },
                  { x: 4, y: 0, w: 4, h: 4, i: '1', component: 'GetPendingGuests' },
                  { x: 8, y: 0, w: 4, h: 2, i: '2', component: 'GetGuestTransferList' },
                ],
                draggable: true,
                resizable: true,
                responsive: true,
              }
        })
    },

    saveTableState(tableName, { columns = [], rowsPerPage, sort = null, filters = {} } = {}) {
      if (!tableName) return

      const serialized = columns.map((col, index) => [col.colId, index, col.visible ? 1 : 0])
      const existing = this.userAddonSettings.tableColumns[tableName] ?? {}

      this.userAddonSettings.tableColumns[tableName] = {
        ...existing,
        columns: serialized,
        rowsPerPage: rowsPerPage ?? existing.rowsPerPage ?? 10,
        sort: sort ?? null,
        filters: { ...filters },
      }

      this.scheduleAddonSettingsPersist()
    },
    scheduleAddonSettingsPersist() {
      if (persistTimer) clearTimeout(persistTimer)
      persistTimer = setTimeout(() => {
        persistTimer = null
        void this.persistAddonSettings()
      }, 400)
    },
    async persistAddonSettings() {
      // TODO: wire this to the real backend endpoint that stores
      // `userAddonSettings` for the authenticated user.
      // await api.post('/user/addon-settings', this.userAddonSettings)
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
