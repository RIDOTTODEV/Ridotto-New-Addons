<template>
  <q-page class="q-pa-md">
    <SupaTable
      :columns="columns"
      :getDataFn="reportStore.getTableFloatsReport"
      :filterValues="filterValues"
      ref="inOutReportTable"
      tableName="inOutReportByTableColumns"
      :filterParams="filterValues"
      :slot-names="['body-cell-tableFloatDenoms']"
    >
      <template v-slot:headerFilterSlots>
        <div class="col-8 flex row justify-start">
          <div class="row full-width flex justify-start"></div>
        </div>
      </template>
      <template v-slot:body-cell-tableFloatDenoms="{ props }">
        <q-td key="tableFloatDenoms" :props="props" align="center" style="width: 70px !important">
          <div class="row flex justify-around">
            <div
              class="text-caption q-pr-sm"
              v-for="(denom, index) in props.row.tableFloatDenoms"
              :key="index"
            >
              {{ denom?.chipName + ' ' + denom?.chipDenomName + ' = ' + ' ' + denom?.quantity }}
            </div>
          </div>
        </q-td>
      </template>
    </SupaTable>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useReportStore } from 'src/stores/report-store'

const reportStore = useReportStore()

const filterValues = ref({})
const inOutReportTable = ref(null)

const columns = ref([
  {
    field: 'tableName',
    label: 'Table Name',
  },
  {
    field: 'currencyName',
    label: 'Currency Name',
  },
  {
    field: 'tableFloatDenoms',
    label: 'Table Float Denoms',
  },
  {
    field: 'total',
    label: 'Total',
    fieldType: 'price',
  },
])
</script>

<style scoped></style>
