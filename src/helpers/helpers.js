// show the price in the correct format
import { useQuasar, Notify } from 'quasar'

export const formatPrice = (price, currency = 'USD') => {
  return price
    ? price.toLocaleString('en-US', {
        //style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : price
}
export const toHours = (totalMinutes) => {
  console.log('totalMinutes', totalMinutes)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = Number((totalMinutes % 60).toFixed(1))
  return hours + 'h ' + minutes + 'm'
}
export const camelCaseToSentence = (str) => {
  let sentence = ''
  for (var i = 0; i < str.length; i++) {
    var char = str.charAt(i)
    if (char === char.toLowerCase()) {
      sentence += char
    } else {
      sentence += ' ' + char.toLowerCase()
    }
  }
  return sentence.charAt(0).toUpperCase() + sentence.slice(1)
}

export async function selectBoxFilters(
  val,
  update,
  realOptions,
  options,
  filterKeys,
  fetchData,
  fetchDataParams,
) {
  if (realOptions.length === 0) {
    await fetchData({ ...fetchDataParams })
  }
  if (val === '') {
    update(() => {
      options.value = realOptions.value
    })
    return
  }
  update(() => {
    // console.log("options.value", options.value)
    // console.log("realOptions.value", realOptions.value)
    // console.log("filterKeys", filterKeys)
    options.value = realOptions.value.filter((item) => {
      return filterKeys.some((key) => {
        return item[key].toLowerCase().includes(val.toLowerCase())
      })
    })
  })
}

export const getWindowHeight = () => {
  const $q = useQuasar()
  const height = $q.screen.height
  return Math.round((90 * height) / 100)
}

export const priceAbsFormatted = (totalAmount = null, currencyName = null) => {
  if (totalAmount === null || totalAmount === undefined || totalAmount === 0) {
    return '0.00'
  }
  let amount = Math.abs(totalAmount)

  // FIXME update according to existing currecies, not hard coded
  let symbol
  switch (currencyName) {
    case 'TL':
      symbol = '₺'
      break
    case 'EUR':
      symbol = '€'
      break
    case 'USD':
      symbol = '$'
      break
    case 'GBP':
      symbol = '£'
      break
    default:
      symbol = ''
  }

  return totalAmount < 0 ? '(' + formatPrice(amount) + ')' : symbol + ' ' + formatPrice(amount)
}

export function errorHandle(errorsObj) {
  if (errorsObj.message === 'Network Error') {
    Notify.create({
      type: 'negative',
      message: errorsObj.message,
      timeout: 1000,
      position: 'bottom-right',
      progress: true,
    })
    return false
  }

  const statusCode = errorsObj.response.status

  if (statusCode === 401) {
    Notify.create({
      type: 'negative',
      message: '401 ' + errorsObj.response.data.title,
      timeout: 10000,
      position: 'bottom-right',
      progress: true,
    })

    return false
  }

  if (statusCode === 400) {
    console.log(errorsObj.response.data)
    Notify.create({
      type: 'negative',
      message: '400 ' + errorsObj.response.data,
      timeout: 10000,
      position: 'bottom-right',
      progress: true,
    })

    return false
  }

  let errors = errorsObj.response.data.payload

  if (errors === undefined) {
    Notify.create({
      type: 'negative',
      message: '500  Sistem Hatası',
      timeout: 1000,
      position: 'bottom-right',
      progress: true,
    })
  }
}

export const fireNotify = (message, group = 'created', duration = 180000, type = 'positive') => {
  Notify.create({
    group: group,
    position: 'bottom-right',
    type: type,
    //textColor: 'white',
    message: message,
    timeout: duration,
    progress: true,
    classes: '',
    actions: [
      {
        icon: 'close',
        // color: 'white',
        handler: () => {
          /* ... */
        },
      },
    ],
    attrs: {
      role: 'alertdialog',
    },
  })
}
