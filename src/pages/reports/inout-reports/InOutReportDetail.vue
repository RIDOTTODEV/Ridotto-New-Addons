<template>
  <q-page class="q-pa-md">
    <SupaTable
      :columns="columns"
      :getDataFn="reportStore.getReportDetailInOut"
      :filterValues="filterValues"
      ref="inOutReportTable"
      tableName="inOutReportColumns"
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
    fieldType: 'price',
  },
  {
    field: 'creditOut',
    label: 'Cr Out',
    fieldType: 'price',
  },
  {
    field: 'depositIn',
    label: 'Dep In',
    fieldType: 'price',
  },
  {
    field: 'depositOut',
    label: 'Dep Out',
    fieldType: 'price',
  },

  {
    field: 'creditCardIn',
    label: 'Cc In',
    fieldType: 'price',
  },

  {
    field: 'creditCardOut',
    label: 'Cc Out',
    fieldType: 'price',
  },

  {
    field: 'slotResult',
    label: 'Sl Result',
    fieldType: 'price',
  },

  {
    field: 'complimentaryLiveGameIn',
    label: 'Cm Lg In',
    fieldType: 'price',
  },

  {
    field: 'complimentaryLiveGameOut',
    label: 'Cm Lg Out',
    fieldType: 'price',
  },

  {
    field: 'complimentarySlotIn',
    label: 'Cm Sl In',
    fieldType: 'price',
  },
  {
    field: 'complimentarySlotOut',
    label: 'Cm Sl Out',
    fieldType: 'price',
  },

  {
    field: 'lgCashDrop',
    label: 'Lg Cash D',
    fieldType: 'price',
  },

  {
    field: 'lgChipDrop',
    label: 'Lg Chip D',
    fieldType: 'price',
  },

  {
    field: 'lgTotalOut',
    label: 'Lg T Out',
    fieldType: 'price',
  },

  {
    field: 'lgResult',
    label: 'Lg Result',
    fieldType: 'price',
  },

  {
    field: 'cashIn',
    label: 'Cash In',
    fieldType: 'price',
  },

  {
    field: 'cashOut',
    label: 'Cash Out',
    fieldType: 'price',
  },
  {
    field: 'tableDrop',
    label: 'Table D',
    fieldType: 'price',
  },
])
</script>

<style scoped></style>
