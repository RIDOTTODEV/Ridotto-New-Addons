<template>
  <q-page class="q-pa-md">
    <SupaTable
      :columns="columns"
      :getDataFn="reportStore.getPlayerInfoAuditLogs"
      :filterValues="filterValues"
      ref="correctionInfosReportTable"
      tableName="correctionInfosReportColumns"
      :filterParams="filterValues"
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
              @click="correctionInfosReportTable.fetchData()"
            />
          </div>
        </div>
      </template>
      <template v-slot:body-cell-playerFullName="{ props }">
        <q-td :props="props">
          <span
            v-player-detail="props.row.playerId"
            :label="props.row.playerFullName"
            class="onHoverPlayerName"
          >
            {{ props.row.playerFullName }}
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
const filterValues = ref({})

const correctionInfosReportTable = ref(null)

const columns = ref([
  {
    field: 'changedAt',
    fieldType: 'date',
  },
  {
    field: 'changedByName',
  },
  {
    field: 'hostName',
  },
  {
    field: 'ipAddress',
  },
  {
    field: 'playerId',
  },
  {
    field: 'playerFullName',
  },
  {
    field: 'fieldName',
  },
  {
    field: 'oldValue',
  },
  {
    field: 'newValue',
  },
])
</script>

<style scoped></style>
