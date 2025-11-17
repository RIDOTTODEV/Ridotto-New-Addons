<template>
  <q-page class="q-pa-md">
    <SupaTable
      :columns="columns"
      :getDataFn="reportStore.getCallReport"
      :filterValues="filterValues"
      ref="callReportTable"
      tableName="callReportColumns"
      :filterParams="filterValues"
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
          <q-select
            outlined
            dense
            v-model="filterValues.completed"
            :options="selectOptions"
            :label="$t('completed')"
            class="super-small fixed-field-width"
            clearable
          />
          <q-select
            outlined
            dense
            v-model="filterValues.deleted"
            :options="selectOptions"
            :label="$t('deleted')"
            class="super-small fixed-field-width"
            clearable
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
            @click="callReportTable.fetchData()"
          />
        </div>
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
  completed: null,
  deleted: null,
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
const callReportTable = ref(null)
const selectOptions = ref([
  {
    label: 'Yes',
    value: true,
  },
  {
    label: 'No',
    value: false,
  },
])
const columns = ref([
  {
    field: 'playerId',
  },
  {
    field: 'playerFullName',
    label: 'Player Name',
  },
  {
    field: 'dueDate',
    fieldType: 'date',
  },
  {
    field: 'transfer',
    fieldType: 'boolean',
  },
  {
    field: 'notes',
  },
  {
    field: 'result',
  },
  {
    field: 'completed',
    fieldType: 'boolean',
  },
  {
    field: 'isDeleted',
    fieldType: 'boolean',
  },
  {
    field: 'createdAt',
    fieldType: 'date',
  },
  {
    field: 'createdByName',
  },
  {
    field: 'updatedAt',
    fieldType: 'date',
  },
  {
    field: 'updatedByName',
  },
])
</script>

<style scoped></style>
