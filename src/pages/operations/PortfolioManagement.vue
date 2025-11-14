<template>
  <q-page class="q-pa-md" style="background-color: #bac6da">
    <div class="flex flex-col sm:flex-row">
      <div class="w-full sm:w-1/4 q-pa-sm">
        <div class="row flex justify-center">
          <q-img
            :src="$playerPhotoUrl + selectedPortfolioManagementRow?.playerId"
            :error-src="'/assets/no-image.png'"
            width="150px"
            fit="cover"
            class="player-photo"
          />
        </div>
        <div class="row">
          <fieldset class="full-width">
            <legend>
              <q-checkbox
                size="xs"
                v-model="portfolioManagementFilter.withResult"
                label="With Result"
              />
            </legend>
            <div class="full-width" style="margin-top: -5px">
              <date-time-picker
                :no-wrap="false"
                btnClass="col-12 full-width"
                :disabled="!portfolioManagementFilter.withResult"
                @selected-date="
                  (val) =>
                    (portfolioManagementFilter = {
                      ...portfolioManagementFilter,
                      ...val,
                    })
                "
              />
            </div>
          </fieldset>

          <fieldset class="full-width">
            <legend>
              <q-checkbox
                size="xs"
                v-model="portfolioManagementFilter.findBySpecialDay"
                label="Find By Special Dates"
              />
            </legend>
            <div class="row" style="margin-top: -5px">
              <div class="col-12">
                <q-checkbox
                  size="xs"
                  v-model="portfolioManagementFilter.birthDay"
                  label="Birthday"
                  color="dark"
                  :disable="!portfolioManagementFilter.findBySpecialDay"
                />
              </div>
              <div class="col-12">
                <q-checkbox
                  size="xs"
                  v-model="portfolioManagementFilter.spouseBirthDay"
                  label="Spouse Birthday"
                  color="dark"
                  :disable="!portfolioManagementFilter.findBySpecialDay"
                />
              </div>
              <div class="col-12">
                <q-checkbox
                  size="xs"
                  v-model="portfolioManagementFilter.weddingAnniversary"
                  label="Wedding Anniversary"
                  color="dark"
                  :disable="!portfolioManagementFilter.findBySpecialDay"
                />
              </div>
            </div>
            <div class="col-12">
              <el-date-picker
                v-model="portfolioManagementFilter.date"
                type="date"
                :placeholder="$t('base.pickDate')"
                size="default"
                format="DD.MM.YYYY"
                date-format="MMM DD, YYYY"
                style="width: 100%"
                :disabled="!portfolioManagementFilter.findBySpecialDay"
                @change="onHandleDateChange"
              />
            </div>
          </fieldset>

          <fieldset class="full-width col-12">
            <legend>
              {{ $t('otherFilters') }}
            </legend>
            <div class="row" style="margin-top: -5px">
              <div class="col-12">
                <search-player-input
                  bg-color="white"
                  v-model="portfolioManagementFilter.playerId"
                  :displayedValue="portfolioManagementFilter.fullName"
                  :label="$t('searchPlayer')"
                  @onSelectPlayer="onSelectPlayer"
                  @onClear="clearPlayerData"
                  optionLabel="value"
                  class="full-width"
                />
              </div>
              <div class="col-12 q-mt-xs">
                <q-input
                  outlined
                  bg-color="white"
                  v-model="portfolioManagementFilter.rating"
                  :label="$t('rating')"
                  dense
                  class="super-small"
                />
              </div>
              <div class="col-12 q-mt-xs">
                <q-input
                  outlined
                  bg-color="white"
                  v-model="portfolioManagementFilter.topRating"
                  :label="$t('topRating')"
                  dense
                  class="super-small"
                />
              </div>
            </div>
          </fieldset>
          <q-btn
            color="white"
            :label="$t('filter')"
            class="full-width q-mt-sm"
            icon="tune"
            no-caps
            text-color="dark"
            unelevated
            @click="handleGetPortfolioManagement"
          />
        </div>
      </div>
      <div class="w-full sm:w-3/4 q-pa-sm">
        <q-card flat class="no-box-shadow">
          <q-card-section class="q-pa-sm flex flex-row justify-between gap-2">
            <q-tabs
              v-model="currentPortfolioManagementTab"
              dense
              class="text-dark w-full sm:w-auto"
              active-color="white"
              indicator-color="blue-grey-8"
              active-bg-color="blue-grey-8"
              align="justify"
              narrow-indicator
              no-caps
              inline-label
              content-class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto"
            >
              <q-tab
                no-caps
                name="portfolio"
                label="Portfolio"
                icon="o_account_balance_wallet"
                :class="
                  currentPortfolioManagementTab === 'portfolio'
                    ? 'q-card--bordered bg-white'
                    : 'q-card--bordered q-ml-sm bg-white'
                "
              />
              <q-tab
                no-caps
                name="giftReport"
                label="Gift Report"
                icon="card_giftcard"
                :class="
                  currentPortfolioManagementTab === 'giftReport'
                    ? 'q-card--bordered bg-white'
                    : 'q-card--bordered q-ml-sm bg-white'
                "
              />
            </q-tabs>

            <q-btn
              v-if="currentPortfolioManagementTab === 'giftReport'"
              :label="$t('createGift')"
              class="q-mr-sm"
              color="grey-2"
              text-color="dark"
              unelevated
              no-caps
              @click="onClickCreateGift()"
              icon="add"
            />
          </q-card-section>
          <q-card-section class="q-pa-sm">
            <q-tab-panels v-model="currentPortfolioManagementTab" animated class="full-height">
              <q-tab-panel name="portfolio" class="q-pa-none">
                <SupaTable
                  tableName="playerPortfolios"
                  event-bus-key="playerPortfolios"
                  :getDataFn="operationStore.getPortfolioManagement"
                  :filterParams="portfolioManagementFilter"
                  :columns="portfolioColumns"
                  ref="playerPortfoliosTableRef"
                  @selected-row="(val) => (selectedPortfolioManagementRow = val)"
                >
                  <template v-slot:headerFilterSlots>
                    <q-btn
                      type="button"
                      :label="$t('excelExport')"
                      icon="file_download"
                      color="green-8"
                      text-color="white"
                      size="13px"
                      unelevated
                      no-caps
                      @click="handlePortfolioManagementExportExcel"
                    />
                  </template>
                </SupaTable>
              </q-tab-panel>

              <q-tab-panel name="giftReport" class="q-pa-none">
                <SupaTable
                  tableName="playerGifts"
                  :getDataFn="operationStore.getPlayerGifts"
                  :filterParams="giftListFilterParams"
                  :columns="giftColumns"
                  :slot-names="['body-cell-actions']"
                  ref="portfolioManagementTableRef"
                  rowKey="id"
                  :useCol12="true"
                  @selected-row="(val) => (selectedPortfolioManagementRow = val)"
                >
                  <template v-slot:headerFilterSlots="{ props }">
                    <div class="flex flex-row justify-start w-full gap-2">
                      <date-time-picker
                        @selected-date="
                          (val) => {
                            giftListFilterParams = {
                              ...giftListFilterParams,
                              ...val,
                            }
                          }
                        "
                      />
                      <SearchPlayerInput
                        v-model="giftListFilterParams.playerId"
                        :label="$t('player')"
                        @onSelectPlayer="
                          (val) => {
                            if (val) {
                              giftListFilterParams.playerId = val.id
                              giftListFilterParams.playerName = val.value
                            } else {
                              giftListFilterParams.playerId = null
                              giftListFilterParams.playerName = null
                            }
                          }
                        "
                        :optionLabel="'value'"
                        :displayedValue="giftListFilterParams.playerName"
                        @onClear="
                          () => {
                            giftListFilterParams.playerId = null
                            giftListFilterParams.playerName = null
                          }
                        "
                        class="fixed-field-width"
                      />
                      <q-select
                        :options="[
                          { label: $t('given'), value: 'true' },
                          { label: $t('notGiven'), value: 'false' },
                          { label: $t('all'), value: null },
                        ]"
                        v-model="giftListFilterParams.given"
                        dense
                        outlined
                        option-label="label"
                        option-value="value"
                        emit-value
                        map-options
                        class="super-small fixed-field-width"
                        :label="$t('given')"
                        style="min-width: 120px"
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
                        @click="props.reload"
                      />

                      <!-- <q-btn
                          type="button"
                          :label="$t('excelImport')"
                          icon="file_upload"
                          color="green-8"
                          text-color="white"
                          size="13px"
                          unelevated
                          no-caps
                          @click="handlePortfolioManagementImportExcel"
                          class="q-ml-sm"
                        /> -->
                      <q-btn
                        icon="file_upload"
                        color="green-8"
                        text-color="white"
                        size="13px"
                        unelevated
                        outlined
                        no-caps
                        @click="handlePortfolioManagementImportExcel"
                      >
                        <q-tooltip class="bg-grey-1 text-dark text-subtitle2">
                          {{ $t('excelImport') }}
                        </q-tooltip>
                      </q-btn>
                    </div>
                  </template>
                  <template v-slot:body-cell-actions="{ props }">
                    <q-td key="actions" align="center">
                      <q-btn
                        unelevated
                        dense
                        color="deep-purple"
                        size="10px"
                        icon="edit"
                        class="q-mr-md"
                        @click="onClickCreateGift(props.row)"
                      />
                      <q-btn
                        unelevated
                        dense
                        color="negative"
                        size="10px"
                        icon="delete_forever"
                        class="q-mr-sm"
                        @click="onClickRemoveGift(props.row)"
                      />
                    </q-td>
                  </template>
                </SupaTable>
              </q-tab-panel>
            </q-tab-panels>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { usePortfolioManagement } from 'src/composables/operations/usePortfolioManagement'
const {
  currentPortfolioManagementTab,
  operationStore,
  portfolioManagementFilter,
  selectedPortfolioManagementRow,
  handleGetPortfolioManagement,
  handlePortfolioManagementExportExcel,
  onHandleDateChange,
  onClickCreateGift,
  onClickRemoveGift,
  handlePortfolioManagementImportExcel,
  portfolioColumns,
  giftColumns,
  giftListFilterParams,
  portfolioManagementTableRef,
  playerPortfoliosTableRef,
} = usePortfolioManagement()

const onSelectPlayer = (val) => {
  if (val) {
    portfolioManagementFilter.value.playerId = val.id
    portfolioManagementFilter.value.fullName = val.value
  } else {
    portfolioManagementFilter.value.playerId = null
    portfolioManagementFilter.value.fullName = null
  }
}
const clearPlayerData = () => {
  portfolioManagementFilter.value.playerId = null
}
</script>

<style scoped lang="scss">
fieldset {
  border: 1px solid #3d5072 !important;
  border-radius: 3px !important;
  padding: 10px !important;
}
</style>
