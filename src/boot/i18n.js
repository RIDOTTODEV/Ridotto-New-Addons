import { defineBoot } from '#q-app/wrappers'
import { createI18n } from 'vue-i18n'
import { LocalStorage } from 'quasar'
import { useMainStore } from 'src/stores/main-store'
import messages from 'src/i18n'
function formatMissingKey(key) {
  // First handle cases like "last1Year" or "last15minutes"
  const timePattern = /(last)(\d+)(year|month|week|day|hour|minute|second)s?/i
  const match = key.match(timePattern)

  if (match) {
    const [, prefix, number, unit] = match
    return `${prefix.charAt(0).toUpperCase()}${prefix.slice(1)} ${number} ${unit.charAt(0).toUpperCase()}${unit.slice(1)}`
  }

  // Handle regular camelCase
  const spaced = key.replace(/([a-z])([A-Z])/g, '$1 $2')
  return spaced.replace(/\b\w/g, (char) => char.toUpperCase())
}
let i18n = null
export default defineBoot(({ app, store }) => {
  const initialLocale = LocalStorage.getItem('locale') || 'en'
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
