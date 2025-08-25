<template>
  <q-page class="q-pa-md">
    <SupaTable
      :columns="columns"
      :getDataFn="reportStore.getFilteredReport"
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
    fieldType: 'price',
  },
  {
    field: 'totalResult',
    label: 'Total Result',
    fieldType: 'price',
  },
  {
    field: 'avgDrop',
    label: 'Avg Drop',
    fieldType: 'price',
  },
  {
    field: 'avgResult',
    label: 'Avg Result',
    fieldType: 'price',
  },
  {
    field: 'totalSlotResult',
    label: 'Total Slot Result',
    fieldType: 'price',
  },
  {
    field: 'totalLgResult',
    label: 'Total LG Result',
    fieldType: 'price',
  },
  {
    field: 'lgPlayDays',
    label: 'LG Play Days',
  },
  {
    field: 'slotPlayDays',
    label: 'Slot Play Days',
  },
])
</script>

<style scoped></style>
