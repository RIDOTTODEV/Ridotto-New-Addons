<template>
  <div
    class="seo-data-grid"
    ref="gridContainer"
    :class="{ 'seo-data-grid--sm': isSmallScreen, 'seo-data-grid--md': isMediumScreen }"
  >
    <!-- Toolbar -->
    <div class="seo-data-grid__toolbar row items-center q-mb-sm" v-if="showToolbar">
      <div class="text-subtitle2 text-grey-8 text-weight-medium">
        {{ title }}
      </div>
      <q-space />

      <q-badge
        v-if="showScreenIndicator"
        class="q-mr-sm"
        :color="screenSizeColor"
        text-color="white"
        :label="screenSizeLabel"
        size="sm"
      />

      <q-btn
        flat
        dense
        round
        size="sm"
        icon="o_settings"
        @click.stop
      >
        <q-tooltip>Column Settings</q-tooltip>
        <q-menu v-model="showColumnMenu" anchor="bottom right" self="top right">
          <q-list dense style="min-width: 220px">
            <q-item-label header class="text-uppercase text-caption text-grey-6">
              Toggle Columns
            </q-item-label>
            <q-item
              v-for="col in toggleableColumns"
              :key="col.name"
              tag="label"
              dense
              class="q-px-sm"
            >
              <q-item-section side>
                <q-checkbox
                  v-model="col._userVisible"
                  :disable="col.required || col.priority === 'high'"
                  dense
                  size="xs"
                  @update:model-value="onColumnToggle(col)"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-caption">{{ col.label }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge
                  v-if="col.priority === 'high'"
                  color="red-4"
                  size="xs"
                  label="core"
                />
                <q-badge
                  v-else-if="col.priority === 'medium'"
                  color="orange-4"
                  size="xs"
                  label="med"
                />
                <q-badge
                  v-else-if="col.priority === 'low'"
                  color="grey-5"
                  size="xs"
                  label="low"
                />
              </q-item-section>
            </q-item>
            <q-separator spaced />
            <q-item clickable v-ripple @click="resetColumnDefaults" dense>
              <q-item-section avatar>
                <q-icon name="o_restart_alt" size="xs" color="grey-6" />
              </q-item-section>
              <q-item-section class="text-caption text-grey-6">
                Reset to Defaults
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>

    <!-- Data Grid Table -->
    <q-table
      ref="qTableRef"
      :rows="rows"
      :columns="visibleColumns"
      :row-key="rowKey"
      :loading="loading"
      v-model:pagination="tablePagination"
      :rows-per-page-options="[10, 25, 50, 100]"
      :visible-columns="visibleColumnFields"
      :grid="$q.screen.lt.sm"
      @request="onRequest"
      @row-click="onRowClick"
      :selected-rows-label="selectedRowsLabel"
      :selection="selection"
      v-model:selected="selected"
      flat
      bordered
      wrap-cells
      class="seo-data-grid__table"
      :class="{ 'seo-data-grid__table--dense': dense }"
      table-header-class="seo-data-grid__header"
    >
      <!-- Header cell slots -->
      <template
        v-for="col in headerSlotColumns"
        :key="'header-' + col.name"
        v-slot:[`header-cell-${col.name}`]="props"
      >
        <slot :name="`header-cell-${col.name}`" :props="props" :col="col">
          <q-th :props="props">
            <span class="text-weight-medium text-caption">
              {{ props.col.label }}
            </span>
          </q-th>
        </slot>
      </template>

      <!-- Hover-expand body cells -->
      <template
        v-for="col in hoverExpandColumns"
        :key="'hover-' + col.name"
        v-slot:[`body-cell-${col.name}`]="props"
      >
        <q-td
          :props="props"
          class="seo-data-grid__hover-cell"
          @mouseenter="onCellHover(props.row[rowKey], col.name, true)"
          @mouseleave="onCellHover(props.row[rowKey], col.name, false)"
        >
          <div
            class="seo-data-grid__cell-inner"
            :class="{
              'seo-data-grid__cell-inner--expanded': isCellExpanded(props.row[rowKey], col.name),
            }"
          >
            <slot
              :name="`body-cell-${col.name}`"
              :props="props"
              :expanded="isCellExpanded(props.row[rowKey], col.name)"
            >
              <template v-if="isCellExpanded(props.row[rowKey], col.name)">
                {{ props.value }}
              </template>
              <template v-else>
                <span class="seo-data-grid__truncated">
                  {{ truncateValue(props.value, col._truncateLen || 12) }}
                </span>
              </template>
            </slot>
          </div>
        </q-td>
      </template>

      <!-- Forward parent body-cell slots (non-hover ones; hover-expand handled above) -->
      <template
        v-for="slotName in forwardedCellSlots"
        :key="slotName"
        v-slot:[slotName]="props"
      >
        <slot :name="slotName" v-bind="props" />
      </template>

      <!-- Accordion body slot -->
      <!-- NOTE: when hasAccordion is true, the body slot replaces all body-cell-X slots,
           so hover-expand and custom cell rendering are handled inline below -->
      <template v-if="hasAccordion" v-slot:body="props">
        <slot name="body" :props="props" :toggle="() => toggleRow(props.row[rowKey])" :expanded="isRowExpanded(props.row[rowKey])">
          <q-tr
            :props="props"
            class="seo-data-grid__row"
            :class="{
              'seo-data-grid__row--expanded': isRowExpanded(props.row[rowKey]),
              'cursor-pointer': accordionClickable,
            }"
            @click="accordionClickable && toggleRow(props.row[rowKey])"
          >
            <q-td auto-width v-if="accordionClickable">
              <q-btn
                size="xs"
                flat
                dense
                round
                color="grey-6"
                :icon="isRowExpanded(props.row[rowKey]) ? 'o_expand_less' : 'o_expand_more'"
                @click.stop="toggleRow(props.row[rowKey])"
              />
            </q-td>
            <q-td
              v-for="col in visibleColumns"
              :key="col.name"
              :props="props"
              :class="{ 'seo-data-grid__hover-cell': col.hoverExpand }"
              @mouseenter="col.hoverExpand && onCellHover(props.row[rowKey], col.name, true)"
              @mouseleave="col.hoverExpand && onCellHover(props.row[rowKey], col.name, false)"
            >
              <div
                v-if="col.hoverExpand"
                class="seo-data-grid__cell-inner"
                :class="{
                  'seo-data-grid__cell-inner--expanded': isCellExpanded(props.row[rowKey], col.name),
                }"
              >
                <slot
                  :name="`body-cell-${col.name}`"
                  :props="props"
                  :expanded="isCellExpanded(props.row[rowKey], col.name)"
                >
                  <template v-if="isCellExpanded(props.row[rowKey], col.name)">
                    {{ col.format ? col.format(props.row[col.field], props.row) : props.row[col.field] }}
                  </template>
                  <template v-else>
                    <span class="seo-data-grid__truncated">
                      {{ truncateValue(col.format ? col.format(props.row[col.field], props.row) : props.row[col.field], col._truncateLen || 12) }}
                    </span>
                  </template>
                </slot>
              </div>
              <slot
                v-else
                :name="`body-cell-${col.name}`"
                :props="props"
              >
                {{ col.format ? col.format(props.row[col.field], props.row) : props.row[col.field] }}
              </slot>
            </q-td>
          </q-tr>
          <q-tr
            v-show="isRowExpanded(props.row[rowKey])"
            class="seo-data-grid__accordion-row"
          >
            <q-td :colspan="visibleColumns.length + (accordionClickable ? 1 : 0)">
              <div class="seo-data-grid__accordion-content q-pa-sm">
                <slot
                  name="accordion"
                  :row="props.row"
                  :close="() => collapseRow(props.row[rowKey])"
                />
              </div>
            </q-td>
          </q-tr>
        </slot>
      </template>

      <!-- Bottom row -->
      <template v-slot:bottom-row v-if="$slots.bottomRow">
        <slot name="bottomRow" />
      </template>

      <!-- No data -->
      <template v-slot:no-data>
        <div class="text-grey-6 q-pa-lg text-center">
          <q-icon name="o_search_off" size="sm" class="q-mr-xs" />
          <span class="text-caption">No data available</span>
        </div>
      </template>

      <!-- Loading indicator -->
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
    </q-table>

    <!-- Footer -->
    <div class="seo-data-grid__footer row items-center q-mt-xs q-px-sm" v-if="showFooter">
      <div class="text-caption text-grey-6">
        <template v-if="totalRows > 0">
          Showing
          {{ (tablePagination.page - 1) * tablePagination.rowsPerPage + 1 }}
          &ndash;
          {{ Math.min(tablePagination.page * tablePagination.rowsPerPage, totalRows) }}
          of {{ totalRows }}
        </template>
        <template v-else>
          No results
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick, useSlots } from 'vue'
import { useWindowSize, useDebounceFn } from '@vueuse/core'

// ── Props ──────────────────────────────────────────────────────────────────
const props = defineProps({
  /** Column definitions. Each column extends QTable column with:
   *   priority: 'high' | 'medium' | 'low' – responsive priority
   *   hoverExpand: boolean – enable hover-to-expand behavior
   *   required: boolean – cannot be hidden by responsive rules
   *   _truncateLen: number – max chars before truncation in collapsed state
   */
  columns: { type: Array, required: true },
  /** Pre-fetched row data (mutually exclusive with getDataFn for client-side) */
  rows: { type: Array, default: () => [] },
  /** Async data fetcher (server-side mode). Called with (params) */
  getDataFn: { type: Function, default: null },
  /** Response key for row array when using getDataFn */
  dataKey: { type: String, default: 'data' },
  /** Response key for total count */
  totalKey: { type: String, default: 'totalCount' },
  /** Unique row identifier field */
  rowKey: { type: String, default: 'id' },
  /** Table name for localStorage persistence key */
  tableName: { type: String, default: 'seo-grid' },
  /** External filter parameters */
  filterParams: { type: Object, default: () => ({}) },
  /** Default rows per page */
  rowsPerPage: { type: Number, default: 25 },
  /** Show top toolbar */
  showToolbar: { type: Boolean, default: true },
  /** Show footer with row count */
  showFooter: { type: Boolean, default: true },
  /** Show screen-size indicator badge (debug) */
  showScreenIndicator: { type: Boolean, default: false },
  /** Grid title shown in toolbar */
  title: { type: String, default: '' },
  /** Enable accordion row expansion */
  hasAccordion: { type: Boolean, default: false },
  /** Click on row to expand accordion (if false, only the arrow button toggles) */
  accordionClickable: { type: Boolean, default: true },
  /** Enable row selection */
  selection: { type: String, default: 'none' },
  /** Selected rows label fn */
  selectedRowsLabel: { type: Function, default: null },
  /** Custom filter method for client-side filtering */
  customFilterMethod: { type: Function, default: null },
  /** Use dense table styling */
  dense: { type: Boolean, default: false },
  /** External loading state override */
  loading: { type: Boolean, default: false },
  /** Explicitly register body-cell slot names (e.g. ['body-cell-actions']).
   *  Without accordion these slots are auto-forwarded from $slots. */
  slotNames: { type: Array, default: () => [] },
})

// ── Emits ──────────────────────────────────────────────────────────────────
const emit = defineEmits([
  'row-click',
  'request',
  'update:selected',
  'column-visibility-change',
])

// ── Refs ───────────────────────────────────────────────────────────────────
const gridContainer = ref(null)
const qTableRef = ref(null)
const showColumnMenu = ref(false)
const expandedRows = ref(new Set())
const expandedCells = ref(new Set())
const totalRows = ref(0)
const internalLoading = ref(false)

// ── Window size (VueUse) ──────────────────────────────────────────────────
const { width: windowWidth } = useWindowSize()

// ── Screen size classification ────────────────────────────────────────────
// Breakpoints from spec:
//   < 1024px → small  (collapse medium + low)
//   < 1366px → medium (collapse low only)
//   >= 1366px → large (show all)
const SMALL_BREAKPOINT = 1024
const MEDIUM_BREAKPOINT = 1366

const isSmallScreen = computed(() => windowWidth.value < SMALL_BREAKPOINT)
const isMediumScreen = computed(() => windowWidth.value >= SMALL_BREAKPOINT && windowWidth.value < MEDIUM_BREAKPOINT)

const screenSizeLabel = computed(() => {
  if (isSmallScreen.value) return 'SM'
  if (isMediumScreen.value) return 'MD'
  return 'LG'
})

const screenSizeColor = computed(() => {
  if (isSmallScreen.value) return 'orange-6'
  if (isMediumScreen.value) return 'blue-5'
  return 'green-5'
})

// ── Persistence key ────────────────────────────────────────────────────────
const storageKey = computed(() => `seo-grid:${props.tableName}`)

// ── Column processing ──────────────────────────────────────────────────────
function loadSavedPreferences() {
  try {
    const raw = localStorage.getItem(storageKey.value)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore corrupt data */ }
  return {}
}

function savePreferences() {
  const toSave = {}
  for (const col of _internalColumns.value) {
    toSave[col.name] = col._userVisible
  }
  try {
    localStorage.setItem(storageKey.value, JSON.stringify(toSave))
  } catch { /* quota exceeded, silent fail */ }
}

// Internal column state — we extend the prop columns with reactive flags
const _internalColumns = ref([])

function buildInternalColumns() {
  const saved = loadSavedPreferences()
  return props.columns.map((col) => {
    const priority = col.priority || 'high'
    const savedVisible = saved[col.name]
    return {
      ...col,
      priority,
      required: col.required || priority === 'high',
      _userVisible: savedVisible !== undefined ? savedVisible : (col.visible !== false),
      _truncateLen: col._truncateLen || col.truncateLen || 12,
      hoverExpand: col.hoverExpand || false,
    }
  })
}

// ── Visible columns (responsive + user preferences) ───────────────────────
const visibleColumns = computed(() => {
  return _internalColumns.value.filter((col) => {
    // User has explicitly hidden this column
    if (!col._userVisible) return false
    // Responsive auto-hide based on screen size + priority
    if (isSmallScreen.value && col.priority === 'low') return false
    if (isSmallScreen.value && col.priority === 'medium') return false
    if (isMediumScreen.value && col.priority === 'low') return false
    return true
  })
})

const visibleColumnFields = computed(() =>
  visibleColumns.value.map((c) => c.name)
)

// ── Toggleable columns shown in menu ──────────────────────────────────────
const toggleableColumns = computed(() =>
  _internalColumns.value.filter((c) => !c.required)
)

// ── Hover-expand columns ──────────────────────────────────────────────────
const hoverExpandColumns = computed(() =>
  visibleColumns.value.filter((c) => c.hoverExpand)
)

// ── Header slot columns (from column config + parent slots) ───────────────
const headerSlotColumns = computed(() => {
  const configCols = visibleColumns.value.filter((c) => c.headerSlotName)
  const slotColNames = Object.keys(slots)
    .filter((k) => k.startsWith('header-cell-'))
    .map((k) => k.replace('header-cell-', ''))
  const extra = visibleColumns.value.filter(
    (c) => !c.headerSlotName && slotColNames.includes(c.name)
  )
  // Merge both sources, deduplicate by name
  const seen = new Set(configCols.map((c) => c.name))
  return [...configCols, ...extra.filter((c) => !seen.has(c.name))]
})

// ── Slot forwarding (auto-detect + explicit) ──────────────────────────────
const slots = useSlots()

// Collect body-cell slot names from parent that need forwarding.
// Hover-expand slots are handled separately (they have custom wrappers).
const forwardedCellSlots = computed(() => {
  const hoverNames = new Set(hoverExpandColumns.value.map((c) => `body-cell-${c.name}`))
  const autoDetected = Object.keys(slots).filter((k) => k.startsWith('body-cell-'))
  const explicit = (props.slotNames || []).filter((k) => k.startsWith('body-cell-'))
  // Merge both sources, deduplicate, exclude hover-expand
  const merged = [...new Set([...autoDetected, ...explicit])]
  return merged.filter((k) => !hoverNames.has(k))
})

// ── Pagination ────────────────────────────────────────────────────────────
const tablePagination = ref({
  page: 1,
  rowsPerPage: props.rowsPerPage,
  rowsNumber: 0,
  sortBy: '',
  descending: false,
})

// ── Selection ──────────────────────────────────────────────────────────────
const selected = ref([])

// ── Hover cell logic ───────────────────────────────────────────────────────
const HOVER_DEBOUNCE_MS = 100

function cellKey(rowId, colName) {
  return `${rowId}::${colName}`
}

function isCellExpanded(rowId, colName) {
  return expandedCells.value.has(cellKey(rowId, colName))
}

const onCellHover = useDebounceFn((rowId, colName, entering) => {
  if (entering) {
    expandedCells.value.add(cellKey(rowId, colName))
  } else {
    expandedCells.value.delete(cellKey(rowId, colName))
  }
  // Trigger reactivity
  expandedCells.value = new Set(expandedCells.value)
}, HOVER_DEBOUNCE_MS)

function truncateValue(value, maxLen) {
  if (value == null) return '-'
  const str = String(value)
  if (str.length <= maxLen) return str
  return str.slice(0, maxLen) + '…'
}

// ── Accordion logic ───────────────────────────────────────────────────────
function isRowExpanded(rowId) {
  return expandedRows.value.has(rowId)
}

function toggleRow(rowId) {
  const next = new Set(expandedRows.value)
  if (next.has(rowId)) {
    next.delete(rowId)
  } else {
    next.add(rowId)
  }
  expandedRows.value = next
}

function collapseRow(rowId) {
  const next = new Set(expandedRows.value)
  next.delete(rowId)
  expandedRows.value = next
}

// ── Column toggle ──────────────────────────────────────────────────────────
function onColumnToggle(col) {
  savePreferences()
  emit('column-visibility-change', {
    name: col.name,
    visible: col._userVisible,
    columns: visibleColumns.value,
  })
}

function resetColumnDefaults() {
  for (const col of _internalColumns.value) {
    col._userVisible = col.visible !== false
  }
  savePreferences()
  showColumnMenu.value = false
}

// ── Row click ──────────────────────────────────────────────────────────────
function onRowClick(evt, row, index) {
  emit('row-click', { evt, row, index })
}

// ── Server-side request ────────────────────────────────────────────────────
async function onRequest(requestProps) {
  if (!props.getDataFn) return

  const { pagination } = requestProps
  tablePagination.value.page = pagination.page
  tablePagination.value.rowsPerPage = pagination.rowsPerPage
  tablePagination.value.sortBy = pagination.sortBy
  tablePagination.value.descending = pagination.descending

  internalLoading.value = true

  try {
    const params = {
      maxResultCount: pagination.rowsPerPage,
      skipCount: (pagination.page - 1) * pagination.rowsPerPage,
      sorting: pagination.sortBy
        ? `${pagination.sortBy} ${pagination.descending ? 'DESC' : 'ASC'}`
        : '',
      ...props.filterParams,
    }

    const response = await props.getDataFn(params)

    const data = response?.data || response
    const rowsData = props.dataKey ? data[props.dataKey] : data
    const total = props.totalKey ? data[props.totalKey] : (Array.isArray(rowsData) ? rowsData.length : 0)

    totalRows.value = total ?? 0
    tablePagination.value.rowsNumber = totalRows.value

    emit('request', { ...requestProps, response, rowsData, total })
  } finally {
    internalLoading.value = false
  }
}

// ── Public methods ─────────────────────────────────────────────────────────
function refresh() {
  if (props.getDataFn) {
    onRequest({ pagination: { ...tablePagination.value } })
  }
}

function resetPagination() {
  tablePagination.value.page = 1
  refresh()
}

function expandAllRows(rowIds) {
  expandedRows.value = new Set(rowIds)
}

function collapseAllRows() {
  expandedRows.value = new Set()
}

defineExpose({
  qTableRef,
  refresh,
  resetPagination,
  expandAllRows,
  collapseAllRows,
  expandedRows,
  visibleColumns,
  tablePagination,
  selected,
})

// ── Watchers ───────────────────────────────────────────────────────────────
watch(() => props.filterParams, () => {
  resetPagination()
}, { deep: true })

watch(() => props.columns, () => {
  _internalColumns.value = buildInternalColumns()
}, { immediate: true, deep: true })

watch(visibleColumns, (cols) => {
  // Prune expanded cells for columns that are no longer visible
  const visibleNames = new Set(cols.map((c) => c.name))
  const pruned = new Set()
  for (const key of expandedCells.value) {
    const colName = key.split('::')[1]
    if (visibleNames.has(colName)) {
      pruned.add(key)
    }
  }
  expandedCells.value = pruned
})

// ── Init ────────────────────────────────────────────────────────────────────
onMounted(() => {
  _internalColumns.value = buildInternalColumns()

  // If server-side mode, do initial fetch
  if (props.getDataFn) {
    nextTick(() => refresh())
  } else {
    totalRows.value = props.rows.length
    tablePagination.value.rowsNumber = props.rows.length
  }
})


</script>

<style lang="scss">
.seo-data-grid {
  width: 100%;

  &__toolbar {
    min-height: 36px;
  }

  &__table {
    width: 100% !important;

    // Prevent horizontal scroll — let cells wrap
    .q-table__container {
      overflow-x: hidden !important;
    }

    .q-table__middle {
      overflow-x: hidden !important;
    }

    // Header styling
    & .seo-data-grid__header {
      th {
        white-space: nowrap;
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        color: $grey-7;
        background: $grey-1;
      }
    }

    // Cell basics
    td {
      font-size: 0.82rem;
      color: $grey-9;
    }

    // Dense variant
    &--dense {
      th, td {
        padding: 4px 8px;
        font-size: 0.78rem;
      }
    }
  }

  // ── Hover-expand cell ──────────────────────────────────────────────────
  &__hover-cell {
    cursor: default;
  }

  &__cell-inner {
    transition: all 0.18s ease;
    max-width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &--expanded {
      max-width: 400px;
      white-space: normal;
      overflow: visible;
      background: $grey-2;
      border-radius: 4px;
      padding: 2px 6px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
      z-index: 2;
      position: relative;
    }
  }

  &__truncated {
    color: $grey-6;
  }

  // ── Accordion ──────────────────────────────────────────────────────────
  &__row {
    transition: background 0.15s ease;

    &:hover {
      background: $grey-1;
    }

    &--expanded {
      background: $blue-1 !important;
    }
  }

  &__accordion-row {
    background: $grey-1;
  }

  &__accordion-content {
    max-height: 400px;
    overflow-y: auto;
  }

  // ── Screen-size adapters ───────────────────────────────────────────────
  &--sm {
    .seo-data-grid__table {
      th, td {
        padding: 4px 6px;
        font-size: 0.75rem;
      }
    }
  }
}
</style>
