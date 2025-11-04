<script setup>
import { ref, onMounted, watch, inject } from 'vue'
import { date } from 'quasar'
import { formatPrice } from 'src/helpers/helpers'
import { usePlayerStore } from 'src/stores/player-store'

const playerStore = usePlayerStore()
const bus = inject('bus')
const lastCageTransactions = ref([])
const columns = ref([
  {
    name: 'createdAt',
    align: 'left',
    label: 'Created At',
    field: 'createdAt',
    sortable: false,
    format: (val) => date.formatDate(val, 'DD.MM.YYYY HH:mm:ss'),
    visible: true,
  },
  {
    name: 'transactionType',
    label: 'Transaction Type',
    align: 'left',
    field: 'transactionType',
    sortable: false,
    visible: true,
  },
  {
    name: 'transType',
    required: false,
    label: 'Trans Type',
    align: 'center',
    field: 'transType',
    sortable: false,
    visible: true,
  },
  {
    name: 'transactionCode',
    label: 'Transaction Code',
    align: 'left',
    field: 'transactionCode',
    sortable: false,
    visible: true,
  },
  {
    name: 'includeInBalance',
    label: 'Inc/In Balance',
    align: 'left',
    field: 'includeInBalance',
    sortable: false,
    visible: true,
  },

  {
    name: 'amount',
    label: 'Amount',
    align: 'center',
    field: 'amount',
    sortable: false,
    format: (val) => val.toFixed(2),
    visible: true,
  },
  {
    name: 'detail',
    label: 'Station',
    align: 'left',
    field: 'cashdeskName',
    sortable: false,
    visible: true,
  },
])
const props = defineProps({
  playerId: {
    type: Number,
    required: true,
    default: () => null,
  },
})
onMounted(async () => {
  await loadLastCageTransactions()
})
const loadLastCageTransactions = async () => {
  const data = await playerStore.fetchPlayerLastCageTransactions({
    playerId: props.playerId,
    maxResultCount: 20,
  })
  lastCageTransactions.value = data
}

defineExpose({
  reload: loadLastCageTransactions,
})
watch(
  () => playerStore.dateTimeFilterValues,
  (newVal) => {
    if (Object.keys(newVal).length > 0) {
      loadLastCageTransactions()
    }
  },
)
bus.on('reloadLastCageTransactions', loadLastCageTransactions)
const refTable = ref(null)
</script>

<template>
  <q-table
    dense
    class="no-box-shadow my-sticky-column-table compact-table"
    :rows="lastCageTransactions"
    :columns="columns"
    row-key="playerAccountId"
    hide-bottom
    data-cy="playerLastCashTransactionsTable"
    separator="cell"
    bordered
    ref="refTable"
    virtual-scroll
    style="max-height: 300px !important"
    :rows-per-page-options="[0]"
    :virtual-scroll-slice-size="20"
  >
    <template v-slot:top>
      <div class="row full-width">
        <div class="col-8">
          <div class="text-subtitle2 q-pa-xs">
            {{ $t('cageTransactions') }}
          </div>
        </div>
        <div class="col-4 text-right">
          <q-btn
            v-el-perms="'Addon.CashlessOperations.Transaction.ViewMoreLastCageTransactions'"
            color="blue-grey-8"
            :label="$t('viewMore')"
            flat
            no-caps
            dense
            :to="{
              name: 'cageOperations',
              query: {
                playerId: playerId,
                tab: 'cageTransactions',
              },
            }"
          />
          <q-icon
            v-el-perms="'Addon.CashlessOperations.Transaction.ReloadLastCageTransactions'"
            @click="loadLastCageTransactions"
            name="cached"
            size="18px"
            class="cursor-pointer my-icon"
            color="blue-grey-8"
          />
        </div>
      </div>
    </template>
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="createdAt" :props="props" class="app-cart-grey compact-cell">
          <div class="text-caption compact-text">
            {{ props.cols[0].value }}
          </div>
        </q-td>

        <q-td
          key="transactionType"
          :props="props"
          :class="
            props.row.transactionType === 'Deposit'
              ? 'bg-deposit compact-cell'
              : props.row.transactionType === 'Withdrawal'
                ? 'bg-withdrawal compact-cell'
                : 'compact-cell'
          "
        >
          <div class="text-caption flex justify-start items-center compact-text">
            <q-icon
              class="q-mr-xs"
              size="14px"
              :name="props.row.transactionType === 'Deposit' ? 'add' : 'remove'"
              :color="props.row.transactionType === 'Deposit' ? 'positive' : 'negative'"
            />
            {{ props.row.transactionType === 'Deposit' ? $t('received') : $t('paid') }}
          </div>
        </q-td>
        <q-td
          key="transType"
          :props="props"
          :class="
            props.row.transactionType === 'Deposit'
              ? 'bg-deposit compact-cell'
              : props.row.transactionType === 'Withdrawal'
                ? 'bg-withdrawal compact-cell'
                : 'compact-cell'
          "
        >
          <div class="text-caption compact-text">
            {{ props.row.transType }}
          </div>
        </q-td>
        <q-td
          key="transactionCode"
          :props="props"
          :class="
            props.row.transactionType === 'Deposit'
              ? 'bg-deposit compact-cell'
              : props.row.transactionType === 'Withdrawal'
                ? 'bg-withdrawal compact-cell'
                : 'compact-cell'
          "
        >
          <div class="text-caption flex justify-start items-center compact-text">
            {{ props.row.transactionCode }}
          </div>
        </q-td>
        <q-td
          key="includeInBalance"
          :props="props"
          :class="
            props.row.includeInBalance ? 'bg-deposit compact-cell' : 'bg-withdrawal compact-cell'
          "
        >
          <div class="text-caption compact-text">
            {{ props.row.includeInBalance ? $t('yes') : $t('no') }}
          </div>
        </q-td>
        <q-td
          key="amount"
          :props="props"
          :class="
            props.row.transactionType === 'Deposit'
              ? 'bg-deposit compact-cell'
              : props.row.transactionType === 'Withdrawal'
                ? 'bg-withdrawal compact-cell'
                : 'compact-cell'
          "
        >
          <div class="text-caption compact-text">
            {{ formatPrice(props.row.amount) }}
            {{ props.row.currencyName }}
          </div>
        </q-td>
        <q-td
          key="detail"
          :props="props"
          :class="
            props.row.transactionType === 'Deposit'
              ? 'bg-deposit compact-cell'
              : props.row.transactionType === 'Withdrawal'
                ? 'bg-withdrawal compact-cell'
                : 'compact-cell'
          "
        >
          <div class="text-caption compact-text">
            {{ props.row.cashdeskName }}
          </div>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<style lang="sass">
.compact-table
  .q-table__top
    padding: 4px 8px
  .q-table__bottom
    padding: 4px 8px
  max-width: 100%
  width: auto

.compact-cell
  padding: 2px 4px !important
  font-size: 13px

.compact-text
  font-size: 13px !important
  line-height: 1.3

.my-sticky-column-table
  thead tr:first-child th:first-child
    background-color: $grey-2
    padding: 4px 6px

  td:first-child
    background-color: $grey-2

  th:first-child,
  td:first-child
    position: sticky
    left: 0
    z-index: 1

  th
    padding: 4px 6px
    font-size: 14px
    font-weight: 500
</style>
