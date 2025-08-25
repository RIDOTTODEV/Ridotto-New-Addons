<template>
  <q-page class="q-pa-md">
    <SupaTable
      :columns="columns"
      :getDataFn="getCigaretteReport"
      :filterValues="filterValues"
      ref="cigaretteReportTable"
      tableName="cigaretteReportColumns"
      :filterParams="filterValues"
      :slotNames="['body-cell-playerFullName']"
    >
      <template v-slot:headerFilterSlots>
        <div class="col-8 flex row justify-start">
          <div class="row full-width flex justify-start">
            <SearchPlayerInput
              v-model="filterValues.playerId"
              :placeholder="$t('searchPlayer')"
              @onSelectPlayer="onSelectPlayer"
              :optionLabel="'value'"
              :displayedValue="filterValues.playerName"
              @onClear="onClearPlayer"
            />
            <q-input
              v-model="filterValues.CreatedByName"
              :placeholder="$t('createdByName')"
              outlined
              dense
              clearable
              class="q-ml-sm super-small"
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
              @click="cigaretteReportTable.fetchData()"
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
import { posApi } from 'src/boot/axios'

const filterValues = ref({
  playerId: null,
  OrderTagId: '1',
  CreatedByName: null,
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
const cigaretteReportTable = ref(null)

const columns = ref([
  {
    field: 'createdAt',
    fieldType: 'date',
  },
  {
    field: 'playerId',
  },
  {
    field: 'playerName',
    label: 'Player Name',
  },
  {
    field: 'quantity',
  },
  {
    field: 'createdBy',
  },
])
const getCigaretteReport = async () => {
  const { data } = await posApi.get('/api/Report/GetCigaretteOrders', {
    params: filterValues.value,
  })
  return data
}
</script>

<style scoped></style>
