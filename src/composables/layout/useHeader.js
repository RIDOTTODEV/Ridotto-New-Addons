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

export function useHeader(props, emit) {
  const bus = inject('bus')
  const $q = useQuasar()
  const router = useRouter()

  const mainStore = useMainStore()
  const { darkMode, locales, selectedLocale } = storeToRefs(mainStore)

  const authStore = useAuthStore()
  const { isAuthorityUser, getUserNameSurname, defaultGamingDateInfo } = storeToRefs(authStore)
  const { locale } = useI18n({ useScope: 'global' })
  const currencyStore = useCurrencyStore()
  const { defaultCurrencyId, currencies } = storeToRefs(currencyStore)
  const cashdeskStore = useCashdeskStore()
  const { selectedCashDesk } = storeToRefs(cashdeskStore)
  const drawer = ref(props.drawer)

  const toggleDrawer = () => {
    drawer.value = !drawer.value
    emit('update:drawer', drawer.value)
  }

  const onChangeLanguage = (changingLocale) => {
    locale.value = changingLocale
    mainStore.setLocale(changingLocale)

    /*     if (changingLocale === 'tr') {
      primeVue.config.locale.startsWith = 'Başlayan'
      primeVue.config.locale.contains = 'İçeren'
      primeVue.config.locale.notContains = 'İçermeyen'
      primeVue.config.locale.endsWith = 'Biten'
      primeVue.config.locale.equals = 'Eşit'
    } */
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
      /*   if (selectedUser.value) {
        // Clear the selectedUser after navigation
        setTimeout(() => {
          selectedUser.value = null;
        }, 200);
      } */
    },
  )

  const redirectToRidotto = () => {
    window.open(process.env.API_URL, '_blank')
  }

  const userSettings = ref({
    darkMode: $q.dark.isActive,
    fullScreen: $q.fullscreen.isActive,
    selectedSystemCurrency: defaultCurrencyId.value,
    selectedLocale: selectedLocale.value?.lang,
  })
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
  }
}
