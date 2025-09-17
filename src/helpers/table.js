import { date } from 'quasar'
import { formatPrice, priceAbsFormatted } from './helpers'

const defaultAlign = 'center'
const sortableFields = ['id', 'totalAmount']
const dateFormatFields = ['createdAt', 'updatedAt', 'creationDate']
const numberFormatFields = ['totalAmount', 'amount', 'price', 'total']
const requiredFields = ['id']

const formatValue = (value, fieldType, customFormat) => {
  if (dateFormatFields.includes(value)) {
    return date.formatDate(value, 'DD.MM.YYYY HH:mm')
  }
  if (numberFormatFields.includes(fieldType)) {
    return formatPrice(value)
  }
  if (fieldType === 'priceAbs') {
    return priceAbsFormatted(value)
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }
  if (fieldType === 'date') {
    return date.formatDate(value, 'DD.MM.YYYY HH:mm')
  }
  if (customFormat) {
    return customFormat(value)
  }
  return value || '-'
}
const camelCaseToSentence = (str) => {
  return str.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
    return str.toUpperCase()
  })
}
export const generateColumns = (columnConfigs) => {
  return columnConfigs.map((config, index) => ({
    name: config.name || config.field,
    required: requiredFields.includes(config.field) || false,
    label: config.label || camelCaseToSentence(config.field),
    align: config.align || defaultAlign,
    field: config.field,
    locale: config.locale || config.field,
    format: (value) =>
      config.format
        ? config.format(value)
        : formatValue(value, config.fieldType, config.customFormat),
    sortable: config.sortable || sortableFields.includes(config.field) || false,
    sort: config.sort,
    visible: config.visible === false ? false : true,
    colId: config.colId || index,
    orderColumn: config.orderColumn || index,
    defaultVisible: config.defaultVisible || false,
    classes: config.class || '',
  }))
}
