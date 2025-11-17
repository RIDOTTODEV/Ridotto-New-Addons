<template>
  <q-page class="q-pa-md">
    <q-card class="no-box-shadow q-mb-md bg-transparent">
      <q-card-section class="q-pa-none">
        <div class="row">
          <div class="col-md-3 col-xs-12">
            <fieldset class="fieldset">
              <legend class="text-subtitle2">{{ $t('Filters') }}</legend>
              <div class="row flex flex-column q-gutter-y-md">
                <div class="col-12">
                  <q-select-box
                    :options="visitorCategories"
                    option-value="id"
                    option-label="name"
                    v-model="filterFields.marketerId"
                    :label="$t('Junket')"
                    bg-color="white"
                    @update:model-value="
                      (val) => {
                        filterFields.marketerId = val
                      }
                    "
                  >
                  </q-select-box>
                </div>
                <div class="col-12">
                  <q-select-box
                    :options="groupeCodes"
                    option-value="id"
                    option-label="code"
                    v-model="filterFields.groupCodeId"
                    :label="$t('Group Code')"
                    bg-color="white"
                    :slotNames="['after']"
                    :useOptionSlot="true"
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
                    <template v-slot:option="{ scope }">
                      <q-item v-bind="scope.itemProps">
                        <q-item-section>
                          <q-item-label>{{ scope.opt?.code }}</q-item-label>
                          <q-item-label
                            caption
                            :class="{
                              'text-red-8': scope.opt?.isClosed,
                              'text-green-8': !scope.opt?.isClosed,
                            }"
                            >{{ scope.opt?.isClosed ? $t('closed') : $t('open') }}

                            <q-icon
                              :name="scope.opt?.isClosed ? 'o_close' : 'o_check'"
                              size="12px"
                              :color="scope.opt?.isClosed ? 'red-8' : 'green-8'"
                            />
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
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
          <div class="col-md-3 col-xs-12">
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
                    :disable="groupStatusForJunket"
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
                    :disable="groupStatusForJunket"
                  />
                </div>

                <div class="col-12 text-center" v-if="groupStatusForJunket !== undefined">
                  <q-btn
                    unelevated
                    padding="xs"
                    :label="groupStatusForJunket ? $t('openGroupCode') : $t('closeGroupCode')"
                    :color="groupStatusForJunket ? 'orange-3' : 'grey-3'"
                    text-color="dark"
                    :icon="groupStatusForJunket ? 'o_close' : 'o_open'"
                    no-wrap
                    no-caps
                    @click="onClickCloseGroupCode"
                    class="full-width"
                  />
                </div>
              </div>
            </fieldset>
          </div>
          <div class="col-md-3 col-xs-12">
            <fieldset class="fieldset row">
              <legend class="text-subtitle2">
                {{ $t('Player Photo') }}
              </legend>
              <q-img
                :src="$playerPhotoUrl + selectedRow.playerId"
                class="player-photo"
                fit="cover"
                error-src="/assets/no-photo.png"
                v-if="selectedRow"
                style="width: 140px; height: 140px; object-fit: cover"
              />
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
                  <q-markup-table separator="cell" dense square bordered style="min-width: 300px">
                    <thead>
                      <tr>
                        <th class="text-center bg-grey-2">Expense</th>
                        <th class="text-center bg-grey-2">Currency</th>
                        <th class="text-center bg-grey-2">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="expense in props.row.expenses" :key="expense.id">
                        <td class="text-center">{{ expense.expenseTypeName }}</td>
                        <td class="text-center">
                          {{ expense.casinoCurrencyName }}
                        </td>
                        <td class="text-center">
                          {{ formatPrice(expense.amount) }}
                        </td>
                      </tr>
                    </tbody>
                  </q-markup-table>
                </q-tooltip>
              </q-btn>
            </q-td>
          </template>
          <template v-slot:bottomRow="props">
            <q-tr :props="props">
              <q-td
                v-for="(col, index) in [
                  ...props.cols.sort((a, b) => a.orderColumn - b.orderColumn),
                ]"
                :key="index"
                :name="col.name"
                align="center"
                :class="{
                  'bg-red-1':
                    col.showTotal && props.rows.reduce((acc, item) => acc + item[col.field], 0) < 0,
                  'bg-green-1':
                    col.showTotal && props.rows.reduce((acc, item) => acc + item[col.field], 0) > 0,
                }"
              >
                <div class="text-subtitle2" v-if="col.showTotal">
                  {{ col.format(props.rows.reduce((acc, item) => acc + item[col?.field] || 0, 0)) }}
                </div>
                <div class="text-subtitle2" v-else>-</div>
              </q-td>
            </q-tr>
          </template>
        </SupaTable>
      </q-card-section>
      <q-card-section class="q-pa-none row q-mt-md">
        <div class="col-md-6 col-xs-12 q-pa-xs">
          <div class="row">
            <div class="col-6 flex content-center items-center">
              <div class="text-subtitle2">{{ $t('Payments') }}</div>
            </div>
            <div class="col-6 flex content-center items-center justify-end">
              <q-btn
                :label="createNewPayment ? $t('cancel') : $t('create')"
                :color="createNewPayment ? 'negative' : 'green-8'"
                :icon="createNewPayment ? 'o_close' : 'o_add'"
                dense
                unelevated
                no-caps
                padding="2px"
                @click="createNewPayment = !createNewPayment"
                class="q-mb-xs"
              />
            </div>
          </div>
          <SupaTable
            :columns="paymentColumns"
            :getDataFn="operationsStore.getPayments"
            :filterParams="filterFields"
            :slotNames="['body-cell-createdByName']"
            ref="paymentTableRef"
            tableName="paymentsColumns"
            :hideTopBar="true"
            :hideBottom="true"
          >
            <template v-slot:body-cell-createdByName="{ props }">
              <q-td :props="props">
                <div class="flex flex-column justify-center row items-center">
                  <span class="text-capitalize">
                    {{ props.row.createdByName }}
                  </span>
                  <span class="text-caption text-grey-8" v-if="props.row.note">
                    <q-icon name="o_comment" size="13px" class="q-mr-xs" />
                    {{ props.row.note }}
                  </span>
                </div>
              </q-td>
            </template>
            <template v-slot:bottomRow="props">
              <q-tr :props="props">
                <q-td
                  v-for="(col, index) in [
                    ...props.cols.sort((a, b) => a.orderColumn - b.orderColumn),
                  ]"
                  :key="index"
                  :name="col.name"
                  align="center"
                  :class="{
                    'bg-red-1':
                      col.showTotal &&
                      props.rows.reduce((acc, item) => acc + item[col.field], 0) < 0,
                    'bg-green-1':
                      col.showTotal &&
                      props.rows.reduce((acc, item) => acc + item[col.field], 0) > 0,
                  }"
                >
                  <div class="text-subtitle2" v-if="col.showTotal">
                    {{
                      col.format(props.rows.reduce((acc, item) => acc + item[col?.field] || 0, 0))
                    }}
                    <span v-if="col.field === 'amount'"> {{ props.rows[0]?.currencyName }}</span>
                    <span v-if="col.field === 'defaultCurrencyAmount'">
                      {{ props.rows[0]?.defaultCurrencyName }}</span
                    >
                  </div>
                  <div class="text-subtitle2" v-else>-</div>
                </q-td>
              </q-tr>
            </template>
          </SupaTable>

          <fieldset class="fieldset q-mt-md" v-if="createNewPayment">
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
        <div class="col-md-6 col-xs-12 q-pa-xs" v-if="getGcJunketResult">
          <div class="row">
            <div class="text-subtitle2 q-ml-sm">{{ $t('Junket Result') }}</div>
          </div>
          <div class="col text-center q-pa-sm" v-if="getGcJunketResult">
            <q-card flat class="app-cart-grey">
              <q-card-section class="q-pa-sm">
                <div class="absolute-top-right">
                  <q-chip
                    size="sm"
                    color="blue-8"
                    text-color="white"
                    :label="getGcJunketResult?.status"
                    square
                    icon="o_info"
                  />
                </div>
                <div class="row">
                  <div class="text-subtitle2 flex content-center items-center">
                    <div class="min-w flex justify-start">{{ $t('netResult') }}</div>
                    :
                    <span class="q-ml-md">
                      {{ priceAbsFormatted(getGcJunketResult?.netResult) }}
                      <span class="text-caption text-capitalize">{{
                        getGcJunketResult.currencyName
                      }}</span>
                    </span>
                  </div>
                </div>
                <div class="row">
                  <div class="text-subtitle2 flex content-center items-center">
                    <div class="min-w flex justify-start">{{ $t('commission') }}</div>
                    :
                    <span class="q-ml-md">
                      {{ priceAbsFormatted(getGcJunketResult?.commissionAmount) }}
                      <span
                        class="text-caption text-capitalize"
                        v-if="getGcJunketResult.commissionPercent"
                      >
                        % {{ getGcJunketResult.commissionPercent }}</span
                      >
                    </span>
                  </div>
                </div>
                <div class="row">
                  <div class="text-subtitle2 flex content-center items-center">
                    <div class="min-w flex justify-start">{{ $t('payments') }}</div>
                    :
                    <span class="q-ml-md">
                      {{ priceAbsFormatted(paymentTotal) }}
                      <span class="text-caption text-capitalize">{{
                        getGcJunketResult.currencyName
                      }}</span>
                    </span>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    <q-separator class="q-my-sm" />
                  </div>
                </div>

                <div class="row">
                  <div class="text-subtitle2 flex content-center items-center">
                    <div class="min-w flex justify-start">{{ $t('Total Result') }}</div>
                    :
                    <span
                      class="q-ml-md text-bold"
                      :class="{
                        'text-green-8': getGcJunketResult?.commissionAmount - paymentTotal > 0,
                        'text-negative': getGcJunketResult?.commissionAmount - paymentTotal < 0,
                      }"
                    >
                      {{
                        priceAbsFormatted(getGcJunketResult?.commissionAmount - paymentTotal || 0)
                      }}
                      <span class="text-caption text-capitalize text-bold">{{
                        getGcJunketResult.currencyName
                      }}</span>
                    </span>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
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
import { priceAbsFormatted, formatPrice } from 'src/helpers/helpers'
const currencyStore = useCurrencyStore()
const { getCurrenciesWithFlags, getDefaultCurrency } = storeToRefs(currencyStore)
const operationsStore = useOperationsStore()
const guestManagementStore = useGuestManagementStore()
const { visitorCategories } = storeToRefs(guestManagementStore)
const $q = useQuasar()
const groupeCodes = ref([])

const filterFields = ref({
  groupCodeId: null,
  marketerId: null,
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

  await getGcJunketResultTotal()
  await getPaymentTotal()

  await getGroupCodeMarketerClosed()
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
    label: 'Comp',
    field: 'comp',
    fieldType: 'priceAbs',
    showTotal: true,
  },
  {
    label: 'Credit',
    field: 'credit',
    fieldType: 'priceAbs',
    showTotal: true,
  },
  {
    label: 'Discount',
    field: 'discount',
    fieldType: 'priceAbs',
    showTotal: true,
  },
  {
    label: 'Expense',
    field: 'expense',
    fieldType: 'priceAbs',
    showTotal: true,
  },
  {
    label: 'CC Fee',
    field: 'ccFee',
    fieldType: 'priceAbs',
    showTotal: true,
  },
  {
    label: 'T.Result',
    field: 'totalResult',
    fieldType: 'priceAbs',
    showTotal: true,
  },
  {
    label: 'Net Result',
    field: 'netResult',
    fieldType: 'priceAbs',
    showTotal: true,
  },
  {
    label: 'Commission Percent',
    field: 'commissionPercent',
    fieldType: 'price',
    format: (val) => {
      return val ? val + ' %' : '-'
    },
  },
  {
    label: 'Commission Amount',
    field: 'commissionAmount',
    fieldType: 'priceAbs',
    showTotal: true,
  },
  {
    label: 'Sl.Result',
    field: 'slResult',
    fieldType: 'priceAbs',
    showTotal: true,
  },
  {
    label: 'Lg.Result',
    field: 'lgResult',
    fieldType: 'priceAbs',
    showTotal: true,
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

  const groupCode = groupeCodes.value.find((item) => item.id === filterFields.value?.groupCodeId)
  $q.dialog({
    title: 'Recalculate for Group Code',
    message: 'Are you sure you want to recalculate for the group code? ' + groupCode?.code,
    persistent: true,
    focus: 'cancel',
    ok: {
      outline: false,
      color: 'green-8',
      label: i18n.global.t('ok'),
      class: 'text-capitalize',
      unelevated: true,
    },
    cancel: {
      flat: true,
      color: 'negative',
      label: i18n.global.t('cancel'),
      class: 'text-capitalize',
      icon: 'o_close',
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
    await getGcJunketResultTotal()
    await getPaymentTotal()
  })
}

const onCliclJunketCalculationStatusUpdate = async () => {
  if (!filterFields.value.groupCodeId || !filterFields.value.marketerId) {
    $q.notify({
      type: 'warning',
      position: 'bottom-right',
      message: 'Please select a group code and junket!',
    })
    return
  }
  const junket = visitorCategories.value.find((item) => item.id === filterFields.value?.marketerId)
  $q.dialog({
    title: 'Recalculate for Junket',
    message: 'Are you sure you want to recalculate for the junket? ' + junket?.name,
    persistent: true,
    focus: 'cancel',
    ok: {
      outline: false,
      color: 'green-8',
      label: i18n.global.t('ok'),
      class: 'text-capitalize',
      unelevated: true,
    },
    cancel: {
      flat: true,
      color: 'negative',
      label: i18n.global.t('cancel'),
      class: 'text-capitalize',
      icon: 'o_close',
    },
    transitionShow: 'slide-up',
    transitionHide: 'slide-down',
  }).onOk(async () => {
    const response = await operationsStore.updateJunketCalculationStatus({
      groupCodeId: filterFields.value.groupCodeId,
      status: 'Pending',
      marketerId: filterFields.value.marketerId,
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

    await junketOperationRefTable.value.fetchData()
    await paymentTableRef.value.fetchData()
    paymentTotal.value = await operationsStore.getPaymentsTotal(filterFields.value)
    await getGcJunketResultTotal()
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
    field: 'createdByName',
    label: 'Created By',
    classes: 'text-capitalize',
  },

  {
    field: 'amount',
    fieldType: 'priceAbs',
    format: (val, _row) => {
      return priceAbsFormatted(val) + ' ' + (_row?.currencyName || '') + ''
    },
    showTotal: true,
  },
  {
    field: 'defaultCurrencyAmount',
    label: 'Casino Currency',
    fieldType: 'priceAbs',
    format: (val, _row) => {
      return priceAbsFormatted(val) + ' ' + (_row?.defaultCurrencyName || '') + ''
    },
    showTotal: true,
  },
])

const paymentTableRef = ref(null)
const paymentFormValues = ref({
  groupCodeId: null,
  marketerId: null,
  currencyId: null,
  amount: null,
  note: null,
})
const onSubmitPaymentForm = async () => {
  if (!filterFields.value.groupCodeId || !filterFields.value.marketerId) {
    $q.notify({
      type: 'warning',
      position: 'bottom-right',
      message: i18n.global.t('pleaseSelectGroupCodeAndJunket'),
    })
    return
  }
  paymentFormValues.value.groupCodeId = filterFields.value.groupCodeId
  paymentFormValues.value.marketerId = filterFields.value.marketerId
  const response = await operationsStore.createPayment(paymentFormValues.value)
  if (response) {
    $q.notify({
      message: 'Payment created successfully',
      type: 'positive',
    })
    paymentFormValues.value = {
      groupCodeId: null,
      marketerId: null,
      currencyId: null,
      amount: null,
      note: null,
    }
    paymentTableRef.value.fetchData()
    paymentTotal.value = await operationsStore.getPaymentsTotal(filterFields.value)
  }
}

const paymentTotal = ref(0)

const getPaymentTotal = async () => {
  paymentTotal.value = await operationsStore.getPaymentsTotal(filterFields.value)
}

const onClickCloseGroupCode = async () => {
  if (!filterFields.value.groupCodeId || !filterFields.value.marketerId) {
    $q.notify({
      type: 'warning',
      position: 'bottom-right',
      message: 'Please select a group code!',
    })
    return
  }

  const groupCode = groupeCodes.value.find((item) => item.id === filterFields.value?.groupCodeId)
  const junket = visitorCategories.value.find((item) => item.id === filterFields.value?.marketerId)
  $q.dialog({
    title: groupStatusForJunket.value ? 'Open Group Code Junket' : 'Close Group Code Junket',
    message:
      'Are you sure you want to ' +
      (groupStatusForJunket.value ? 'open' : 'close') +
      ' the group code junket?  ' +
      groupCode?.code +
      ' ' +
      junket?.name,
    persistent: true,
    focus: 'cancel',
    ok: {
      outline: false,
      color: 'green-8',
      label: i18n.global.t('ok'),
      class: 'text-capitalize',
      unelevated: true,
    },
    cancel: {
      flat: true,
      color: 'negative',
      label: i18n.global.t('cancel'),
      class: 'text-capitalize',
      icon: 'o_close',
    },
  }).onOk(async () => {
    const response = await operationsStore.updateMarketerCloseGroupCode({
      groupCodeId: filterFields.value.groupCodeId,
      marketerId: filterFields.value.marketerId,
      isClosed: !groupStatusForJunket.value,
    })
    if (response.status === 200) {
      $q.notify({
        message: 'Group code closed successfully',
        type: 'positive',
      })
      await getGroupCodeMarketerClosed()
      await fetchGroupCodes()
    } else {
      $q.notify({
        message: 'Group code closed failed',
        type: 'negative',
      })
    }
  })
}

const createNewPayment = ref(false)

const getGcJunketResult = ref(null)
const getGcJunketResultTotal = async () => {
  getGcJunketResult.value =
    filterFields.value.groupCodeId && filterFields.value.marketerId
      ? await operationsStore.getGcJunketResult(filterFields.value)
      : null
}

onMounted(async () => {
  await getGcJunketResultTotal()
  await getPaymentTotal()
})

const groupStatusForJunket = ref(undefined)
const getGroupCodeMarketerClosed = async () => {
  const response = await operationsStore.getGroupCodeMarketerClosed({
    groupCodeId: filterFields.value.groupCodeId,
    marketerId: filterFields.value.marketerId,
  })
  if (response) {
    groupStatusForJunket.value = response
  } else if (response === false) {
    groupStatusForJunket.value = false
  } else {
    groupStatusForJunket.value = undefined
  }
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

.flex-column {
  display: flex;
  flex-direction: column;
}
.min-w {
  min-width: 170px !important;
}
</style>
