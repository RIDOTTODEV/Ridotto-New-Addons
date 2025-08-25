<script setup>
import { ref, onMounted } from 'vue'
import { date } from 'quasar'
import { useRouter } from 'vue-router'
import { formatPrice } from 'src/helpers/helpers'
import { usePlayerStore } from 'src/stores/player-store'
import { storeToRefs } from 'pinia'
const playerStore = usePlayerStore()
const { dateTimeFilterValues } = storeToRefs(playerStore)
const lastChipTransactions = ref([])
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
const router = useRouter()
const props = defineProps({
  playerId: {
    type: Number,
    required: true,
    default: () => 0,
  },
})
onMounted(async () => {
  await loadLastChipTransactions()
})
const loadLastChipTransactions = async () => {
  const data = await playerStore.fetchPlayerLastChipTransactions({
    playerId: props.playerId,
    ...dateTimeFilterValues.value,
  })
  lastChipTransactions.value = data.data || []
}
defineExpose({
  reload: loadLastChipTransactions,
})
const refTable = ref(null)
</script>

<template>
  <q-table
    dense
    class="no-box-shadow my-sticky-column-table compact-table"
    :rows="lastChipTransactions"
    :columns="columns"
    row-key="playerAccountId"
    hide-bottom
    data-cy="playerLastCashTransactionsTable"
    separator="cell"
    bordered
    ref="refTable"
  >
    <template v-slot:top>
      <div class="row full-width">
        <div class="col-8">
          <div class="text-subtitle2 q-pa-xs">
            {{ $t('chipTransactions') }}
          </div>
        </div>
        <div class="col-4 text-right">
          <q-btn
            v-el-perms="'Addon.CashlessOperations.Transaction.ViewMoreLastChipTransactions'"
            color="blue-grey-8"
            :label="$t('viewMore')"
            flat
            no-caps
            dense
            @click="
              router.push({
                name: 'chipTransactions',
                query: { playerId: playerId },
              })
            "
          />
          <q-icon
            v-el-perms="'Addon.CashlessOperations.Transaction.ReloadLastCageTransactions'"
            @click="loadLastChipTransactions"
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
            <span>{{ props.row.transactionType === 'Deposit' ? $t('received') : $t('paid') }}</span>
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
            <span style="display: inline-block; width: 65px" class="text-underline">
              {{ formatPrice(props.row.amount) }}
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
            {{ props.row.cashdeskName }}
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
            {{ props.row.note }}
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
