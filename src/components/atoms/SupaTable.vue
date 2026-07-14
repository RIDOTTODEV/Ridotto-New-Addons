<template>
  <q-table v-draggable-table="{
    onDrop,
  }"   :rows="tableRows" :columns="tableColumns" :row-key="rowKey" dense separator="cell" ref="refTable"
    :rows-per-page-options="[0]" :visible-columns="visibleColumns" v-model:pagination="pagination"
    :loading="tableLoading" :filter="tableFilterInput"
    v-bind="tableAttrs"
    :style="mergedTableStyle"
    :class="['no-box-shadow col-12 supa-table', {
      'supa-table--has-bottom-row': hasBottomRow,
      'supa-table--scrolled': isScrolled,
    }, attrs.class]" @row-click="onRowClick"
    @request="filterMethod"
   
    >
    <template v-slot:top="" v-if="!hideTopBar">
      <div class="flex flex-row q-pa-xs justify-between w-full gap-2">
        <!-- <slot name="headerFilterSlots" v-bind="{ props: { ...props, reload: fetchData } }"></slot> -->
         
        <div class="flex justify-between" :class="{ 'w-full': useCol12 }">
          <div class="text-subtitle1 text-weight-medium q-px-xs flex items-end">
            <div v-if="sortField !== null" class="sort-chip-wrapper">
              <q-chip
                size="md"
                :icon="sortDirection === 'asc' ? 'fas fa-sort-amount-up-alt' : 'fas fa-sort-amount-down'"
                class="sort-chip min-w-[200px]"
                :label="getSortingChipLabel()"
                color="blue-grey-8"
                text-color="white"
              />
              <q-icon
                name="close"
                class="sort-chip__remove"
                @click="clearSort"
              >
              </q-icon>
            </div>
          </div>
          <div class="flex sm:flex-row justify-end items-start gap-2">
            <q-input v-if="hideFields && hideFields.showSearchInput" v-model="tableFilterInput" dense outlined
              class="super-small supa-table__search-input" :class="{ 'supa-table__search-input--focused': isInputFocused }"
              :placeholder="$t('search')" @focus="handleInputFocus" @focusout="handleInputFocusOut" clearable
              @clear="filterMethod">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
            <q-btn-dropdown v-if="hideFields && hideFields.showVisibleColumns" color="grey-3" text-color="grey-10"
              unelevated dense size="13px" class="supa-table__top-btn " padding="xs"
              dropdown-icon="o_visibility"  content-class="supa-table__visible-columns-menu" :menu-offset="[10, 10]" menu-anchor="bottom end">
              <div class="supa-table__visible-columns-header q-pa-xs text-caption text-bold">
                <span class="q-ml-sm"> {{ $t('visibleColumns') }}</span>
              </div>
              <div class="supa-table__visible-columns-scroll min-w-[200px]">
                <q-list dense separator bordered>
                  <q-item clickable v-for="(column, index) in tableColumns" :key="index" :class="{
                    'supa-table__visible-columns-item--off': !visibleColumns.includes(column.name),
                  }" @click="onSelectVisibleColumn(column.name)" :disable="column.required">
                    <q-item-section class="text-capitalize text-caption">
                      {{ column.label }}
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
              <q-list dense bordered class="supa-table__visible-columns-footer">
                <q-item clickable @click="resetColumns" class="supa-table__visible-columns-reset text-caption">
                  <q-item-section class="flex content-center">
                    <div class="row items-center">
                      <q-icon name="sync" size="16px" class="q-mr-sm" />
                      {{ $t('resetColumns') }}
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
            <q-btn v-if="hideFields && hideFields.showReloadButton" color="grey-3" text-color="grey-10" unelevated dense
              icon="cached" @click="fetchData" size="13px" class="supa-table__top-btn" padding="xs" />
            <q-btn v-if="hideFields && hideFields.switchSummaryCard" color="grey-3" text-color="grey-10" unelevated
              dense icon="o_toc" @click="switchSummaryCard" size="13px" class="supa-table__top-btn" padding="xs" />
            <q-btn v-if="hideFields && hideFields.showScreenModeButton" color="grey-3" text-color="grey-10" dense
              :icon="fullScreen ? 'fullscreen_exit' : 'fullscreen'" @click="toggleFullscreen" size="13px" unelevated
              class="supa-table__top-btn" padding="xs" />
          </div>
        </div>
      </div>
    </template>
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th auto-width v-for="col in props.cols" :key="col.name" :props="props" class="text-center supa-table-header h-[40px]"
          :class="[
            {
              'frozen-column': frozenColumns.includes(col.name),
              'supa-header-cell--hovered': hoveredColumn === col.name,
              'supa-th--resizable': resizableColumns,
              'supa-th--resizing': isResizing && resizingColumn === col.name,
            },
          ]" 
          :style="{
            ...(frozenColumns.includes(col.name)
              ? { left: getFrozenColumnPosition(col.name) + 'px' }
              : {}),
            ...getColumnSizingStyle(col.name),
          }"
          @mouseenter="onColumnHeaderEnter($event, col)"
          @mouseleave="onColumnHeaderLeave">
          <div v-if="!col.headerSlotName || !headerSlotNames.includes(col.headerSlotName)">
            <span>
              {{ col.label }}
            </span>
          </div>
          <slot v-else :name="col.headerSlotName" :props="props" v-bind="{ props }"></slot>
          <span
            v-if="resizableColumns"
            class="supa-column-resizer"
            @mousedown="onColumnResizeStart($event, col.name)"
            @dblclick="onColumnResizeDblClick(col.name)"
            @click.stop
          ></span>
        </q-th>
      </q-tr>
    </template>
    <template v-slot:body-cell="props">
      <q-td v-if="props.col.name !== 'selection'" :props="props"
        :class="{ 'frozen-column': frozenColumns.includes(props.col.name) }" :style="{
          ...(frozenColumns.includes(props.col.name)
            ? { left: getFrozenColumnPosition(props.col.name) + 'px' }
            : {}),
          ...getColumnSizingStyle(props.col.name),
        }">
        <div v-player-detail="playerDirectiveColumns.includes(props.col.name) ? props.row.playerId : null
          " :class="playerDirectiveColumns.includes(props.col.name)
            ? 'onHoverPlayerName text-capitalize'
            : ''
            ">
          {{ props.value }}
        </div>
      </q-td>
    </template>
    <template v-for="slotName in slotNames" v-slot:[slotName]="props">
      <slot :name="slotName" v-bind="{ props }"></slot>
    </template>
    <template v-slot:body-cell-actions="props">
      <q-td :props="props" class="text-right">
        <q-btn icon="data_object" dense size="13px" unelevated @click="showTheJsonDetail(props.row.detail)"
          v-if="props.row?.detail && props.row?.detail !== null" class="q-mr-xs" />
        <q-btn v-for="(action, index) in tableBodyActions" :key="index" :icon="action.icon" :color="action.color"
          @click="action.fn(props.row[action.args], filter)" dense size="13px" unelevated flat />
      </q-td>
    </template>
    <template v-slot:bottom-row="props">
      <slot name="bottomRow" v-bind="{ ...props, rows: refTable?.computedRows || [] }"></slot>
    </template>
    <template v-slot:bottom v-if="!hideBottom">
      <slot name="bottomSlots" v-bind="{
        rows: refTable?.computedRows || [],
      }"></slot>
      <div class="supa-table__pagination full-width q-mt-xs q-mb-xs row col-12 flex content-center items-center justify-between">
        <div class="supa-table__pagination-info flex items-center">
          <div class="text-subtitle2 q-mr-md">
            Total:
            <strong class="q-ml-xs q-mr-xs">{{ pagination.totalCount }}</strong>
            Records
          </div>
          <q-select v-model="pagination.rowsPerPage" options-dense :options="[10, 20, 50, 100, 500]" borderless dense
            class="super-small" filled @update:model-value="onChangeRowsPerPage" behavior="menu" />
          <div class="text-subtitle2 q-ml-sm">Rows Per Page</div>
        </div>

        <q-pagination v-if="pagination.totalCount >= pagination.rowsPerPage" v-model="pagination.page" color="grey-8"
          :max="pagination.totalPages" max-pages="6" size="md" active-color="primary" @update:model-value="fetchData"
          boundary-links boundary-numbers direction-links class="supa-table__pagination-nav q-pr-md" />
      </div>
    </template>
  </q-table>

  <!-- Hovered column panel -->
  <Teleport to="body">
    <Transition name="supa-column-hover">
      <div
        v-if="hoveredColumn"
        class="supa-column-hover-panel"
        :style="hoverPanelStyle"
        @mouseenter="onHoverPanelEnter"
        @mouseleave="onHoverPanelLeave"
      >
        <q-btn
          flat
          dense
          size="10px"
          icon="fa-regular fa-eye-slash"
          class="supa-column-hover-panel__btn"
          @click="onSelectVisibleColumn(hoveredColumn)"
        />
        <template v-if="hoveredColumnObj?.isSortable">
          <q-btn
            flat
            dense
            size="10px"
            icon="fas fa-sort-amount-up-alt"
            class="supa-column-hover-panel__btn"
            @click="onSortColumn(hoveredColumn, 'asc')"
          />
          <q-btn
            flat
            dense
            size="10px"
            icon="fas fa-sort-amount-down"
            class="supa-column-hover-panel__btn"
            @click="onSortColumn(hoveredColumn, 'desc')"
          />
        </template>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import ShowJsonDetailDialog from './ShowJsonDetailDialog.vue'

import { ref, watch, onMounted, onUnmounted, nextTick, useSlots, useAttrs, computed } from 'vue'

defineOptions({ inheritAttrs: false })
import { useEventListener, useResizeObserver } from '@vueuse/core'
import { storeToRefs } from 'pinia'

import { useQuasar } from 'quasar'
import { generateColumns } from '../../helpers/table'

import { useCashdeskStore } from 'src/stores/cashdesk-store'
import { useAuthStore } from 'src/stores/auth-store'
const slots = useSlots()
const attrs = useAttrs()
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
    default: () => { },
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
  tableTitle: {
    type: String,
    required: false,
    default: () => '',
  },
  resizableColumns: {
    type: Boolean,
    required: false,
    default: () => false,
  },
  minColumnWidth: {
    type: Number,
    required: false,
    default: () => 40,
  },
})

const hasBottomRow = computed(() => !!slots.bottomRow)

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
const tableBodyHeight = ref(null)
const PAGE_BOTTOM_PADDING = 16
const MIN_TABLE_BODY_HEIGHT = 120

const tableHeightStyle = computed(() =>
  tableBodyHeight.value
    ? { '--supa-table-body-height': `${tableBodyHeight.value}px` }
    : {},
)

const tableAttrs = computed(() => {
  const result = { ...attrs }
  delete result.style
  delete result.class
  return result
})

const mergedTableStyle = computed(() => {
  const styles = [tableHeightStyle.value]
  if (attrs.style) {
    styles.push(attrs.style)
  }
  return styles
})

const updateTableBodyHeight = () => {
  const tableEl = refTable.value?.$el
  if (!tableEl) return

  const middleEl = tableEl.querySelector('.q-table__middle')
  if (!middleEl) return

  const middleTop = middleEl.getBoundingClientRect().top
  const bottomEl = tableEl.querySelector('.q-table__bottom')
  const bottomHeight = bottomEl?.getBoundingClientRect().height ?? 0
  const available = window.innerHeight - middleTop - bottomHeight - PAGE_BOTTOM_PADDING
  const nextHeight = Math.max(MIN_TABLE_BODY_HEIGHT, Math.floor(available))

  if (tableBodyHeight.value !== nextHeight) {
    tableBodyHeight.value = nextHeight
  }
}

let tableHeightRaf = null
const scheduleTableBodyHeightUpdate = () => {
  if (tableHeightRaf !== null) return
  tableHeightRaf = requestAnimationFrame(() => {
    tableHeightRaf = null
    updateTableBodyHeight()
  })
}

let layoutResizeObserver = null

const bindTableHeightObservers = () => {
  updateTableBodyHeight()

  const layoutEl =
    refTable.value?.$el?.closest('.q-page, .q-tab-panel, .q-card') || document.body

  layoutResizeObserver?.stop?.()
  layoutResizeObserver = useResizeObserver(layoutEl, scheduleTableBodyHeightUpdate)
}

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
  await nextTick()
  bindTableHeightObservers()
  bindHoverPanelScrollListener()
})

onUnmounted(() => {
  layoutResizeObserver?.stop?.()
  if (tableHeightRaf !== null) {
    cancelAnimationFrame(tableHeightRaf)
    tableHeightRaf = null
  }
  if (hoverPanelRaf !== null) {
    cancelAnimationFrame(hoverPanelRaf)
    hoverPanelRaf = null
  }
  if (hoverCloseTimer) {
    clearTimeout(hoverCloseTimer)
    hoverCloseTimer = null
  }
})

useEventListener(window, 'resize', scheduleTableBodyHeightUpdate, { passive: true })

watch(tableLoading, async (loading) => {
  if (!loading) {
    await nextTick()
    updateTableBodyHeight()
  }
})

watch(
  () => [props.hideTopBar, props.hideBottom, hasBottomRow.value],
  async () => {
    await nextTick()
    updateTableBodyHeight()
  },
)
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
  resetColumnWidths()
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

  // check the sort direction sortField
  if (sortField.value && sortField.value === val) {
    await clearSort()
  }
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

// Hovered column sections
const hoveredColumn = ref(null)
const hoveredColumnEl = ref(null)
const hoveredColumnObj = computed(() =>
  tableColumns.value.find((c) => c.name === hoveredColumn.value)
)
const hoverPanelStyle = ref({})
let hoverCloseTimer = null

const updateHoverPanelPosition = () => {
  const el = hoveredColumnEl.value
  if (!el) return

  const rect = el.getBoundingClientRect()
  const top = `${rect.bottom + 4}px`
  const left = `${rect.left + rect.width / 2}px`
  const current = hoverPanelStyle.value

  if (current.top === top && current.left === left) return

  hoverPanelStyle.value = { top, left }
}

let hoverPanelRaf = null
const scheduleHoverPanelPositionUpdate = () => {
  if (!hoveredColumn.value) return
  if (hoverPanelRaf !== null) return
  hoverPanelRaf = requestAnimationFrame(() => {
    hoverPanelRaf = null
    updateHoverPanelPosition()
  })
}

const onColumnHeaderEnter = (event, col) => {
  if (hoverCloseTimer) {
    clearTimeout(hoverCloseTimer)
    hoverCloseTimer = null
  }

  hoveredColumn.value = col.name
  hoveredColumnEl.value = event.currentTarget
  updateHoverPanelPosition()
}

const onColumnHeaderLeave = () => {
  hoverCloseTimer = setTimeout(() => {
    hoveredColumn.value = null
    hoveredColumnEl.value = null
  }, 150)
}

const onHoverPanelEnter = () => {
  if (hoverCloseTimer) {
    clearTimeout(hoverCloseTimer)
    hoverCloseTimer = null
  }
}

const onHoverPanelLeave = () => {
  hoveredColumn.value = null
  hoveredColumnEl.value = null
}

useEventListener(window, 'scroll', scheduleHoverPanelPositionUpdate, { capture: true, passive: true })

useEventListener(window, 'resize', scheduleHoverPanelPositionUpdate, { passive: true })

watch(hoveredColumn, async (columnName) => {
  if (columnName) {
    await nextTick()
    updateHoverPanelPosition()
  }
})

/* Sticky header'ın "yapışık" durumunda gölge gösterebilmek için
 * .q-table__middle scroll pozisyonunu takip ediyoruz. scrollTop > 0
 * olduğunda tablo üzerine `supa-table--scrolled` class'ı düşer. */
const isScrolled = ref(false)
const updateScrolledState = (middleEl) => {
  if (!middleEl) return
  isScrolled.value = middleEl.scrollTop > 0
}

const bindHoverPanelScrollListener = () => {
  const middleEl = refTable.value?.$el?.querySelector('.q-table__middle')
  if (middleEl) {
    updateScrolledState(middleEl)
    useEventListener(
      middleEl,
      'scroll',
      () => {
        scheduleHoverPanelPositionUpdate()
        updateScrolledState(middleEl)
      },
      { passive: true },
    )
  }
}


/********* Sorting ********/
const sortField = ref(null)
const sortDirection = ref(null)
const onSortColumn = async (columnName, direction = null) => {
  const column = tableColumns.value.find((col) => col.name === columnName)
  sortDirection.value = direction || (sortDirection.value === 'asc' ? 'desc' : 'asc')
  sortField.value = column?.field ?? columnName
  await fetchData()
}
const getSortingChipLabel = () => {
   const column = tableColumns.value.find((col) => col.name === sortField.value)
   const label = `${column.label}`
   return label
}

const clearSort = async () => {
  sortField.value = null
  sortDirection.value = null
  await fetchData()
}



/********* Sizing Widths  ********/
const columnWidths = ref({})
const isResizing = ref(false)
const resizingColumn = ref(null)
const resizeStartX = ref(0)
const resizeStartWidth = ref(0)

const getColumnWidthStorageKey = () => `supa-table-widths:${props.tableName}`

const loadColumnWidths = () => {
  if (!props.tableName) return
  try {
    const saved = localStorage.getItem(getColumnWidthStorageKey())
    columnWidths.value = saved ? JSON.parse(saved) || {} : {}
  } catch (err) {
    console.error('Failed to load column widths', err)
    columnWidths.value = {}
  }
}

const saveColumnWidths = () => {
  if (!props.tableName) return
  try {
    localStorage.setItem(
      getColumnWidthStorageKey(),
      JSON.stringify(columnWidths.value),
    )
  } catch (err) {
    console.error('Failed to save column widths', err)
  }
}

const getColumnWidth = (columnName) => columnWidths.value[columnName] || null

const getColumnSizingStyle = (columnName) => {
  const width = getColumnWidth(columnName)
  if (!width) return {}
  return {
    width: `${width}px`,
    minWidth: `${width}px`,
    maxWidth: `${width}px`,
  }
}

const onColumnResizeStart = (event, columnName) => {
  if (!props.resizableColumns) return
  event.preventDefault()
  event.stopPropagation()

  const thEl = event.target.closest('th')
  const currentWidth = thEl
    ? thEl.getBoundingClientRect().width
    : getColumnWidth(columnName) || 100

  isResizing.value = true
  resizingColumn.value = columnName
  resizeStartX.value = event.clientX
  resizeStartWidth.value = currentWidth

  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'

  document.addEventListener('mousemove', onColumnResizeMove)
  document.addEventListener('mouseup', onColumnResizeEnd)
}

const onColumnResizeMove = (event) => {
  if (!isResizing.value || !resizingColumn.value) return
  const delta = event.clientX - resizeStartX.value
  const nextWidth = Math.max(
    props.minColumnWidth,
    Math.round(resizeStartWidth.value + delta),
  )
  columnWidths.value = {
    ...columnWidths.value,
    [resizingColumn.value]: nextWidth,
  }
}

const onColumnResizeEnd = () => {
  if (!isResizing.value) return
  isResizing.value = false
  resizingColumn.value = null
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
  document.removeEventListener('mousemove', onColumnResizeMove)
  document.removeEventListener('mouseup', onColumnResizeEnd)
  saveColumnWidths()
}

const onColumnResizeDblClick = (columnName) => {
  if (!props.resizableColumns) return
  if (!(columnName in columnWidths.value)) return
  const next = { ...columnWidths.value }
  delete next[columnName]
  columnWidths.value = next
  saveColumnWidths()
}

const resetColumnWidths = () => {
  columnWidths.value = {}
  if (!props.tableName) return
  try {
    localStorage.removeItem(getColumnWidthStorageKey())
  } catch (err) {
    console.error('Failed to reset column widths', err)
  }
}

watch(() => props.tableName, loadColumnWidths, { immediate: true })

onUnmounted(() => {
  document.removeEventListener('mousemove', onColumnResizeMove)
  document.removeEventListener('mouseup', onColumnResizeEnd)
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
})


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
  columnWidths,
  resetColumnWidths,
})

</script>
<style lang="scss">
@import 'src/css/assets/_supatable.scss';
</style>