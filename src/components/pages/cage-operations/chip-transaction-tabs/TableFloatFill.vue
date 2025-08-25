<script setup>
import { ref } from 'vue'
import { useCashdeskStore } from 'src/stores/cashdesk-store'
import { useTransactionCodeStore } from 'src/stores/transaction-code-store'
import { useTableStore } from 'src/stores/table-store'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
import { formatPrice } from 'src/helpers/helpers'
const $q = useQuasar()
const cashDeskStore = useCashdeskStore()
const { getSelectedCashDeskId } = storeToRefs(cashDeskStore)
const transactionCodeStore = useTransactionCodeStore()
const { getTransactionCodesByGroups } = storeToRefs(transactionCodeStore)
const tableStore = useTableStore()
const { tables, getTableById } = storeToRefs(tableStore)

const tableFloat = ref([])
const tableFloatFillFormValues = ref({
  cashdeskId: +getSelectedCashDeskId.value,
  tableId: null,
  transactionCodeId: null,
  note: null,
})

const onSelectTable = async (tableId) => {
  await tableStore
    .fetchTableFloats({
      tableId: tableId,
    })
    .then((res) => {
      if (!res.length) return
      let groupedTableFloatsByChipType = res[0].tableFloatDenoms.reduce((acc, val) => {
        const chip = acc.find((i) => i.chipName === val.chipName)
        if (chip) {
          chip.denominations.push(val)
          chip.total += val.quantity * val.chipValue
        } else {
          acc.push({
            chipName: val.chipName,
            denominations: [val],
            total: val.quantity * val.chipValue,
          })
        }
        return acc
      }, [])
      tableFloat.value = groupedTableFloatsByChipType
    })
}

const onSubmitTableFloatFillForm = async () => {
  const response = await tableStore.createTableFloatFill(tableFloatFillFormValues.value)
  if (response.status === 200) {
    $q.notify({
      message: 'Transaction created successfully',
      type: 'positive',
    })
  } else {
    $q.notify({
      message: 'Transaction creation failed',
      type: 'negative',
    })
  }
}

const emits = defineEmits(['savedCageChipTransaction', 'cancel'])

tableStore.fetchTables()
</script>

<template>
  <div class="col-12">
    <q-form @submit="onSubmitTableFloatFillForm" class="q-card--bordered" ref="form">
      <div class="row">
        <div class="full-width col-12 q-pa-sm">
          <Information
            content="Table tanımlandıktan sonra float set’ teki çip miktarının table float’a aktarılması için kullanılacak."
          />
        </div>
        <div class="col-md-6 col-sm-12 col-xs-12">
          <div class="row q-mt-lg">
            <div class="col-md-6 col-sm-12 col-xs-12 q-pa-sm">
              <q-select-box
                :label="$t('table')"
                v-model="tableFloatFillFormValues.tableId"
                :options="tables"
                option-value="id"
                option-label="name"
                :rules="[(val) => !!val || $t('requiredField')]"
                @update:model-value="onSelectTable"
              />
            </div>

            <div class="col-md-6 col-sm-12 col-xs-12 q-pa-sm">
              <q-select-box
                :label="$t('transactionCode')"
                v-model="tableFloatFillFormValues.transactionCodeId"
                :options="getTransactionCodesByGroups(['FillCredit'])"
                option-value="id"
                option-label="name"
                :rules="[(val) => !!val || $t('requiredField')]"
              />
            </div>

            <div class="col-md-6 col-sm-12 col-xs-12 q-pa-sm">
              <q-input
                :label="$t('note')"
                v-model="tableFloatFillFormValues.note"
                outlined
                dense
                clearable
                class="super-small"
                data-cy="note"
              />
            </div>

            <div class="col-md-12 col-sm-12 col-xs-12 q-pa-sm flex content-end justify-start">
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
                no-caps
                no-wrap
              />
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <q-card class="col-12" flat="" v-if="tableFloat.length > 0">
            <q-card-section class="q-pa-none">
              <div class="text-bold q-ml-lg">
                Table Float:
                <span class="text-negative">{{
                  getTableById(tableFloatFillFormValues?.tableId)?.floatSetName
                }}</span>
              </div>
            </q-card-section>
            <q-card-section class="q-pt-none row">
              <div
                class="col q-pa-sm flex justify-start content-start items-start q-mb-md"
                v-for="(item, i) in tableFloat"
                :key="i"
              >
                <div class="row flex full-height full-width">
                  <div class="col-12 flex justify-between">
                    <div class="">
                      {{ item.chipName }}
                    </div>
                    <div class="q-mr-sm">
                      {{
                        formatPrice(
                          item.denominations.reduce(
                            (acc, { quantity, chipValue }) => acc + quantity * chipValue,
                            0,
                          ) || 0,
                        )
                      }}
                    </div>
                  </div>
                  <div class="col-12 full-height full-width">
                    <q-markup-table
                      class="row full-width full-height"
                      separator="cell"
                      flat
                      square
                      bordered
                      dense
                    >
                      <thead>
                        <tr>
                          <th class="grey-card text-center">Denom</th>
                          <th class="grey-card text-center">Quantity</th>
                          <th class="grey-card text-center">Amount</th>
                        </tr>
                      </thead>
                      <tbody class="denom-body">
                        <tr v-for="(denom, denomIndex) in item?.denominations" :key="denomIndex">
                          <td class="text-center cursor-not-allowed">
                            {{ denom.chipDenomName }}
                          </td>
                          <td class="text-center cursor-not-allowed">
                            {{ denom.quantity }}
                          </td>
                          <td class="text-center cursor-not-allowed">
                            {{ formatPrice(denom.quantity * denom.chipValue) }}
                          </td>
                        </tr>
                      </tbody>
                    </q-markup-table>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-form>
  </div>
</template>

<style scoped lang="scss"></style>
