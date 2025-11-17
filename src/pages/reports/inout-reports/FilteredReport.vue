<template>
  <q-page class="q-pa-md">
    <SupaTable
      :columns="columns"
      :getDataFn="reportStore.getFilteredReport"
      :filterValues="filterValues"
      ref="inOutReportTable"
      tableName="filteredReportColumns"
      :filterParams="filterValues"
    >
      <template v-slot:headerFilterSlots>
        <div class="flex sm:flex-row flex-col justify-start gap-2 w-full sm:w-auto">
          <date-time-picker
            @selected-date="
              (val) => {
                filterValues = {
                  ...filterValues,
                  ...val,
                }
              }
            "
          />
          <q-btn
            type="button"
            :label="$t('filter')"
            icon="tune"
            color="grey-2"
            text-color="dark"
            size="13px"
            unelevated
            no-caps
            @click="inOutReportTable.fetchData()"
          />
        </div>
      </template>
      <template v-slot:bottomRow="props">
        <q-tr :props="props" class="bg-grey-1">
          <q-td
            v-for="(col, index) in [...props.cols.sort((a, b) => a.orderColumn - b.orderColumn)]"
            :key="index"
            :name="col.name"
            align="center"
            :class="{
              'bg-red-1':
                col.showTotal && props.rows.reduce((acc, item) => acc + item[col.field], 0) < 0,
              'bg-green-1':
                col.showTotal && props.rows.reduce((acc, item) => acc + item[col.field], 0) > 0,
            }"
          >
            <div class="text-subtitle2" v-if="col.showTotal">
              {{ col.format(props.rows.reduce((acc, item) => acc + item[col.field], 0)) }}
            </div>
            <div class="text-subtitle2" v-else>-</div>
          </q-td>
        </q-tr>
      </template>
    </SupaTable>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
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
</script>

<style scoped></style>
