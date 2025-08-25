<template>
  <q-page class="q-pa-md">
    <q-card class="no-box-shadow app-cart-grey q-mb-md">
      <q-card-section class="q-pa-none row justify-between">
        <div class="text-h6">
          {{ $t('floatSets') }}
        </div>
        <q-btn
          unelevated
          dense
          color="grey-2"
          text-color="dark"
          no-caps
          size="13px"
          icon="add"
          :label="$t('create')"
          @click="openFloatSetDialog"
        />
      </q-card-section>
    </q-card>
    <SupaTable
      :columns="floatSetColumns"
      :getDataFn="tableStore.fetchFloatSets"
      :rowsPerPage="10"
      tableName="definitionFloatSets"
      :slotNames="['body-cell-actions', 'body-cell-floatDenoms']"
      ref="floatSetRefTable"
    >
      <template v-slot:body-cell-actions="{ props }">
        <q-td key="Action" align="center">
          <q-btn
            unelevated
            dense
            color="grey-2"
            text-color="dark"
            no-caps
            size="12px"
            icon="fa-regular fa-pen-to-square"
            class="q-mr-md"
            @click="editFloatSet(props.row)"
            v-el-perms="'Addon.Definitions.FloatSet.Update'"
            data-cy="editData"
          />
          <q-btn
            unelevated
            dense
            color="grey-2"
            text-color="negative"
            size="12px"
            icon="fa-regular fa-trash-can"
            class="q-mr-sm"
            @click="deleteFloatSet(props.row)"
            v-el-perms="'Addon.Definitions.FloatSet.Delete'"
            data-cy="deleteData"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-floatDenoms="{ props }">
        <q-td key="floatDenoms" :props="props" style="width: 300px !important">
          <div class="row full-width flex justify-around">
            <div class="text-subtitle2">
              <div
                class="text-caption q-pr-sm"
                v-for="(denom, index) in props.row.floatDenoms"
                :key="index"
              >
                {{
                  denom.chipType +
                  ' (' +
                  denom?.value +
                  ' X ' +
                  denom?.quantity +
                  ') = ' +
                  ' ' +
                  denom?.amount
                }}
              </div>
            </div>
          </div>
        </q-td>
      </template>
    </SupaTable>

    <q-dialog
      v-model="floatSetDialog"
      persistent
      square
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="min-width: 1000px">
        <q-bar style="height: 50px" class="app-cart-grey q-card--bordered">
          <div class="text-subtitle2">
            {{ $t('edit') }}
          </div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="text-subtitle1 bg-blue-grey-8">{{ $t('close') }}</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section class="q-pa-sm">
          <q-form @submit="onSubmitFloatSetForm" ref="form" class="row">
            <div class="col-12">
              <q-input
                :label="$t('name')"
                dense
                outlined
                v-model="floatSetFormValues.name"
                autofocus
                clearable
                lazy-rules
                hide-bottom-space
                class="super-small"
                :rules="[(val) => (val && val.toString().length > 0) || $t('requiredField')]"
              />
            </div>
            <div class="col-12 q-mt-sm">
              <q-table
                :rows="[...floatSetFormValues.floatDenoms]"
                :columns="floatDenomColumns"
                class="no-box-shadow denomTable"
                square
                separator="cell"
                bordered
                row-key="id"
                dense
              >
                <template v-slot:body-cell-action="props">
                  <q-td key="Action" align="center">
                    <q-btn
                      unelevated
                      dense
                      color="grey-2"
                      text-color="negative"
                      no-caps
                      size="12px"
                      icon="fa-regular fa-trash-can"
                      class="q-mr-sm"
                      @click="onClickDeleteDenomination(props)"
                    />
                  </q-td>
                </template>
                <template v-slot:top>
                  <div class="col-8 flex row justify-between no-wrap">
                    <q-select
                      v-model="floatSetFormValues.currencyId"
                      :options="currencies"
                      :label="$t('currency')"
                      use-input
                      dense
                      outlined
                      clearable
                      class="super-small q-mr-sm"
                      hide-bottom-space
                      emit-value
                      map-options
                      option-label="name"
                      option-value="id"
                      @update:model-value="onChangeFloatSetCurrency"
                    />
                    <q-select
                      v-model="floatSetFormValues.selectedChip"
                      :options="floatSetChips"
                      :label="$t('title')"
                      use-input
                      dense
                      outlined
                      clearable
                      class="super-small"
                      hide-bottom-space
                      emit-value
                      map-options
                      option-label="name"
                      option-value="id"
                      :disable="!floatSetFormValues.currencyId"
                    />
                    <q-select
                      v-model="floatSetFormValues.floatDenoms"
                      :options="[...getDenominationByChipId(floatSetFormValues.selectedChip)]"
                      :label="$t('denominations')"
                      use-input
                      dense
                      outlined
                      clearable
                      class="q-ml-sm hiddenValueSelectBox super-small"
                      multiple
                      popup-content-class="height-400"
                      option-label="value"
                      :option-value="(item) => item.chipDenomId"
                      :disable="
                        floatSetFormValues.currencyId &&
                        floatSetFormValues.floatDenoms.length &&
                        floatSetFormValues.floatDenoms.some(
                          (denom) => denom.chipCurrencyId !== floatSetFormValues.currencyId,
                        )
                          ? true
                          : false
                      "
                    />
                  </div>
                </template>
                <template v-slot:body-cell-value="props">
                  <q-td key="value" align="center">
                    <div class="row no-wrap justify-center">
                      <div class="text-subtitle2 q-mr-sm">
                        {{ props.row.value }}
                      </div>
                      <div class="text-caption text-indigo text-bold">
                        {{
                          (() => {
                            const chipType = getDenominationChipType(props.row.chipDenomId)
                            return `${chipType.name} - ${chipType.type} (${chipType.currencyName})`
                          })()
                        }}
                      </div>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-quantity="props">
                  <q-td key="quantity" align="center">
                    <q-input
                      type="number"
                      dense
                      outlined
                      v-model="props.row.quantity"
                      :placeholder="$t('quantity')"
                      autofocus
                      clearable
                      lazy-rules
                      square
                      hide-bottom-space
                      class="super-small"
                      input-class="text-center"
                      style="max-width: 150px"
                      @update:model-value="
                        () => {
                          props.row.amount = +props.row.quantity * +props.row.value
                        }
                      "
                    />
                  </q-td>
                </template>
              </q-table>
            </div>
            <div class="col-12 q-mt-md text-right">
              <q-btn
                unelevated
                icon="save"
                color="deep-purple"
                size="md"
                :label="floatSetFormValues.id ? $t('update') : $t('save')"
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
  </q-page>
</template>
<script setup>
import { useTables } from 'src/composables/definitions/useTable'

const {
  floatSetFormValues,
  floatSetDialog,
  tableStore,
  onSubmitFloatSetForm,
  editFloatSet,
  deleteFloatSet,
  floatSetColumns,
  floatSetRefTable,
  openFloatSetDialog,
  floatDenomColumns,
  onClickDeleteDenomination,
  currencies,
  floatSetChips,
  onChangeFloatSetCurrency,
  chipManagementStore,
  getDenominationByChipId,
  getDenominationChipType,
} = useTables()
chipManagementStore.fetchChips()
</script>

<style scoped>
.denomTable >>> .q-table__middle {
  padding: 0px !important;
}
</style>
