<template>
  <q-page class="q-pa-md">
    <SupaTable :columns="columns" :getDataFn="reportStore.getFilteredReport" :filterValues="filterValues"
      ref="inOutReportTable" tableName="filteredReportColumns" :filterParams="filterValues">
      <template v-slot:headerFilterSlots>
        <div class="flex sm:flex-row flex-col justify-start gap-2 w-full sm:w-auto">
          <date-time-picker @selected-date="
            (val) => {
              filterValues = {
                ...filterValues,
                ...val,
              }
            }
          " />
          <q-btn type="button" :label="$t('filter')" icon="tune" color="grey-2" text-color="dark" size="13px" unelevated
            no-caps @click="inOutReportTable.fetchData()" />
        </div>
      </template>
      <template v-slot:bottomRow="props">
        <q-tr :props="props" class="bg-grey-1">
          <q-td v-for="(col, index) in [...props.cols.sort((a, b) => a.orderColumn - b.orderColumn)]" :key="index"
            :name="col.name" align="center" :class="{
              'bg-red-1':
                col.showTotal && props.rows.reduce((acc, item) => acc + item[col.field], 0) < 0,
              'bg-green-1':
                col.showTotal && props.rows.reduce((acc, item) => acc + item[col.field], 0) > 0,
            }">
            <div class="text-subtitle2" v-if="col.showTotal">
              {{col.format(props.rows.reduce((acc, item) => acc + item[col.field], 0))}}
            </div>
            <div class="text-subtitle2" v-else>-</div>
          </q-td>
        </q-tr>
      </template>
    </SupaTable>

    <q-card-section v-if="showPivot" class="q-pa-none q-mt-md">
      <ejs-pivotview :dataSourceSettings="dataSourceSettings" :gridSettings="gridSettings" :isVue3="true"></ejs-pivotview>
    </q-card-section>
  </q-page>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useReportStore } from 'src/stores/report-store'
const reportStore = useReportStore()
const filterValues = ref(null)
const inOutReportTable = ref(null)

const columns = ref([
  {
    field: 'id',
    label: 'Id',
    required: true,
    classes: 'bg-grey-2',
  },
  {
    field: 'playerName',
    label: 'Player Name',
  },
  {
    field: 'firstVisitDate',
    fieldType: 'date',
  },
  {
    field: 'lastVisitDate',
    fieldType: 'date',
  },
  {
    field: 'playerCountry',
    label: 'Player Country',
  },
  {
    field: 'rating',
    label: 'Rating',
  },
  {
    field: 'topRating',
    label: 'Top Rating',
  },
  {
    field: 'totalDrop',
    label: 'Total Drop',
    showTotal: true,
    fieldType: 'priceAbs',
  },
  {
    field: 'totalResult',
    label: 'Total Result',
    showTotal: true,
    fieldType: 'priceAbs',
  },
  {
    field: 'avgDrop',
    label: 'Avg Drop',
    showTotal: true,
    fieldType: 'priceAbs',
  },
  {
    field: 'avgResult',
    label: 'Avg Result',
    showTotal: true,
    fieldType: 'priceAbs',
  },
  {
    field: 'totalSlotResult',
    label: 'Total Slot Result',
    showTotal: true,
    fieldType: 'priceAbs',
  },
  {
    field: 'totalLgResult',
    label: 'Total LG Result',
    showTotal: true,
    fieldType: 'priceAbs',
  },
  {
    field: 'lgPlayDays',
    label: 'LG Play Days',
    showTotal: true,
  },
  {
    field: 'slotPlayDays',
    label: 'Slot Play Days',
    showTotal: true,
  },
])




import { PivotViewComponent as EjsPivotview } from '@syncfusion/ej2-vue-pivotview';
import { registerLicense } from '@syncfusion/ej2-base'

registerLicense(process.env.SYNCFUSION_KEY);

const showPivot = ref(false)



const dataSourceSettings = ref({
  dataSource: [],

  // Boyutlar: Ülke > Rating > Oyuncu hiyerarşisi (drill-down)
  rows: [
    { name: 'playerCountry', caption: 'Country' },
    { name: 'rating', caption: 'Rating' },
    { name: 'playerName', caption: 'Player' },
  ],

  // Kolonu temiz tutuyoruz; topRating filtrede. Cross-tab istersen
  // aşağıdaki satırı aç: columns: [{ name: 'topRating', caption: 'Top Rating' }]
  columns: [],

  values: [
    { name: 'totalDrop', caption: 'Total Drop', type: 'Sum' },
    { name: 'totalResult', caption: 'Total Result', type: 'Sum' },
    { name: 'totalSlotResult', caption: 'Slot Result', type: 'Sum' },
    { name: 'totalLgResult', caption: 'LG Result', type: 'Sum' },
    { name: 'slotPlayDays', caption: 'Slot Play Days', type: 'Sum' },
    { name: 'lgPlayDays', caption: 'LG Play Days', type: 'Sum' },
    // Doğru ortalama: ham avg alanlarını toplamak yerine calculated field
    { name: 'avgDropCalc', caption: 'Avg Drop' },
    { name: 'avgResultCalc', caption: 'Avg Result' },
  ],

  // playerId benzersiz olduğu için boyut değil filtre; topRating de filtrede
  filters: [
    { name: 'playerId', caption: 'Player Id' },
    { name: 'topRating', caption: 'Top Rating' },
  ],

  // Sum(totalX) / Sum(playDays) => ağırlıklı (gerçek) ortalama
  calculatedFieldSettings: [
    {
      name: 'avgDropCalc',
      formula: '"Sum(totalDrop)" / "Sum(slotPlayDays)"',
    },
    {
      name: 'avgResultCalc',
      formula: '"Sum(totalResult)" / ("Sum(slotPlayDays)" + "Sum(lgPlayDays)")',
    },
  ],

  formatSettings: [
    { name: 'totalDrop', format: 'N2' },
    { name: 'totalResult', format: 'N2' },
    { name: 'totalSlotResult', format: 'N2' },
    { name: 'totalLgResult', format: 'N2' },
    { name: 'avgDropCalc', format: 'N2' },
    { name: 'avgResultCalc', format: 'N2' },
  ],

  expandAll: true,
  showGrandTotals: true,
  showSubTotals: true,
})

// Kolon ekseni boş olduğunda Syncfusion başlığı "Total Sum of ..." üretiyor.
// headerCellInfo ile sadece tanımlı caption'ı (ör. "Total Drop") gösteriyoruz.
const gridSettings = ref({
  headerCellInfo: (args) => {
    const headerText = args?.node?.querySelector('.e-headertext')
    if (headerText && args?.cell?.column?.headerText) {
      headerText.innerText = args.cell.column.headerText
    }
  },
})


watch(
  () => inOutReportTable.value?.tableRows,
  (rows) => {
    if (rows && rows.length) {
      dataSourceSettings.value = {
        ...dataSourceSettings.value,
        dataSource: rows,
      }
      showPivot.value = true
    } else {
      showPivot.value = false
    }
  },
  { deep: true },
)
</script>

<style scoped></style>
