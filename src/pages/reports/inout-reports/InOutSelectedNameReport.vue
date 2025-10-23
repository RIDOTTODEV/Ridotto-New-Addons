<template>
  <q-page class="q-pa-md">
    <q-card class="q-mb-md q-card--bordered" flat>
      <q-card-section class="row q-pa-sm">
        <div
          class="col-12 flex justify-start content-center items-center"
          v-if="props.filterParams.playerFullName"
        >
          <div class="text-subtitle2 q-ml-sm q-pb-sm">
            {{ props.filterParams.playerFullName }}
          </div>
        </div>
        <div class="row flex justify-start content-center items-center">
          <SearchPlayerInput
            v-model="getInOutPlayerDetailFilter.playerId"
            :label="$t('player')"
            @onSelectPlayer="onSelectPlayer"
            v-if="!props.filterParams.playerId"
            :optionLabel="'value'"
            :displayedValue="selectedPlayer.playerName"
            @onClear="onClearPlayer"
          />
          <date-time-picker
            class="q-ml-sm"
            v-model="datePickerValue"
            :setDateByLabel="props.filterParams.label"
            :key="`${props.filterParams.startDate}-${props.filterParams.endDate}`"
            @selected-date="
              (val) =>
                (getInOutPlayerDetailFilter = {
                  ...getInOutPlayerDetailFilter,
                  startDate: val.StartDate,
                  endDate: val.EndDate,
                  queryType: val.QueryType,
                })
            "
          />
          <q-btn
            icon="o_find_in_page"
            class="super-small q-card--bordered q-ml-sm"
            color="blue-grey-8"
            text-color="white"
            :label="$t('report')"
            @click="filter"
            unelevated
            no-caps
            size="13px"
          />
          <q-btn
            class="super-small q-card--bordered q-ml-sm"
            color="grey-2"
            text-color="dark"
            :label="showPeriodDetails ? $t('showPeriodTheoretical') : $t('hidePeriodTheoretical')"
            :icon="showPeriodDetails ? 'o_visibility_off' : 'o_visibility'"
            @click="showPeriodDetails = !showPeriodDetails"
            unelevated
            no-caps
            size="13px"
          />
        </div>
      </q-card-section>
    </q-card>
    <q-card class="no-box-shadow app-cart-grey q-mb-md">
      <q-card-section class="q-pa-none">
        <q-markup-table dense square class="q-ma-none" flat bordered separator="cell">
          <thead>
            <tr>
              <th v-for="col in columns" :key="col.name">
                <span class="text-caption cursor-pointer">
                  {{ col.shortLocale }}
                  <q-tooltip class="text-caption">
                    {{ $t(col.label) }}
                  </q-tooltip>
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in response?.inOutDetail || []" :key="row.id">
              <td
                v-for="col in columns"
                :key="col.name"
                :class="[
                  'text-center',
                  typeof col.classes === 'function' ? col.classes(row) : col.classes,
                ]"
              >
                <div v-if="col.name === 'missingChipTotal'">
                  <div class="row justify-start items-center">
                    <div class="col">
                      <span
                        class="text-caption cursor-pointer"
                        @click="
                          () => {
                            if (row.missingChip.length > 0) {
                              missingChipDialog = true
                              missingChipDetails = row.missingChip
                            }
                          }
                        "
                        >{{ priceAbsFormatted(row[col.name]) }}</span
                      >
                    </div>
                  </div>
                </div>
                <div v-else-if="col.name === 'missingPlaqueTotal'">
                  <div class="row justify-start items-center">
                    <div class="col">
                      <span
                        class="text-caption cursor-pointer"
                        @click="
                          () => {
                            if (row.missingPlaque.length > 0) {
                              missingChipDialog = true
                              missingChipDetails = row.missingPlaque
                            }
                          }
                        "
                        >{{ priceAbsFormatted(row[col.name]) }}</span
                      >
                    </div>
                  </div>
                </div>
                <div v-else-if="col.name === 'lgPlayTime'">
                  <!-- {{ toHours(row[col.name]) }} -->
                  {{ row[col.name] }}
                </div>
                <div v-else-if="col.name === 'slotPlayTime'">
                  <!--     {{ toHours(row[col.name]) }} -->
                  {{ row[col.name] }}
                </div>
                <div v-else>
                  <span v-if="col?.format">
                    {{ priceAbsFormatted(row[col.name]) }}
                  </span>
                  <span v-else>
                    {{ row[col.name] }}
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td v-for="col in columns" :key="col.name" class="text-center text-bold">
                <div v-if="col.name === 'slotResult'">
                  {{ priceAbsFormatted(response.totalSlotResult) }}
                </div>
                <div v-else-if="col.name === 'lgDrop'">
                  {{ priceAbsFormatted(response.totalLgDrop) }}
                </div>
                <div v-else-if="col.name === 'lgResult'">
                  {{ priceAbsFormatted(response.totalLgResult) }}
                </div>
                <div v-else-if="col.name === 'creditIn'">
                  {{ priceAbsFormatted(response.totalCreditIn) }}
                </div>
                <div v-else-if="col.name === 'creditOut'">
                  {{ priceAbsFormatted(response.totalCreditOut) }}
                </div>
                <div v-else-if="col.name === 'discountIn'">
                  {{ priceAbsFormatted(response.totalDiscountIn) }}
                </div>
                <div v-else-if="col.name === 'discountOut'">
                  {{ priceAbsFormatted(response.totalDiscountOut) }}
                </div>
                <div v-else-if="col.name === 'nonCashableCredit'">
                  {{ priceAbsFormatted(response.totalNonCashableCredit) }}
                </div>
                <div v-else-if="col.name === 'compIn'">
                  {{ priceAbsFormatted(response.totalCompIn) }}
                </div>
                <div v-else-if="col.name === 'compOut'">
                  {{ priceAbsFormatted(response.totalCompOut) }}
                </div>
                <div v-else-if="col.name === 'tableCashDrop'">
                  {{ priceAbsFormatted(response.totalTableCashDrop) }}
                </div>
                <div v-else-if="col.name === 'cashIn'">
                  {{ priceAbsFormatted(response.totalCashIn) }}
                </div>
                <div v-else-if="col.name === 'cashOut'">
                  {{ priceAbsFormatted(response.totalCashOut) }}
                </div>
                <div v-else-if="col.name === 'realCashIn'">
                  {{ priceAbsFormatted(response.totalRealCashIn) }}
                </div>
                <div v-else-if="col.name === 'realCashOut'">
                  {{ priceAbsFormatted(response.totalRealCashOut) }}
                </div>
                <div v-else-if="col.name === 'slotIn'">
                  {{ priceAbsFormatted(response.totalSlotIn) }}
                </div>
                <div v-else-if="col.name === 'slotOut'">
                  {{ priceAbsFormatted(response.totalSlotOut) }}
                </div>
                <div v-else-if="col.name === 'missingChipTotal'">
                  {{ priceAbsFormatted(response.missingChipTotal) }}
                </div>
                <div v-else-if="col.name === 'missingPlaqueTotal'">
                  {{ priceAbsFormatted(response.missingPlaqueTotal) }}
                </div>
                <div v-else-if="col.name === 'creditCardIn'">
                  {{ priceAbsFormatted(response.totalCreditCardIn) }}
                </div>
                <div v-else-if="col.name === 'creditCardOut'">
                  {{ priceAbsFormatted(response.totalCreditCardOut) }}
                </div>
                <div v-else-if="col.name === 'marker'">
                  {{ priceAbsFormatted(response.totalMarker) }}
                </div>
                <div v-else-if="col.name === 'depositIn'">
                  {{ priceAbsFormatted(response.totalDepositIn) }}
                </div>
                <div v-else-if="col.name === 'depositOut'">
                  {{ priceAbsFormatted(response.totalDepositOut) }}
                </div>
                <div v-else></div>
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
      <q-card-section class="q-pa-none row q-mt-md" style="background-color: #bac6da">
        <div class="col-5 q-pa-xs">
          <fieldset class="row">
            <legend class="q-pa-sm text-subtitle2">Lg / Sl Result</legend>
            <div class="col-6 q-pa-xs row flex no-wrap justify-end items-center content-center">
              <div class="text-subtitle2">Lg Drop</div>
              <q-input
                dense
                v-model="response.lgDrop"
                :label="$t('lgDrop')"
                class="super-small q-ml-xs"
                bg-color="green-1"
                outlined
                readonly
                :model-value="priceAbsFormatted(response.lgDrop)"
              />
            </div>
            <div class="col-6 q-pa-xs row flex no-wrap justify-end items-center content-center">
              <div class="text-subtitle2">Lg Result</div>
              <q-input
                dense
                v-model="response.lgResult"
                :label="$t('lgResult')"
                class="super-small q-ml-xs"
                bg-color="cyan-1"
                outlined
                readonly
                :model-value="priceAbsFormatted(response.lgResult)"
              />
            </div>
            <div class="col-6 q-pa-xs row flex no-wrap justify-end items-center content-center">
              <div class="text-subtitle2">Lg Cashout</div>
              <q-input
                dense
                v-model="response.lgCashout"
                :label="$t('lgCashout')"
                class="super-small q-ml-xs"
                bg-color="red-1"
                outlined
                readonly
                :model-value="priceAbsFormatted(response.lgCashout)"
              />
            </div>
            <div class="col-6"></div>
            <div class="col-6 q-pa-xs row flex no-wrap justify-end items-center content-center">
              <div class="text-subtitle2">Slot Drop</div>
              <q-input
                dense
                v-model="response.slotDrop"
                :label="$t('slotDrop')"
                class="super-small q-ml-xs"
                bg-color="green-1"
                outlined
                readonly
                :model-value="priceAbsFormatted(response.slotDrop)"
              />
            </div>
            <div class="col-6 q-pa-xs row flex no-wrap justify-end items-center content-center">
              <div class="text-subtitle2">SL Result</div>
              <q-input
                dense
                v-model="response.slotResult"
                :label="$t('slotResult')"
                class="super-small q-ml-xs"
                bg-color="cyan-1"
                outlined
                readonly
                :model-value="priceAbsFormatted(response.slotResult)"
              />
            </div>
          </fieldset>
          <fieldset class="q-mt-md row">
            <legend class="q-pa-sm text-subtitle2">Totals</legend>
            <div class="col-5 flex justify-center items-center">
              <q-img
                class="player-photo q-ma-sm"
                width="150px"
                :src="$playerPhotoUrl + getInOutPlayerDetailFilter.playerId"
                :error-src="'/assets/no-photo.png'"
                :img-style="{
                  borderRadius: '4px',
                }"
              />
            </div>
            <div class="col-7 text-center">
              <div class="text-subtitle2 text-indigo">Count: {{ response.count }}</div>
              <div class="text-subtitle2 text-indigo">Played Days: {{ response.count }}</div>
              <div class="row q-gutter-xs">
                <div class="col-12">
                  <div
                    class="text-subtitle2 cursor-pointer"
                    @mouseenter="showMissingChipTooltip = true"
                    @mouseleave="showMissingChipTooltip = false"
                    :class="response.missingChipTotal >= 0 ? '' : 'text-negative '"
                  >
                    Missing Chip:
                    {{ priceAbsFormatted(response.missingChipTotal) }}
                    <q-tooltip
                      v-model="showMissingChipTooltip"
                      anchor="top middle"
                      self="bottom middle"
                      class="text-subtitle2 bg-blue-grey-8"
                    >
                      <div
                        v-if="response.missingChipDetail && response.missingChipDetail.length > 0"
                      >
                        <div class="text-weight-bold q-mb-xs">Missing Chip Details:</div>
                        <div
                          v-for="(chip, index) in response.missingChipDetail"
                          :key="index"
                          class="q-mb-xs"
                        >
                          {{ chip.chipDenomName }} ({{ chip.chipType }}): {{ chip.quantity }} x
                          {{ priceAbsFormatted(chip.chipDenom) }} =
                          {{ priceAbsFormatted(chip.quantity * chip.chipDenom) }}
                        </div>
                        <div class="text-weight-bold q-mt-sm">
                          Total: {{ response.missingChipDetail.length }} items
                        </div>
                      </div>
                      <div v-else>No missing chip details</div>
                    </q-tooltip>
                  </div>
                </div>
                <div class="col-12">
                  <div
                    class="text-subtitle2 cursor-pointer"
                    :class="
                      response.missingPlaqueTotal >= 0
                        ? 'text-subtitle2'
                        : 'text-negative text-subtitle2 '
                    "
                    @mouseenter="showMissingPlaqueTooltip = true"
                    @mouseleave="showMissingPlaqueTooltip = false"
                  >
                    Missing Plaque:
                    {{ priceAbsFormatted(response.missingPlaqueTotal) }}
                    <q-tooltip
                      v-model="showMissingPlaqueTooltip"
                      anchor="top middle"
                      self="bottom middle"
                      class="text-subtitle2 bg-blue-grey-8"
                    >
                      <div
                        v-if="
                          response.missingPlaqueDetail && response.missingPlaqueDetail.length > 0
                        "
                      >
                        <div class="text-weight-bold q-mb-xs">Missing Plaque Details:</div>
                        <div
                          v-for="(plaque, index) in response.missingPlaqueDetail"
                          :key="index"
                          class="q-mb-xs"
                        >
                          {{ plaque.chipDenomName }} ({{ plaque.chipType }}):
                          {{ plaque.quantity }} x {{ priceAbsFormatted(plaque.chipDenom) }} =
                          {{ priceAbsFormatted(plaque.quantity * plaque.chipDenom) }}
                        </div>
                        <div class="text-weight-bold q-mt-sm">
                          Total: {{ response.missingPlaqueDetail.length }} items
                        </div>
                      </div>
                      <div v-else>No missing plaque details</div>
                    </q-tooltip>
                  </div>
                </div>
                <div class="col-12">
                  <div
                    class="text-subtitle2 text-weight-bold cursor-pointer"
                    :class="
                      response.missingChipTotal + response.missingPlaqueTotal >= 0
                        ? ''
                        : 'text-negative'
                    "
                    @mouseenter="showTotalMissingTooltip = true"
                    @mouseleave="showTotalMissingTooltip = false"
                  >
                    Total Missing:
                    {{
                      priceAbsFormatted(response?.missingChipTotal + response?.missingPlaqueTotal)
                    }}
                  </div>
                </div>
                <div class="col-12" v-if="response.marker">
                  <div class="text-subtitle2">Marker: {{ response.marker }}</div>
                </div>
              </div>
              <div class="text-subtitle2">
                Cashless Account :
                {{ priceAbsFormatted(response.cashableCredit) }}
                {{ getDefaultCurrencyName }}
              </div>
              <div class="text-subtitle2">
                Promo Account :
                {{ priceAbsFormatted(response.nonCashableCredit) }}
                {{ getDefaultCurrencyName }}
              </div>
              <div class="text-subtitle2">
                Credits on Machine
                {{ priceAbsFormatted(response.creditsOnMachine) }}
                {{ getDefaultCurrencyName }}
              </div>
            </div>
          </fieldset>
        </div>
        <div class="col-7 q-pa-xs">
          <fieldset class="row">
            <legend class="q-pa-sm text-subtitle2">Totals</legend>
            <div class="col-6 q-pa-xs row flex justify-end">
              <div class="row col-12 flex no-wrap justify-end items-center content-center">
                <div class="text-subtitle2">T Drop</div>
                <q-input
                  dense
                  v-model="response.totalDrop"
                  :model-value="priceAbsFormatted(response.totalDrop)"
                  class="super-small q-ml-xs"
                  :bg-color="response.totalDrop > 0 ? 'green-1' : 'red-1'"
                  outlined
                  input-class="text-dark text-subtitle2 "
                  readonly
                />
              </div>
              <div class="row col-12 q-mt-xs flex no-wrap justify-end items-center content-center">
                <div class="text-subtitle2">Comp</div>
                <q-input
                  dense
                  v-model="response.comResult"
                  :model-value="priceAbsFormatted(response.comResult)"
                  class="super-small q-ml-xs"
                  bg-color="brown-1"
                  outlined
                  input-class="text-dark text-subtitle2"
                  readonly
                />
              </div>
              <div class="row col-12 q-mt-xs flex no-wrap justify-end items-center content-center">
                <div class="text-subtitle2">Discount</div>
                <q-input
                  dense
                  v-model="response.discountResult"
                  :model-value="priceAbsFormatted(response.discountResult)"
                  class="super-small q-ml-xs"
                  bg-color="yellow-5"
                  outlined
                  input-class="text-dark text-subtitle2"
                  readonly
                />
              </div>
              <div class="row col-12 q-mt-xs flex no-wrap justify-end items-center content-center">
                <div class="text-subtitle2">Credit</div>
                <q-input
                  dense
                  v-model="response.creditResult"
                  :model-value="priceAbsFormatted(response.creditResult)"
                  class="super-small q-ml-xs"
                  bg-color="yellow-5"
                  outlined
                  input-class="text-dark text-subtitle2 "
                  readonly
                />
              </div>
            </div>
            <div class="col-6 q-pa-xs row flex justify-end">
              <div class="row col-12 flex no-wrap justify-end items-center content-center">
                <div class="text-subtitle2">T Result</div>
                <q-input
                  dense
                  v-model="response.totalResult"
                  :model-value="priceAbsFormatted(response.totalResult)"
                  class="super-small q-ml-xs"
                  :bg-color="response.totalResult > 0 ? 'green-10' : 'red-10'"
                  outlined
                  input-class="text-white text-subtitle2 text-bold"
                  readonly
                />
              </div>
              <div class="row col-12 q-mt-xs flex no-wrap justify-end items-center content-center">
                <div class="text-subtitle2">A Comp</div>
                <q-input
                  dense
                  v-model="response.aComp"
                  :model-value="priceAbsFormatted(response.aComp)"
                  class="super-small q-ml-xs"
                  :bg-color="response.aComp > 0 ? 'green-10' : 'red-10'"
                  outlined
                  readonly
                  input-class="text-white text-subtitle2 text-bold"
                />
              </div>
              <div class="row col-12 q-mt-xs flex no-wrap justify-end items-center content-center">
                <div class="text-subtitle2">A Discount</div>
                <q-input
                  dense
                  v-model="response.aDiscount"
                  :model-value="priceAbsFormatted(response.aDiscount)"
                  class="super-small q-ml-xs"
                  :bg-color="response.aDiscount > 0 ? 'green-10' : 'red-10'"
                  outlined
                  input-class="text-white text-subtitle2 text-bold"
                  readonly
                />
              </div>
              <div class="row col-12 q-mt-xs flex no-wrap justify-end items-center content-center">
                <div class="text-subtitle2">NET CASH</div>
                <q-input
                  dense
                  v-model="response.netCash"
                  :model-value="priceAbsFormatted(response.netCash)"
                  class="super-small q-ml-xs"
                  input-class="text-subtitle2 text-bold"
                  :bg-color="response.netCash > 0 ? 'green-10' : 'yellow-5'"
                  outlined
                  :input-style="
                    response.netCash < 0
                      ? {
                          color: 'red',
                          fontWeight: 'bold',
                          fontSize: '14px',
                        }
                      : {
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '14px',
                        }
                  "
                  readonly
                />
              </div>
            </div>
            <div class="col-6 q-pa-xs row flex justify-end">
              <div class="text-subtitle2 cursor-pointer" v-if="response.totalExpense">
                Total Expense:
                {{ priceAbsFormatted(response.totalExpense) }}
                {{ getDefaultCurrencyName }}
                <q-tooltip class="text-subtitle2 q-pa-none">
                  <q-card square>
                    <q-card-section class="q-pa-xs">
                      <q-markup-table dense flat bordered separator="cell">
                        <thead>
                          <tr class="">
                            <th class="text-center bg-grey-2">Player Name</th>
                            <th class="text-center bg-grey-2">Expense Type</th>
                            <th class="text-center bg-grey-2">Quantity</th>
                            <th class="text-center bg-grey-2">Value</th>
                            <th class="text-center bg-grey-2">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(expense, index) in response.expenses" :key="index">
                            <td class="text-center">
                              {{ expense.playerName }}
                            </td>
                            <td class="text-center">
                              {{ expense.expenseTypeName }}
                            </td>
                            <td class="text-center">{{ expense.quantity }}</td>
                            <td class="text-center">
                              {{ priceAbsFormatted(expense.value) }}
                            </td>
                            <td class="text-center">
                              {{ priceAbsFormatted(expense.amount) }}
                            </td>
                          </tr>
                          <tr>
                            <td colspan="2" class="text-right">
                              <div class="text-dark">
                                Total: {{ response.expenses.length }} items
                              </div>
                            </td>
                            <td colspan="3" class="text-right">
                              <div class="text-dark">
                                Total Expense:
                                {{ priceAbsFormatted(response.totalExpense) }}
                                {{ getDefaultCurrencyName }}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </q-markup-table>
                    </q-card-section>
                  </q-card>
                </q-tooltip>
              </div>
            </div>
            <div class="col-6 q-pa-xs row flex justify-end">
              <div class="text-subtitle2 cursor-pointer" v-if="response.ccFeeExpense">
                CC Fee:
                {{ priceAbsFormatted(response.ccFeeExpense) }}
                {{ getDefaultCurrencyName }}
                <q-tooltip class="text-subtitle2 q-pa-none">
                  <q-card square>
                    <q-card-section class="q-pa-xs">
                      <q-markup-table dense flat bordered separator="cell">
                        <thead>
                          <tr class="">
                            <th class="text-center bg-grey-2">Created By</th>
                            <th class="text-center bg-grey-2">Transaction Type</th>
                            <th class="text-center bg-grey-2">Amount</th>
                            <th class="text-center bg-grey-2">Created Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(ccFee, index) in response.ccTransactions" :key="index">
                            <td class="text-center">
                              {{ ccFee.createdByName }}
                            </td>
                            <td class="text-center">
                              {{ ccFee.transactionType }}
                            </td>
                            <td class="text-center">
                              {{ priceAbsFormatted(ccFee.amount) }}
                            </td>
                            <td class="text-center">
                              {{ date.formatDate(ccFee.createdAt, 'DD.MM.YYYY HH:mm') }}
                            </td>
                          </tr>
                          <tr>
                            <td colspan="2" class="text-right">
                              <div class="text-dark">
                                Total:
                                {{ response.ccTransactions.length }} items
                              </div>
                            </td>
                            <td colspan="3" class="text-right">
                              <div class="text-dark">
                                Total CC Fee:
                                {{ priceAbsFormatted(response.ccFeeExpense) }}
                                {{ getDefaultCurrencyName }}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </q-markup-table>
                    </q-card-section>
                  </q-card>
                </q-tooltip>
              </div>
            </div>
          </fieldset>

          <fieldset class="row" v-if="!showPeriodDetails">
            <legend class="q-pa-sm text-subtitle2">Period Theoretical</legend>
            <div class="col-6 q-pa-xs">
              <q-markup-table
                dense
                flat
                bordered
                separator="cell"
                v-if="response.periodTheoretical"
              >
                <thead>
                  <tr class="app-card-grey">
                    <th class="text-center">Game Name</th>
                    <th class="text-center">Time</th>
                    <th class="text-center">Avg Bet</th>
                    <th class="text-center">Theoretical</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in response.periodTheoretical" :key="index">
                    <td class="text-center">{{ item.gameName }}</td>
                    <td class="text-center">{{ toHours(item.time) }}</td>
                    <td class="text-center">{{ formatPrice(item.avgBet) }}</td>
                    <td class="text-center">{{ formatPrice(item.theoretical) }}</td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>
            <div class="col-6 q-pa-xs">
              <q-markup-table dense flat bordered separator="cell" v-if="response.dailyTheoretical">
                <thead>
                  <tr class="app-card-grey">
                    <th class="text-center">Game Name</th>
                    <th class="text-center">Time</th>
                    <th class="text-center">Avg Bet</th>
                    <th class="text-center">Theoretical</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in response.dailyTheoretical" :key="index">
                    <td class="text-center">{{ item.gameName }}</td>
                    <td class="text-center">{{ toHours(item.time) }}</td>
                    <td class="text-center">{{ formatPrice(item.avgBet) }}</td>
                    <td class="text-center">{{ formatPrice(item.theoretical) }}</td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>
          </fieldset>
          <fieldset class="row" v-if="!props.filterParams.playerId">
            <legend class="q-pa-sm text-subtitle2">Player Notes / Friends</legend>
            <div class="col-6 q-pa-sm">
              <PlayerFriends
                v-if="getInOutPlayerDetailFilter.playerId"
                :player="selectedPlayer"
                :player-id="getInOutPlayerDetailFilter.playerId"
                :show-friends-permission="'Addon.Operations.CustomerInformation.ShowFriends'"
                :reload-friends-permission="'Addon.Operations.CustomerInformation.ReloadFriends'"
              />
              <PlayerLinkedPlayers
                v-if="getInOutPlayerDetailFilter.playerId"
                :player="selectedPlayer"
                :player-id="getInOutPlayerDetailFilter.playerId"
                :show-linked-players-permission="'Addon.Operations.CustomerInformation.ShowLinkedPlayers'"
                :reload-linked-players-permission="'Addon.Operations.CustomerInformation.ReloadLinkedPlayers'"
                class="q-mt-sm"
              />
            </div>
            <div class="col-6 q-pa-sm">
              <PlayerNote
                v-if="selectedPlayer.playerId"
                :player-id="getInOutPlayerDetailFilter.playerId"
                :note-source="'General'"
                :show-note-permission="'Addon.CashlessOperations.MetaDetail.ShowNotes'"
                :create-note-permission="'Addon.CashlessOperations.MetaDetail.CreateNote'"
                :reload-notes-permission="'Addon.CashlessOperations.MetaDetail.ReloadNotes'"
                :min-height="100"
                :title="$t('generalNotes')"
              />
              <PlayerNote
                v-if="selectedPlayer.playerId"
                :player-id="getInOutPlayerDetailFilter.playerId"
                :note-source="'PublicRelations'"
                :show-note-permission="'Addon.CashlessOperations.MetaDetail.ShowNotes'"
                :create-note-permission="'Addon.CashlessOperations.MetaDetail.CreateNote'"
                :reload-notes-permission="'Addon.CashlessOperations.MetaDetail.ReloadNotes'"
                :min-height="60"
                :title="$t('publicRelationsNotes')"
                class="q-mt-sm"
              />
            </div>
          </fieldset>

          <fieldset class="row">
            <legend class="q-pa-sm text-subtitle2">Slot Transactions</legend>
            <div class="col-12 q-pa-none">
              <q-markup-table dense seperate="cell">
                <thead>
                  <tr>
                    <th>T.Code</th>
                    <th>Deposit</th>
                    <th>Withdrawal</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in response.slotPlayerTransactions" :key="index">
                    <td>{{ item.transactionCode }}</td>
                    <td>{{ priceAbsFormatted(item.deposit) }}</td>
                    <td>{{ priceAbsFormatted(item.withdrawal) }}</td>
                    <td>{{ priceAbsFormatted(item.amount) }}</td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>
          </fieldset>
        </div>
      </q-card-section>
    </q-card>
    <q-dialog
      maximized
      v-model="missingChipDialog"
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
                <th class="text-center">Chip Type</th>
                <th class="text-center">Quantity</th>
                <th class="text-center">Value</th>
                <th class="text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in missingChipDetails" :key="index">
                <td class="text-center">{{ item.chipDenomId }}</td>
                <td class="text-center">{{ item.chipDenomName }}</td>
                <td class="text-center">{{ item.chipType }}</td>
                <td class="text-center">
                  {{ priceAbsFormatted(item.quantity) }}
                </td>
                <td class="text-center">
                  {{ priceAbsFormatted(item.chipDenom) }}
                </td>
                <td class="text-center">
                  {{ priceAbsFormatted(item.quantity * item.chipDenom) }}
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import SearchPlayerInput from 'components/atoms/SearchPlayerInput.vue'
import PlayerNote from 'src/components/pages/player-operations/meta-detail/PlayerNote.vue'
import PlayerFriends from 'src/components/pages/player-operations/meta-detail/PlayerFriends.vue'
import PlayerLinkedPlayers from 'src/components/pages/player-operations/meta-detail/LinkedPlayers.vue'
import { ref, onMounted, onBeforeMount, watch } from 'vue'
import { useReportStore } from 'src/stores/report-store'
import { useAuthStore } from 'src/stores/auth-store'
import { useQuasar } from 'quasar'
import { priceAbsFormatted, formatPrice, toHours } from 'src/helpers/helpers'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { getDefaultCurrencyId, getDefaultCurrencyName } = storeToRefs(authStore)
const reportStore = useReportStore()
const $q = useQuasar()
const missingChipDialog = ref(false)
const missingChipDetails = ref([])
const getInOutPlayerDetailFilter = ref({
  playerId: null,
  startDate: null,
  endDate: null,
  balanceCurrencyId: getDefaultCurrencyId.value,
})
const maximized = ref(false)

import { date } from 'quasar'

const props = defineProps({
  filterParams: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})

// Watch for filterParams changes
watch(
  () => props.filterParams,
  (newFilterParams) => {
    getInOutPlayerDetailFilter.value = {
      ...getInOutPlayerDetailFilter.value,
      ...newFilterParams,
    }

    // Update date picker value when filter params change
    if (newFilterParams.startDate && newFilterParams.endDate) {
      datePickerValue.value = {
        StartDate: newFilterParams.startDate,
        EndDate: newFilterParams.endDate,
        QueryType: newFilterParams.queryType || 'byGamingDate',
        label: newFilterParams.label || '',
      }
    }

    // If playerId exists, automatically filter when date changes
    if (newFilterParams.playerId) {
      filter()
    }
  },
  { deep: true },
)

onBeforeMount(() => {
  getInOutPlayerDetailFilter.value = {
    ...getInOutPlayerDetailFilter.value,
    ...props.filterParams,
  }

  if (props.filterParams.startDate && props.filterParams.endDate) {
    datePickerValue.value = {
      StartDate: props.filterParams.startDate,
      EndDate: props.filterParams.endDate,
      QueryType: props.filterParams.queryType || 'byGamingDate',
      label: props.filterParams.label || '',
    }
  }
})

const response = ref({})
const columns = ref([
  {
    name: 'gamingDate',
    align: 'center',
    label: 'Gaming Date',
    shortLocale: 'Gaming Date',
    field: 'gamingDate',
    sortable: false,
    visible: true,
    classes: 'bg-orange-1',
  },
  {
    name: 'slotResult',
    align: 'center',
    label: 'Slot Result',
    shortLocale: 'SL.Result',
    field: 'slotResult',
    sortable: false,
    visible: true,
    classes: 'bg-green-1',
    format: (val) => formatPrice(val),
  },
  {
    name: 'lgDrop',
    align: 'center',
    label: 'Lg Drop',
    shortLocale: 'LG.D',
    field: 'lgDrop',
    sortable: false,
    visible: true,
    classes: 'bg-green-1',
    format: (val) => formatPrice(val),
  },
  {
    name: 'lgCashout',
    align: 'center',
    label: 'Lg Cashout',
    shortLocale: 'LG.Cashout',
    field: 'lgCashout',
    sortable: false,
    visible: true,
    classes: 'bg-brown-1',
    format: (val) => formatPrice(val),
  },
  {
    name: 'lgResult',
    align: 'center',
    label: 'Lg Result',
    shortLocale: 'LG.Result',
    field: 'lgResult',
    sortable: false,
    visible: true,
    classes: 'bg-green-1',
    format: (val) => formatPrice(val),
  },
  {
    name: 'creditIn',
    align: 'center',
    label: 'Credit In',
    shortLocale: 'CR.In',
    field: 'creditIn',
    sortable: false,
    visible: true,
    classes: 'bg-brown-1',
    format: (val) => formatPrice(val),
  },
  {
    name: 'creditOut',
    align: 'center',
    label: 'Credit Out',
    shortLocale: 'CR.Out',
    field: 'creditOut',
    sortable: false,
    visible: true,
    classes: 'bg-brown-1',
    format: (val) => formatPrice(val),
  },
  {
    name: 'discountIn',
    align: 'center',
    label: 'Discount In',
    shortLocale: 'DISC.In',
    field: 'discountIn',
    sortable: false,
    visible: true,
    classes: 'bg-orange-1',
    format: (val) => formatPrice(val),
  },
  {
    name: 'discountOut',
    align: 'center',
    label: 'Discount Out',
    shortLocale: 'DISC.Out',
    field: 'discountOut',
    sortable: false,
    visible: true,
    classes: 'bg-orange-1',
    format: (val) => formatPrice(val),
  },
  {
    name: 'compIn',
    align: 'center',
    label: 'Comp In',
    shortLocale: 'COMP.In',
    field: 'compIn',
    sortable: false,
    visible: true,
    classes: 'bg-brown-1',
    format: (val) => formatPrice(val),
  },
  {
    name: 'compOut',
    align: 'center',
    label: 'Comp Out',
    shortLocale: 'COMP.Out',
    field: 'compOut',
    sortable: false,
    visible: true,
    classes: 'bg-brown-1',
    format: (val) => formatPrice(val),
  },
  {
    name: 'tableCashDrop',
    align: 'center',
    label: 'Table Cash Drop',
    shortLocale: 'T.Drop',
    field: 'tableCashDrop',
    sortable: false,
    visible: true,
    classes: 'bg-brown-1',
    format: (val) => formatPrice(val),
  },
  {
    name: 'cashIn',
    align: 'center',
    label: 'Cash In',
    shortLocale: 'CASH.In',
    field: 'cashIn',
    sortable: false,
    visible: true,
    classes: 'bg-brown-1',
    format: (val) => formatPrice(val),
  },
  {
    name: 'cashOut',
    align: 'center',
    label: 'Cash Out',
    shortLocale: 'CASH.Out',
    field: 'cashOut',
    sortable: false,
    visible: true,
    classes: 'bg-brown-1',
    format: (val) => formatPrice(val),
  },
  {
    name: 'realCashIn',
    align: 'center',
    label: 'Real.Cash In',
    shortLocale: 'R.CASH.In',
    field: 'realCashIn',
    sortable: false,
    visible: true,
    classes: 'bg-green-1',
    format: (val) => formatPrice(val),
  },
  {
    name: 'realCashOut',
    align: 'center',
    label: 'Real Cash Out',
    shortLocale: 'R.CASH.Out',
    field: 'realCashOut',
    sortable: false,
    visible: true,
    classes: 'bg-green-1',
    format: (val) => formatPrice(val),
  },
  {
    name: 'slotIn',
    align: 'center',
    label: 'Slot In',
    shortLocale: 'SL.In',
    field: 'slotIn',
    sortable: false,
    visible: true,
    classes: 'bg-cyan-1',
    format: (val) => formatPrice(val),
  },
  {
    name: 'slotOut',
    align: 'center',
    label: 'Slot Out',
    shortLocale: 'SL.Out',
    field: 'slotOut',
    sortable: false,
    visible: true,
    classes: 'bg-cyan-1',
    format: (val) => formatPrice(val),
  },
  /*   {
    name: 'creditCardIn',
    align: 'center',
    label: 'Credit Card In',
    shortLocale: 'CC.In',
    field: 'creditCardIn',
    sortable: false,
    visible: true,
    classes: 'bg-brown-1',
    format: (val) => formatPrice(val),
  },
  {
    name: 'creditCardOut',
    align: 'center',
    label: 'Credit Card Out',
    shortLocale: 'CC.Out',
    field: 'creditCardOut',
    sortable: false,
    visible: true,
    classes: 'bg-brown-1',
    format: (val) => formatPrice(val),
  }, */
  {
    name: 'slotPlayTime',
    align: 'center',
    label: 'Slot Play Time',
    shortLocale: 'SL P.Time',
    field: 'slotPlayTime',
    sortable: false,
    visible: true,
    classes: (val) => (val?.slotPlayTime !== '00:00' ? 'bg-blue-8 text-white' : 'bg-orange-1'),
  },
  {
    name: 'lgPlayTime',
    align: 'center',
    label: 'Lg Play Time',
    shortLocale: 'LG P.Time',
    field: 'lgPlayTime',
    sortable: false,
    visible: true,
    classes: (val) => (val?.lgPlayTime !== '00:00' ? 'bg-blue-8 text-white' : 'bg-orange-1'),
  },
  {
    name: 'missingChipTotal',
    align: 'center',
    label: 'Missing Chip Total',
    shortLocale: 'MC.T',
    field: 'missingChipTotal',
    sortable: false,
    visible: true,
    format: (val) => priceAbsFormatted(val),
    classes: (val) => {
      return val?.missingChipTotal < 0 ? 'bg-red-2 text-dark' : 'bg-green-2 text-dark'
    },
  },
  {
    name: 'missingPlaqueTotal',
    align: 'center',
    label: 'Missing Plaque Total',
    shortLocale: 'MP.T',
    field: 'missingPlaqueTotal',
    sortable: false,
    visible: true,
    format: (val) => priceAbsFormatted(val),
    classes: (val) => (val?.missingPlaqueTotal < 0 ? 'bg-red-2 text-dark' : 'bg-green-2 text-dark'),
  },
  {
    name: 'activeDeposit',
    align: 'center',
    label: 'Active Deposit',
    shortLocale: 'ACT.Dep',
    field: 'activeDeposit',
    sortable: false,
    visible: true,
    classes: 'bg-green-1',
    format: (val) => formatPrice(val),
  },
  {
    name: 'slotTurnover',
    align: 'center',
    label: 'Slot Turnover',
    shortLocale: 'SL.T.Over',
    field: 'slotTurnover',
    sortable: false,
    visible: true,
    classes: 'bg-green-1',
    format: (val) => formatPrice(val),
  },
  {
    name: 'creditCardIn',
    align: 'center',
    label: 'Credit Card In',
    shortLocale: 'CC.In',
    field: 'creditCardIn',
    sortable: false,
    visible: true,
    classes: 'bg-blue-1',
    format: (val) => formatPrice(val),
  },
  {
    name: 'creditCardOut',
    align: 'center',
    label: 'Credit Card Out',
    shortLocale: 'CC.Out',
    field: 'creditCardOut',
    sortable: false,
    visible: true,
    classes: 'bg-blue-1',
    format: (val) => formatPrice(val),
  },
  {
    name: 'marker',
    align: 'center',
    label: 'Marker',
    shortLocale: 'Marker',
    field: 'marker',
    sortable: false,
    visible: true,
    classes: 'bg-red-1',
    format: (val) => formatPrice(val),
  },
  {
    name: 'depositIn',
    align: 'center',
    label: 'Deposit In',
    shortLocale: 'Dep.In',
    field: 'depositIn',
    sortable: false,
    visible: true,
    classes: 'bg-brown-1',
    format: (val) => formatPrice(val),
  },
  {
    name: 'depositOut',
    align: 'center',
    label: 'Deposit Out',
    shortLocale: 'Dep.Out',
    field: 'depositOut',
    sortable: false,
    visible: true,
    classes: 'bg-brown-1',
    format: (val) => formatPrice(val),
  },
])
const filter = async () => {
  if (!getInOutPlayerDetailFilter.value.playerId) {
    $q.notify({
      message: 'Player ID is required',
      color: 'red',
    })
    return
  }
  const res = await reportStore.getInOutPlayerDetail(getInOutPlayerDetailFilter.value)

  response.value = res.data || {}
}

onMounted(async () => {
  if (props.filterParams.playerId) {
    getInOutPlayerDetailFilter.value = {
      ...getInOutPlayerDetailFilter.value,
      ...props.filterParams,
    }
    await filter()
  }
})

const selectedPlayer = ref({
  playerId: null,
  playerName: null,
  surname: null,
  class: null,
})
const onSelectPlayer = async (player) => {
  selectedPlayer.value.playerId = player?.id || null
  selectedPlayer.value.playerName = player?.value || null
  getInOutPlayerDetailFilter.value.playerId = player?.id || null

  if (player?.id) {
    await filter()
  }
}
const onClearPlayer = () => {
  selectedPlayer.value.playerId = null
  selectedPlayer.value.playerName = null
  getInOutPlayerDetailFilter.value.playerId = null
  response.value = {}
}

const datePickerValue = ref({
  StartDate: null,
  EndDate: null,
  QueryType: null,
  label: null,
})

const showMissingChipTooltip = ref(false)
const showMissingPlaqueTooltip = ref(false)
const showTotalMissingTooltip = ref(false)

const showPeriodDetails = ref(true)
</script>
<style lang="scss">
.cashDeskTransactionTable {
  .q-table__middle {
    margin-top: 0px !important;
  }
}

fieldset {
  border: 1px solid #3d5072 !important;
  border-radius: 3px !important;
  padding: 10px !important;
  //margin: 10px;
}

.player-photo-container {
  display: inline-block;
}

.player-photo {
  transition: transform 0.3s ease;
  cursor: pointer;
}
</style>
