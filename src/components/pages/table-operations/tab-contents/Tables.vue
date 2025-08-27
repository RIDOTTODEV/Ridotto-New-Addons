<template>
  <div>
    <SupaTable
      :columns="columns"
      tableName="tables"
      :getDataFn="tableStore.fetchTables"
      :slotNames="['body-cell-actions']"
      ref="tablesTable"
    >
      <template v-slot:body-cell-actions="{ props }">
        <q-td key="actions" align="center">
          <q-btn
            unelevated
            dense
            color="grey-2"
            text-color="dark"
            no-caps
            size="12px"
            icon="fa-regular fa-pen-to-square"
            class="q-mr-md"
            @click="onClickEditTable(props.row)"
            v-el-perms="'Addon.TableOperations.Table.Update'"
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
            @click="onClickDeleteTable(props.row)"
            v-el-perms="'Addon.TableOperations.Table.Delete'"
            data-cy="deleteData"
          />
        </q-td>
      </template>

      <template v-slot:headerFilterSlots>
        <div class="col-6">
          <q-btn
            unelevated
            dense
            color="grey-2"
            text-color="dark"
            no-caps
            size="13px"
            icon="add"
            :label="$t('create')"
            @click="onClickAddTable"
          />
          <q-btn
            unelevated
            dense
            color="grey-2"
            text-color="dark"
            no-caps
            size="13px"
            icon="add"
            :label="$t('bulkUpdate')"
            @click="onClickBulkUpdate"
            class="q-ml-md"
          />
        </div>
      </template>
    </SupaTable>

    <q-dialog
      v-model="tableDialog"
      persistent
      square
      transition-show="slide-up"
      transition-hide="slide-down"
      @hide="onHideTableDialog"
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
          <q-form @submit="onSubmitTable" ref="tableForm" class="row">
            <div class="col-6 q-pa-xs">
              <q-input
                :label="$t('name')"
                dense
                outlined
                v-model="tableFormValue.name"
                :placeholder="$t('name')"
                autofocus
                clearable
                lazy-rules
                class="super-small"
                hide-bottom-space
                :rules="[(val) => (val && val.toString().length > 0) || $t('requiredField')]"
              />
            </div>
            <div class="col-6 q-pa-xs">
              <q-select-box
                v-model="tableFormValue.gameId"
                :options="games"
                :label="$t('game')"
                hide-bottom-space
                :rules="[(val) => (val && val.toString().length > 0) || $t('requiredField')]"
                option-value="id"
                option-label="name"
              />
            </div>
            <div class="col-6 q-pa-xs">
              <q-select-box
                v-model="tableFormValue.floatSetId"
                :options="floatSets"
                :label="$t('floatSet')"
                hide-bottom-space
                :rules="[(val) => (val && val.toString().length > 0) || $t('requiredField')]"
                option-value="id"
                option-label="name"
              />
            </div>
            <div class="col-6 q-pa-xs">
              <q-select
                v-model="tableFormValue.acceptedCurrencies"
                :options="getCurrenciesWithFlags"
                :label="$t('cashCurrencies')"
                multiple
                outlined
                dense
                clearable
                lazy-rules
                class="super-small"
                hide-bottom-space
                :rules="[(val) => (val && val.toString().length > 0) || $t('requiredField')]"
                map-options
                emit-value
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
                  <div class="text-subtitle2 q-mr-sm">
                    <q-img
                      :src="scope.opt.flag"
                      fit="contain"
                      width="20px"
                      height="20px"
                      class="q-mr-xs"
                    />
                    {{ scope.opt.fullName }} - {{ scope.opt.symbol }}
                  </div>
                </template>
              </q-select>
            </div>
            <div class="col-6 q-pa-xs content-end">
              <div class="text-subtitle2 q-ml-md">
                {{ $t('status') }} <span class="text-negative">*</span>
              </div>
              <q-toggle
                v-model="tableFormValue.active"
                :label="$t('active')"
                color="deep-purple"
                dense
                class="q-ml-md"
                hide-bottom-space
              />
            </div>

            <div class="col-12 q-mt-md text-right">
              <q-btn
                unelevated
                icon="save"
                color="deep-purple"
                size="md"
                :label="$t('save')"
                class="col-12"
                type="submit"
                no-caps
                no-wrap
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog
      v-model="updateBulkDialog"
      persistent
      square
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="min-width: 800px">
        <q-bar style="height: 50px" class="app-cart-grey q-card--bordered">
          <div class="text-subtitle2">
            {{ $t('updateBulkTableGame') }}
          </div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="text-subtitle1 bg-blue-grey-8">{{ $t('close') }}</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section class="q-pa-sm">
          <div class="row col-12 q-pa-xs full-width">
            <Information
              content="Masaların toplu bir şekilde oyununu,floatset'ini veya günü değiştirmek için kullanılacak."
            />
          </div>
          <div class="row">
            <div
              class="q-card--bordered q-pa-sm flex-column q-ma-xs"
              :class="{
                'current-operation': updateBulkOperation === 'tableGame',
                'text-white': updateBulkOperation === 'tableGame',
              }"
              @click="updateBulkOperation = 'tableGame'"
            >
              <q-icon name="o_casino" size="sm" />
              <div class="text-capitalize flex justify-center">Table Game</div>
              <q-popup-proxy :offset="[10, 10]" ref="tableGamePopup">
                <q-card flat square>
                  <q-card-section class="q-pa-sm">
                    <q-select-box
                      v-model="bulkUpdateTableFormValues.gameId"
                      :options="games"
                      :label="$t('game')"
                      hide-bottom-space
                      :rules="[(val) => (val && val.toString().length > 0) || $t('requiredField')]"
                      option-value="id"
                      option-label="name"
                      style="max-width: 200px"
                    />
                  </q-card-section>
                  <q-card-actions align="center">
                    <q-btn
                      unelevated
                      color="negative"
                      icon="close"
                      no-caps
                      size="13px"
                      :label="$t('cancel')"
                      @click="
                        () => {
                          tableGamePopup.hide()
                          bulkUpdateTableFormValues.gameId = null
                        }
                      "
                    />
                    <q-btn
                      unelevated
                      color="deep-purple"
                      size="13px"
                      no-caps
                      icon="save"
                      :label="$t('save')"
                      :disable="!bulkUpdateTableFormValues.gameId"
                      @click="
                        () => {
                          onSubmitBulkUpdateTableGame()
                          tableGamePopup.hide()
                        }
                      "
                    />
                  </q-card-actions>
                </q-card>
              </q-popup-proxy>
            </div>
            <div
              class="q-card--bordered q-pa-sm flex-column q-ma-xs"
              :class="{
                'current-operation': updateBulkOperation === 'tableFloatSet',
                'text-white': updateBulkOperation === 'tableFloatSet',
              }"
              @click="updateBulkOperation = 'tableFloatSet'"
            >
              <q-icon name="o_list" size="sm" />
              <div class="text-capitalize flex justify-center">Table Float Set</div>
              <q-popup-proxy :offset="[10, 10]" ref="tableFloatSetPopup">
                <q-card flat square>
                  <q-card-section class="q-pa-sm">
                    <q-select-box
                      v-model="bulkUpdateTableFormValues.floatSetId"
                      :options="floatSets"
                      :label="$t('floatSet')"
                      hide-bottom-space
                      :rules="[(val) => (val && val.toString().length > 0) || $t('requiredField')]"
                      style="min-width: 200px"
                      option-value="id"
                      option-label="name"
                    />
                  </q-card-section>
                  <q-card-actions align="center">
                    <q-btn
                      unelevated
                      color="negative"
                      icon="close"
                      no-caps
                      size="13px"
                      :label="$t('cancel')"
                      @click="
                        () => {
                          tableFloatSetPopup.hide()
                          bulkUpdateTableFormValues.floatSetId = null
                        }
                      "
                    />
                    <q-btn
                      unelevated
                      color="deep-purple"
                      size="13px"
                      no-caps
                      icon="save"
                      :label="$t('save')"
                      :disable="!bulkUpdateTableFormValues.floatSetId"
                      @click="
                        () => {
                          onSubmitBulkUpdateTableFloatSet()
                          tableFloatSetPopup.hide()
                        }
                      "
                    />
                  </q-card-actions>
                </q-card>
              </q-popup-proxy>
            </div>
          </div>
        </q-card-section>
        <q-card-section class="q-pa-sm flex row justify-start">
          <q-select-box
            v-model="bulkUpdateTableFormValues.filterGameId"
            :options="games"
            :label="$t('game')"
            hide-bottom-space
            style="min-width: 200px"
            @update:model-value="onChangeFilterBulkAction"
            option-value="id"
            option-label="name"
          />
          <q-select-box
            v-model="bulkUpdateTableFormValues.filterFloatSetId"
            :options="floatSets"
            :label="$t('floatSet')"
            hide-bottom-space
            style="min-width: 200px"
            option-value="id"
            option-label="name"
            class="q-ml-md"
            @update:model-value="onChangeFilterBulkAction"
          />
          <q-btn
            unelevated
            color="grey-2"
            text-color="dark"
            no-caps
            size="13px"
            :label="
              bulkUpdateTableFormValues.tableIds.length === tableStore.tables.length
                ? $t('unselectAll')
                : $t('selectAll')
            "
            class="q-ml-md"
            @click="
              () => {
                if (bulkUpdateTableFormValues.tableIds.length === tableStore.tables.length) {
                  bulkUpdateTableFormValues.tableIds = []
                } else {
                  bulkUpdateTableFormValues.tableIds = tableStore.tables.map((table) => table.id)
                }
              }
            "
          />
        </q-card-section>
        <q-card-section class="q-pa-sm">
          <div class="col-12 q-pa-xs">
            <q-btn
              v-for="(table, index) in tableStore.tables"
              :key="index"
              unelevated
              no-caps
              size="13px"
              :label="table.name"
              class="q-ma-sm"
              outline
              :class="{
                'bg-selected': bulkUpdateTableFormValues.tableIds.includes(table.id),
              }"
              @click="
                () => {
                  if (bulkUpdateTableFormValues.tableIds.includes(table.id)) {
                    bulkUpdateTableFormValues.tableIds.splice(
                      bulkUpdateTableFormValues.tableIds.indexOf(table.id),
                      1,
                    )
                  } else {
                    bulkUpdateTableFormValues.tableIds.push(table.id)
                  }
                }
              "
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { i18n } from 'src/boot/i18n'
import { useTableStore } from 'src/stores/table-store'
import { useCurrencyStore } from 'src/stores/currency-store'
import { storeToRefs } from 'pinia'
import SupaTable from 'src/components/atoms/SupaTable.vue'
import { useQuasar } from 'quasar'
const $q = useQuasar()
const tableStore = useTableStore()
const currencyStore = useCurrencyStore()
const { games, floatSets } = storeToRefs(tableStore)
const { getCurrenciesWithFlags } = storeToRefs(currencyStore)
tableStore.fetchTableGames()
tableStore.fetchFloatSets()
const columns = ref([
  {
    name: 'id',
    label: 'ID',
    field: 'id',
  },
  {
    field: 'name',
    label: 'Table Name',
  },
  {
    field: 'gameName',
    label: 'Game Name',
  },
  {
    field: 'active',
    fieldType: 'boolean',
  },
  {
    field: 'isDeleted',
    fieldType: 'boolean',
  },
  {
    field: 'isAnyoneSit',
    fieldType: 'boolean',
  },
  {
    field: 'acceptedCurrencies',
    fieldType: 'custom',
    format: (val) => {
      return val.map((currency) => currency.currencyName).join(', ')
    },
  },
  {
    field: 'floatSetName',
    label: 'Float Set',
  },
  {
    field: 'gamingDateName',
    label: 'Gaming Date',
  },
  {
    field: 'chipCurrencyName',
    label: 'Chip Currency',
  },
  {
    field: 'createdAt',
    fieldType: 'date',
  },
  {
    field: 'actions',
  },
])
const tableDialog = ref(false)
const tableFormValue = ref({
  id: null,
  name: '',
  gameId: null,
  floatSetId: null,
  active: false,
  acceptedCurrencies: [],
})
const tablesTable = ref(null)
const onClickEditTable = async (row) => {
  const table = await tableStore.getTable({
    id: row.id,
  })
  const acceptedCurrencies = table.acceptedCurrencies?.map((currency) => {
    let c = getCurrenciesWithFlags.value.find((c) => c.id === currency.currencyId)
    return {
      ...c,
    }
  })
  tableFormValue.value = { ...table, acceptedCurrencies }
  tableDialog.value = true
}
const onClickDeleteTable = (row) => {
  $q.dialog({
    title: 'Delete Table',
    message: 'Are you sure you want to delete this table?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    tableStore
      .deleteTable({
        id: row.id,
      })
      .then(() => {
        tablesTable.value.fetchData()
      })
  })
}
const onSubmitTable = async () => {
  let data = {
    ...tableFormValue.value,
    acceptedCurrencies: tableFormValue.value.acceptedCurrencies.map((currency) => {
      return {
        currencyId: currency.id,
        currencyName: currency.name,
      }
    }),
  }
  if (tableFormValue.value.id) {
    let updateData = {
      id: tableFormValue.value.id,
      acceptedCurrencies: data.acceptedCurrencies,
      name: data.name,
      gameId: data.gameId,
      floatSetId: data.floatSetId,
      active: data.active,
    }
    await tableStore.updateTable(updateData).then(() => {
      tableDialog.value = false
      tablesTable.value.fetchData()
    })
  } else {
    delete data.id
    await tableStore.createTable(data).then(() => {
      tableDialog.value = false
      tablesTable.value.fetchData()
    })
  }
}
const onClickAddTable = () => {
  tableDialog.value = true
}
const updateBulkDialog = ref(false)
const onClickBulkUpdate = () => {
  updateBulkDialog.value = true
}
const onHideTableDialog = () => {
  tableFormValue.value = {
    id: null,
    name: '',
    gameId: null,
    floatSetId: null,
    active: false,
    acceptedCurrencies: [],
  }
  tableDialog.value = false
}
const updateBulkOperation = ref('tableGame')
const tableFloatSetPopup = ref(null)
const tableGamePopup = ref(null)
const bulkUpdateTableFormValues = ref({
  tableIds: [],
  floatSetId: null,
  gameId: null,
  filterFloatSetId: null,
  filterGameId: null,
})

const onSubmitBulkUpdateTableFloatSet = async () => {
  if (bulkUpdateTableFormValues.value.tableIds.length === 0) {
    $q.notify({
      message: i18n.global.t('pleaseSelectTable'),
      color: 'negative',
      position: 'bottom-right',
    })
    return
  }
  await tableStore.bulkUpdateTableFloatSet({
    tableIds: bulkUpdateTableFormValues.value.tableIds,
    floatSetId: bulkUpdateTableFormValues.value.floatSetId,
  })
  updateBulkDialog.value = false
  bulkUpdateTableFormValues.value = {
    tableIds: [],
    floatSetId: null,
  }

  tablesTable.value.fetchData()
}
const onChangeFilterBulkAction = () => {
  const filterGameId = bulkUpdateTableFormValues.value.filterGameId
  const filterFloatSetId = bulkUpdateTableFormValues.value.filterFloatSetId
  const tableIds = tableStore.tables.filter((table) => {
    if (filterGameId && filterFloatSetId) {
      return table.gameId === filterGameId && table.floatSetId === filterFloatSetId
    }
    if (filterGameId) {
      return table.gameId === filterGameId
    }
    if (filterFloatSetId) {
      return table.floatSetId === filterFloatSetId
    }
    return false
  })
  bulkUpdateTableFormValues.value.tableIds = tableIds.map((table) => table.id)
}
const onSubmitBulkUpdateTableGame = async () => {
  if (bulkUpdateTableFormValues.value.tableIds.length === 0) {
    $q.notify({
      message: i18n.global.t('pleaseSelectTable'),
      color: 'negative',
      position: 'bottom-right',
    })
    return
  }
  await tableStore.bulkUpdateTableGame({
    tableIds: bulkUpdateTableFormValues.value.tableIds,
    gameId: bulkUpdateTableFormValues.value.gameId,
  })
  updateBulkDialog.value = false
  bulkUpdateTableFormValues.value = {
    tableIds: [],
    gameId: null,
  }

  tablesTable.value.fetchData()
}
</script>

<style scoped lang="scss">
.flex-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #6fa8e9;
    color: #fff;
    cursor: pointer;
  }
}
.current-operation {
  background-color: #6fa8e9;
  color: #fff;
}
.bg-selected {
  background-color: #cff2ff !important;
}
</style>
