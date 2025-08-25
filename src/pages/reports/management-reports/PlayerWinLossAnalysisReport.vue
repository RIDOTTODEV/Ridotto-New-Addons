<template>
  <q-page class="q-pa-md" style="background-color: #bac6da">
    <q-card flat bordered>
      <q-card-section>
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
            @click="getPlayerWinLossAnalysisReport"
          />
        </div>
      </q-card-section>
    </q-card>
    <q-card flat class="bg-transparent q-mt-sm">
      <q-card-section class="row">
        <div class="col-6">
          <fieldset style="border: 1px solid #ffffff !important; padding: 10px">
            <legend class="text-subtitle1">Gaming Details</legend>
            <div class="row q-pa-sm">
              <div class="col-3">
                <div class="text-subtitle1"></div>
              </div>
              <div class="col-3 text-center">
                <div class="text-subtitle1">TOTAL</div>
              </div>
              <div class="col-3 text-center">
                <div class="text-subtitle1">LG</div>
              </div>
              <div class="col-3 text-center">
                <div class="text-subtitle1">SLOT</div>
              </div>
            </div>
            <div class="row">
              <div class="col-2 q-pa-xs">
                <div class="text-subtitle1">Count</div>
              </div>
              <div class="col text-center q-pa-xs">
                <div class="text-subtitle1">
                  <q-input
                    v-model="reportData.totalInfo.count"
                    :model-value="reportData.totalInfo.count"
                    class="super-small"
                    outlined
                    dense
                    bg-color="white"
                    hide-bottom-space
                  />
                </div>
              </div>
              <div class="col text-center q-pa-xs">
                <q-input
                  v-model="reportData.liveGameInfo.count"
                  :model-value="reportData.liveGameInfo.count"
                  class="super-small"
                  outlined
                  dense
                  bg-color="white"
                  hide-bottom-space
                />
              </div>
              <div class="col text-center q-pa-xs">
                <div class="text-subtitle1">
                  <q-input
                    v-model="reportData.slotInfo.count"
                    :model-value="reportData.slotInfo.count"
                    class="super-small"
                    outlined
                    dense
                    bg-color="white"
                    hide-bottom-space
                  />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-2 q-pa-xs">
                <div class="text-subtitle1">Drop</div>
              </div>
              <div class="col text-center q-pa-xs">
                <div class="text-subtitle1">
                  <q-input
                    v-model="reportData.totalInfo.drop"
                    :model-value="formatPrice(reportData.totalInfo.drop)"
                    class="super-small"
                    outlined
                    dense
                    bg-color="orange-1"
                    hide-bottom-space
                  />
                </div>
              </div>
              <div class="col text-center q-pa-xs">
                <q-input
                  v-model="reportData.liveGameInfo.drop"
                  :model-value="formatPrice(reportData.liveGameInfo.drop)"
                  class="super-small"
                  outlined
                  dense
                  bg-color="orange-1"
                  hide-bottom-space
                />
              </div>
              <div class="col text-center q-pa-xs">
                <div class="text-subtitle1">
                  <q-input
                    v-model="reportData.slotInfo.drop"
                    :model-value="formatPrice(reportData.slotInfo.drop)"
                    class="super-small"
                    outlined
                    dense
                    bg-color="orange-1"
                    hide-bottom-space
                  />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-2 q-pa-xs">
                <div class="text-subtitle1">Result</div>
              </div>
              <div class="col text-center q-pa-xs">
                <div class="text-subtitle1">
                  <q-input
                    v-model="reportData.totalInfo.result"
                    :model-value="formatPrice(reportData.totalInfo.result)"
                    class="super-small"
                    outlined
                    dense
                    bg-color="green-1"
                    hide-bottom-space
                  />
                </div>
              </div>
              <div class="col text-center q-pa-xs">
                <q-input
                  v-model="reportData.liveGameInfo.result"
                  :model-value="formatPrice(reportData.liveGameInfo.result)"
                  class="super-small"
                  outlined
                  dense
                  bg-color="green-1"
                  hide-bottom-space
                />
              </div>
              <div class="col text-center q-pa-xs">
                <div class="text-subtitle1">
                  <q-input
                    v-model="reportData.slotInfo.result"
                    :model-value="formatPrice(reportData.slotInfo.result)"
                    class="super-small"
                    outlined
                    dense
                    bg-color="green-1"
                    hide-bottom-space
                  />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-2 q-pa-xs">
                <div class="text-subtitle1">Avg.Drop</div>
              </div>
              <div class="col text-center q-pa-xs">
                <div class="text-subtitle1">
                  <q-input
                    v-model="reportData.totalInfo.avgDrop"
                    :model-value="formatPrice(reportData.totalInfo.avgDrop)"
                    class="super-small"
                    outlined
                    dense
                    bg-color="deep-purple-1"
                    hide-bottom-space
                  />
                </div>
              </div>
              <div class="col text-center q-pa-xs">
                <q-input
                  v-model="reportData.liveGameInfo.avgDrop"
                  :model-value="formatPrice(reportData.liveGameInfo.avgDrop)"
                  class="super-small"
                  outlined
                  dense
                  bg-color="deep-purple-1"
                  hide-bottom-space
                />
              </div>
              <div class="col text-center q-pa-xs">
                <div class="text-subtitle1">
                  <q-input
                    v-model="reportData.slotInfo.avgDrop"
                    :model-value="formatPrice(reportData.slotInfo.avgDrop)"
                    class="super-small"
                    outlined
                    dense
                    bg-color="deep-purple-1"
                    hide-bottom-space
                  />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-2 q-pa-xs">
                <div class="text-subtitle1">Avg.Result</div>
              </div>
              <div class="col text-center q-pa-xs">
                <div class="text-subtitle1">
                  <q-input
                    v-model="reportData.totalInfo.avgResult"
                    :model-value="formatPrice(reportData.totalInfo.avgResult)"
                    class="super-small"
                    outlined
                    dense
                    bg-color="brown-1"
                    hide-bottom-space
                  />
                </div>
              </div>
              <div class="col text-center q-pa-xs">
                <q-input
                  v-model="reportData.liveGameInfo.avgResult"
                  :model-value="formatPrice(reportData.liveGameInfo.avgResult)"
                  class="super-small"
                  outlined
                  dense
                  bg-color="brown-1"
                  hide-bottom-space
                />
              </div>
              <div class="col text-center q-pa-xs">
                <div class="text-subtitle1">
                  <q-input
                    v-model="reportData.slotInfo.avgResult"
                    :model-value="formatPrice(reportData.slotInfo.avgResult)"
                    class="super-small"
                    outlined
                    dense
                    bg-color="brown-1"
                    hide-bottom-space
                  />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-2 q-pa-xs">
                <div class="text-subtitle1">Hold %</div>
              </div>
              <div class="col text-center q-pa-xs">
                <div class="text-subtitle1">
                  <q-input
                    v-model="reportData.totalInfo.hold"
                    :model-value="formatPrice(reportData.totalInfo.hold)"
                    class="super-small"
                    outlined
                    dense
                    bg-color="orange-1"
                    hide-bottom-space
                  />
                </div>
              </div>
              <div class="col text-center q-pa-xs">
                <q-input
                  v-model="reportData.liveGameInfo.hold"
                  :model-value="formatPrice(reportData.liveGameInfo.hold)"
                  class="super-small"
                  outlined
                  dense
                  bg-color="orange-1"
                  hide-bottom-space
                />
              </div>
              <div class="col text-center q-pa-xs">
                <div class="text-subtitle1">
                  <q-input
                    v-model="reportData.slotInfo.hold"
                    :model-value="formatPrice(reportData.slotInfo.hold)"
                    class="super-small"
                    outlined
                    dense
                    bg-color="orange-1"
                    hide-bottom-space
                  />
                </div>
              </div>
            </div>
            <div class="row q-mt-sm">
              <div class="col-2 q-pa-xs">
                <div class="text-subtitle1"></div>
              </div>
              <div class="col text-center q-pa-xs">
                <div class="text-subtitle1">
                  <div class="text-subtitle2">Real Hold %</div>
                  <q-input
                    v-model="reportData.realHold"
                    :model-value="formatPrice(reportData.realHold)"
                    class="super-small"
                    outlined
                    dense
                    bg-color="red-5"
                    text-color="white"
                    hide-bottom-space
                  />
                </div>
              </div>
              <div class="col text-center q-pa-xs">
                <div class="text-subtitle2">With Comp %</div>
                <q-input
                  v-model="reportData.withComp"
                  :model-value="formatPrice(reportData.withComp)"
                  class="super-small"
                  outlined
                  dense
                  bg-color="red-5"
                  text-color="white"
                  hide-bottom-space
                />
              </div>
              <div class="col text-center q-pa-xs">
                <div class="text-subtitle1">
                  <div class="text-subtitle2">Real Disc %</div>
                  <q-input
                    v-model="reportData.realDisc"
                    :model-value="formatPrice(reportData.realDisc)"
                    class="super-small"
                    outlined
                    dense
                    bg-color="red-5"
                    text-color="white"
                    hide-bottom-space
                  />
                </div>
              </div>
            </div>
          </fieldset>
        </div>
        <div class="col-6">
          <fieldset style="border: 1px solid #ffffff !important; padding: 10px">
            <legend class="text-subtitle1">Expense Details</legend>
            <div class="row q-pa-sm">
              <div class="col-3">
                <div class="text-subtitle1"></div>
              </div>
              <div class="col">
                <div class="text-subtitle1">
                  {{ reportData.expenseDetails.hotelReservationCount }} Visits
                </div>
              </div>
            </div>
            <div
              class="row q-pa-sm"
              v-for="(expense, index) in reportData.expenseDetails.expenses"
              :key="index"
            >
              <div class="col-3">
                <div class="text-subtitle1">
                  {{ expense.expenseName }}
                </div>
              </div>
              <div class="col">
                <q-input
                  v-model="expense.amount"
                  :model-value="formatPrice(expense.amount)"
                  class="super-small"
                  outlined
                  dense
                  bg-color="white"
                  hide-bottom-space
                />
              </div>
            </div>
          </fieldset>
        </div>
        <div class="col-12">
          <fieldset style="border: 1px solid #ffffff !important; padding: 10px">
            <legend class="text-subtitle1">Casino Wins</legend>
            <div class="row q-pa-sm">
              <div class="col-6">
                <div class="row">
                  <div class="col-4 q-pa-xs">
                    <div class="text-subtitle2">Discount</div>
                    <q-input
                      v-model="reportData.discount"
                      :model-value="formatPrice(reportData.discount)"
                      class="super-small"
                      outlined
                      dense
                      bg-color="white"
                      hide-bottom-space
                    />
                  </div>
                  <div class="col-4 q-pa-xs">
                    <div class="text-subtitle2">Comp</div>
                    <q-input
                      v-model="reportData.comp"
                      :model-value="formatPrice(reportData.comp)"
                      class="super-small"
                      outlined
                      dense
                      bg-color="white"
                      hide-bottom-space
                    />
                  </div>
                  <div class="col-4 q-pa-xs">
                    <div class="text-subtitle2">Aft (Disc & Comp)</div>
                    <q-input
                      v-model="reportData.afterDiscountComp"
                      :model-value="formatPrice(reportData.afterDiscountComp)"
                      class="super-small"
                      outlined
                      dense
                      bg-color="white"
                      hide-bottom-space
                    />
                  </div>
                  <div class="col-4 q-pa-xs">
                    <div class="text-subtitle2">Total Expense</div>
                    <q-input
                      v-model="reportData.totalExpense"
                      :model-value="formatPrice(reportData.totalExpense)"
                      class="super-small"
                      outlined
                      dense
                      bg-color="white"
                      hide-bottom-space
                    />
                  </div>
                  <div class="col-4 q-pa-xs">
                    <div class="text-subtitle2">Afer Expense</div>
                    <q-input
                      v-model="reportData.afterExpense"
                      :model-value="formatPrice(reportData.afterExpense)"
                      class="super-small"
                      outlined
                      dense
                      bg-color="white"
                      hide-bottom-space
                    />
                  </div>
                  <div class="col-4 q-pa-xs">
                    <div class="text-subtitle2">Avg Win(After Expense)</div>
                    <q-input
                      v-model="reportData.avgWin"
                      :model-value="formatPrice(reportData.avgWin)"
                      class="super-small"
                      outlined
                      dense
                      bg-color="white"
                      hide-bottom-space
                    />
                  </div>
                </div>
              </div>
            </div>
          </fieldset>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useReportStore } from 'src/stores/report-store'
import { formatPrice } from 'src/helpers/helpers'
const reportStore = useReportStore()
const filterValues = ref({
  playerId: null,
})

const reportData = ref({
  totalInfo: {},
  slotInfo: {},
  liveGameInfo: {},
  expenseDetails: {},
})
const getPlayerWinLossAnalysisReport = async () => {
  const response = await reportStore.getPlayerWinLossAnalysisReport(filterValues.value)
  reportData.value = response
}

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
</script>

<style scoped></style>
