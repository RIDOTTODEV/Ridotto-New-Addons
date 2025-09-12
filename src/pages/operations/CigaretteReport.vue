<template>
  <q-page class="q-pa-md">
    <div class="flex justify-between q-mb-xs">
      <div class="text-subtitle1">
        {{ $t('cigaretteReport') }}
      </div>
      <q-btn
        v-el-perms="'Addon.CigaretteReport.Settings'"
        icon="o_settings"
        color="blue-grey-8"
        text-color="white"
        unelevated
        no-caps
        @click="onClickCigaretteReportSettings"
        class="q-card--bordered"
      >
        <q-tooltip class="text-subtitle2 bg-blue-grey-8">{{
          $t('cigaretteReportSettings')
        }}</q-tooltip>
      </q-btn>
    </div>
    <SupaTable
      :columns="columns"
      :getDataFn="getCigaretteReport"
      :filterValues="filterValues"
      ref="cigaretteReportTable"
      tableName="cigaretteReportColumns"
      :filterParams="filterValues"
      :slotNames="['body-cell-playerFullName']"
    >
      <template v-slot:headerFilterSlots>
        <div class="col-8 flex row justify-start">
          <div class="row full-width flex justify-start">
            <SearchPlayerInput
              v-model="filterValues.playerId"
              :placeholder="$t('searchPlayer')"
              @onSelectPlayer="onSelectPlayer"
              :optionLabel="'value'"
              :displayedValue="filterValues.playerName"
              @onClear="onClearPlayer"
            />
            <q-input
              v-model="filterValues.CreatedByName"
              :placeholder="$t('createdByName')"
              outlined
              dense
              clearable
              class="q-ml-sm super-small"
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
              @click="cigaretteReportTable.fetchData()"
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
    </SupaTable>
  </q-page>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'
import { posApi } from 'src/boot/axios'
import { useAuthStore } from 'src/stores/auth-store'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
const $q = useQuasar()
const authStore = useAuthStore()
const { addonGeneralSettings } = storeToRefs(authStore)
const filterValues = ref({
  playerId: null,
  TagIds: addonGeneralSettings.value.sigaretteReportTags,
  CreatedByName: null,
})
const onSelectPlayer = (val) => {
  if (val) {
    filterValues.value.playerId = val.id
    filterValues.value.playerName = val.value
  } else {
    filterValues.value.playerId = null
    filterValues.value.playerName = null
  }
}
const onClearPlayer = () => {
  filterValues.value.playerId = null
  filterValues.value.playerName = null
}
const cigaretteReportTable = ref(null)

const columns = ref([
  {
    field: 'createAt',
    fieldType: 'date',
    label: 'Date',
  },
  {
    field: 'playerName',
    label: 'Player Name',
  },
  {
    field: 'productName',
    label: 'Product Name',
  },
  {
    field: 'quantity',
  },
  {
    field: 'createdByName',
  },
  {
    field: 'playerId',
  },
])
const getCigaretteReport = async () => {
  const searchParams = new URLSearchParams()
  if (filterValues.value.TagIds && Array.isArray(filterValues.value.TagIds)) {
    filterValues.value.TagIds.forEach((id) => {
      searchParams.append('TagIds', id)
    })
  }
  Object.entries(filterValues.value).forEach(([key, value]) => {
    if (key !== 'TagIds' && value !== null && value !== undefined && value !== '') {
      searchParams.append(key, value)
    }
  })
  const { data } = await posApi.get('/api/Report/GetOrdersByTag', {
    params: searchParams,
  })
  return data
}
const onClickCigaretteReportSettings = () => {
  $q.dialog({
    component: defineAsyncComponent(
      () => import('src/components/pages/operations/CigaretteReportSettingsModal.vue'),
    ),
  })
}
</script>

<style scoped></style>
