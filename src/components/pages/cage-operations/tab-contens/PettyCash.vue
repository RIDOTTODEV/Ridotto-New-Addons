<template>
  <q-card class="bg-transparent">
    <q-card-section class="q-pa-none q-mb-xs">
      <div class="row">
        <div class="col-md-8 col-sm-12 col-xs-12 flex content-center">
          <div class="text-subtitle1">
            {{ $t('pettyCash') }}
          </div>
        </div>
        <div class="col-md-4 col-sm-12 col-xs-12 text-right flex content-center justify-end">
          <q-btn
            :label="$t('create')"
            class="q-mr-sm"
            color="blue-grey-8"
            text-color="white"
            unelevated
            no-caps
            @click="createNewTransaction = true"
            :disable="createNewTransaction"
          />
        </div>
      </div>
    </q-card-section>

    <transition name="slide-fade" mode="out-in">
      <q-card-section class="q-pa-none bg-white" v-if="createNewTransaction">
        <q-form
          @submit="onSubmitPettyCashForm"
          class="col-12 row input-box q-pa-md"
          ref="form"
          style="max-width: 800px"
        >
          <div class="flex flex-wrap gap-3 py-2 px-2">
            <q-select
              v-model="formValues.transactionType"
              outlined
              dense
              :options="transactionTypes"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              :rules="[(val) => !!val || $t('requiredField')]"
              hide-bottom-space
              class="super-small w-full sm:w-auto md:min-w-[170px]"
              data-cy="transactionType"
              behavior="menu"
              :label="$t('transactionType')"
            />

            <q-select
              v-model="formValues.currencyId"
              outlined
              dense
              :options="currencies"
              option-value="id"
              :option-label="(val) => val.fullName + ' ' + val.name + ' ' + ' - ' + val.symbol"
              emit-value
              map-options
              :rules="[(val) => !!val || $t('requiredField')]"
              hide-bottom-space
              clearable
              class="super-small w-full sm:w-auto md:min-w-[170px]"
              data-cy="currencyId"
              behavior="menu"
              :label="$t('currency')"
            />

            <q-select-box
              :options="pettyCashCategories"
              option-value="id"
              option-label="code"
              v-model="formValues.pettyCashCategoryId"
              :label="$t('pettyCashCategory')"
              :rules="[(val) => !!val || $t('requiredField')]"
              class="w-full sm:w-auto md:min-w-[170px]"
              hide-bottom-space
            />

            <q-currency-input
              currency="USD"
              v-model="formValues.amount"
              outlined
              dense
              :rules="[(val) => !!val || $t('requiredField')]"
              :precision="2"
              data-cy="amount"
              :label="$t('amount')"
              hide-bottom-space
              class="w-full sm:w-auto md:min-w-[170px]"
            />

            <q-input
              v-model="formValues.description"
              outlined
              dense
              clearable
              class="super-small w-full sm:w-auto md:min-w-[170px]"
              hide-bottom-space
              data-cy="description"
              :label="$t('note')"
            />

            <div class="">
              <q-btn
                size="13px"
                color="negative"
                :label="$t('cancel')"
                icon="cancel"
                type="button"
                unelevated
                no-wrap
                no-caps
                class="q-mr-sm"
                @click="createNewTransaction = false"
              />
              <q-btn
                size="13px"
                color="primary"
                :label="$t('save')"
                icon="save"
                type="submit"
                unelevated
                data-cy="submit"
                no-caps
                no-wrap
              />
            </div>
          </div>
        </q-form>
      </q-card-section>
      <q-card-section class="q-pa-none" v-else>
        <SupaTable
          :columns="columns"
          :getDataFn="cashdeskStore.fetchPettyCashTransactions"
          :rowsPerPage="10"
          tableName="pettyCashColumns"
          :filterParams="filterFields"
          :slotNames="['body-cell-actions']"
          ref="pettyCashTable"
          :useCol12="false"
          :hideFields="{
            showVisibleColumns: true,
            showReloadButton: true,
            showScreenModeButton: true,
            showSearchInput: true,
            useCol12: false,
            switchSummaryCard: false,
          }"
          @switchSummaryCard="showSummaryCard = !showSummaryCard"
        >
          <template v-slot:headerFilterSlots>
            <div class="flex flex-col sm:flex-row justify-between w-full q-py-xs">
              <div class="flex sm:flex-row flex-col justify-start gap-2">
                <q-select-box
                  v-model="filterFields.cashdeskId"
                  :options="cashdesks"
                  option-value="id"
                  option-label="name"
                  :label="$t('cashdesk')"
                  :fetchFn="cashdeskStore.fetchCashdesks"
                />

                <q-select-box
                  v-model="filterFields.transactionType"
                  :options="transactionTypes"
                  option-value="value"
                  option-label="label"
                  :label="$t('transactionType')"
                />

                <q-select-box
                  :options="pettyCashCategories"
                  option-value="id"
                  option-label="code"
                  v-model="filterFields.pettyCashCategoryId"
                  :label="$t('pettyCashCategory')"
                />

                <q-select
                  :label="$t('currency')"
                  v-model="filterFields.currencyId"
                  outlined
                  dense
                  :options="getCurrenciesWithFlags"
                  option-value="id"
                  :option-label="(val) => val.fullName + ' ' + val.name + ' ' + ' - ' + val.symbol"
                  emit-value
                  map-options
                  clearable
                  class="super-small md:min-w-[170px]"
                  hide-bottom-space
                  behavior="menu"
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
                    <div class="text-subtitle2 q-mt-xs">
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

                <q-input
                  v-model="filterFields.description"
                  :label="$t('description')"
                  class="super-small"
                  dense
                  outlined
                  clearable
                />

                <date-time-picker
                  @selected-date="
                    (val) => {
                      filterFields = {
                        ...filterFields,
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
                  class=""
                  @click="pettyCashTable.fetchData()"
                />

                <q-btn
                  type="button"
                  :label="$t('excelExport')"
                  icon="o_file_download"
                  color="green-9"
                  size="13px"
                  unelevated
                  no-caps
                  class=""
                  @click="
                    reportStore.getPettyCashTransactions({
                      ...filterFields,
                      exportFileType: 'Excel',
                    })
                  "
                />
              </div>
            </div>
          </template>
          <template v-slot:body-cell-actions="{ props }">
            <q-td key="actions" align="center">
              <!-- <q-btn
            unelevated
            dense
            color="grey-2"
            text-color="dark"
            no-caps
            size="12px"
            icon="fa-regular fa-pen-to-square"
            class="q-mr-md"
            @click="editForm(props.row)"
            v-el-perms="'Addon.Definitions.PettyCashCategory.Update'"
            data-cy="editData"
          /> -->
              <q-btn
                unelevated
                dense
                color="grey-2"
                text-color="negative"
                size="12px"
                icon="fa-regular fa-trash-can"
                class="q-mr-sm"
                @click="deletePettyCashTransaction(props.row)"
                v-el-perms="'Addon.Definitions.PettyCashCategory.Delete'"
                data-cy="deleteData"
              />
            </q-td>
          </template>
        </SupaTable>
      </q-card-section>
    </transition>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { i18n } from 'src/boot/i18n'
import { useCashdeskStore } from 'src/stores/cashdesk-store'
import { useOperationsStore } from 'src/stores/operations-store'
import { useCurrencyStore } from 'src/stores/currency-store'
import { useReportStore } from 'src/stores/report-store'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
const $q = useQuasar()
const operationsStore = useOperationsStore()
const { pettyCashCategories } = storeToRefs(operationsStore)
const cashdeskStore = useCashdeskStore()
const { getSelectedCashDeskId, cashdesks } = storeToRefs(cashdeskStore)
const currencyStore = useCurrencyStore()
const { currencies, getCurrenciesWithFlags } = storeToRefs(currencyStore)
const reportStore = useReportStore()
const filterFields = ref({
  cashdeskId: getSelectedCashDeskId.value,
  transactionType: null,
  currencyId: null,
  pettyCashCategoryId: null,
  description: null,
})
const pettyCashTable = ref(null)
const createNewTransaction = ref(false)

const columns = ref([
  {
    name: 'id',
    label: 'ID',
    field: 'id',
  },
  {
    name: 'createdAt',
    label: 'Created At',
    field: 'createdAt',
    fieldType: 'date',
  },
  {
    name: 'cashdeskName',
    label: 'Cashdesk Name',
    field: 'cashdeskName',
  },
  {
    name: 'transactionType',
    label: 'Transaction Type',
    field: 'transactionType',
    customFormat: (row) => {
      return row === 'Deposit' ? 'Received' : 'Paid'
    },
  },
  {
    name: 'pettyCashCategory',
    label: 'Petty Cash Category',
    field: 'pettyCashCategoryCode',
    format: (val, _row) => {
      return val + ' - ' + _row?.pettyCashCategoryDescription
    },
  },
  {
    name: 'amount',
    label: 'Amount',
    fieldType: 'price',
    field: 'amount',
  },
  {
    name: 'currencyName',
    label: 'Currency Name',
    field: 'currencyName',
  },
  {
    name: 'defaultCurrencyAmount',
    label: 'Default Currency Amount',
    fieldType: 'price',
    field: 'defaultCurrencyAmount',
  },
  {
    name: 'defaultCurrencyName',
    label: 'Default Currency Name',
    field: 'defaultCurrencyName',
  },
  {
    name: 'isDeleted',
    label: 'Is Deleted',
    fieldType: 'boolean',
    field: 'isDeleted',
    visible: false,
  },
  {
    name: 'description',
    label: 'Description',
    field: 'description',
  },
  {
    name: 'actions',
    label: 'Actions',
  },
])
const formValues = ref({
  cashdeskId: getSelectedCashDeskId.value,
  pettyCashCategoryId: null,
  description: null,
  transactionType: 'Deposit',
  amount: null,
  currencyId: null,
})
const transactionTypes = ref([
  {
    value: 'Deposit',
    label: 'Received',
  },
  {
    value: 'Withdrawal',
    label: 'Paid',
  },
])
onMounted(async () => {
  if (!pettyCashCategories.value.length) {
    await operationsStore.fetchPettyCashCategoryList()
  }
})

const onSubmitPettyCashForm = async () => {
  const response = await cashdeskStore.createPettyCashTransaction(formValues.value)
  if (response.status === 200) {
    $q.notify({
      message: 'Transaction created successfully',
      type: 'positive',
    })
    createNewTransaction.value = false
    formValues.value = {
      ...formValues.value,
      currencyId: null,
      amount: null,
      description: null,
      pettyCashCategoryId: null,
      transactionType: 'Deposit',
    }
  } else {
    $q.notify({
      message: 'Transaction creation failed',
      type: 'negative',
    })
    formValues.value = {
      ...formValues.value,
      currencyId: null,
      amount: null,
      description: null,
      pettyCashCategoryId: null,
      transactionType: 'Deposit',
    }
  }
}

const deletePettyCashTransaction = (props) => {
  $q.dialog({
    title: i18n.global.t('delete'),
    message: i18n.global.t('deleteMessage', { name: i18n.global.t('pettyCashTransactions') }),
    persistent: false,
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
    await cashdeskStore.deletePettyCashTransaction({ id: props.id })
    pettyCashTable.value.requestServerInteraction()
  })
}
</script>

<style scoped></style>
