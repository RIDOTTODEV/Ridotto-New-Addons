import { watch, ref, inject } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useMainStore } from 'src/stores/main-store'
import mainOidc from 'src/helpers/oidc-lib'
import { useAuthStore } from 'src/stores/auth-store'
import { useCurrencyStore } from 'src/stores/currency-store'
import { useCashdeskStore } from 'src/stores/cashdesk-store'
import { usePlayerStore } from 'src/stores/player-store'
import { i18n } from 'src/boot/i18n'
export function useHeader(props, emit) {
  const bus = inject('bus')
  const $q = useQuasar()
  const router = useRouter()
  const playerStore = usePlayerStore()
  const mainStore = useMainStore()
  const { darkMode, locales, selectedLocale } = storeToRefs(mainStore)

  const authStore = useAuthStore()
  const { isAuthorityUser, getUserNameSurname, defaultGamingDateInfo, getDefaultCurrencyId } =
    storeToRefs(authStore)
  const { locale } = useI18n({ useScope: 'global' })
  const currencyStore = useCurrencyStore()
  const { currencies } = storeToRefs(currencyStore)
  const cashdeskStore = useCashdeskStore()
  const { selectedCashDesk, currentCashDeskBalance, currentCashDeskChipBalance } =
    storeToRefs(cashdeskStore)
  const drawer = ref(props.drawer)
  const selectedUser = ref(null)
  const toggleDrawer = () => {
    drawer.value = !drawer.value
    emit('update:drawer', drawer.value)
  }

  const onChangeLanguage = (changingLocale) => {
    locale.value = changingLocale
    mainStore.setLocale(changingLocale)
  }

  const onLogout = () => {
    mainOidc.signOut()
  }
  const onToggleDarkMode = () => {
    mainStore.setDarkMode(!darkMode.value)
  }

  watch(darkMode, (newDarkMode) => {
    $q.dark.set(newDarkMode)
  })

  watch(
    () => router.currentRoute.value.path,
    () => {
      if (selectedUser.value) {
        // Clear the selectedUser after navigation
        setTimeout(() => {
          selectedUser.value = null
        }, 200)
      }
    },
  )

  const redirectToRidotto = () => {
    window.open(process.env.API_URL, '_blank')
  }

  const userSettings = ref({
    darkMode: $q.dark.isActive,
    fullScreen: $q.fullscreen.isActive,
    selectedSystemCurrency: getDefaultCurrencyId.value,
    selectedLocale: selectedLocale.value?.lang,
  })

  const redirectToUserDetail = () => {
    playerStore.setLastSearchedPlayer(selectedUser.value)
    // if the url name is playerDetail, then redirect to the playerDetail page
    const currentRoute = router.currentRoute.value.name

    if (currentRoute === 'players') {
      router.push({
        name: 'playerDetail',
        params: { playerId: selectedUser.value.id },
      })
    } else {
      router.push({
        name: 'customerInformation',
        query: { playerId: selectedUser.value.id },
      })
    }
  }
  /*   watch(selectedUser, (val) => {
    if (val === null) return;
    redirectToUserDetail();
  }); */
  // Watch for route changes to clear the selected user and reset input
  watch(
    () => router.currentRoute.value.path,
    () => {
      if (selectedUser.value) {
        // Clear the selectedUser after navigation
        setTimeout(() => {
          selectedUser.value = null
        }, 200)
      }
    },
  )
  const onSelectPlayer = (player) => {
    selectedUser.value = player
    redirectToUserDetail()
  }
  const onClearPlayer = () => {
    selectedUser.value = null
  }

  const changeCashDeskGamingDate = () => {
    if (selectedCashDesk.value.gamingDateId === defaultGamingDateInfo.value?.id) {
      $q.notify({
        position: 'bottom-right',
        type: 'warning',
        message: i18n.global.t('Kasa zaten en son oyun tarihine sahip.'),
      })
      return false
    }
    if (Math.abs(currentCashDeskBalance) > 0.5 || Math.abs(currentCashDeskChipBalance) > 0.5) {
      $q.notify({
        position: 'bottom-right',
        type: 'warning',
        message: i18n.global.t('Lütfen önce kasa CASH balansını ve CHIP balansını sıfırlayınız.'),
      })
      return false
    }

    $q.dialog({
      title: i18n.global.t('changeGamingDate'),
      message: i18n.global.t('promiseGaminChange'),
      persistent: true,
      focus: 'cancel',
      ok: {
        flat: true,
        color: 'negative',
        label: i18n.global.t('yes'),
        class: 'text-capitalize',
      },
      cancel: {
        flat: true,
        color: 'primary',
        label: i18n.global.t('cancel'),
        class: 'text-capitalize',
      },
    }).onOk(async () => {
      await cashdeskStore.updateCashDeskGamingDate({
        countBalanceCurrencyId: getDefaultCurrencyId.value,
        cashdeskId: selectedCashDesk.value.id,
      })
      authStore.fetchDefaultGamingDateInfo()
      cashdeskStore.getGamingDateByCashdeskId({
        cashdeskId: selectedCashDesk.value.id,
      })
    })
  }

  return {
    mainOidc,
    onChangeLanguage,
    onLogout,
    darkMode,
    onToggleDarkMode,
    drawer,
    toggleDrawer,
    isAuthorityUser,
    getUserNameSurname,
    redirectToRidotto,
    userSettings,
    locales,
    currencies,
    currencyStore,
    $q,
    selectedCashDesk,
    defaultGamingDateInfo,
    router,
    bus,
    authStore,
    selectedUser,
    onSelectPlayer,
    onClearPlayer,
    changeCashDeskGamingDate,
  }
}
