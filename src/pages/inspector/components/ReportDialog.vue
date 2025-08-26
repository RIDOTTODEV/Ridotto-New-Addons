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
          {{ $t('tableTransactionsReport', { table: table?.name }) }}
          <span class="text-negative">*</span>
        </div>
      </q-card-section>
      <q-card-section class="row q-pa-xs">
        <div class="col-8 flex content-center items-center q-pa-xs">
          <q-tabs
            v-model="currentTab"
            dense
            class="text-grey full-width"
            active-color="blue-grey-8"
            indicator-color="blue-grey-8"
            active-bg-color="white"
            align="justify"
            narrow-indicator
            no-caps
            shrink
            @update:model-value="selectedTransaction = null"
          >
            <q-tab
              :class="index === 0 ? 'q-card--bordered' : 'q-card--bordered q-ml-sm'"
              v-for="(tab, index) in tabs"
              :key="index"
              :data-cy="tab.key"
              :v-el-perms="tab.elPermission"
              no-caps
              :name="tab.name"
              :label="$t(tab.label)"
              :icon="tab.icon"
              style="min-height: 41px !important"
            />
          </q-tabs>
        </div>
        <div class="col-4 bg-grey-2 q-pa-xs q-card--bordered">
          <div class="row">
            <div class="col-4 flex content-center items-center">
              <div class="text-subtitle2">
                {{ $t('cashTotal') }}
              </div>
            </div>
            <div class="col-8">
              <q-input
                dense
                readonly
                outlined
                class="super-small full-width"
                :model-value="priceAbsFormatted(transactionsReport.totalCash)"
                square
                bg-color="white"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-4 flex content-center items-center">
              <div class="text-subtitle2">
                {{ $t('plaqTotal') }}
              </div>
            </div>
            <div class="col-8">
              <q-input
                dense
                readonly
                outlined
                class="super-small full-width"
                :model-value="priceAbsFormatted(transactionsReport.totalPlaque)"
                square
                bg-color="white"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-4 flex content-center items-center">
              <div class="text-subtitle2">
                {{ $t('total') }}
              </div>
            </div>
            <div class="col-8">
              <q-input
                dense
                readonly
                outlined
                class="super-small full-width"
                :model-value="priceAbsFormatted(transactionsReport.total)"
                square
                bg-color="white"
              />
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-xs">
        <q-tab-panels v-model="currentTab" animated class="q-mt-sm full-height">
          <q-tab-panel name="chipBalance" class="q-pa-none">
            <Information
              class="full-width q-mb-sm"
              content="Chip transactions’larda player’ın  chip in ve chip out işlemlerine göre  çip adeti hesaplanır."
            />
            <q-scroll-area style="height: 400px; width: 100% !important">
              <q-markup-table dense separator="cell" bordered square flat>
                <thead>
                  <tr>
                    <th class="text-left text-bold">{{ $t('name') }}</th>
                    <th
                      class="text-center text-bold bg-grey-2"
                      v-for="(item, index) in sortedTableFloatDenoms"
                      :key="index"
                    >
                      {{ item.chipValue }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(player, index) in transactionsReport.chipInOutInfo"
                    :key="index"
                    @click="onRowClick(player, index)"
                    :class="
                      selectedTransaction?.playerId === player.playerId
                        ? 'bg-negative text-white'
                        : 'cursor-pointer'
                    "
                  >
                    <td class="text-left">{{ player.playerName }}</td>
                    <td
                      class="text-center playerTd"
                      style=""
                      v-for="(chip, key) in sortedTableFloatDenoms"
                      :key="key"
                    >
                      <div
                        class="text-bold playerChip"
                        v-if="
                          player?.chipDenoms.map((c) => c.chipDenomId).includes(chip.chipDenomId)
                        "
                      >
                        {{
                          player?.chipDenoms.find((c) => c.chipDenomId === chip.chipDenomId)
                            ?.remainingQuantity
                        }}
                      </div>
                      <span v-else>-</span>
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
            </q-scroll-area>
          </q-tab-panel>
          <q-tab-panel name="plaqBalance" class="q-pa-none">
            <Information
              class="full-width q-mb-sm"
              content="Plaq transactions’larda player’ın  plaq in ve plaq out işlemlerine göre  plaq adeti hesaplanır."
            />
            <q-scroll-area style="height: 400px; width: 100% !important">
              <q-markup-table dense separator="cell" bordered square flat>
                <thead>
                  <tr>
                    <th class="text-left text-bold">{{ $t('name') }}</th>
                    <th
                      class="text-center text-bold bg-grey-2"
                      v-for="(item, index) in sortedTableFloatDenoms"
                      :key="index"
                    >
                      {{ item.chipValue }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(player, index) in transactionsReport.plaqueDrops"
                    :key="index"
                    @click="onRowClick(player, index)"
                    :class="
                      selectedTransaction?.playerId === player.playerId
                        ? 'bg-negative text-white'
                        : 'cursor-pointer'
                    "
                  >
                    <td class="text-left">{{ player.playerName }}</td>
                    <td
                      class="text-center playerTd"
                      style=""
                      v-for="(chip, key) in sortedTableFloatDenoms"
                      :key="key"
                    >
                      <div
                        class="text-bold playerChip"
                        v-if="
                          player?.plaqueDrops.map((c) => c.chipDenomId).includes(chip.chipDenomId)
                        "
                      >
                        {{
                          player?.plaqueDrops.find((c) => c.chipDenomId === chip.chipDenomId)
                            ?.quantity
                        }}
                      </div>
                      <span v-else>-</span>
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
            </q-scroll-area>
          </q-tab-panel>

          <q-tab-panel name="cashDrop" class="q-pa-none">
            <Information
              class="full-width q-mb-sm"
              content=" Playerlar’ın ne kadar cash drop yaptığı bilgisi verilir."
            />
            <q-scroll-area style="height: 400px; width: 100% !important">
              <q-markup-table dense separator="cell" bordered square flat>
                <thead>
                  <tr>
                    <th class="text-left text-bold">{{ $t('name') }}</th>
                    <th class="text-left text-bold bg-grey-2">
                      {{ $t('amount') }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(player, index) in transactionsReport.cashDrops"
                    :key="index"
                    @click="onRowClick(player, index)"
                    :class="
                      selectedTransaction?.playerId === player.playerId
                        ? 'bg-negative text-white'
                        : 'cursor-pointer'
                    "
                  >
                    <td class="text-left">{{ player.playerName }}</td>
                    <td class="text-left">
                      {{ priceAbsFormatted(player.cashAmount) }}
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
            </q-scroll-area>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from 'quasar'
import { onMounted, ref } from 'vue'
import { priceAbsFormatted } from 'src/helpers/helpers'
const props = defineProps({
  getTableReportFilterFields: {
    type: Object,
    default: () => ({}),
  },
  fetchTableReport: {
    type: Function,
    default: () => () => {},
  },
  tableFloatDenoms: {
    type: Array,
    default: () => [],
  },
  table: {
    type: Object,
    default: () => {},
  },
})
defineEmits([...useDialogPluginComponent.emits])
const tabs = ref([
  {
    key: 'chipBalance',
    name: 'chipBalance',
    label: 'Chip Balance',
    icon: 'o_casino',
    elPermission: '',
  },
  {
    key: 'plaqBalance',
    name: 'plaqBalance',
    label: 'Plaq Balance',
    icon: 'money',
    elPermission: '',
  },
  {
    key: 'cashDrop',
    name: 'cashDrop',
    label: 'Cash Drop',
    icon: 'money',
    elPermission: '',
  },
])
const currentTab = ref('chipBalance')
const transactionsReport = ref([])
const selectedTransaction = ref(null)
const selectedChipIndex = ref(-1)
const loading = ref(false)
const { dialogRef, onDialogHide } = useDialogPluginComponent()
const filterFields = ref({
  ...props.getTableReportFilterFields,
})

const floatDenoms = ref(props.tableFloatDenoms || [])
const sortedTableFloatDenoms = floatDenoms.value.sort((a, b) => a.chipValue - b.chipValue)

const onRowClick = (props, rowIndex) => {
  selectedTransaction.value = props
  selectedChipIndex.value = rowIndex
}

onMounted(async () => {
  loading.value = true
  await props
    .fetchTableReport(filterFields.value)
    .then((response) => {
      transactionsReport.value = response
    })
    .finally(() => {
      loading.value = false
    })
})
</script>

<style lang="scss">
.playerTd:has(.playerChip) {
  background-color: rgba(42, 54, 80, 0.1) !important;
}
</style>
