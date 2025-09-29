<template>
  <q-page class="q-pa-md">
    <q-card class="bg-transparent" flat square>
      <q-card-section class="q-pa-none flex justify-end q-mb-sm">
        <q-btn
          :label="$t('create')"
          class="q-mr-sm"
          color="blue-grey-8"
          text-color="white"
          unelevated
          no-caps
          @click="createNewTransaction = true"
        />
      </q-card-section>
    </q-card>
    <SupaTable
      :columns="columns"
      :getDataFn="slotStore.fetchPlayersInOut"
      ref="playersInOutTable"
      tableName="playersInOutColumns"
      :filterParams="filterValues"
      :slotNames="['body-cell-actions']"
      dataKey="data"
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
              @click="inOutReportTable.fetchData()"
            />
          </div>
        </div>
      </template>

      <template v-slot:body-cell-actions="{ props }">
        <q-td :props="props">
          <q-btn
            size="13px"
            color="grey-2"
            text-color="dark"
            unelevated
            dense
            @click="
              () => {
                showDailyReportDetail(props.row)
              }
            "
            icon="search"
          />
        </q-td>
      </template>
    </SupaTable>

    <q-dialog
      v-model="createNewTransaction"
      transition-show="slide-up"
      transition-hide="slide-down"
      backdrop-filter="brightness(40%)"
    >
      <q-card class="" style="min-width: 700px">
        <q-bar>
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

        <q-card-section> </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useSlotStore } from 'src/stores/slot-store'
const slotStore = useSlotStore()
const filterValues = ref({
  PlayerId: null,
  PlayerName: null,
})
const onSelectPlayer = (val) => {
  filterValues.value.PlayerId = val.id
  filterValues.value.PlayerName = val.value
}
const onClearPlayer = () => {
  filterValues.value.PlayerId = null
  filterValues.value.PlayerName = null
}
const playersInOutTable = ref(null)

const columns = ref([
  {
    field: 'createdAt',
    label: 'Created At',
    fieldType: 'date',
  },
  {
    field: 'playerId',
    label: 'Player Id',
  },
  {
    field: 'playerName',
    label: 'Player Name',
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
    field: 'convertedAmount',
    label: 'Converted Amount',
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
    field: 'isDeleted',
    label: 'Deleted',
    fieldType: 'boolean',
  },
  {
    field: 'createdByName',
    label: 'Created By',
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
    field: 'actions',
  },
])

const createNewTransaction = ref(false)

const formValues = ref({
  playerId: null,
  /*  playerFullName: null, */
  floorNo: null,
  currencyId: null,
  amount: null,
  transactionCode: 'BillAcceptor',
  transactionType: 'Deposit',
})

const transactionCodes = ref([
  {
    value: 'BillAcceptor',
    label: 'Bill Acceptor',
  },
  {
    value: 'Slip',
    label: 'Slip',
  },
])
const transactionTypes = ref([
  {
    value: 'Deposit',
    label: 'Deposit',
  },
  {
    value: 'Withdrawal',
    label: 'Withdrawal',
  },
])
</script>

<style scoped></style>
