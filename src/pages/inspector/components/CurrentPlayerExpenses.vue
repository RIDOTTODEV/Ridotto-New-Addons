<script setup>
import { computed, ref, watchEffect, inject } from 'vue'
import { useInspectorStore } from 'src/stores/inspector-store'
const inspectorStore = useInspectorStore()
const { currentPlayer, currentPlayerExpenses } = storeToRefs(inspectorStore)

const bus = inject('bus')

import { storeToRefs } from 'pinia'
import { formatPrice } from 'src/helpers/helpers'
const columns = ref([
  {
    name: 'expenseName',
    align: 'center',
    label: 'Name',
    field: 'expenseName',
    sortable: false,
    visible: true,
  },

  {
    name: 'currencyName',
    align: 'center',
    label: 'Currency',
    field: 'currencyName',
    sortable: false,
    visible: true,
  },
  {
    name: 'amount',
    align: 'center',
    label: 'Amount',
    field: 'amount',
    sortable: false,
    visible: true,
  },
  {
    name: 'amountInCasinoCurrency',
    align: 'center',
    label: 'Currency Amount',
    field: 'amountInCasinoCurrency',
    sortable: false,
    visible: true,
  },
])

const filterFields = computed(() => {
  return {
    playerId: currentPlayer.value?.playerId,
  }
})
const selectedRow = ref(null)
const selectedRowIndex = ref(-1)
const loading = ref(false)

const onRowClick = (props) => {
  selectedRow.value = props.row
  selectedRowIndex.value = props.rowIndex
}

const fetchData = () => {
  if (currentPlayer.value) {
    loading.value = true
    inspectorStore.fetchCurrentPlayerExpenses(filterFields.value).then(() => {
      loading.value = false
    })
  }
}
watchEffect(async () => {
  fetchData()
})

bus.on('fetchCurrentPlayerCashHistory', () => {
  fetchData()
})
</script>

<template>
  <q-card class="no-box-shadow" square>
    <q-card-section class="q-pl-none q-pr-none q-pb-xs q-pt-xs">
      <q-table
        :rows="currentPlayerExpenses"
        :columns="columns"
        row-key="id"
        hide-bottom
        virtual-scroll
        class="full-width"
        separator="cell"
        dense
        bordered
        square
        flat
        :rows-per-page-options="[0]"
        style="height: 456px !important"
        :loading="loading"
      >
        <template v-slot:body="props">
          <q-tr
            :props="props"
            @click="onRowClick(props)"
            :class="
              selectedRowIndex === props.rowIndex ? 'bg-red-1 text-text-dark' : 'cursor-pointer'
            "
          >
            <q-td key="expenseName" :props="props">
              {{ props.row.expenseName }}
            </q-td>

            <q-td key="currencyName" :props="props">
              {{ props.row.currencyName }}
            </q-td>
            <q-td key="amount" :props="props">
              {{ formatPrice(props.row.amount) || '-' }}
            </q-td>
            <q-td key="amountInCasinoCurrency" :props="props">
              {{ formatPrice(props.row.amountInCasinoCurrency) || '-' }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<style scoped lang="scss"></style>
