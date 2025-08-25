<script setup>
import { ref } from 'vue'
import { useCashdeskStore } from 'src/stores/cashdesk-store'
import { useTransactionCodeStore } from 'src/stores/transaction-code-store'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
const $q = useQuasar()
const cashDeskStore = useCashdeskStore()
const { getSelectedCashDeskId, cashdesks } = storeToRefs(cashDeskStore)
const transactionCodeStore = useTransactionCodeStore()
const { getTransactionCodesByGroups } = storeToRefs(transactionCodeStore)

const cashDeskChipTransferTabFormValues = ref({
  fromCashdeskId: +getSelectedCashDeskId.value,
  toCashdeskId: null,
  transactionCodeId: null,
  note: null,
  chips: [],
})
const cashDeskChipTransferHistoryData = ref(null)
const cashDeskChipTransferHistoryDialog = ref(false)
const onSubmitCashDeskChipTransferTabForm = async () => {
  const response = await cashDeskStore.createInOutTransferTransaction(
    cashDeskChipTransferTabFormValues.value,
  )
  if (response.status === 200) {
    $q.notify({
      message: 'Transaction created successfully',
      type: 'positive',
    })
    setTimeout(() => {
      emits('savedCageChipTransaction')
    }, 1000)
  } else {
    $q.notify({
      message: 'Transaction creation failed',
      type: 'negative',
    })
  }
}
const emits = defineEmits(['savedCageChipTransaction', 'cancel'])
</script>

<template>
  <div class="col-12">
    <q-form @submit="onSubmitCashDeskChipTransferTabForm" class="q-card--bordered" ref="form">
      <div class="row">
        <div class="col-12 q-pa-sm">
          <Information content="Kasalar arası çip transferleri  için kullanılacak." />
        </div>
        <div class="col-md-6 col-sm-12 col-xs-12 q-pa-sm">
          <div class="row q-mt-lg">
            <div class="col-md-6 q-pa-xs">
              <q-select
                :label="$t('fromCashDesk')"
                v-model="cashDeskChipTransferTabFormValues.fromCashdeskId"
                outlined
                dense
                :options="cashdesks"
                option-value="id"
                option-label="name"
                emit-value
                map-options
                :rules="[(val) => !!val || $t('requiredField')]"
                disable
                class="super-small"
                data-cy="fromCashDeskId"
                behavior="menu"
              />
            </div>
            <div class="col-md-6 q-pa-xs">
              <q-select
                :label="$t('toCashDesk')"
                v-model="cashDeskChipTransferTabFormValues.toCashdeskId"
                outlined
                dense
                :options="cashdesks"
                option-value="id"
                option-label="name"
                emit-value
                map-options
                :rules="[(val) => !!val || $t('requiredField')]"
                :option-disable="
                  (val) => val.id === cashDeskChipTransferTabFormValues.fromCashdeskId
                "
                class="super-small"
                data-cy="toCashdeskId"
                behavior="menu"
              />
            </div>
            <div class="col-md-6 q-pa-xs">
              <q-select-box
                :label="$t('transactionCode')"
                v-model="cashDeskChipTransferTabFormValues.transactionCodeId"
                :options="getTransactionCodesByGroups(['Transfer'])"
                option-value="id"
                option-label="name"
                :rules="[(val) => !!val || $t('requiredField')]"
                class="super-small"
                data-cy="transactionCodeId"
              />
            </div>
            <div class="col-md-6 q-pa-xs">
              <q-input
                :label="$t('note')"
                v-model="cashDeskChipTransferTabFormValues.note"
                outlined
                dense
                clearable
                class="super-small"
                data-cy="note"
              />
            </div>
            <div class="col-12 q-pa-xs flex content-end justify-start">
              <q-btn
                size="13px"
                color="negative"
                :label="$t('cancel')"
                icon="cancel"
                type="button"
                unelevated
                data-cy="submit"
                no-wrap
                no-caps
                class="q-mr-sm"
                @click="emits('cancel')"
              />
              <q-btn
                size="13px"
                color="primary"
                :label="$t('save')"
                icon="save"
                type="submit"
                unelevated
                data-cy="submit"
                class=""
                no-wrap
                no-caps
              />
            </div>
          </div>
        </div>
        <div class="col-md-6 col-sm-12 col-xs-12 q-pa-sm">
          <chip-grid v-model="cashDeskChipTransferTabFormValues.chips" class="full-width q-pa-xs" />
        </div>
      </div>
    </q-form>
  </div>

  <q-dialog
    v-model="cashDeskChipTransferHistoryDialog"
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
    class="historyModal"
    backdrop-filter="brightness(40%)"
    square
  >
    >
    <q-card :style="`height: ${getWindowHeight()}px!important;`">
      <q-bar style="height: 50px" class="app-cart-grey q-card--bordered">
        <div class="text-subtitle2">
          {{ $t('base.detail') }}
        </div>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="text-subtitle1 bg-blue-grey-8">{{ $t('base.close') }}</q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section class="q-pa-none">
        <!--  <base-table
          :title="$t('chips.chipStockHistory')"
          columnName="casinoChipStockInOutHistoryChipsDetail"
          class="no-box-shadow"
          square
          separator="cell"
          :data="cashDeskChipTransferHistoryData?.chips"
          :filterParams="{}"
          :showReloadData="false"
          :showSearchInput="false"
          :virtualScroll="true"
          :table-style="{ maxHeight: '400px' }"
          :rows-per-page-options="[0]"
        >
        </base-table> -->
        <q-markup-table dense separator="cell" bordered class="q-pa-md no-box-shadow">
          <thead>
            <tr>
              <th class="text-left">ChipType</th>
              <th class="text-right">Denom</th>
              <th class="text-right">Currency</th>
              <th class="text-right">Quantity</th>
              <th class="text-right">Value</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody v-if="cashDeskChipTransferHistoryData">
            <tr v-for="item in cashDeskChipTransferHistoryData" :key="item.id">
              <td class="text-left">{{ item.chipType }}</td>
              <td class="text-right">{{ item.chipDenomName }}</td>
              <td class="text-right">{{ item.currencyName }}</td>
              <td class="text-right">{{ item.quantity }}</td>
              <td class="text-right">{{ formatPrice(item.value) }}</td>
              <td class="text-right">{{ formatPrice(item.amount) }}</td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped lang="scss"></style>
