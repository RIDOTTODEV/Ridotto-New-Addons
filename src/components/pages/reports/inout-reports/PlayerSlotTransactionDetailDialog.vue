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
        <div class="text-subtitle2">
          <span class="text-negative">{{ player?.playerName }}</span> -
          <span> {{ $t('transactions') }}</span>
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
          :getDataFn="playerStore.fetchPlayerSlotTransactionDetail"
          :rowsPerPage="10"
          tableName="playerSlotTransactionDetailTable"
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
                  :setDate="filterParams"
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
  player: {
    type: Object,
    required: true,
    default: () => {},
  },
  filterParams: {
    type: Object,
    required: true,
    default: () => {},
  },
})

defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogHide } = useDialogPluginComponent()

const refTable = ref(null)
const filterFormValues = ref({
  ...props.filterParams,
})
const playerStore = usePlayerStore()
const { dateTimeFilterValues } = storeToRefs(playerStore)

onMounted(() => {
  filterFormValues.value = {
    ...filterFormValues.value,
    ...dateTimeFilterValues.value,
  }
})

const columns = ref([
  {
    field: 'id',
    label: 'ID',
  },
  {
    field: 'createdAt',
    label: 'Created At',
    fieldType: 'date',
  },
  {
    field: 'createdByName',
    label: 'Created By',
  },

  {
    field: 'isDeleted',
    label: 'Deleted',
    fieldType: 'boolean',
  },
  {
    field: 'floorNo',
    label: 'Floor No',
  },
  {
    field: 'currencyName',
    label: 'Currency',
  },
  {
    field: 'amount',
    label: 'Amount',
    fieldType: 'priceAbs',
  },
  {
    field: 'transactionCode',
    label: 'Transaction Code',
  },
  {
    field: 'transactionType',
    label: 'Transaction Type',
  },
  {
    field: 'defaultCurrencyAmount',
    label: 'Default Currency Amount',
    fieldType: 'priceAbs',
  },

  {
    field: 'gamingDateId',
    label: 'Gaming Date',
  },
  {
    field: 'updatedByName',
    label: 'Updated By',
  },
  {
    field: 'updatedAt',
    label: 'Updated At',
    fieldType: 'date',
  },
  {
    field: 'deletedByName',
    label: 'Deleted By',
  },
  {
    field: 'deletedAt',
    label: 'Deleted At',
    fieldType: 'date',
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
