<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
    :class="maximized ? '' : 'historyModal'"
    backdrop-filter="brightness(40%)"
  >
    <q-card class=" " :style="maximized ? '' : `height: ${$getWindowHeight}px!important;`">
      <q-bar>
        <div class="text-subtitle2" v-if="props.playerId">
          <span class="text-negative">{{ props.playerName }}</span> -
          <span> {{ $t('transactions') }}</span>
        </div>
        <div class="text-subtitle2" v-else>
          {{ $t('allPlayerTransactions') }}
        </div>
        <q-space />
        <q-btn dense flat icon="minimize" v-close-popup>
          <q-tooltip class="bg-white text-primary">Minimize</q-tooltip>
        </q-btn>
        <q-btn dense flat icon="crop_square" @click="maximized = !maximized">
          <q-tooltip class="bg-white text-primary">Maximize</q-tooltip>
        </q-btn>
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section class="q-pt-none q-mt-md">
        <SupaTable
          :columns="columns"
          :getDataFn="playerStore.fetchPlayerLgTableResult"
          :rowsPerPage="10"
          tableName="playerLgTableResultTable"
          ref="refTable"
          :filterParams="filterFormValues"
        >
          <template v-slot:headerFilterSlots>
            <div class="col-8 q-pl-sm q-mr-sm flex row justify-start">
              <div class="q-pa-xs flex items-end">
                <date-time-picker
                  @selected-date="
                    (val) =>
                      (filterFormValues = {
                        ...filterFormValues,
                        ...val,
                      })
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
                  v-if="refTable"
                  @click="refTable.fetchData()"
                  class="q-ml-sm"
                />
              </div>
            </div>
          </template>
        </SupaTable>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePlayerStore } from 'src/stores/player-store'
import { useDialogPluginComponent } from 'quasar'

const maximized = ref(false)

const props = defineProps({
  playerId: {
    type: Number,
    required: false,
    default: () => null,
  },
  playerName: {
    type: String,
    required: false,
    default: () => null,
  },
})

defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogHide } = useDialogPluginComponent()

const refTable = ref(null)
const filterFormValues = ref({
  playerId: props.playerId,
})
const playerStore = usePlayerStore()
const { dateTimeFilterValues } = storeToRefs(playerStore)

onMounted(() => {
  filterFormValues.value = {
    ...filterFormValues.value,
    ...dateTimeFilterValues.value,
  }
})
/* {
    "playerId": 0,
    "gamingDateId": 0,
    "cashDrop": 0,
    "plaqueDrop": 0,
    "totalDrop": 0,
    "totalOut": 0,
    "buyedChips": 0,
    "chipsInPocket": 0,
    "chipsInPocketDetails": [
      {
        "chipCurrency": "string",
        "chipDenomId": 0,
        "chipDenomName": "string",
        "chipType": "Chip",
        "quantity": 0,
        "chipDenom": 0
      }
    ],
    "usedChips": 0,
    "result": 0,
    "playTime": 0,
    "marker": 0
  } */
const columns = ref([
  {
    field: 'playerFullName',
    label: 'Player',
  },
  {
    field: 'cashDrop',
    label: 'Cash Drop',
    fieldType: 'priceAbs',
  },
  {
    field: 'plaqueDrop',
    label: 'Plaque Drop',
    fieldType: 'priceAbs',
  },

  {
    field: 'totalDrop',
    label: 'Total Drop',
    fieldType: 'priceAbs',
  },

  {
    field: 'totalOut',
    label: 'Total Out',
    fieldType: 'priceAbs',
  },

  {
    field: 'buyedChips',
    label: 'Buyed Chips',
    fieldType: 'priceAbs',
  },

  {
    field: 'chipsInPocket',
    label: 'Chips In Pocket',
    fieldType: 'priceAbs',
  },

  {
    field: 'chipsInPocketDetails',
    label: 'Chips In Pocket Details',
  },

  {
    field: 'usedChips',
    label: 'Used Chips',
    fieldType: 'priceAbs',
  },

  {
    field: 'result',
    label: 'Result',
    fieldType: 'priceAbs',
  },

  {
    field: 'playTime',
    label: 'Play Time',
    fieldType: 'priceAbs',
  },

  {
    field: 'marker',
    label: 'Marker',
    fieldType: 'priceAbs',
  },
])
</script>

<style lang="scss">
.historyModal .q-dialog__inner {
  align-content: end;
}

.sprintButton {
  width: 150px;
  float: right;
  height: 6px;
  top: 0px !important;
  position: absolute;
}
.cursor-grab {
  cursor: -webkit-grab;
  cursor: grab;
}
.text-underline {
  text-decoration: underline;
  font-size: 12px;
  font-weight: 600;
}
</style>
