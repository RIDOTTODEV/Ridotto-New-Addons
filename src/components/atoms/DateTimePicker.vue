<script setup>
import { ref, computed, inject, onMounted, watch } from 'vue'
import { i18n } from 'boot/i18n'
import { date } from 'quasar'
import PPopover from 'primevue/popover'
import PDatePicker from 'primevue/datepicker'
import PButton from 'primevue/button'

const bus = inject('bus')
const getMonday = (d) => {
  d = new Date(d)
  let day = d.getDay(),
    diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.setDate(diff))
}
const getThisMonth = () => {
  let today = new Date()
  let currentMonth = today.getMonth()
  let currentYear = today.getFullYear()
  return new Date(currentYear, currentMonth, 1)
}

const modelValue = defineModel({
  required: false,
  default: () => null,
})

const dropDownMenu = ref(false)
const emits = defineEmits(['selectedDate'])
const props = defineProps({
  setDateByLabel: {
    type: String,
    required: false,
    default: () => null,
  },
  setDate: {
    type: Object,
    required: false,
    default: () => null,
  },
  disabled: {
    type: Boolean,
    required: false,
    default: () => false,
  },
  btnClass: {
    type: String,
    required: false,
    default: () => '',
  },
  fieldClass: {
    type: String,
    required: false,
    default: () => 'super-small',
  },
  label: {
    type: String,
    required: false,
    default: () => '',
  },
  noWrap: {
    type: Boolean,
    required: false,
    default: () => true,
  },
})
const selectedDate = ref({
  StartDate: '',
  EndDate: '',
  QueryType: '',
  label: '',
})
const filterFields = ref({
  dates: [
    {
      label: i18n.global.t('today'),
      StartDate: date.formatDate(new Date(), 'YYYY-MM-DD') + 'T00:00:00.000Z',
      EndDate: date.formatDate(new Date(), 'YYYY-MM-DD') + 'T23:59:59.999Z',
      QueryType: 'byGamingDate',
    },
    {
      label: i18n.global.t('yesterday'),
      StartDate:
        date.formatDate(date.subtractFromDate(new Date(), { days: 1 }), 'YYYY-MM-DD') +
        'T00:00:00.000Z',
      EndDate:
        date.formatDate(date.subtractFromDate(new Date(), { days: 1 }), 'YYYY-MM-DD') +
        'T23:59:59.999Z',
      QueryType: 'byGamingDate',
    },
    {
      label: i18n.global.t('thisWeek'),
      StartDate: date.formatDate(getMonday(new Date()), 'YYYY-MM-DD') + 'T00:00:00.000Z',
      EndDate: date.formatDate(new Date(), 'YYYY-MM-DD') + 'T23:59:59.999Z',
      QueryType: 'byGamingDate',
    },
    {
      label: i18n.global.t('thisMonth'),
      StartDate: date.formatDate(getThisMonth(), 'YYYY-MM-DD') + 'T00:00:00.000Z',
      EndDate: date.formatDate(new Date(), 'YYYY-MM-DD') + 'T23:59:59.999Z',
      QueryType: 'byGamingDate',
    },
    {
      label: i18n.global.t('thisYear'),
      StartDate:
        date.formatDate(new Date().getFullYear() + '-01-01', 'YYYY-MM-DD') + 'T00:00:00.000Z',
      EndDate:
        date.formatDate(new Date().getFullYear() + '-12-31', 'YYYY-MM-DD') + 'T23:59:59.999Z',
      QueryType: 'byGamingDate',
    },
  ],
  times: [
    {
      label: i18n.global.t('last15Minutes'),
      StartDate: new Date(date.subtractFromDate(new Date(), { minutes: 15 })).toISOString(),
      EndDate: new Date().toISOString(),
      QueryType: 'byTime',
    },
    {
      label: i18n.global.t('last30Minutes'),
      StartDate: new Date(date.subtractFromDate(new Date(), { minutes: 30 })).toISOString(),
      EndDate: new Date().toISOString(),
      QueryType: 'byTime',
    },
    {
      label: i18n.global.t('last1Hour'),
      StartDate: new Date(date.subtractFromDate(new Date(), { hours: 1 })).toISOString(),
      EndDate: new Date().toISOString(),
      QueryType: 'byTime',
    },
    {
      label: i18n.global.t('last24Hours'),
      StartDate: new Date(date.subtractFromDate(new Date(), { hours: 24 })).toISOString(),
      EndDate: new Date().toISOString(),
      QueryType: 'byTime',
    },
    {
      label: i18n.global.t('last7Days'),
      StartDate:
        date.formatDate(date.subtractFromDate(new Date(), { days: 7 }), 'YYYY-MM-DD') +
        'T00:00:00.000Z',
      EndDate: date.formatDate(new Date(), 'YYYY-MM-DD') + 'T23:59:59.999Z',
      QueryType: 'byGamingDate',
    },
  ],
  months: [
    {
      label: i18n.global.t('last1Month'),
      StartDate:
        date.formatDate(date.subtractFromDate(new Date(), { months: 1 }), 'YYYY-MM-DD') +
        'T00:00:00.000Z',
      EndDate: date.formatDate(new Date(), 'YYYY-MM-DD') + 'T23:59:59.999Z',
      QueryType: 'byGamingDate',
    },
    {
      label: i18n.global.t('last2Months'),
      StartDate:
        date.formatDate(date.subtractFromDate(new Date(), { months: 2 }), 'YYYY-MM-DD') +
        'T00:00:00.000Z',
      EndDate: date.formatDate(new Date(), 'YYYY-MM-DD') + 'T23:59:59.999Z',
      QueryType: 'byGamingDate',
    },
    {
      label: i18n.global.t('last3Months'),
      StartDate:
        date.formatDate(date.subtractFromDate(new Date(), { months: 3 }), 'YYYY-MM-DD') +
        'T00:00:00.000Z',
      EndDate: date.formatDate(new Date(), 'YYYY-MM-DD') + 'T23:59:59.999Z',
      QueryType: 'byGamingDate',
    },
    {
      label: i18n.global.t('last6Months'),
      StartDate:
        date.formatDate(date.subtractFromDate(new Date(), { months: 6 }), 'YYYY-MM-DD') +
        'T00:00:00.000Z',
      EndDate: date.formatDate(new Date(), 'YYYY-MM-DD') + 'T23:59:59.999Z',
      QueryType: 'byGamingDate',
    },
    {
      label: i18n.global.t('last1Year'),
      StartDate:
        date.formatDate(date.subtractFromDate(new Date(), { years: 1 }), 'YYYY-MM-DD') +
        'T00:00:00.000Z',
      EndDate: date.formatDate(new Date(), 'YYYY-MM-DD') + 'T23:59:59.999Z',
      QueryType: 'byGamingDate',
    },
  ],
  custom: {
    customDateTime: {
      label: i18n.global.t('customDateTime'),
      value: null,
      QueryType: 'byGamingDate',
    },
    customGamingDateTime: {
      label: i18n.global.t('customGamingDate'),
      value: null,
      QueryType: 'byTime',
    },
  },
})

// preset column definitions (items live in filterFields)
const presetGroups = [
  { key: 'dates', icon: 'o_today', titleKey: 'date' },
  { key: 'times', icon: 'o_schedule', titleKey: 'time' },
  { key: 'months', icon: 'o_calendar_month', titleKey: 'period' },
]

const popoverRef = ref(null)
const showInput = ref('')
const onClickShowInput = (inputName) => {
  showInput.value = inputName
}
const togglePopover = (event) => {
  if (props.disabled) return
  popoverRef.value?.toggle(event)
}
const hidePopover = () => {
  popoverRef.value?.hide()
}
const onSelectDate = (param) => {
  let selectedDateParams = { ...param }
  selectedDate.value = selectedDateParams
  emits('selectedDate', selectedDateParams)
  hidePopover()
  if (showInput.value !== '') {
    showInput.value = ''
  }
  modelValue.value = {
    ...modelValue.value,
    ...selectedDateParams,
  }
  bus.emit('selectedDateFilter', selectedDateParams, false)
}
const onSelectCustomDate = (dateParam, queryType, label, dateFormat) => {
  let param = dateParam !== null ? JSON.parse(JSON.stringify(dateParam)) : null

  if (param !== null) {
    selectedDate.value.QueryType = queryType
    if (queryType === 'byGamingDate') {
      selectedDate.value.StartDate = param[0]
        ? date.formatDate(param[0], dateFormat) + 'T00:00:00.000Z'
        : date.formatDate(new Date(), dateFormat) + 'T00:00:00.000Z'
      selectedDate.value.EndDate = param[1]
        ? date.formatDate(param[1], dateFormat) + 'T23:59:59.999Z'
        : date.formatDate(new Date(), dateFormat) + 'T23:59:59.999Z'
      selectedDate.value.label = `${date.formatDate(param[0], dateFormat)} - ${date.formatDate(param[1], dateFormat)}`
    } else {
      selectedDate.value.StartDate = param[0]
        ? new Date(param[0]).toISOString()
        : new Date().toISOString()
      selectedDate.value.EndDate = param[1]
        ? new Date(param[1]).toISOString()
        : new Date().toISOString()
      selectedDate.value.label =
        date.formatDate(selectedDate.value.StartDate, 'DD.MM.YYYY HH:mm') +
        ' - ' +
        date.formatDate(selectedDate.value.EndDate, 'DD.MM.YYYY HH:mm')
    }
  } else {
    selectedDate.value.StartDate = date.formatDate(new Date(), dateFormat)
    selectedDate.value.EndDate = date.formatDate(new Date(), dateFormat)
    selectedDate.value.QueryType = queryType
    selectedDate.value.label = i18n.global.t('today')
    showInput.value = ''
    // set to null of custom date time fields
    filterFields.value.custom.customGamingDateTime.value = null
    filterFields.value.custom.customDateTime.value = null
  }

  let selectedDateParams = { ...selectedDate.value }
  // delete selectedDateParams.label
  emits('selectedDate', selectedDateParams)
  modelValue.value = {
    ...modelValue.value,
    ...selectedDateParams,
  }
  bus.emit('selectedDateFilter', selectedDateParams, false)
  hidePopover()
}

// custom gaming date (date-only range) — user picks range, then explicitly applies
const canApplyCustomGamingDate = computed(() => {
  const v = filterFields.value.custom.customGamingDateTime.value
  return Array.isArray(v) && !!v[0] && !!v[1]
})
const applyCustomGamingDate = () => {
  if (!canApplyCustomGamingDate.value) return
  onSelectCustomDate(
    filterFields.value.custom.customGamingDateTime.value,
    'byGamingDate',
    filterFields.value.custom.customGamingDateTime.label,
    'YYYY-MM-DD',
  )
}
const clearCustomGamingDate = () => {
  onSelectCustomDate(
    null,
    'byGamingDate',
    filterFields.value.custom.customGamingDateTime.label,
    'YYYY-MM-DD',
  )
}

// custom date & time (range + start/end times, applied explicitly)
const buildTime = (hours, minutes, seconds) => {
  const d = new Date()
  d.setHours(hours, minutes, seconds, 0)
  return d
}
const customTimeRange = ref(null)
const customStartTime = ref(buildTime(0, 0, 0))
const customEndTime = ref(buildTime(23, 59, 59))
const canApplyCustomDateTime = computed(
  () =>
    Array.isArray(customTimeRange.value) && !!customTimeRange.value[0] && !!customTimeRange.value[1],
)
const applyCustomDateTime = () => {
  if (!canApplyCustomDateTime.value) return
  const start = new Date(customTimeRange.value[0])
  const end = new Date(customTimeRange.value[1])
  const startTime = customStartTime.value ? new Date(customStartTime.value) : null
  const endTime = customEndTime.value ? new Date(customEndTime.value) : null
  start.setHours(
    startTime ? startTime.getHours() : 0,
    startTime ? startTime.getMinutes() : 0,
    startTime ? startTime.getSeconds() : 0,
    0,
  )
  end.setHours(
    endTime ? endTime.getHours() : 23,
    endTime ? endTime.getMinutes() : 59,
    endTime ? endTime.getSeconds() : 59,
    0,
  )
  filterFields.value.custom.customDateTime.value = [start, end]
  onSelectCustomDate(
    [start, end],
    'byTime',
    filterFields.value.custom.customDateTime.label,
    'YYYY-MM-DD HH:mm:ss',
  )
}
const clearCustomDateTime = () => {
  customTimeRange.value = null
  customStartTime.value = buildTime(0, 0, 0)
  customEndTime.value = buildTime(23, 59, 59)
  onSelectCustomDate(
    null,
    'byTime',
    filterFields.value.custom.customDateTime.label,
    'YYYY-MM-DD',
  )
}

// Watch for modelValue changes from parent
watch(
  () => modelValue.value,
  (newValue) => {
    if (newValue && newValue.StartDate && newValue.EndDate) {
      selectedDate.value = {
        StartDate: newValue.StartDate,
        EndDate: newValue.EndDate,
        QueryType: newValue.QueryType || 'byGamingDate',
        label: newValue.label || '',
      }
    }
  },
  { deep: true, immediate: true },
)

// initialize
selectedDate.value = {
  ...filterFields.value.dates[0],
}
let selectedDateParams = { ...selectedDate.value }
// delete selectedDateParams.label
emits('selectedDate', selectedDateParams)
//bus.emit("selectedDateFilter", selectedDateParams, true);

onMounted(() => {
  if (props.setDate) {
    onSelectDate(props.setDate)
  }
  if (props.setDateByLabel !== null) {
    let selectedDate = filterFields.value.dates.find((date) => date.label === props.setDateByLabel)
    if (selectedDate) {
      onSelectDate(selectedDate)
      return
    }
  }
})
</script>
<template>
  <div class="flex flex-col sm:flex-row gap-2 date-time-picker">
    <button type="button" class="dtp-trigger" :class="[
      fieldClass,
      btnClass,
      { 'dtp-trigger--open': dropDownMenu, 'dtp-trigger--nowrap': noWrap },
    ]" :disabled="disabled" @click="togglePopover">
      <span class="dtp-trigger__icon">
        <q-icon name="o_event" size="16px" />
      </span>
      <span class="dtp-trigger__content">
        <span class="dtp-trigger__label">{{ label || $t('dateRange') }}</span>
        <span class="dtp-trigger__value">{{ selectedDate.label }}</span>
      </span>
      <q-icon name="expand_more" size="20px" class="dtp-trigger__arrow"
        :class="{ 'dtp-trigger__arrow--open': dropDownMenu }" />
    </button>

    <p-popover ref="popoverRef" class="dtp-popover" :base-z-index="6001" @show="dropDownMenu = true"
      @hide="dropDownMenu = false">
      <div class="dtp-panel">
        <!-- <div class="dtp-panel__header">
          <span class="dtp-panel__header-icon">
            <q-icon name="o_event" size="20px" />
          </span>
          <div class="dtp-panel__header-texts">
            <div class="dtp-panel__title">{{ label || $t('dateRange') }}</div>
            <div class="dtp-panel__subtitle">{{ selectedDate.label }}</div>
          </div>
        </div> -->

        <transition name="dtp-view" mode="out-in">
          <!-- preset lists -->
          <div v-if="showInput === ''" key="presets" class="dtp-view">
            <div class="dtp-presets">
              <div v-for="group in presetGroups" :key="group.key" class="dtp-presets__col">
                <div class="dtp-presets__head">
                  <q-icon :name="group.icon" size="14px" />
                  <span>{{ $t(group.titleKey) }}</span>
                </div>
                <button v-for="(dateItem, index) in filterFields[group.key]" :key="index" type="button"
                  class="dtp-presets__item"
                  :class="{ 'dtp-presets__item--active': selectedDate.label === dateItem.label }"
                  @click="onSelectDate(dateItem)">
                  <span class="dtp-presets__item-label">{{ dateItem.label }}</span>
                  <q-icon v-if="selectedDate.label === dateItem.label" name="check" size="14px" />
                </button>
              </div>
            </div>

            <div class="dtp-customlinks">
              <button type="button" class="dtp-customlinks__btn" @click="onClickShowInput('customGamingDateTime')">
                <span class="dtp-customlinks__icon">
                  <q-icon name="o_date_range" size="18px" />
                </span>
                <span class="dtp-customlinks__texts">
                  <span class="dtp-customlinks__title">{{ $t('customGamingDate') }}</span>
                  <span class="dtp-customlinks__hint">{{ $t('fullDayRange') }}</span>
                </span>
                <q-icon name="chevron_right" size="18px" class="dtp-customlinks__chevron" />
              </button>
              <button type="button" class="dtp-customlinks__btn" @click="onClickShowInput('customDateTime')">
                <span class="dtp-customlinks__icon">
                  <q-icon name="o_more_time" size="18px" />
                </span>
                <span class="dtp-customlinks__texts">
                  <span class="dtp-customlinks__title">{{ $t('customDateTime') }}</span>
                  <span class="dtp-customlinks__hint">{{ $t('preciseTimeRange') }}</span>
                </span>
                <q-icon name="chevron_right" size="18px" class="dtp-customlinks__chevron" />
              </button>
            </div>
          </div>

          <!-- custom gaming date (date-only range) -->
          <div v-else-if="showInput === 'customGamingDateTime'" key="gaming" class="dtp-view">
            <div class="dtp-view__bar">
              <button type="button" class="dtp-view__back" @click="showInput = ''">
                <q-icon name="arrow_back" size="17px" />
              </button>
              <div class="dtp-view__bar-texts">
                <div class="dtp-view__bar-title">{{ $t('customGamingDate') }}</div>
                <div class="dtp-view__bar-hint">{{ $t('selectStartAndEndDate') }}</div>
              </div>
            </div>
            <div class="dtp-calendar-wrap">
              <p-date-picker v-model="filterFields.custom.customGamingDateTime.value" inline selection-mode="range"
                :manual-input="false" select-other-months class="dtp-calendar" size="small" />
            </div>
            <div class="dtp-view__footer">
              <p-button :label="$t('clear')" icon="pi pi-times" severity="primary" outlined size="small"
                class="dtp-action-btn" @click="clearCustomGamingDate" />
              <p-button :label="$t('apply')" icon="pi pi-check" severity="primary" size="small" class="dtp-action-btn"
                :disabled="!canApplyCustomGamingDate" @click="applyCustomGamingDate" />
            </div>
          </div>

          <!-- custom date & time (range + start/end time) -->
          <div v-else key="datetime" class="dtp-view">
            <div class="dtp-view__bar">
              <button type="button" class="dtp-view__back" @click="showInput = ''">
                <q-icon name="arrow_back" size="17px" />
              </button>
              <div class="dtp-view__bar-texts">
                <div class="dtp-view__bar-title">{{ $t('customDateTime') }}</div>
                <div class="dtp-view__bar-hint">{{ $t('selectStartAndEndDate') }}</div>
              </div>
            </div>
            <div class="dtp-calendar-wrap">
              <p-date-picker v-model="customTimeRange" inline selection-mode="range" :manual-input="false"
                select-other-months class="dtp-calendar" size="small" />
            </div>
            <div class="dtp-times">
              <div class="dtp-times__field">
                <span class="dtp-times__label">
                  <q-icon name="o_schedule" size="13px" />
                  {{ $t('startTime') }}
                </span>
                <p-date-picker v-model="customStartTime" inline time-only hour-format="24" size="small"
                  class="dtp-timepicker" />
              </div>
              <div class="dtp-times__field">
                <span class="dtp-times__label">
                  <q-icon name="o_schedule" size="13px" />
                  {{ $t('endTime') }}
                </span>
                <p-date-picker v-model="customEndTime" inline time-only hour-format="24" class="dtp-timepicker"
                  size="small" />
              </div>
            </div>
            <div class="dtp-view__footer">
              <p-button :label="$t('clear')" icon="pi pi-times" severity="primary" outlined size="small"
                class="dtp-action-btn" @click="clearCustomDateTime" />
              <p-button :label="$t('apply')" icon="pi pi-check" severity="primary" size="small" class="dtp-action-btn"
                :disabled="!canApplyCustomDateTime" @click="applyCustomDateTime" />
            </div>
          </div>
        </transition>
      </div>
    </p-popover>
  </div>
</template>

<style lang="scss">
@import 'src/css/assets/_datetimepicker.scss';
</style>
