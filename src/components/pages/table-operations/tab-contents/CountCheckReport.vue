<script setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useReportStore } from 'src/stores/report-store'
import { useTableStore } from 'src/stores/table-store'
import { errorHandle, formatPrice } from 'src/helpers/helpers'

const reportStore = useReportStore()
const tableStore = useTableStore()
const { tableCounts } = storeToRefs(tableStore)
const filterValues = ref({
  tableCountId: null,
})
const reports = ref(null)
onMounted(async () => {
  await tableStore.fetchTableCounts()
  filterValues.value.tableCountId = tableCounts.value[0]?.id
})
const loadingData = ref(false)
const onSubmitFilter = async () => {
  reports.value = null
  loadingData.value = true
  const res = await reportStore.getTableCountCheckReport({
    ...filterValues.value,
  })

  if (res.status === 200) {
    reports.value = res.data
  } else {
    errorHandle(res)
    reports.value = null
  }
  setTimeout(() => {
    loadingData.value = false
  }, 1000)
}
</script>

<template>
  <q-card class="no-box-shadow" flat square>
    <q-card-section class="row">
      <div class="col-6">
        <div class="text-h6">
          {{ $t('tableCountCheckReport') }}
        </div>
      </div>
      <div class="col-6 flex row justify-end">
        <q-select
          v-model="filterValues.tableCountId"
          :options="tableCounts"
          :label="$t('tableCounts')"
          :placeholder="$t('tableCounts')"
          emit-value
          map-options
          option-label="tableName"
          option-value="id"
          class="q-mr-sm super-small"
          outlined
          dense
          hide-bottom-space
          style="width: 150px"
          clearable
          bg-color="white"
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
          @click="onSubmitFilter"
          class="q-ml-sm"
        />
      </div>
    </q-card-section>
    <q-card-section class="row flex justify-center">
      <div>
        <div class="text-subtitle2 flex justify-between">
          {{ $t('chipBalanceCount') }}
          <span class="text-captio text-negative">
            ({{
              formatPrice(reports?.chipBalanceCount?.reduce((acc, denom) => acc + denom.amount, 0))
            }})
          </span>
        </div>
        <q-markup-table separator="cell" flat square bordered dense>
          <thead>
            <tr>
              <th class="grey-card text-center">
                <strong>Denom</strong>
              </th>
              <th class="grey-card text-center">
                <strong class="q-pr-md">Quantity</strong>
              </th>
              <th class="grey-card text-center">
                <strong class="q-pr-md">Amount</strong>
              </th>
            </tr>
          </thead>
          <tbody class="denom-body">
            <tr v-for="(denom, denomIndex) in reports?.chipBalanceCount" :key="denomIndex">
              <td class="text-center text-center cursor-not-allowed" style="padding: 0 !important">
                {{ denom.denomName }}
              </td>
              <td
                class="text-center text-grey-8 text-center cursor-not-allowed"
                style="padding: 0 !important"
              >
                {{ denom.quantity }}
              </td>
              <td
                class="text-center text-grey-8 text-center cursor-not-allowed"
                style="padding: 0 !important"
              >
                {{ formatPrice(denom.amount) }}
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>
      <div class="q-ml-md">
        <div class="text-subtitle2 flex justify-between">
          {{ $t('tableFloat') }}
          <span class="text-captio text-negative">
            ({{ formatPrice(reports?.tableFloat?.reduce((acc, denom) => acc + denom.amount, 0)) }})
          </span>
        </div>
        <q-markup-table separator="cell" flat square bordered dense>
          <thead>
            <tr>
              <th class="grey-card text-center">
                <strong>Denom</strong>
              </th>
              <th class="grey-card text-center">
                <strong class="q-pr-md">Quantity</strong>
              </th>
              <th class="grey-card text-center">
                <strong class="q-pr-md">Amount</strong>
              </th>
            </tr>
          </thead>
          <tbody class="denom-body">
            <tr v-for="(denom, denomIndex) in reports?.tableFloat" :key="denomIndex">
              <td class="text-center text-center cursor-not-allowed" style="padding: 0 !important">
                {{ denom.denomName }}
              </td>
              <td
                class="text-center text-grey-8 text-center cursor-not-allowed"
                style="padding: 0 !important"
              >
                {{ denom.quantity }}
              </td>
              <td
                class="text-center text-grey-8 text-center cursor-not-allowed"
                style="padding: 0 !important"
              >
                {{ formatPrice(denom.amount) }}
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>
    </q-card-section>
  </q-card>
</template>

<style lang="scss"></style>
