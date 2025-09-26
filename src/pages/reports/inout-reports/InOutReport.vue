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
        'body-cell-id',
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
      :frozenColumns="['id']"
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

      <template v-slot:body-cell-id="{ props }">
        <q-td :props="props" auto-width class="frozen-column">
          <div class="flex justify-center no-wrap content-center items-center">
            <span class="text-capitalize">{{ props.row.id }}</span>
            <q-icon
              name="chevron_right"
              size="17px"
              @mouseover="
                () => {
                  // before close other all menu
                  Object.values($refs).forEach((menu) => {
                    if (menu && menu.hide) {
                      menu.hide()
                    }
                  })
                  // show current menu
                  $refs['playerNameMenu' + props.row.id].show()
                }
              "
            >
              <q-menu
                anchor="top right"
                self="top left"
                :ref="'playerNameMenu' + props.row.id"
                @mouseleave="$refs['playerNameMenu' + props.row.id].hide()"
              >
                <q-card square>
                  <q-card-section class="q-pa-xs" style="min-height: 200px">
                    <q-list dense>
                      <q-item
                        clickable
                        dense
                        @click="onClickTransactions(props, false)"
                        class="menu-item"
                      >
                        <q-item-section>
                          <div class="flex row justify-start items-center content-center">
                            <q-icon name="o_person" size="20px" class="q-mr-sm" color="green-8" />
                            <span class="text-capitalize">{{ $t('playerTransactions') }}</span>
                          </div>
                        </q-item-section>
                      </q-item>
                      <q-item
                        clickable
                        dense
                        @click="onClickLgTableResult(props)"
                        class="menu-item"
                      >
                        <q-item-section>
                          <div class="flex row justify-start items-center content-center">
                            <q-icon name="bar_chart" size="20px" class="q-mr-sm" color="green-8" />
                            <span class="text-capitalize">{{ $t('playerLgTableResult') }}</span>
                          </div>
                        </q-item-section>
                      </q-item>
                      <q-item
                        clickable
                        dense
                        @click="onClickTransactions(props, true)"
                        class="menu-item"
                      >
                        <q-item-section>
                          <div class="flex row justify-start items-center content-center">
                            <q-icon name="functions" size="20px" class="q-mr-sm" color="primary" />
                            <span class="text-capitalize">{{ $t('allTransactions') }}</span>
                          </div>
                        </q-item-section>
                      </q-item>
                      <q-item clickable dense @click="onClickCell(props, 'Credit', 'Deposit')">
                        <q-item-section>
                          <span class="text-capitalize">{{ $t('Credit In') }}</span>
                        </q-item-section>
                      </q-item>
                      <q-item clickable dense @click="onClickCell(props, 'Credit', 'Withdrawal')">
                        <q-item-section>
                          <span class="text-capitalize">{{ $t('Credit Out') }}</span>
                        </q-item-section>
                      </q-item>
                      <q-item clickable dense @click="onClickCell(props, 'Deposit', 'Deposit')">
                        <q-item-section>
                          <span class="text-capitalize">{{ $t('Deposit In') }}</span>
                        </q-item-section>
                      </q-item>
                      <q-item clickable dense @click="onClickCell(props, 'Deposit', 'Withdrawal')">
                        <q-item-section>
                          <span class="text-capitalize">{{ $t('Deposit Out') }}</span>
                        </q-item-section>
                      </q-item>
                      <q-item clickable dense @click="onClickCell(props, 'Discount', 'Deposit')">
                        <q-item-section>
                          <span class="text-capitalize">{{ $t('Discount In') }}</span>
                        </q-item-section>
                      </q-item>
                      <q-item clickable dense @click="onClickCell(props, 'Discount', 'Withdrawal')">
                        <q-item-section>
                          <span class="text-capitalize">{{ $t('Discount Out') }}</span>
                        </q-item-section>
                      </q-item>
                      <q-item clickable dense @click="onClickCell(props, 'Comp', 'Deposit')">
                        <q-item-section>
                          <span class="text-capitalize">{{ $t('Comp In') }}</span>
                        </q-item-section>
                      </q-item>
                      <q-item clickable dense @click="onClickCell(props, 'Comp', 'Withdrawal')">
                        <q-item-section>
                          <span class="text-capitalize">{{ $t('Comp Out') }}</span>
                        </q-item-section>
                      </q-item>
                      <q-item clickable dense @click="onClickCell(props, 'Cash', 'Deposit')">
                        <q-item-section>
                          <span class="text-capitalize">{{ $t('Cash In') }}</span>
                        </q-item-section>
                      </q-item>
                      <q-item clickable dense @click="onClickCell(props, 'Cash', 'Withdrawal')">
                        <q-item-section>
                          <span class="text-capitalize">{{ $t('Cash Out') }}</span>
                        </q-item-section>
                      </q-item>
                      <q-item clickable dense @click="onClickCell(props, 'Slot', 'Deposit')">
                        <q-item-section>
                          <span class="text-capitalize">{{ $t('Slot In') }}</span>
                        </q-item-section>
                      </q-item>
                      <q-item clickable dense @click="onClickCell(props, 'Slot', 'Withdrawal')">
                        <q-item-section>
                          <span class="text-capitalize">{{ $t('Slot Out') }}</span>
                        </q-item-section>
                      </q-item>
                      <q-item clickable dense @click="onClickCell(props, 'CreditCard', 'Deposit')">
                        <q-item-section>
                          <span class="text-capitalize">{{ $t('Credit Card In') }}</span>
                        </q-item-section>
                      </q-item>
                      <q-item
                        clickable
                        dense
                        @click="onClickCell(props, 'CreditCard', 'Withdrawal')"
                      >
                        <q-item-section>
                          <span class="text-capitalize">{{ $t('Credit Card Out') }}</span>
                        </q-item-section>
                      </q-item>
                      <q-item clickable dense @click="onClickCell(props, 'Deposit', 'Deposit')">
                        <q-item-section>
                          <span class="text-capitalize">{{ $t('Deposit In') }}</span>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card-section>
                </q-card>
              </q-menu>
            </q-icon>
          </div>
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
      <template v-slot:bottomRow="props">
        <q-tr :props="props" class="bg-grey-1">
          <q-td
            v-for="(col, index) in [...props.cols.sort((a, b) => a.orderColumn - b.orderColumn)]"
            :key="index"
            :name="col.name"
            align="center"
            :class="{
              'bg-red-1': col.showTotal && inOutReportTable?.response[col.totalField] < 0,
              'bg-green-1': col.showTotal && inOutReportTable?.response[col.totalField] > 0,
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
import { ref, defineAsyncComponent } from 'vue'
import { formatPrice } from 'src/helpers/helpers'
import { useReportStore } from 'src/stores/report-store'
import { date, useQuasar } from 'quasar'
const $q = useQuasar()
const reportStore = useReportStore()
const filterValues = ref(null)
const inOutReportTable = ref(null)

const columns = ref([
  {
    field: 'id',
    label: 'Id',
    required: true,
    classes: 'bg-grey-2',
  },
  {
    field: 'playerName',
    label: 'Player Name',
    classes: 'text-capitalize',
  },
  {
    field: 'slotResult',
    label: 'Slot Result',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'totalSlotResult',
  },
  {
    field: 'lgDrop',
    label: 'LG Drop',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'totalLgDrop',
  },
  {
    field: 'lgResult',
    label: 'LG Result',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'totalLgResult',
  },
  {
    field: 'creditIn',
    label: 'Credit In',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'totalCreditIn',
    classes: 'linked-text',
  },
  {
    field: 'creditOut',
    label: 'Credit Out',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'totalCreditOut',
    classes: 'linked-text',
  },
  {
    field: 'discountIn',
    label: 'Discount In',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'totalDiscountIn',
    classes: 'linked-text',
  },
  {
    field: 'discountOut',
    label: 'Discount Out',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'totalDiscountOut',
    classes: 'linked-text',
  },
  {
    field: 'compIn',
    label: 'Comp In',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'totalCompIn',
    classes: 'linked-text',
  },
  {
    field: 'compOut',
    label: 'Comp Out',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'totalCompOut',
    classes: 'linked-text',
  },
  {
    field: 'tableCashDrop',
    label: 'Table Cash Drop',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'totalTableCashDrop',
  },
  {
    field: 'cashIn',
    label: 'Cash In',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'totalCashIn',
    classes: 'linked-text',
  },
  {
    field: 'cashOut',
    label: 'Cash Out',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'totalCashOut',
    classes: 'linked-text',
  },
  {
    field: 'realCashIn',
    label: 'R.Cash In',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'totalRealCashIn',
    classes: 'linked-text',
  },
  {
    field: 'realCashOut',
    label: 'R.Cash Out',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'totalRealCashOut',
    classes: 'linked-text',
  },
  {
    field: 'slotIn',
    label: 'Slot In',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'totalSlotIn',
    classes: 'linked-text',
  },
  {
    field: 'slotOut',
    label: 'Slot Out',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'totalSlotOut',
    classes: 'linked-text',
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
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'totalMissingChipTotal',
  },
  {
    field: 'missingPlaqueTotal',
    label: 'Missing Plaque Total',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'totalMissingPlaqueTotal',
  },
  {
    field: 'activeDeposit',
    label: 'Active Deposit',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'totalActiveDeposit',
  },
  {
    field: 'slotTurnover',
    label: 'Slot Turnover',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'totalSlotTurnover',
  },
  {
    field: 'lgCashout',
    label: 'LG Cashout',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'totalLgCashout',
  },
  {
    field: 'creditCardIn',
    label: 'Credit Card In',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'totalCreditCardIn',
    classes: 'linked-text',
  },
  {
    field: 'creditCardOut',
    label: 'Credit Card Out',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'totalCreditCardOut',
    classes: 'linked-text',
  },
  {
    field: 'marker',
    label: 'Marker',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'totalMarker',
  },
  {
    field: 'depositIn',
    label: 'Deposit In',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'totalDepositIn',
    classes: 'linked-text',
  },
  {
    field: 'depositOut',
    label: 'Deposit Out',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'totalDepositOut',
    classes: 'linked-text',
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

const onClickTransactions = async (props, allTransactions = null) => {
  $q.dialog({
    component: defineAsyncComponent(
      () => import('src/components/pages/reports/inout-reports/InOutTransactionsDialog.vue'),
    ),
    componentProps: {
      playerId: allTransactions ? null : props.row.playerId,
      playerName: allTransactions ? null : props.row.playerName,
    },
  })
}

const onClickLgTableResult = async (props) => {
  $q.dialog({
    component: defineAsyncComponent(
      () => import('src/components/pages/reports/inout-reports/PlayerLgTableResultDialog.vue'),
    ),
    componentProps: {
      playerId: props.row.playerId,
      playerName: props.row.playerName,
    },
  })
}
</script>

<style scoped>
.menu-item {
  padding: 0 3px 0 5px !important;
}
</style>
