<template>
  <q-page class="q-pa-md">
    <q-card flat bordered class="q-mb-sm">
      <q-card-section class="row full-width flex justify-start q-gutter-x-sm">
        <q-radio v-model="listOfType" val="customer" label="Customer" dense />
        <q-radio v-model="listOfType" val="machine" label="By Machine" dense />
      </q-card-section>
    </q-card>
    <SupaTable
      v-if="listOfType === 'customer'"
      :columns="customerColumns"
      :getDataFn="reportStore.getPlayerWinLossNew"
      :filterValues="playerWinnLossFilterValues"
      ref="playerWinLossTableRef"
      tableName="playerWinLossNewTableColumns"
      :filterParams="playerWinnLossFilterValues"
      dataKey="data"
    >
      <template v-slot:headerFilterSlots>
        <div class="col-8 flex row justify-start">
          <div class="row full-width flex justify-start">
            <div class="col-4">
              <SearchPlayerInput
                v-model="playerWinnLossFilterValues.playerId"
                :placeholder="$t('searchPlayer')"
                @onSelectPlayer="
                  (val) => {
                    if (val) {
                      playerWinnLossFilterValues.playerId = val.id
                      playerWinnLossFilterValues.playerName = val.value
                    } else {
                      playerWinnLossFilterValues.playerId = null
                      playerWinnLossFilterValues.playerName = null
                    }
                  }
                "
                :optionLabel="'value'"
                :displayedValue="playerWinnLossFilterValues.playerName"
                @onClear="
                  () => {
                    playerWinnLossFilterValues.playerId = null
                    playerWinnLossFilterValues.playerName = null
                  }
                "
                class="full-width"
              />
            </div>
            <date-time-picker
              class="q-ml-sm"
              @selected-date="
                (val) => {
                  playerWinnLossFilterValues = {
                    ...playerWinnLossFilterValues,
                    ...val,
                  }
                }
              "
            />
            <q-btn
              type="button"
              :label="$t('filter')"
              icon="tune"
              color="grey-2"
              text-color="dark"
              size="13px"
              unelevated
              no-caps
              class="q-ml-sm"
              @click="playerWinLossTableRef.fetchData()"
            />
          </div>
        </div>
      </template>

      <template v-slot:bottomRow="props">
        <q-tr :props="props">
          <q-td
            v-for="(col, index) in [...props.cols.sort((a, b) => a.orderColumn - b.orderColumn)]"
            :key="index"
            :name="col.name"
            align="center"
            :class="{
              'bg-red-1':
                col.showTotal && playerWinLossTableRef.response?.total?.[col.totalField] < 0,
              'bg-green-1':
                col.showTotal && playerWinLossTableRef.response?.total?.[col.totalField] > 0,
            }"
          >
            <div class="text-subtitle2" v-if="col.showTotal">
              {{ col.format(playerWinLossTableRef.response?.total?.[col.totalField]) }}
            </div>
            <div class="text-subtitle2" v-else>-</div>
          </q-td>
        </q-tr>
      </template>
    </SupaTable>
    <SupaTable
      v-if="listOfType === 'machine'"
      :columns="machineColumns"
      :getDataFn="reportStore.getPlayerSummaryByMachineNew"
      :filterValues="machineFilterValues"
      ref="machineTableRef"
      tableName="playerSummaryByMachineNewTableColumns"
      :filterParams="machineFilterValues"
      dataKey="data"
    >
      <template v-slot:headerFilterSlots>
        <div class="col-8 flex row justify-start">
          <div class="row full-width flex justify-start">
            <div class="col-3 q-pa-xs">
              <SearchPlayerInput
                v-model="machineFilterValues.playerId"
                :placeholder="$t('searchPlayer')"
                @onSelectPlayer="
                  (val) => {
                    if (val) {
                      machineFilterValues.playerId = val.id
                      machineFilterValues.playerName = val.value
                    } else {
                      machineFilterValues.playerId = null
                      machineFilterValues.playerName = null
                    }
                  }
                "
                :optionLabel="'value'"
                :displayedValue="machineFilterValues.playerName"
                @onClear="
                  () => {
                    machineFilterValues.playerId = null
                    machineFilterValues.playerName = null
                  }
                "
                class="full-width"
              />
            </div>
            <div class="col-3 q-pa-xs">
              <q-select-box
                v-model="machineFilterValues.slotBrand"
                :options="slotBrands"
                option-label="value"
                option-value="id"
                class="full-width"
                :label="$t('slotBrand')"
                :fetchFn="reportStore.getSlotBrands"
              />
            </div>
            <div class="col-3 q-pa-xs">
              <q-select-box
                v-model="machineFilterValues.slotModel"
                :options="slotModels"
                option-label="value"
                option-value="id"
                class="full-width"
                :label="$t('slotModel')"
                :fetchFn="reportStore.getSlotModels"
              />
            </div>
            <div class="col-3 q-pa-xs">
              <SearchMachineInput
                v-model="machineFilterValues.slotMachineId"
                :placeholder="$t('searchMachine')"
                :displayedValue="machineFilterValues.slotMachineValue"
                @onSelectMachine="
                  (val) => {
                    if (val) {
                      machineFilterValues.slotMachineId = val.id
                      machineFilterValues.slotMachineValue = val.value
                    } else {
                      machineFilterValues.slotMachineId = null
                      machineFilterValues.slotMachineValue = null
                    }
                  }
                "
                @onClear="
                  () => {
                    machineFilterValues.slotMachineId = null
                    machineFilterValues.slotMachineValue = null
                  }
                "
                class="full-width"
              />
            </div>
            <date-time-picker
              class="q-ml-sm"
              @selected-date="
                (val) => {
                  machineFilterValues = {
                    ...machineFilterValues,
                    ...val,
                  }
                }
              "
            />
            <q-btn
              type="button"
              :label="$t('filter')"
              icon="tune"
              color="grey-2"
              text-color="dark"
              size="13px"
              unelevated
              no-caps
              class="q-ml-sm"
              @click="machineTableRef.fetchData()"
            />
          </div>
        </div>
      </template>

      <template v-slot:bottomRow="props">
        <q-tr :props="props">
          <q-td
            v-for="(col, index) in [...props.cols.sort((a, b) => a.orderColumn - b.orderColumn)]"
            :key="index"
            :name="col.name"
            align="center"
            :class="{
              'bg-red-1':
                col.showTotal && machineTableRef.response?.summaries?.[col.totalField] < 0,
              'bg-green-1':
                col.showTotal && machineTableRef.response?.summaries?.[col.totalField] > 0,
            }"
          >
            <div class="text-subtitle2" v-if="col.showTotal">
              {{ col.format(machineTableRef.response?.summaries?.[col.totalField]) }}
            </div>
            <div class="text-subtitle2" v-else>-</div>
          </q-td>
        </q-tr>
      </template>
    </SupaTable>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useReportStore } from 'src/stores/report-store'
import { storeToRefs } from 'pinia'
const reportStore = useReportStore()
const { slotBrands, slotModels } = storeToRefs(reportStore)
const playerWinnLossFilterValues = ref({
  playerId: null,
  playerName: null,
})

const playerWinLossTableRef = ref(null)

const customerColumns = ref([
  {
    field: 'name',
    label: 'Player Name',
    classes: 'text-capitalize',
    name: 'playerName',
  },
  {
    field: 'category',
    label: 'Player Category',
    classes: 'text-capitalize',
  },
  {
    field: 'playerClass',
    label: 'Player Class',
    classes: 'text-capitalize',
  },
  {
    field: 'marketerName',
    label: 'Marketer',
    classes: 'text-capitalize',
  },
  {
    field: 'turnover',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'turnover',
  },
  {
    field: 'result',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'result',
  },
  {
    field: 'netResult',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'netResult',
  },
  {
    field: 'avgBet',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'avgBet',
  },
  {
    field: 'discount',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'discount',
  },
  {
    field: 'comp',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'comp',
  },
  {
    field: 'discPercentage',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'discPercentage',
  },
  {
    field: 'gamesPlayed',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'gamesPlayed',
  },
  {
    field: 'lastVisitDate',
    fieldType: 'date',
  },
])

const listOfType = ref('customer')

const machineColumns = ref([
  {
    field: 'floorNo',
    classes: 'text-capitalize',
  },
  {
    field: 'playTime',
    classes: 'text-capitalize',
  },
  {
    field: 'slotMachineBrand',
    classes: 'text-capitalize',
  },
  {
    field: 'slotMachineModel',
    classes: 'text-capitalize',
  },
  {
    field: 'sitTime',
    classes: 'text-capitalize',
    fieldType: 'date',
  },
  {
    field: 'leaveTime',
    classes: 'text-capitalize',
    fieldType: 'date',
  },
  {
    field: 'win',
    classes: 'text-capitalize',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'win',
  },
  {
    field: 'turnover',
    classes: 'text-capitalize',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'turnover',
  },
  {
    field: 'jackpot',
    classes: 'text-capitalize',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'jackpot',
  },
  {
    field: 'result',
    classes: 'text-capitalize',
    fieldType: 'priceAbs',
    showTotal: true,
    totalField: 'result',
  },
])
const machineTableRef = ref(null)
const machineFilterValues = ref({
  playerId: null,
  playerName: null,
  gamingDateId: null,
  slotMachineId: null,
  slotMachineValue: null,
  slotModel: null,
  slotBrand: null,
  isActive: null,
})
</script>

<style scoped></style>
