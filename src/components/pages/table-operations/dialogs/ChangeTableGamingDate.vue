<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    persistent
    square
    transition-show="slide-up"
    transition-hide="slide-down"
    maximized
  >
    <q-card style="min-width: 800px">
      <q-bar style="height: 45px" class="app-cart-grey q-card--bordered">
        <div class="text-subtitle2">
          {{ $t('changeTableGamingDate') }}
        </div>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="text-subtitle1 bg-blue-grey-8">{{ $t('close') }}</q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section class="q-pa-sm">
        <div class="flex justify-center">
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
              v-for="(tableCount, index) in tableCounts"
              :key="index"
              :name="index + 1"
              :title="tableCount.tableName"
              :icon="index + 1 !== step ? 'o_fiber_manual_record' : 'o_check_circle'"
            >
              <div class="full-width q-pl-sm q-pr-sm" :id="`table-count-report-${index}`">
                <div class="row q-mt-sm form-container" :id="`form-container-${index}`">
                  <q-form @submit="onSave" class="full-width row">
                    <div class="col-6"></div>
                    <div class="col-6 flex justify-end content-end items-end">
                      <div class="col-8">
                        <q-checkbox
                          v-model="skipTableFloatCheck"
                          :label="$t('skipTableFloatCheck')"
                          dense
                          class="q-mr-sm col-12"
                          :value="true"
                          :false-value="false"
                        />
                        <q-input
                          v-model="tableCount.note"
                          :label="$t('note')"
                          outlined
                          dense
                          class="super-small q-mr-sm col-12"
                          style="min-width: 350px"
                          autofocus
                        />
                      </div>
                      <q-btn
                        @click="onSave()"
                        color="blue-grey-8"
                        :label="$t('save')"
                        icon="o_save"
                        class="q-mr-sm"
                        unelevated
                        no-caps
                        no-wrap
                        size="13px"
                      />
                      <q-btn
                        color="green-9"
                        unelevated
                        no-caps
                        no-wrap
                        icon="o_file_download"
                        @click="downloadPdf()"
                        size="13px"
                      >
                        <q-tooltip class="text-caption bg-blue-grey-8">{{
                          $t('downloadPdf')
                        }}</q-tooltip>
                      </q-btn>
                    </div>
                  </q-form>
                </div>
                <div class="row q-mt-sm">
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
                <div
                  class="row"
                  v-for="(chipReport, chipIndex) in tableCount.chipReport"
                  :key="chipIndex"
                >
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
                          <div
                            class="col-12 q-pa-xs text-center flex content-center justify-center"
                          >
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
                                    (acc, plaque) =>
                                      acc + plaque.creditQuantity * plaque.creditAmount,
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
              </div>
            </q-step>
          </q-stepper>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDialogPluginComponent, Notify } from 'quasar'
import html2pdf from 'html2pdf.js'
import { formatPrice } from 'src/helpers/helpers'
import { useTableStore } from 'src/stores/table-store'
import { useReportStore } from 'src/stores/report-store'
const tableStore = useTableStore()
const reportStore = useReportStore()
const props = defineProps({
  tableCountIds: {
    type: Array,
    required: true,
    default: () => [],
  },
})

defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()

const step = ref(1)
const stepper = ref(null)

const tableCounts = ref([])
onMounted(async () => {
  tableCounts.value = await reportStore.getTableCounts({
    tableCountIds: [...props.tableCountIds],
  })
})

const downloadPdf = () => {
  const index = step.value - 1
  const element = document.getElementById(`table-count-report-${index}`)

  const infoElement = document.getElementById(`table-count-info-${index}`)
  infoElement.style.display = 'block'

  const formElement = document.getElementById(`form-container-${index}`)
  formElement.style.display = 'none'

  html2pdf().from(element).save()

  setTimeout(() => {
    infoElement.style.display = 'none'
    formElement.style.display = 'block'
  }, 100)
}
const skipTableFloatCheck = ref(true)
const onSave = async () => {
  const tableCount = tableCounts.value[step.value - 1]
  const params = {
    tableId: tableCount.tableId,
    gamingDateId: tableCount.gamingDateId,
    floatSetId: tableCount.floatSetId,
    skipTableFloatCheck: skipTableFloatCheck.value,
  }
  const result = await tableStore.changeGamingDateTable([params])

  if (result.status === 200) {
    skipTableFloatCheck.value = true
    tableCounts.value = tableCounts.value.filter(
      (tableCount) => tableCount.tableId !== params.tableId,
    )
    if (tableCounts.value.length > 0) {
      if (step.value === tableCounts.value.length) {
        stepper.value.previous()
      } else {
        step.value = 1
      }
    } else {
      onDialogOK()
    }
  } else {
    Notify.create({
      position: 'bottom-right',
      type: 'negative',
      message: result.message,
    })
  }
}
</script>
<style lang="scss">
.q-stepper__step-inner {
  padding: 0px !important;
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

.q-stepper__header--contracted .q-stepper__tab {
  padding: 12px 0px !important;
}
.q-stepper__header--standard-labels .q-stepper__tab {
  min-height: 45px !important;
}
.q-stepper__header--contracted {
  min-height: 45px !important;
}

.q-stepper__header--border {
  border-bottom: none !important;
}
</style>
