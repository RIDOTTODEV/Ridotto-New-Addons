<script setup>
import { ref } from 'vue'
import { date } from 'quasar'
import { useReportStore } from 'src/stores/report-store'
import { useAuthStore } from 'src/stores/auth-store'
import { storeToRefs } from 'pinia'
import { priceAbsFormatted } from 'src/helpers/helpers'

const authStore = useAuthStore()

const { getDefaultCurrencyName } = storeToRefs(authStore)
const reportStore = useReportStore()

const dateFilterValue = ref(null)
const masteryReport = ref({
  slotFigures: null,
  cashdeskFigures: [],
})

const onSubmitFilter = async () => {
  const response = await reportStore.getMasteryReport(dateFilterValue.value)
  masteryReport.value = response
}
</script>

<template>
  <q-page class="q-pa-md">
    <q-card class="no-box-shadow col-12 bg-transparent">
      <q-card-section class="q-pa-none">
        <div class="row">
          <div class="col-md-6 col-xs-12">
            <div class="text-h6">
              {{ $t('masterReport') }}
            </div>
            <div class="text-subtitle1 text-capitalize">
              Lefkoşa Financal Report ({{
                date.formatDate(dateFilterValue?.StartDate, 'DD.MM.YYYY') +
                ' - ' +
                date.formatDate(dateFilterValue?.EndDate, 'DD.MM.YYYY')
              }})
            </div>
          </div>
          <div class="col-md-6 col-xs-12 flex justify-end items-end">
            <q-form
              class="flex sm:flex-row flex-col justify-start gap-2 w-full sm:w-auto"
              @submit="onSubmitFilter"
            >
              <date-time-picker
                @selected-date="
                  (val) => {
                    dateFilterValue = val
                    onSubmitFilter()
                  }
                "
              />
              <q-btn
                type="submit"
                :label="$t('filter')"
                icon="tune"
                color="grey-1"
                text-color="dark"
                size="13px"
                unelevated
              />
              <q-btn
                type="button"
                label="Pdf"
                icon="o_file_download"
                color="grey-1"
                text-color="dark"
                size="13px"
                unelevated
                @click="
                  reportStore.exportMasterReport({
                    ...dateFilterValue,
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
                @click="
                  reportStore.exportMasterReport({
                    ...dateFilterValue,
                    ExportFileType: 'Excel',
                  })
                "
              />
            </q-form>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <div class="row grey-card q-mt-md q-mb-md">
      <q-card class="no-box-shadow col-12 q-pa-md">
        <div class="row">
          <div
            class="text-h6 text-blue-8 text-bold flex items-center content-center"
            v-if="masteryReport?.slotFigures"
          >
            <q-icon name="o_info" class="cursor-pointer q-mr-xs" color="orange-8" size="25px">
              <q-tooltip class="bg-white q-pa-none text-dark">
                <Information
                  class="full-width q-pa-sm"
                  content="Casinodaki tüm slot makinalarındaki  yapılan işlemlerin currency’I bazlı sonuç bilgisini verir."
                />
              </q-tooltip>
            </q-icon>
            Slot Figures
          </div>
        </div>
        <div class="row">
          <q-markup-table class="no-box-shadow col-12" dense>
            <thead>
              <tr>
                <th colspan="5">
                  <div class="text-subtitle1 text-bold flex items-center content-center">
                    Slot Figures
                  </div>
                </th>
                <th colspan="6">
                  <div class="flex justify-end content-end items-end">
                    <div class="text-subtitle2 text-bold text-deep-orange-10 text-right">
                      Totals: {{ priceAbsFormatted(masteryReport.slotFigures?.totalResult) }}
                    </div>
                  </div>
                </th>
              </tr>
              <tr>
                <th class="text-center">Currency Name</th>
                <th class="text-center">Games Played</th>
                <th class="text-center">Bet</th>
                <th class="text-center">Won</th>
                <th class="text-center">Handpay</th>
                <th class="text-center">Card In</th>
                <th class="text-center">Card Out</th>
                <th class="text-center">Total In</th>
                <th class="text-center">Total Out</th>
                <th class="text-center">Total Jackpot</th>
                <th class="text-center">Result</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in masteryReport.slotFigures?.masterReportSlotFigures"
                :key="index"
              >
                <td class="text-center">{{ item?.currencyName }}</td>
                <td class="text-center">{{ item?.gamesPlayed }}</td>
                <td class="text-center">{{ priceAbsFormatted(item?.bet) }}</td>
                <td class="text-center">{{ priceAbsFormatted(item?.won) }}</td>
                <td class="text-center">{{ priceAbsFormatted(item?.handpay) }}</td>
                <td class="text-center">{{ priceAbsFormatted(item?.cardIn) }}</td>
                <td class="text-center">{{ priceAbsFormatted(item?.cardOut) }}</td>
                <td class="text-center">{{ priceAbsFormatted(item?.totalIn) }}</td>
                <td class="text-center">{{ priceAbsFormatted(item?.totalOut) }}</td>
                <td class="text-center">
                  {{ priceAbsFormatted(item?.totalJackpot) }}
                </td>
                <td class="text-center">{{ priceAbsFormatted(item?.result) }}</td>
              </tr>
              <tr>
                <td class="text-center text-bold borderTop">--</td>
                <td class="text-center text-bold borderTop">--</td>
                <td class="text-center text-bold borderTop">
                  {{ priceAbsFormatted(masteryReport.slotFigures?.totalBet) }}
                </td>
                <td class="text-center text-bold borderTop">
                  {{ priceAbsFormatted(masteryReport.slotFigures?.totalWon) }}
                </td>
                <td class="text-center text-bold borderTop">
                  {{ priceAbsFormatted(masteryReport.slotFigures?.totalHandpay) }}
                </td>
                <td class="text-center text-bold borderTop">
                  {{ priceAbsFormatted(masteryReport.slotFigures?.totalCardIn) }}
                </td>
                <td class="text-center text-bold borderTop">
                  {{ priceAbsFormatted(masteryReport.slotFigures?.totalCardOut) }}
                </td>
                <td class="text-center text-bold borderTop">
                  {{ priceAbsFormatted(masteryReport.slotFigures?.totalTotalIn) }}
                </td>
                <td class="text-center text-bold borderTop">
                  {{ priceAbsFormatted(masteryReport.slotFigures?.totalTotalOut) }}
                </td>
                <td class="text-center text-bold borderTop">
                  {{ priceAbsFormatted(masteryReport.slotFigures?.totalTotalJackpot) }}
                </td>
                <td class="text-center text-bold borderTop">
                  {{ priceAbsFormatted(masteryReport.slotFigures?.totalResult) }}
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>

        <div class="row">
          <q-markup-table class="no-box-shadow col-12" dense>
            <thead>
              <tr>
                <th colspan="5">
                  <div class="text-subtitle1 text-bold flex items-center content-center">
                    Live Game Figures
                  </div>
                </th>
                <th colspan="6">
                  <div class="flex justify-end content-end items-end">
                    <div class="text-subtitle2 text-bold text-deep-orange-10 text-right">
                      Totals: {{ priceAbsFormatted(masteryReport.liveGameFigures?.totalResult) }}
                    </div>
                  </div>
                </th>
              </tr>
              <tr>
                <th class="text-center">Game Name</th>
                <th class="text-center">Drop</th>
                <th class="text-center">Out</th>
                <th class="text-center">Hold</th>
                <th class="text-center">Avg.Drop</th>
                <th class="text-center">Avg.Result</th>
                <th class="text-center">Result</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in masteryReport.liveGameFigures?.data" :key="index">
                <td class="text-center">{{ item?.game }}</td>
                <td class="text-center">{{ priceAbsFormatted(item?.drop) }}</td>
                <td class="text-center">{{ priceAbsFormatted(item?.out) }}</td>
                <td class="text-center">{{ priceAbsFormatted(item?.hold) }}</td>
                <td class="text-center">{{ priceAbsFormatted(item?.avgDrop) }}</td>
                <td class="text-center">{{ priceAbsFormatted(item?.avgResult) }}</td>
                <td class="text-center">{{ priceAbsFormatted(item?.result) }}</td>
              </tr>
              <tr>
                <td class="text-center text-bold borderTop">--</td>

                <td class="text-center text-bold borderTop">
                  {{ priceAbsFormatted(masteryReport.liveGameFigures?.totalDrop) }}
                </td>
                <td class="text-center text-bold borderTop">
                  {{ priceAbsFormatted(masteryReport.liveGameFigures?.totalOut) }}
                </td>
                <td class="text-center text-bold borderTop">
                  {{ priceAbsFormatted(masteryReport.liveGameFigures?.totalHold) }}
                </td>
                <td class="text-center text-bold borderTop">
                  {{ priceAbsFormatted(masteryReport.liveGameFigures?.totalAvgDrop) }}
                </td>
                <td class="text-center text-bold borderTop">
                  {{ priceAbsFormatted(masteryReport.liveGameFigures?.totalAvgResult) }}
                </td>
                <td class="text-center text-bold borderTop">
                  {{ priceAbsFormatted(masteryReport.liveGameFigures?.totalResult) }}
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
          <div
            class="text-h6 text-blue-8 text-bold flex items-center content-center"
            v-if="masteryReport?.cashdeskFigures"
          >
            <q-icon name="o_info" class="cursor-pointer q-mr-xs" color="orange-8" size="25px">
              <q-tooltip class="bg-white q-pa-none text-dark">
                <Information
                  class="full-width q-pa-sm"
                  content="Kasadan yapılan transaction’ların cashdesk transaction type göre gruplanarak yatırım,çekim ve sonuç bilgisini verir."
                />
              </q-tooltip>
            </q-icon>
            Cashdesk Figures
          </div>
        </div>
        <div
          class="row"
          v-for="(figure, figureIndex) in masteryReport?.cashdeskFigures"
          :key="figureIndex"
        >
          <div class="col-6">
            <div class="text-subtitle1 text-bold q-ml-md">
              {{ figure?.transactionCodeName }}
            </div>
          </div>
          <div class="col-6 flex justify-end content-end items-end">
            <div class="text-subtitle1 text-bold q-mr-md">
              <span class="q-ml-md text-deep-orange-10">
                Totals: {{ priceAbsFormatted(figure?.totalNetBySelectedCurrency) }}
              </span>
            </div>
          </div>
          <div class="col-12">
            <div class="row">
              <q-markup-table class="no-box-shadow col-12" dense>
                <thead>
                  <tr>
                    <th class="text-center">Currency</th>
                    <th class="text-center">Transaction Code Name</th>
                    <th class="text-center">Received</th>
                    <th class="text-center">Paid</th>
                    <th class="text-center">Net</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in figure?.transactions" :key="index">
                    <td class="text-center">{{ item?.currencyName }}</td>
                    <td class="text-center">{{ item?.transactionCodeName }}</td>
                    <td class="text-center">{{ priceAbsFormatted(item?.received) }}</td>
                    <td class="text-center">{{ priceAbsFormatted(item?.paid) }}</td>
                    <td class="text-center">{{ priceAbsFormatted(item?.net) }}</td>
                  </tr>
                  <tr>
                    <td class="text-center text-bold borderTop">Totals</td>
                    <td class="text-center text-bold borderTop">--</td>
                    <td class="text-center text-bold borderTop">
                      {{ priceAbsFormatted(figure?.totalReceivedBySelectedCurrency) }}
                    </td>
                    <td class="text-center text-bold borderTop">
                      {{ priceAbsFormatted(figure?.totalPaidBySelectedCurrency) }}
                    </td>
                    <td class="text-center text-bold borderTop">
                      {{ priceAbsFormatted(figure?.totalNetBySelectedCurrency) }}
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>
          </div>
        </div>
        <div class="col-12">
          <q-separator class="q-my-md" size="3px" />
        </div>
        <div
          class="text-h6 text-blue-8 text-bold flex items-center content-center"
          v-if="masteryReport.cashFigures !== undefined"
        >
          <q-icon name="o_info" class="cursor-pointer q-mr-xs" color="orange-8" size="25px">
            <q-tooltip class="bg-white q-pa-none text-dark">
              <Information
                class="full-width q-pa-sm"
                content="Casino’nun açılış,kapanış ve açılış ve kapanış arasındaki farkı verir.(CashdeskCountHistoryTotal tablosuna göre)"
              />
            </q-tooltip>
          </q-icon>
          Cash Figures
        </div>
        <div class="row">
          <div class="col-6">
            <div class="text-subtitle1 text-bold q-ml-md">Cash Figures</div>
          </div>
          <div class="col-6 flex justify-end content-end items-end">
            <div class="text-subtitle1 text-bold q-mr-md">
              <span class="q-ml-md text-deep-orange-10">
                Totals: {{ priceAbsFormatted(masteryReport.cashFigures?.totalMovement) }}
              </span>
            </div>
          </div>

          <q-markup-table
            class="no-box-shadow col-12"
            dense
            v-if="masteryReport.cashFigures !== undefined"
          >
            <thead>
              <tr>
                <th class="text-center">Currency Name</th>
                <th class="text-center">Opening</th>
                <th class="text-center">{{ getDefaultCurrencyName }} Value</th>
                <th class="text-center">Closing</th>
                <th class="text-center">{{ getDefaultCurrencyName }} Value</th>
                <th class="text-center">Movement</th>
                <th class="text-center">{{ getDefaultCurrencyName }} Value</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in masteryReport.cashFigures?.cashFigureDetails"
                :key="index"
              >
                <td class="text-center">{{ item?.currencyName }}</td>
                <td class="text-center">{{ priceAbsFormatted(item?.opening) }}</td>
                <td class="text-center">
                  {{ priceAbsFormatted(item?.selectedCurrencyOpeningValue) }}
                </td>
                <td class="text-center">{{ priceAbsFormatted(item?.closing) }}</td>
                <td class="text-center">
                  {{ priceAbsFormatted(item?.selectedCurrencyClosingValue) }}
                </td>
                <td class="text-center">{{ priceAbsFormatted(item?.movement) }}</td>
                <td class="text-center">
                  {{ priceAbsFormatted(item?.selectedCurrencyMovementValue) }}
                </td>
              </tr>
              <tr>
                <td class="text-center text-bold borderTop"></td>
                <td class="text-center text-bold borderTop">
                  {{ priceAbsFormatted(masteryReport.cashFigures?.totalOpening) }}
                </td>
                <td class="text-center text-bold borderTop">--</td>
                <td class="text-center text-bold borderTop">
                  {{ priceAbsFormatted(masteryReport.cashFigures?.totalClosing) }}
                </td>
                <td class="text-center text-bold borderTop">--</td>
                <td class="text-center text-bold borderTop">
                  {{ priceAbsFormatted(masteryReport.cashFigures?.totalMovement) }}
                </td>
                <td class="text-center text-bold borderTop">--</td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
        <div class="row">
          <div class="text-h6 text-blue-8 text-bold" v-if="masteryReport?.cashdeskChipFigures">
            <q-icon name="o_info" class="cursor-pointer q-mr-xs" color="orange-8" size="25px">
              <q-tooltip class="bg-white q-pa-none text-dark">
                <Information
                  class="full-width q-pa-sm"
                  content="Kasadan yapılan çip transaction’ların cashdesk transaction type göre gruplanarak yatırım,çekim ve sonuç bilgisini verir."
                />
              </q-tooltip>
            </q-icon>
            Chip Figures
          </div>
          <div
            class="col-12 row q-mt-md"
            v-for="(figure, figureIndex) in masteryReport?.cashdeskChipFigures"
            :key="figureIndex"
          >
            <div class="col-6">
              <div class="text-subtitle1 text-bold q-ml-md">
                {{ figure?.transactionCodeName }}
              </div>
            </div>
            <div class="col-6 flex justify-end content-end items-end">
              <div class="text-subtitle1 text-bold q-mr-md">
                <span class="q-ml-md text-deep-orange-10">
                  Totals: {{ priceAbsFormatted(figure?.totalNetBySelectedCurrency) }}
                </span>
              </div>
            </div>
            <q-markup-table class="no-box-shadow col-12" dense>
              <thead>
                <tr>
                  <th class="text-center">Currency</th>
                  <th class="text-center">Transaction Type</th>
                  <th class="text-center">Received</th>
                  <th class="text-center">Paid</th>
                  <th class="text-center">Net</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in figure?.transactions" :key="index">
                  <td class="text-center">{{ item?.currencyName }}</td>
                  <td class="text-center">{{ item?.cashdeskTransactionType }}</td>
                  <td class="text-center">{{ priceAbsFormatted(item?.received) }}</td>
                  <td class="text-center">{{ priceAbsFormatted(item?.paid) }}</td>
                  <td class="text-center">{{ priceAbsFormatted(item?.net) }}</td>
                </tr>
                <tr>
                  <td class="text-center text-bold borderTop">Totals</td>
                  <td class="text-center text-bold borderTop">--</td>
                  <td class="text-center text-bold borderTop">
                    {{ priceAbsFormatted(figure?.totalReceivedBySelectedCurrency) }}
                  </td>
                  <td class="text-center text-bold borderTop">
                    {{ priceAbsFormatted(figure?.totalPaidBySelectedCurrency) }}
                  </td>
                  <td class="text-center text-bold borderTop">
                    {{ priceAbsFormatted(figure?.totalNetBySelectedCurrency) }}
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
        </div>
        <div class="row q-mt-md flex items-center content-center justify-center">
          <div
            class="text-h6 text-red-8 text-bold flex items-center content-center justify-center"
            v-if="masteryReport?.missingChipTotal"
          >
            <span class="text-bold q-mr-sm">--</span>
            Missing Chip Total ({{ priceAbsFormatted(masteryReport?.missingChipTotal) }})
            <span class="text-bold q-ml-sm">--</span>
          </div>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<style scoped lang="scss">
.borderTop {
  // border-top: 1px solid grey;
}
</style>
