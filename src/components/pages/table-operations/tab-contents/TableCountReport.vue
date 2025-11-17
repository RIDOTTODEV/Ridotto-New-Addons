<script setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useReportStore } from 'src/stores/report-store'
import { useTableStore } from 'src/stores/table-store'
import { formatPrice } from 'src/helpers/helpers'
import html2pdf from 'html2pdf.js'
import { date as dateQuasar } from 'quasar'
const reportStore = useReportStore()
const tableStore = useTableStore()
const { tables } = storeToRefs(tableStore)
const filterValues = ref({
  tableIds: [],
  tableId: tables.value[0]?.id,
  date: new Date().toISOString().split('T')[0],
})
const reports = ref([])
onMounted(async () => {
  await tableStore.fetchTables({ MaxResultCount: 999999, SkipCount: 0 })
  filterValues.value.tableId = tables.value[0]?.id
  reports.value = await reportStore.getTableCountReport({
    tableIds: [filterValues.value.tableId],
    date: filterValues.value.date,
  })
})
const loadingData = ref(false)
const onSubmitFilter = async () => {
  const date = dateQuasar.formatDate(filterValues.value.date, 'YYYY-MM-DD')
  filterValues.value.tableIds = [filterValues.value.tableId]
  loadingData.value = true
  reports.value = await reportStore.getTableCountReport({
    ...filterValues.value,
    date: date,
  })
  setTimeout(() => {
    loadingData.value = false
  }, 1000)
}

const downloadPdf = (index) => {
  const element = document.getElementById(`table-count-report-${index}`)

  const infoElement = document.getElementById(`table-count-info-${index}`)
  infoElement.style.display = 'block'

  const downLoadBtnElement = document.getElementById(`download-btn-${index}`)
  downLoadBtnElement.style.display = 'none'

  html2pdf().from(element).save()

  setTimeout(() => {
    infoElement.style.display = 'none'
    downLoadBtnElement.style.display = 'block'
  }, 100)
}
</script>

<template>
  <q-card class="no-box-shadow" flat square>
    <q-card-section class="grid grid-cols-12">
      <div class="col-span-12 md:col-span-6">
        <div class="text-h6">
          {{ $t('tableCountReport') }}
        </div>
      </div>
      <div class="col-span-12 md:col-span-6 flex row justify-end">
        <q-select
          v-model="filterValues.tableId"
          :options="tables"
          :label="$t('tables')"
          :placeholder="$t('tables')"
          emit-value
          map-options
          option-label="name"
          option-value="id"
          class="q-mr-sm super-small"
          outlined
          dense
          hide-bottom-space
          style="width: 150px"
          clearable
          bg-color="white"
        />

        <DatePicker v-model="filterValues.date" dateFormat="yy-mm-dd" />

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
      <div
        class="full-width zoom-out-90 q-mb-md"
        :id="`table-count-report-${index}`"
        v-for="(tableCount, index) in reports"
        :key="index"
      >
        <div class="row">
          <div class="col-3">
            <div class="text-h5 text-bold">
              {{ tableCount.tableName }}
            </div>
          </div>
          <div class="col-6">
            <div class="text-h5 text-bold">
              {{ tableCount.currencyName }}
            </div>
          </div>
          <div class="col-3">
            <div class="text-h5 text-bold">
              {{ tableCount.gamingDate }}
            </div>
          </div>
        </div>
        <div class="row" v-for="(chipReport, chipIndex) in tableCount.chipReport" :key="chipIndex">
          <div class="col-3 row">
            <div class="col-3">
              <div class="row t-card"></div>
              <div class="row t-card"></div>
              <div
                class="row t-card"
                v-for="(chip, chipIndex) in chipReport.tableCountChipReports"
                :key="chipIndex"
              >
                <div
                  class="col-12 q-card--bordered q-pa-xs flex content-center justify-center text-caption"
                >
                  {{ chip.chipDenom }}
                </div>
              </div>
            </div>
            <div class="col-9">
              <div class="row t-card">
                <div
                  class="col-12 q-card--bordered q-pa-xs text-center flex content-center justify-center"
                >
                  <div class="text-caption">Opening</div>
                </div>
              </div>
              <div class="row t-card">
                <div
                  class="col-6 q-card--bordered q-pa-xs text-center flex content-center justify-center"
                >
                  <div class="text-caption">Qty</div>
                </div>
                <div
                  class="col-6 q-card--bordered q-pa-xs text-center flex content-center justify-center"
                >
                  <div class="text-caption">Value</div>
                </div>
              </div>

              <div
                class="row t-card"
                v-for="(chip, chipIndex) in chipReport.tableCountChipReports"
                :key="chipIndex"
              >
                <div
                  class="col-6 q-card--bordered q-pa-xs text-center flex content-center justify-center"
                >
                  <div class="text-caption">
                    {{ chip.openingQuantity }}
                  </div>
                </div>
                <div
                  class="col-6 q-card--bordered q-pa-xs text-center flex content-center justify-center"
                >
                  <div class="text-caption">
                    {{ chip.openingValue }}
                  </div>
                </div>
              </div>
              <div class="row t-card">
                <div class="col-6"></div>
                <div class="col-6 q-pa-xs text-center q-card--bordered">
                  <div class="text-caption">
                    {{ formatPrice(chipReport.openingValueTotal) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="row">
              <div class="col-6">
                <div class="row t-card">
                  <div
                    class="col-12 q-card--bordered q-pa-xs text-center flex content-center justify-center"
                  >
                    <div class="text-caption">Closing</div>
                  </div>
                </div>
                <div class="row t-card">
                  <div
                    class="col-6 q-card--bordered q-pa-xs text-center flex content-center justify-center"
                  >
                    <div class="text-caption">Qty</div>
                  </div>
                  <div
                    class="col-6 q-card--bordered q-pa-xs text-center flex content-center justify-center"
                  >
                    <div class="text-caption">Value</div>
                  </div>
                </div>

                <div
                  class="row t-card"
                  v-for="(chip, chipIndex) in chipReport.tableCountChipReports"
                  :key="chipIndex"
                >
                  <div
                    class="col-6 q-card--bordered q-pa-xs text-center flex content-center justify-center"
                  >
                    <div class="text-caption">
                      {{ chip.closingQuantity }}
                    </div>
                  </div>
                  <div
                    class="col-6 q-card--bordered q-pa-xs text-center flex content-center justify-center"
                  >
                    <div class="text-caption">
                      {{ chip.closingValue }}
                    </div>
                  </div>
                </div>
                <div class="row t-card">
                  <div class="col-6"></div>
                  <div class="col-6 q-pa-xs text-center q-card--bordered">
                    <div class="text-caption">
                      {{ formatPrice(chipReport.closingValueTotal) }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="row t-card">
                  <div
                    class="col-12 q-card--bordered q-pa-xs text-center flex content-center justify-center"
                  >
                    <div class="text-caption">Credit</div>
                  </div>
                </div>
                <div class="row t-card">
                  <div
                    class="col-6 q-card--bordered q-pa-xs text-center flex content-center justify-center"
                  >
                    <div class="text-caption">Qty</div>
                  </div>
                  <div
                    class="col-6 q-card--bordered q-pa-xs text-center flex content-center justify-center"
                  >
                    <div class="text-caption">Value</div>
                  </div>
                </div>

                <div
                  class="row t-card"
                  v-for="(chip, chipIndex) in chipReport.tableCountChipReports"
                  :key="chipIndex"
                >
                  <div
                    class="col-6 q-card--bordered q-pa-xs text-center flex content-center justify-center"
                  >
                    <div class="text-caption">
                      {{ chip.creditQuantity }}
                    </div>
                  </div>
                  <div
                    class="col-6 q-card--bordered q-pa-xs text-center flex content-center justify-center"
                  >
                    <div class="text-caption">
                      {{ chip.creditValue }}
                    </div>
                  </div>
                </div>
                <div class="row t-card">
                  <div class="col-6"></div>
                  <div class="col-6 q-pa-xs text-center q-card--bordered">
                    <div class="text-caption">
                      {{ formatPrice(chipReport.creditValueTotal) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-3">
            <div class="row">
              <div class="col-12">
                <div class="row t-card">
                  <div
                    class="col-12 q-card--bordered q-pa-xs text-center flex content-center justify-center"
                  >
                    <div class="text-caption">Fill</div>
                  </div>
                </div>
                <div class="row t-card">
                  <div
                    class="col-6 q-card--bordered q-pa-xs text-center flex content-center justify-center"
                  >
                    <div class="text-caption">Qty</div>
                  </div>
                  <div
                    class="col-6 q-card--bordered q-pa-xs text-center flex content-center justify-center"
                  >
                    <div class="text-caption">Value</div>
                  </div>
                </div>

                <div
                  class="row t-card"
                  v-for="(chip, chipIndex) in chipReport.tableCountChipReports"
                  :key="chipIndex"
                >
                  <div
                    class="col-6 q-card--bordered q-pa-xs text-center flex content-center justify-center"
                  >
                    <div class="text-caption">
                      {{ chip.fillQuantity }}
                    </div>
                  </div>
                  <div
                    class="col-6 q-card--bordered q-pa-xs text-center flex content-center justify-center"
                  >
                    <div class="text-caption">{{ chip.fillValue }}</div>
                  </div>
                </div>
                <div class="row t-card">
                  <div class="col-6"></div>
                  <div class="col-6 q-pa-xs text-center q-card--bordered">
                    <div class="text-caption">
                      {{ formatPrice(chipReport.fillValueTotal) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col-6">
            <div class="row">
              <div class="col-4">
                <div class="row t-card">
                  <div
                    class="col-12 q-card--bordered q-pa-xs text-center flex content-center justify-center"
                  >
                    <div class="text-caption">Plaque</div>
                  </div>
                </div>
                <div
                  class="row t-card"
                  v-for="(plaque, plaqueIndex) in tableCount.plaqueReport"
                  :key="plaqueIndex"
                >
                  <div
                    class="col-12 q-card--bordered q-pa-xs text-center flex content-center justify-center"
                  >
                    <div class="text-caption">
                      {{ plaque.plaqueDenom }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-4">
                <div class="row t-card">
                  <div
                    class="col-12 q-card--bordered q-pa-xs text-center flex content-center justify-center"
                  >
                    <div class="text-caption">Qty</div>
                  </div>
                </div>
                <div
                  class="row t-card"
                  v-for="(plaque, plaqueIndex) in tableCount.plaqueReport"
                  :key="plaqueIndex"
                >
                  <div
                    class="col-12 q-card--bordered q-pa-xs text-center flex content-center justify-center"
                  >
                    <div class="text-caption">
                      {{ plaque.quantity }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-4">
                <div class="row t-card">
                  <div
                    class="col-12 q-card--bordered q-pa-xs text-center flex content-center justify-center"
                  >
                    <div class="text-caption">Amount</div>
                  </div>
                </div>
                <div
                  class="row t-card"
                  v-for="(plaque, plaqueIndex) in tableCount.plaqueReport"
                  :key="plaqueIndex"
                >
                  <div
                    class="col-12 q-card--bordered q-pa-xs text-center flex content-center justify-center"
                  >
                    <div class="text-caption">
                      {{ plaque.amount }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row q-mt-sm">
              <div class="col-4">
                <div class="row t-card">
                  <div class="col-12 q-pa-xs text-center flex content-center justify-center">
                    <div class="text-caption">Total Plaque</div>
                  </div>
                </div>
              </div>
              <div class="col-8">
                <div class="row">
                  <div class="col-6 row t-card">
                    <div
                      class="col-12 q-card--bordered q-pa-xs text-center flex content-center justify-center"
                    ></div>
                  </div>
                  <div class="col-6 row t-card">
                    <div
                      class="col-12 q-card--bordered q-pa-xs text-center flex content-center justify-center"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-3">
            <div class="row">
              <div class="col-6">
                <div class="row t-card">
                  <div
                    class="col-12 q-pa-xs text-center flex content-center justify-center border-dashed"
                  >
                    <div class="text-caption">Doc</div>
                  </div>
                </div>
                <div
                  class="row t-card"
                  v-for="(plaque, plaqueIndex) in tableCount.plaqueReport"
                  :key="plaqueIndex"
                >
                  <div
                    class="col-12 border-dashed q-pa-xs text-center flex content-center justify-center"
                  >
                    <div class="text-caption"></div>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="row t-card">
                  <div
                    class="col-12 q-card--bordered q-pa-xs text-center flex content-center justify-center"
                  >
                    <div class="text-caption">Credit</div>
                  </div>
                </div>
                <div
                  class="row t-card"
                  v-for="(plaque, plaqueIndex) in tableCount.plaqueReport"
                  :key="plaqueIndex"
                >
                  <div
                    class="col-12 q-card--bordered q-pa-xs text-center flex content-center justify-center"
                  >
                    <div class="text-caption">
                      {{ plaque.creditQuantity * plaque.creditAmount }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row q-mt-sm">
              <div class="col-6"></div>
              <div class="col-6">
                <div class="row t-card">
                  <div
                    class="col-12 q-card--bordered q-pa-xs text-center flex content-center justify-center"
                  >
                    <div class="text-caption">
                      {{
                        formatPrice(
                          tableCount.plaqueReport.reduce(
                            (acc, plaque) => acc + plaque.creditQuantity * plaque.creditAmount,
                            0,
                          ),
                        )
                      }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-3">
            <div class="row">
              <div class="col-6">
                <div class="row t-card">
                  <div
                    class="col-12 q-pa-xs text-center flex content-center justify-center border-dashed"
                  >
                    <div class="text-caption">Doc</div>
                  </div>
                </div>
                <div
                  class="row t-card"
                  v-for="(plaque, plaqueIndex) in tableCount.plaqueReport"
                  :key="plaqueIndex"
                >
                  <div
                    class="col-12 border-dashed q-pa-xs text-center flex content-center justify-center"
                  >
                    <div class="text-caption"></div>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="row t-card">
                  <div
                    class="col-12 q-card--bordered q-pa-xs text-center flex content-center justify-center"
                  >
                    <div class="text-caption">Fill</div>
                  </div>
                </div>
                <div
                  class="row t-card"
                  v-for="(plaque, plaqueIndex) in tableCount.plaqueReport"
                  :key="plaqueIndex"
                >
                  <div
                    class="col-12 q-card--bordered q-pa-xs text-center flex content-center justify-center"
                  >
                    <div class="text-caption">
                      {{ formatPrice(plaque.fillQuantity * plaque.fillAmount) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row q-mt-sm">
              <div class="col-6"></div>
              <div class="col-6">
                <div class="row t-card">
                  <div
                    class="col-12 q-card--bordered q-pa-xs text-center flex content-center justify-center"
                  >
                    <div class="text-caption">
                      {{
                        formatPrice(
                          tableCount.plaqueReport.reduce(
                            (acc, plaque) => acc + plaque.fillQuantity * plaque.fillAmount,
                            0,
                          ),
                        )
                      }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row q-mt-md">
          <div
            class="col q-pa-xs"
            v-for="(cash, cashIndex) in tableCount.cashReport"
            :key="cashIndex"
          >
            <div class="row">
              <div class="col-4">
                <div class="row t-card">
                  <div
                    class="col-12 q-pa-xs q-card--bordered text-center flex content-center justify-center"
                  >
                    <div class="text-caption">Cash</div>
                  </div>
                </div>
              </div>
              <div class="col-4">
                <div class="row t-card">
                  <div
                    class="col-12 q-pa-xs q-card--bordered text-center flex content-center justify-center"
                  >
                    <div class="text-caption">Qty</div>
                  </div>
                </div>
              </div>
              <div class="col-4">
                <div class="row t-card">
                  <div
                    class="col-12 q-pa-xs q-card--bordered text-center flex content-center justify-center"
                  >
                    <div class="text-caption">
                      {{ cash.currencyName }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                <div
                  class="row t-card"
                  v-for="(report, reportIndex) in cash.cashReports"
                  :key="reportIndex"
                >
                  <div
                    class="col-12 q-card--bordered q-pa-xs text-center flex content-center justify-center"
                  >
                    <div class="text-caption">
                      {{ report.currencyDenom }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-4">
                <div
                  class="row t-card"
                  v-for="(report, reportIndex) in cash.cashReports"
                  :key="reportIndex"
                >
                  <div
                    class="col-12 q-card--bordered q-pa-xs text-center flex content-center justify-center"
                  >
                    <div class="text-caption">
                      {{ report.quantity }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-4">
                <div
                  class="row t-card"
                  v-for="(report, reportIndex) in cash.cashReports"
                  :key="reportIndex"
                >
                  <div
                    class="col-12 q-card--bordered q-pa-xs text-center flex content-center justify-center"
                  >
                    <div class="text-caption">
                      {{ formatPrice(report.amount) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row q-mt-md">
              <div class="col-6"></div>
              <div class="col-6 flex justify-start content-center items-center">
                <div class="text-caption q-mr-md text-bold">
                  {{ cash.currencyName }}
                </div>
                <div class="col t-card">
                  <div
                    class="col-12 q-card--bordered q-pa-xs text-center flex content-center justify-center"
                  >
                    <div class="text-caption">
                      {{ formatPrice(cash.totalAmount) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-3 flex flex-center">
            <div
              class="row text-center flex content-center justify-center q-card--bordered"
              style="min-width: 150px"
            >
              <div class="col-12 text-caption border-bottom">Click Count</div>

              <div class="col-12" style="height: 100px"></div>
            </div>
          </div>
        </div>
        <div class="q-mt-md" :id="`table-count-info-${index}`" style="display: none">
          <div class="row">
            <div class="col-8">
              <div class="row">
                <div class="col-2"></div>
                <div class="col">
                  <div
                    class="t-card q-card--bordered q-pa-xs text-center flex content-center justify-center"
                  >
                    <div class="text-caption text-bold">Pit Boss</div>
                  </div>
                </div>
                <div class="col">
                  <div
                    class="t-card q-card--bordered q-pa-xs text-center flex content-center justify-center"
                  >
                    <div class="text-caption text-bold">Inspector</div>
                  </div>
                </div>
                <div class="col">
                  <div
                    class="t-card q-card--bordered q-pa-xs text-center flex content-center justify-center"
                  >
                    <div class="text-caption text-bold">Dealer</div>
                  </div>
                </div>
                <div class="col">
                  <div
                    class="t-card q-card--bordered q-pa-xs text-center flex content-center justify-center"
                  >
                    <div class="text-caption text-bold">Cashier</div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-2">
                  <div
                    class="full-height q-card--bordered q-pa-xs text-center flex content-center justify-center"
                  >
                    <div class="text-caption text-bold">Opening</div>
                  </div>
                </div>
                <div class="col-10">
                  <div class="row">
                    <div class="col">
                      <div
                        class="t-card q-card--bordered q-pa-xs text-center flex content-center justify-center"
                      >
                        <div class="text-caption">Name</div>
                      </div>
                    </div>
                    <div class="col">
                      <div
                        class="t-card q-card--bordered q-pa-xs text-center flex content-center justify-center"
                      >
                        <div class="text-caption">Name</div>
                      </div>
                    </div>
                    <div class="col">
                      <div
                        class="t-card q-card--bordered q-pa-xs text-center flex content-center justify-center"
                      >
                        <div class="text-caption">Name</div>
                      </div>
                    </div>
                    <div class="col">
                      <div
                        class="t-card q-card--bordered q-pa-xs text-center flex content-center justify-center"
                      >
                        <div class="text-caption">Name</div>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <div class="t-card q-card--bordered q-pa-xs text-left">
                        <div class="text-caption">Sign</div>
                      </div>
                    </div>
                    <div class="col">
                      <div class="t-card q-card--bordered q-pa-xs text-left">
                        <div class="text-caption">Sign</div>
                      </div>
                    </div>
                    <div class="col">
                      <div class="t-card q-card--bordered q-pa-xs text-left">
                        <div class="text-caption">Sign</div>
                      </div>
                    </div>
                    <div class="col">
                      <div class="t-card q-card--bordered q-pa-xs text-left">
                        <div class="text-caption">Sign</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-2">
                  <div
                    class="full-height q-card--bordered q-pa-xs text-center flex content-center justify-center"
                  >
                    <div class="text-caption text-bold">Closing</div>
                  </div>
                </div>
                <div class="col-10">
                  <div class="row">
                    <div class="col">
                      <div
                        class="t-card q-card--bordered q-pa-xs text-center flex content-center justify-center"
                      >
                        <div class="text-caption">Name</div>
                      </div>
                    </div>
                    <div class="col">
                      <div
                        class="t-card q-card--bordered q-pa-xs text-center flex content-center justify-center"
                      >
                        <div class="text-caption">Name</div>
                      </div>
                    </div>
                    <div class="col">
                      <div
                        class="t-card q-card--bordered q-pa-xs text-center flex content-center justify-center"
                      >
                        <div class="text-caption">Name</div>
                      </div>
                    </div>
                    <div class="col">
                      <div
                        class="t-card q-card--bordered q-pa-xs text-center flex content-center justify-center"
                      >
                        <div class="text-caption">Name</div>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <div class="t-card q-card--bordered q-pa-xs text-left">
                        <div class="text-caption">Sign</div>
                      </div>
                    </div>
                    <div class="col">
                      <div class="t-card q-card--bordered q-pa-xs text-left">
                        <div class="text-caption">Sign</div>
                      </div>
                    </div>
                    <div class="col">
                      <div class="t-card q-card--bordered q-pa-xs text-left">
                        <div class="text-caption">Sign</div>
                      </div>
                    </div>
                    <div class="col">
                      <div class="t-card q-card--bordered q-pa-xs text-left">
                        <div class="text-caption">Sign</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-2">
                  <div
                    class="full-height q-card--bordered q-pa-xs text-center flex content-center justify-center"
                  >
                    <div class="text-caption text-bold">Count</div>
                  </div>
                </div>
                <div class="col-10">
                  <div class="row">
                    <div class="col">
                      <div
                        class="t-card q-card--bordered q-pa-xs text-center flex content-center justify-center"
                      >
                        <div class="text-caption">Name</div>
                      </div>
                    </div>
                    <div class="col">
                      <div
                        class="t-card q-card--bordered q-pa-xs text-center flex content-center justify-center"
                      >
                        <div class="text-caption">Name</div>
                      </div>
                    </div>
                    <div class="col">
                      <div
                        class="t-card q-card--bordered q-pa-xs text-center flex content-center justify-center"
                      >
                        <div class="text-caption">Name</div>
                      </div>
                    </div>
                    <div class="col">
                      <div
                        class="t-card q-card--bordered q-pa-xs text-center flex content-center justify-center"
                      >
                        <div class="text-caption">Name</div>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <div class="t-card q-card--bordered q-pa-xs text-left">
                        <div class="text-caption">Sign</div>
                      </div>
                    </div>
                    <div class="col">
                      <div class="t-card q-card--bordered q-pa-xs text-left">
                        <div class="text-caption">Sign</div>
                      </div>
                    </div>
                    <div class="col">
                      <div class="t-card q-card--bordered q-pa-xs text-left">
                        <div class="text-caption">Sign</div>
                      </div>
                    </div>
                    <div class="col">
                      <div class="t-card q-card--bordered q-pa-xs text-left">
                        <div class="text-caption">Sign</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-4">
              <div class="row flex justify-center">
                <div class="col-3 text-caption flex content-end">Drop</div>
                <div class="col-6">
                  <div class="row">
                    <div
                      class="col-12 t-card q-card--bordered q-pa-xs text-center flex content-center justify-center"
                    >
                      <div class="text-caption"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row flex justify-center">
                <div class="col-3 text-caption flex content-end">Credit</div>
                <div class="col-6">
                  <div class="row">
                    <div
                      class="col-12 t-card q-card--bordered q-pa-xs text-center flex content-center justify-center"
                    >
                      <div class="text-caption"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row flex justify-center">
                <div class="col-3 text-caption flex content-end">Fill</div>
                <div class="col-6">
                  <div class="row">
                    <div
                      class="col-12 t-card q-card--bordered q-pa-xs text-center flex content-center justify-center"
                    >
                      <div class="text-caption"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row flex justify-center">
                <div class="col-3 text-caption flex content-end">Result</div>
                <div class="col-6">
                  <div class="row">
                    <div
                      class="col-12 t-card q-card--bordered q-pa-xs text-center flex content-center justify-center"
                    >
                      <div class="text-caption"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row q-mt-md justify-end">
          <q-btn
            :label="$t('downloadPdf')"
            color="green-9"
            unelevated
            no-caps
            no-wrap
            icon="o_file_download"
            @click="downloadPdf(index)"
            class="q-mr-sm"
            :id="`download-btn-${index}`"
          />
        </div>
      </div>
    </q-card-section>

    <q-inner-loading
      :showing="loadingData"
      :label="$t('loading')"
      label-class="blue-grey-8"
      label-style="font-size: 1.5em"
      class="full-width full-height"
    />
  </q-card>

  <Information
    class="full-width q-pl-md q-pr-md q-pt-md"
    content="Live Game masalarının kapanış raporlarını verir. Closing değerine göre  credit ve fill bilgisi hesaplanır ve ona göre çip tamamlama işlemi yapılır."
  />
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
