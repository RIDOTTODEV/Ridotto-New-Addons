<script setup>
import { ref } from 'vue'
import { useChipManagementStore } from 'src/stores/chip-management-store'
import { storeToRefs } from 'pinia'
import { formatPrice } from 'src/helpers/helpers'
const chipManagementStore = useChipManagementStore()
const { chipTransactionTypes } = storeToRefs(chipManagementStore)

const createChipStockTransfer = ref(false)
const chipStockTransaferFilterFields = ref({})
const chipStockRefTable = ref(null)
const chipStockColumns = ref([
  {
    field: 'id',
    label: 'id',
  },
  {
    field: 'createdAt',
    fieldType: 'date',
  },
  {
    field: 'transactionType',
  },
  {
    field: 'note',
  },
  {
    field: 'amount',
    fieldType: 'price',
  },
  {
    field: 'chips',
  },
])
const chipStockFormValues = ref({
  transactionType: 'ChipIn',
  note: null,
  chips: [],
})
const onSubmitChipStockForm = () => {
  chipManagementStore.chipStockInOut(chipStockFormValues.value)
  createChipStockTransfer.value = false
  chipStockFormValues.value = {
    transactionType: 'ChipIn',
    note: null,
    chips: [],
  }
}
const chipStockChipsDetailDialog = ref(false)
const chipStockChipsDetailDialogData = ref(null)
</script>

<template>
  <q-card class="bg-transparent">
    <q-card-section>
      <div class="row">
        <div class="col-6">
          <div class="text-h6">
            {{ $t('chipStockTransfer') }}
          </div>
        </div>
        <div class="col-6 text-right flex content-center justify-end">
          <q-btn
            size="13px"
            color="blue-grey-8"
            text-color="white"
            :label="$t('create')"
            icon="add"
            unelevated
            no-caps
            @click="createChipStockTransfer = true"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
  <q-card class="q-mb-sm app-cart-grey" flat>
    <q-card-section class="q-pl-md q-pr-md q-pt-none q-pb-none">
      <Information
        class="full-width"
        content="Casino çip girişi yapıldıktan sonra buradan kasalara transfer edilmeli  bu işlemin kaydı kasa transactiolarında olacaktır."
      />
    </q-card-section>
  </q-card>
  <q-card flat class="q-pa-none" v-el-perms="'Addon.ChipOperations.Tab.InOutCreate'">
    <transition name="slide-fade" mode="out-in">
      <q-card-section class="q-pa-md" v-if="createChipStockTransfer">
        <div class="col-12 q-mb-sm">
          <Information :content="$t('chipStockInformation')" />
        </div>
        <fieldset class="q-pa-md row">
          <legend class="text-subtitle2 q-pl-md q-pr-md">{{ $t('chipStockForm') }}</legend>
          <q-form @submit="onSubmitChipStockForm" class="col-12 row input-box" ref="form">
            <div class="row col-12 q-pa-xs">
              <div class="col-3 q-pa-md">
                <q-select
                  :label="$t('transactionType')"
                  v-model="chipStockFormValues.transactionType"
                  outlined
                  dense
                  :options="chipTransactionTypes"
                  option-value="value"
                  option-label="label"
                  emit-value
                  map-options
                  :rules="[(val) => !!val || $t('requiredField')]"
                  hide-bottom-space
                  class="super-small"
                  data-cy="transactionType"
                  behavior="menu"
                />
              </div>
              <div class="col-3 q-pa-md">
                <q-input
                  :label="$t('note')"
                  v-model="chipStockFormValues.note"
                  outlined
                  dense
                  clearable
                  class="super-small"
                  data-cy="note"
                />
              </div>
              <div class="col-3 q-pa-md flex content-end justify-start">
                <q-btn
                  size="13px"
                  color="negative"
                  class="q-mr-md"
                  :label="$t('cancel')"
                  icon="close"
                  unelevated
                  no-caps
                  @click="createChipStockTransfer = false"
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
                  no-caps
                  no-wrap
                />
              </div>
            </div>
            <chip-grid v-model="chipStockFormValues.chips" class="full-width q-pa-xs" />
          </q-form>
        </fieldset>
      </q-card-section>
      <q-card-section class="q-pa-md" v-else>
        <div class="col-12" v-el-perms="'Addon.ChipOperations.Tab.InOutFilter'">
          <SupaTable
            :columns="chipStockColumns"
            :getDataFn="chipManagementStore.getChipStockHistories"
            :rowsPerPage="10"
            tableName="chipStock"
            ref="chipStockRefTable"
            :filterParams="chipStockTransaferFilterFields"
            square
            :slot-names="['body-cell-chips']"
          >
            <template v-slot:headerFilterSlots>
              <div class="col-6 q-pl-sm q-mr-sm flex row justify-start">
                <div class="text-h6 q-ml-md text-bold">
                  {{ $t('total') }}:
                  <span class="text-negative">
                    {{ formatPrice(chipStockRefTable?.response?.totals) }}
                  </span>
                </div>
              </div>
            </template>
            <template v-slot:body-cell-chips="{ props }">
              <q-td :props="props" align="center">
                <q-btn
                  size="12px"
                  color="primary"
                  flat
                  icon="o_info"
                  unelevated
                  no-caps
                  dense
                  @click="
                    () => {
                      chipStockChipsDetailDialog = true
                      chipStockChipsDetailDialogData = props.row
                    }
                  "
                />
              </q-td>
            </template>
          </SupaTable>
        </div>
      </q-card-section>
    </transition>
  </q-card>

  <q-dialog
    v-model="chipStockChipsDetailDialog"
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
    class="historyModal"
    backdrop-filter="brightness(40%)"
    square
  >
    >
    <q-card :style="`height: ${$getWindowHeight}px!important;`" class="q-pa-none">
      <q-bar style="height: 50px" class="app-cart-grey q-card--bordered">
        <div class="text-subtitle2">
          {{ $t('detail') }}
        </div>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="text-caption bg-blue-grey-8">{{ $t('close') }}</q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section class="q-pa-md">
        <div class="row">
          <div class="col-12 q-pa-md">
            <chip-detail-table
              :chips="chipStockChipsDetailDialogData.chips"
              :header="['chipDenomId', 'chipType', 'chipDenomName', 'value', 'quantity', 'amount']"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped lang="scss"></style>
