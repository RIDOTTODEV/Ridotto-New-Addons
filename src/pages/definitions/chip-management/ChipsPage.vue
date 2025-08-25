<template>
  <q-page class="q-pa-md">
    <q-card class="no-box-shadow app-cart-grey q-mb-md">
      <q-card-section class="q-pa-none row justify-between">
        <div class="text-h6">
          {{ $t('chips') }}
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
          @click="openChipDialog"
        />
      </q-card-section>
    </q-card>
    <SupaTable
      :columns="chipColumns"
      :getDataFn="chipManagementStore.fetchChips"
      :rowsPerPage="10"
      tableName="definitionChips"
      :slotNames="['body-cell-actions', 'body-cell-color']"
      ref="chipRefTable"
    >
      <template v-slot:body-cell-color="{ props }">
        <q-td key="color" :props="props">
          <div class="text-subtitle2 flex flex-center">
            <div
              :style="{
                backgroundColor: props.row?.color,
                width: '20px',
                height: '20px',
                borderRadius: '50px',
                float: 'left',
              }"
            ></div>
            <span class="q-ml-md" style="float: left"> {{ props.row.color }}</span>
          </div>
        </q-td>
      </template>
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
            @click="onEditChip(props.row.id)"
            v-el-perms="'Addon.Definitions.Chip.Update'"
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
            @click="onDeleteChip(props.row)"
            v-el-perms="'Addon.Definitions.Chip.Delete'"
            data-cy="deleteData"
          />
        </q-td>
      </template>
    </SupaTable>

    <q-dialog
      v-model="chipDialog"
      persistent
      square
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="min-width: 800px">
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
          <q-form @submit="onSubmitChipForm" ref="form" class="row">
            <div class="col-6 q-pa-xs">
              <q-input
                :label="$t('name')"
                dense
                outlined
                v-model="chipFormValues.name"
                autofocus
                clearable
                lazy-rules
                square
                :rules="[(val) => (val && val.toString().length > 0) || $t('requiredField')]"
              />
            </div>
            <div class="col-6 q-pa-xs">
              <q-select
                :label="$t('chipColor')"
                dense
                square
                outlined
                v-model="chipFormValues.color"
                :options="chipColors"
                map-options
                emit-value
                option-label="label"
                option-value="value"
                clearable
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label class="text-capitalize row">
                        {{ scope.opt.label }}
                        <div class="text-subtitle2 q-ml-md flex items-center">
                          <div
                            :style="{
                              backgroundColor: scope.opt.value,
                              width: '20px',
                              height: '20px',
                              borderRadius: '50px',
                            }"
                          ></div>
                        </div>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
                <template v-slot:selected-item="scope">
                  <div class="row items-center">
                    <div
                      :style="{
                        backgroundColor: scope.opt.value,
                        width: '20px',
                        height: '20px',
                        borderRadius: '50px',
                      }"
                    ></div>
                    <div class="q-ml-md text-subtitle2 text-capitalize">
                      {{ scope.opt.label }}
                    </div>
                  </div>
                </template>
              </q-select>
            </div>
            <div class="col-6 q-mt-md">
              <div class="text-subtitle2">
                {{ $t('chipType') }} <span class="text-negative">*</span>
              </div>

              <q-radio
                v-for="(type, index) in gamingChipTypes"
                :key="index"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                size="lg"
                v-model="chipFormValues.type"
                color="primary"
                :val="type.name"
                :label="$t(type.name)"
              />
            </div>
            <div class="col-6 q-pa-xs">
              <q-select
                :label="$t('currency')"
                hide-bottom-space
                outlined
                dense
                square
                map-options
                emit-value
                :options="currencies"
                option-label="name"
                option-value="id"
                v-model="chipFormValues.currencyId"
                class="col-12"
                :rules="[(val) => (val && val.toString().length > 0) || $t('requiredField')]"
                :placeholder="chipFormValues.currencyId || $t('currency') + '...'"
                clearable
              />
            </div>
            <div class="col-12">
              <q-separator class="q-mt-sm q-mb-sm" />
              <div class="row">
                <div class="col-12 row flex justify-between content-end items-end">
                  <div class="text-subtitle1 text-bold">
                    {{ $t('denominations') }}
                  </div>
                  <q-btn
                    dense
                    unelevated
                    color="primary"
                    size="12px"
                    no-caps
                    @click="onHandleSubmitDenomination"
                    icon="add"
                    :label="$t('add')"
                    padding="5px"
                  />
                </div>
              </div>
              <div class="row q-mt-sm">
                <q-table
                  :rows="chipFormValues.denominations"
                  :columns="denominationColumns"
                  row-key="id"
                  class="no-box-shadow col-12 marginless sticky-header-table"
                  :rows-per-page-options="[50, 100, 200]"
                  dense
                  bordered
                  square
                  separator="cell"
                  style="max-height: 300px"
                >
                  <template v-slot:body-cell-name="props">
                    <q-td key="Name" align="center">
                      <q-input
                        type="text"
                        dense
                        outlined
                        v-model="props.row.name"
                        :placeholder="$t('name')"
                        :rules="[
                          (val) => (val && val.toString().length > 0) || $t('base.requiredField'),
                        ]"
                        square
                        class="super-small"
                        hide-bottom-space
                      >
                      </q-input>
                    </q-td>
                  </template>
                  <template v-slot:body-cell-value="props">
                    <q-td key="Value" align="center">
                      <q-input
                        type="number"
                        dense
                        outlined
                        v-model="props.row.value"
                        :placeholder="$t('value')"
                        :rules="[
                          (val) => (val && val.toString().length > 0) || $t('requiredField'),
                        ]"
                        square
                        class="super-small"
                        hide-bottom-space
                        bg-color="white"
                      />
                    </q-td>
                  </template>
                  <template v-slot:body-cell-code="props">
                    <q-td key="Code" align="center">
                      <q-input
                        type="text"
                        dense
                        outlined
                        v-model="props.row.code"
                        :placeholder="$t('code')"
                        :rules="[
                          (val) => (val && val.toString().length > 0) || $t('requiredField'),
                        ]"
                        square
                        class="super-small"
                        hide-bottom-space
                        bg-color="white"
                      />
                    </q-td>
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
                        @click="onHandleRemoveDenomination(props.rowIndex, props.row)"
                      />
                    </q-td>
                  </template>
                </q-table>
              </div>
            </div>
            <div class="col-12 q-mt-md text-right">
              <q-btn
                unelevated
                icon="save"
                color="deep-purple"
                size="md"
                :label="chipFormValues.id ? $t('update') : $t('save')"
                class="col-12"
                type="submit"
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
import { useChipManagement } from 'src/composables/definitions/useChipManagement'

const {
  chipManagementStore,
  chipFormValues,
  chipDialog,
  openChipDialog,
  onSubmitChipForm,
  onEditChip,
  onDeleteChip,
  chipColumns,
  chipRefTable,
  currencies,
  gamingChipTypes,
  denominationColumns,
  onHandleSubmitDenomination,
  onHandleRemoveDenomination,
  chipColors,
} = useChipManagement()
chipManagementStore.fetchGamingChipTypes()
</script>
