<script setup>
import { ref } from 'vue'
import { useReportStore } from 'src/stores/report-store'
import { Notify } from 'quasar'

const reportStore = useReportStore()
const filterValues = ref({})

const tableTaxData = ref([])
const tableTaxPages = ref([])
const currentTab = ref()
const onSubmitFilter = async () => {
  const response = await reportStore.getTableTaxResult(filterValues.value)
  tableTaxData.value = response.data
  tableTaxPages.value = response.pages
  currentTab.value = tableTaxPages.value[0]
}

const onTabChange = (tab) => {
  currentTab.value = tab
  getDateData(tab?.id)
}
const getDateData = async (gamingDateId) => {
  const filterData = {
    ...filterValues.value,
    gamingDateId: gamingDateId,
  }
  const response = await reportStore.getTableTaxResult(filterData)
  tableTaxData.value = response.data
  setTimeout(() => {}, 1000)
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
  const currentTabId = currentTab.value?.id
  getDateData(currentTabId)
}
</script>

<template>
  <q-card class="no-box-shadow" flat>
    <q-card-section class="row flex flex-col md:flex-row">
      <div class="col-md-6 col-xs-12">
        <div class="text-h6">
          {{ $t('tableTaxResult') }}
        </div>
      </div>
      <div class="col-md-6 col-xs-12 flex row justify-end">
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

  <q-card flat square class="q-mt-md" v-if="tableTaxPages.length > 0">
    <q-card-section class="q-pa-md">
      <div class="row">
        <div class="col-md-3 col-xs-12">
          <q-scroll-area style="height: 600px">
            <div
              class="q-card--bordered q-ma-xs q-pa-sm cursor-pointer"
              v-for="(tableTaxPage, index) in tableTaxPages"
              :key="index"
              @click="onTabChange(tableTaxPage)"
              :class="{ 'current-tab': currentTab?.id === tableTaxPage.id }"
            >
              <div class="text-subtitle2 text-center">{{ tableTaxPage.value }}</div>
            </div>
          </q-scroll-area>
        </div>
        <div class="col-md-8 col-xs-12 q-ma-xs xs:bg-[#f3f6f9]">
          <div
            class="text-subtitle1 text-bold app-cart-grey q-card--bordered flex content-center items-center justify-center"
            style="height: 36px !important"
          >
            {{ currentTab.value }}
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
                  <td class="text-left">
                    <div class="row">
                      <div class="col-md-4 col-xs-12">
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
                      <div class="col-md-8 col-xs-12 flex content-center items-center">
                        <div
                          class="row flex content-center items-center full-width q-pl-md q-pr-md"
                        >
                          <div class="col-md-4 col-xs-12">
                            <div
                              class="text-subtitle2 flex justify-between content-center items-center"
                            >
                              {{ $priceAbs(result.netResult) }}
                              <q-icon name="east" size="20px" class="text-grey-6 block xs:hidden" />
                            </div>
                          </div>
                          <div class="col-md-4 col-xs-12 text-center">
                            <div class="text-subtitle2">
                              {{ $priceAbs(result.grossResult) }}
                            </div>
                          </div>
                          <div class="col-md-4 col-xs-12">
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
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<style lang="scss">
.current-tab {
  background-color: #f3f6f9;
  border-right: 3px solid #426280;
}
</style>
