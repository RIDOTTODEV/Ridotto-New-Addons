<template>
  <q-table
    v-draggable-table="{
      onDrop,
    }"
    flat
    bordered
    :rows="tableRows"
    :columns="tableColumns"
    :row-key="rowKey"
    dense
    separator="cell"
    ref="refTable"
    :rows-per-page-options="[0]"
    :visible-columns="visibleColumns"
    v-model:pagination="pagination"
    :loading="tableLoading"
    :filter="tableFilterInput"
    class="no-box-shadow col-12 supa-table"
    @row-click="onRowClick"
    @row-dblclick="onRowDoubleClick"
    @request="filterMethod"
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
            @clear="filterMethod"
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
                  'text-grey-6': !visibleColumns.includes(column.name),
                }"
                @click="onSelectVisibleColumn(column.name)"
                :disable="column.required"
              >
                <q-item-section class="text-capitalize text-caption text-bold">
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
            v-if="hideFields && hideFields.switchSummaryCard"
            color="grey-3"
            text-color="grey-10"
            unelevated
            dense
            icon="o_toc"
            @click="switchSummaryCard"
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
          :class="[
            'text-center q-custom-table',
            { 'frozen-column': frozenColumns.includes(col.name) },
          ]"
          :style="
            frozenColumns.includes(col.name)
              ? { left: getFrozenColumnPosition(col.name) + 'px' }
              : {}
          "
        >
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>
    <template v-slot:body-cell="props">
      <q-td
        :props="props"
        :class="{ 'frozen-column': frozenColumns.includes(props.col.name) }"
        :style="
          frozenColumns.includes(props.col.name)
            ? { left: getFrozenColumnPosition(props.col.name) + 'px' }
            : {}
        "
      >
        <div
          v-player-detail="
            playerDirectiveColumns.includes(props.col.name) ? props.row.playerId : null
          "
          :class="
            playerDirectiveColumns.includes(props.col.name)
              ? 'onHoverPlayerName text-capitalize'
              : ''
          "
        >
          {{ props.value }}
        </div>
      </q-td>
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
    <template v-slot:bottom-row="props">
      <slot name="bottomRow" v-bind="{ ...props, rows: refTable?.computedRows || [] }"></slot>
    </template>
    <template v-slot:bottom>
      <slot
        name="bottomSlots"
        v-bind="{
          rows: refTable?.computedRows || [],
        }"
      ></slot>
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
const { getUserTableColumns, getTableRowsPerPage } = storeToRefs(authStore)
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
        switchSummaryCard: false,
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
  frozenColumns: {
    type: Array,
    required: false,
    default: () => ['id'],
  },
})

const response = ref({})
const tableFilterParams = ref({})
const tableColumns = ref([])
const tableRows = ref([])
const tableLoading = ref(false)
const pagination = ref({
  totalPages: 1,
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: getTableRowsPerPage.value(props.tableName, props.rowsPerPage),
  totalCount: 0,
  rowsNumber: 0,
})
const playerDirectiveColumns = ref(['playerName', 'playerFullName', 'fullName'])
const visibleColumnOptions = ref(['id'])
const visibleColumns = ref([])
const refTable = ref(null)
const tableFilterInput = ref(null)
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

const filterMethod = (request) => {
  const needle = request.filter?.toLowerCase() || ''
  const filteredData = copiedData.value.filter((row) => {
    return Object.values(row).some((value) => {
      return value?.toString().toLowerCase().includes(needle) || false
    })
  })
  tableRows.value = [...filteredData]
}

/* watch(
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
) */

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

const copiedData = ref([])

const initResponseData = (response) => {
  let data = response[props.dataKey] || response || []
  const isExistRowKey = data.some((item) => item[props.rowKey])
  if (!isExistRowKey) {
    // now set the rowKey of data index
    data = data.map((item, index) => {
      return { ...item, [props.rowKey]: index + 1 }
    })
  }

  initPagination(response)
  tableRows.value = data
  copiedData.value = data
}
const getTableFilterParams = () => {
  return {
    ...tableFilterParams.value,
    maxResultCount: pagination.value.rowsPerPage,
    skipCount: (pagination.value.page - 1) * pagination.value.rowsPerPage,
    cashDeskId: props.useCurrentCashDesk ? getSelectedCashDesk.value.Id : null,
  }
}
const initColumns = async () => {
  const columns = generateColumns(props.columns)
  const userColumns = getUserTableColumns.value(props.tableName, columns)
  tableColumns.value = userColumns.columns
  visibleColumnOptions.value = userColumns.visibleColumns
}
const initPagination = (response = null) => {
  if (response) {
    const totalCount = response.totalCount || response.count
    pagination.value.totalPages = Math.ceil(totalCount / pagination.value.rowsPerPage)
    pagination.value.totalCount = totalCount
    pagination.value.rowsPerPage = getTableRowsPerPage.value(props.tableName, props.rowsPerPage)
    pagination.value.rowsNumber = pagination.value.rowsPerPage
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
  const defaultColumns = generateColumns([...props.columns])
  const formattedColumns = defaultColumns.map((column, order) => {
    return [column.colId, order, column.visible ? 1 : 0]
  })
  let formattedTable = {
    columns: formattedColumns,
    rowsPerPage: pagination.value.rowsPerPage,
  }

  tableLoading.value = true
  await authStore.saveUserTableColumnsFormatted(props.tableName, formattedTable)
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
  const formattedColumns = tableColumns.value.map((column, index) => {
    return [column.colId, index, visibleColumns.value.includes(column.name) ? 1 : 0]
  })
  await authStore.saveUserTableColumnsFormatted(props.tableName, {
    columns: formattedColumns,
    rowsPerPage: pagination.value.rowsPerPage,
  })
  await fetchData()
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
  const colByName = tableColumns.value.find((column) => column.name === val)
  colByName.visible = !colByName.visible
  const newVisibleColumns = tableColumns.value
    .filter((column) => column.visible)
    .map((column) => column.name)
  visibleColumns.value = newVisibleColumns
  const formattedColumns = tableColumns.value.map((column, index) => {
    return [column.colId, index, visibleColumns.value.includes(column.name) ? 1 : 0]
  })
  let formattedTable = {
    columns: formattedColumns,
    rowsPerPage: pagination.value.rowsPerPage,
  }
  await authStore.saveUserTableColumnsFormatted(props.tableName, formattedTable)
  /*   const index = visibleColumns.value.indexOf(val)
  if (index === -1) {
    visibleColumns.value.push(val)
  } else {
    visibleColumns.value.splice(index, 1)
  } */
  /*   const columns = tableColumns.value.map((column, index) => {
    return [column.colId, index, visibleColumns.value.includes(column.name) ? 1 : 0]
  })
  let formattedTable = {
    columns: columns,
    rowsPerPage: pagination.value.rowsPerPage,
  }
  console.log('formattedTable', formattedTable) */
  //await saveUserColumn()
}
const saveUserColumn = async () => {
  const tableColumnsSortByVisibleColumns = tableColumns.value.sort((a, b) => {
    return visibleColumns.value.indexOf(a.name) - visibleColumns.value.indexOf(b.name)
  })
  let formattedColumns = []
  tableColumnsSortByVisibleColumns.forEach((column, index) => {
    formattedColumns.push([column.colId, index, visibleColumns.value.includes(column.name) ? 1 : 0])
  })

  let formattedTable = {
    columns: formattedColumns,
    rowsPerPage: pagination.value.rowsPerPage,
  }
  await authStore.saveUserTableColumnsFormatted(props.tableName, formattedTable)
  await initColumns()
}
const selectedRow = ref(null)
const selectedRowIndex = ref(null)
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

const onRowDoubleClick = (evt, row) => {
  const redirectTdIds = ['playerFullName']
  const td = evt.target.closest('td')
  const id = td ? td.id : null
  if (redirectTdIds.includes(id)) {
    return
  }
  console.log('row', row)

  /*   $q.dialog({
    component: ShowJsonDetailDialog,
    componentProps: {
      data: row,
    },
  }) */
}

const emits = defineEmits(['switchSummaryCard'])
const switchSummaryCard = () => {
  emits('switchSummaryCard')
}

const getFrozenColumnPosition = (columnName) => {
  let position = 0
  const columnIndex = props.frozenColumns.indexOf(columnName)

  if (columnIndex > 0) {
    // Calculate position based on previous frozen columns' widths
    for (let i = 0; i < columnIndex; i++) {
      const prevColumn = tableColumns.value.find((col) => col.name === props.frozenColumns[i])
      // Use a default width if not specified, or calculate based on content
      position += prevColumn?.width || 100
    }
  }

  return position
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

.q-table--dense .q-table tbody td {
  padding: 1px 3px !important;
}

// Add selected row styling
.supa-table tbody tr.selected-row {
  background-color: rgba(255, 0, 0, 0.1) !important;
}

.q-table__bottom {
  padding: 0px !important;
}

.supa-table {
  thead {
    tr:first-child {
      th {
        &.frozen-column {
          background-color: $blue-grey-1;
          position: sticky;
          z-index: 1;
        }
      }
    }
  }

  td {
    &.frozen-column {
      background-color: $blue-grey-1;
      position: sticky;
      z-index: 1;
    }
  }

  tbody tr.selected-row {
    td.frozen-column {
      background-color: rgba(255, 0, 0, 0.1);
    }
  }
}
</style>
