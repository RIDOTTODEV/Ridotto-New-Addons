<template>
  <q-page class="q-pa-md">
    <SupaTable
      :columns="columns"
      :getDataFn="reportStore.getBlackListReport"
      :filterValues="filterValues"
      ref="blackListReportTable"
      tableName="blackListReportColumns"
      :filterParams="filterValues"
      :slotNames="['body-cell-playerFullName']"
    >
      <template v-slot:headerFilterSlots>
        <div class="col-6 flex row justify-start">
          <div class="row full-width flex justify-start">
            <SearchPlayerInput
              v-model="filterValues.playerId"
              :placeholder="$t('searchPlayer')"
              @onSelectPlayer="onSelectPlayer"
              :optionLabel="'value'"
              :displayedValue="filterValues.playerName"
              @onClear="onClearPlayer"
            />
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
              @click="blackListReportTable.fetchData()"
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
const blackListReportTable = ref(null)

const columns = ref([
  {
    field: 'fullName',
    label: 'Player Name',
  },
  {
    field: 'requestBy',
  },
  {
    field: 'reason',
  },
  {
    field: 'isActive',
    fieldType: 'boolean',
  },
  {
    field: 'createdAt',
    fieldType: 'date',
  },
  {
    field: 'createdByName',
  },
])
</script>

<style scoped></style>
