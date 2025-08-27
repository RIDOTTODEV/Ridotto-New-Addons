<template>
  <q-page class="q-pa-md">
    <q-card class="no-box-shadow bg-transparent q-mb-md">
      <q-card-section class="q-pa-none row justify-between">
        <div class="text-h6">
          {{ $t('discounts') }}
        </div>
      </q-card-section>
    </q-card>
    <q-card class="no-box-shadow">
      <q-card-section>
        <q-form @submit="onSubmitForm" ref="discountForm" class="row">
          <div class="col-4 q-pa-sm">
            <q-select
              :label="$t('currency')"
              v-model="discountSettingFormValues.currencyId"
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
          </div>
          <div class="col-4 q-pa-sm">
            <q-select
              :label="$t('cashdesk')"
              v-model="discountSettingFormValues.cashdeskId"
              outlined
              dense
              :options="cashDesks"
              option-value="id"
              option-label="name"
              map-options
              emit-value
              :rules="[(val) => !!val || $t('requiredField')]"
              clearable
              class="super-small"
              popup-content-class="height-400"
              behavior="menu"
              hide-bottom-space
            />
          </div>
          <div class="col-4 q-pa-sm">
            <q-select
              :label="$t('transactionCode')"
              v-model="discountSettingFormValues.transactionCodeId"
              outlined
              dense
              :options="getTransactionCodesByGroups([])"
              option-value="id"
              option-label="name"
              map-options
              emit-value
              :rules="[(val) => !!val || $t('requiredField')]"
              clearable
              class="super-small"
              popup-content-class="height-400"
              data-cy="transactionCodeId"
              behavior="menu"
              hide-bottom-space
            />
          </div>
          <div class="col-4 q-pa-sm">
            <q-currency-input
              :label="$t('minResult')"
              v-model="discountSettingFormValues.minResult"
              :currency="'USD'"
              :placeholder="$t('discounts.minRange') + '...'"
              :autofocus="true"
              data-cy="minResult"
            />
          </div>
          <div class="col-4 q-pa-sm">
            <q-currency-input
              :label="$t('maxResult')"
              v-model="discountSettingFormValues.maxResult"
              :currency="'USD'"
              :placeholder="$t('discounts.minRange') + '...'"
              :autofocus="true"
              data-cy="maxResult"
            />
          </div>
          <div class="col-4 q-pa-sm flex content-center justify-center">
            <q-toggle
              :label="$t('systemStatus')"
              v-model="discountSettingFormValues.systemStatus"
              dense
              class="super-small"
              color="positive"
              size="lg"
            />
          </div>
          <div class="col-12 q-pa-sm q-mt-md">
            <q-table
              :columns="discountLevelsColumns"
              :rows="discountSettingFormValues.discountLevels"
              row-key="name"
              class="no-box-shadow full-width q-pa-sm"
              flat
              hide-bottom
              dense
              separator="cell"
              bordered
            >
              <template v-slot:top-left>
                <div class="text-subtitle1">
                  {{ $t('discountLevels') }}
                </div>
              </template>
              <template v-slot:top-right>
                <q-btn
                  unelevated
                  icon="add"
                  color="primary"
                  :label="$t('add')"
                  no-caps
                  no-wrap
                  dense
                  class="text-capitalize q-pr-md"
                  @click="addDiscountLevel"
                />
              </template>
              <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th
                    auto-width
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                    class="q-custom-table"
                  >
                    {{ col.label }}
                  </q-th>
                </q-tr>
              </template>
              <template v-slot:body-cell-min="props">
                <q-td :props="props" align="center" auto-width>
                  <q-currency-input
                    v-model="props.row.min"
                    :currency="'USD'"
                    :custom-rules="[
                      () => props.row.min > 0 || $t('requiredField'),
                      () => {
                        const prevRow = props.rowIndex - 1
                        if (prevRow >= 0) {
                          const prevRowMaxValue =
                            discountSettingFormValues.discountLevels[prevRow].max || 0
                          if (props.row.min > prevRowMaxValue) {
                            return true
                          } else {
                            return $t('minRangeError')
                          }
                        }
                        return true
                      },
                    ]"
                    :hide-bottom-space="true"
                    class="q-mt-xs q-mb-xs"
                    style="width: 200px"
                  />
                </q-td>
              </template>
              <template v-slot:body-cell-max="props">
                <q-td :props="props" align="center" auto-width>
                  <q-currency-input
                    v-model="props.row.max"
                    :currency="'USD'"
                    :custom-rules="[
                      () => props.row.max > 0 || $t('requiredField'),
                      () =>
                        (parseInt(props.row.max) > parseInt(props.row.min) &&
                          !props.row.infinite) ||
                        $t('minRangeError'),
                    ]"
                    :hide-bottom-space="true"
                    class="q-mt-xs q-mb-xs"
                    style="width: 200px"
                  />
                </q-td>
              </template>
              <template v-slot:body-cell-percent="props">
                <q-td :props="props" align="center" auto-width>
                  <q-input
                    v-model="props.row.percent"
                    outlined
                    dense
                    hide-bottom-space
                    class="super-small q-mt-xs q-mb-xs"
                    style="width: 200px"
                    :rules="[
                      () => props.row.percent > 0 || $t('requiredField'),
                      () => props.row.percent <= 100 || $t('percentRangeError'),
                      () => {
                        const prevRow = props.rowIndex - 1
                        if (prevRow >= 0) {
                          const prevRowPercent =
                            discountSettingFormValues.discountLevels[prevRow].percent || 0
                          if (props.row.percent > prevRowPercent) {
                            return true
                          } else {
                            return $t('percentRangeError')
                          }
                        }
                        return true
                      },
                    ]"
                  />
                </q-td>
              </template>
              <template v-slot:body-cell-infinite="props">
                <q-td :props="props" align="center" auto-width>
                  <q-toggle
                    v-model="props.row.infinite"
                    dense
                    class="super-small"
                    color="positive"
                    @update:model-value="onInfiniteChange(props.row)"
                  />
                </q-td>
              </template>
              <template v-slot:body-cell-actions="props">
                <q-td :props="props" align="center" auto-width>
                  <q-btn
                    unelevated
                    dense
                    color="negative"
                    icon="delete_forever"
                    size="13px"
                    outline
                    @click="deleteDiscountLevel(props.rowIndex)"
                  />
                </q-td>
              </template>
            </q-table>
          </div>
          <div class="col-12 q-pa-sm q-mt-md text-right">
            <q-btn
              unelevated
              color="primary"
              :label="$t('save')"
              no-caps
              no-wrap
              icon="save"
              class="text-capitalize"
              style="width: 200px"
              type="submit"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { useDiscount } from 'src/composables/definitions/useDiscount'
const {
  discountSettingFormValues,
  onSubmitForm,
  discountLevelsColumns,
  getCurrenciesWithFlags,
  deleteDiscountLevel,
  onInfiniteChange,
  addDiscountLevel,
  getTransactionCodesByGroups,
  cashDesks,
} = useDiscount()
</script>
