<script setup>
import { computed, ref, watchEffect, inject } from 'vue'
import { useInspectorStore } from 'src/stores/inspector-store'
import { useAuthStore } from 'src/stores/auth-store'
import { date } from 'quasar'
const inspectorStore = useInspectorStore()
const { currentPlayer, currentTable, currentPlayerCashHistory } = storeToRefs(inspectorStore)

const authStore = useAuthStore()
const { getDefaultGamingDateId } = storeToRefs(authStore)

const bus = inject('bus')

import { storeToRefs } from 'pinia'
import { formatPrice } from 'src/helpers/helpers'
const columns = ref([
  {
    name: 'createdAt',
    align: 'center',
    label: 'Date',
    field: 'createdAt',
    sortable: false,
    format: (val) => date.formatDate(val, 'DD.MM.YYYY HH:mm:ss'),
    visible: true,
  },

  {
    name: 'chipType',
    align: 'center',
    label: 'Drop Type',
    field: 'chipType',
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
])

const filterFields = computed(() => {
  return {
    tableId: currentTable.value?.id,
    playerId: currentPlayer.value?.playerId,
    gamingDateId: getDefaultGamingDateId.value,
  }
})
const selectedRow = ref(null)
const selectedRowIndex = ref(-1)
const loading = ref(false)

const onRowClick = (props) => {
  selectedRow.value = props.row
  selectedRowIndex.value = props.rowIndex
}
/* const onClickRowDetail = (data) => {
  selectedRow.value = data.row;
  selectedRowIndex.value = data.rowIndex;

  let getRowHistoryDetailFilterFields = {
    tableId: data.row.tableId,
    PlayerId: data.row.playerId,
    CreatedAt: data.row.createdAt,
  };
  $q.dialog({
    component: defineAsyncComponent(() =>
      import("./ChipHistoryDetailDialog.vue")
    ),
    componentProps: {
      getChipHistoryDetailFilterFields: getRowHistoryDetailFilterFields,
      fetchChipHistoryDetail: inspectorStore.fetchChipHistoryDetail,
      payload: data.row,
    },
  });
}; */
const fetchData = () => {
  if (currentPlayer.value) {
    loading.value = true
    inspectorStore.fetchCurrentPlayerCashHistory(filterFields.value).then(() => {
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
        :rows="currentPlayerCashHistory"
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
            <q-td key="createdAt" :props="props">
              {{ date.formatDate(props.row.createdAt, 'DD.MM.YYYY HH:mm:ss') }}
            </q-td>
            <q-td key="chipType" :props="props">
              {{ props.row?.chipType || $t('Cash') }}
            </q-td>
            <q-td key="currencyName" :props="props">
              {{ props.row.currencyName }}
            </q-td>
            <q-td key="amount" :props="props">
              {{ formatPrice(props.row.amount) || '-' }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<style scoped lang="scss"></style>
