import { defineBoot } from '#q-app/wrappers'
import { createI18n } from 'vue-i18n'
import { LocalStorage } from 'quasar'
import { useMainStore } from 'src/stores/main-store'
import { useAuthStore } from 'src/stores/auth-store'
import messages from 'src/i18n'
import { formatMissingKey } from 'src/helpers/helpers'
let i18n = null
export default defineBoot(({ app, store }) => {
  const authStore = useAuthStore(store)

  const initialLocale =
    LocalStorage.getItem('locale') || authStore.userAddonSettings.DefaultLocale || 'en'
  const initialDarkMode = LocalStorage.getItem('darkMode') || false

  const mainStore = useMainStore(store)

  mainStore.setLocale(initialLocale)
  mainStore.setDarkMode(initialDarkMode)

  i18n = createI18n({
    legacy: false,
    locale: mainStore.locale,
    globalInjection: true,
    fallbackLocale: 'en',
    messages,
    missing(locale, key) {
      const formattedKey = formatMissingKey(key)
      return formattedKey || key
    },
  })
  app.use(i18n)
})
export { i18n }
