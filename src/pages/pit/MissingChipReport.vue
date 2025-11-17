<template>
  <q-page class="q-pa-md">
    <SupaTable
      :columns="columns"
      :getDataFn="reportStore.getMissingChipReport"
      ref="missingChipReportTable"
      tableName="missingChipReportColumns"
      :filterParams="filterValues"
      :slotNames="['body-cell-chips', 'body-cell-actions']"
      dataKey="players"
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
            @click="missingChipReportTable.fetchData()"
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
const filterValues = ref({
  playerId: null,
  playerName: null,
})

const onSelectPlayer = (val) => {
  filterValues.value.playerId = val.id
  filterValues.value.playerName = val.value
}
const onClearPlayer = () => {
  filterValues.value.playerId = null
  filterValues.value.playerName = null
}
const missingChipReportTable = ref(null)

const columns = ref([
  {
    field: 'playerFullName',
    label: 'Player Name',
  },
  {
    field: 'playerId',
  },
  {
    field: 'cageInOut',
    fieldType: 'priceAbs',
    showTotal: true,
  },
  {
    field: 'floorInOut',
    fieldType: 'priceAbs',
    showTotal: true,
  },
  {
    field: 'diff',
    fieldType: 'priceAbs',
    showTotal: true,
  },
])
</script>

<style scoped></style>
