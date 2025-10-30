<script setup>
import { ref } from 'vue'
import { useReportStore } from 'src/stores/report-store'

const reportStore = useReportStore()
const filterValues = ref({})

const tableTaxResults = ref([])
const loadingData = ref(false)
const onSubmitFilter = async () => {
  loadingData.value = true
  const response = await reportStore.getTableTaxResult(filterValues.value)
  console.log('response', response)
  tableTaxResults.value = response
  setTimeout(() => {
    loadingData.value = false
  }, 1000)
}

const step = ref(1)

const onSubmitSave = async () => {
  console.log('tableTaxResults.value', tableTaxResults.value)
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

  <q-card flat square class="no-box-shadow">
    <q-card-section class="q-pa-none">
      <q-stepper
        v-model="step"
        ref="stepper"
        color="blue-grey-8"
        animated
        style="width: 1100px"
        class="no-box-shadow"
        header-class="app-cart-grey q-pa-xs"
        header-nav
        bordered
      >
        <q-step
          dense
          v-for="(tableTaxResult, index) in tableTaxResults"
          :key="index"
          :name="index + 1"
          :title="tableTaxResult.tableName"
          :icon="index + 1 !== step ? 'o_fiber_manual_record' : 'o_check_circle'"
        >
          <div class="row q-mt-md">
            <div class="col-6 text-center">
              <div class="row flex justify-center">
                <q-markup-table
                  separator="cell"
                  class="row"
                  flat
                  square
                  bordered
                  dense
                  style="width: 400px"
                >
                  <thead>
                    <tr>
                      <th class="grey-card text-center">Table</th>
                      <th class="grey-card text-center">Result</th>
                      <th class="grey-card text-center">Entered Result</th>
                    </tr>
                  </thead>
                  <tbody class="denom-body">
                    <tr v-for="(result, resultIndex) in tableTaxResult.results" :key="resultIndex">
                      <td class="text-center text-center">
                        {{ result.tableName }}
                      </td>
                      <td class="text-center text-center">
                        {{ result.result }}
                      </td>
                      <td class="text-left">
                        <div class="flex flex-center">
                          <div class="flex justify-start content-center items-center">
                            <div
                              class="text-subtitle2 flex justify-center content-center items-center"
                            >
                              {{ result.result }}
                              <q-icon name="east" size="20px" class="q-ml-md q-mr-md text-grey-6" />
                              {{ result.enteredResult }}
                            </div>

                            <div
                              class="text-subtitle2 q-ml-md flex justify-center content-center items-center"
                              :class="{
                                'text-red-8': result.result < result.enteredResult,
                                'text-green-8': result.result > result.enteredResult,

                                'text-grey-6': result.result === result.enteredResult,
                              }"
                            >
                              <q-icon
                                v-show="result.result != result.enteredResult"
                                :name="result.result > result.enteredResult ? 'add' : 'remove'"
                                size="20px"
                              />
                              <span>{{ Math.abs(result.result - result.enteredResult) }}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </div>
            </div>
            <div class="col-6 q-pb-md">
              <q-form @submit="onSubmitSave" ref="form" class="row">
                <div class="col-12 q-pa-xs"></div>
                <div class="col-12 q-pa-xs"></div>
                <div class="col-12 q-mt-md text-right">
                  <q-btn
                    unelevated
                    icon="save"
                    color="blue-grey-8"
                    size="md"
                    :label="$t('save')"
                    class="col-12"
                    type="submit"
                  />
                </div>
              </q-form>
            </div>
          </div>
        </q-step>
      </q-stepper>
    </q-card-section>

    <q-inner-loading
      :showing="loadingData"
      :label="$t('loading')"
      label-class="blue-grey-8"
      label-style="font-size: 1.5em"
      class="full-width full-height"
    />
    <q-card-section> </q-card-section>
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
