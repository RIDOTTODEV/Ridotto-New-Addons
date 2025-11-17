<template>
  <q-page class="q-pa-md">
    <SupaTable
      :columns="columns"
      :getDataFn="reportStore.getSlotInOutReport"
      :filterValues="filterValues"
      ref="slotInOutReportTable"
      tableName="slotInOutReportColumns"
      :filterParams="filterValues"
      dataKey="data"
    >
      <template v-slot:headerFilterSlots>
        <div class="flex sm:flex-row flex-col justify-start gap-2 w-full sm:w-auto">
          <SearchPlayerInput
            v-model="filterValues.playerId"
            :placeholder="$t('searchPlayer')"
            @onSelectPlayer="onSelectPlayer"
            :optionLabel="'value'"
            :displayedValue="filterValues.playerName"
            @onClear="onClearPlayer"
            class="fixed-field-width"
          />
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
            @click="slotInOutReportTable.fetchData()"
          />
        </div>
      </template>

      <template v-slot:bottomRow="props">
        <q-tr :props="props">
          <q-td
            v-for="(col, index) in [...props.cols.sort((a, b) => a.orderColumn - b.orderColumn)]"
            :key="index"
            :name="col.name"
            align="center"
            :class="{
              'bg-red-1': col.showTotal && slotInOutReportTable.response[col.totalField] < 0,
              'bg-green-1': col.showTotal && slotInOutReportTable.response[col.totalField] > 0,
            }"
          >
            <div class="text-subtitle2" v-if="col.showTotal">
              {{ col.format(slotInOutReportTable.response[col.totalField]) }}
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
const filterValues = ref({
  playerId: null,
  playerName: null,
})
const onSelectPlayer = (val) => {
  if (val) {
    filterValues.value.playerId = val.id
    filterValues.value.playerName = val.value
  } else {
    filterValues.value.playerId = null
    filterValues.value.playerName = null
  }
}
const onClearPlayer = () => {
  filterValues.value.playerId = null
  filterValues.value.playerName = null
}
const slotInOutReportTable = ref(null)

const columns = ref([
  {
    field: 'playerFullName',
    label: 'Player Name',
    classes: 'text-capitalize',
  },
  {
    field: 'playerCategory',
    label: 'Player Category',
    classes: 'text-capitalize',
  },
  {
    field: 'playerClass',
    label: 'Player Class',
    classes: 'text-capitalize',
  },
  {
    field: 'slotTurnover',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'totalSlotTurnover',
  },
  {
    field: 'slotResult',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'totalSlotResult',
  },
  {
    field: 'creditIn',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'totalCreditIn',
  },
  {
    field: 'creditOut',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'totalCreditOut',
  },
  {
    field: 'discIn',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'totalDiscIn',
  },
  {
    field: 'discOut',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'totalDiscOut',
  },
  {
    field: 'cageCashIn',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'totalCageCashIn',
  },
  {
    field: 'cageCashOut',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'totalCageCashOut',
  },
  {
    field: 'creditCardIn',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'totalCreditCardIn',
  },
  {
    field: 'creditCardOut',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'totalCreditCardOut',
  },
  {
    field: 'depositIn',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'totalDepositIn',
  },
  {
    field: 'depositOut',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'totalDepositOut',
  },
  {
    field: 'billAcceptorIn',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'totalBillAcceptorIn',
  },
])
</script>

<style scoped></style>
