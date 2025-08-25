<template>
  <q-page class="q-pa-md" style="background-color: #bac6da">
    <div class="row">
      <div class="col-2 q-pa-sm">
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
            <div class="row">
              <div class="col-12 q-pa-xs">
                <DatePicker
                  v-model="portfolioManagementFilter.date"
                  :disabled="!portfolioManagementFilter.findBySpecialDay"
                  @dateSelect="onHandleDateChange"
                  dateFormat="dd-mm-yy"
                />
              </div>
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
                  :placeholder="$t('searchPlayer')"
                  @onSelectPlayer="onSelectPlayer"
                  @onClear="clearPlayerData"
                />
              </div>
              <div class="col-12 q-mt-xs">
                <q-input
                  outlined
                  bg-color="white"
                  v-model="portfolioManagementFilter.rating"
                  :placeholder="$t('rating')"
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
      <div class="col-10 q-pa-sm">
        <q-card flat class="no-box-shadow">
          <q-card-section class="q-pa-sm row">
            <q-tabs
              v-model="currentPortfolioManagementTab"
              dense
              class="text-dark"
              active-color="white"
              indicator-color="blue-grey-8"
              active-bg-color="blue-grey-8"
              align="justify"
              narrow-indicator
              no-caps
              inline-label
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
                >
                  <template v-slot:headerFilterSlots>
                    <div class="col q-mr-sm flex row justify-start">
                      <div class="q-pa-xs flex items-end">
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
                      </div>
                    </div>
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
                >
                  <template v-slot:headerFilterSlots="{ props }">
                    <div class="col q-mr-sm flex row justify-start">
                      <div class="q-pa-xs flex items-end">
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
                        <q-btn
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
                          class="q-ml-sm"
                        />
                      </div>
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
  console.log(val)

  portfolioManagementFilter.value.playerId = val.id
  portfolioManagementFilter.value.fullName = val.value
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
