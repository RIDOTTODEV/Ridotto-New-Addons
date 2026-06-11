<template>
  <div class="atable-container">
    <q-table flat bordered dense square separator="cell" class="atable"
      :class="{ 'atable--grouped': hasActiveGroup, 'atable--resizing': isResizing }" :rows="tableRows"
      :columns="tableColumns" :row-key="rowKey" :style="height ? { maxHeight: height } : null"
      v-model:pagination="pagination" v-bind="$attrs">
      <!-- Gizlenen kolonlari geri acma menusu -->
      <!-- HEADER -->
      <template #header="headerProps">
        <!-- Grup satiri: expand edilen grubun ustunde birlesik baslik,
             diger kolonlar iki satiri kaplayan tek hucre (rowspan) -->
        <q-tr v-if="hasActiveGroup" :props="headerProps" class="atable-group-row">
          <template v-for="col in headerProps.cols" :key="col.name">
            <q-th v-if="activeGroupField(col)" class="atable-cell atable-group-cell" :class="[
              cellClasses(col),
              {
                'atable-group-cell--cont': !isGroupStart(col),
                'atable-group-cell--not-last': !isGroupEnd(col),
                'atable-group-cell--parent': isGroupParent(col),
              },
            ]" :style="headerStyle(col)">
              <div v-if="isGroupParent(col)" class="atable-group-label" :style="groupLabelStyle(col)">
                {{ groupLabelFor(col) }}
              </div>
            </q-th>

            <q-th v-else rowspan="2" class="atable-cell text-center q-custom-table cursor-pointer"
              :class="cellClasses(col)" :style="headerStyle(col)">
              <div class="atable-cell-content row no-wrap items-center">
                <span class="col ellipsis">{{ col.label }}</span>

                <q-icon v-if="col.onHoverExpand && !isZeroWidth(col)"
                  :name="isColExpanded(col) ? 'o_close_fullscreen' : 'o_open_in_full'" size="12px"
                  class="atable-tool-icon" :class="{ 'atable-tool-icon--active': isColExpanded(col) }"
                  @click.stop="toggleExpandCol(col)">
                </q-icon>

                <q-icon v-if="isParentColumn(col)"
                  :name="isExpanded(col) ? 'o_keyboard_double_arrow_right' : 'o_keyboard_double_arrow_left'" size="14px"
                  class="atable-tool-icon" @click.stop="toggleParent(col)">
                </q-icon>
              </div>

              <!-- Kolon kesisimindeki resize tutamaci (fit mode) -->
              <div v-if="canResize(col)" class="atable-resize-handle"
                @mousedown.prevent.stop="startResize(col, $event)"></div>
            </q-th>
          </template>
        </q-tr>

        <q-tr :props="headerProps">
          <template v-for="col in headerProps.cols" :key="col.name">
            <q-th v-if="!hasActiveGroup || activeGroupField(col)"
              class="atable-cell  text-center q-custom-table cursor-pointer" :class="cellClasses(col)"
              :style="headerStyle(col)">
              <div class="atable-cell-content row no-wrap items-center">
                <span class="col ellipsis">{{ col.label }}</span>

                <!-- onHoverExpand kolon: ikona tiklayarak genislet/daralt -->
                <q-icon v-if="col.onHoverExpand && !isZeroWidth(col)"
                  :name="isColExpanded(col) ? 'o_close_fullscreen' : 'o_open_in_full'" size="12px"
                  class="atable-tool-icon" :class="{ 'atable-tool-icon--active': isColExpanded(col) }"
                  @click.stop="toggleExpandCol(col)">
                </q-icon>

                <!-- Parent kolon: alt kolonlari ac/kapa -->
                <q-icon v-if="isParentColumn(col)"
                  :name="isExpanded(col) ? 'o_keyboard_double_arrow_right' : 'o_keyboard_double_arrow_left'" size="14px"
                  class="atable-tool-icon" @click.stop="toggleParent(col)">
                </q-icon>
              </div>

              <!-- Kolon kesisimindeki resize tutamaci (fit mode) -->
              <div v-if="canResize(col)" class="atable-resize-handle"
                @mousedown.prevent.stop="startResize(col, $event)"></div>
            </q-th>
          </template>
        </q-tr>
      </template>

      <!-- BODY -->
      <template #body="bodyProps">
        <q-tr :props="bodyProps">
          <q-td v-for="col in bodyProps.cols" :key="col.name" :props="bodyProps" class="atable-cell"
            :class="cellClasses(col)" :style="bodyStyle(col)">
            <div class="atable-cell-content ellipsis">
              {{ col.value }}
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>

  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  /**
   * q-table column tanimina ek olarak su alanlar desteklenir:
   *  - parentField:   bu kolonun bagli oldugu ana kolonun `field` degeri.
   *                   Ana kolon basligindaki ikon ile alt kolonlar
   *                   acilir/kapanir (soldan saga animasyonlu).
   *  - onHoverExpand: true ise header'da cikan ikona tiklandiginda kolon
   *                   genisler/daralir, diger kolonlar oransal olarak daralir.
   *
   * Kolonlar header kesisimindeki tutamac ile resize edilebilir (fit mode:
   * bir kolon buyurken sagindaki komsusu kuculur, tablo genisligi sabittir).
   */
  columns: { type: Array, default: null },
  rows: { type: Array, default: null },
  rowKey: { type: String, default: 'id' },
  // Tablonun max yuksekligi; data bu yuksekligi asinca tablo icinde
  // scroll olusur ve header sticky kalir
  height: { type: String, default: '70vh' },
})

/* ------------------------------------------------------------------ */
/* Demo data (props verilmezse kullanilir)                             */
/* ------------------------------------------------------------------ */

const demoColumns = [
  { name: 'id', label: 'ID', field: 'id', align: 'center', required: true },
  { name: 'p1', label: 'P1', field: 'p1', align: 'center', parentField: 'result', onHoverExpand: true },
  { name: 'p2', label: 'P2', field: 'p2', align: 'center', parentField: 'result', onHoverExpand: true },
  { name: 'p3', label: 'P3', field: 'p3', align: 'center', parentField: 'result', onHoverExpand: true },
  { name: 'result', label: 'Result', field: 'result', align: 'center' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'b1', label: 'Baran 1', field: 'b1', align: 'center', parentField: 'b4', onHoverExpand: true },
  { name: 'b2', label: 'Baran 2', field: 'b2', align: 'center', parentField: 'b4', onHoverExpand: true },
  { name: 'b3', label: 'Baran 3', field: 'b3', align: 'center', parentField: 'b4', onHoverExpand: true },
  { name: 'b4', label: 'Baran 4', field: 'b4', align: 'center', },
  { name: 'b5', label: 'Baran 5', field: 'b5', align: 'center', onHoverExpand: true },
]

const demoRows = Array.from({ length: 40 }, (_, i) => {
  const p1 = (i + 1) * 120
  const p2 = (i + 1) * 45
  const p3 = (i + 1) * 15
  return {
    id: i + 1,
    p1,
    p2,
    p3,
    result: p1 + p2 + p3,
    status: i % 2 === 0 ? 'Open' : 'Closed',
    b1: `B1-${i + 1}`,
    b2: `B2-${i + 1}`,
    b3: `Uzun bir hover icerigi ${i + 1}`,
    b4: `B4-${i + 1}`,
    b5: `B5-${i + 1}`,
  }
})

const rawColumns = computed(() => (props.columns?.length ? props.columns : demoColumns))

const tableColumns = computed(() => rawColumns.value)


const tableRows = computed(() => (props.rows?.length ? props.rows : demoRows))

const colField = (col) => col.field ?? col.name

/* ------------------------------------------------------------------ */
/* 1) Parent / alt kolon yonetimi                                      */
/* ------------------------------------------------------------------ */

// { [parentField]: true } -> alt kolonlari acik olan parent'lar
const expandedParents = ref({})

// { [colName]: true } -> su an acik (gorunur) olan alt kolonlar.
// Her alt kolon kendi sirasi geldiginde tek tek acilir/kapanir;
// boylece soldan saga acilma / sagdan sola kapanma dalgasi olusur
// ve her adimda genislikler kendi gecisini akici sekilde yapar.
const openSubCols = ref({})

const parentFieldSet = computed(
  () => new Set(tableColumns.value.filter((c) => c.parentField).map((c) => c.parentField)),
)

const isParentColumn = (col) => parentFieldSet.value.has(colField(col))
const isSubColumn = (col) => !!col.parentField
const isExpanded = (col) => !!expandedParents.value[colField(col)]
const isCollapsedSub = (col) => isSubColumn(col) && !openSubCols.value[col.name]

/* ------------------------------------------------------------------ */
/* 2) Soldan saga acilma / sagdan sola kapanma (sirali animasyon)      */
/* ------------------------------------------------------------------ */

const STAGGER_MS = 80

const subSiblings = (parentField) => tableColumns.value.filter((c) => c.parentField === parentField)

let staggerTimers = []

const clearStaggerTimers = () => {
  staggerTimers.forEach((t) => clearTimeout(t))
  staggerTimers = []
}

const toggleParent = (col) => {
  const field = colField(col)
  const opening = !expandedParents.value[field]
  expandedParents.value = { ...expandedParents.value, [field]: opening }

  // Onceki yarim kalmis animasyon adimlarini iptal et
  clearStaggerTimers()

  // Acilirken soldan saga, kapanirken sagdan sola sirayla
  const ordered = opening ? subSiblings(field) : [...subSiblings(field)].reverse()
  ordered.forEach((sub, i) => {
    const timer = setTimeout(() => {
      openSubCols.value = { ...openSubCols.value, [sub.name]: opening }
    }, i * STAGGER_MS)
    staggerTimers.push(timer)
  })
}

onBeforeUnmount(clearStaggerTimers)

/* ------------------------------------------------------------------ */
/* 2b) Grup baslik satiri (expand edilen grup icin ek header tr)       */
/* ------------------------------------------------------------------ */

// En az bir parent expand edilmisse header'a grup satiri eklenir
const hasActiveGroup = computed(() =>
  Object.entries(expandedParents.value).some(([field, open]) => open && parentFieldSet.value.has(field)),
)

// Kolon aktif (expand edilmis) bir gruba aitse grubun parentField'i, degilse null
const activeGroupField = (col) => {
  if (isSubColumn(col) && expandedParents.value[col.parentField]) return col.parentField
  const field = colField(col)
  if (isParentColumn(col) && expandedParents.value[field]) return field
  return null
}

// Grubun uyeleri: alt kolonlar + parent kolon (tablo sirasiyla)
const groupMembers = (field) =>
  tableColumns.value.filter((c) => c.parentField === field || colField(c) === field)

const isGroupStart = (col) => {
  const members = groupMembers(activeGroupField(col))
  return members[0]?.name === col.name
}

const isGroupEnd = (col) => {
  const members = groupMembers(activeGroupField(col))
  return members[members.length - 1]?.name === col.name
}

const isGroupParent = (col) => isParentColumn(col) && !!expandedParents.value[colField(col)]

const groupLabelFor = (col) => col.expandedLabel ?? `${col.label} Expanded`

// Grup etiketi parent hucresine sagdan hizali konur ve genisligi grubun
// toplam genisligi kadar sola tasar; boylece tum grubun ortasinda durur
const groupLabelStyle = (parentCol) => {
  const field = colField(parentCol)
  const total = groupMembers(field).reduce((sum, c) => sum + widthPctFor(c), 0)
  const parentPct = widthPctFor(parentCol) || 1
  return { width: `${(total / parentPct) * 100}%` }
}

/* ------------------------------------------------------------------ */
/* 3) onHoverExpand - header ikonuna tiklayarak kolon genisletme       */
/* ------------------------------------------------------------------ */

// { [colName]: true } -> ikon ile genisletilmis kolonlar
const expandedCols = ref({})

const isColExpanded = (col) => !!expandedCols.value[col.name]

const toggleExpandCol = (col) => {
  expandedCols.value = {
    ...expandedCols.value,
    [col.name]: !expandedCols.value[col.name],
  }
}

/* ------------------------------------------------------------------ */
/* 4) Kolon gizleme / gosterme (eye icon)                              */
/* ------------------------------------------------------------------ */

const hiddenCols = ref({})

const isHidden = (col) => !!hiddenCols.value[col.name]
const isZeroWidth = (col) => isCollapsedSub(col) || isHidden(col)


/* ------------------------------------------------------------------ */
/* 5) Siralama (q-table pagination uzerinden)                          */
/* ------------------------------------------------------------------ */

const pagination = ref({
  page: 1,
  // 0 = tum satirlar; sticky header tablo ici scroll ile calisir
  rowsPerPage: 0,
})



/* ------------------------------------------------------------------ */
/* Kolon genislik hesabi                                               */
/* table-layout: fixed oldugu icin sadece header genislikleri yeterli; */
/* body kolonlari header'i takip eder.                                 */
/* ------------------------------------------------------------------ */


const widthPctFor = (col) => {
  if (isZeroWidth(col)) return 0

  // Kullanici elle resize ettiyse o genislik gecerlidir
  if (manualWidths.value[col.name] != null) return manualWidths.value[col.name]

  const n = tableColumns.value.length
  const base = 100 / n

  // ikon ile genisletilmis (ve gorunur) kolonlar
  const expandedNames = tableColumns.value
    .filter((c) => c.onHoverExpand && expandedCols.value[c.name] && !isZeroWidth(c))
    .map((c) => c.name)

  if (!expandedNames.length) return base

  // genisletilen kolonlar buyur, kalan genislik digerlerine esit dagilir
  const expandedWidth = Math.min(base * 2, base + 18)
  if (expandedNames.includes(col.name)) return expandedWidth
  return (100 - expandedWidth * expandedNames.length) / (n - expandedNames.length)
}

const widthFor = (col) => `${widthPctFor(col)}%`

/* ------------------------------------------------------------------ */
/* 7) Kolon resize (fit mode)                                          */
/* Tutamac iki kolonun kesisimindedir; sola/saga cekildiginde sol      */
/* kolon buyur/kuculur, sagindaki gorunur kolon ayni miktarda telafi   */
/* eder. Boylece tablonun toplam genisligi degismez.                   */
/* ------------------------------------------------------------------ */

const MIN_COL_PCT = 4

// { [colName]: pct } -> elle resize edilmis kolon genislikleri
const manualWidths = ref({})
const isResizing = ref(false)
let resizeState = null

// Saga dogru ilk gorunur (genisligi 0 olmayan) kolon
const nextVisibleCol = (col) => {
  const cols = tableColumns.value
  const start = cols.findIndex((c) => c.name === col.name)
  for (let i = start + 1; i < cols.length; i++) {
    if (!isZeroWidth(cols[i])) return cols[i]
  }
  return null
}

// Son gorunur kolonun tutamaci yok: fit mode'da telafi edecek komsusu olmali
const canResize = (col) => !isZeroWidth(col) && !!nextVisibleCol(col)

const startResize = (col, event) => {
  const next = nextVisibleCol(col)
  if (!next) return

  const table = event.target.closest('table')
  resizeState = {
    startX: event.clientX,
    tableWidth: table?.getBoundingClientRect().width || 1,
    // Yuzdeler render'da toplamlarina gore normalize edildiginden
    // pixel -> yuzde cevriminde toplam olcek gerekir
    totalPct: tableColumns.value.reduce((sum, c) => sum + widthPctFor(c), 0),
    colName: col.name,
    nextName: next.name,
    colPct: widthPctFor(col),
    nextPct: widthPctFor(next),
  }
  isResizing.value = true
  document.addEventListener('mousemove', onResizeMove)
  document.addEventListener('mouseup', stopResize)
}

const onResizeMove = (event) => {
  if (!resizeState) return

  const { startX, tableWidth, totalPct, colName, nextName, colPct, nextPct } = resizeState
  const deltaPct = ((event.clientX - startX) / tableWidth) * totalPct

  // Fit mode: iki kolonun toplami sabit kalir
  const pairTotal = colPct + nextPct
  const newCol = Math.min(Math.max(colPct + deltaPct, MIN_COL_PCT), pairTotal - MIN_COL_PCT)

  manualWidths.value = {
    ...manualWidths.value,
    [colName]: newCol,
    [nextName]: pairTotal - newCol,
  }
}

const stopResize = () => {
  isResizing.value = false
  resizeState = null
  document.removeEventListener('mousemove', onResizeMove)
  document.removeEventListener('mouseup', stopResize)
}

onBeforeUnmount(stopResize)

// Siralama JS tarafinda (toggleParent) yapildigi icin CSS'te ekstra
// transition-delay yok; her kolon kendi adiminda akici sekilde animasyonlanir.
const headerStyle = (col) => ({ width: widthFor(col) })

const bodyStyle = () => ({})

const cellClasses = (col) => ({
  'atable-cell--sub': isSubColumn(col),
  // Expand edilmis grubun tum kolonlari (parent dahil) ayni arka plani alir
  'atable-cell--in-group': !!activeGroupField(col),
  'atable-cell--collapsed': isZeroWidth(col),
  'atable-cell--hover-expanded': col.onHoverExpand && isColExpanded(col),
})



</script>

<style scoped lang="scss">
$atable-group-row-h: 24px;

.atable-container {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

.atable {

  // Genislik animasyonlarinin akici olmasi icin sabit tablo duzeni sart
  :deep(table) {
    table-layout: fixed;
    width: 100%;
  }

  :deep(.q-table__middle) {
    margin-top: 0 !important;
  }

  // Sticky header: tablo ici scroll'da basliklar ustte sabit kalir.
  // Arkadan satirlar gorunmesin diye arka planlar opak olmali.
  :deep(thead tr th) {
    position: sticky;
    top: 0;
    z-index: 2;
    background-color: #ffffff;
  }

  :deep(thead tr th.atable-cell--sub),
  :deep(thead tr th.atable-cell--in-group) {
    background-color: #f1f6fc;
  }

  :deep(thead tr th.atable-cell--hover-expanded) {
    background-color: #e8f1fb;
  }

  // Grup satiri varken ikinci header satiri grup satirinin altina yapisir
  &.atable--grouped :deep(thead tr:nth-child(2) th) {
    top: $atable-group-row-h;
  }

  :deep(.atable-group-row th) {
    height: $atable-group-row-h;
    padding-top: 0;
    padding-bottom: 0;
  }

  // Grup hucreleri: aralarindaki dikey cizgiler kaldirilarak tek parca gorunur
  :deep(thead tr th.atable-group-cell) {
    background-color: #e3eefb;
  }

  :deep(th.atable-group-cell--cont) {
    border-left-width: 0 !important;
  }

  :deep(th.atable-group-cell--not-last) {
    border-right-width: 0 !important;
  }

  // Etiket parent hucresinden sola tasarak grubun tamamini kaplar
  :deep(th.atable-group-cell--parent) {
    overflow: visible;
  }
}

.atable-cell {
  overflow: hidden;
  white-space: nowrap;
  will-change: width;
  transition:
    width 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    padding 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    border-width 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.3s ease,
    background-color 0.25s ease;
}

.atable-cell-content {
  min-width: 0;
  overflow: hidden;
}

/* Alt kolonlara hafif bir ton vererek gruplandigini belli et;
   grup expand edilince parent kolon da ayni tonu alir */
.atable-cell--sub,
.atable-cell--in-group {
  background-color: rgba(25, 118, 210, 0.04);
}

/* Kapali/gizli kolon: genislik header'dan 0 gelir, padding/border/opacity
   burada sifirlanir ki tamamen kaybolsun */
.atable-cell--collapsed {
  padding-left: 0 !important;
  padding-right: 0 !important;
  border-left-width: 0 !important;
  border-right-width: 0 !important;
  opacity: 0;
}

/* Hover ile genisleyen kolon vurgusu */
.atable-cell--hover-expanded {
  background-color: rgba(25, 118, 210, 0.08);
}

/* Kolon kesisimindeki resize tutamaci */
.atable-resize-handle {
  position: absolute;
  top: 0;
  right: 0;
  width: 7px;
  height: 100%;
  cursor: col-resize;
  z-index: 3;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: rgba(25, 118, 210, 0.35);
  }
}

/* Surukleme sirasinda genislik animasyonlari kapatilir; aksi halde
   handle mouse'u geriden takip eder */
.atable--resizing {
  cursor: col-resize;
  user-select: none;

  .atable-cell {
    transition: none !important;
  }

  .atable-resize-handle {
    background-color: rgba(25, 118, 210, 0.35);
  }
}

/* Grup baslik etiketi: parent hucresine sagdan hizali, genisligi grubun
   toplamina esit oldugu icin metin tum grubun ortasinda gorunur */
.atable-group-label {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  overflow: hidden;
  font-size: 11px;
  font-weight: 600;
  color: #1565c0;
  pointer-events: none;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>

<!-- q-menu body'ye portal edildigi icin bu stiller scoped olamaz -->
<style lang="scss">
.atable-tools-menu {
  overflow: visible !important;
  border-radius: 6px;
  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.18);
  background: #ffffff;
  min-width: 100px;
}

.atable-tools-row {
  position: relative;
  gap: 4px;
  padding: 6px 8px;
}

/* Header'i isaret eden caret */
.atable-tools-caret {
  position: absolute;
  top: -5px;
  left: 50%;
  width: 10px;
  height: 10px;
  margin-left: -5px;
  background: #ffffff;
  transform: rotate(45deg);
  border-radius: 1px;
}

.atable-tool-icon {
  cursor: pointer;
  color: #616161;
  border-radius: 4px;
  padding: 3px;
  transition:
    color 0.15s ease,
    transform 0.15s ease,
    background-color 0.15s ease;

  &:hover {
    color: var(--q-primary, #1976d2);
    transform: scale(1.12);
    background-color: rgba(25, 118, 210, 0.08);
  }
}

.atable-tool-icon--active {
  color: var(--q-primary, #1976d2);
}





.atable :deep(.q-table__sort-icon) {
  display: none;
}
</style>
