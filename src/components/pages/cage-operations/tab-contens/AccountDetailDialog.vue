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
        <q-space />
        <q-btn dense flat icon="minimize" v-close-popup>
          <q-tooltip class="bg-white text-primary">Minimize</q-tooltip>
        </q-btn>
        <q-btn dense flat icon="crop_square" @click="maximized = !maximized">
          <q-tooltip class="bg-white text-primary">Maximize</q-tooltip>
        </q-btn>
        <q-btn dense flat icon="close" v-close-popup data-cy="closeDialog">
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section class="q-pt-none q-mt-md">
        <SupaTable
          :columns="columns"
          :getDataFn="filterFn"
          :rowsPerPage="10"
          tableName="cashAccountDetailColumns"
          :filterParams="filterFields"
          ref="cashAccountDetailTable"
          :slotNames="['body-cell-detail']"
        >
          <template v-slot:headerFilterSlots="{ props }">
            <div class="col q-pl-sm q-mr-sm flex row justify-start">
              <date-time-picker
                class="q-ml-sm"
                @selected-date="(val) => (filterFields = { ...filterFields, ...val })"
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
                @click="props.reload"
                class="q-ml-sm"
              />
            </div>
          </template>
          <template v-slot:body-cell-detail="{ props }">
            <q-td :props="props">
              <q-btn
                dense
                flat
                icon="search"
                @click="props.row.detail"
                :disabled="accountType === 'cage' || props.row.detail === null"
              >
                <q-tooltip class="bg-white text-primary" v-if="props.row.detail">
                  <div class="">
                    <q-markup-table dense separator="cell" bordered class="q-pa-md">
                      <thead>
                        <tr>
                          <th class="text-left">ChipType</th>
                          <th class="text-right">Denom</th>

                          <th class="text-right">Quantity</th>
                          <th class="text-right">Value</th>
                          <th class="text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody v-if="props.row.detail">
                        <tr v-for="item in JSON.parse(props.row.detail)" :key="item.id">
                          <td class="text-left">{{ item.ChipType }}</td>
                          <td class="text-right">{{ item.ChipDenomName }}</td>

                          <td class="text-right">{{ item.Quantity }}</td>
                          <td class="text-right">{{ formatPrice(item.Value) }}</td>
                          <td class="text-right">{{ formatPrice(item.Value * item.Quantity) }}</td>
                        </tr>
                      </tbody>
                    </q-markup-table>
                  </div>
                </q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </SupaTable>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useDialogPluginComponent } from 'quasar'
import { formatPrice } from 'src/helpers/helpers'
const maximized = ref(false)

const props = defineProps({
  cashdeskAccountId: {
    type: Number,
    required: true,
  },
  filterFn: {
    type: Function,
    required: true,
  },
  accountType: {
    type: String,
    required: true,
  },
})
const filterFields = ref({
  CashdeskAccountId: props.cashdeskAccountId,
})
defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogHide } = useDialogPluginComponent()

const cashAccountDetailTable = ref(null)

const columns = ref([
  {
    field: 'id',
    label: 'ID',
  },
  {
    field: 'createdAt',
    fieldType: 'date',
  },
  {
    field: 'cashdeskAccountName',
    label: 'Cashdesk Account Name',
  },
  {
    field: 'playerName',
    label: 'Player Name',
  },
  /*   {
    field: 'currencyName',
    label: 'Currency',
  }, */
  {
    field: 'transactionCode',
    label: 'Transaction Code',
  },
  {
    field: 'cashdeskName',
    label: 'Cashdesk Name',
  },
  {
    field: 'transactionType',
    label: 'Transaction Type',
  },
  {
    field: 'amount',
    fieldType: 'price',
  },
  {
    field: 'note',
    label: 'Note',
  },

  {
    field: 'cashdeskTransactionType',
    label: 'Cashdesk Transaction Type',
  },
  {
    field: 'transType',
    label: 'Trans Type',
  },
  {
    field: 'detail',
    label: 'Detail',
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
</style>
