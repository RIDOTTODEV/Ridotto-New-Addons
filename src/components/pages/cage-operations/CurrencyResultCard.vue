<template>
  <div>
    <div class="row" v-if="currencyTotals.length > 0 && showSummaryCard === true">
      <div
        class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto text-center q-pa-xs items-center justify-center md:min-w-[25%]"
        v-for="total in currencyTotals"
        :key="total?.currencyName"
      >
        <q-card flat class="app-cart-grey w-full">
          <q-card-section class="q-pa-none">
            <div class="text-h6">
              {{ total?.currencyName || total?.chipType + ' - ' + total?.chipCurrencyName }}
            </div>
            <div class="row">
              <div class="col-4">
                <div class="text-caption">{{ $t('withdrawal') }}</div>
              </div>
              <div class="col-4">
                <div class="text-caption">{{ $t('deposit') }}</div>
              </div>
              <div class="col-4">
                <div class="text-caption">{{ $t('result') }}</div>
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                <div
                  class="text-subtitle2"
                  :class="{
                    'text-green-8': total?.withdrawal > 0,
                    'text-negative': total?.withdrawal < 0,
                  }"
                >
                  {{ $priceAbs(total?.withdrawal) }}
                </div>
              </div>
              <div class="col-4">
                <div
                  class="text-subtitle2"
                  :class="{
                    'text-green-8': total?.deposit > 0,
                    'text-negative': total?.deposit < 0,
                  }"
                >
                  {{ $priceAbs(total?.deposit) }}
                </div>
              </div>
              <div class="col-4">
                <div
                  class="text-subtitle2"
                  :class="{
                    'text-green-8': total?.result > 0,
                    'text-negative': total?.result < 0,
                  }"
                >
                  {{ $priceAbs(total?.result) }}
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-card
      class="no-box-shadow q-mb-md q-ma-xs"
      v-if="currencyTotals.length > 0 && showSummaryCard === false"
    >
      <q-card-section class="q-pa-none">
        <q-markup-table dense separator="cell" bordered class="no-box-shadow" square>
          <thead>
            <tr>
              <th class="text-center">Currency</th>
              <th class="text-center">Deposit</th>
              <th class="text-center">Withdrawal</th>
              <th class="text-center">Result</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(total, index) in currencyTotals" :key="index">
              <td class="text-center">{{ total?.currencyName }}</td>
              <td class="text-center">{{ $priceAbs(total?.deposit) }}</td>
              <td class="text-center">{{ $priceAbs(total?.withdrawal) }}</td>
              <td class="text-center">{{ $priceAbs(total?.result) }}</td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
defineProps({
  currencyTotals: {
    type: Array,
    required: true,
    default: () => [],
  },
  showSummaryCard: {
    type: Boolean,
    required: false,
    default: true,
  },
})
</script>
