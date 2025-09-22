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
    date: date.formatDate(formValues.value.date, 'YYYY-MM-DD'),
  })
}

const transactionLogsTableColumn = ref([
  {
    name: 'creationTime',
    label: i18n.global.t('createdAt'),
    align: 'left',
    field: 'creationTime',
    sortable: false,
    visible: true,
    format: (val) => date.formatDate(val, 'DD.MM.YYYY HH:mm:ss'),
  },
  {
    name: 'cashdeskName',
    label: i18n.global.t('cashDeskName'),
    align: 'left',
    field: 'cashdeskName',
    sortable: false,
    visible: true,
  },
  {
    name: 'transactionCodeName',
    label: i18n.global.t('transactionCodeName'),
    align: 'left',
    field: 'transactionCodeName',
    sortable: false,
    visible: true,
  },
  {
    name: 'amount',
    label: i18n.global.t('amount'),
    align: 'left',
    field: 'amount',
    sortable: false,
    visible: true,
    format: (val) => priceAbsFormatted(val),
  },
  {
    name: 'received',
    label: i18n.global.t('received'),
    align: 'left',
    field: 'received',
    sortable: false,
    visible: true,
    format: (val) => priceAbsFormatted(val),
  },
  {
    name: 'paid',
    label: i18n.global.t('paid'),
    align: 'left',
    field: 'paid',
    sortable: false,
    visible: true,
    format: (val) => priceAbsFormatted(val),
  },
  {
    name: 'userName',
    label: i18n.global.t('userName'),
    align: 'left',
    field: 'userName',
    sortable: false,
    visible: true,
  },
  {
    name: 'playerName',
    label: i18n.global.t('playerName'),
    align: 'left',
    field: 'playerName',
    sortable: false,
    visible: true,
  },
  {
    name: 'explanation',
    label: i18n.global.t('explanation'),
    align: 'left',
    field: 'explanation',
    sortable: false,
    visible: true,
  },
])
const transactionLogsTableFilter = ref('')

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

    <div class="row grey-card q-mt-md">
      <q-card class="no-box-shadow col-12">
        <div class="q-my-md"></div>
        <div class="row">
          <q-markup-table class="no-box-shadow col-12" dense>
            <thead>
              <tr>
                <th colspan="3">
                  <div
                    class="text-subtitle1 text-bold text-capitalize flex content-center items-center"
                  >
                    <q-icon
                      name="o_info"
                      class="cursor-pointer q-mr-xs"
                      color="orange-8"
                      size="22px"
                    >
                      <q-tooltip class="bg-white q-pa-none text-dark">
                        <Information
                          class="full-width q-pa-sm"
                          content="Bir önceki gün kapanışı ve seçili olan tarihreki transactionlardan açılış kapanış ve sonuç bilgisini verir."
                        />
                      </q-tooltip>
                    </q-icon>
                    Cash Figures
                  </div>
                </th>
                <th colspan="4" class="text-right">
                  <span class="q-ml-md text-bold text-deep-orange-10 text-subtitle1">
                    Movement:
                    {{ priceAbsFormatted(balanceReport?.cashFigures?.totalMovementValue) }}
                  </span>
                </th>
              </tr>
              <tr>
                <th></th>
                <th class="text-center" colspan="2">
                  <div class="text-subtitle2">Opening</div>
                </th>
                <th class="text-center" colspan="2">
                  <div class="text-subtitle2">Closing</div>
                </th>
                <th class="text-center" colspan="2">
                  <div class="text-subtitle2">Movement</div>
                </th>
              </tr>
              <tr>
                <th class="text-center">Currency Name</th>
                <th class="text-center borderLeft">Opening</th>
                <th class="text-center">{{ getDefaultCurrencyName }} Value</th>
                <th class="text-center borderLeft">Closing</th>
                <th class="text-center">{{ getDefaultCurrencyName }} Value</th>
                <th class="text-center borderLeft">Movement</th>
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
              <tr>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle2 text-bold">Total Cash</div>
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
          <div class="col-12">
            <q-separator class="q-my-md" size="3px" />
          </div>
        </div>
        <div class="row">
          <q-markup-table class="no-box-shadow col-12" dense>
            <thead>
              <tr>
                <th colspan="2">
                  <div class="text-subtitle1 text-bold flex content-center items-center">
                    <q-icon
                      name="o_info"
                      class="cursor-pointer q-mr-xs"
                      color="orange-8"
                      size="22px"
                    >
                      <q-tooltip class="bg-white q-pa-none text-dark">
                        <Information
                          class="full-width q-pa-sm"
                          content="Yapılan transactionları transaction code bazlı olarak açılış ve kapanış bilgisini verir . "
                        />
                      </q-tooltip>
                    </q-icon>
                    Cumulative Transaction Figures
                  </div>
                </th>
                <th colspan="2" class="text-right">
                  <div class="text-subtitle1 text-bold text-deep-orange-10">
                    Movement:
                    {{
                      priceAbsFormatted(
                        balanceReport?.cumulativeReportTransactionFigures?.totalMovementValue,
                      )
                    }}
                  </div>
                </th>
              </tr>
              <tr>
                <th class="text-center">Transaction Code</th>
                <th class="text-center">Opening</th>
                <th class="text-center">Closing</th>
                <th class="text-center">Movement</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in balanceReport?.cumulativeReportTransactionFigures
                  ?.transactionFigures"
                :key="index"
              >
                <td class="text-center">{{ item?.transactionCodeName }}</td>
                <td class="text-center">{{ priceAbsFormatted(item?.opening) }}</td>
                <td class="text-center">{{ priceAbsFormatted(item?.closing) }}</td>
                <td class="text-center">{{ priceAbsFormatted(item?.movement) }}</td>
              </tr>
              <tr>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle2 text-bold">Total Value</div>
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
          <div class="col-12">
            <q-separator class="q-my-md" size="3px" />
          </div>
        </div>
        <div class="row">
          <q-markup-table class="no-box-shadow col-12" dense>
            <thead>
              <tr>
                <th colspan="4">
                  <div class="text-subtitle1 text-bold flex content-center items-center">
                    <q-icon
                      name="o_info"
                      class="cursor-pointer q-mr-xs"
                      color="orange-8"
                      size="22px"
                    >
                      <q-tooltip class="bg-white q-pa-none text-dark">
                        <Information
                          class="full-width q-pa-sm"
                          content="Yapılan transactionlarda transaction code bilgisinde ki isDaily olanı seçili olan transaction codelara göre açılıi ve kapanış değerlerini verir."
                        />
                      </q-tooltip>
                    </q-icon>
                    Daily Transaction Figures
                  </div>
                </th>
                <th colspan="5" class="text-right">
                  <div class="text-subtitle1 text-bold text-deep-orange-10">
                    Movement:
                    {{ priceAbsFormatted(balanceReport?.dailyTransactionFigures?.totalNet) }}
                  </div>
                </th>
              </tr>
              <tr>
                <th class="text-center" colspan="3"></th>
                <th class="text-center" colspan="2">
                  <div class="text-subtitle2">Opening</div>
                </th>
                <th class="text-center" colspan="2">
                  <div class="text-subtitle2">Closing</div>
                </th>
                <th class="text-center" colspan="2">
                  <div class="text-subtitle2">Movement</div>
                </th>
              </tr>
              <tr>
                <th class="text-center">Currency Name</th>
                <th class="text-center">Transaction Code</th>
                <th class="text-center">Count</th>
                <th class="text-center borderLeft">Opening</th>
                <th class="text-center">EUR Value</th>
                <th class="text-center borderLeft">Closing</th>
                <th class="text-center">EUR Value</th>
                <th class="text-center borderLeft">Movement</th>
                <th class="text-center">EUR Value</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in balanceReport?.dailyTransactionFigures
                  ?.dailyTransactionFigureDetails"
                :key="index"
              >
                <td class="text-center">{{ item?.currencyName }}</td>
                <td class="text-center">{{ item?.transactionCodeName }}</td>
                <td class="text-center">{{ item?.count }}</td>

                <td class="text-center borderLeft">
                  {{ priceAbsFormatted(item?.receivedValueBySelectedCurrency) }}
                </td>
                <td class="text-center">{{ priceAbsFormatted(item?.received) }}</td>

                <td class="text-center borderLeft">
                  {{ priceAbsFormatted(item?.paidValueBySelectedCurrency) }}
                </td>
                <td class="text-center">{{ priceAbsFormatted(item?.paid) }}</td>

                <td class="text-center borderLeft">
                  {{ priceAbsFormatted(item?.netValueBySelectedCurrency) }}
                </td>
                <td class="text-center">{{ priceAbsFormatted(item?.net) }}</td>
              </tr>
              <tr>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle2 text-bold"></div>
                </td>
                <td class="text-center text-bold borderTop"></td>
                <td class="text-center text-bold borderTop"></td>
                <td class="text-center text-bold borderTop"></td>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle2 text-bold">
                    {{ priceAbsFormatted(balanceReport?.dailyTransactionFigures?.totalReceived) }}
                  </div>
                </td>
                <td class="text-center text-bold borderTop"></td>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle2 text-bold">
                    {{ priceAbsFormatted(balanceReport?.dailyTransactionFigures?.totalPaid) }}
                  </div>
                </td>
                <td class="text-center text-bold borderTop"></td>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle text-bold2">
                    {{ priceAbsFormatted(balanceReport?.dailyTransactionFigures?.totalNet) }}
                  </div>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
        <div class="row">
          <div class="col-12">
            <q-separator class="q-my-md" size="3px" />
          </div>
        </div>
        <div class="row">
          <q-markup-table class="no-box-shadow col-12" dense>
            <thead>
              <tr>
                <th colspan="2">
                  <div class="text-subtitle1 text-bold flex content-center items-center">
                    <q-icon
                      name="o_info"
                      class="cursor-pointer q-mr-xs"
                      color="orange-8"
                      size="22px"
                    >
                      <q-tooltip class="bg-white q-pa-none text-dark">
                        <Information
                          class="full-width q-pa-sm"
                          content="Transactionlada cashdesk transaction type değeri Rate Effect olan transactionların açılış ve kapanış değerlerini verir."
                        />
                      </q-tooltip>
                    </q-icon>
                    Cash Rate Change Report
                  </div>
                </th>
                <th colspan="2" class="text-right">
                  <span class="q-ml-md text-bold text-subtitle1 text-deep-orange-10">
                    Total Difference:
                    {{ priceAbsFormatted(balanceReport.cashRateChanges?.difference) }}
                  </span>
                </th>
              </tr>
              <tr>
                <th class="text-center">Account Name</th>
                <th class="text-center">Opening</th>
                <th class="text-center">Closing</th>
                <th class="text-center">Difference</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-center">Cash Values</td>
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
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle2 text-bold">Total Diffirence</div>
                </td>
                <td></td>
                <td></td>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle2 text-bold">
                    {{ priceAbsFormatted(balanceReport?.cashRateChanges?.difference) }}
                  </div>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
        <div class="row">
          <div class="col-12">
            <q-separator class="q-my-md" size="3px" />
          </div>
        </div>
        <div class="row">
          <q-markup-table class="no-box-shadow col-12" dense>
            <thead>
              <tr>
                <th colspan="3">
                  <div class="text-subtitle1 text-bold flex content-center items-center">
                    <q-icon
                      name="o_info"
                      class="cursor-pointer q-mr-xs"
                      color="orange-8"
                      size="22px"
                    >
                      <q-tooltip class="bg-white q-pa-none text-dark">
                        <Information
                          class="full-width q-pa-sm"
                          content="Rate değişiminden kaynaklı oluşan transactionların  önceki ve sonraki rate bilgisini ve kasa balans bilgisini verir."
                        />
                      </q-tooltip>
                    </q-icon>
                    Daily Rate Change Report
                  </div>
                </th>
                <th colspan="3" class="text-right">
                  <span class="q-ml-md text-bold text-subtitle1 text-deep-orange-10">
                    Total Profit:
                    {{ priceAbsFormatted(balanceReport.dailyRateChangeReport?.totalDifference) }}
                  </span>
                </th>
              </tr>
              <tr>
                <th class="text-center">Quantity</th>
                <th class="text-center">Open Rate</th>
                <th class="text-center">Current Rate</th>
                <th class="text-center">Open Value</th>
                <th class="text-center">Current Value</th>
                <th class="text-center">Profit</th>
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
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle2 text-bold">
                    Total Profit
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
          <div class="col-12">
            <q-separator class="q-my-md" size="3px" />
          </div>
        </div>
        <div class="row">
          <q-markup-table class="no-box-shadow col-12" dense>
            <thead>
              <tr>
                <th colspan="4">
                  <div class="text-subtitle1 text-bold flex content-center items-center">
                    <q-icon
                      name="o_info"
                      class="cursor-pointer q-mr-xs"
                      color="orange-8"
                      size="22px"
                    >
                      <q-tooltip class="bg-white q-pa-none text-dark">
                        <Information
                          class="full-width q-pa-sm"
                          content="Kasalar arası yapılan transactionların listesini verir."
                        />
                      </q-tooltip>
                    </q-icon>
                    Internal Transfers
                  </div>
                </th>
                <th colspan="4" class="text-right">
                  <span class="q-ml-md text-bold text-subtitle1 text-deep-orange-10">
                    Movement: 0
                  </span>
                </th>
              </tr>
              <tr>
                <th class="text-center">Transaction Id</th>
                <th class="text-center">From Cashdesk</th>
                <th class="text-center">To Cashdesk</th>
                <th class="text-center">Amount</th>
                <th class="text-center">Currency Name</th>
                <th class="text-center">Creation Time</th>
                <th class="text-center">Received</th>
                <th class="text-center">Paid</th>
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
            <q-separator class="q-my-md" size="3px" />
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <div class="text-subtitle1 text-bold flex content-center items-center q-pl-md">
              <q-icon name="o_info" class="cursor-pointer q-mr-xs" color="orange-8" size="22px">
                <q-tooltip class="bg-white q-pa-none text-dark">
                  <Information
                    class="full-width q-pa-sm"
                    content="Slot tarafında açılış ve kapanış değerlerini  bill,ticket,cashless bilgisine göre gruplu olarak verir."
                  />
                </q-tooltip>
              </q-icon>
              Slot Revenues
            </div>
          </div>
          <div class="col-6 text-right flex items-end content-end justify-end">
            <span class="q-ml-md text-bold text-subtitle1 text-deep-orange-10">
              {{ getDefaultCurrencyName }}
              <span class="q-mr-xs">Net :</span>
              {{ priceAbsFormatted(balanceReport?.slotRevenues?.net) }}
            </span>
          </div>
          <div class="col-4 q-pa-xs">
            <q-markup-table class="no-box-shadow col-12" dense>
              <thead>
                <tr>
                  <th class="text-center q-card--bordered" colspan="6">
                    <div class="text-subtitle1">Open Credit</div>
                  </th>
                </tr>
                <tr>
                  <th class="text-center" colspan="2">BillIn</th>
                  <th class="text-center" colspan="2">TicketIn</th>
                  <th class="text-center" colspan="2">CashlessIn</th>
                </tr>
                <tr>
                  <th class="text-center">BillIn</th>
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
                  <td class="text-right text-bold borderTop" colspan="6">
                    <div class="text-subtitle2 text-bold">
                      <span class="q-mr-md">{{ getDefaultCurrencyName }} Total</span>
                      {{ priceAbsFormatted(balanceReport?.slotRevenues?.slotInTotal) }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
          <div class="col-8 q-pa-xs">
            <q-markup-table class="no-box-shadow col-12" dense>
              <thead>
                <tr>
                  <th class="text-center" colspan="8">
                    <div class="text-subtitle1">Closing Credit</div>
                  </th>
                </tr>
                <tr>
                  <th class="text-center" colspan="2">
                    <div class="text-subtitle2">TicketOut</div>
                  </th>
                  <th class="text-center" colspan="2">
                    <div class="text-subtitle2">CashlessOut</div>
                  </th>
                  <th class="text-center" colspan="2">
                    <div class="text-subtitle2">HandpayTicketOut</div>
                  </th>
                  <th class="text-center" colspan="2">
                    <div class="text-subtitle2">HandpayCashlessOut</div>
                  </th>
                </tr>
                <tr>
                  <th class="text-center">TicketOut</th>
                  <th class="text-center">{{ getDefaultCurrencyName }} Value</th>
                  <th class="text-center">CashlessOut</th>
                  <th class="text-center">{{ getDefaultCurrencyName }} Value</th>
                  <th class="text-center">HandpayTicketOut</th>
                  <th class="text-center">{{ getDefaultCurrencyName }} Value</th>
                  <th class="text-center">HandpayCashlessOut</th>
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
                  <td class="text-right text-bold" colspan="8">
                    <div class="flex justify-end">
                      <div class="text-subtitle text-bold2">
                        {{ getDefaultCurrencyName }}
                        <span class="q-mr-md">Total </span
                        >{{ priceAbsFormatted(balanceReport?.slotRevenues?.slotOutTotal) }}
                      </div>
                      <div class="text-subtitle text-bold2 q-ml-md">
                        {{ getDefaultCurrencyName }}
                        <span class="q-mr-md">Net </span
                        >{{ priceAbsFormatted(balanceReport?.slotRevenues?.net) }}
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <q-separator class="q-my-md" size="3px" />
          </div>
        </div>
        <div class="row">
          <div class="col-6 q-pa-md">
            <div class="text-subtitle1 text-bold text-center">
              Exchange Rates (Day Date)
              <q-separator />
            </div>

            <q-markup-table class="no-box-shadow col-12" dense>
              <thead>
                <tr>
                  <th class="text-center">Currency</th>
                  <th class="text-center">To Currency</th>
                  <th class="text-center">Exchange Rate</th>
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
          <div class="col-6 q-pa-md">
            <div class="text-subtitle1 text-bold text-center">
              Exchange Rates (Balance Date)
              <q-separator />
            </div>
            <q-markup-table class="no-box-shadow col-12" dense>
              <thead>
                <tr>
                  <th class="text-center">Currency</th>
                  <th class="text-center">To Currency</th>
                  <th class="text-center">Exchange Rate</th>
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
        <div class="row">
          <div class="col-12">
            <q-separator class="q-my-md" size="3px" />
          </div>
        </div>
        <div class="row">
          <q-table
            :columns="transactionLogsTableColumn"
            :rows="balanceReport?.transactionLogs || []"
            row-key="id"
            dense
            class="no-box-shadow col-12"
            :rows-per-page-options="[0]"
            hide-bottom
            :filter="transactionLogsTableFilter"
            virtual-scroll
            style="height: 400px"
          >
            <template v-slot:top>
              <div class="row full-width">
                <div class="col-8">
                  <div class="text-subtitle1 text-bold flex content-center items-center">
                    <q-icon
                      name="o_info"
                      class="cursor-pointer q-mr-xs"
                      color="orange-8"
                      size="22px"
                    >
                      <q-tooltip class="bg-white q-pa-none text-dark">
                        <Information
                          class="full-width q-pa-sm"
                          content="Kasalardan yapılan tranaction listesini verir."
                        />
                      </q-tooltip>
                    </q-icon>
                    Transaction Logs
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
        <div class="row">
          <q-markup-table class="no-box-shadow col-12" dense>
            <thead>
              <tr>
                <th colspan="3" class="text-left">
                  <div
                    class="text-subtitle1 text-bold text-capitalize flex content-center items-center"
                  >
                    <q-icon
                      name="o_info"
                      class="cursor-pointer q-mr-xs"
                      color="orange-8"
                      size="22px"
                    >
                      <q-tooltip class="bg-white q-pa-none text-dark">
                        <Information
                          class="full-width q-pa-sm"
                          content="Bir önceki gün kapanışı ve seçili olan tarihreki transactionlardan açılış kapanış ve sonuç bilgisini verir."
                        />
                      </q-tooltip>
                    </q-icon>
                    Chip Figures
                  </div>
                </th>
                <th colspan="4" class="text-right">
                  <span class="q-ml-md text-bold text-subtitle1 text-deep-orange-10">
                    Movement:
                    {{ priceAbsFormatted(balanceReport?.chipFigures?.totalMovementValue) }}
                  </span>
                </th>
              </tr>
              <tr>
                <th></th>
                <th class="text-center" colspan="2">
                  <div class="text-subtitle2">Opening</div>
                </th>
                <th class="text-center" colspan="2">
                  <div class="text-subtitle2">Closing</div>
                </th>
                <th class="text-center" colspan="2">
                  <div class="text-subtitle2">Movement</div>
                </th>
              </tr>
              <tr>
                <th class="text-center">Currency Name / Chip Name</th>
                <th class="text-center borderLeft">Opening</th>
                <th class="text-center">{{ getDefaultCurrencyName }} Value</th>
                <th class="text-center borderLeft">Closing</th>
                <th class="text-center">{{ getDefaultCurrencyName }} Value</th>
                <th class="text-center borderLeft">Movement</th>
                <th class="text-center">{{ getDefaultCurrencyName }} Value</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in balanceReport?.chipFigures?.chipFigures" :key="index">
                <td class="text-center">{{ item?.currencyName }} / {{ item.chipName }}</td>

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
              <tr>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle2 text-bold">Total Cash</div>
                </td>
                <td class="text-center text-bold borderTop"></td>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle2 text-bold">
                    {{ priceAbsFormatted(balanceReport?.chipFigures?.totalOpeningValue) }}
                  </div>
                </td>
                <td class="text-center text-bold borderTop"></td>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle2 text-bold">
                    {{ priceAbsFormatted(balanceReport?.chipFigures?.totalClosingValue) }}
                  </div>
                </td>
                <td class="text-center text-bold borderTop"></td>
                <td class="text-center text-bold borderTop">
                  <div class="text-subtitle text-bold2">
                    {{ priceAbsFormatted(balanceReport?.chipFigures?.totalMovementValue) }}
                  </div>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
        <div class="row">
          <div class="col-12">
            <q-separator class="q-my-md" size="3px" />
          </div>
        </div>
        <q-card-section>
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

<style scoped lang="scss">
.q-item {
  min-height: 30px !important;
  padding: 2px !important;
}
.borderLeft {
  border-left: 1px solid #e0e0e0;
}
</style>
