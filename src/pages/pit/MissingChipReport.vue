<template>
  <q-page class="q-pa-md">
    <SupaTable
      :columns="columns"
      :getDataFn="reportStore.getMissingChipReport"
      ref="missingChipReportTable"
      tableName="missingChipReportColumns"
      :filterParams="filterValues"
      :slotNames="['body-cell-playerFullName', 'body-cell-chips', 'body-cell-actions']"
      dataKey="players"
    >
      <template v-slot:headerFilterSlots>
        <div class="col-6 flex row justify-start">
          <div class="row full-width flex justify-start">
            <SearchPlayerInput
              v-model="filterValues.playerId"
              :placeholder="$t('searchPlayer')"
              @onSelectPlayer="onSelectPlayer"
              :optionLabel="'value'"
              :displayedValue="filterValues.playerName"
              @onClear="onClearPlayer"
            />
            <date-time-picker
              class="q-ml-sm"
              @selected-date="
                (val) => {
                  filterValues = {
                    ...filterValues,
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
              @click="missingChipReportTable.fetchData()"
            />
          </div>
        </div>
      </template>
      <template v-slot:body-cell-playerFullName="{ props }">
        <q-td :props="props">
          <span
            v-player-detail="props.row.playerId"
            :label="props.row.playerFullName"
            class="onHoverPlayerName"
          >
            {{ props.row.playerFullName }}
          </span>
        </q-td>
      </template>
      <template v-slot:body-cell-chips="{ props }">
        <q-td :props="props">
          <q-btn
            size="13px"
            color="grey-2"
            text-color="dark"
            unelevated
            dense
            @click="onClickShowChipDetails(props.row)"
            icon="search"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-actions="{ props }">
        <q-td :props="props">
          <q-btn
            size="13px"
            color="grey-2"
            text-color="dark"
            unelevated
            dense
            @click="
              () => {
                showMissingChipDetail(props.row)
              }
            "
            icon="search"
          />
        </q-td>
      </template>
    </SupaTable>

    <q-dialog
      maximized
      v-model="showMissingChipDetailDialog"
      transition-show="slide-up"
      transition-hide="slide-down"
      :class="maximized ? '' : 'historyModal'"
      backdrop-filter="brightness(40%)"
    >
      <q-card
        class="app-content-bg"
        :style="maximized ? '' : `height: ${$getWindowHeight}px!important;`"
      >
        <q-bar>
          <q-space />
          <q-btn dense flat icon="minimize" v-close-popup>
            <q-tooltip class="bg-white text-primary">Minimize</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="crop_square" @click="maximized = !maximized">
            <q-tooltip class="bg-white text-primary">Maximize</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <SupaTable
            :columns="missingChipDetailColumns"
            :getDataFn="reportStore.getMissingChipDetailReport"
            ref="missingChipDetailReportTable"
            tableName="missingChipDetailReportColumns"
            :filterParams="missingChipDetailFilterValues"
            :slotNames="['body-cell-playerFullName', 'body-cell-chips']"
            dataKey="chipInOuts"
          >
            <template v-slot:body-cell-playerFullName="{ props }">
              <q-td :props="props">
                <span
                  v-player-detail="props.row.playerId"
                  :label="props.row.playerFullName"
                  class="onHoverPlayerName"
                >
                  {{ props.row.playerFullName }}
                </span>
              </q-td>
            </template>
            <template v-slot:body-cell-chips="{ props }">
              <q-td :props="props">
                <q-btn
                  size="13px"
                  color="grey-2"
                  text-color="dark"
                  unelevated
                  dense
                  @click="onClickShowChipDetails(props.row)"
                  icon="search"
                />
              </q-td>
            </template>
          </SupaTable>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog
      maximized
      v-model="showChipDetailsDialog"
      transition-show="slide-up"
      transition-hide="slide-down"
      :class="maximized ? '' : 'historyModal'"
      backdrop-filter="brightness(40%)"
    >
      <q-card
        class="app-content-bg"
        :style="maximized ? '' : `height: ${$getWindowHeight}px!important;`"
      >
        <q-bar>
          <q-space />
          <q-btn dense flat icon="minimize" v-close-popup>
            <q-tooltip class="bg-white text-primary">Minimize</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="crop_square" @click="maximized = !maximized">
            <q-tooltip class="bg-white text-primary">Maximize</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <q-markup-table dense square class="q-ma-none" flat bordered separator="cell">
            <thead>
              <tr class="app-card-grey">
                <th class="text-center">Chip Denom Id</th>
                <th class="text-center">Chip Denom Name</th>
                <th class="text-center">Denom Code</th>
                <th class="text-center">Type</th>
                <th class="text-center">Quantity</th>
                <th class="text-center">Value</th>
                <th class="text-center">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in chipDetails" :key="index">
                <td class="text-center">{{ item.chipDenomId }}</td>
                <td class="text-center">{{ item.denomName }}</td>
                <td class="text-center">{{ item.denomCode }}</td>
                <td class="text-center">{{ item.type }}</td>
                <td class="text-center">{{ item.quantity }}</td>
                <td class="text-center">{{ formatPrice(item.chipValue) }}</td>
                <td class="text-center">{{ formatPrice(item.amount) }}</td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useReportStore } from 'src/stores/report-store'
import { formatPrice } from 'src/helpers/helpers'
const reportStore = useReportStore()
const filterValues = ref({
  playerId: null,
  playerName: null,
})
const missingChipDetailFilterValues = ref({
  playerId: null,
  playerName: null,
})
const onSelectPlayer = (val) => {
  filterValues.value.playerId = val.id
  filterValues.value.playerName = val.value
}
const onClearPlayer = () => {
  filterValues.value.playerId = null
  filterValues.value.playerName = null
}
const missingChipReportTable = ref(null)
const maximized = ref(false)

const columns = ref([
  {
    field: 'playerFullName',
    label: 'Player Name',
  },
  {
    field: 'playerId',
  },
  {
    field: 'chips',
  },
  {
    field: 'chipsInPocket',
    fieldType: 'price',
  },
  {
    field: 'actions',
  },
])
const missingChipDetailColumns = ref([
  {
    field: 'playerFullName',
    label: 'Player Name',
  },
  {
    field: 'playerId',
  },
  {
    field: 'gamingDateName',
    label: 'Gaming Date',
  },
  {
    field: 'chips',
  },
  {
    field: 'chipsInPocket',
    fieldType: 'price',
  },
  {
    field: 'actions',
  },
])

const showMissingChipDetailDialog = ref(false)

const showMissingChipDetail = async (row) => {
  missingChipDetailFilterValues.value = {
    ...filterValues.value,
    PlayerId: row.playerId,
  }
  showMissingChipDetailDialog.value = true
}

const showChipDetailsDialog = ref(false)

const chipDetails = ref(null)

const onClickShowChipDetails = (row) => {
  chipDetails.value = row?.chips
  showChipDetailsDialog.value = true
}
const missingChipDetailReportTable = ref(null)
</script>

<style scoped></style>
