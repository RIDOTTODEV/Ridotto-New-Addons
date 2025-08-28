<script setup>
import { ref, inject, onMounted, watch } from 'vue'
import { i18n } from 'boot/i18n'
import { date, useQuasar } from 'quasar'
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

const persistent = ref(false)
const dropDownMenu = ref(false)
const emits = defineEmits(['selectedDate'])
const props = defineProps({
  setDateByLabel: {
    type: String,
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
      StartDate: date.formatDate(new Date(), 'YYYY-MM-DDT00:00:00+0000'),
      EndDate: date.formatDate(new Date(), 'YYYY-MM-DDT23:59:59+0000'),
      QueryType: 'byGamingDate',
    },
    {
      label: i18n.global.t('yesterday'),
      StartDate: date.formatDate(
        date.subtractFromDate(new Date(), { days: 1 }),
        'YYYY-MM-DDT00:00:00+0000',
      ),
      EndDate: date.formatDate(
        date.subtractFromDate(new Date(), { days: 1 }),
        'YYYY-MM-DDT23:59:59+0000',
      ),
      QueryType: 'byGamingDate',
    },
    {
      label: i18n.global.t('thisWeek'),
      StartDate: date.formatDate(getMonday(new Date()), 'YYYY-MM-DDT00:00:00+0000'),
      EndDate: date.formatDate(new Date(), 'YYYY-MM-DDT23:59:59+0000'),
      QueryType: 'byGamingDate',
    },
    {
      label: i18n.global.t('thisMonth'),
      StartDate: date.formatDate(getThisMonth(), 'YYYY-MM-DDT00:00:00+0000'),
      EndDate: date.formatDate(new Date(), 'YYYY-MM-DDT23:59:59+0000'),
      QueryType: 'byGamingDate',
    },
    {
      label: i18n.global.t('thisYear'),
      StartDate: date.formatDate(new Date().getFullYear() + '-01-01', 'YYYY-MM-DDT00:00:00+0000'),
      EndDate: date.formatDate(new Date().getFullYear() + '-12-31', 'YYYY-MM-DDT23:59:59+0000'),
      QueryType: 'byGamingDate',
    },
  ],
  times: [
    {
      label: i18n.global.t('last15Minutes'),
      StartDate: date.formatDate(
        date.subtractFromDate(new Date(), { minutes: 15 }),
        'YYYY-MM-DD HH:mm:ss',
      ),
      EndDate: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
      QueryType: 'byTime',
    },
    {
      label: i18n.global.t('last30Minutes'),
      StartDate: date.formatDate(
        date.subtractFromDate(new Date(), { minutes: 30 }),
        'YYYY-MM-DD HH:mm:ss',
      ),
      EndDate: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
      QueryType: 'byTime',
    },
    {
      label: i18n.global.t('last1Hour'),
      StartDate: date.formatDate(
        date.subtractFromDate(new Date(), { hours: 1 }),
        'YYYY-MM-DD HH:mm:ss',
      ),
      EndDate: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
      QueryType: 'byTime',
    },
    {
      label: i18n.global.t('last24Hours'),
      StartDate: date.formatDate(
        date.subtractFromDate(new Date(), { hours: 24 }),
        'YYYY-MM-DD HH:mm:ss',
      ),
      EndDate: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
      QueryType: 'byTime',
    },
    {
      label: i18n.global.t('last7Days'),
      StartDate: date.formatDate(
        date.subtractFromDate(new Date(), { days: 6 }),
        'YYYY-MM-DDT00:00:00+0000',
      ),
      EndDate: date.formatDate(new Date(), 'YYYY-MM-DDT00:00:00+0000'),
      QueryType: 'byGamingDate',
    },
  ],
  months: [
    {
      label: i18n.global.t('last1Month'),
      StartDate: date.formatDate(
        date.subtractFromDate(new Date(), { months: 1 }),
        'YYYY-MM-DDT00:00:00+0000',
      ),
      EndDate: date.formatDate(new Date(), 'YYYY-MM-DDT00:00:00+0000'),
      QueryType: 'byGamingDate',
    },
    {
      label: i18n.global.t('last2Months'),
      StartDate: date.formatDate(
        date.subtractFromDate(new Date(), { months: 2 }),
        'YYYY-MM-DDT00:00:00+0000',
      ),
      EndDate: date.formatDate(new Date(), 'YYYY-MM-DDT00:00:00+0000'),
      QueryType: 'byGamingDate',
    },
    {
      label: i18n.global.t('last3Months'),
      StartDate: date.formatDate(
        date.subtractFromDate(new Date(), { months: 3 }),
        'YYYY-MM-DDT00:00:00+0000',
      ),
      EndDate: date.formatDate(new Date(), 'YYYY-MM-DDT00:00:00+0000'),
      QueryType: 'byGamingDate',
    },
    {
      label: i18n.global.t('last6Months'),
      StartDate: date.formatDate(
        date.subtractFromDate(new Date(), { months: 6 }),
        'YYYY-MM-DDT00:00:00+0000',
      ),
      EndDate: date.formatDate(new Date(), 'YYYY-MM-DDT00:00:00+0000'),
      QueryType: 'byGamingDate',
    },
    {
      label: i18n.global.t('last1Year'),
      StartDate: date.formatDate(
        date.subtractFromDate(new Date(), { years: 1 }),
        'YYYY-MM-DDT00:00:00+0000',
      ),
      EndDate: date.formatDate(new Date(), 'YYYY-MM-DDT00:00:00+0000'),
      QueryType: 'byGamingDate',
    },
  ],
  custom: {
    customDateTime: {
      label: i18n.global.t('customDateTime'),
      value: '',
      QueryType: 'byGamingDate',
    },
    customGamingDateTime: {
      label: i18n.global.t('customGamingDate'),
      value: '',
      QueryType: 'byTime',
    },
  },
})
const showInput = ref('')
const $q = useQuasar()
const onClickShowInput = (inputName) => {
  showInput.value = inputName
  persistent.value = true
}
const onSelectDate = (param) => {
  let selectedDateParams = { ...param }
  selectedDate.value = selectedDateParams
  emits('selectedDate', selectedDateParams)
  dropDownMenu.value = false
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
  let param = JSON.parse(JSON.stringify(dateParam))

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
        ? date.formatDate(param[0], 'YYYY-MM-DDTHH:mm:ss') + '.000Z'
        : date.formatDate(new Date(), 'YYYY-MM-DDTHH:mm:ss') + '.000Z'
      selectedDate.value.EndDate = param[1]
        ? date.formatDate(param[1], 'YYYY-MM-DDTHH:mm:ss') + '.000Z'
        : date.formatDate(new Date(), 'YYYY-MM-DDTHH:mm:ss') + '.000Z'
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
    // set to null of custom date time field
    filterFields.value.custom.customGamingDateTime.value = ''
    filterFields.value.custom.customDateTime.value = ''
  }

  let selectedDateParams = { ...selectedDate.value }
  // delete selectedDateParams.label
  emits('selectedDate', selectedDateParams)
  modelValue.value = {
    ...modelValue.value,
    ...selectedDateParams,
  }
  bus.emit('selectedDateFilter', selectedDateParams, false)
  dropDownMenu.value = false

  /*   console.log(dateParam, queryType, label, dateFormat)

  let param = JSON.parse(JSON.stringify(dateParam))
  if (queryType === 'byGamingDate') {
    selectedDate.value.StartDate = date.formatDate(param[0], dateFormat) + 'T00:00:00.000Z'
    selectedDate.value.EndDate = date.formatDate(param[1], dateFormat) + 'T00:00:00.000Z'
    selectedDate.value.QueryType = queryType
    selectedDate.value.label = `${date.formatDate(param[0], dateFormat)} - ${date.formatDate(param[1], dateFormat)}`
  } else {
    selectedDate.value.StartDate = dateParam[0]
    selectedDate.value.EndDate = dateParam[1]
    selectedDate.value.QueryType = queryType
    selectedDate.value.label = label
  }
  dropDownMenu.value = false */
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

const onBeforeShowMenu = () => {
  if (showInput.value !== '') {
    persistent.value = true
  }
}
onMounted(() => {
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
  <div class="flex flex-wrap items-center">
    <q-btn
      size="13px"
      unelevated
      :color="$q.dark.isActive ? 'grey-3' : 'grey-3'"
      text-color="grey-10"
      no-caps
      icon-right="o_date_range"
      :label="selectedDate.label"
      :disabled="disabled"
      :class="btnClass"
      :no-wrap="noWrap"
    >
      <q-menu
        :persistent="persistent"
        :offset="[0, 3]"
        :auto-close="false"
        class="no-box-shadow q-card--bordered"
        style="width: 500px"
        square
        v-model="dropDownMenu"
        @beforeShow="onBeforeShowMenu"
      >
        <q-card class="no-box-shadow" square>
          <q-card-section class="row q-pb-none">
            <div class="col-4 text-left">
              <q-list dense>
                <q-item
                  clickable
                  v-ripple
                  v-for="(date, index) in filterFields.dates"
                  :key="index"
                  @click="onSelectDate(date)"
                  :active="selectedDate.label === date.label"
                >
                  <q-item-section class="datatableDateFilter">
                    {{ date.label }}
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div class="col-4">
              <q-list dense>
                <q-item
                  clickable
                  v-ripple
                  v-for="(date, index) in filterFields.times"
                  :key="index"
                  @click="onSelectDate(date)"
                  :active="selectedDate.label === date.label"
                >
                  <q-item-section class="datatableDateFilter">
                    {{ date.label }}
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div class="col-4">
              <q-list dense>
                <q-item
                  clickable
                  v-ripple
                  v-for="(date, index) in filterFields.months"
                  :key="index"
                  @click="onSelectDate(date)"
                  :active="selectedDate.label === date.label"
                >
                  <q-item-section class="datatableDateFilter">
                    {{ date.label }}
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-card-section>
          <q-card-section class="row q-pt-none q-pb-sm">
            <div class="col-6 q-pa-xs text-center">
              <div
                :class="
                  showInput === 'customGamingDateTime'
                    ? 'text-subtitle1 cursor-pointer text-primary'
                    : 'text-subtitle1 cursor-pointer'
                "
                @click="onClickShowInput('customGamingDateTime')"
              >
                {{ $t('customGamingDate') }}
              </div>
            </div>
            <div class="col-6 q-pa-xs">
              <div
                :class="
                  showInput === 'customDateTime'
                    ? 'text-subtitle1 text-center cursor-pointer text-primary'
                    : 'text-subtitle1 text-center cursor-pointer'
                "
                @click="onClickShowInput('customDateTime')"
              >
                {{ $t('customDateTime') }}
              </div>
            </div>
          </q-card-section>
          <q-card-section class="row q-pt-none" v-if="showInput === 'customGamingDateTime'">
            <el-date-picker
              clearable
              popper-class="datatable-datepicker"
              size="default"
              v-model="filterFields.custom.customGamingDateTime.value"
              type="daterange"
              range-separator="To"
              start-placeholder="Başlama Tarihi"
              end-placeholder="Bitiş Tarihi"
              @change="
                onSelectCustomDate(
                  $event,
                  'byGamingDate',
                  filterFields.custom.customGamingDateTime.label,
                  'YYYY-MM-DD',
                )
              "
            />

            <q-btn
              icon="close"
              flat
              dense
              class="q-ml-sm"
              @click="
                onSelectCustomDate(
                  null,
                  'byGamingDate',
                  filterFields.custom.customGamingDateTime.label,
                  'YYYY-MM-DD',
                )
              "
            />
          </q-card-section>
          <q-card-section class="row q-pt-none" v-if="showInput === 'customDateTime'">
            <el-date-picker
              popper-class="datatable-datepicker"
              size="default"
              v-model="filterFields.custom.customDateTime.value"
              type="datetimerange"
              range-separator="To"
              start-placeholder="Başlama Tarihi"
              end-placeholder="Bitiş Tarihi"
              @change="
                onSelectCustomDate(
                  $event,
                  'byTime',
                  filterFields.custom.customGamingDateTime.label,
                  'YYYY-MM-DD HH:mm:ss',
                )
              "
            />
            <q-btn
              icon="close"
              flat
              dense
              class="q-ml-sm"
              @click="
                onSelectCustomDate(
                  null,
                  'byTime',
                  filterFields.custom.customGamingDateTime.label,
                  'YYYY-MM-DD',
                )
              "
            />
          </q-card-section>
        </q-card>
      </q-menu>
    </q-btn>
  </div>
</template>

<style>
.example-showcase .el-dropdown + .el-dropdown {
  margin-left: 15px;
}

.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}

.datatable-datepicker {
  z-index: 6001 !important;
}
.p-datepicker-panel {
  z-index: 6001 !important;
}
</style>
