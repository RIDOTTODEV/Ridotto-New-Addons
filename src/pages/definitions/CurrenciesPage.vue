<template>
  <q-page class="q-pa-md">
    <q-card class="no-box-shadow bg-transparent q-mb-md">
      <q-card-section class="q-pa-none row justify-between">
        <div class="text-h6">
          {{ $t('currencies') }}
        </div>
      </q-card-section>
    </q-card>
    <SupaTable
      :columns="columns"
      :getDataFn="currencyStore.fetchCurrencies"
      :rowsPerPage="10"
      tableName="definitionCurrencies"
      :slotNames="['body-cell-actions']"
    >
      <template v-slot:body-cell-actions="{ props }">
        <q-td key="Action" align="center">
          <q-btn
            unelevated
            dense
            color="grey-2"
            size="13px"
            text-color="dark"
            no-caps
            icon="o_playlist_add_circle"
            class="q-mr-md"
            @click="showCurrencyDomination(props.row)"
            v-el-perms="'Addon.Definitions.Currency.CreateDenomination'"
          />
          <q-btn
            unelevated
            dense
            color="grey-2"
            size="13px"
            text-color="dark"
            no-caps
            icon="reorder"
            class="q-mr-md"
            @click="showCurrencyExchangeRates(props.row)"
            v-el-perms="'Addon.Definitions.Currency.CreateExchageRate'"
          />
          <q-btn
            unelevated
            dense
            color="grey-2"
            text-color="negative"
            size="12px"
            icon="fa-regular fa-trash-can"
            class="q-mr-sm"
            disabled
            v-el-perms="'Addon.Definitions.Cashdesk.Delete'"
            data-cy="deleteData"
          />
        </q-td>
      </template>
    </SupaTable>
    <q-card
      class="no-box-shadow q-mt-md"
      v-el-perms="'Addon.Definitions.Currency.CreateRateEffect'"
    >
      <q-card-section class="q-pa-none">
        <q-stepper
          v-model="bulkExchangeRateStep"
          ref="stepper"
          color="primary"
          animated
          class="no-box-shadow rateStepper"
          bordered
          dense
        >
          <q-step :name="1" title="Exchange Rates" icon="done" :done="bulkExchangeRateStep > 1">
            <q-markup-table square class="no-box-shadow" bordered separator="cell">
              <tr>
                <td style="border-top: 1px solid rgba(0, 0, 0, 0.12)" class="empty"></td>
                <td
                  style="border-top: 1px solid rgba(0, 0, 0, 0.12)"
                  class="text-subtitle1 text-bold"
                  v-for="(currency, index) in currencies"
                  :key="index"
                >
                  {{ currency.name }}
                </td>
              </tr>
              <tr v-for="(currency, index) in currencyExchangeUpdateBulkFormat.rates" :key="index">
                <td
                  class="text-subtitle1 text-bold"
                  style="border-top: 1px solid rgba(0, 0, 0, 0.12)"
                >
                  {{ currency.name }}
                </td>
                <td
                  style="width: 450px !important; border-top: 1px solid rgba(0, 0, 0, 0.12)"
                  v-for="(rate, rateIndex) in currency.rates"
                  :key="rateIndex"
                >
                  <q-currency-input
                    v-model="rate.rate"
                    :currency="'USD'"
                    :custom-rules="[
                      (val) => (val && val.toString().length > 0) || $t('requiredField'),
                    ]"
                    :precision="4"
                    :clearable="false"
                    :key="rateIndex"
                    :set-value="{
                      func: currencyStore.setCurrencyExchangeExRate,
                      params: rate,
                    }"
                    :show-original-value="true"
                    :usePrecision="true"
                  />
                </td>
              </tr>
            </q-markup-table>
          </q-step>
          <q-step
            :name="2"
            title="Rate Effects"
            icon="done"
            :done="bulkExchangeRateStep > 2"
            class="q-pa-none"
          >
            <q-form @submit="onSubmitBulkExchangeRate">
              <div class="row">
                <div class="col-10 flex content-center">
                  <div class="text-subtitle2">
                    Lütfen kur farklarını kontrol ediniz ve farkları gireceğiniz alanları
                    doldurunuz.
                  </div>
                </div>
                <div class="col-2 flex justify-end">
                  <q-btn color="blue-grey-8" unelevated icon="add" class="q-mr-md">
                    <q-menu transition-show="scale" transition-hide="scale">
                      <q-list style="min-width: 100px">
                        <div class="text subtitl2 text-center text-bold q-pa-sm">Cashdesk List</div>
                        <q-item
                          clickable
                          v-for="(cashDesk, index) in cashdesks"
                          :key="index"
                          @click="
                            addNewRowToBulkExchangeRate({
                              cashdeskId: cashDesk.id,
                              cashdeskName: cashDesk.name,
                              currencyId: '',
                              transactionType: '',
                              transactionCodeId: '',
                              amount: 0,
                              note: '',
                              bankAccountId: null,
                            })
                          "
                          v-close-popup
                        >
                          <q-item-section>{{ cashDesk.name }}</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </div>
              </div>
              <q-list class="rounded-borders q-mt-sm wrap">
                <q-item
                  v-for="(diff, index) in getBulkExchangeRateDifferences"
                  :key="index"
                  style="flex-wrap: wrap !important"
                  class="grey-card rounded-borders q-mb-md"
                >
                  <div class="row col-12">
                    <div class="text-subtitle1 text-bold q-ml-sm">
                      {{ diff[0]?.cashdeskName }}
                    </div>
                    <q-space />
                  </div>
                  <div class="row col-12" v-for="(item, Index) in diff" :key="Index">
                    <q-item-section>
                      <div class="row">
                        <div class="col-2 q-pl-sm q-pr-sm q-pb-sm">
                          <div class="text-subtitle2">
                            {{ $t('currency') }}
                          </div>
                          <q-select
                            outlined
                            dense
                            :options="currencies"
                            v-model="item.currencyId"
                            map-options
                            emit-value
                            option-label="name"
                            option-value="id"
                            class="super-small"
                            :rules="[
                              (val) => (val && val.toString().length > 0) || $t('requiredField'),
                            ]"
                            hide-bottom-space
                            :bg-color="$q.dark.isActive ? '' : 'white'"
                            behavior="menu"
                          />
                        </div>
                        <div class="col-2 q-pl-sm q-pr-sm q-pb-sm">
                          <div class="text-subtitle2">
                            {{ $t('transactionType') }}
                          </div>
                          <q-select
                            outlined
                            dense
                            :options="cashdeskStore.transactionTypes"
                            v-model="item.transactionType"
                            map-options
                            emit-value
                            option-label="label"
                            option-value="value"
                            class="super-small"
                            :rules="[
                              (val) => (val && val.toString().length > 0) || $t('requiredField'),
                            ]"
                            hide-bottom-space
                            :bg-color="$q.dark.isActive ? '' : 'white'"
                            behavior="menu"
                          />
                        </div>
                        <div class="col-2 q-pl-sm q-pr-sm q-pb-sm">
                          <div class="text-subtitle2">
                            {{ $t('transactionCode') }}
                          </div>
                          <!--      <q-select
                            outlined
                            dense
                            :options="transactionCodes"
                            v-model="item.transactionCodeId"
                            map-options
                            emit-value
                            option-label="name"
                            option-value="id"
                            class="super-small"
                            :rules="[
                              (val) => (val && val.toString().length > 0) || $t('requiredField'),
                            ]"
                            hide-bottom-space
                            :bg-color="$q.dark.isActive ? '' : 'white'"
                            @update:model-value="setDelayToApplyToAll($event, item.key)"
                            behavior="menu"
                          /> -->
                          <q-select-box
                            v-model="item.transactionCodeId"
                            :options="transactionCodes"
                            option-label="name"
                            option-value="id"
                            @update:model-value="setDelayToApplyToAll($event, item.key)"
                            class="bg-white"
                          />

                          <div
                            class="text-caption cursor-pointer text-blue text-right text-bold"
                            v-if="
                              item.transactionCodeId &&
                              item.key === lastSelectedTransactionCodeIndex &&
                              delayToApplyToAll > 0
                            "
                            @click="
                              currencyStore.applyAllTransactionCodeToRateEffects(
                                item.transactionCodeId,
                              )
                            "
                          >
                            apply to all
                          </div>
                        </div>
                        <div class="col-2 q-pl-sm q-pr-sm q-pb-sm">
                          <div class="text-subtitle2">
                            {{ $t('amount') }}
                          </div>
                          <q-currency-input
                            v-model="item.amount"
                            :currency="'USD'"
                            :custom-rules="[
                              (val) => (val && val.toString().length > 0) || $t('requiredField'),
                            ]"
                            :precision="2"
                            :clearable="false"
                            :key="index"
                            :bg-color="$q.dark.isActive ? '' : 'white'"
                          />
                          <div class="text-caption">
                            Before:{{ item.previousAmount }} After:{{ item.currentAmount }}
                          </div>
                        </div>
                        <div class="col-2 q-pl-sm q-pr-sm q-pb-sm">
                          <div class="text-subtitle2">
                            {{ $t('bank') }}
                          </div>
                          <q-select
                            outlined
                            dense
                            :options="getBankAccountsByCurrencyId(item.currencyId)"
                            v-model="item.bankAccountId"
                            map-options
                            emit-value
                            :option-label="(val) => (val ? val.name + ' ' + val.total : '')"
                            option-value="id"
                            class="super-small"
                            :rules="[
                              (val) => (val && val.toString().length > 0) || $t('requiredField'),
                            ]"
                            hide-bottom-space
                            :bg-color="$q.dark.isActive ? '' : 'white'"
                            behavior="menu"
                          />
                        </div>
                        <div class="col-2 q-pl-sm q-pr-sm q-pb-sm">
                          <div class="text-subtitle2">
                            {{ $t('note') }}
                          </div>
                          <q-input
                            v-model="item.note"
                            dense
                            outlined
                            class="super-small"
                            hide-bottom-space
                            :bg-color="$q.dark.isActive ? '' : 'white'"
                          />
                        </div>
                      </div>
                    </q-item-section>
                    <q-item-section top side>
                      <q-btn
                        class="q-mt-md"
                        size="12px"
                        color="negative"
                        flat
                        dense
                        round
                        icon="o_delete"
                        @click="removeBulkExchangeRateByDiff(item)"
                      />
                    </q-item-section>
                  </div>
                </q-item>
              </q-list>
              <div class="col-12 text-right q-mt-md">
                <q-btn
                  unelevated
                  color="negative"
                  label="Back"
                  icon="arrow_back"
                  type="button"
                  class="q-mr-md"
                  @click="bulkExchangeRateStep = 1"
                />
                <q-btn
                  unelevated
                  color="positive"
                  label="Save"
                  icon-right="save"
                  type="submit"
                  :disable="currencyExchangeUpdateBulkFormat.pureRates.length === 0"
                />
              </div>
            </q-form>
          </q-step>
          <template v-slot:navigation v-if="bulkExchangeRateStep === 1">
            <q-stepper-navigation class="text-right">
              <q-btn
                unelevated
                @click="saveBulkExchangeRates"
                color="primary"
                label="Save & Continue"
                icon-right="arrow_forward"
                no-caps
              />
            </q-stepper-navigation>
          </template>
        </q-stepper>
      </q-card-section>
    </q-card>
    <q-dialog v-model="exchangeRateDialog" backdrop-filter="brightness(40%)">
      <q-card class="sm:minWithDialog w-full">
        <q-bar style="height: 50px" class="app-cart-grey q-card--bordered">
          <div class="text-subtitle2">
            {{ $t('exchangeRates') }}
          </div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="text-subtitle1 bg-blue-grey-8">{{ $t('close') }}</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section class="row flex flex-col sm:flex-row gap-2 justify-between">
          <q-select
            dense
            class="fixed-field-width"
            map-options
            emit-value
            outlined
            v-model="exchangeRateFromCurrency"
            :options="currencies"
            option-label="name"
            option-value="id"
            :placeholder="$t('selectCurrency')"
            behavior="menu"
          />
          <q-btn
            unelevated
            icon="add"
            color="deep-purple"
            size="md"
            :label="$t('addNewRate')"
            type="submit"
            @click="exchangeDialog = true"
          />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-table
            :rows="exchangeRateFormValues.rates"
            :columns="rateColumns"
            row-key="id"
            class="no-box-shadow"
            :rows-per-page-options="[10, 20, 30]"
            dense
            flat
          >
            <template v-slot:header="props">
              <q-tr :props="props">
                <q-th
                  auto-width
                  v-for="col in props.cols"
                  :key="col.name"
                  :props="props"
                  class="text-center q-custom-table"
                >
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>

            <template v-slot:body-cell-Action="props">
              <q-td key="Action" align="center">
                <q-btn
                  unelevated
                  dense
                  color="negative"
                  size="10px"
                  icon="delete_forever"
                  class="q-mr-sm"
                  @click="removeCurrencyExchangeRate(props.row)"
                />
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="exchangeDialog" backdrop-filter="brightness(40%)">
      <q-card class="sm:minWithDialog w-full">
        <q-bar style="height: 50px" class="app-cart-grey q-card--bordered">
          <div class="text-subtitle2">
            {{ $t('addNewExchange') }}
          </div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="text-subtitle1 bg-blue-grey-8">{{ $t('close') }}</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <q-form @submit="onSubmitNewCurrencyExchange" ref="form" class="row">
            <div class="col-md-12 col-xs-12">
              <q-select
                :label="$t('fromCurrency')"
                dense
                map-options
                emit-value
                outlined
                v-model="exchangeRateFormValues.currency"
                :options="currencies"
                option-label="name"
                option-value="id"
                :placeholder="$t('selectCurrency')"
                clearable
                disable
                hide-bottom-space
                class="super-small"
                behavior="menu"
              />
            </div>
            <div class="col-md-12 col-xs-12 q-mt-md">
              <q-select
                :label="$t('toCurrency')"
                dense
                autofocus
                map-options
                emit-value
                outlined
                v-model="exchangeRateFormValues.toCurrency"
                :options="currencies"
                option-label="name"
                option-value="id"
                :placeholder="$t('selectCurrency')"
                :option-disable="(val) => val.id === exchangeRateFormValues.currency"
                clearable
                :rules="[(val) => (val && val.toString().length > 0) || $t('requiredField')]"
                hide-bottom-space
                class="super-small"
                behavior="menu"
              />
            </div>
            <div class="col-md-12 col-xs-12 q-mt-md">
              <q-currency-input
                :label="$t('rate')"
                v-model="exchangeRateFormValues.rate"
                :currency="'USD'"
                :custom-rules="[() => exchangeRateFormValues.rate > 0 || $t('requiredField')]"
                :placeholder="$t('discounts.minRange') + '...'"
                :autofocus="true"
                :precision="4"
                :usePrecision="true"
                hint="#00.000"
              />
            </div>

            <div class="col-md-12 col-xs-12 q-mt-md text-right">
              <q-btn
                unelevated
                icon="save"
                color="deep-purple"
                size="md"
                :label="$t('save')"
                class="col-12"
                type="submit"
                no-wrap
                no-caps
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="currencyDominationDialog" backdrop-filter="brightness(40%)">
      <q-card class="sm:minWithDialog w-full">
        <q-bar style="height: 50px" class="app-cart-grey q-card--bordered">
          <div class="text-subtitle2">
            {{ $t('currencyDenominations') }}
          </div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="text-subtitle1 bg-blue-grey-8">{{ $t('close') }}</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <div class="row">
            <div class="col-md-12 col-xs-12 q-pa-xs">
              <div class="row">
                <div class="col-md-6 col-xs-12">
                  <div class="text-subtitle1 text-bold">
                    {{ $t('denominations') }} -
                    {{ selectedCurrency.name }}
                  </div>
                </div>
                <div class="col-md-6 col-xs-12 text-right">
                  <q-input
                    dense
                    outlined
                    v-model.number="denominationFormValues.denom"
                    :placeholder="$t('addNewDenomination')"
                    autofocus
                    clearable
                    @keydown.enter.prevent="onSubmitCurrencyDenomination"
                    mask="########"
                  >
                    <template v-slot:append>
                      <q-btn
                        :label="denominationFormValues.id !== null ? $t('update') : $t('save')"
                        dense
                        unelevated
                        color="deep-purple"
                        icon="save"
                        no-caps
                        @click="onSubmitCurrencyDenomination"
                      />
                    </template>
                  </q-input>
                </div>
              </div>
            </div>
            <q-table
              :rows="getCurrencyDenominations(selectedCurrency.id)"
              :columns="denominationColumns"
              row-key="id"
              class="no-box-shadow col-md-12 col-xs-12 q-pa-xs"
              :rows-per-page-options="[100]"
              hide-bottom
              dense
            >
              <template v-slot:body-cell-Action="props">
                <q-td key="Action" align="center">
                  <q-btn
                    unelevated
                    dense
                    color="deep-purple"
                    size="10px"
                    icon="edit"
                    class="q-mr-md"
                    @click="editCurrencyDenomination(props.rowIndex, props.row)"
                  />
                  <q-btn
                    unelevated
                    dense
                    color="negative"
                    size="10px"
                    icon="delete_forever"
                    class="q-mr-sm"
                    @click="removeCurrencyDenomination(props.row)"
                  />
                </q-td>
              </template>
            </q-table>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import QSelectBox from 'src/components/atoms/QSelectBox.vue'
import { useCurrencies } from 'src/composables/definitions/useCurrencies'
const {
  currencyStore,
  columns,
  exchangeRateDialog,
  exchangeDialog,
  showCurrencyExchangeRates,
  showCurrencyDomination,
  denominationFormValues,
  selectedCurrency,
  currencyDominationDialog,
  exchangeRateFromCurrency,
  exchangeRateFormValues,
  onSubmitCurrencyDenomination,
  getCurrencyDenominations,
  denominationColumns,
  editCurrencyDenomination,
  removeCurrencyDenomination,
  rateColumns,
  currencies,
  onSubmitNewCurrencyExchange,
  removeCurrencyExchangeRate,
  bulkExchangeRateStep,
  currencyExchangeUpdateBulkFormat,
  onSubmitBulkExchangeRate,

  cashdesks,
  addNewRowToBulkExchangeRate,
  getBulkExchangeRateDifferences,
  transactionCodes,
  setDelayToApplyToAll,
  lastSelectedTransactionCodeIndex,
  delayToApplyToAll,
  getBankAccountsByCurrencyId,
  removeBulkExchangeRateByDiff,
  saveBulkExchangeRates,
  cashdeskStore,
} = useCurrencies()
</script>
<style lang="scss">
.rateStepper {
  .q-stepper__step-inner {
    padding: 5px !important;
  }
}
</style>
