import { useCurrencyStore } from 'src/stores/currency-store'
import { useAuthStore } from 'src/stores/auth-store'
import { useCashdeskStore } from 'src/stores/cashdesk-store'
import { useTransactionCodeStore } from 'src/stores/transaction-code-store'
import { LocalStorage } from 'quasar'
import { bus } from 'src/boot/event-bus'
/*
  initialize the app
  - fetch currencies
  - fetch auth user settings
  - fetch currency exchange rates
  - fetch cashdesk list
  - fetch chip types
  - fetch transaction codes
*/
export const initialize = async () => {
  const currencyStore = useCurrencyStore()
  const authStore = useAuthStore()
  const cashdeskStore = useCashdeskStore()
  const transactionCodeStore = useTransactionCodeStore()
  await Promise.all([
    authStore.getUserAddonSettings(),
    authStore.getAddonGeneralSettings(),
    authStore.fetchDefaultGamingDateInfo(),
    currencyStore.fetchCurrencies(),
    cashdeskStore.getCashdesks(),
    transactionCodeStore.fetchTransactionCodes(),
    transactionCodeStore.fetchTransTypes(),
  ]).then(() => {
    let latestCashDeskId = LocalStorage.getItem('cashDeskId') || null
    if (latestCashDeskId) {
      const cashDesk = cashdeskStore.getCashDeskById(latestCashDeskId)
      if (cashDesk) {
        cashdeskStore.setCurrentCashDesk(cashDesk)
        cashdeskStore.getGamingDateByCashdeskId({ cashdeskId: latestCashDeskId })
      } else {
        setTimeout(() => bus.emit('setNewCashDesk'), 300)
      }
    } else {
      setTimeout(() => bus.emit('setNewCashDesk'), 300)
    }

    const defaultCurrencyId =
      authStore.userAddonSettings.DefaultCurrencyId || LocalStorage.getItem('defaultCurrencyId')
    if (defaultCurrencyId) {
      currencyStore.setDefaultCurrency(defaultCurrencyId)
    }
    authStore.setIsInitialized(true)
  })
}
