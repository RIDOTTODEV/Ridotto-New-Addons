<template>
  <q-page class="q-pa-md">
    <q-card class="no-box-shadow q-mb-md bg-transparent">
      <q-card-section class="q-pa-none">
        <div class="row">
          <div class="col-3">
            <fieldset class="fieldset">
              <legend class="text-subtitle2">{{ $t('Filters') }}</legend>
              <div class="row flex flex-column q-gutter-y-md">
                <div class="col-12">
                  <q-select-box
                    :options="groupeCodes"
                    option-value="id"
                    option-label="code"
                    v-model="filterFields.groupCodeId"
                    :label="$t('Groupe Code')"
                    :slotNames="['after']"
                    bg-color="white"
                  >
                    <template v-slot:after="props">
                      <q-btn
                        icon="fas fa-edit"
                        v-bind="{ props }"
                        @click="manageGroupCode()"
                        dense
                        flat
                        size="12px"
                        color="primary"
                      />
                    </template>
                  </q-select-box>
                </div>
                <div class="col-12">
                  <q-select-box
                    :options="visitorCategories"
                    option-value="id"
                    option-label="name"
                    v-model="filterFields.playerCategoryId"
                    :label="$t('Player Category')"
                    bg-color="white"
                    @update:model-value="
                      (val) => {
                        filterFields.playerCategoryId = val
                        filterFields.junketId = val
                      }
                    "
                  >
                  </q-select-box>
                </div>
                <div class="col-12">
                  <q-btn
                    type="button"
                    :label="$t('filter')"
                    icon="tune"
                    color="grey-1"
                    text-color="dark"
                    size="13px"
                    unelevated
                    no-caps
                    @click="onSubmitFilter"
                  />
                </div>
              </div>
            </fieldset>
          </div>
          <div class="col-4">
            <fieldset class="fieldset row">
              <legend class="text-subtitle2">
                {{ $t('Player Photo') }}
              </legend>
              <div class="masonry-grid">
                <q-img
                  :src="$playerPhotoUrl + selectedRow.playerId"
                  class="player-photo"
                  fit="cover"
                  error-src="/assets/no-photo.png"
                  v-if="selectedRow"
                />
              </div>
            </fieldset>
          </div>
          <div class="col-3">
            <fieldset class="fieldset">
              <legend class="text-subtitle2">{{ $t('Calculation') }}</legend>
              <div class="row flex flex-column q-gutter-y-md">
                <div class="col-12 text-center">
                  <q-btn
                    :label="$t('reCalculateForGroupCode')"
                    unelevated
                    padding="xs"
                    color="grey-3"
                    text-color="dark"
                    icon="o_functions"
                    no-wrap
                    no-caps
                    @click="onCliclCalculationStatusUpdate"
                    class="full-width"
                  />
                </div>
                <div class="col-12 text-center">
                  <q-btn
                    :label="$t('reCalculateForJunket')"
                    unelevated
                    padding="xs"
                    color="grey-3"
                    text-color="dark"
                    icon="o_calculate"
                    no-wrap
                    no-caps
                    @click="onCliclJunketCalculationStatusUpdate"
                    class="full-width"
                  />
                </div>
                <div class="col-12 text-center">
                  <q-btn
                    :label="$t('closeGroupCode')"
                    unelevated
                    padding="xs"
                    color="grey-3"
                    text-color="dark"
                    icon="o_close"
                    no-wrap
                    no-caps
                    @click="onClickCloseGroupCode"
                    class="full-width"
                  />
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <SupaTable
          :columns="columns"
          :getDataFn="operationsStore.fetchJunketOperation"
          :filterParams="filterFields"
          :slotNames="['body-cell-actions']"
          ref="junketOperationRefTable"
          tableName="junketOperationColumns"
        >
          <template v-slot:body-cell-actions="{ props }">
            <q-td key="Action" align="center">
              <q-btn
                icon="o_info"
                size="12px"
                color="grey-2"
                text-color="dark"
                no-caps
                unelevated
                flat
              >
                <q-tooltip class="q-card bg-white">
                  <q-markup-table spellcheck="cell" dense square bordered>
                    <thead>
                      <tr>
                        <th class="text-center bg-grey-2">Expense</th>
                        <th class="text-center bg-grey-2">Amount</th>
                        <th class="text-center bg-grey-2">Is Deleted</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="expense in props.row.expenses" :key="expense.id">
                        <td class="text-center">{{ expense.expenseTypeName }}</td>
                        <td class="text-center">
                          {{ formatPrice(expense.amountInCasinoCurrency) }}
                        </td>
                        <td class="text-center">{{ expense.isDeleted ? 'Yes' : 'No' }}</td>
                      </tr>
                    </tbody>
                  </q-markup-table>
                </q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </SupaTable>
      </q-card-section>
      <q-card-section class="q-pa-none row q-mt-md">
        <div class="col-7 q-pa-xs">
          <div class="text-subtitle2">{{ $t('Payments') }}</div>
          <SupaTable
            :columns="paymentColumns"
            :getDataFn="operationsStore.getPayments"
            :filterParams="filterFields"
            :slotNames="['body-cell-actions', 'body-cell-status']"
            ref="paymentTableRef"
            tableName="paymentsColumns"
            :hideTopBar="true"
            :hideBottom="true"
          >
          </SupaTable>
        </div>
        <div class="col-5 q-pa-xs">
          <fieldset class="fieldset">
            <legend class="text-subtitle2">{{ $t('Create Payment') }}</legend>

            <q-form @submit="onSubmitPaymentForm" class="row">
              <div class="col-6 q-pa-xs">
                <q-select
                  v-model="paymentFormValues.currencyId"
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
                  bg-color="white"
                  :label="$t('currency')"
                >
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label>
                          <q-img
                            :src="scope.opt.flag"
                            fit="contain"
                            width="25px"
                            height="25px"
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
                        width="25px"
                        height="25px"
                        class="q-mr-sm"
                      />
                      {{ scope.opt.fullName }} - {{ scope.opt.symbol }}
                    </div>
                  </template>
                </q-select>
              </div>
              <div class="col-6 q-pa-xs">
                <q-currency-input
                  currency="USD"
                  v-model="paymentFormValues.amount"
                  outlined
                  dense
                  :rules="[(val) => !!val || $t('requiredField')]"
                  bg-color="white"
                  :label="$t('amount')"
                />
              </div>
              <div class="col-12 q-pa-xs">
                <q-input
                  v-model="paymentFormValues.note"
                  outlined
                  dense
                  clearable
                  bg-color="white"
                  type="textarea"
                  autogrow
                  :rows="5"
                  :label="$t('note')"
                />
              </div>
              <div class="col-8 q-pa-xs flex content-center items-center">
                <div class="text-subtitle2 q-ml-xs">
                  {{ $t('Payment Total') }}: {{ priceAbsFormatted(paymentTotal) }}
                </div>
              </div>
              <div class="col-4 q-pa-xs text-right">
                <q-btn
                  class="q-ml-sm"
                  type="submit"
                  :label="$t('save')"
                  icon="save"
                  color="primary"
                  unelevated
                />
              </div>
            </q-form>
          </fieldset>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, defineAsyncComponent, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
import { i18n } from 'src/boot/i18n'
import { useOperationsStore } from 'src/stores/operations-store'
import { useGuestManagementStore } from 'src/stores/guest-management-store'
import { useCurrencyStore } from 'src/stores/currency-store'
import { computedAsync } from '@vueuse/core'
import { priceAbsFormatted } from 'src/helpers/helpers'
const currencyStore = useCurrencyStore()
const { getCurrenciesWithFlags, getDefaultCurrency } = storeToRefs(currencyStore)
const operationsStore = useOperationsStore()
const guestManagementStore = useGuestManagementStore()
const { visitorCategories } = storeToRefs(guestManagementStore)
const $q = useQuasar()
const groupeCodes = ref([])

const filterFields = ref({
  groupCodeId: null,
  playerCategoryId: null,
  junketId: null,
})

const manageGroupCode = () => {
  $q.dialog({
    component: defineAsyncComponent(
      () => import('components/pages/guest-operations/JunketGroupCodesDialog.vue'),
    ),
    componentProps: {
      actionFn: manageGroupCode,
    },
  })
    .onOk(async () => {
      await fetchGroupCodes()
    })
    .onCancel(async () => {
      await fetchGroupCodes()
    })
}

onMounted(async () => {
  await fetchGroupCodes()
  await guestManagementStore.fetchVisitorCategories()

  paymentFormValues.value.currencyId = getDefaultCurrency.value.id
})

const onSubmitFilter = async () => {
  junketOperationRefTable.value.fetchData()
  paymentTableRef.value.fetchData()
}
const fetchGroupCodes = async () => {
  groupeCodes.value = await operationsStore.fetchGroupCodes()
}
const junketOperationRefTable = ref(null)

const columns = ref([
  {
    label: 'Calculation Time',
    field: 'calculationTime',
    fieldType: 'date',
  },
  {
    label: 'Status',
    field: 'status',
  },

  {
    label: 'Player Name',
    field: 'playerFullName',
  },

  {
    label: 'Currency',
    field: 'currencyName',
  },
  {
    label: 'T.Result',
    field: 'totalResult',
    fieldType: 'price',
  },
  {
    label: 'Comp',
    field: 'comp',
    fieldType: 'price',
  },
  {
    label: 'Discount',
    field: 'discount',
    fieldType: 'price',
  },
  {
    label: 'Expense',
    field: 'expense',
    fieldType: 'price',
  },
  {
    label: 'CC Fee',
    field: 'ccFee',
    fieldType: 'price',
  },
  {
    label: 'Net Result',
    field: 'netResult',
    fieldType: 'priceAbs',
  },
  {
    label: 'Commission Percent',
    field: 'commissionPercent',
    fieldType: 'price',
  },
  {
    label: 'Commission Amount',
    field: 'commissionAmount',
    fieldType: 'priceAbs',
  },
  {
    label: 'Actions',
    field: 'actions',
  },
])

const selectedRow = ref(null)
watch(
  () => junketOperationRefTable.value?.selectedRow,
  (value) => {
    selectedRow.value = value
  },
  { deep: true, immediate: true },
)

const onCliclCalculationStatusUpdate = async () => {
  if (!filterFields.value.groupCodeId) {
    $q.notify({
      type: 'warning',
      position: 'bottom-right',
      message: 'Please select a group code!',
    })
    return
  }

  $q.dialog({
    title: i18n.global.t('updateCalculationStatus'),
    message: i18n.global.t('areYouSureYouWantToUpdateCalculationStatus'),
    persistent: true,
    focus: 'cancel',
    ok: {
      flat: false,
      color: 'green-8',
      label: i18n.global.t('yes'),
      class: 'text-capitalize',
      unelevated: true,
    },
    cancel: {
      flat: true,
      color: 'negative',
      label: i18n.global.t('no'),
      class: 'text-capitalize',
    },
    transitionShow: 'slide-up',
    transitionHide: 'slide-down',
  }).onOk(async () => {
    const response = await operationsStore.updateCalculationStatus({
      groupCodeId: filterFields.value.groupCodeId,
      status: 'Pending',
    })

    if (response.status === 200) {
      $q.notify({
        type: 'positive',
        position: 'bottom-right',
        message: i18n.global.t('calculationStatusUpdated'),
      })
    } else {
      $q.notify({
        type: 'warning',
        position: 'bottom-right',
        message: i18n.global.t('somethingWentWrong'),
      })
    }
    junketOperationRefTable.value.fetchData()
    paymentTableRef.value.fetchData()
    paymentTotal.value = await operationsStore.getPaymentsTotal(filterFields.value)
  })
}

const onCliclJunketCalculationStatusUpdate = async () => {
  if (!filterFields.value.groupCodeId || !filterFields.value.junketId) {
    $q.notify({
      type: 'warning',
      position: 'bottom-right',
      message: 'Please select a group code and junket!',
    })
    return
  }
  $q.dialog({
    title: i18n.global.t('updateJunketCalculationStatus'),
    message: i18n.global.t('areYouSureYouWantToUpdateJunketCalculationStatus'),
    persistent: true,
    focus: 'cancel',
    ok: {
      flat: false,
      color: 'green-8',
      label: i18n.global.t('yes'),
      class: 'text-capitalize',
      unelevated: true,
    },
    cancel: {
      flat: true,
      color: 'negative',
      label: i18n.global.t('no'),
      class: 'text-capitalize',
    },
    transitionShow: 'slide-up',
    transitionHide: 'slide-down',
  }).onOk(async () => {
    const response = await operationsStore.updateJunketCalculationStatus({
      groupCodeId: filterFields.value.groupCodeId,
      status: 'Pending',
      junketId: filterFields.value.junketId,
    })

    if (response.status === 200) {
      $q.notify({
        type: 'positive',
        position: 'bottom-right',
        message: i18n.global.t('junketCalculationStatusUpdated'),
      })
    } else {
      $q.notify({
        type: 'warning',
        position: 'bottom-right',
        message: i18n.global.t('somethingWentWrong'),
      })
    }

    junketOperationRefTable.value.fetchData()
    paymentTableRef.value.fetchData()
    paymentTotal.value = await operationsStore.getPaymentsTotal(filterFields.value)
  })
}

const paymentColumns = ref([
  {
    field: 'id',
  },
  {
    field: 'createdAt',
    fieldType: 'date',
  },
  {
    field: 'junketName',
  },
  {
    field: 'currencyName',
    label: 'Currency',
  },
  {
    field: 'amount',
    fieldType: 'priceAbs',
  },
  {
    field: 'defaultCurrencyAmount',
    label: 'Currency Amount',
    fieldType: 'priceAbs',
  },
  {
    field: 'isDeleted',
    fieldType: 'boolean',
  },
])

const paymentTableRef = ref(null)
const paymentFormValues = ref({
  groupCodeId: null,
  junketId: null,
  currencyId: null,
  amount: null,
  note: null,
})
const onSubmitPaymentForm = async () => {
  if (!filterFields.value.groupCodeId || !filterFields.value.junketId) {
    $q.notify({
      type: 'warning',
      position: 'bottom-right',
      message: i18n.global.t('pleaseSelectGroupCodeAndJunket'),
    })
    return
  }
  paymentFormValues.value.groupCodeId = filterFields.value.groupCodeId
  paymentFormValues.value.junketId = filterFields.value.junketId
  const response = await operationsStore.createPayment(paymentFormValues.value)
  if (response) {
    $q.notify({
      message: 'Payment created successfully',
      type: 'positive',
    })
    paymentFormValues.value = {
      groupCodeId: null,
      junketId: null,
      currencyId: null,
      amount: null,
      note: null,
    }
    paymentTableRef.value.fetchData()
    paymentTotal.value = await operationsStore.getPaymentsTotal(filterFields.value)
  }
}

const paymentTotal = computedAsync(async () => {
  return await operationsStore.getPaymentsTotal(filterFields.value)
})

const onClickCloseGroupCode = async () => {
  if (!filterFields.value.groupCodeId) {
    $q.notify({
      type: 'warning',
      position: 'bottom-right',
      message: 'Please select a group code!',
    })
    return
  }
  $q.dialog({
    title: i18n.global.t('closeGroupCode'),
    message: i18n.global.t('areYouSureYouWantToCloseThisGroupCode'),
    color: 'positive',
    ok: {
      flat: true,
      color: 'positive',
      label: i18n.global.t('ok'),
      class: 'text-capitalize',
      dataCy: 'ok',
    },
  }).onOk(async () => {
    const response = await operationsStore.closeGroupCode({
      id: filterFields.value.groupCodeId,
      isClosed: true,
    })
    if (response.status === 200) {
      $q.notify({
        message: 'Group code closed successfully',
        type: 'positive',
      })
      fetchGroupCodes()
    } else {
      $q.notify({
        message: 'Group code closed failed',
        type: 'negative',
      })
    }
  })
}
</script>

<style scoped lang="scss">
fieldset {
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  padding: 10px !important;
  margin-bottom: 10px !important;
}

.fieldset {
  border: 1px solid #4b4f52 !important;
  border-radius: 5px;
  min-height: 190px;
}
</style>
