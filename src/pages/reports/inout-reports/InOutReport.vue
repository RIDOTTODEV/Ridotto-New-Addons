<template>
  <q-page class="q-pa-md">
    <SupaTable
      :columns="columns"
      :getDataFn="reportStore.getInOutReportNew"
      :filterValues="filterValues"
      ref="inOutReportTable"
      tableName="inOutReportColumns"
      :filterParams="filterValues"
      :slotNames="[
        'body-cell-playerName',
        'body-cell-creditIn',
        'body-cell-creditOut',
        'body-cell-discountIn',
        'body-cell-discountOut',
        'body-cell-compIn',
        'body-cell-compOut',
        'body-cell-cashIn',
        'body-cell-cashOut',
        'body-cell-slotIn',
        'body-cell-slotOut',
        'body-cell-creditCardIn',
        'body-cell-creditCardOut',
        'body-cell-depositIn',
        'body-cell-depositOut',
      ]"
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
      <template v-slot:body-cell-creditIn="{ props }">
        <q-td :props="props" @click="onClickCell(props, 'Credit', 'Deposit')">
          {{ formatPrice(props.row.creditIn) }}
        </q-td>
      </template>
      <template v-slot:body-cell-creditOut="{ props }">
        <q-td :props="props" @click="onClickCell(props, 'Credit', 'Withdrawal')">
          {{ formatPrice(props.row.creditOut) }}
        </q-td>
      </template>
      <template v-slot:body-cell-discountIn="{ props }">
        <q-td :props="props" @click="onClickCell(props, 'Discount', 'Deposit')">
          {{ formatPrice(props.row.discountIn) }}
        </q-td>
      </template>
      <template v-slot:body-cell-discountOut="{ props }">
        <q-td :props="props" @click="onClickCell(props, 'Discount', 'Withdrawal')">
          {{ formatPrice(props.row.discountOut) }}
        </q-td>
      </template>
      <template v-slot:body-cell-compIn="{ props }">
        <q-td :props="props" @click="onClickCell(props, 'Comp', 'Deposit')">
          {{ formatPrice(props.row.compIn) }}
        </q-td>
      </template>
      <template v-slot:body-cell-compOut="{ props }">
        <q-td :props="props" @click="onClickCell(props, 'Comp', 'Withdrawal')">
          {{ formatPrice(props.row.compOut) }}
        </q-td>
      </template>
      <template v-slot:body-cell-cashIn="{ props }">
        <q-td :props="props" @click="onClickCell(props, 'Cash', 'Deposit')">
          {{ formatPrice(props.row.cashIn) }}
        </q-td>
      </template>
      <template v-slot:body-cell-cashOut="{ props }">
        <q-td :props="props" @click="onClickCell(props, 'Cash', 'Withdrawal')">
          {{ formatPrice(props.row.cashOut) }}
        </q-td>
      </template>
      <template v-slot:body-cell-slotIn="{ props }">
        <q-td :props="props" @click="onClickCell(props, 'Slot', 'Deposit')">
          {{ formatPrice(props.row.slotIn) }}
        </q-td>
      </template>
      <template v-slot:body-cell-slotOut="{ props }">
        <q-td :props="props" @click="onClickCell(props, 'Slot', 'Withdrawal')">
          {{ formatPrice(props.row.slotOut) }}
        </q-td>
      </template>
      <template v-slot:body-cell-creditCardIn="{ props }">
        <q-td :props="props" @click="onClickCell(props, 'CreditCard', 'Deposit')">
          {{ formatPrice(props.row.creditCardIn) }}
        </q-td>
      </template>
      <template v-slot:body-cell-creditCardOut="{ props }">
        <q-td :props="props" @click="onClickCell(props, 'CreditCard', 'Withdrawal')">
          {{ formatPrice(props.row.creditCardOut) }}
        </q-td>
      </template>
      <template v-slot:body-cell-depositIn="{ props }">
        <q-td :props="props" @click="onClickCell(props, 'Deposit', 'Deposit')">
          {{ formatPrice(props.row.depositIn) }}
        </q-td>
      </template>
      <template v-slot:body-cell-depositOut="{ props }">
        <q-td :props="props" @click="onClickCell(props, 'Deposit', 'Withdrawal')">
          {{ formatPrice(props.row.depositOut) }}
        </q-td>
      </template>
    </SupaTable>

    <q-card flat class="q-mt-md bg-transparent" v-if="cellData.length > 0">
      <q-card-section class="row q-pa-none">
        <div class="col-10">
          <fieldset style="border: 1px solid rgb(166 166 166) !important; padding: 10px !important">
            <legend>
              {{ getCellDataFilterFields.playerName }} - {{ cellData.length }} Transactions
            </legend>
            <q-markup-table dense separator="cell" square>
              <thead>
                <tr>
                  <th class="text-center bg-blue-grey-1">Transaction Type</th>
                  <th class="text-center bg-blue-grey-1">Trans Type</th>
                  <th class="text-center bg-blue-grey-1">Bill Type</th>
                  <th class="text-center bg-blue-grey-1">Game Type</th>
                  <th class="text-center bg-blue-grey-1">Amount</th>
                  <th class="text-center bg-blue-grey-1">Note</th>
                  <th class="text-center bg-blue-grey-1">Created At</th>
                  <th class="text-center bg-blue-grey-1">Created By</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in cellData" :key="item.id">
                  <td class="text-center bg-orange-1">{{ item.transactionType }}</td>
                  <td class="text-center bg-orange-1">{{ item.transType }}</td>
                  <td class="text-center bg-orange-1">{{ item.playerTransactionBillType }}</td>
                  <td class="text-center bg-orange-1">{{ item.playerTransactionGameType }}</td>
                  <td class="text-center bg-orange-1">
                    {{ formatPrice(item.amount) }}
                    <span class="text-bold">{{ item.currencyName }}</span>
                  </td>
                  <td class="text-center bg-orange-1">{{ item.note }}</td>
                  <td class="text-center bg-orange-1">
                    <span v-if="item.createdAt">{{
                      date.formatDate(item.createdAt, 'DD.MM.YYYY HH:mm')
                    }}</span>
                    <span v-else>-</span>
                  </td>
                  <td class="text-center bg-orange-1">{{ item.createdByName }}</td>
                </tr>
              </tbody>
            </q-markup-table>
          </fieldset>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { formatPrice } from 'src/helpers/helpers'
import { useReportStore } from 'src/stores/report-store'
import { date } from 'quasar'
const reportStore = useReportStore()
const filterValues = ref(null)
const inOutReportTable = ref(null)

const columns = ref([
  {
    field: 'id',
    label: 'Id',
    required: true,
  },
  {
    field: 'playerName',
    label: 'Player Name',
  },
  {
    field: 'slotResult',
    label: 'Slot Result',
    fieldType: 'price',
  },
  {
    field: 'lgDrop',
    label: 'LG Drop',
    fieldType: 'price',
  },
  {
    field: 'lgResult',
    label: 'LG Result',
    fieldType: 'price',
  },
  {
    field: 'creditIn',
    label: 'Credit In',
    fieldType: 'price',
  },
  {
    field: 'creditOut',
    label: 'Credit Out',
    fieldType: 'price',
  },
  {
    field: 'discountIn',
    label: 'Discount In',
    fieldType: 'price',
  },
  {
    field: 'discountOut',
    label: 'Discount Out',
    fieldType: 'price',
  },
  {
    field: 'compIn',
    label: 'Comp In',
    fieldType: 'price',
  },
  {
    field: 'compOut',
    label: 'Comp Out',
    fieldType: 'price',
  },
  {
    field: 'tableCashDrop',
    label: 'Table Cash Drop',
    fieldType: 'price',
  },
  {
    field: 'cashIn',
    label: 'Cash In',
    fieldType: 'price',
  },
  {
    field: 'cashOut',
    label: 'Cash Out',
    fieldType: 'price',
  },
  {
    field: 'slotIn',
    label: 'Slot In',
    fieldType: 'price',
  },
  {
    field: 'slotOut',
    label: 'Slot Out',
    fieldType: 'price',
  },
  {
    field: 'slotPlayTime',
    label: 'Slot Play Time',
  },
  {
    field: 'lgPlayTime',
    label: 'LG Play Time',
  },
  {
    field: 'missingChipTotal',
    label: 'Missing Chip Total',
    fieldType: 'price',
  },
  {
    field: 'missingPlaqueTotal',
    label: 'Missing Plaque Total',
    fieldType: 'price',
  },
  {
    field: 'activeDeposit',
    label: 'Active Deposit',
    fieldType: 'price',
  },
  {
    field: 'slotTurnover',
    label: 'Slot Turnover',
    fieldType: 'price',
  },
  {
    field: 'lgCashout',
    label: 'LG Cashout',
    fieldType: 'price',
  },
  {
    field: 'creditCardIn',
    label: 'Credit Card In',
    fieldType: 'price',
  },
  {
    field: 'creditCardOut',
    label: 'Credit Card Out',
    fieldType: 'price',
  },
  {
    field: 'marker',
    label: 'Marker',
    fieldType: 'price',
  },
  {
    field: 'depositIn',
    label: 'Deposit In',
    fieldType: 'price',
  },
  {
    field: 'depositOut',
    label: 'Deposit Out',
    fieldType: 'price',
  },
])

const cellDataLoading = ref(false)
const cellData = ref([])

const getCellDataFilterFields = ref({
  playerId: null,
  TransType: null,
  TransactionType: null,
  playerName: null,
})

const getCellData = async () => {
  cellDataLoading.value = true
  cellData.value = await reportStore.getPlayerTransactions({
    ...getCellDataFilterFields.value,
    ...filterValues.value,
  })
  cellDataLoading.value = false
}

const onClickCell = async (props, transType, transactionType) => {
  getCellDataFilterFields.value.playerId = props.row.playerId
  getCellDataFilterFields.value.TransType = transType
  getCellDataFilterFields.value.TransactionType = transactionType
  getCellDataFilterFields.value.playerName = props.row.playerName
  await getCellData()
}
</script>

<style scoped></style>
