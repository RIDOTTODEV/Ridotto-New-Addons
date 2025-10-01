<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class=" " square style="min-width: 800px">
      <q-card-section class="app-cart-grey q-pa-xs">
        <div class="text-subtitle1 text-bold q-pl-sm">
          {{ $t('cashHistory') }} <span class="text-negative">*</span>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-xs">
        <Information
          class="full-width"
          content="Masaya yapılan cash drop ‘ların listesini verir."
        />
      </q-card-section>
      <q-card-section class="q-pa-xs">
        <q-table
          :rows="chipHistory"
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
                selectedChip?.id === props.row.id ? 'bg-negative text-white' : 'cursor-pointer'
              "
            >
              <q-td key="createdAt" :props="props">
                {{ date.formatDate(props.row.createdAt, 'DD.MM.YYYY HH:mm:ss') }}
              </q-td>
              <q-td key="playerName" :props="props">
                {{ props.row.playerName }}
              </q-td>
              <q-td key="tableName" :props="props">
                {{ props.row.tableName }}
              </q-td>
              <q-td key="chipType" :props="props">
                {{ props.row.chipType || 'Cash' }}
              </q-td>
              <q-td key="amount" :props="props">
                {{ priceAbsFormatted(props.row.amount) }}
              </q-td>

              <q-td key="createdByName" :props="props">
                {{ props.row.createdByName || '-' }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, date } from 'quasar'
import { onMounted, ref } from 'vue'

import { priceAbsFormatted } from 'src/helpers/helpers'
const props = defineProps({
  getCashHistoryFilterFields: {
    type: Object,
    default: () => ({}),
  },
  fetchCashHistory: {
    type: Function,
    default: () => () => {},
  },
})
defineEmits([...useDialogPluginComponent.emits])
const chipHistory = ref([])
const selectedChip = ref()
const selectedChipIndex = ref(-1)
const loading = ref(false)
const { dialogRef, onDialogHide } = useDialogPluginComponent()
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
    name: 'playerName',
    align: 'center',
    label: 'Player Name',
    field: 'playerName',
    sortable: false,
    visible: true,
  },
  {
    name: 'tableName',
    align: 'center',
    label: 'Table Name',
    field: 'tableName',
    sortable: false,
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
    name: 'amount',
    align: 'center',
    label: 'Amount',
    field: 'amount',
    sortable: false,
    visible: true,
  },

  {
    name: 'createdByName',
    align: 'center',
    label: 'Inspector',
    field: 'createdByName',
    sortable: false,
    visible: true,
  },
])
const filterFields = ref({
  ...props.getCashHistoryFilterFields,
})

const onRowClick = (props) => {
  selectedChip.value = props.row
  selectedChipIndex.value = props.rowIndex
}

onMounted(async () => {
  loading.value = true
  await props
    .fetchCashHistory(filterFields.value)
    .then((response) => {
      chipHistory.value = response?.map((item, index) => {
        return {
          ...item,
          id: index + 1,
        }
      })
    })
    .finally(() => {
      loading.value = false
    })
})
</script>
