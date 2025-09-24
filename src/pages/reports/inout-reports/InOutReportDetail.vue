<template>
  <q-page class="q-pa-md">
    <SupaTable
      :columns="columns"
      :getDataFn="reportStore.getReportDetailInOut"
      :filterValues="filterValues"
      ref="inOutReportTable"
      tableName="inOutReportDetailColumns"
      :filterParams="filterValues"
      :slotNames="['body-cell-playerName']"
    >
      <template v-slot:headerFilterSlots>
        <div class="col-6 flex row justify-start">
          <div class="row full-width flex justify-start">
            <date-time-picker
              class="q-ml-sm"
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
              class="q-ml-sm"
              @click="inOutReportTable.fetchData()"
            />
          </div>
        </div>
      </template>
      <template v-slot:body-cell-playerName="{ props }">
        <q-td :props="props">
          <span
            v-player-detail="props.row.playerId"
            :label="props.row.playerName"
            class="onHoverPlayerName"
          >
            {{ props.row.playerName }}
          </span>
        </q-td>
      </template>
      <template v-slot:bottomRow="props">
        <q-tr :props="props">
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
    field: 'playerName',
    label: 'Player Name',
  },
  {
    field: 'creditIn',
    label: 'Cr In',
    fieldType: 'priceAbs',
    showTotal: true,
  },
  {
    field: 'creditOut',
    label: 'Cr Out',
    fieldType: 'priceAbs',
    showTotal: true,
  },
  {
    field: 'depositIn',
    label: 'Dep In',
    fieldType: 'priceAbs',
    showTotal: true,
  },
  {
    field: 'depositOut',
    label: 'Dep Out',
    fieldType: 'priceAbs',
    showTotal: true,
  },

  {
    field: 'creditCardIn',
    label: 'Cc In',
    fieldType: 'priceAbs',
    showTotal: true,
  },

  {
    field: 'creditCardOut',
    label: 'Cc Out',
    fieldType: 'priceAbs',
    showTotal: true,
  },

  {
    field: 'slotResult',
    label: 'Sl Result',
    fieldType: 'priceAbs',
    showTotal: true,
  },

  {
    field: 'complimentaryLiveGameIn',
    label: 'Cm Lg In',
    fieldType: 'priceAbs',
    showTotal: true,
  },

  {
    field: 'complimentaryLiveGameOut',
    label: 'Cm Lg Out',
    fieldType: 'priceAbs',
    showTotal: true,
  },

  {
    field: 'complimentarySlotIn',
    label: 'Cm Sl In',
    fieldType: 'priceAbs',
    showTotal: true,
  },
  {
    field: 'complimentarySlotOut',
    label: 'Cm Sl Out',
    fieldType: 'priceAbs',
    showTotal: true,
  },

  {
    field: 'lgCashDrop',
    label: 'Lg Cash D',
    fieldType: 'priceAbs',
    showTotal: true,
  },

  {
    field: 'lgChipDrop',
    label: 'Lg Chip D',
    fieldType: 'priceAbs',
    showTotal: true,
  },

  {
    field: 'lgTotalOut',
    label: 'Lg T Out',
    fieldType: 'priceAbs',
    showTotal: true,
  },

  {
    field: 'lgResult',
    label: 'Lg Result',
    fieldType: 'priceAbs',
    showTotal: true,
  },

  {
    field: 'cashIn',
    label: 'Cash In',
    fieldType: 'priceAbs',
    showTotal: true,
  },

  {
    field: 'cashOut',
    label: 'Cash Out',
    fieldType: 'priceAbs',
    showTotal: true,
  },
  {
    field: 'tableDrop',
    label: 'Table D',
    fieldType: 'priceAbs',
    showTotal: true,
  },
])
</script>

<style scoped></style>
