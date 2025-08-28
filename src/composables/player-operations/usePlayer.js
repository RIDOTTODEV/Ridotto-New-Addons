import { usePlayerStore } from 'src/stores/player-store'
import { useCurrencyStore } from 'src/stores/currency-store'
import { useCashdeskStore } from 'src/stores/cashdesk-store'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { defineAsyncComponent, ref, watch, computed } from 'vue'
import { useQuasar, date } from 'quasar'
import { fireNotify, priceAbsFormatted } from 'src/helpers/helpers'

export function usePlayer() {
  const playerStore = usePlayerStore()
  const router = useRouter()
  const { selectedPlayer, playerClasses, playerDepositAndCredits } = storeToRefs(playerStore)
  const $q = useQuasar()
  const currencyStore = useCurrencyStore()
  const { currencies, getCurrencyById, getCurrenciesByIds } = storeToRefs(currencyStore)
  const cashdeskStore = useCashdeskStore()
  const { selectedCashDesk } = storeToRefs(cashdeskStore)
  const playerBlackListHistory = ref([])
  const playerId = computed(() => {
    return +router.currentRoute.value.params.playerId || null
  })
  const initPlayer = async () => {
    if (playerId.value) {
      await playerStore.fetchPlayerMetaDetail({ playerId: playerId.value })
    } else {
      router.push({ name: 'playerOperations' })
    }
  }

  const redirectToRidottoPlayerDetail = () => {
    const baseUrl = process.env.API_URL
    const url = `${baseUrl}/players/${selectedPlayer.value.player.id}/summary`
    window.open(url, '_blank')
  }
  const copyPlayerId = () => {
    navigator.clipboard.writeText(selectedPlayer.value.player.id)
    $q.notify({
      message: 'Player ID copied to clipboard',
      color: 'positive',
      position: 'bottom-right',
      icon: 'fa fa-check',
    })
  }
  const updatePlayerBlacklist = async (params) => {
    $q.dialog({
      component: defineAsyncComponent(
        () => import('src/components/pages/player-operations/meta-detail/BlackListInput.vue'),
      ),
      componentProps: {
        data: {
          playerId: params.playerId,
          isBlackListed: params.isBlackListed,
        },
      },
    })
      .onOk(async (data) => {
        await playerStore.updatePlayerBlacklist(data)
      })
      .onCancel(() => {
        playerStore.fetchPlayerMetaDetail({ playerId: params.playerId })
      })
  }
  const onHandleShowBlackListMenu = async () => {
    const { data } = await playerStore.fetchPlayerBlackListHistory({
      playerId: selectedPlayer.value.player.id,
    })
    playerBlackListHistory.value = data
  }

  const onClickPlayerCashTransaction = () => {
    $q.dialog({
      component: defineAsyncComponent(
        () =>
          import('src/components/pages/player-operations/transactions/CashTransactionDialog.vue'),
      ),
    }).onOk(async (data) => {
      console.log(data)
      //await playerStore.playerPostCashDeskCashTransaction(data)
    })
  }
  const createNewCashlessAccount = () => {
    $q.dialog({
      component: defineAsyncComponent(
        () =>
          import(
            'src/components/pages/player-operations/cashless-account/AddCashlessAccountDialog.vue'
          ),
      ),
      componentProps: {
        playerId: selectedPlayer.value?.player?.id,
      },
    }).onOk(async (data) => {
      console.log(data)
    })
  }

  const lastCageTransactionRef = ref(null)
  const lastChipTransactionRef = ref(null)

  const createPlayerChipTransaction = ref(false)
  const playerChipTransactionCurrencyIds = ref([])
  const playerChipTransactionFormValues = ref({
    cashdeskId: selectedCashDesk.value?.id,
    playerId: null,
    currencyId: null,
    amount: null,
    transactionCodeId: null,
    transType: null,
    chips: [],
    transactionType: 'Withdrawal',
    note: null,
    inOut: false,
  })
  const onSubmitPlayerChipTransaction = async () => {
    playerChipTransactionFormValues.value.playerId = selectedPlayer.value?.player?.id
    const chipsTotal = playerChipTransactionFormValues.value.chips.reduce(
      (acc, curr) => acc + curr.amount,
      0,
    )
    if (chipsTotal <= 0) {
      $q.notify({
        message: 'Chips total must be greater than 0',
        color: 'negative',
        position: 'bottom-right',
        icon: 'fa fa-exclamation-triangle',
      })
      return
    }
    await playerStore.playerChipTransaction({
      ...playerChipTransactionFormValues.value,
    })
    setTimeout(() => {
      lastChipTransactionRef.value.reload()
      lastCageTransactionRef.value.reload()
      playerChipTransactionFormValues.value = {
        ...playerChipTransactionFormValues.value,
        transType: null,
        amount: null,
        transactionCodeId: null,
        note: null,
        inOut: false,
        chips: [],
      }
      fireNotify('Chip transaction created successfully', 'created', 3000, 'positive')
    }, 1000)
  }
  const initPlayerChipTransactionChips = (chips) => {
    playerChipTransactionCurrencyIds.value = chips.map((chip) => chip.currencyId)
    try {
      const currency = getCurrenciesByIds.value(playerChipTransactionCurrencyIds.value)[0]
      playerChipTransactionFormValues.value.currencyId = currency?.id
    } catch (error) {
      console.log(error)
    }
  }
  const maximizedReport = ref(false)
  const inOutSelectedNameReportFilterParams = ref(null)
  const showInOutSelectedNameReport = ref(false)

  // watch the selected player
  watch(selectedPlayer, () => {
    setInOutSelectedNameReportFilterParams()
  })
  const setInOutSelectedNameReportFilterParams = () => {
    inOutSelectedNameReportFilterParams.value = {
      playerId: selectedPlayer.value?.player?.id,
      playerFullName:
        selectedPlayer.value?.player?.name + ' ' + selectedPlayer.value?.player?.surname,
    }
  }

  const onChangeActiveStatus = () => {
    $q.dialog({
      component: defineAsyncComponent(
        () => import('src/components/pages/player-operations/meta-detail/ActiveStatusDialog.vue'),
      ),
      componentProps: {
        playerName:
          selectedPlayer.value?.player?.name + ' ' + selectedPlayer.value?.player?.surname,
        actionTitle: 'Müşteri Statü Değiştirme',
        message: `Müşteri ${selectedPlayer.value?.player?.isActive ? 'aktif' : 'pasif'} durumundadır. Bu işlemi ${selectedPlayer.value?.player?.isActive ? 'deaktiv' : 'aktiv'} etmek istediğinize emin misiniz?`,
      },
    }).onOk(async () => {
      await playerStore.updatePlayerStatusFlags({
        playerId: selectedPlayer.value?.player?.id,
        isActive: !selectedPlayer.value?.player?.isActive,
      })
      await playerStore.fetchPlayerMetaDetail({ playerId: selectedPlayer.value?.player?.id })
    })
  }
  const onChangeDiscountStatus = () => {
    $q.dialog({
      component: defineAsyncComponent(
        () => import('src/components/pages/player-operations/meta-detail/ActiveStatusDialog.vue'),
      ),
      componentProps: {
        playerName:
          selectedPlayer.value?.player?.name + ' ' + selectedPlayer.value?.player?.surname,
        actionTitle: 'Müşteri Discount Durum Değiştirme',
        message: `Müşteri ${selectedPlayer.value?.player?.discountStatus ? 'discount' : 'noDiscount'} durumundadır. Bu işlemi ${selectedPlayer.value?.player?.discountStatus ? 'deaktiv' : 'aktiv'} etmek istediğinize emin misiniz?`,
      },
    }).onOk(async () => {
      await playerStore.updatePlayerStatusFlags({
        playerId: selectedPlayer.value?.player?.id,
        isDiscountStatus: !selectedPlayer.value?.player?.discountStatus,
      })
      await playerStore.fetchPlayerMetaDetail({ playerId: selectedPlayer.value?.player?.id })
    })
  }
  return {
    playerStore,
    selectedPlayer,
    router,
    initPlayer,
    redirectToRidottoPlayerDetail,
    copyPlayerId,
    currencies,
    getCurrencyById,
    updatePlayerBlacklist,
    playerBlackListHistory,
    onHandleShowBlackListMenu,
    date,
    playerClasses,
    playerDepositAndCredits,
    priceAbsFormatted,
    onClickPlayerCashTransaction,
    createNewCashlessAccount,
    createPlayerChipTransaction,
    playerChipTransactionFormValues,
    onSubmitPlayerChipTransaction,
    playerChipTransactionCurrencyIds,
    initPlayerChipTransactionChips,
    lastCageTransactionRef,
    lastChipTransactionRef,
    playerId,
    showInOutSelectedNameReport,
    inOutSelectedNameReportFilterParams,
    maximizedReport,
    onChangeActiveStatus,
    onChangeDiscountStatus,
  }
}
