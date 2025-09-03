<template>
  <q-table
    v-draggable-table="{
      onDrop,
    }"
    flat
    bordered
    :rows="tableRows"
    :columns="tableColumns"
    :visible-columns="visibleColumns"
    row-key="id"
    dense
    separator="cell"
    :rows-per-page-options="[0]"
    :loading="tableLoading"
    ref="refTable"
    class="no-box-shadow col-12 supa-table"
    :filter="tableFilterInput"
    :pagination="pagination"
    @row-click="onRowClick"
  >
    <template v-slot:top="">
      <div class="flex row full-width q-pa-sm">
        <slot name="headerFilterSlots" v-bind="{ props: { ...props, reload: fetchData } }"></slot>
        <div :class="['flex row justify-end items-start', props.useCol12 ? 'col-12' : 'col']">
          <q-input
            v-if="hideFields && hideFields.showSearchInput"
            v-model="tableFilterInput"
            dense
            outlined
            class="super-small search-input q-ml-xs q-mr-xs"
            :class="{ 'search-input--focused': isInputFocused }"
            :placeholder="$t('search')"
            @focus="handleInputFocus"
            @focusout="handleInputFocusOut"
            clearable
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-btn-dropdown
            v-if="hideFields && hideFields.showVisibleColumns"
            color="grey-3"
            text-color="grey-10"
            unelevated
            dense
            size="13px"
            class="q-ml-xs q-mr-xs"
            padding="xs"
            dropdown-icon="o_visibility"
            square
            :content-style="{
              height: '400px!important',
            }"
          >
            <div class="bg-grey-2 q-pa-xs text-center text-subtitle2">
              {{ $t('visibleColumns') }}
            </div>
            <q-list dense separator bordered>
              <q-item
                clickable
                v-for="(column, index) in tableColumns"
                :key="index"
                :class="{
                  'text-primary': visibleColumns.includes(column.name),
                }"
                @click="onSelectVisibleColumn(column.name)"
                :disable="column.required"
              >
                <q-item-section class="text-capitalize text-caption">
                  {{ column.label }}
                </q-item-section>
              </q-item>
              <q-item clickable @click="resetColumns" class="bg-grey-2 text-caption">
                <q-item-section class="text-negative flex content-center">
                  <div class="row items-center">
                    <q-icon name="sync" size="16px" class="q-mr-sm" />
                    {{ $t('resetColumns') }}
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-btn
            v-if="hideFields && hideFields.showReloadButton"
            color="grey-3"
            text-color="grey-10"
            unelevated
            dense
            icon="cached"
            @click="fetchData"
            size="13px"
            class="q-ml-xs q-mr-xs"
            padding="xs"
          />
          <q-btn
            v-if="hideFields && hideFields.showScreenModeButton"
            color="grey-3"
            text-color="grey-10"
            dense
            :icon="fullScreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="toggleFullscreen"
            size="13px"
            unelevated
            class="q-ml-xs q-mr-xs"
            padding="xs"
          />
        </div>
      </div>
    </template>
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th
          auto-width
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
          class="text-center q-custom-table"
        >
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>
    <template v-slot:bottom>
      <div
        class="full-width q-mt-xs q-mb-xs row col-12 flex content-center items-center justify-end"
      >
        <div class="text-subtitle2 q-mr-md">
          Total:
          <strong class="q-ml-xs q-mr-xs">{{ pagination.totalCount }}</strong>
          Records
        </div>
        <q-select
          v-model="pagination.rowsPerPage"
          options-dense
          :options="[10, 20, 50, 100, 500]"
          borderless
          dense
          class="super-small"
          filled
          @update:model-value="onChangeRowsPerPage"
          behavior="menu"
        />
        <div class="text-subtitle2 q-ml-sm">Rows Per Page</div>

        <q-pagination
          v-if="pagination.totalCount >= pagination.rowsPerPage"
          v-model="pagination.page"
          color="grey-8"
          :max="pagination.totalPages"
          max-pages="6"
          size="md"
          active-color="primary"
          @update:model-value="fetchData"
          boundary-links
          boundary-numbers
          direction-links
          class="q-pr-md"
        />
      </div>
    </template>
    <template v-slot:body-cell-actions="props">
      <q-td :props="props" class="text-right">
        <q-btn
          icon="data_object"
          dense
          size="13px"
          unelevated
          @click="showTheJsonDetail(props.row.detail)"
          v-if="props.row?.detail && props.row?.detail !== null"
          class="q-mr-xs"
        />
        <q-btn
          v-for="(action, index) in tableBodyActions"
          :key="index"
          :icon="action.icon"
          :color="action.color"
          @click="action.fn(props.row[action.args], filter)"
          dense
          size="13px"
          unelevated
          flat
        />
      </q-td>
    </template>
    <template v-for="slotName in slotNames" v-slot:[slotName]="props">
      <slot :name="slotName" v-bind="{ props }"></slot>
    </template>
  </q-table>
</template>

<script setup>
import ShowJsonDetailDialog from './ShowJsonDetailDialog.vue'
import { ref, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import { useQuasar } from 'quasar'
import { generateColumns } from '../../helpers/table'

import { useCashdeskStore } from 'src/stores/cashdesk-store'
import { useAuthStore } from 'src/stores/auth-store'
const $q = useQuasar()
const cashdeskStore = useCashdeskStore()
const { getSelectedCashDesk } = storeToRefs(cashdeskStore)
const authStore = useAuthStore()
const { getUserTableColumns, getUserTableVisibleColumns, getTableRowsPerPage } =
  storeToRefs(authStore)
const props = defineProps({
  tableName: {
    type: String,
    required: true,
  },
  columns: {
    type: Array,
    required: false,
    default: () => [],
  },
  getDataFn: {
    type: Function,
    required: true,
  },
  filterParams: {
    type: Object,
    required: false,
    default: () => {},
  },
  dataKey: {
    type: String,
    required: false,
    default: () => 'data',
  },
  rowKey: {
    type: String,
    required: false,
    default: () => 'id',
  },
  slotNames: {
    type: Array,
    default: () => [],
  },
  hideFields: {
    type: Object,
    required: false,
    default() {
      return {
        showVisibleColumns: true,
        showReloadButton: true,
        showScreenModeButton: true,
        showSearchInput: true,
        useCol12: false,
      }
    },
  },
  rowsPerPage: {
    type: Number,
    required: false,
    default: () => 10,
  },
  tableBodyActions: {
    type: Array,
    required: false,
    default: () => [],
  },
  useCurrentCashDesk: {
    type: Boolean,
    required: false,
    default: () => false,
  },
  useCol12: {
    type: Boolean,
    required: false,
    default: () => false,
  },
})

const response = ref({})
const tableFilterParams = ref({})
const tableColumns = ref([])
const tableRows = ref([])
const tableLoading = ref(false)
const pagination = ref({
  totalPages: 1,
  sortBy: null,
  descending: false,
  page: 1,
  rowsPerPage: 10,
  totalCount: 0,
  //rowsNumber: 0,
})
const visibleColumnOptions = ref(['id'])
const visibleColumns = ref([])
const refTable = ref(null)
const tableFilterInput = ref('')
const fullScreen = ref(false)

const onDrop = async (from, to, table, mode) => {
  if (mode === 'column') {
    onDropColumn(from, to)
    await saveUserColumn()
    await initColumns()
  }
}
const onDropColumn = (from, to) => {
  if (to <= from) {
    if (from !== -1 && from > 0) {
      const removed = visibleColumns.value.splice(from, 1)[0]
      visibleColumns.value.splice(to, 0, removed)
    }
  } else if (to > from) {
    if (from !== -1 && from < visibleColumns.value.length) {
      const removed = visibleColumns.value.splice(from, 1)[0]
      visibleColumns.value.splice(to, 0, removed)
    }
  }
}

watch(
  visibleColumns,
  () => {
    const visibleColumnsMap = visibleColumns.value?.reduce((acc, curr, index) => {
      acc[curr] = index + 1
      return acc
    }, {})
    tableColumns.value?.sort((a, b) => {
      const maxSortIndex = tableColumns.value?.length + 1
      return (
        (visibleColumnsMap[a.name] || maxSortIndex) - (visibleColumnsMap[b.name] || maxSortIndex)
      )
    })
  },
  {
    immediate: true,
  },
)
watch(
  visibleColumnOptions,
  (newValue) => {
    if (newValue) {
      visibleColumns.value = [...newValue]
    }
  },
  { immediate: true },
)

watch(
  () => props.filterParams,
  (newValue) => {
    tableFilterParams.value = { ...newValue }
  },
  { immediate: true, deep: true },
)

onMounted(async () => {
  await initColumns()
  initPagination()
  await fetchData()
})

const fetchData = async () => {
  tableLoading.value = true
  removeSelectedRowClass()
  try {
    response.value = await props.getDataFn(getTableFilterParams())
    initResponseData(response.value)
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    tableLoading.value = false
  }
}
const initResponseData = (response) => {
  let data = response[props.dataKey] || response || []
  const isExistRowKey = data.some((item) => item[props.rowKey])
  if (!isExistRowKey) {
    // now set the rowKey of data index
    data = data.map((item, index) => {
      return { ...item, [props.rowKey]: index + 1 }
    })
  }
  tableRows.value = data
  initPagination(response)
}
const getTableFilterParams = () => {
  return {
    ...tableFilterParams.value,
    maxResultCount: pagination.value.rowsPerPage,
    skipCount: (pagination.value.page - 1) * pagination.value.rowsPerPage,
    sorting: pagination.value.sortBy,
    cashDeskId: props.useCurrentCashDesk ? getSelectedCashDesk.value.Id : null,
  }
}
const initColumns = async () => {
  const columns = generateColumns(props.columns)
  const userColumns = getUserTableColumns.value(props.tableName, columns)
  tableColumns.value = userColumns
  visibleColumnOptions.value = getUserTableVisibleColumns.value(props.tableName, columns)
}
const initPagination = (response = null) => {
  if (response) {
    pagination.value.totalPages = Math.ceil(response.totalCount / pagination.value.rowsPerPage)
    pagination.value.totalCount = response.totalCount
    //pagination.value.rowsNumber = response.totalCount
  } else {
    pagination.value = {
      ...pagination.value,
      rowsPerPage: getTableRowsPerPage.value(props.tableName, props.rowsPerPage),
    }
  }
}

const toggleFullscreen = () => {
  fullScreen.value = !fullScreen.value
  refTable.value.toggleFullscreen()
}

const resetColumns = async () => {
  const freshColumns = generateColumns([...props.columns])
  const freshVisibleColumns = [...freshColumns].map((item) => item.name)
  tableLoading.value = true
  await authStore.saveUserTableColumns(
    props.tableName,
    freshVisibleColumns,
    freshColumns,
    pagination.value.rowsPerPage,
  )
  await initColumns()
  await fetchData()
  setTimeout(() => {
    tableLoading.value = false
  }, 2000)
}

const isInputFocused = ref(false)
const handleInputFocus = () => {
  isInputFocused.value = true
}
const handleInputFocusOut = () => {
  if (tableFilterInput.value === null || tableFilterInput.value.length === 0) {
    isInputFocused.value = false
  }
}

const onChangeRowsPerPage = async () => {
  pagination.value.page = 1
  await fetchData()
  authStore.saveUserTableColumns(
    props.tableName,
    visibleColumns.value,
    tableColumns.value,
    pagination.value.rowsPerPage,
  )
}

/******** JSON DETAIL ********/

const showTheJsonDetail = (jsonValues) => {
  $q.dialog({
    component: ShowJsonDetailDialog,
    componentProps: {
      data: JSON.parse(jsonValues),
    },
  })
}

const onSelectVisibleColumn = async (val) => {
  const index = visibleColumns.value.indexOf(val)
  if (index === -1) {
    visibleColumns.value.push(val)
  } else {
    visibleColumns.value.splice(index, 1)
  }
  await saveUserColumn()
}

const saveUserColumn = async (
  upComingVisibleColumns = null,
  upComingColumns = null,
  upComingRowsPerPage = null,
) => {
  await authStore.saveUserTableColumns(
    props.tableName,
    upComingVisibleColumns || visibleColumns.value,
    upComingColumns || tableColumns.value,
    upComingRowsPerPage || pagination.value.rowsPerPage,
  )
}

const selectedRow = ref(null)
const selectedRowIndex = ref(null)

/*
 @param evt: Event
 @param row: Row
 @param index: Index
*/

const onRowClick = (evt, row, index) => {
  removeSelectedRowClass()
  selectedRow.value = row

  const target = evt.target
  const tr = target.closest('tr')
  if (tr) {
    if (selectedRowIndex.value === index) {
      removeSelectedRowClass()
      selectedRowIndex.value = null
    } else {
      tr.classList.add('selected-row')
      selectedRowIndex.value = index
    }
  }
}
const removeSelectedRowClass = () => {
  const rows = document.querySelectorAll('.supa-table tbody tr')
  rows.forEach((row) => {
    row.classList.remove('selected-row')
  })
  selectedRow.value = null
}

const toggleShowHideColumns = async (columnNames, isVisible = true) => {
  columnNames.forEach((columnName) => {
    const column = tableColumns.value.find((column) => column.name === columnName)
    column.visible = isVisible
    if (column.visible) {
      visibleColumns.value.push(columnName)
    } else {
      visibleColumns.value = visibleColumns.value.filter((column) => column !== columnName)
    }
  })
}
// Expose public methods and properties
defineExpose({
  fetchData,
  toggleFullscreen,
  pagination,
  tableRows,
  tableColumns,
  visibleColumns,
  refTable,
  response,
  selectedRow,
  selectedRowIndex,
  requestServerInteraction: fetchData,
  toggleShowHideColumns,
})
</script>
<style lang="scss">
.supa-table .q-table__top {
  padding: 0px !important;
}

:deep(.q-virtual-scroll__padding) {
  display: none !important;
}

.supa-table tbody tr td,
.supa-table tbody tr td div {
  // font-size: 12px !important;
}
.q-table--dense .q-table tbody td {
  padding: 1px 3px !important;
}

// Add selected row styling
.supa-table tbody tr.selected-row {
  background-color: rgba(255, 0, 0, 0.1) !important;
}
</style>
