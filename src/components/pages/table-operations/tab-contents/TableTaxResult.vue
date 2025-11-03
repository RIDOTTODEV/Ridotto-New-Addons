<script setup>
import { ref } from 'vue'
import { useReportStore } from 'src/stores/report-store'
import { Notify } from 'quasar'

const reportStore = useReportStore()
const filterValues = ref({})

const tableTaxData = ref([])
const tableTaxPages = ref([])
const loadingData = ref(false)
const onSubmitFilter = async () => {
  loadingData.value = true
  const response = await reportStore.getTableTaxResult(filterValues.value)
  tableTaxData.value = response.data
  tableTaxPages.value = response.pages
  setTimeout(() => {
    loadingData.value = false
    tab.value = tableTaxPages.value[0]?.value
  }, 1000)
}

const splitterModel = ref(20)
const tab = ref()

const onTabChange = (value) => {
  const gamingDateId = tableTaxPages.value.find((page) => page.value === value)?.id
  if (gamingDateId) {
    getDateData(gamingDateId)
  }
}
const getDateData = async (gamingDateId) => {
  loadingData.value = true
  const filterData = {
    ...filterValues.value,
    gamingDateId: gamingDateId,
  }
  const response = await reportStore.getTableTaxResult(filterData)
  tableTaxData.value = response.data
  setTimeout(() => {
    loadingData.value = false
  }, 1000)
}

const onSave = async () => {
  const response = await reportStore.createOrUpdateTableTaxResult(tableTaxData.value)
  console.log(response)
  if (response.status === 200) {
    Notify.create({
      position: 'bottom-right',
      type: 'positive',
      message: 'Table tax result saved successfully.',
    })
  } else {
    Notify.create({
      position: 'bottom-right',
      type: 'negative',
      message: 'Table tax result save failed.',
    })
  }
  const currentTabId = tableTaxPages.value.find((page) => page.value === tab.value)?.id
  setTimeout(() => {
    getDateData(currentTabId)
  }, 1000)
}
</script>

<template>
  <q-card class="no-box-shadow" flat>
    <q-card-section class="row">
      <div class="col-6">
        <div class="text-h6">
          {{ $t('tableTaxResult') }}
        </div>
      </div>
      <div class="col-6 flex row justify-end">
        <date-time-picker v-model="filterValues" dateFormat="yy-mm-dd" />
        <q-btn
          type="button"
          :label="$t('filter')"
          icon="tune"
          color="grey-2"
          text-color="dark"
          size="13px"
          unelevated
          no-caps
          @click="onSubmitFilter"
          class="q-ml-sm"
        />
      </div>
    </q-card-section>
  </q-card>

  <q-card flat square class="no-box-shadow" v-if="tableTaxPages.length > 0">
    <q-inner-loading
      :showing="loadingData"
      :label="$t('loading')"
      label-class="blue-grey-8"
      label-style="font-size: 1.5em"
      class="flex content-center items-center justify-center"
    />
    <q-card-section class="q-pa-none">
      <q-splitter v-model="splitterModel" style="height: 800px">
        <template v-slot:before>
          <q-tabs
            v-model="tab"
            vertical
            active-color="blue-grey-8"
            indicator-color="blue-grey-8"
            active-bg-color="grey-2"
            no-caps
            inline-label
            dense
            shrink
            @update:model-value="onTabChange"
          >
            <q-tab
              :name="tableTaxPage.value"
              :label="tableTaxPage.value"
              v-for="(tableTaxPage, index) in tableTaxPages"
              :key="index"
              class="q-card--bordered q-ma-xs"
            />
          </q-tabs>
        </template>

        <template v-slot:after>
          <q-tab-panels
            v-model="tab"
            animated
            swipeable
            vertical
            transition-prev="jump-up"
            transition-next="jump-up"
            dense
          >
            <q-tab-panel
              :name="tableTaxPage.value"
              v-for="(tableTaxPage, index) in tableTaxPages"
              :key="index"
              class="q-pt-none"
            >
              <div
                class="text-subtitle1 text-bold app-cart-grey q-card--bordered flex content-center items-center justify-center"
                style="height: 36px !important"
              >
                {{ tableTaxPage.value }}
              </div>
              <div class="row q-mt-md">
                <q-markup-table separator="cell" class="full-width" flat square bordered dense>
                  <thead>
                    <tr>
                      <th class="grey-card text-center">Table</th>
                      <th class="grey-card text-center">Net Result</th>
                      <th class="grey-card text-center">Gross Result</th>
                    </tr>
                  </thead>
                  <tbody class="denom-body">
                    <tr v-for="(result, resultIndex) in tableTaxData" :key="resultIndex">
                      <td class="text-center text-center">
                        {{ result.tableName }}
                      </td>
                      <td class="text-center text-center">
                        {{ $priceAbs(result.netResult) }}
                      </td>
                      <td class="text-left" style="width: 600px !important">
                        <div class="row">
                          <div class="col-4">
                            <q-currency-input
                              v-model="result.grossResult"
                              :currency="'USD'"
                              :custom-rules="[
                                (val) => (val && val.toString().length > 0) || $t('requiredField'),
                              ]"
                              :precision="2"
                              :clearable="true"
                              :key="resultIndex"
                            />
                          </div>
                          <div class="col-8 flex content-center items-center">
                            <div
                              class="row flex content-center items-center full-width q-pl-md q-pr-md"
                            >
                              <div class="col-4">
                                <div
                                  class="text-subtitle2 flex justify-between content-center items-center"
                                >
                                  {{ $priceAbs(result.netResult) }}
                                  <q-icon name="east" size="20px" class="text-grey-6" />
                                </div>
                              </div>
                              <div class="col-4 text-center">
                                <div class="text-subtitle2">
                                  {{ $priceAbs(result.grossResult) }}
                                </div>
                              </div>
                              <div class="col-4">
                                <div
                                  class="text-subtitle2 q-ml-md flex justify-start content-center items-center"
                                  :class="{
                                    'text-green-8':
                                      Math.abs(result.netResult || 0) -
                                        Math.abs(result.grossResult || 0) >=
                                      0,
                                    'text-grey-6':
                                      Math.abs(result.grossResult || 0) ===
                                      Math.abs(result.netResult || 0),
                                  }"
                                >
                                  <q-icon
                                    v-show="result.grossResult != result.netResult"
                                    :name="result.grossResult > result.netResult ? 'add' : 'remove'"
                                    size="20px"
                                  />

                                  <span>{{
                                    $priceAbs(
                                      Math.abs(result.netResult || 0) -
                                        Math.abs(result.grossResult || 0),
                                    )
                                  }}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </div>
              <div class="row flex justify-end q-mt-md">
                <q-btn
                  unelevated
                  icon="save"
                  color="blue-grey-8"
                  size="md"
                  :label="$t('save')"
                  type="button"
                  @click="onSave"
                />
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </template>
      </q-splitter>
    </q-card-section>
  </q-card>
</template>

<style lang="scss">
.q-table:has(.customTableBody) > tbody > tr:first-child::after {
  content: '\0a0';
  line-height: 3em;
}

.q-stepper__step-inner {
  padding: 0px !important;
}
.table-count-report-table .q-table > thead {
  border-style: none !important;
}
.table-count-report-table .q-table > thead {
  border-style: none !important;
}

.table-count-report-table div .q-table > tbody > tr > td {
  /*  border-bottom-width: 0px !important; */
}

.table-count-report-table div .q-table > thead > tr > th {
  border-bottom-width: 0px;
}
.q-table:has(.customTableBody) > tbody > tr:first-child::after {
  content: '\0a0';
  line-height: 3em;
}

.border-left {
  border-left: 1px solid rgba(0, 0, 0, 0.12) !important;
}

.border-right {
  border-right: 1px solid rgba(0, 0, 0, 0.12) !important;
}
.border-top {
  border-top: 1px solid rgba(0, 0, 0, 0.12) !important;
}
.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
}
.border-dashed {
  border-bottom: 1px dashed rgba(0, 0, 0, 0.12) !important;
}

.t-card {
  height: 30px !important;
}
.zoom-out-90 {
  transform: scale(0.9);
  transform-origin: top center;
}
</style>
