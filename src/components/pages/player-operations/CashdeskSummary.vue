<template>
  <q-card class="q-mb-md no-box-shadow col-12 q-mt-xl">
    <q-card-section class="row q-pb-none">
      <div class="col-md-8 col-sm-12 col-xs-12 flex content-center">
        <div class="text-subtitle1 text-bold">
          <q-icon name="remove" />
          Cash Desk Summary
        </div>
      </div>
      <div class="col-md-4 col-sm-12 col-xs-12">
        <div class="full-width row justify-end">
          <date-time-picker
            @selected-date="onSelectedDate"
            v-el-perms="'Addon.CashlessOperations.CashDeskSummary.Filter'"
          />
          <q-btn
            size="13px"
            icon="cached"
            class="q-ml-sm"
            color="grey-2"
            text-color="dark"
            no-caps
            unelevated
            @click="reloadCashDeskSummary(cashDeskSummaryFilterValues)"
            v-el-perms="'Addon.PlayerOperations.CashDeskSummary.Reload'"
          />
        </div>
      </div>
    </q-card-section>
    <q-card-section
      v-if="cashDeskSummary && cashDeskSummary?.summary?.length > 0"
      v-el-perms="'Addon.PlayerOperations.CashDeskSummary.ShowTab'"
    >
      <div :class="$q.dark.isActive ? 'row bg-blue-grey-8' : 'row bg-grey-2'">
        <div class="col text-center">
          <div class="text-subtitle1">Account Type</div>
        </div>
        <div class="col text-center">
          <div class="text-subtitle1">Transaction Type</div>
        </div>
        <div
          class="col text-center"
          v-for="(currency, index) in getUniqueCurrencies(cashDeskSummary.summary)"
          :key="index"
        >
          <div class="text-subtitle1">
            {{ currency }}
          </div>
        </div>
      </div>

      <div class="row" v-for="(item, index) in cashDeskSummary.totals" :key="index">
        <div class="col text-center text-capitalize">
          {{ item.accountType }}
        </div>
        <div class="col text-center text-capitalize">
          {{ item.transactionType }}
        </div>
        <div
          class="col text-center"
          v-for="(currency, index) in getUniqueCurrencies(cashDeskSummary.totals)"
          :key="index"
        >
          {{ findSummaryAmount(item.data, currency) }}
        </div>
      </div>
    </q-card-section>
    <q-card-section v-if="cashDeskSummary && cashDeskSummary?.cashdeskSummary?.length > 0">
      <div :class="$q.dark.isActive ? 'row bg-blue-grey-8' : 'row bg-grey-2'">
        <div class="col text-center">
          <div class="text-subtitle1">Cashdesk</div>
        </div>
        <div class="col text-center">
          <div class="text-subtitle1">Account Type</div>
        </div>
        <div class="col text-center">
          <div class="text-subtitle1">Transaction Type</div>
        </div>
        <div
          class="col text-center"
          v-for="(currency, index) in getUniqueCurrencies(cashDeskSummary.totals)"
          :key="index"
        >
          <div class="text-subtitle1">
            {{ currency }}
          </div>
        </div>
      </div>
      <div class="row" v-for="(item, index) in cashDeskSummary.cashdeskSummary" :key="index">
        <div class="col text-center text-capitalize">
          {{ item.cashdeskName }}
        </div>
        <div class="col text-center text-capitalize">
          {{ item.accountType }}
        </div>
        <div class="col text-center text-capitalize">
          {{ item.transactionType }}
        </div>
        <div
          class="col text-center"
          v-for="(currency, index) in getUniqueCurrencies(cashDeskSummary.cashdeskSummary)"
          :key="index"
        >
          {{ findSummaryAmount(item.data, currency) }}
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup>
import { formatPrice } from 'src/helpers/helpers'
import { ref } from 'vue'
const props = defineProps({
  cashDeskSummary: {
    type: Object,
    required: true,
  },
  reloadCashDeskSummary: {
    type: Function,
    required: true,
  },
})

const getUniqueCurrencies = (params) => {
  const uniqueMap = params
    .map((item) => item.data)
    .flat()
    .map((item) => item.currencyCode)
    .filter((value, index, self) => self.indexOf(value) === index)
  return uniqueMap
}

const findSummaryAmount = (params, currencyCode) => {
  let amount = params.find((item) => item.currencyCode === currencyCode)?.amount
  return amount ? formatPrice(amount) : '0.00'
}
const cashDeskSummaryFilterValues = ref(null)
const onSelectedDate = (val) => {
  cashDeskSummaryFilterValues.value = val
  props.reloadCashDeskSummary(cashDeskSummaryFilterValues.value)
}
</script>
