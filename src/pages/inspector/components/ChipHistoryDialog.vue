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
          {{ $t('chipHistory') }} <span class="text-negative">*</span>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-xs">
        <Information
          class="full-width"
          content="Masaya yapılan chip in ve chip out işlemlerinin listesini verir."
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
              <q-td key="playerId" :props="props">
                {{ props.row.playerId }}
              </q-td>
              <q-td key="playerName" :props="props">
                {{ props.row.playerName }}
              </q-td>
              <q-td key="chipDenom" :props="props">
                {{ props.row.chipDenom }}
              </q-td>
              <!--  <q-td key="quantity" :props="props">
                {{ props.row.quantity }}
              </q-td> -->
              <q-td key="chipCurrency" :props="props">
                {{ props.row.chipCurrency }}
              </q-td>

              <q-td key="operationType" :props="props">
                {{ props.row.operationType }}
              </q-td>
              <q-td key="chipType" :props="props">
                {{ props.row.chipType }}
              </q-td>
              <q-td key="chipAmount" :props="props">
                {{ formatPrice(props.row.chipAmount) }}
              </q-td>
              <q-td key="inspector" :props="props">
                {{ props.row.inspector || '-' }}
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
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, useQuasar, date } from 'quasar'
import { defineAsyncComponent, onMounted, ref } from 'vue'

import { formatPrice } from 'src/helpers/helpers'
const props = defineProps({
  getChipHistoryFilterFields: {
    type: Object,
    default: () => ({}),
  },
  fetchChipHistory: {
    type: Function,
    default: () => () => {},
  },
  fetchChipHistoryDetail: {
    type: Function,
    default: () => () => {},
  },
})
defineEmits([...useDialogPluginComponent.emits])
const $q = useQuasar()
const chipHistory = ref([])
const selectedChip = ref()
const selectedChipIndex = ref(-1)
const loading = ref(false)
const { dialogRef, onDialogHide } = useDialogPluginComponent()
const columns = ref([
  {
    name: 'playerId',
    align: 'center',
    label: 'Player ID',
    field: 'playerId',
    sortable: false,
    visible: false,
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
    name: 'chipCurrency',
    align: 'center',
    label: 'Currency',
    field: 'chipCurrency',
    sortable: false,
    visible: true,
  },
  {
    name: 'operationType',
    align: 'center',
    label: 'In/Out',
    field: 'operationType',
    sortable: false,
    visible: true,
  },
  {
    name: 'chipType',
    align: 'center',
    label: 'Chip Type',
    field: 'chipType',
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
  },
  {
    name: 'inspector',
    align: 'center',
    label: 'Inspector',
    field: 'inspector',
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
const filterFields = ref({
  ...props.getChipHistoryFilterFields,
})

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
      fetchChipHistoryDetail: props.fetchChipHistoryDetail,
      payload: data.row,
    },
  })
}
/* const navigateSelected = (action = "down") => {
  if (chipHistory.value.length === 0) {
    return;
  }
  if (selectedChipIndex.value === -1) {
    selectedChipIndex.value = 0;
    selectedChip.value = chipHistory.value[selectedChipIndex.value];
    return;
  }
  if (action === "down") {
    if (selectedChipIndex.value === chipHistory.value.length - 1) {
      selectedChipIndex.value = 0;
    } else {
      selectedChipIndex.value += 1;
    }
  } else {
    if (selectedChipIndex.value === 0) {
      selectedChipIndex.value = chipHistory.value.length - 1;
    } else {
      selectedChipIndex.value -= 1;
    }
  }
  selectedChip.value = chipHistory.value[selectedChipIndex.value];
}; */

/* const onClickClose = () => {
  selectedChipIndex.value = -1;
  selectedChip.value = null;
  chipHistory.value = [];
  onDialogCancel();
};
 */
onMounted(async () => {
  loading.value = true
  await props
    .fetchChipHistory(filterFields.value)
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
