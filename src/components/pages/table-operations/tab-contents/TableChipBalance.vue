<script setup>
import { ref } from 'vue'
import { useReportStore } from 'src/stores/report-store'
import { formatPrice } from 'src/helpers/helpers'
import { Loading } from 'quasar'
const reportStore = useReportStore()
const columns = ref([
  {
    field: 'tableName',
  },
  {
    field: 'gamingDate',
    /*  fieldType: 'date', */
  },
  {
    field: 'currencyName',
  },
  {
    field: 'chipCountTotal',
    fieldType: 'price',
    label: 'Count',
  },
  {
    field: 'floatTotal',
    fieldType: 'price',
    label: 'System Value',
  },
  {
    field: 'actions',
  },
])

const tableChipBalanceTable = ref(null)

const tableChipBalanceDetailParams = ref({
  tableId: null,
})
const tableChipBalanceDetailData = ref({})

const onClickChipTableBalanceDetail = async (row) => {
  tableChipBalanceDetailParams.value = {
    tableId: row.tableId,
  }
  Loading.show({
    message: 'Yükleniyor...',
  })
  tableChipBalanceDetailData.value = await reportStore.getChipTableBalanceDetail(
    tableChipBalanceDetailParams.value,
  )
  setTimeout(() => {
    Loading.hide()
  }, 1000)
}
</script>

<template>
  <q-card class="no-box-shadow" flat>
    <q-card-section class="row flex justify-center">
      <SupaTable
        :columns="columns"
        tableName="tableChipBalance"
        :getDataFn="reportStore.getTableChipBalance"
        :slotNames="['body-cell-actions']"
        ref="tableChipBalanceTable"
      >
        <template v-slot:body-cell-actions="{ props }">
          <q-td key="actions" align="center">
            <q-btn
              unelevated
              dense
              color="grey-2"
              text-color="dark"
              no-caps
              size="12px"
              icon="fa-regular fa-eye"
              class="q-mr-md"
              @click="onClickChipTableBalanceDetail(props.row)"
              v-el-perms="'Addon.TableOperations.Table.View'"
              data-cy="viewData"
            >
              <q-tooltip class="text-subtitle2 app-cart-grey text-dark">{{
                $t('viewDetail')
              }}</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </SupaTable>
    </q-card-section>
    <q-card-section class="row" v-if="tableChipBalanceDetailData.tableName">
      <div class="col-12 flex justify-center q-mt-md">
        <div class="text-subtitle1 bg-orange-1 q-card--bordered text-bold q-pl-sm q-pr-sm">
          {{ tableChipBalanceDetailData?.tableName }}:
          <span class="text-negative">{{ tableChipBalanceDetailData?.gamingDate }}</span>
        </div>
      </div>
      <div class="flex flex-row justify-center content-center items-center w-full">
        <div class="col-span-12 md:col-span-6 q-pa-md">
          <div class="text-subtitle2">
            {{ $t('chipCountDetails') }}
          </div>
          <q-markup-table separator="cell" flat square bordered dense>
            <thead>
              <tr>
                <th class="grey-card text-center">
                  <strong>Denom</strong>
                </th>
                <th class="grey-card text-center">
                  <strong>Type</strong>
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
              <tr
                v-for="(denom, denomIndex) in tableChipBalanceDetailData?.chipCountDetails"
                :key="denomIndex"
              >
                <td
                  class="text-center text-center cursor-not-allowed"
                  style="padding: 0 !important"
                >
                  {{ denom.chipDenomName }}
                </td>
                <td
                  class="text-center text-center cursor-not-allowed"
                  style="padding: 0 !important"
                >
                  {{ denom.chipType }}
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
        <div class="col-span-12 md:col-span-6 q-pa-md">
          <div class="text-subtitle2">
            {{ $t('tableFloatDetails') }}
          </div>
          <q-markup-table separator="cell" flat square bordered dense>
            <thead>
              <tr>
                <th class="grey-card text-center">
                  <strong>Denom</strong>
                </th>
                <th class="grey-card text-center">
                  <strong>Type</strong>
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
              <tr
                v-for="(denom, denomIndex) in tableChipBalanceDetailData?.tableFloatDetails"
                :key="denomIndex"
              >
                <td
                  class="text-center text-center cursor-not-allowed"
                  style="padding: 0 !important"
                >
                  {{ denom.chipDenomName }}
                </td>
                <td
                  class="text-center text-center cursor-not-allowed"
                  style="padding: 0 !important"
                >
                  {{ denom.chipType }}
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
      </div>
    </q-card-section>
  </q-card>
</template>

<style lang="scss"></style>
