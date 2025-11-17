<template>
  <q-page class="q-pa-md">
    <q-card class="bg-transparent" flat square>
      <q-card-section class="q-pa-none flex justify-end q-mb-sm">
        <q-btn
          :label="$t('create')"
          class="q-mr-sm"
          color="blue-grey-8"
          text-color="white"
          unelevated
          no-caps
          @click="createNewTransaction = true"
          v-el-perms="'Addon.Slot.PlayersInOut.Create'"
        />
      </q-card-section>
    </q-card>
    <SupaTable
      :columns="columns"
      :getDataFn="slotStore.fetchPlayersInOut"
      ref="playersInOutTable"
      tableName="playersInOutColumns"
      :filterParams="filterValues"
      :slotNames="['body-cell-actions']"
      dataKey="data"
    >
      <template v-slot:headerFilterSlots>
        <div class="flex sm:flex-row flex-col justify-start gap-2 w-full sm:w-auto">
          <q-select
            v-model="filterValues.transactionCode"
            :placeholder="$t('selectTransactionCode')"
            :options="transactionCodes"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            :rules="[(val) => !!val || $t('requiredField')]"
            hide-bottom-space
            class="super-small fixed-field-width"
            behavior="menu"
            outlined
            dense
          />
          <q-input
            v-model="filterValues.floorNo"
            :placeholder="$t('floorNo')"
            outlined
            dense
            class="super-small w-full sm:w-auto"
          />
          <SearchPlayerInput
            v-model="filterValues.playerId"
            :placeholder="$t('searchPlayer')"
            @onSelectPlayer="onSelectPlayer"
            :optionLabel="'value'"
            :displayedValue="filterValues.playerName"
            @onClear="onClearPlayer"
            class="fixed-field-width"
          />
          <date-time-picker
            @selected-date="
              (val) => {
                filterValues = {
                  ...filterValues,
                  ...val,
                }
              }
            "
          />
          <q-btn
            type="button"
            :label="$t('filter')"
            icon="tune"
            color="grey-2"
            text-color="dark"
            size="13px"
            unelevated
            no-caps
            @click="playersInOutTable.fetchData()"
          />
        </div>
      </template>

      <template v-slot:body-cell-actions="{ props }">
        <q-td :props="props">
          <q-btn
            unelevated
            dense
            color="grey-2"
            text-color="negative"
            size="12px"
            icon="fa-regular fa-trash-can"
            class="q-mr-sm"
            @click="deleteForm(props.row)"
            v-el-perms="'Addon.Slot.PlayersInOut.Delete'"
            data-cy="deleteData"
          />
        </q-td>
      </template>
    </SupaTable>

    <q-dialog
      v-model="createNewTransaction"
      transition-show="slide-up"
      transition-hide="slide-down"
      backdrop-filter="brightness(40%)"
    >
      <q-card class="" style="min-width: 700px">
        <q-bar style="height: 50px" class="app-cart-grey q-card--bordered">
          <div class="text-subtitle2">
            <q-icon name="o_settings" class="q-mr-sm" />
            {{ $t('createPlayerInOut') }}
          </div>
          <q-space />
          <q-btn dense flat icon="close" @click="onCloseForm">
            <q-tooltip class="text-subtitle1 bg-blue-grey-8">
              {{ $t('close') }}
            </q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <q-form @submit="onSubmitForm" ref="form" class="row">
            <div class="col-6 q-pa-sm">
              <SearchPlayerInput
                v-model="formValues.playerId"
                :placeholder="$t('searchPlayer')"
                @onSelectPlayer="onSelectFormPlayer"
                :optionLabel="'value'"
                :displayedValue="formValues.PlayerFullName"
                @onClear="onClearFormPlayer"
                class="full-width"
              />
            </div>
            <div class="col-6 q-pa-sm">
              <q-select
                v-model="formValues.currencyId"
                outlined
                dense
                :options="getCurrenciesWithFlags"
                option-value="id"
                :option-label="(val) => val.fullName + ' ' + val.name + ' ' + ' - ' + val.symbol"
                emit-value
                map-options
                :rules="[(val) => !!val || $t('requiredField')]"
                clearable
                class="super-small"
                hide-bottom-space
                behavior="menu"
                @update:model-value="onChangeCurrency"
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>
                        <q-img
                          :src="scope.opt.flag"
                          fit="contain"
                          width="20px"
                          height="20px"
                          class="q-mr-sm"
                        />
                        {{ scope.opt.fullName }} - {{ scope.opt.symbol }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
                <template v-slot:selected-item="scope">
                  <div class="text-subtitle2">
                    <q-img
                      :src="scope.opt.flag"
                      fit="contain"
                      width="20px"
                      height="20px"
                      class="q-mr-sm"
                    />
                    {{ scope.opt.fullName }} - {{ scope.opt.symbol }}
                  </div>
                </template>
              </q-select>
            </div>
            <div class="col-6 q-pa-sm">
              <q-select
                v-model="formValues.transactionCode"
                :placeholder="$t('selectTransactionCode')"
                :options="transactionCodes"
                option-value="value"
                option-label="label"
                emit-value
                map-options
                :rules="[(val) => !!val || $t('requiredField')]"
                hide-bottom-space
                class="super-small"
                behavior="menu"
                outlined
                dense
              />
            </div>
            <div class="col-6 q-pa-sm">
              <q-select
                v-model="formValues.transactionType"
                :placeholder="$t('selectTransactionType')"
                :options="transactionTypes"
                option-value="value"
                option-label="label"
                emit-value
                map-options
                :rules="[(val) => !!val || $t('requiredField')]"
                hide-bottom-space
                class="super-small"
                behavior="menu"
                outlined
                dense
              />
            </div>
            <div class="col-6 q-pa-sm">
              <q-currency-input
                v-model="formValues.amount"
                :placeholder="$t('amount')"
                :currency="'USD'"
                :rules="[(val) => !!val || $t('requiredField')]"
              />
            </div>
            <div class="col-6 q-pa-sm">
              <q-input
                v-model="formValues.floorNo"
                :placeholder="$t('floorNo')"
                outlined
                dense
                class="super-small"
              />
            </div>
            <div class="col-12 text-right q-pa-sm">
              <q-btn
                type="button"
                :label="$t('cancel')"
                color="negative"
                icon="cancel"
                unelevated
                no-caps
                no-wrap
                class="q-mr-sm"
                flat=""
                @click="onCloseForm"
              />
              <q-btn
                type="submit"
                :label="$t('submit')"
                color="green-8"
                unelevated
                no-caps
                no-wrap
                icon="save"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'
import { useSlotStore } from 'src/stores/slot-store'
import { useCurrencyStore } from 'src/stores/currency-store'
import { useAuthStore } from 'src/stores/auth-store'
import { i18n } from 'src/boot/i18n'
import { Loading } from 'quasar'
const $q = useQuasar()
const currencyStore = useCurrencyStore()
const { getCurrenciesWithFlags } = storeToRefs(currencyStore)
const slotStore = useSlotStore()
const authStore = useAuthStore()
const { getDefaultGamingDateId } = storeToRefs(authStore)
const filterValues = ref({
  playerId: null,
  playerName: null,
  transactionCode: 'BillAcceptor',
  floorNo: '',
  gamingDateId: getDefaultGamingDateId.value,
  balanceCurrencyId: authStore.getDefaultCurrencyId,
})
const onSelectPlayer = (val) => {
  if (!val) {
    filterValues.value.playerId = null
    filterValues.value.playerName = null
    return
  }
  filterValues.value.playerId = val.id
  filterValues.value.playerName = val.value
}
const onClearPlayer = () => {
  filterValues.value.playerId = null
  filterValues.value.playerName = null
}
const playersInOutTable = ref(null)

const columns = ref([
  {
    field: 'createdAt',
    label: 'Created At',
    fieldType: 'date',
  },
  {
    field: 'playerId',
    label: 'Player Id',
  },
  {
    field: 'playerFullName',
    label: 'Player Name',
  },
  {
    field: 'floorNo',
    label: 'Floor No',
  },
  {
    field: 'currencyName',
    label: 'Currency',
  },
  {
    field: 'amount',
    label: 'Amount',
    fieldType: 'priceAbs',
  },
  {
    field: 'convertedAmount',
    label: 'Converted Amount',
    fieldType: 'priceAbs',
  },
  {
    field: 'transactionCode',
    label: 'Transaction Code',
  },
  {
    field: 'transactionType',
    label: 'Transaction Type',
  },
  {
    field: 'isDeleted',
    label: 'Deleted',
    fieldType: 'boolean',
  },
  {
    field: 'createdByName',
    label: 'Created By',
  },
  {
    field: 'updatedByName',
    label: 'Updated By',
  },
  {
    field: 'updatedAt',
    label: 'Updated At',
    fieldType: 'date',
  },
  {
    field: 'actions',
  },
])

const createNewTransaction = ref(false)

const formValues = ref({
  playerId: null,
  PlayerFullName: null,
  floorNo: null,
  currencyId: null,
  amount: null,
  transactionCode: 'BillAcceptor',
  transactionType: 'Deposit',
})

const transactionCodes = ref([
  {
    value: 'BillAcceptor',
    label: 'Bill Acceptor',
  },
  {
    value: 'Slip',
    label: 'Slip',
  },
])
const transactionTypes = ref([
  {
    value: 'Deposit',
    label: 'Deposit',
  },
  {
    value: 'Withdrawal',
    label: 'Withdrawal',
  },
])

const onSubmitForm = async () => {
  formValues.value.gamingDateId = getDefaultGamingDateId.value
  const response = await slotStore.createPlayersInOut(formValues.value)
  if (response.status === 200) {
    $q.notify({
      message: 'Transaction created successfully',
      type: 'positive',
    })
    createNewTransaction.value = false
    formValues.value = {
      ...formValues.value,
      currencyId: null,
      currencyName: null,
    }
    playersInOutTable.value.fetchData()
  } else {
    $q.notify({
      message: 'Transaction creation failed',
      type: 'negative',
    })
  }
}
const onSelectFormPlayer = (val) => {
  formValues.value.playerId = val.id
  formValues.value.PlayerFullName = val.value
}
const onClearFormPlayer = () => {
  formValues.value.playerId = null
  formValues.value.PlayerFullName = null
}
const onChangeCurrency = (val) => {
  if (!val) {
    formValues.value.currencyName = null
    return
  }
  const currency = getCurrenciesWithFlags.value.find((currency) => currency.id === val)
  formValues.value.currencyName = currency.name
}
const onCloseForm = () => {
  createNewTransaction.value = false
  formValues.value = {
    playerId: null,
    PlayerFullName: null,
    floorNo: null,
    currencyId: null,
    currencyName: null,
    amount: null,
    transactionCode: 'BillAcceptor',
    transactionType: 'Deposit',
  }
}

const deleteForm = (row) => {
  $q.dialog({
    title: i18n.global.t('delete'),
    message: i18n.global.t('deleteMessage', { name: i18n.global.t('title') }),
    persistent: true,
    focus: 'cancel',
    ok: {
      flat: true,
      color: 'negative',
      label: i18n.global.t('delete'),
      class: 'text-capitalize',
      dataCy: 'delete',
    },
    cancel: {
      flat: true,
      color: 'primary',
      label: i18n.global.t('cancel'),
      class: 'text-capitalize',
    },
  }).onOk(async () => {
    Loading.show()
    await slotStore.deletePlayersInOut({ id: row.id })
    Loading.hide()
    playersInOutTable.value.requestServerInteraction()
  })
}
</script>

<style scoped></style>
