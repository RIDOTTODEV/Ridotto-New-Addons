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
    :class="['no-box-shadow col-12 supa-table', { 'supa-table--has-bottom-row': hasBottomRow }]"
    @row-click="onRowClick"
    @request="filterMethod"
  >
    <template v-slot:top="" v-if="!hideTopBar">
      <div class="flex flex-row q-pl-sm q-pr-sm q-pt-sm q-pb-xs justify-between w-full gap-2">
        <slot name="headerFilterSlots" v-bind="{ props: { ...props, reload: fetchData } }"></slot>
        <!--        <div :class="['flex row justify-end items-start', props.useCol12 ? 'col-12' : 'col']">

        </div> -->
        <div class="flex justify-end" :class="{ 'w-full': useCol12 }"></div>
        <div class="flex justify-between w-full items-end">
          <div class="sm:flex-row justify-end items-start gap-2">
            <q-chip
              v-if="sortField && sortDirection"
              square
              class="sort-chip"
              @click="clearSort"
              clickable
            >
              <div class="flex items-center content-center">
                <q-icon
                  :name="
                    sortDirection === 'asc'
                      ? 'fa-solid fa-arrow-down-short-wide'
                      : 'fa-solid fa-arrow-up-short-wide'
                  "
                  size="13px"
                  class="q-mr-sm"
                />
                {{ getColumnLabel(sortField) }}
              </div>

              <q-badge color="negative" floating size="sm" rounded class="sort-chip__badge">
                <q-icon name="o_clear" size="12px" color="white" />
              </q-badge>
            </q-chip>
          </div>
          <div class="flex sm:flex-row justify-end items-start gap-2">
            <q-input
              v-if="hideFields && hideFields.showSearchInput"
              v-model="tableFilterInput"
              dense
              outlined
              class="super-small search-input"
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
            <div class="q-card--bordered q-px-xs bg-grey-3">
              <q-btn-dropdown
                v-if="hideFields && hideFields.showVisibleColumns"
                color="grey-3"
                text-color="grey-10"
                unelevated
                dense
                size="13px"
                dropdown-icon="o_visibility"
                square
                :content-style="{
                  height: '400px!important',
                }"
                ref="visibleColumnsDropdown"
                @mouseenter="visibleColumnsDropdown.show()"
              >
                <div class="bg-grey-2 q-pa-xs text-caption text-bold">
                  <span class="q-ml-sm"> {{ $t('visibleColumns') }}</span>
                </div>
                <q-list dense separator bordered @mouseleave="visibleColumnsDropdown.hide()">
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
                square
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
                square
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
                square
              />
            </div>
          </div>
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
          :class="[
            {
              'frozen-column': frozenColumns.includes(col.name),
            },
          ]"
          :style="
            frozenColumns.includes(col.name)
              ? { left: getFrozenColumnPosition(col.name) + 'px' }
              : {}
          "
          @mouseenter="hoveredColumn = col.name"
          @mouseleave="hoveredColumn = null"
        >
          <div class="supa-header-cell__wrap">
            <div v-if="!col.headerSlotName || !headerSlotNames.includes(col.headerSlotName)">
              <span>
                {{ col.label }}
              </span>
            </div>
            <slot v-else :name="col.headerSlotName" :props="props" v-bind="{ props }"></slot>
            <!-- Header Actions -->
            <Transition name="header-actions">
              <div v-if="hoveredColumn === col.name" class="supa-header-cell__actions">
                <q-btn
                  flat
                  dense
                  size="10px"
                  icon="fa-regular fa-eye-slash"
                  class="supa-header-cell__action-btn"
                  color="grey-9"
                  @click="onSelectVisibleColumn(col.name)"
                />

                <div
                  v-if="col.filterable"
                  class="supa-header-cell__filter"
                  @mouseenter="onFilterEnter(col.name)"
                  @mouseleave="onFilterLeave"
                >
                  <q-btn
                    flat
                    dense
                    size="10px"
                    class="supa-header-cell__action-btn"
                    @click.stop="onToggleFilter(col.name)"
                    color="grey-9"
                  >
                    <q-icon name="o_filter_alt" size="23px" />
                  </q-btn>

                  <Transition name="filter-panel">
                    <div
                      v-if="activeFilterColumn === col.name"
                      class="supa-header-cell__filter-panel"
                      @mouseenter="onFilterEnter(col.name)"
                      @mouseleave="onFilterLeave"
                    >
                      <q-input
                        :model-value="columnFilters[col.name] ?? ''"
                        dense
                        outlined
                        placeholder="..."
                        class="supa-header-cell__filter-input"
                        @update:model-value="onFilterInput(col.name, $event)"
                        @keyup.enter="onApplyFilter(col.name)"
                      />
                      <q-btn
                        unelevated
                        color="primary"
                        label="Filter"
                        size="16px"
                        class="supa-header-cell__filter-apply"
                        @click="onApplyFilter(col.name)"
                        no-caps
                      />
                    </div>
                  </Transition>
                </div>

                <q-btn
                  v-if="col.useSorting"
                  flat
                  dense
                  size="10px"
                  icon="fa-solid fa-arrow-down-short-wide"
                  class="supa-header-cell__action-btn"
                  :color="
                    sortField === col.field && sortDirection === 'desc' ? 'primary' : 'grey-9'
                  "
                  @click="onSortColumn(col.field, 'desc')"
                />

                <q-btn
                  v-if="col.useSorting"
                  flat
                  dense
                  size="10px"
                  icon="fa-solid fa-arrow-up-short-wide"
                  class="supa-header-cell__action-btn"
                  :color="sortField === col.field && sortDirection === 'asc' ? 'primary' : 'grey-9'"
                  @click="onSortColumn(col.field, 'asc')"
                />
              </div>
            </Transition>
          </div>
        </q-th>
      </q-tr>
    </template>
    <template v-slot:body-cell="props">
      <q-td
        v-if="props.col.name !== 'selection'"
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
    <template v-for="slotName in slotNames" v-slot:[slotName]="props">
      <slot :name="slotName" v-bind="{ props }"></slot>
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
    <template v-slot:bottom v-if="!hideBottom">
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
  </q-table>
</template>

<script setup>
import ShowJsonDetailDialog from './ShowJsonDetailDialog.vue'

import { ref, watch, onMounted, useSlots, computed } from 'vue'
import { storeToRefs } from 'pinia'

import { useQuasar } from 'quasar'
import { generateColumns } from '../../helpers/table.js'

import { useCashdeskStore } from 'src/stores/cashdesk-store'
import { useAuthStore } from 'src/stores/auth-store'
const $q = useQuasar()
const slots = useSlots()
const hasBottomRow = computed(() => !!slots.bottomRow)
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
  headerSlotNames: {
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
  hideTopBar: {
    type: Boolean,
    required: false,
    default: () => false,
  },
  hideBottom: {
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
  let dataKeys = props.dataKey.split('.')
  let data = response[props.dataKey] || response || []
  if (dataKeys.length > 1) {
    for (let key of dataKeys) {
      if (data[key]) {
        data = data[key]
      } else {
        data = []
      }
    }
  }

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
  let sortParams = ''
  if (sortField.value && sortDirection.value) {
    sortParams = sortField.value + ' ' + sortDirection.value
  } else {
    sortParams = null
  }
  return {
    ...tableFilterParams.value,
    maxResultCount: pagination.value.rowsPerPage,
    skipCount: (pagination.value.page - 1) * pagination.value.rowsPerPage,
    cashDeskId: props.useCurrentCashDesk ? getSelectedCashDesk.value.Id : null,
    sorting: sortParams,
  }
}
const initColumns = async () => {
  const columns = generateColumns(props.columns)
  const userColumns = getUserTableColumns.value(props.tableName, columns)

  tableColumns.value = userColumns.columns
  visibleColumnOptions.value = userColumns.visibleColumns

  // TODO: get sort logic

  if (userColumns.sort) {
    const [field, direction] = userColumns.sort.split(' ')
    sortField.value = field
    sortDirection.value = direction
  }
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
    sort: sortField.value ? sortField.value + ' ' + sortDirection.value : null,
  }
  await authStore.saveUserTableColumnsFormatted(props.tableName, formattedTable)
  await initColumns()
}
const selectedRow = ref(null)
const selectedRowIndex = ref(null)
const onRowClick = (evt, row, index) => {
  removeSelectedRowClass()
  selectedRow.value = row
  emits('selectedRow', row)
  const target = evt.target
  const tr = target.closest('tr')
  if (tr) {
    if (selectedRowIndex.value === index) {
      removeSelectedRowClass()
      selectedRowIndex.value = null
      emits('selectedRow', null)
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
const emits = defineEmits(['switchSummaryCard', 'selectedRow'])
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

/********* Hovered Column ********/
const hoveredColumn = ref(null)
const activeFilterColumn = ref(null)
const columnFilters = ref({})
let filterCloseTimer = null

watch(hoveredColumn, (newVal) => {
  if (!newVal && activeFilterColumn.value) {
    if (!filterCloseTimer) {
      filterCloseTimer = setTimeout(() => {
        activeFilterColumn.value = null
        filterCloseTimer = null
      }, 300)
    }
  }
})

const onFilterEnter = (colName) => {
  if (filterCloseTimer) {
    clearTimeout(filterCloseTimer)
    filterCloseTimer = null
  }
  activeFilterColumn.value = colName
}

const onFilterLeave = () => {
  if (filterCloseTimer) {
    clearTimeout(filterCloseTimer)
  }
  filterCloseTimer = setTimeout(() => {
    activeFilterColumn.value = null
    filterCloseTimer = null
  }, 300)
}

const onToggleFilter = (colName) => {
  if (filterCloseTimer) {
    clearTimeout(filterCloseTimer)
    filterCloseTimer = null
  }
  activeFilterColumn.value = activeFilterColumn.value === colName ? null : colName
}
const onFilterInput = (colName, value) => {
  columnFilters.value[colName] = String(value ?? '')
}

const onApplyFilter = (colName) => {
  // TODO: implement filter apply logic
  console.log('applyFilter', colName, columnFilters.value[colName])
}
const sortField = ref(null)
const sortDirection = ref(null)
const onSortColumn = async (field, direction) => {
  // TODO: implement sort logic
  sortField.value = field
  sortDirection.value = direction
  if (!direction || direction === 'asc') {
    sortDirection.value = 'desc'
  } else {
    sortDirection.value = 'asc'
  }
  await fetchData()
  // TODO: save saveUserColumn

  await saveUserColumn()
}

const clearSort = async () => {
  sortField.value = null
  sortDirection.value = null
  await fetchData()
  await saveUserColumn()
}
const getColumnLabel = (field) => {
  return tableColumns.value.find((column) => column.name === field)?.label ?? field
}

const visibleColumnsDropdown = ref(null)
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

// const sortIcon = () => {
//   return `    <svg
//                   width="12"
//                   height="12"
//                   viewBox="0 0 14 14"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     d="M5.64515 3.61291C5.47353 3.61291 5.30192 3.54968 5.16644 3.4142L3.38708 1.63484L1.60773 3.4142C1.34579 3.67613 0.912244 3.67613 0.650309 3.4142C0.388374 3.15226 0.388374 2.71871 0.650309 2.45678L2.90837 0.198712C3.17031 -0.0632236 3.60386 -0.0632236 3.86579 0.198712L6.12386 2.45678C6.38579 2.71871 6.38579 3.15226 6.12386 3.4142C5.98837 3.54968 5.81676 3.61291 5.64515 3.61291Z"
//                     fill="currentColor"
//                   ></path>
//                   <path
//                     d="M3.38714 14C3.01681 14 2.70972 13.6929 2.70972 13.3226V0.677419C2.70972 0.307097 3.01681 0 3.38714 0C3.75746 0 4.06456 0.307097 4.06456 0.677419V13.3226C4.06456 13.6929 3.75746 14 3.38714 14Z"
//                     fill="currentColor"
//                   ></path>
//                   <path
//                     d="M10.6129 14C10.4413 14 10.2697 13.9368 10.1342 13.8013L7.87611 11.5432C7.61418 11.2813 7.61418 10.8477 7.87611 10.5858C8.13805 10.3239 8.5716 10.3239 8.83353 10.5858L10.6129 12.3652L12.3922 10.5858C12.6542 10.3239 13.0877 10.3239 13.3497 10.5858C13.6116 10.8477 13.6116 11.2813 13.3497 11.5432L11.0916 13.8013C10.9561 13.9368 10.7845 14 10.6129 14Z"
//                     fill="currentColor"
//                   ></path>
//                   <path
//                     d="M10.6129 14C10.2426 14 9.93552 13.6929 9.93552 13.3226V0.677419C9.93552 0.307097 10.2426 0 10.6129 0C10.9833 0 11.2904 0.307097 11.2904 0.677419V13.3226C11.2904 13.6929 10.9832 14 10.6129 14Z"
//                     fill="currentColor"
//                   ></path>
//                 </svg>
//   `
// }
</script>
<style lang="scss">
.supa-table .q-table__top {
  padding: 0px !important;
}

.supa-table .q-table__middle {
  // max-height: calc(100vh - 280px);
  overflow: auto;
}

.supa-table {
  thead tr th {
    position: sticky;
    top: 0;
    z-index: 2;
    background-color: #fff;
    opacity: 1;
  }

  &.q-table--loading thead tr:last-child th {
    top: 48px;
  }

  &.supa-table--has-bottom-row tbody tr:last-child td {
    position: sticky;
    bottom: 0;
    z-index: 2;
    background-color: #fff;
    box-shadow: 0 -1px 0 0 rgba(0, 0, 0, 0.12);
  }
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
          z-index: 3;
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

.sindu_handle {
  cursor: pointer !important;
  /*   &:hover {
    background-color: $grey-2;
    color: $primary;
  } */
}
.sort-icon {
  /*   cursor: not-allowed !important; */
  &:hover {
    background-color: $grey-2;
    color: $primary;
  }
}
.sorted-column {
  background-color: $grey-8 !important;
  color: $primary !important;
}

.supa-header-cell__wrap {
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  min-width: 0;
  cursor: pointer;
}

.supa-header-cell__actions {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  white-space: nowrap;

  &::before {
    content: '';
    position: absolute;
    top: -6px;
    left: 14px;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid #fff;
  }

  &::after {
    content: '';
    position: absolute;
    top: -7px;
    left: 13px;
    width: 0;
    height: 0;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-bottom: 7px solid rgba(0, 0, 0, 0.12);
    z-index: -1;
  }
}

.supa-header-cell__action-btn :deep(.q-icon) {
  -webkit-text-stroke: 0;
  font-size: 14px;
  opacity: 0.7;
}

.supa-header-cell__filter {
  position: relative;
  display: flex;
  align-items: flex-start;
}

.supa-header-cell__filter-panel {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  // gap: 8px;
  // padding: 12px 8px 8px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform-origin: top center;
  will-change: transform, opacity;

  &::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 0;
    right: 0;
    height: 8px;
  }
}

.supa-header-cell__filter-input {
  min-width: 160px;
}

.header-actions-enter-active,
.header-actions-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}
.header-actions-enter-from,
.header-actions-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.filter-panel-enter-active {
  transition:
    opacity 0.1s ease-out,
    transform 0.1s ease-out;
}
.filter-panel-leave-active {
  transition:
    opacity 0.08s ease-in,
    transform 0.08s ease-in;
}
.filter-panel-enter-from,
.filter-panel-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}

/** Chips Styles */

.sort-chip {
  min-width: 80px;
  cursor: pointer;
  position: relative;
  color: #fff;
  // background-color: #6c757d;
  // border-color: #6c757d;
  background-color: $grey-3;
  color: $grey-10;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
  border-radius: 0.2rem;
  font-weight: 400 !important;

  .sort-chip__badge {
    border-radius: 50% !important;
    width: 18px !important;
    height: 18px !important;
    min-width: 18px !important;
    min-height: 18px !important;
    padding: 0 !important;
    display: flex !important;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
  }

  &:hover .sort-chip__badge {
    opacity: 1;
  }
}
.sort-chip :deep(.q-chip__icon--remove) {
  margin-left: 6px !important;
}

.filter-chip {
  cursor: pointer;
  position: relative;

  .filter-chip__badge {
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
  }

  &:hover .filter-chip__badge {
    opacity: 1;
  }
}

.filter-icon {
  -webkit-text-stroke: 0 !important;
  font-size: 16px !important;
}

.sort-icon {
  -webkit-text-stroke: 0 !important;
  font-size: 16px !important;
}
</style>
