<template>
  <q-page class="q-pa-md">
    <q-card class="no-box-shadow q-mb-md">
      <q-card-section class="q-pa-none">
        <div class="col flex row justify-start">
          <div class="q-pa-xs flex items-end">
            <DatePicker v-model="liveGameFloorResultReportFilterFields.Date" />

            <q-btn
              type="button"
              :label="$t('filter')"
              icon="tune"
              color="grey-2"
              text-color="dark"
              size="13px"
              unelevated
              no-caps
              @click="getLiveGameFloorResult()"
              class="q-ml-sm q-card--bordered"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card class="no-box-shadow bg-transparent">
      <q-card-section class="q-pa-none">
        <div class="text-subtitle1 q-mb-md">
          {{ $t('floorResults') }}
        </div>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <q-markup-table square flat bordered separator="cell" dense>
          <thead>
            <tr>
              <th class="text-center">Table</th>
              <th
                class="text-center"
                v-for="(item, index) in responseData?.data[0]?.hours"
                :key="index"
              >
                {{ item.hour }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in responseData?.data" :key="index">
              <td class="text-center">{{ item.tableName }}</td>
              <td class="text-center" v-for="(hour, index) in item.hours" :key="index">
                <div class="row bg-grey-2">
                  <div class="col-6 text-caption border-right">D</div>
                  <div class="col-6 text-caption">R</div>
                </div>
                <div class="row">
                  <div class="col-6 text-caption">{{ hour.drop }}</div>
                  <div class="col-6 text-caption">{{ hour.result }}</div>
                </div>
                <!-- <tr>
                  <td class="text-caption">D</td>
                  <td class="text-caption">R</td>
                </tr>
                <tr>
                  <td class="text-caption">{{ hour.drop }}</td>
                  <td class="text-caption">{{ hour.result }}</td>
                </tr> -->
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
    </q-card>

    <q-card class="no-box-shadow bg-transparent q-mb-md q-mt-lg">
      <q-card-section class="q-pa-none row">
        <div class="col-5 q-pa-xs">
          <div class="text-subtitle1">
            {{ $t('fillCredit') }}
          </div>
        </div>
        <div class="col-3 q-pa-xs">
          <div class="text-subtitle1">
            {{ $t('fillCreditTotals') }}
          </div>
        </div>
        <div class="col-4 q-pa-xs">
          <div class="text-subtitle1">
            {{ $t('gameGroups') }}
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-none row">
        <div class="col-5 q-pa-xs">
          <q-markup-table square flat bordered separator="cell" dense>
            <thead>
              <tr>
                <th class="text-center">Created.At</th>
                <th class="text-center">Table.N</th>
                <th class="text-center">Transaction.C</th>
                <th class="text-center">Currency.N</th>
                <th class="text-center">Amount</th>
                <th class="text-center">Default.C.A</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in responseData?.fillCreditTransactions?.transactions" :key="item.id">
                <td class="text-center">
                  {{ date.formatDate(item.createdAt, 'YYYY-MM-DD HH:mm:ss') }}
                </td>
                <td class="text-center">{{ item.tableName }}</td>
                <td class="text-center">{{ item.transactionCode }}</td>
                <td class="text-center">{{ item.currencyName }}</td>
                <td class="text-center bg-green-1">
                  {{ priceAbsFormatted(item.amount) }}
                </td>
                <td class="text-center bg-orange-1">
                  {{ priceAbsFormatted(item.defaultCurrencyAmount) }}
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
        <div class="col-3 q-pa-xs">
          <q-markup-table square flat bordered separator="cell" dense>
            <thead>
              <tr>
                <th class="text-center">Transaction.C</th>
                <th class="text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in responseData?.fillCreditTransactions?.totals"
                :key="index"
              >
                <td class="text-center">
                  {{ item.transactionCode }}
                </td>
                <td class="text-center bg-green-1">
                  {{ priceAbsFormatted(item.totalAmount) }}
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
        <div class="col-4 q-pa-xs">
          <q-markup-table square flat bordered separator="cell" dense>
            <thead>
              <tr>
                <th class="text-center">Game.N</th>
                <th class="text-center">Total.D</th>
                <th class="text-center">Total.O</th>
                <th class="text-center">Result</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in responseData?.gameResultReport" :key="index">
                <td class="text-center">
                  {{ item.game }}
                </td>
                <td class="text-center bg-brown-1">
                  {{ priceAbsFormatted(item.totalDrop) }}
                </td>
                <td class="text-center bg-red-1">
                  {{ priceAbsFormatted(item.totalOut) }}
                </td>
                <td class="text-center bg-green-1">
                  {{ priceAbsFormatted(item.result) }}
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useReportStore } from 'src/stores/report-store'
import { date } from 'quasar'
import { priceAbsFormatted } from 'src/helpers/helpers'
const reportStore = useReportStore()
const responseData = ref({
  data: [],
  fillCreditTransactions: [],
  gameResultReport: [],
})
const liveGameFloorResultReportFilterFields = ref({
  Date: new Date(),
})

const getLiveGameFloorResult = async () => {
  const res = await reportStore.getLiveGameFloorResult({
    Date: date.formatDate(liveGameFloorResultReportFilterFields.value.Date, 'YYYY-MM-DD'),
  })
  responseData.value = res
}

onMounted(() => {
  getLiveGameFloorResult()
})
</script>
<style scoped lang="scss">
.linkMenu {
  &:hover {
    color: #000000;
    text-decoration: underline;
    cursor: pointer;
  }
}
.border-right {
  position: relative;
}

.border-right::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 10px;
  width: 1px;
  background-color: #7e7e7e;
}
</style>
