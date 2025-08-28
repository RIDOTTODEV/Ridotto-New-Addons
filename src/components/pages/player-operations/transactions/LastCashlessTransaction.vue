<script setup>
import { ref, onMounted, inject } from 'vue'
import { date } from 'quasar'
import { formatPrice } from 'src/helpers/helpers'
import { usePlayerStore } from 'src/stores/player-store'

const playerStore = usePlayerStore()
const lastCashlessTransactions = ref([])
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
    align: 'center',
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
    required: false,
    label: 'Station',
    align: 'center',
    field: 'detail',
    sortable: false,
    visible: true,
  },

  {
    name: 'note',
    required: false,
    label: 'Note',
    align: 'center',
    field: 'note',
    sortable: false,
    visible: true,
  },
])
const bus = inject('bus')
const props = defineProps({
  playerId: {
    type: Number,
    required: true,
    default: () => null,
  },
})
onMounted(async () => {
  await loadLastCashlessTransactions()
})
const loadLastCashlessTransactions = async () => {
  const data = await playerStore.fetchPlayerLastCashlessTransactions({
    playerId: props.playerId,
  })
  lastCashlessTransactions.value = data
}
const getDetailFormatter = (detail) => {
  let detailParsed = JSON.parse(detail)
  switch (true) {
    case detailParsed !== null && detailParsed.CashdeskName !== null:
      return detailParsed.CashdeskName
    case detailParsed !== null && detailParsed.FloorNo !== 0:
      return detailParsed.FloorNo
    default:
      return ''
  }
}
bus.on('reloadPlayerCashless', loadLastCashlessTransactions)
</script>

<template>
  <q-table
    dense
    class="no-box-shadow my-sticky-column-table compact-table"
    :rows="lastCashlessTransactions"
    :columns="columns"
    row-key="playerAccountId"
    hide-bottom
    data-cy="playerLastTransactionsTable"
    separator="cell"
    bordered
  >
    <template v-slot:top>
      <div class="text-subtitle2 full-width flex justify-between content-center items-center">
        {{ $t('cashless') }}
        <q-icon
          v-el-perms="'Addon.CashlessOperations.Transaction.ReloadLastTransactions'"
          @click="loadLastCashlessTransactions"
          name="cached"
          size="18px"
          class="cursor-pointer my-icon"
          color="blue-grey-8"
        />
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
              : 'bg-withdrawal compact-cell'
          "
        >
          <div class="text-caption flex justify-start items-center no-wrap compact-text">
            <q-icon
              class="q-mr-xs"
              size="14px"
              :name="props.row.transactionType === 'Deposit' ? 'add' : 'remove'"
              :color="props.row.transactionType === 'Deposit' ? 'positive' : 'negative'"
            />
            <span>{{
              props.row.transactionType === 'Deposit' ? $t('deposit') : $t('withdrawal')
            }}</span>
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
          key="amount"
          :props="props"
          :class="
            props.row.transactionType === 'Deposit'
              ? 'bg-deposit compact-cell'
              : 'bg-withdrawal compact-cell'
          "
        >
          <span class="compact-text">
            <span style="display: inline-block; font-size: 10px; width: 45px">
              {{ formatPrice(props.row.oldBalance) }}
            </span>
            <span
              v-if="props.row.transactionType === 'Withdrawal'"
              style="display: inline-block; width: 8px; margin-left: 10px"
              >-</span
            >
            <span v-else style="display: inline-block; width: 8px; margin-left: 10px">+</span>
            <span style="display: inline-block; width: 65px" class="text-underline">
              {{ formatPrice(props.row.amount) }}
            </span>
            <span style="display: inline-block; width: 70px" class="text-caption">
              = {{ formatPrice(props.row.newBalance) }}
            </span>
            <span class="text-caption q-ml-xs q-mr-xs">
              {{ props.row.currencyName }}
            </span>
          </span>
        </q-td>
        <q-td
          key="detail"
          :props="props"
          :class="
            props.row.transactionType === 'Deposit'
              ? 'bg-deposit compact-cell'
              : 'bg-withdrawal compact-cell'
          "
        >
          <div class="text-caption compact-text">
            {{ getDetailFormatter(props.row.detail) }}
          </div>
        </q-td>

        <q-td
          key="note"
          :props="props"
          :class="
            props.row.transactionType === 'Deposit'
              ? 'bg-deposit compact-cell'
              : 'bg-withdrawal compact-cell'
          "
        >
          <div class="text-caption note-cell compact-text">
            {{ JSON.parse(props.row.detail)?.Notes }}
          </div>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<style lang="sass">
.text-underline
  text-decoration: underline
  font-size: 12px
  font-weight: 600

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

.note-cell
  word-break: break-word
  white-space: pre-line
  max-width: 150px
  min-width: 80px
  overflow: hidden
  text-overflow: ellipsis
  position: relative

  &:hover
    white-space: normal
    overflow: visible
    background-color: $grey-1
    z-index: 10
    box-shadow: 0 2px 8px rgba(0,0,0,0.1)
    padding: 8px !important
    border-radius: 4px
</style>
