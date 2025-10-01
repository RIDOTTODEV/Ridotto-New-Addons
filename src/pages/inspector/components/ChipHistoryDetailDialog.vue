<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class=" " square style="min-width: 800px">
      <q-card-section class="app-cart-grey q-pa-xs flex content-end items-center justify-between">
        <div class="text-subtitle1 text-bold q-pl-sm">
          {{ $t('chipHistoryDetail') }}
          <span class="text-negative">*</span>
        </div>
        <div class="bg-warning text-capitalize q-ml-sm q-mr-sm text-subtitle2 q-pl-sm q-pr-sm">
          {{ date.formatDate(payload?.createdAt, 'YYYY-MM-DD HH:mm:ss') }}
        </div>
      </q-card-section>
      <q-card-section class="q-pa-xs">
        <q-table
          :rows="chipHistoryDetails"
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

              <q-td key="operationType" :props="props">
                {{ props.row.operationType === 'ChipIn' ? 'Chip In' : 'Chip Out' }}
              </q-td>
              <!--     <q-td key="chipType" :props="props">
                {{ props.row.chipType }}
              </q-td> -->
              <q-td key="chipDenom" :props="props">
                {{ props.row.chipDenom }}
              </q-td>
              <q-td key="quantity" :props="props">
                {{ props.row.quantity }}
              </q-td>
              <q-td key="chipAmount" :props="props">
                {{ priceAbsFormatted(props.row.chipAmount) || '-' }}
              </q-td>
              <q-td key="chipCurrency" :props="props">
                {{ props.row.chipCurrency }}
              </q-td>
              <!--  <q-td key="createdByName" :props="props">
                {{ props.row.createdByName || '-' }}
              </q-td> -->
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
  getChipHistoryDetailFilterFields: {
    type: Object,
    default: () => ({}),
  },
  fetchChipHistoryDetail: {
    type: Function,
    default: () => () => {},
  },
  payload: {
    type: Object,
    default: () => {},
  },
})
defineEmits([...useDialogPluginComponent.emits])
const chipHistoryDetails = ref([])
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
    visible: true,
  },
  {
    name: 'playerName',
    align: 'center',
    label: 'Player Name',
    field: 'playerName',
    sortable: false,
    visible: true,
    classes: 'text-capitalize',
  },
  {
    name: 'operationType',
    align: 'center',
    label: 'In/Out',
    field: 'operationType',
    sortable: false,
    visible: true,
  },
  /*   {
    name: 'chipType',
    align: 'center',
    label: 'Chip Type',
    field: 'chipType',
    sortable: false,
    visible: true,
  }, */
  {
    name: 'chipDenom',
    align: 'center',
    label: 'Value',
    field: 'chipDenom',
    sortable: false,
    visible: true,
  },
  {
    name: 'quantity',
    align: 'center',
    label: 'Quantity',
    field: 'quantity',
    sortable: false,
    visible: true,
  },
  {
    name: 'chipAmount',
    align: 'center',
    label: 'Chip Amount',
    field: 'chipAmount',
    sortable: false,
    visible: true,
    format: (val) => priceAbsFormatted(val),
  },
  {
    name: 'chipCurrency',
    align: 'center',
    label: 'Currency',
    field: 'chipCurrency',
    sortable: false,
    visible: true,
  },
  /*   {
    name: 'createdByName',
    align: 'center',
    label: 'Inspector',
    field: 'createdByName',
    sortable: false,
    visible: true,
  }, */

  // {name: 'detail', align: 'center', locale: 'detail', field: 'id', sortable: false, visible: true},
])
const filterFields = ref({
  ...props.getChipHistoryDetailFilterFields,
})

const onRowClick = (props) => {
  selectedChip.value = props.row
  selectedChipIndex.value = props.rowIndex
}

onMounted(async () => {
  loading.value = true
  await props
    .fetchChipHistoryDetail(filterFields.value)
    .then((response) => {
      chipHistoryDetails.value = response?.map((item, index) => {
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
