import { computed, defineAsyncComponent, onMounted, ref, inject } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useQuasar, date, LocalStorage } from 'quasar'
import { queryParams } from 'src/helpers/types'
import { i18n } from 'boot/i18n'
const chipHistoryFilter = {
  TableId: null,
  PlayerId: null,
  GamingDateId: null,
  TransactionCodeType: null,
  ChipTransactionType: null,
}

import { useAuthStore } from 'src/stores/auth-store'
import { useInspectorStore } from 'src/stores/inspector-store'
import { useCurrencyStore } from 'src/stores/currency-store'
import { useChipManagementStore } from 'src/stores/chip-management-store'
import { useGuestManagementStore } from 'src/stores/guest-management-store'

import mainOidc from 'src/helpers/oidc-lib'
export function useInspector() {
  const inspectorHubConnection = inject('inspectorHubConnection')
  const bus = inject('bus')
  const router = useRouter()
  const $q = useQuasar()
  const tablesColumn = ref([
    {
      name: 'id',
      align: 'center',
      label: 'ID',
      field: 'id',
      sortable: true,
      visible: true,
    },
    {
      name: 'name',
      align: 'center',
      label: 'Name',
      field: 'name',
      sortable: true,
      visible: true,
    },
  ])
  const inspectorStore = useInspectorStore()
  const {
    currentTable,
    getActiveTablesCount,
    getPassiveTablesCount,
    inspectorTables,
    tableFloatDenoms,
    tableSitPlayers,
    currentPlayer,
    getTableFloatDenomsAsGroup,
  } = storeToRefs(inspectorStore)

  const currencyStore = useCurrencyStore()
  const { getCurrenciesWithFlags, getCurrencyByName, getCurrencyFlagByName } =
    storeToRefs(currencyStore)

  const chipStore = useChipManagementStore()
  const { getChipsGridFormatted } = storeToRefs(chipStore)

  const authStore = useAuthStore()
  const { getUserNameSurname, getDefaultGamingDateId } = storeToRefs(authStore)

  const guestStore = useGuestManagementStore()
  const currentInspector = computed(() => {
    return {
      inspectorName: getUserNameSurname.value.fullName,
    }
  })

  const tablesGetQueryParams = ref({
    ...queryParams({ Sort: 'id desc', Take: 999 }),
  })
  const upFunctionCards = ref([
    {
      title: 'Search',
      icon: 'inspectors/icons8-google-web-search-50.png',
      fn: () => onClickAddPlayerToTable(),
      elPermission: 'Addon.Inspector.Action.SearchPlayer',
    },
    {
      title: 'H.Chip',
      icon: 'inspectors/icons8-chip-52.png',
      fn: () => onClickChipHistory(),
      elPermission: 'Addon.Inspector.Action.ChipHistory',
    },
    {
      title: 'H.Drop',
      icon: 'inspectors/icons8-payment-history-80.png',
      fn: () => onClickCashHistory(),
      elPermission: 'Addon.Inspector.Action.CashHistory',
    },
    {
      title: 'Reports',
      icon: 'inspectors/icons8-reports-58.png',
      fn: () => onClickReport(),
      elPermission: 'Addon.Inspector.Action.Report',
    },
    {
      title: 'Count',
      icon: 'inspectors/icons8-count-100.png',
      fn: () => onClickCount(),
      elPermission: 'Addon.Inspector.Action.Count',
    },
    {
      title: 'Today',
      icon: 'inspectors/icons8-calendar-48.png',
      fn: () => onClickToday(),
      elPermission: 'Addon.Inspector.Action.Today',
    },
    {
      title: 'Guest List',
      icon: 'inspectors/icons8-users-40.png',
      fn: () => onClickGuestList(),
      elPermission: 'Addon.Inspector.Action.GuestList',
    },
  ])

  const currentTableCurrency = computed(() => {
    return (
      getCurrencyByName.value(currentTable.value?.chipCurrencyName) ||
      getCurrenciesWithFlags.value.find((currency) => currency.name === 'TRY')
    )
  })
  const currentTab = ref('currentPlayerChipHistory')
  const filterTable = ref('')
  const playersTableColumns = ref([
    {
      name: 'playerImage',
      align: 'center',
      label: 'Player Photo',
      field: 'playerImage',
      sortable: false,
      visible: true,
      elPermission: 'Addon.Inspector.Player.ShowPhoto',
    },
    {
      name: 'playerName',
      align: 'center',
      label: 'Player Name',
      field: 'playerName',
      sortable: false,
      visible: true,
      elPermission: 'Addon.Inspector.Player.SelectPlayer',
    },
    {
      name: 'avgBet',
      align: 'center',
      label: 'Player Avg',
      field: 'avgBet',
      sortable: false,
      visible: true,
      elPermission: 'Addon.Inspector.Player.DefineAverageBet',
    },
    {
      name: 'inTime',
      align: 'center',
      label: 'Player Time',
      field: 'inTime',
      sortable: false,
      visible: true,
      elPermission: 'Addon.Inspector.Player.TimePauseOrResume',
    },

    {
      name: 'status',
      align: 'center',
      label: 'Status',
      field: 'status',
      sortable: false,
      visible: false,
      elPermission: 'Addon.Inspector.Player.TimePauseOrResume',
    },
  ])
  const getChipHistoryFilterFields = computed(() => {
    return {
      ...chipHistoryFilter,
      TableId: currentTable.value?.id,
      GamingDateId: getDefaultGamingDateId.value,
      TransactionCodeType: 'Chip',
    }
  })
  const getCashHistoryFilterFields = computed(() => {
    return {
      ...chipHistoryFilter,
      TableId: currentTable.value?.id,
      GamingDateId: getDefaultGamingDateId.value,
    }
  })
  const digitalClock = ref(
    new Date()
      .toLocaleTimeString({
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      .replace(/AM|PM/, ''),
  )
  const dialogs = ref({
    selectionInspectorTablesDialog: null,
    chipInOutDialog: null,
    markerInOutDialog: null,
    cashInOutDialog: null,
    addPlayerToTable: null,
    defineAverageBet: null,
    timeOutCurrentPlayer: null,
    chipHistory: null,
    cashHistory: null,
    showPhotoDialog: null,
    report: null,
    inDialog: null,
    timeOutPlayer: null,
    orderToPLayer: null,
    deletePlayer: null,
    playerTableDrop: null,
    playerLgInfo: null,
    todayDialog: null,
    guestListDialog: null,
  })
  setInterval(() => {
    digitalClock.value = new Date()
      .toLocaleTimeString({
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      .replace(/AM|PM/, '')
  }, 1000)
  onMounted(async () => {
    await inspectorStore.fetchTables(tablesGetQueryParams.value).then(async () => {
      const validatedTable = await inspectorStore.validateSavedTables()
      if (validatedTable) {
        onClickSelectTable({ ...validatedTable })
      }
      if (inspectorTables.value.length <= 0 && router.currentRoute.value?.name === 'inspector') {
        selectionInspectorTables()
      }
      if (chipStore.chips.length <= 0) {
        chipStore.fetchChips()
      }
    })
  })
  inspectorHubConnection?.on('RefreshInspectingTables', async () => {
    await inspectorStore.validateSavedTables()
  })

  const selectionInspectorTables = () => {
    dialogs.value.selectionInspectorTablesDialog = $q
      .dialog({
        persistent: false,
        noRouteDismiss: false,
        noBackdropDismiss: false,
        component: defineAsyncComponent(
          () => import('../../pages/inspector/components/InspectorTableSelectionDialog.vue'),
        ),
      })
      .onOk(async (payload) => {
        if (payload && payload === true) {
          await onClickSelectTable({ ...inspectorTables.value[0] })
        }
      })
      .onCancel(async () => {
        if (router.currentRoute.value?.name === 'inspector' && inspectorTables.value.length === 0) {
          selectionInspectorTables()
        }
      })
  }
  const onClickSelectTable = async (table) => {
    currentPlayer.value = null
    currentTable.value = table
    await inspectorStore.fetchTable(currentTable.value.id)
    await inspectorStore.fetchCurrentTableFloatDenominations()
    await inspectorStore.fetchSitPlayers()
    LocalStorage.set('currentTable', table)
  }
  const validateCurrentTable = () => {
    if (!currentTable.value) {
      $q.notify({
        message: i18n.global.t('pleaseSelectATable'),
        type: 'negative',
        position: 'top-right',
      })
      return false
    }
    return true
  }
  const onClickChipInOut = (chipTransactionType = 'ChipIn') => {
    if (!validateCurrentTable() || currentPlayer.value === null) return
    currentTab.value = 'currentPlayerChipHistory'
    dialogs.value.chipInOutDialog = $q
      .dialog({
        component: defineAsyncComponent(
          () => import('../../pages/inspector/components/ChipInOutDialog.vue'),
        ),
        componentProps: {
          chipTransactionType: chipTransactionType,
          player: currentPlayer.value,
          chips: getChipsGridFormatted.value,
        },
      })
      .onOk(async (payload) => {
        if (payload) {
          let data = {
            playerId: currentPlayer.value.playerId,
            tableId: currentTable.value.id,
            playerLgTimeInOutId: currentPlayer.value.playerLgTimeInOutId,
            amount: payload.amount,
            gameId: currentTable.value.gameId,
            chips: payload.chips,
            chipTransactionType: chipTransactionType,
          }

          let status = await inspectorStore.playerLgPlayerChipInOut(data)
          if (status) {
            $q.notify({
              message: i18n.global.t('playerInOutSuccessfully'),
              type: 'positive',
              position: 'bottom-right',
              timeout: 2000,
            })
          }

          bus.emit('fetchCurrentPlayerChipHistory')
          await inspectorStore.fetchCurrentTableFloatDenominations()
        }
      })
  }
  const onClickMarkerInOut = (chipTransactionType = 'MarkerIn') => {
    if (!validateCurrentTable() || currentPlayer.value === null) return

    dialogs.value.markerInOutDialog = $q
      .dialog({
        component: defineAsyncComponent(
          () => import('../../pages/inspector/components/MarkerInOutDialog.vue'),
        ),
        componentProps: {
          chipTransactionType: chipTransactionType,
          player: currentPlayer.value,
          chips: getChipsGridFormatted.value,
        },
      })
      .onOk(async (payload) => {
        if (payload) {
          let data = {
            playerLgTimeInOutId: currentPlayer.value.playerLgTimeInOutId,
            playerId: currentPlayer.value.playerId,
            tableId: currentTable.value.id,
            gameId: currentTable.value.gameId,
            amount: payload.amount,
            chipType: payload.chipType,
            chipTransactionType: chipTransactionType === 'MarkerIn' ? 'ChipIn' : 'ChipOut',
          }

          let status = await inspectorStore.playerLgPlayerMarkerInOut(data)
          if (status) {
            $q.notify({
              message: i18n.global.t('playerInOutSuccessfully'),
              type: 'positive',
              position: 'bottom-right',
              timeout: 2000,
            })
          }

          await inspectorStore.fetchSitPlayers()
        }
      })
  }
  const onClickCashInOut = () => {
    if (!validateCurrentTable() || currentPlayer.value === null) return
    currentTab.value = 'currentPlayerCashHistory'
    dialogs.value.cashInOutDialog = $q
      .dialog({
        component: defineAsyncComponent(
          () => import('../../pages/inspector/components/CashInOutDialog.vue'),
        ),
        componentProps: {
          currencies: getCurrenciesWithFlags.value.filter((currency) =>
            currentTable.value.acceptedCurrencies.map((ac) => ac.currencyId).includes(currency.id),
          ),
          defaultCurrencyId: currentTableCurrency.value.id,
          player: currentPlayer.value,
          plaques: getChipsGridFormatted.value.filter((chip) => chip.type === 'Plaque'),
        },
      })
      .onOk(async (payload) => {
        if (payload) {
          if (payload.selectedInOutMethod === 'CashIn') {
            let data = {
              playerLgTimeInOutId: currentPlayer.value.playerLgTimeInOutId,
              playerId: currentPlayer.value.playerId,
              tableId: currentTable.value.id,
              gameId: currentTable.value.gameId,
              cashInfos: payload.cashInfos,
            }
            let status = await inspectorStore.playerLgPlayerCashIn(data)
            if (status) {
              $q.notify({
                message: i18n.global.t('playerInOutSuccessfully'),
                type: 'positive',
                position: 'bottom-right',
                timeout: 2000,
              })
            }
            bus.emit('fetchCurrentPlayerCashHistory')
            await inspectorStore.fetchCurrentTableFloatDenominations()
            currentTab.value = 'currentPlayerCashHistory'
          } else {
            let data = {
              playerId: currentPlayer.value.playerId,
              tableId: currentTable.value.id,
              playerLgTimeInOutId: currentPlayer.value.playerLgTimeInOutId,
              amount: payload.plaquesTotal,
              gameId: currentTable.value.gameId,
              chips: payload.plaques,
              chipTransactionType: 'ChipIn',
            }

            let status = await inspectorStore.playerLgPlayerChipInOut(data)
            if (status) {
              $q.notify({
                message: i18n.global.t('playerInOutSuccessfully'),
                type: 'positive',
                position: 'bottom-right',
                timeout: 2000,
              })
            }
            bus.emit('fetchCurrentPlayerChipHistory')
            await inspectorStore.fetchCurrentTableFloatDenominations()
            currentTab.value = 'currentPlayerChipHistory'
          }
        }
      })
  }
  const onClickAddPlayerToTable = () => {
    if (!validateCurrentTable()) return
    dialogs.value.addPlayerToTable = $q
      .dialog({
        component: defineAsyncComponent(
          () => import('../../pages/inspector/components/AddPlayerToTableDialog.vue'),
        ),
        componentProps: {
          currentTable: currentTable.value,
          gamingDateId: getDefaultGamingDateId.value,
        },
      })
      .onOk(async (payload) => {
        if (payload) {
          let status = await inspectorStore.timeInPLayer({
            playerId: payload?.id,
            tableId: currentTable.value.id,
          })
          if (status) {
            $q.notify({
              message: i18n.global.t('playerSitSuccessfully'),
              type: 'positive',
              position: 'bottom-right',
              timeout: 2000,
            })
          }
          await inspectorStore.fetchSitPlayers()
        }
      })
  }
  const onClickPlayerTimePauseOrResume = async (player) => {
    let status
    switch (true) {
      case player.status === 'In':
        status = 'Pause'
        break
      case player.status === 'Pause':
        status = 'Resume'
        break
    }
    await inspectorStore.playerTimePauseOrResume({
      playerLgTimeInOutId: player.playerLgTimeInOutId,
      status: status,
    })
    await inspectorStore.fetchSitPlayers()
  }
  const onClickDefineAverageBet = async (autoTimeOut = false) => {
    if (!validateCurrentTable() || currentPlayer.value === null) return
    dialogs.value.defineAverageBet = $q
      .dialog({
        component: defineAsyncComponent(
          () => import('../../pages/inspector/components/AverageDefineDialog.vue'),
        ),
        componentProps: {
          player: currentPlayer.value,
        },
      })
      .onOk(async (payload) => {
        if (payload) {
          await inspectorStore.definePlayerAvgBet({
            playerId: currentPlayer.value.playerId,
            avgBet: payload.avgBet,
            tableId: currentTable.value.id,
          })
          if (autoTimeOut) {
            await timeOutPlayerFn()
          }
          await inspectorStore.fetchSitPlayers()
          resetPlayer()
        }
      })
  }
  const resetPlayer = (playerId = null) => {
    let id = playerId ? playerId : currentPlayer.value?.playerId
    let player = tableSitPlayers.value.find((player) => player.playerId === id)
    if (player) {
      onClickPlayer(player)
    } else {
      currentPlayer.value = null
    }
  }
  const onClickPlayer = (player, onClickedName = null) => {
    if (onClickedName && currentPlayer.value && currentPlayer.value.playerId === player.playerId) {
      currentPlayer.value = null
    } else {
      currentPlayer.value = { ...player }
    }
  }
  const onClickTimeOutCurrentPLayer = async () => {
    if (!validateCurrentTable() || currentPlayer.value === null) {
      return
    }
    if (currentPlayer.value.avgBet === 0) {
      dialogs.value.timeOutCurrentPlayer = $q
        .dialog({
          component: defineAsyncComponent(
            () => import('../../pages/inspector/components/TimeOutPlayerDialog.vue'),
          ),
          componentProps: {
            avgBet: currentPlayer.value.avgBet,
          },
        })
        .onOk(async () => {
          await onClickDefineAverageBet(true)
        })
    } else {
      await timeOutPlayerFn()
    }
  }
  const timeOutPlayerFn = async () => {
    let status = await inspectorStore.timeOutPlayer({
      playerLgTimeInOutId: currentPlayer.value.playerLgTimeInOutId,
    })
    if (status) {
      $q.notify({
        message: i18n.global.t('playerInOutSuccessfully'),
        type: 'positive',
        position: 'bottom-right',
        timeout: 2000,
      })
    }
    currentPlayer.value = null
    await inspectorStore.fetchSitPlayers()
  }
  const onClickChipHistory = () => {
    if (!validateCurrentTable()) return
    dialogs.value.chipHistory = $q.dialog({
      component: defineAsyncComponent(
        () => import('../../pages/inspector/components/ChipHistoryDialog.vue'),
      ),
      componentProps: {
        getChipHistoryFilterFields: { ...getChipHistoryFilterFields.value },
        fetchChipHistory: inspectorStore.fetchChipHistory,
        fetchChipHistoryDetail: inspectorStore.fetchChipHistoryDetail,
      },
    })
  }
  const onClickCashHistory = () => {
    if (!validateCurrentTable()) return
    dialogs.value.cashHistory = $q.dialog({
      component: defineAsyncComponent(
        () => import('../../pages/inspector/components/CashHistoryDialog.vue'),
      ),
      componentProps: {
        getCashHistoryFilterFields: { ...getCashHistoryFilterFields.value },
        fetchCashHistory: inspectorStore.fetchCashHistory,
      },
    })
  }
  const onClickShowPhoto = (player) => {
    dialogs.value.showPhotoDialog = $q.dialog({
      component: defineAsyncComponent(
        () => import('../../pages/inspector/components/PlayerPhotoDialog.vue'),
      ),
      componentProps: {
        photo: player?.playerImage,
      },
    })
  }
  const onClickReport = () => {
    if (!validateCurrentTable()) return
    dialogs.value.report = $q.dialog({
      component: defineAsyncComponent(
        () => import('../../pages/inspector/components/ReportDialog.vue'),
      ),
      componentProps: {
        fetchTableReport: inspectorStore.fetchTableReport,
        tableFloatDenoms: [...tableFloatDenoms.value],
        getTableReportFilterFields: {
          TableId: currentTable.value.id,
          GamingDateId: getDefaultGamingDateId.value,
        },
        table: currentTable.value,
      },
    })
  }
  const onClickOrderToPlayer = () => {
    if (!validateCurrentTable() || currentPlayer.value === null) return
    dialogs.value.orderToPLayer = $q.dialog({
      component: defineAsyncComponent(
        () => import('../../pages/inspector/components/OrderToPlayerDialog.vue'),
      ),
      componentProps: {
        playerName: currentPlayer.value.playerName,
      },
    })
  }

  const onClickCount = async () => {
    if (!validateCurrentTable()) return
    let response = await inspectorStore.getTableTotalDrop({
      tableId: currentTable.value.id,
      gamingDateId: getDefaultGamingDateId.value,
    })
    dialogs.value.count = $q.dialog({
      component: defineAsyncComponent(
        () => import('../../pages/inspector/components/CountDialog.vue'),
      ),
      componentProps: {
        table: currentTable.value,
        totalDrop: response?.totalDrop,
      },
    })
  }
  const onClickPlayerLgInfo = async () => {
    if (!validateCurrentTable() || currentPlayer.value === null) return
    let filterParams = {
      tableId: currentTable.value.id,
      gamingDateId: getDefaultGamingDateId.value,
      playerId: currentPlayer.value.playerId,
    }
    let playerLgInfo = await inspectorStore.getPlayerLgInfo(filterParams)
    dialogs.value.playerLgInfo = $q.dialog({
      component: defineAsyncComponent(
        () => import('../../pages/inspector/components/PlayerLgInfoDialog.vue'),
      ),
      componentProps: {
        playerLgInfo: playerLgInfo,
        filterFn: inspectorStore.getPlayerLgInfo,
        filterParams: filterParams,
        player: currentPlayer.value,
        table: currentTable.value,
      },
    })
  }
  const onClickDeletePlayer = (player) => {
    if (!validateCurrentTable() || currentPlayer.value === null) return
    dialogs.value.deletePlayer = $q
      .dialog({
        component: defineAsyncComponent(
          () => import('../../pages/inspector/components/ConfirmDialog.vue'),
        ),
        componentProps: {
          playerName: currentPlayer.value.playerName,
          message: i18n.global.t('onDeletePlayerMessage'),
          actionTitle: i18n.global.t('deletePlayer'),
        },
      })
      .onOk(async () => {
        let status = await inspectorStore.playerSitDelete({
          playerLgTimeInOutId: player.playerLgTimeInOutId,
        })
        if (status) {
          $q.notify({
            message: i18n.global.t('playerDeletedSuccessfully'),
            type: 'positive',
            position: 'bottom-right',
            timeout: 2000,
          })
        }
        await inspectorStore.fetchSitPlayers()
      })
  }
  const onClickToday = () => {
    dialogs.value.todayDialog = $q
      .dialog({
        component: defineAsyncComponent(
          () => import('../../pages/inspector/components/TodayDialog.vue'),
        ),
        componentProps: {
          tables: inspectorTables.value,
          timeInFn: inspectorStore.timeInPLayer,
          currentTableId: currentTable.value.id,
        },
      })
      .onOk(async (payload) => {
        if (payload) {
          await inspectorStore.fetchSitPlayers()
        }
      })
  }
  const onClickGuestList = () => {
    dialogs.value.guestListDialog = $q
      .dialog({
        component: defineAsyncComponent(
          () => import('../../pages/inspector/components/GuestListDialog.vue'),
        ),
        componentProps: {
          fetchFn: guestStore.getHotelPlayerList,
          timeInFn: inspectorStore.timeInPLayer,
          currentTableId: currentTable.value.id,
        },
      })
      .onOk(async (payload) => {
        if (payload) {
          await inspectorStore.fetchSitPlayers()
        }
      })
  }

  onBeforeRouteLeave((to, from, next) => {
    reset()
    next()
  })
  const reset = () => {
    currentPlayer.value = null
    dialogs.value.selectionInspectorTablesDialog?.hide()
    dialogs.value.chipInOutDialog?.hide()
    dialogs.value.markerInOutDialog?.hide()
    dialogs.value.cashInOutDialog?.hide()
    dialogs.value.addPlayerToTable?.hide()
    dialogs.value.defineAverageBet?.hide()
    dialogs.value.timeOutCurrentPlayer?.hide()
    dialogs.value.chipHistory?.hide()
    dialogs.value.cashHistory?.hide()
    dialogs.value.showPhotoDialog?.hide()
    dialogs.value.report?.hide()
    dialogs.value.timeOutPlayer?.hide()
    dialogs.value.guestListDialog?.hide()
  }
  return {
    /* defaultCurrency, */
    filterTable,
    tablesColumn,
    getActiveTablesCount,
    getPassiveTablesCount,
    inspectorTables,
    currentTableCurrency,
    date,
    tableFloatDenoms,
    getTableFloatDenomsAsGroup,
    playersTableColumns,
    tableSitPlayers,
    currentTable,
    upFunctionCards,
    currentTab,
    currentPlayer,
    digitalClock,
    onClickSelectTable,
    onClickPlayer,
    onClickPlayerTimePauseOrResume,
    selectionInspectorTables,

    onClickDefineAverageBet,
    onClickTimeOutCurrentPLayer,
    onClickAddPlayerToTable,
    onClickCashInOut,
    onClickChipInOut,
    onClickCashHistory,
    onClickChipHistory,
    onClickShowPhoto,
    onClickReport,
    resetPlayer,
    reset,
    onClickOrderToPlayer,
    mainOidc,
    currentInspector,
    onClickMarkerInOut,
    onClickDeletePlayer,
    onClickPlayerLgInfo,
    getCurrencyFlagByName,
  }
}
