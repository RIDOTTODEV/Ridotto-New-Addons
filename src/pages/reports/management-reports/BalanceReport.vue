<script setup>
import { onMounted, ref } from 'vue'
import { date } from 'quasar'
import { useReportStore } from 'src/stores/report-store'
import { useCashdeskStore } from 'src/stores/cashdesk-store'
import { useAuthStore } from 'src/stores/auth-store'
import { useCurrencyStore } from 'src/stores/currency-store'
import { storeToRefs } from 'pinia'

const dateFilterValue = ref(null)
const formValues = ref({
  cashdeskId: null,
  date: new Date(),
})
const reportStore = useReportStore()
const {
  balanceReport,
  getOpeningTotal,
  getClosingTotal,
  getReceiptPaidTotal,
  getActuallyTotal,
  getDiffTotal,
  getSlipTotal,
  getDailyRateTotal,
} = storeToRefs(reportStore)
const authStore = useAuthStore()
const { getDefaultCurrencyName, getDefaultCurrencyId } = storeToRefs(authStore)
const cashdeskStore = useCashdeskStore()
const { cashdesks } = storeToRefs(cashdeskStore)

const currencyStore = useCurrencyStore()

import { priceAbsFormatted } from 'src/helpers/helpers'
import { i18n } from 'src/boot/i18n'

const onSubmitFilter = async () => {
  await reportStore.getBalanceReport({
    ...formValues.value,
    ...dateFilterValue.value,
    date: date.formatDate(formValues.value.date, 'YYYY-MM-DD') + 'T00:00:00.000Z',
  })
}

const transactionLogsTableColumn = ref([
  {
    name: 'creationTime',
    label: i18n.global.t('createdAt'),
    align: 'center',
    field: 'creationTime',
    sortable: false,
    visible: true,
    format: (val) => date.formatDate(val, 'DD.MM.YYYY HH:mm:ss'),
  },
  {
    name: 'cashdeskName',
    label: i18n.global.t('cashDeskName'),
    align: 'center',
    field: 'cashdeskName',
    sortable: false,
    visible: true,
  },
  {
    name: 'transactionCodeName',
    label: i18n.global.t('transactionCodeName'),
    align: 'center',
    field: 'transactionCodeName',
    sortable: false,
    visible: true,
  },
  /*
  {
    name: 'amount',
    label: i18n.global.t('amount'),
    align: 'left',
    field: 'amount',
    sortable: false,
    visible: true,
    format: (val) => priceAbsFormatted(val),
  },
  */
  {
    name: 'received',
    label: i18n.global.t('received'),
    align: 'center',
    field: 'received',
    sortable: false,
    visible: true,
    format: (val) => priceAbsFormatted(val),
  },
  {
    name: 'paid',
    label: i18n.global.t('paid'),
    align: 'center',
    field: 'paid',
    sortable: false,
    visible: true,
    format: (val) => priceAbsFormatted(val),
  },
  {
    name: 'userName',
    label: i18n.global.t('userName'),
    align: 'center',
    field: 'userName',
    sortable: false,
    visible: true,
  },
  {
    name: 'playerName',
    label: i18n.global.t('playerName'),
    align: 'center',
    field: 'playerName',
    sortable: false,
    visible: true,
  },
  {
    name: 'explanation',
    label: i18n.global.t('explanation'),
    align: 'center',
    field: 'explanation',
    sortable: false,
    visible: true,
  },
])
const transactionLogsTableFilter = ref('')

const deletedTransactionLogsTableColumn = ref([
  {
    name: 'creationTime',
    label: i18n.global.t('createdAt'),
    align: 'center',
    field: 'creationTime',
    sortable: false,
    visible: true,
    format: (val) => date.formatDate(val, 'DD.MM.YYYY HH:mm:ss'),
  },
  {
    name: 'cashdeskName',
    label: i18n.global.t('cashDeskName'),
    align: 'center',
    field: 'cashdeskName',
    sortable: false,
    visible: true,
  },
  {
    name: 'transactionCodeName',
    label: i18n.global.t('tcodeName'),
    align: 'center',
    field: 'transactionCodeName',
    sortable: false,
    visible: true,
  },
  {
    name: 'transactionType',
    label: i18n.global.t('transactionType'),
    align: 'center',
    field: 'transactionType',
    sortable: false,
    visible: true,
  },
  {
    name: 'isDeleted',
    label: i18n.global.t('deleted'),
    align: 'center',
    field: 'isDeleted',
    sortable: false,
    visible: true,
    format: (val) => (val ? i18n.global.t('yes') : i18n.global.t('no')),
  },
  {
    name: 'amount',
    label: i18n.global.t('amount'),
    align: 'center',
    field: 'amount',
    sortable: false,
    visible: true,
    format: (val) => priceAbsFormatted(val),
  },
  /*   {
    name: 'amountBySelectedCurrency',
    label: i18n.global.t('amountBySelectedCurrency'),
    align: 'left',
    field: 'amountBySelectedCurrency',
    sortable: false,
    visible: true,
    format: (val) => priceAbsFormatted(val),
  }, */
  {
    name: 'currencyName',
    label: i18n.global.t('currency'),
    align: 'center',
    field: 'currencyName',
    sortable: false,
    visible: true,
  },
  {
    name: 'userName',
    label: i18n.global.t('userName'),
    align: 'center',
    field: 'userName',
    sortable: false,
    visible: true,
  },
  {
    name: 'playerName',
    label: i18n.global.t('playerName'),
    align: 'center',
    field: 'playerName',
    sortable: false,
    visible: true,
  },
  {
    name: 'explanation',
    label: i18n.global.t('explanation'),
    align: 'center',
    field: 'explanation',
    sortable: false,
    visible: true,
  },
])
const deletedTransactionLogsTableFilter = ref('')

const demo = ref('')

// just for once
onMounted(async () => {
  await onSubmitFilter()
})
</script>

<template>
  <q-page class="q-pa-md">
    <q-card class="no-box-shadow col-12 bg-transparent">
      <q-card-section class="q-pa-none">
        <div class="row">
          <div class="col-4">
            <div class="text-h6">
              {{ $t('balanceReport') }}
            </div>
            <div class="text-subtitle1 text-capitalize">
              Lefkoşa Balance Financal Report
              <span class="text-bold">({{ date.formatDate(formValues.date, 'DD.MM.YYYY') }})</span>
            </div>
          </div>
          <div class="col-8">
            <q-form class="row" @submit="onSubmitFilter">
              <div class="col-12 row flex content-center items-center no-wrap">
                <div class="col q-pa-xs flex justify-end content-end items-end">
                  <q-select-box
                    v-model="formValues.cashdeskId"
                    :options="cashdesks"
                    option-label="name"
                    option-value="id"
                    class="super-small q-mr-sm"
                    hide-bottom-space
                    :label="'Select ' + $t('cashDesk')"
                    style="max-width: 200px"
                    outlined
                    dense
                    bg-color="white"
                  />
                  <el-date-picker
                    v-model="formValues.date"
                    type="date"
                    placeholder="Date"
                    :size="'default'"
                    value-format="YYYY-MM-DD"
                  />
                  <q-btn
                    type="submit"
                    :label="$t('filter')"
                    icon="tune"
                    color="grey-1"
                    text-color="dark"
                    size="13px"
                    unelevated
                    class="q-ml-sm"
                    no-caps
                  />
                  <q-btn
                    type="button"
                    label="Pdf"
                    icon="o_file_download"
                    color="grey-1"
                    text-color="dark"
                    size="13px"
                    unelevated
                    class="q-ml-sm"
                    @click="
                      reportStore.exportBalanceReport({
                        CashdeskId: formValues.cashdeskId,
                        Date: date.formatDate(formValues.date, 'YYYY-MM-DD'),
                        ExportFileType: 'Pdf',
                      })
                    "
                  />
                  <q-btn
                    type="button"
                    label="Excel"
                    icon="o_file_download"
                    color="grey-1"
                    text-color="dark"
                    size="13px"
                    unelevated
                    class="q-ml-sm"
                    @click="
                      reportStore.exportBalanceReport({
                        CashdeskId: formValues.cashdeskId,
                        Date: date.formatDate(formValues.date, 'YYYY-MM-DD'),
                        ExportFileType: 'Excel',
                      })
                    "
                  />
                </div>
              </div>
            </q-form>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <div class="row app-cart-grey q-mt-md">
      <q-card class="no-box-shadow col-12">
        <div class="row q-my-md">
          <q-markup-table class="no-box-shadow col-12" dense separator="none">
            <thead>
              <tr>
                <th colspan="7">
                  <div class="text-subtitle1 text-underline flex content-center items-center">
                    - CASH FIGURES -
                  </div>
                </th>
              </tr>
              <tr>
                <th></th>
                <th class="text-center" colspan="2">
                  <div class="text-weight-medium text-underline">OPENING</div>
                </th>
                <th class="text-center" colspan="2">
                  <div class="text-weight-medium text-underline">CLOSING</div>
                </th>
                <th class="text-center" colspan="2">
                  <div class="text-weight-medium text-underline">MOVEMENT</div>
                </th>
              </tr>
              <tr>
                <th class="text-center">Currency</th>
                <th class="text-center borderLeft">Quantity</th>
                <th class="text-center">{{ getDefaultCurrencyName }} Value</th>
                <th class="text-center borderLeft">Quantity</th>
                <th class="text-center">{{ getDefaultCurrencyName }} Value</th>
                <th class="text-center borderLeft">Quantity</th>
                <th class="text-center">{{ getDefaultCurrencyName }} Value</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in balanceReport?.cashFigures?.cashFigures" :key="index">
                <td class="text-center">{{ item?.currencyName }}</td>

                <td class="text-center borderLeft">
                  {{ priceAbsFormatted(item?.opening) }}
                  {{ currencyStore.getCurrencyById(item?.currencyId).symbol }}
                </td>
                <td class="text-center">
                  {{ priceAbsFormatted(item?.selectedCurrencyOpeningValue) }}
                  {{ currencyStore.getCurrencyById(getDefaultCurrencyId).symbol }}
                </td>

                <td class="text-center borderLeft">
                  {{ priceAbsFormatted(item?.closing) }}
                  {{ currencyStore.getCurrencyById(item?.currencyId).symbol }}
                </td>
                <td class="text-center">
                  {{ priceAbsFormatted(item?.selectedCurrencyClosingValue) }}
                  {{ currencyStore.getCurrencyById(getDefaultCurrencyId).symbol }}
                </td>

                <td class="text-center borderLeft">
                  {{ priceAbsFormatted(item?.movement) }}
                  {{ currencyStore.getCurrencyById(item?.currencyId).symbol }}
                </td>
                <td class="text-center">
                  {{ priceAbsFormatted(item?.selectedCurrencyMovementValue) }}
                  {{ currencyStore.getCurrencyById(getDefaultCurrencyId).symbol }}
                </td>
              </tr>
              <tr class="">
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle2 text-bold">TOTAL CASH</div>
                </td>
                <td class="text-center text-bold borderTop"></td>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle2 text-bold">
                    {{ priceAbsFormatted(balanceReport?.cashFigures?.totalOpeningValue) }}
                  </div>
                </td>
                <td class="text-center text-bold borderTop"></td>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle2 text-bold">
                    {{ priceAbsFormatted(balanceReport?.cashFigures?.totalClosingValue) }}
                  </div>
                </td>
                <td class="text-center text-bold borderTop"></td>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle text-bold2">
                    {{ priceAbsFormatted(balanceReport?.cashFigures?.totalMovementValue) }}
                  </div>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>

        <div class="row">
          <q-markup-table class="no-box-shadow col-12" dense separator="none">
            <thead>
              <tr>
                <th colspan="7">
                  <div class="text-subtitle1 text-underline flex content-center items-center">
                    - CHIP FIGURES -
                  </div>
                </th>
              </tr>
              <tr>
                <th></th>
                <th class="text-center" colspan="2">
                  <div class="text-weight-medium text-underline">OPENING</div>
                </th>
                <th class="text-center" colspan="2">
                  <div class="text-weight-medium text-underline">CLOSING</div>
                </th>
                <th class="text-center" colspan="2">
                  <div class="text-weight-medium text-underline">MOVEMENT</div>
                </th>
              </tr>
              <tr>
                <th class="text-center text-underline">Denominations</th>
                <th class="text-center text-underline">Quantity</th>
                <th class="text-center text-underline">Value</th>
                <th class="text-center text-underline">Quantity</th>
                <th class="text-center text-underline">Value</th>
                <th class="text-center text-underline">Quantity</th>
                <th class="text-center text-underline">Value</th>
              </tr>
            </thead>
            <tbody
              v-for="(chipFigure, chipFigureIndex) in balanceReport?.chipFigures?.chipFigures"
              :key="chipFigureIndex"
            >
              <tr>
                <td class="text-center text-bold">
                  <div class="text-weight-medium text-underline">
                    <span class="q-px-md">{{ chipFigure?.currencyName }}</span
                    >{{ chipFigure?.chipName }}
                  </div>
                </td>
                <td class="text-center text-bold" colspan="6"></td>
              </tr>
              <tr v-for="(item, index) in chipFigure?.chipFigureDetails" :key="index">
                <td class="text-center">{{ item?.chipDenomValue }}</td>

                <td class="text-center">
                  {{ priceAbsFormatted(item?.quantity) }}
                </td>
                <td class="text-center">
                  {{ priceAbsFormatted(item?.selectedCurrencyOpeningValue) }}
                </td>

                <td class="text-center">
                  {{ priceAbsFormatted(item?.quantity) }}
                </td>
                <td class="text-center">
                  {{ priceAbsFormatted(item?.selectedCurrencyClosingValue) }}
                </td>

                <td class="text-center">
                  {{ priceAbsFormatted(item?.quantity) }}
                </td>
                <td class="text-center">
                  {{ priceAbsFormatted(item?.selectedCurrencyMovementValue) }}
                </td>
              </tr>
              <tr>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle2 text-bold">TOTAL</div>
                </td>
                <td class="text-right text-bold borderTop" colspan="2">
                  <div class="text-subtitle2 text-bold text-grey-9">
                    {{ priceAbsFormatted(chipFigure?.totalOpeningValue) }}
                  </div>
                </td>
                <td class="text-right text-bold borderTop" colspan="2">
                  <div class="text-subtitle2 text-bold text-grey-9 q-mr-md">
                    {{ priceAbsFormatted(chipFigure.totalClosingValue) }}
                  </div>
                </td>
                <td class="text-right text-bold borderTop" colspan="2">
                  <div class="text-subtitle text-bold2 text-grey-9 q-mr-md">
                    {{ priceAbsFormatted(chipFigure.totalMovementValue) }}
                  </div>
                </td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <td class="text-center text-bold">TOTAL CHIPS</td>
                <td class="text-right text-bold" colspan="2">
                  <div class="text-subtitle2 text-bold">
                    {{ priceAbsFormatted(balanceReport?.chipFigures?.totalOpeningValue) }}
                  </div>
                </td>
                <td class="text-right text-bold" colspan="2">
                  <div class="text-subtitle2 text-bold">
                    {{ priceAbsFormatted(balanceReport?.chipFigures?.totalClosingValue) }}
                  </div>
                </td>
                <td class="text-right text-bold" colspan="2">
                  <div class="text-subtitle2 text-bold">
                    {{ priceAbsFormatted(balanceReport?.chipFigures?.totalMovementValue) }}
                  </div>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>

        <div class="row q-my-md">
          <q-markup-table class="no-box-shadow col-12" dense separator="none">
            <thead>
              <tr>
                <th colspan="4">
                  <div class="text-subtitle1 text-underline flex content-center items-center">
                    - CUMULATIVE TRANSACTION FIGURES -
                  </div>
                </th>
              </tr>
              <tr>
                <th class="text-center text-underline text-weight-medium">Transaction Code</th>
                <th class="text-center text-underline text-weight-medium">Opening</th>
                <th class="text-center text-underline text-weight-medium">Closing</th>
                <th class="text-center text-underline text-weight-medium">Movement</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in balanceReport?.cumulativeReportTransactionFigures
                  ?.transactionFigures"
                :key="index"
              >
                <td class="text-center text-uppercase">{{ item?.transactionCodeName }}</td>
                <td class="text-center">{{ priceAbsFormatted(item?.opening) }}</td>
                <td class="text-center">{{ priceAbsFormatted(item?.closing) }}</td>
                <td class="text-center">{{ priceAbsFormatted(item?.movement) }}</td>
              </tr>
              <tr>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle2 text-bold">TOTAL VALUE</div>
                </td>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle2 text-bold">
                    {{
                      priceAbsFormatted(
                        balanceReport?.cumulativeReportTransactionFigures?.totalOpeningValue,
                      )
                    }}
                  </div>
                </td>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle2 text-bold">
                    {{
                      priceAbsFormatted(
                        balanceReport?.cumulativeReportTransactionFigures?.totalClosingValue,
                      )
                    }}
                  </div>
                </td>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle text-bold2">
                    {{
                      priceAbsFormatted(
                        balanceReport?.cumulativeReportTransactionFigures?.totalMovementValue,
                      )
                    }}
                  </div>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
        <div class="row">
          <q-markup-table class="no-box-shadow col-12" dense separator="none">
            <thead>
              <tr>
                <th colspan="5">
                  <div class="text-subtitle1 text-underline flex content-center items-center">
                    - DAILY TRANSACTION FIGURES -
                  </div>
                </th>
              </tr>

              <tr>
                <th class="text-center text-underline">Transaction</th>
                <th class="text-center text-underline">Count</th>
                <th class="text-center text-underline">Received</th>
                <th class="text-center text-underline">Paid</th>
                <th class="text-center text-underline">Net</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in balanceReport?.dailyTransactionFigures
                  ?.dailyTransactionFigureDetails"
                :key="index"
              >
                <td class="text-center borderLeft">{{ item?.transactionCodeName }}</td>
                <td class="text-center borderLeft">{{ item?.count }}</td>
                <td class="text-center borderLeft">{{ item?.received }}</td>
                <td class="text-center borderLeft">{{ item?.paid }}</td>
                <td class="text-center borderLeft">{{ item?.net }}</td>
              </tr>
              <tr>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle2 text-bold">TOTAL</div>
                </td>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle2 text-bold">
                    {{ priceAbsFormatted(balanceReport?.dailyTransactionFigures?.totalCount) }}
                  </div>
                </td>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle2 text-bold">
                    {{ priceAbsFormatted(balanceReport?.dailyTransactionFigures?.totalReceived) }}
                  </div>
                </td>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle2 text-bold">
                    {{ priceAbsFormatted(balanceReport?.dailyTransactionFigures?.totalPaid) }}
                  </div>
                </td>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle2 text-bold">
                    {{ priceAbsFormatted(balanceReport?.dailyTransactionFigures?.totalNet) }}
                  </div>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>

        <div class="row">
          <q-markup-table class="no-box-shadow col-12" dense separator="none">
            <thead>
              <tr>
                <th colspan="4">
                  <div
                    class="text-subtitle1 text-underline text-bold flex content-center items-center"
                  >
                    - CHIP AND CASH RATE CHANGE REPORT -
                  </div>
                </th>
              </tr>
              <tr>
                <th class="text-center text-underline text-weight-medium">Account Name</th>
                <th class="text-center text-underline text-weight-medium">Opening</th>
                <th class="text-center text-underline text-weight-medium">Closing</th>
                <th class="text-center text-underline text-weight-medium">Difference</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-center">CASH VALUES</td>
                <td class="text-center">
                  {{ priceAbsFormatted(balanceReport.cashRateChanges?.opening) }}
                </td>
                <td class="text-center">
                  {{ priceAbsFormatted(balanceReport.cashRateChanges?.closing) }}
                </td>
                <td class="text-center">
                  {{ priceAbsFormatted(balanceReport.cashRateChanges?.difference) }}
                </td>
              </tr>
              <tr>
                <td class="text-center">CHIP VALUES</td>
                <td class="text-center">
                  {{ priceAbsFormatted(balanceReport.cashRateChanges?.opening) }}
                </td>
                <td class="text-center">
                  {{ priceAbsFormatted(balanceReport.cashRateChanges?.closing) }}
                </td>
                <td class="text-center">
                  {{ priceAbsFormatted(balanceReport.cashRateChanges?.difference) }}
                </td>
              </tr>
              <tr>
                <td class="borderTop"></td>
                <td class="borderTop"></td>
                <td class="text-center borderTop">
                  <div class="text-subtitle2 text-bold">TOTAL</div>
                </td>
                <td class="text-center borderTop">
                  <div class="text-subtitle2 text-bold">
                    {{ priceAbsFormatted(balanceReport?.cashRateChanges?.difference) }}
                  </div>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>

        <div class="row">
          <q-markup-table class="no-box-shadow col-12" dense separator="none">
            <thead>
              <tr>
                <th colspan="6">
                  <div class="text-subtitle1 text-underline flex content-center items-center">
                    - DAILY RATE CHANGE REPORT (DETAILED)-
                  </div>
                </th>
              </tr>
              <tr>
                <th class="text-center text-underline text-weight-medium">Quantity</th>
                <th class="text-center text-underline text-weight-medium">Open. Rate</th>
                <th class="text-center text-underline text-weight-medium">Curr. Rate</th>
                <th class="text-center text-underline text-weight-medium">Open. Value</th>
                <th class="text-center text-underline text-weight-medium">Curr. Value</th>
                <th class="text-center text-underline text-weight-medium">Profit</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in balanceReport?.dailyRateChangeReport
                  ?.dailyRateChangeDetails"
                :key="index"
              >
                <td class="text-center">Cash Values</td>
                <td class="text-center">{{ priceAbsFormatted(0) }}</td>
                <td class="text-center">{{ priceAbsFormatted(0) }}</td>
                <td class="text-center">{{ priceAbsFormatted(0) }}</td>
                <td class="text-center">{{ priceAbsFormatted(0) }}</td>
                <td class="text-center">{{ priceAbsFormatted(0) }}</td>
              </tr>
              <tr>
                <td class="borderTop"></td>
                <td class="borderTop"></td>
                <td class="borderTop"></td>
                <td class="borderTop"></td>
                <td class="borderTop">
                  <div class="text-subtitle2 text-bold">TOTAL PROFIT</div>
                </td>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle2 text-bold">
                    {{
                      priceAbsFormatted(
                        balanceReport?.cumulativeReportTransactionFigures?.totalOpeningValue,
                      )
                    }}
                  </div>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>

        <div class="row">
          <q-markup-table class="no-box-shadow col-12" dense separator="none">
            <thead>
              <tr>
                <th colspan="8">
                  <div class="text-subtitle1 text-underline flex content-center items-center">
                    - INTERNAL TRANSFERS -
                  </div>
                </th>
              </tr>
              <tr>
                <th class="text-center text-underline text-weight-medium">Trans ID</th>
                <th class="text-center text-underline text-weight-medium">From</th>
                <th class="text-center text-underline text-weight-medium">To</th>
                <th class="text-center text-underline text-weight-medium">Amount</th>
                <th class="text-center text-underline text-weight-medium">Currency</th>
                <th class="text-center text-underline text-weight-medium">Date - Time</th>
                <th class="text-center text-underline text-weight-medium">Received</th>
                <th class="text-center text-underline text-weight-medium">Paid</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in balanceReport?.internalTransfers?.internalTransferDetails"
                :key="index"
              >
                <td class="text-center">{{ item?.currencyName }}</td>
                <td class="text-center">{{ item?.transactionCodeName }}</td>
                <td class="text-center">{{ item?.count }}</td>

                <td class="text-center">
                  {{ priceAbsFormatted(item?.receivedValueBySelectedCurrency) }}
                </td>
                <td class="text-center">{{ priceAbsFormatted(item?.received) }}</td>

                <td class="text-center">
                  {{ priceAbsFormatted(item?.paidValueBySelectedCurrency) }}
                </td>
                <td class="text-center">{{ priceAbsFormatted(item?.paid) }}</td>

                <td class="text-center">
                  {{ priceAbsFormatted(item?.netValueBySelectedCurrency) }}
                </td>
                <td class="text-center">{{ priceAbsFormatted(item?.net) }}</td>
              </tr>
              <tr>
                <td class="text-center text-bold borderTop"></td>
                <td class="text-center text-bold borderTop"></td>
                <td class="text-center text-bold borderTop"></td>
                <td class="text-center text-bold borderTop"></td>
                <td class="text-center text-bold borderTop"></td>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle2 text-bold">Total</div>
                </td>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle2 text-bold">00.00</div>
                </td>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle2 text-bold">00.00</div>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>

        <div class="row">
          <div class="col-12">
            <div class="text-subtitle1 text-underline flex content-center items-center q-pl-md">
              - SLOT REVENUES -
            </div>
          </div>

          <div class="col-5 q-pa-xs">
            <q-markup-table class="no-box-shadow col-12" dense>
              <thead>
                <tr>
                  <th class="text-center q-card--bordered" colspan="6">
                    <div class="text-underline">Slot In</div>
                  </th>
                </tr>
                <tr>
                  <th class="text-center text-underline text-weight-medium" colspan="2">Bill In</th>
                  <th class="text-center text-underline text-weight-medium" colspan="2">
                    Ticket In
                  </th>
                  <th class="text-center text-underline text-weight-medium" colspan="2">
                    Cashless In
                  </th>
                </tr>
                <tr>
                  <th class="text-center text-underline text-weight-medium">BillIn</th>
                  <th class="text-center">{{ getDefaultCurrencyName }} Value</th>
                  <th class="text-center">TicketIn</th>
                  <th class="text-center">{{ getDefaultCurrencyName }} Value</th>
                  <th class="text-center">CashlessIn</th>
                  <th class="text-center">{{ getDefaultCurrencyName }} Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in balanceReport?.slotRevenues?.slotIns" :key="index">
                  <td class="text-center">
                    {{ priceAbsFormatted(item?.billIn) }}
                  </td>
                  <td class="text-center">
                    {{ priceAbsFormatted(item?.billInBySelectedCurrency) }}
                  </td>

                  <td class="text-center borderLeft">
                    {{ priceAbsFormatted(item?.ticketIn) }}
                  </td>
                  <td class="text-center">
                    {{ priceAbsFormatted(item?.ticketInBySelectedCurrency) }}
                  </td>
                  <td class="text-center borderLeft">
                    {{ priceAbsFormatted(item?.cashlessIn) }}
                  </td>
                  <td class="text-center">
                    {{ priceAbsFormatted(item?.cashlessInBySelectedCurrency) }}
                  </td>
                </tr>
                <tr>
                  <td class="text-right borderTop" colspan="6">
                    <div class="text-subtitle2">
                      <span class="q-mr-md">Total</span>
                      {{ priceAbsFormatted(balanceReport?.slotRevenues?.slotInTotal) }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
          <div class="col-7 q-pa-xs">
            <q-markup-table class="no-box-shadow col-12" dense>
              <thead>
                <tr>
                  <th class="text-center" colspan="8">
                    <div class="text-underline">Slot Out</div>
                  </th>
                </tr>
                <tr>
                  <th class="text-center text-underline text-weight-medium" colspan="2">
                    Ticket Out
                  </th>
                  <th class="text-center text-underline text-weight-medium" colspan="2">
                    Cashless Out
                  </th>
                  <th class="text-center text-underline text-weight-medium" colspan="2">
                    Handpay Ticket Out
                  </th>
                  <th class="text-center text-underline text-weight-medium" colspan="2">
                    Handpay Cashless Out
                  </th>
                </tr>
                <tr>
                  <th class="text-center">Ticket</th>
                  <th class="text-center">
                    Value <span class="text-xs">{{ getDefaultCurrencyName }}</span>
                  </th>
                  <th class="text-center">Cashless</th>
                  <th class="text-center">{{ getDefaultCurrencyName }} Value</th>
                  <th class="text-center">HandpayTicket</th>
                  <th class="text-center">{{ getDefaultCurrencyName }} Value</th>
                  <th class="text-center">HandpayCashless</th>
                  <th class="text-center">{{ getDefaultCurrencyName }} Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in balanceReport?.slotRevenues?.slotOuts" :key="index">
                  <td class="text-center">
                    {{ priceAbsFormatted(item?.ticketOut) }}
                  </td>
                  <td class="text-center">
                    {{ priceAbsFormatted(item?.ticketOutBySelectedCurrency) }}
                  </td>
                  <td class="text-center borderLeft">
                    {{ priceAbsFormatted(item?.cashlessOut) }}
                  </td>
                  <td class="text-center">
                    {{ priceAbsFormatted(item?.cashlessOutBySelectedCurrency) }}
                  </td>
                  <td class="text-center borderLeft">
                    {{ priceAbsFormatted(item?.handpayTicketOut) }}
                  </td>
                  <td class="text-center">
                    {{ priceAbsFormatted(item?.handpayTicketOutBySelectedCurrency) }}
                  </td>
                  <td class="text-center borderLeft">
                    {{ priceAbsFormatted(item?.handpayCashlessOut) }}
                  </td>
                  <td class="text-center">
                    {{ priceAbsFormatted(item?.handpayCashlessOutBySelectedCurrency) }}
                  </td>
                </tr>

                <tr>
                  <td class="text-right borderTop" colspan="6">
                    <div class="text-subtitle2">
                      <span class="q-mr-md">Total</span>
                      {{ priceAbsFormatted(balanceReport?.slotRevenues?.slotOutTotal) }}
                    </div>
                  </td>
                  <td class="text-right borderTop" colspan="2">
                    <div class="text-subtitle2">
                      <span class="q-mr-md text-negative">Net</span>
                      {{ priceAbsFormatted(balanceReport?.slotRevenues?.net) }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
        </div>
        <div class="row">
          <q-markup-table class="no-box-shadow col-12" dense separator="none">
            <thead>
              <tr>
                <th colspan="7">
                  <div class="text-subtitle1 text-underline flex content-center items-center">
                    - LG TABLES -
                  </div>
                </th>
              </tr>
              <tr>
                <th class="text-center text-underline text-weight-medium">Table Name</th>
                <th class="text-center text-underline text-weight-medium">In Terim Credit</th>
                <th class="text-center text-underline text-weight-medium">In Terim Fill</th>
                <th class="text-center text-underline text-weight-medium">Total Credit</th>
                <th class="text-center text-underline text-weight-medium">Total Drop</th>
                <th class="text-center text-underline text-weight-medium">Total Fill</th>
                <th class="text-center text-underline text-weight-medium">Total Result</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in balanceReport?.lgTables?.data" :key="index">
                <td class="text-center">{{ item?.tableName }}</td>
                <td class="text-center">{{ priceAbsFormatted(item?.inTerimCredit) }}</td>
                <td class="text-center">{{ priceAbsFormatted(item?.inTerimFill) }}</td>
                <td class="text-center">{{ priceAbsFormatted(item?.totalCredit) }}</td>
                <td class="text-center">{{ priceAbsFormatted(item?.totalDrop) }}</td>
                <td class="text-center">{{ priceAbsFormatted(item?.totalFill) }}</td>
                <td class="text-center">{{ priceAbsFormatted(item?.totalResult) }}</td>
              </tr>
              <tr>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle2 text-bold">Total Value</div>
                </td>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle2 text-bold">
                    {{ priceAbsFormatted(balanceReport?.lgTables?.totalInTerimCredit) }}
                  </div>
                </td>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle2 text-bold">
                    {{ priceAbsFormatted(balanceReport?.lgTables?.totalInTerimFill) }}
                  </div>
                </td>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle text-bold2">
                    {{ priceAbsFormatted(balanceReport?.lgTables?.totalCredit) }}
                  </div>
                </td>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle2 text-bold">
                    {{ priceAbsFormatted(balanceReport?.lgTables?.totalDrop) }}
                  </div>
                </td>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle2 text-bold">
                    {{ priceAbsFormatted(balanceReport?.lgTables?.totalFill) }}
                  </div>
                </td>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle2 text-bold">
                    {{ priceAbsFormatted(balanceReport?.lgTables?.totalResult) }}
                  </div>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
        <div class="row">
          <q-markup-table class="no-box-shadow col-12" dense separator="none">
            <thead>
              <tr>
                <th colspan="7">
                  <div class="text-subtitle1 text-underline flex content-center items-center">
                    - LG GAMES -
                  </div>
                </th>
              </tr>
              <tr>
                <th class="text-center text-underline text-weight-medium">Game Name</th>
                <th class="text-center text-underline text-weight-medium">In Terim Credit</th>
                <th class="text-center text-underline text-weight-medium">In Terim Fill</th>
                <th class="text-center text-underline text-weight-medium">Total Credit</th>
                <th class="text-center text-underline text-weight-medium">Total Drop</th>
                <th class="text-center text-underline text-weight-medium">Total Fill</th>
                <th class="text-center text-underline text-weight-medium">Total Result</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in balanceReport?.lgGames?.data" :key="index">
                <td class="text-center">{{ item?.gameName }}</td>
                <td class="text-center">{{ priceAbsFormatted(item?.inTerimCredit) }}</td>
                <td class="text-center">{{ priceAbsFormatted(item?.inTerimFill) }}</td>
                <td class="text-center">{{ priceAbsFormatted(item?.totalCredit) }}</td>
                <td class="text-center">{{ priceAbsFormatted(item?.totalDrop) }}</td>
                <td class="text-center">{{ priceAbsFormatted(item?.totalFill) }}</td>
                <td class="text-center">{{ priceAbsFormatted(item?.totalResult) }}</td>
              </tr>
              <tr>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle2 text-bold">Total Value</div>
                </td>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle2 text-bold">
                    {{ priceAbsFormatted(balanceReport?.lgGames?.totalInTerimCredit) }}
                  </div>
                </td>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle2 text-bold">
                    {{ priceAbsFormatted(balanceReport?.lgGames?.totalInTerimFill) }}
                  </div>
                </td>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle text-bold2">
                    {{ priceAbsFormatted(balanceReport?.lgGames?.totalCredit) }}
                  </div>
                </td>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle2 text-bold">
                    {{ priceAbsFormatted(balanceReport?.lgGames?.totalDrop) }}
                  </div>
                </td>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle2 text-bold">
                    {{ priceAbsFormatted(balanceReport?.lgGames?.totalFill) }}
                  </div>
                </td>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle2 text-bold">
                    {{ priceAbsFormatted(balanceReport?.lgGames?.totalResult) }}
                  </div>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>

        <div class="row">
          <div class="col-6 q-pa-sm">
            <div class="text-subtitle1 text-underline text-center">
              - EXCHANGE RATES (DAY DATE) -
            </div>

            <q-markup-table class="no-box-shadow col-12" dense separator="none">
              <thead>
                <tr>
                  <th class="text-center text-underline text-weight-medium">Currency</th>
                  <th class="text-center text-underline text-weight-medium">To Currency</th>
                  <th class="text-center text-underline text-weight-medium">Exchange Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in balanceReport?.dayBeforeRates" :key="index">
                  <td class="text-center">{{ item?.fromCurrency }}</td>
                  <td class="text-center">{{ item?.toCurrency }}</td>
                  <td class="text-center">{{ item?.rate }}</td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
          <div class="col-6 q-pa-sm">
            <div class="text-subtitle1 text-underline text-center">
              - EXCHANGE RATES (BALANCE DATE) -
            </div>
            <q-markup-table class="no-box-shadow col-12" dense separator="none">
              <thead>
                <tr>
                  <th class="text-center text-underline text-weight-medium">Currency</th>
                  <th class="text-center text-underline text-weight-medium">To Currency</th>
                  <th class="text-center text-underline text-weight-medium">Exchange Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in balanceReport?.currentRates" :key="index">
                  <td class="text-center">{{ item?.fromCurrency }}</td>
                  <td class="text-center">{{ item?.toCurrency }}</td>
                  <td class="text-center">{{ item?.rate }}</td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
        </div>

        <div class="row q-pa-sm">
          <q-table
            :columns="transactionLogsTableColumn"
            :rows="balanceReport?.transactionLogs || []"
            row-key="id"
            dense
            class="no-box-shadow col-12 sticky-header"
            :rows-per-page-options="[0]"
            hide-bottom
            :filter="transactionLogsTableFilter"
            virtual-scroll
            style="height: 400px"
          >
            <template v-slot:top>
              <div class="row full-width">
                <div class="col-8">
                  <div class="text-subtitle1 text-underline flex content-center items-center">
                    - TRANSACTION LOGS -
                  </div>
                </div>
                <div class="col-4 float-right">
                  <q-input
                    clearable
                    v-model="transactionLogsTableFilter"
                    label="Search"
                    dense
                    outlined
                    class="super-small"
                  >
                    <template v-slot:prepend>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>
              </div>
            </template>
          </q-table>
        </div>

        <div class="row q-pa-sm">
          <q-table
            :columns="deletedTransactionLogsTableColumn"
            :rows="balanceReport?.deletedTransactionsLogs || []"
            row-key="id"
            dense
            class="no-box-shadow col-12 sticky-header"
            :rows-per-page-options="[0]"
            hide-bottom
            :filter="deletedTransactionLogsTableFilter"
            virtual-scroll
            style="height: 400px"
          >
            <template v-slot:top>
              <div class="row full-width">
                <div class="col-8">
                  <div class="text-subtitle1 text-underline flex content-center items-center">
                    - DELETED TRANSACTION LOGS -
                  </div>
                </div>
                <div class="col-4 float-right">
                  <q-input
                    clearable
                    v-model="transactionLogsTableFilter"
                    label="Search"
                    dense
                    outlined
                    class="super-small"
                  >
                    <template v-slot:prepend>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>
              </div>
            </template>
          </q-table>
        </div>
        <div class="row">
          <div class="col-12">
            <q-separator class="q-my-md" size="3px" />
          </div>
        </div>
        <q-card-section class="bg-white">
          <div class="row text-center flex justify-center">
            <div class="text-h6 col-12 text-bold text-negative">-- Summary Figures --</div>
            <q-list style="width: 700px">
              <q-item>
                <q-item-section>
                  <q-item-label class="q-mt-sm">
                    <div class="text-subtitle1 text-bold">Opening Totals</div>
                  </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="q-mt-sm">
                    <q-input
                      square
                      v-model="getOpeningTotal"
                      class="super-small"
                      dense
                      outlined
                      readonly
                    />
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="q-mt-sm">
                    <div class="text-subtitle1 text-bold">
                      Ancillary Transactions Received / Paid
                    </div>
                  </q-item-label>
                </q-item-section>
                <q-item-section class=" " style="max-width: 160px !important">
                  <q-item-label class="q-mt-sm">
                    <q-input
                      square
                      v-model="getReceiptPaidTotal.received"
                      class="super-small"
                      dense
                      outlined
                      readonly
                    />
                  </q-item-label>
                </q-item-section>
                <q-item-section class=" " style="max-width: 160px !important">
                  <q-item-label class="q-mt-sm">
                    <q-input
                      square
                      v-model="getReceiptPaidTotal.paid"
                      class="super-small"
                      dense
                      outlined
                      readonly
                    />
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label class="q-mt-sm">
                    <div class="text-subtitle1 text-bold">Slot Slip Revenues</div>
                  </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="q-mt-sm">
                    <q-input
                      square
                      v-model="getSlipTotal"
                      class="super-small"
                      dense
                      outlined
                      readonly
                    />
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label class="q-mt-sm">
                    <div class="text-subtitle1 text-bold">Daily Rate Change Difference</div>
                  </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="q-mt-sm">
                    <q-input
                      square
                      v-model="getDailyRateTotal"
                      class="super-small"
                      dense
                      outlined
                      readonly
                    />
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="q-mt-sm">
                    <div class="text-subtitle1 text-bold">Error</div>
                  </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="q-mt-sm">
                    <q-input square v-model="demo" class="super-small" dense outlined readonly />
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="q-mt-sm">
                    <div class="text-subtitle1 text-bold">Closing Totals</div>
                  </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="q-mt-sm">
                    <q-input
                      square
                      v-model="getClosingTotal"
                      class="super-small"
                      dense
                      outlined
                      readonly
                    />
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="q-mt-sm">
                    <div class="text-subtitle1 text-bold">Actual Closing Totals</div>
                  </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="q-mt-sm">
                    <q-input
                      square
                      v-model="getActuallyTotal.total"
                      class="super-small"
                      dense
                      outlined
                      readonly
                    />
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="q-mt-sm">
                    <div class="text-subtitle1 text-bold">Diff</div>
                  </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="q-mt-sm">
                    <q-input
                      square
                      v-model="getDiffTotal"
                      class="super-small"
                      dense
                      outlined
                      readonly
                    />
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<style lang="scss">
.q-item {
  min-height: 30px !important;
  padding: 2px !important;
}
.borderLeft {
  border-left: 1px solid #e0e0e0;
}
.borderTop {
  border-top: 2px solid #e0e0e0 !important;
}
.text-underline {
  text-decoration: underline;
}

.sticky-header {
  .q-table__top {
    background-color: #ffffff !important;
  }
  .q-table__top,
  thead tr:first-child th {
    background-color: $grey-2;
    height: 35px !important;
  }
  thead tr th {
    position: sticky;
    z-index: 1;
  }
  thead tr:first-child th {
    top: 0;
  }

  &.q-table--loading thead tr:last-child th {
    top: 48px;
  }

  tbody {
    scroll-margin-top: 48px;
  }
}
</style>
