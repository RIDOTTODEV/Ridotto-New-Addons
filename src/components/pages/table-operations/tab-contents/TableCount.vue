<template>
  <q-card flat square class="app-cart q-mt-sm">
    <div class="row col-12 q-pa-xs full-width">
      <Information
        content="Masaların ne kadar çip ile açıldığını ve kapatıldığını bilgisini ve kasadan yapılan fill – credit işlemleri buraya otomatik olarak yansır . Açılış değerleri float set bilgisinden gelmektedir. "
      />
    </div>
    <q-card-section class="q-pa-none">
      <div class="row">
        <div class="col-12 q-pa-xs">
          <fieldset class="row">
            <legend align="center" class="text-subtitle2">
              {{ $t('tableCounts') }}
            </legend>
            <div class="col-12 q-pa-md">
              <q-markup-table dense separator="cell" square class="no-box-shadow full-width">
                <thead>
                  <tr>
                    <th class="text-center app-cart-grey" style="padding: 0 !important">
                      <q-checkbox
                        v-model="selectAllTableCounts"
                        @update:model-value="onSelectAllTableCounts"
                        color="blue-grey-8"
                      />
                    </th>
                    <th class="text-center app-cart-grey">
                      <div class="text-bold">Table</div>
                    </th>
                    <th class="text-center app-cart-grey">
                      <div class="text-bold">Gaming Date</div>
                    </th>
                    <th class="text-center app-cart-grey">
                      <div class="text-bold">Float Set</div>
                    </th>
                    <th class="text-center app-cart-grey">
                      <div class="text-bold">Total Drop</div>
                    </th>
                    <th class="text-center app-cart-grey">
                      <div class="text-bold">Total Credit</div>
                    </th>
                    <th class="text-center app-cart-grey">
                      <div class="text-bold">Total Fill</div>
                    </th>
                    <th class="text-center app-cart-grey">
                      <div class="text-bold">Result</div>
                    </th>
                    <th class="text-center app-cart-grey">
                      <div class="text-bold">Chip Count</div>
                    </th>
                    <th class="text-center app-cart-grey">
                      <div class="text-bold">Cash Count</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in tableStore.tableCounts"
                    :key="index"
                    :class="[
                      item.id === selectedTableCount?.id
                        ? 'bg-red-2'
                        : item.cashSaveLock
                          ? 'bg-green-1'
                          : '',
                    ]"
                  >
                    <td class="text-center">
                      <q-checkbox
                        v-model="selectedTableCountIds"
                        :val="item.id"
                        :key="index"
                        @update:model-value="onCheckedTableCount()"
                        color="blue-grey-8"
                        :disable="
                          item.gamingDateId === getDefaultGamingDateId || item?.isAnyoneSit === true
                        "
                      />
                    </td>
                    <td class="text-center cursor-pointer" @click="onSelectTableCount(item)">
                      <div class="flex justify-center content-center items-center">
                        {{ item?.tableName }}
                        <div class="" v-if="item?.isAnyoneSit">
                          <q-icon
                            name="fa-solid fa-users"
                            size="12px"
                            color="negative"
                            class="q-mr-sm q-ml-sm animateIcon"
                          >
                            <q-tooltip class="bg-blue-grey-8 text-white text-subtitle2">{{
                              $t('hasPlayers')
                            }}</q-tooltip>
                          </q-icon>
                        </div>
                      </div>
                    </td>
                    <td class="text-center" @click="onSelectTableCount(item)">
                      <div class="row">
                        <div class="col-12">
                          {{ item?.gamingDate }}
                        </div>
                      </div>
                    </td>
                    <td class="text-center" @click="onSelectTableCount(item)">
                      {{ item?.floatSetName }}
                    </td>
                    <td class="text-center" @click="onSelectTableCount(item)">
                      {{
                        formatPrice(
                          item.id === selectedTableCount?.id
                            ? selectedCountTotalDropAdditional
                            : item?.totalDrop,
                        )
                      }}
                    </td>
                    <td class="text-center" @click="onSelectTableCount(item)">
                      {{ formatPrice(item?.totalCredit) }}
                    </td>
                    <td class="text-center" @click="onSelectTableCount(item)">
                      {{ formatPrice(item?.totalFill) }}
                    </td>
                    <td class="text-center" @click="onSelectTableCount(item)">
                      {{
                        formatPrice(
                          item.id === selectedTableCount?.id
                            ? selectedCountTableResult
                            : item?.result,
                        )
                      }}
                    </td>
                    <td class="text-center">
                      <q-icon
                        :class="item?.chipSaveLock ? 'cursor-pointer' : 'text-negative'"
                        :name="item?.chipSaveLock ? 'lock' : 'lock_open'"
                        :color="item?.chipSaveLock ? 'positive' : 'negative'"
                        size="20px"
                        @click="
                          () => {
                            if (item?.chipSaveLock) {
                              onClickTableCountChipSaveEditCheck(item)
                            }
                          }
                        "
                      />
                    </td>
                    <td class="text-center">
                      <q-icon
                        :class="item?.cashSaveLock ? 'cursor-pointer' : ''"
                        :name="item?.cashSaveLock ? 'lock' : 'lock_open'"
                        :color="item?.cashSaveLock ? 'positive' : 'negative'"
                        size="20px"
                        @click="
                          () => {
                            if (item?.cashSaveLock) {
                              onEditSavedCount(item)
                            }
                          }
                        "
                      />
                    </td>
                  </tr>
                  <tr>
                    <td colspan="10" class="text-right">
                      <div class="flex justify-end q-pa-sm">
                        <q-btn
                          :disable="selectedTableCountIds.length >= 1 ? false : true"
                          unelevated
                          color="grey-2"
                          text-color="dark"
                          no-caps
                          icon="repartition"
                          size="11px"
                          @click="onClickSetTableFloat"
                          v-el-perms="'Addon.TableCount.Tab.SetTableFloat'"
                          class="q-mr-md"
                          :label="$t('setTableFloat')"
                        />

                        <q-btn
                          :disable="selectedTableCountIds.length >= 1 ? false : true"
                          unelevated
                          color="grey-2"
                          text-color="dark"
                          no-caps
                          size="11px"
                          icon="manage_history"
                          class="q-ml-md"
                          @click="onClickUpdateTableGamingDate"
                          v-el-perms="'Addon.TableCount.Tab.ChangeTableGamingDate'"
                          :label="$t('changeTableGamingDate')"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>
          </fieldset>
        </div>
        <!--         <div class="col-5 q-pa-xs" v-if="selectedTableCount?.formattedTableFloats">
          <fieldset class="row">
            <legend class="text-subtitle2" align="center">Table Float Sets</legend>
            <div
              class="col q-pa-xs"
              v-for="(item, i) in selectedTableCount?.formattedTableFloats"
              :key="i"
            >
              <div class="row flex justify-between">
                <div class="text-subtitle2">
                  {{ item.chipName }}
                </div>
                <div class="text-subtitle2 q-mr-sm">
                  {{ formatPrice(item.total) }}
                </div>
              </div>
              <q-markup-table separator="cell" flat square bordered dense>
                <thead>
                  <tr>
                    <th class="grey-card text-center">
                      <strong>Denom</strong>
                    </th>
                    <th class="grey-card text-center">
                      <strong class="q-pr-md">Quantity</strong>
                    </th>
                    <th class="grey-card text-center">
                      <strong class="q-pr-md">Amount</strong>
                    </th>
                  </tr>
                </thead>
                <tbody class="denom-body">
                  <tr v-for="(denom, denomIndex) in item?.denominations" :key="denomIndex">
                    <td
                      class="text-center text-center cursor-not-allowed"
                      style="padding: 0 !important"
                    >
                      {{ denom.chipDenomName }}
                    </td>
                    <td
                      class="text-center text-grey-8 text-center cursor-not-allowed"
                      style="padding: 0 !important"
                    >
                      {{ denom.quantity }}
                    </td>
                    <td
                      class="text-center text-grey-8 text-center cursor-not-allowed"
                      style="padding: 0 !important"
                    >
                      {{ formatPrice(denom.quantity * denom.chipValue) }}
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>
          </fieldset>
        </div> -->
      </div>
    </q-card-section>
    <q-card-section v-if="selectedTableCount" class="q-mt-md q-pa-xs">
      <div class="row">
        <Alert
          message="Bu masa oyuncu ile dolu olduğu için güncellenemez."
          type="error"
          :showDirect="true"
          v-if="selectedTableCount?.isAnyoneSit"
        />
      </div>
      <fieldset class="row q-pa-none">
        <legend align="center" class="text-subtitle2">
          {{ $t('tableCountsDetails') }}
        </legend>
        <div class="col-12 q-pa-xs">
          <div class="row flex" v-if="selectedTableCount">
            <div
              class="col q-pa-sm flex justify-start content-start items-start"
              v-for="(item, i) in selectedTableCount?.chipInfoFormatted?.filter(
                (item) => item.chipType === 'Chip',
              )"
              :key="i"
            >
              <div class="row flex full-height full-width">
                <div class="col-12">
                  <q-markup-table separator="cell" class="row" flat square bordered dense>
                    <thead>
                      <tr>
                        <th class="text-center">{{ item.chipType }}</th>
                        <th class="text-center">
                          {{
                            formatPrice(
                              item.denominations.reduce(
                                (acc, { quantity, chipDenom }) => acc + quantity * chipDenom,
                                0,
                              ) || 0,
                            )
                          }}
                        </th>
                        <th class="text-center">
                          {{
                            formatPrice(
                              item.denominations.reduce(
                                (acc, { expected, chipDenom }) => acc + expected * chipDenom,
                                0,
                              ) || 0,
                            )
                          }}
                        </th>
                      </tr>
                      <tr>
                        <th class="grey-card text-center">Denom</th>
                        <th class="grey-card text-center">Amount</th>
                        <th class="grey-card text-center">Expected</th>
                      </tr>
                    </thead>
                    <tbody class="denom-body">
                      <tr v-for="(denom, denomIndex) in item?.denominations" :key="denomIndex">
                        <td class="text-center text-center">
                          {{ denom.chipDenomName }}
                        </td>
                        <td class="text-center text-center bg-grey-2">
                          {{ denom.quantity }}
                        </td>
                        <td class="text-center text-center">
                          {{ denom?.expected }}
                        </td>
                      </tr>
                    </tbody>
                  </q-markup-table>
                </div>
              </div>
            </div>
            <div
              class="col q-pa-sm"
              v-for="(item, i) in selectedTableCount?.cashInfoFormatted"
              :key="i"
            >
              <div class="row flex">
                <div class="col-12">
                  <q-markup-table class="row" separator="cell" flat square bordered dense>
                    <thead>
                      <tr>
                        <th class="text-center text-negative">{{ item.currencyName }} *</th>
                        <th class="text-center">
                          {{
                            formatPrice(
                              item.denominations.reduce(
                                (acc, { quantity, currencyDenom }) =>
                                  acc + quantity * currencyDenom,
                                0,
                              ),
                            )
                          }}
                        </th>
                        <th class="text-center">
                          {{
                            formatPrice(
                              item.denominations.reduce(
                                (acc, { expected, currencyDenom }) =>
                                  acc + expected * currencyDenom,
                                0,
                              ) || 0,
                            )
                          }}
                        </th>
                      </tr>
                      <tr>
                        <th class="grey-card text-center">Denom</th>
                        <th class="grey-card text-center">Count</th>
                        <th class="grey-card text-center">Expected</th>
                      </tr>
                    </thead>
                    <tbody class="denom-body">
                      <tr v-for="(denom, denomIndex) in item.denominations" :key="denomIndex">
                        <td class="text-center">
                          {{ denom.currencyDenom }}
                        </td>
                        <td class="text-center bg-grey-2">
                          <q-field
                            v-model="denom.quantity"
                            hide-bottom-space
                            borderless
                            standout
                            :disable="selectedTableCount?.cashSaveLock"
                            @update:model-value="
                              (value) => {
                                denom = {
                                  ...denom,
                                  quantity: value,
                                  amount: +value * +denom.denomination,
                                }
                              }
                            "
                            dense
                            flat
                            type="number"
                            class="q-pa-none myInput"
                            lazy-rules
                            @focus="(e) => (e.target.select ? e.target.select() : null)"
                          >
                            <template v-slot:control="{ id, modelValue, emitValue }">
                              <input
                                type="number"
                                :id="id"
                                class="q-field__input text-center q-pa-none number-to-text bg-white myInput"
                                :value="modelValue"
                                @change="(e) => emitValue(e.target.value)"
                                pattern="[0-9]+([\.,][0-9]+)?"
                                v-el-perms="'Addon.CageOperations.Tab.BalanceUpdate'"
                                :disabled="selectedTableCount?.cashSaveLock"
                              />
                            </template>
                          </q-field>
                        </td>
                        <td class="text-center">
                          {{ denom?.expected }}
                        </td>
                      </tr>
                    </tbody>
                  </q-markup-table>
                </div>
              </div>
            </div>
            <div
              class="col q-pa-sm flex justify-start content-start items-start"
              v-for="(item, i) in selectedTableCount?.chipInfoFormatted?.filter(
                (item) => item.chipType !== 'Chip',
              )"
              :key="i"
            >
              <div class="row flex">
                <div class="col-12">
                  <q-markup-table separator="cell" flat square bordered dense>
                    <thead>
                      <tr>
                        <th class="text-center">
                          {{ item.chipType }}
                        </th>
                        <th class="text-right">
                          {{
                            formatPrice(
                              item.denominations.reduce(
                                (acc, { quantity, chipDenom }) => acc + quantity * chipDenom,
                                0,
                              ) || 0,
                            )
                          }}
                        </th>
                        <th class="text-right">
                          {{
                            formatPrice(
                              item.denominations.reduce(
                                (acc, { expected, chipDenom }) => acc + expected * chipDenom,
                                0,
                              ) || 0,
                            )
                          }}
                        </th>
                      </tr>
                      <tr>
                        <th class="grey-card text-center">Denom</th>
                        <th class="grey-card text-right">Count</th>
                        <th class="grey-card text-right">Expected</th>
                      </tr>
                    </thead>
                    <tbody class="denom-body">
                      <tr v-for="(denom, denomIndex) in item?.denominations" :key="denomIndex">
                        <td class="text-center text-center">
                          {{ denom.chipDenomName }}
                        </td>
                        <td class="text-center bg-grey-2">
                          <q-field
                            v-model="denom.quantity"
                            hide-bottom-space
                            borderless
                            standout
                            @update:model-value="
                              (value) => {
                                denom = {
                                  ...denom,
                                  quantity: value,
                                  amount: +value * +denom.denomination,
                                }
                              }
                            "
                            dense
                            flat
                            type="number"
                            class="q-pa-none myInput flex justify-center content-center items-center"
                            lazy-rules
                            @focus="(e) => (e.target.select ? e.target.select() : null)"
                            :disable="selectedTableCount?.cashSaveLock"
                          >
                            <template v-slot:control="{ id, modelValue, emitValue }">
                              <input
                                type="number"
                                :id="id"
                                class="q-field__input text-center q-pa-none number-to-text bg-white myInput"
                                :value="modelValue"
                                @change="(e) => emitValue(e.target.value)"
                                pattern="[0-9]+([\.,][0-9]+)?"
                                v-el-perms="'Addon.CageOperations.Tab.BalanceUpdate'"
                                :disabled="selectedTableCount?.cashSaveLock"
                              />
                            </template>
                          </q-field>
                        </td>
                        <td class="text-center">
                          {{ denom?.expected }}
                        </td>
                      </tr>
                    </tbody>
                  </q-markup-table>
                </div>
              </div>
            </div>
          </div>
          <q-btn
            :disable="selectedTableCount?.isClosed"
            unelevated
            color="primary"
            :label="$t('save')"
            no-caps
            icon="save"
            size="13px"
            @click="onClickUpdateTableCounts(selectedTableCount)"
            v-el-perms="'Addon.TableCount.Tab.Save'"
            class="q-mr-md"
            v-if="selectedTableCount"
          />
        </div>
        <q-card flat square class="q-pa-none col-12">
          <q-card-section class="q-mt-lg text-right q-pa-none">
            <div class="row">
              <Information
                :content="`<div class='text-left'>
                  <div class='text-subtitle2  '>
                 Table Count Cash Transaction
                  </div>
                  <div class='text-subtitle2'>
               Sayılan cash dropların kasa tarafına transaction kaydı girilecek .
                  </div>
                  </div>`"
              />
            </div>
          </q-card-section>
        </q-card>
      </fieldset>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed, onMounted, defineAsyncComponent } from 'vue'
import { useTableStore } from 'src/stores/table-store'
import { useAuthStore } from 'src/stores/auth-store'
import { useCurrencyStore } from 'src/stores/currency-store'
import { useCashdeskStore } from 'src/stores/cashdesk-store'
import { computedAsync } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useQuasar, Notify } from 'quasar'
import { formatPrice } from 'src/helpers/helpers'
import Alert from 'src/components/ui/Alert.vue'

const authStore = useAuthStore()
const { getDefaultCurrencyId, getDefaultGamingDateId } = storeToRefs(authStore)
const $q = useQuasar()
const tableStore = useTableStore()

const currencyStore = useCurrencyStore()
const cashDeskStore = useCashdeskStore()
const { selectedCashDesk } = storeToRefs(cashDeskStore)

onMounted(() => {
  tableStore.fetchTableCounts()
})

const selectedTableCount = ref()
const selectedTableCountIds = ref([])
const expectedTableCount = ref()
const selectAllTableCounts = ref(false)
const onSelectAllTableCounts = (value) => {
  if (value) {
    selectedTableCountIds.value = tableStore.tableCounts
      .filter(
        (tableCount) =>
          tableCount.gamingDateId !== getDefaultGamingDateId.value &&
          tableCount.isAnyoneSit === false,
      )
      .map((tableCount) => tableCount.id)
  } else {
    selectedTableCountIds.value = []
  }
}
const getExpectedCashInfoByCurrencyId = (currencyId, denomId) => {
  const currency = expectedTableCount.value?.cashInfo?.find(
    (cash) => cash.currencyId === currencyId,
  )
  return currency?.denominations?.find((cash) => cash.denomId === denomId)?.quantity || 0
}
const getExpectedChipInfo = (chipDenominationId) => {
  return (
    expectedTableCount.value?.chipInfo?.denominations?.find(
      (chip) => +chip.denomId === +chipDenominationId,
    )?.quantity || 0
  )
}
const onSelectTableCount = async (tableCount) => {
  const response = await tableStore.getExpectedTableCount({
    TableId: tableCount.tableId,
    GamingDateId: selectedCashDesk.value?.gamingDateId,
    floatSetId: tableCount.floatSetId,
  })
  const tableFloatSets = await tableStore.fetchTableFloats({
    tableId: tableCount.tableId,
  })
  expectedTableCount.value = response ? response[0] : null
  selectedTableCount.value = JSON.parse(JSON.stringify(tableCount))

  if (tableFloatSets.length > 0) {
    const formattedTableFloats = []
    tableFloatSets[0].tableFloatDenoms.forEach((item) => {
      const chip = formattedTableFloats.find((i) => i.chipName === item.chipName)
      if (chip) {
        chip.denominations.push(item)
        chip.total += item?.quantity * item?.chipValue
      } else {
        formattedTableFloats.push({
          chipName: item.chipName,
          denominations: [item],
          total: item?.quantity * item?.chipValue,
        })
      }
    })
    selectedTableCount.value.formattedTableFloats = formattedTableFloats
  }

  const cashInfoFormatted = []

  selectedTableCount.value?.cashInfo.forEach((item) => {
    const currency = cashInfoFormatted.find((i) => i.currencyId === item.currencyId)
    if (currency) {
      currency.denominations.push({
        ...item,
        expected: getExpectedCashInfoByCurrencyId(item.currencyId, item.currencyDenominationId),
      })
      currency.total += item?.quantity * item?.currencyDenom
    } else {
      cashInfoFormatted.push({
        currencyId: item.currencyId,
        currencyName: item.currencyName,
        denominations: [
          {
            ...item,
            expected: getExpectedCashInfoByCurrencyId(item.currencyDenominationId),
          },
        ],
        total: item?.quantity * item?.currencyDenom,
      })
    }
  })
  selectedTableCount.value.cashInfoFormatted = cashInfoFormatted

  const chipsFormatted = []
  selectedTableCount.value?.chipInfo.forEach((item) => {
    const chip = chipsFormatted.find((i) => i.chipType === item.chipType)
    if (chip) {
      chip.denominations.push({
        ...item,
        expected: getExpectedChipInfo(item.chipDenominationId),
      })
      chip.total += item?.quantity * item?.chipDenom
    } else {
      chipsFormatted.push({
        chipType: item.chipType,
        denominations: [
          {
            ...item,
            expected: getExpectedChipInfo(item.chipDenominationId),
          },
        ],
        total: item?.quantity * item?.chipDenom,
      })
    }
  })
  selectedTableCount.value.chipInfoFormatted = chipsFormatted
}

const selectedCountTotalDropAdditional = computedAsync(async () => {
  if (!selectedTableCount.value) return 0
  const totalDrop =
    selectedTableCount.value?.cashInfoFormatted?.map((cashFormatted) => {
      return {
        currencyId: cashFormatted.currencyId,
        total:
          cashFormatted.denominations.reduce(
            (acc, { currencyDenom, quantity }) => acc + currencyDenom * quantity,
            0,
          ) || 0,
      }
    }) || []

  let total = 0
  for (let i = 0; i < totalDrop.length; i++) {
    if (+totalDrop[i].currencyId !== +getDefaultCurrencyId.value) {
      total +=
        totalDrop[i].total > 0
          ? await currencyStore.getConvertedAmount(
              totalDrop[i].currencyId,
              getDefaultCurrencyId.value,
              totalDrop[i].total,
            )
          : 0
    } else {
      total += totalDrop[i].total
    }
  }
  const totalCredit =
    selectedTableCount.value?.chipInfoFormatted?.map((chipFormatted) => {
      return (
        chipFormatted.denominations.reduce(
          (acc, { chipDenom, quantity }) => acc + chipDenom * quantity,
          0,
        ) || 0
      )
    }) || 0
  return totalCredit ? total + totalCredit.reduce((acc, item) => acc + item, 0) : total
})

const selectedCountTableResult = computed(() => {
  const totalDrop = selectedCountTotalDropAdditional?.value || 0
  const totalCredit = selectedTableCount.value?.totalCredit || 0
  const totalFill = selectedTableCount.value?.totalFill || 0

  return +totalDrop + +totalCredit - +totalFill
})

const onClickSetTableFloat = () => {
  if (selectedCashDesk.value?.isMain !== true) {
    Notify.create({
      message: 'Sadece Main Cashdesk ile ayarlanabilir.',
      type: 'negative',
      icon: 'o_error',
      position: 'bottom-right',
    })
    return
  }
  const tableIds = tableStore.tableCounts
    .filter((count) => selectedTableCountIds.value.includes(count.id))
    .map((count) => count.tableId)
  $q.dialog({
    component: defineAsyncComponent(
      () => import('src/components/pages/table-operations/dialogs/SetTableFloatDialog.vue'),
    ),
    componentProps: {
      formValues: {
        cashdeskId: selectedCashDesk.value?.id,
        transactionCodeId: null,
        note: null,
        tableCountIds: selectedTableCountIds.value,
        tableIds: tableIds,
      },
    },
  }).onOk(async () => {
    await tableStore.fetchTableCounts()
    selectedTableCount.value = null
  })
}

const onClickUpdateTableGamingDate = async () => {
  if (selectedCashDesk.value?.isMain !== true) {
    Notify.create({
      message: 'Sadece Main Cashdesk ile güncellenebilir.',
      type: 'negative',
      icon: 'o_error',
      position: 'bottom-right',
    })
    return
  }
  $q.dialog({
    component: defineAsyncComponent(
      () => import('src/components/pages/table-operations/dialogs/ChangeTableGamingDate.vue'),
    ),
    componentProps: {
      tableCountIds: selectedTableCountIds.value,
    },
    transitionShow: 'slide-up',
    transitionHide: 'slide-down',
  }).onOk(async () => {
    await tableStore.fetchTableCounts()
    selectedTableCount.value = null
  })
}

const onCheckedTableCount = () => {
  const checkedTableCounts = tableStore.tableCounts.map((tableCount) => tableCount.id)
  if (checkedTableCounts.length === selectedTableCountIds.value.length) {
    selectAllTableCounts.value = true
  } else {
    selectAllTableCounts.value = false
  }
}

const onClickUpdateTableCounts = async (table) => {
  if (table.isAnyoneSit === true) {
    Notify.create({
      message: 'Masa oyuncu ile dolu olduğu için güncellenemez.',
      type: 'negative',
      icon: 'o_error',
      position: 'bottom-right',
    })
    return
  }
  const allChipDenominations = selectedTableCount.value?.chipInfoFormatted
    .map((chip) => chip.denominations)
    .flat()
  const allCashDenominations = selectedTableCount.value?.cashInfoFormatted
    .map((cash) => cash.denominations)
    .flat()

  let data = {
    tableId: selectedTableCount.value.tableId,
    floatSetId: table.floatSetId,
    cashInfo: allCashDenominations || [],
    chipInfo: allChipDenominations || [],
    cashDeskId: selectedCashDesk.value?.id,
    defaultCurrencyId: getDefaultCurrencyId.value,
  }
  $q.loading.show({
    message: 'Updating table counts...',
  })
  const result = await tableStore.updateTableCounts(data)
  if (result.status === 200) {
    Notify.create({
      message: 'Table counts updated successfully',
      type: 'positive',
      icon: 'o_check_circle',
      position: 'bottom-right',
    })
    await tableStore.fetchTableCounts()
    selectedTableCount.value = null
  }
  $q.loading.hide()
}

const onEditSavedCount = (tableCount) => {
  if (!selectedTableCount.value) {
    onSelectTableCount(tableCount)
  }
  $q.dialog({
    component: defineAsyncComponent(
      () => import('src/components/pages/table-operations/dialogs/ConfirmPassword.vue'),
    ),
    componentProps: {
      tableCountId: selectedTableCount.value.id,
    },
  }).onOk(async (payload) => {
    if (payload === true) {
      /*       console.log(selectedTableCount.value)
      await tableStore.fetchTableCounts()
      const latestTableCount = tableStore.tableCounts.find(
        (tableCount) => tableCount.id === selectedTableCount.value.id,
      )
      selectedTableCount.value = { ...latestTableCount } */
      selectedTableCount.value = {
        ...selectedTableCount.value,
        cashSaveLock: false,
      }
      tableCount.cashSaveLock = false
    }
  })
}
const onClickTableCountChipSaveEditCheck = (tableCount) => {
  if (!selectedTableCount.value) {
    onSelectTableCount(tableCount)
  }
  $q.dialog({
    componentProps: {
      tableCountId: tableCount.id,
    },
    component: defineAsyncComponent(
      () => import('src/components/pages/table-operations/dialogs/ConfirmTableCountReset.vue'),
    ),
  }).onOk(async (payload) => {
    if (payload === true) {
      tableStore.fetchTableCounts()
    }
  })
}
</script>

<style scoped>
.animateIcon {
  animation: pulse 1s infinite;
}
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}
</style>
