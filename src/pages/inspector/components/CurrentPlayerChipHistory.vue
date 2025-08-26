<script setup>
import { computed, defineAsyncComponent, ref, watchEffect, inject } from 'vue'
import { useInspectorStore } from 'src/stores/inspector-store'
import { useAuthStore } from 'src/stores/auth-store'
import { date } from 'quasar'

const inspectorStore = useInspectorStore()
const { currentPlayer, currentTable, currentPlayerChipHistory } = storeToRefs(inspectorStore)

const authStore = useAuthStore()
const { getDefaultGamingDateId } = storeToRefs(authStore)

const bus = inject('bus')
const $q = useQuasar()
import { useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'
import { formatPrice } from 'src/helpers/helpers'
const columns = ref([
  {
    name: 'operationType',
    align: 'center',
    label: 'Operation Type',
    field: 'operationType',
    sortable: false,
    visible: true,
  },
  {
    name: 'chipCurrency',
    align: 'center',
    label: 'Currency',
    field: 'chipCurrency',
    sortable: false,
    visible: true,
  },

  {
    name: 'chipAmount',
    align: 'center',
    label: 'Amount',
    field: 'chipAmount',
    sortable: false,
    visible: true,
  },
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
    name: 'detail',
    align: 'center',
    label: 'Detail',
    field: 'id',
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
const selectedChip = ref()
const selectedChipIndex = ref(-1)
const loading = ref(false)

const onRowClick = (props) => {
  selectedChip.value = props.row
  selectedChipIndex.value = props.rowIndex
}
const onClickRowDetail = (data) => {
  selectedChip.value = data.row
  selectedChipIndex.value = data.rowIndex

  let getChipHistoryDetailFilterFields = {
    tableId: data.row.tableId,
    PlayerId: data.row.playerId,
    CreatedAt: data.row.createdAt,
  }

  $q.dialog({
    component: defineAsyncComponent(() => import('./ChipHistoryDetailDialog.vue')),
    componentProps: {
      getChipHistoryDetailFilterFields: getChipHistoryDetailFilterFields,
      fetchChipHistoryDetail: inspectorStore.fetchChipHistoryDetail,
      payload: data.row,
    },
  })
}

const fetchData = () => {
  if (currentPlayer.value) {
    loading.value = true
    inspectorStore.fetchCurrentPlayerChipHistory(filterFields.value).then(() => {
      loading.value = false
    })
  }
}
watchEffect(() => {
  fetchData()
})

bus.on('fetchCurrentPlayerChipHistory', () => {
  fetchData()
})
</script>

<template>
  <q-card class="no-box-shadow" square>
    <q-card-section class="q-pl-none q-pr-none q-pb-xs q-pt-xs">
      <q-table
        :rows="currentPlayerChipHistory"
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
            :class="selectedChipIndex === props.rowIndex ? ' bg-red-1 text-dark' : 'cursor-pointer'"
          >
            <q-td key="operationType" :props="props">
              {{ props.row.operationType }}
            </q-td>
            <q-td key="chipCurrency" :props="props">
              {{ props.row.chipCurrency }}
            </q-td>
            <q-td key="chipAmount" :props="props">
              {{ formatPrice(props.row.chipAmount) || '-' }}
            </q-td>
            <q-td key="createdAt" :props="props">
              {{ props.cols[props.cols.length - 2].value }}
            </q-td>
            <q-td key="detail" :props="props">
              <q-btn
                icon="o_info"
                round
                dense
                flat
                v-if="props.row.chipType === 'Chip'"
                @click="onClickRowDetail(props)"
              />
              <span v-else>-</span>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<style scoped lang="scss"></style>
