<template>
  <div>
    <div class="row flex justify-center content-center items-start">
      <div class="col-4">
        <div class="player-photo-container">
          <q-img
            class="player-photo"
            :src="$playerPhotoUrl + selectedPlayer?.player?.id"
            :error-src="'/assets/no-photo.png'"
            :img-style="{
              borderRadius: '4px',
              objectFit: 'cover',
            }"
          />
        </div>
      </div>
      <div class="col-8 q-pl-sm row">
        <div
          class="text-subtitle1 q-mb-xs cursor-pointer flex justify-between content-end items-end no-wrap"
        >
          <span class="text-capitalize">
            {{ selectedPlayer.player.name }}
            {{ selectedPlayer.player.surname }}
            <q-menu>
              <q-list style="min-width: 100px" dense square>
                <q-item
                  clickable
                  v-close-popup
                  dense
                  class="q-pa-none bg-blue-grey-2 q-card--bordered"
                >
                  <div class="flex justify-center content-center items-center">
                    <q-icon name="o_person" class="q-mr-xs" />
                    {{ $t('profileDetails') }}
                  </div>
                </q-item>
                <q-item
                  clickable
                  v-close-popup
                  @click="redirectToCustomerInformation"
                  dense
                  class="q-pa-none"
                >
                  <div class="flex justify-between content-center items-center">
                    {{ $t('customerInformation') }}
                    <q-icon name="arrow_forward" class="q-ml-sm" />
                  </div>
                </q-item>
                <q-separator />
                <q-item
                  clickable
                  v-close-popup
                  @click="redirectToRidottoPlayerDetail"
                  dense
                  class="q-pa-none"
                >
                  <div class="flex justify-between content-center items-center">
                    {{ $t('ridottoPlayerDetail') }}
                    <q-icon name="arrow_forward" class="q-ml-sm" />
                  </div>
                </q-item>
              </q-list>
            </q-menu>
          </span>

          <span class="text-subtitle1 q-ml-lg comment-caption flex content-end items-center"
            >#{{ selectedPlayer.player.id }}
            <div class="edit-comment">
              <q-icon
                name="o_content_copy"
                class="q-ml-sm cursor-pointer my-icon"
                color="blue-grey-8"
                @click="copyPlayerId"
              />
            </div>
          </span>
        </div>
        <div class="col-12">
          <div class="text-body2 flex justify-between content-end items-center comment-caption">
            <div>
              {{ $t('defaultCurrency') }}:
              <span v-if="currencies.length > 0" data-cy="playerDefaultCurrency" class="q-ml-sm">{{
                getCurrencyById(selectedPlayer.player.defaultCurrency).name
              }}</span>
            </div>
            <div class="edit-comment">
              <q-icon
                data-cy="changePlayerDefaultCurrency"
                name="fa fa-edit"
                class="q-ml-sm cursor-pointer my-icon"
                color="blue-grey-8"
                v-el-perms="'Addon.CashlessOperations.MetaDetail.UpdateDefaultCurrency'"
              >
                <q-menu transition-show="scale" transition-hide="scale">
                  <q-scroll-area class="popup-scroll">
                    <div class="column text-center app-cart-grey q-card--bordered">
                      <div class="text-subtitle2 q-pa-xs">
                        {{ $t('currencies') }}
                      </div>
                    </div>
                    <q-list
                      data-cy="currencyList"
                      dense
                      style="min-width: 150px"
                      v-for="(currency, index) in currencies"
                      :key="index"
                    >
                      <q-item
                        clickable
                        v-close-popup
                        @click="
                          playerStore.updatePlayerDefaultCurrency({
                            currencyId: currency.id,
                            playerId: selectedPlayer.player.id,
                          })
                        "
                      >
                        <q-item-section class="items-center flex justify-between">
                          {{ currency.name }} {{ currency.symbol }}
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-scroll-area>
                </q-menu>
              </q-icon>
            </div>
          </div>
        </div>
        <div class="col-12">
          <div class="text-body2 flex justify-between content-end items-center comment-caption">
            <div class="flex items-center">
              {{ $t('blacklisted') }}:
              <q-chip
                v-if="selectedPlayer.player.isBlackListed"
                color="negative"
                size="sm"
                square
                text-color="white"
                icon="fa fa-check"
              >
                {{ $t('blacklisted') }}
              </q-chip>
              <q-chip
                v-else
                color="blue-grey-8"
                size="sm"
                square
                text-color="white"
                icon="fa fa-times"
              >
                {{ $t('notBlacklisted') }}
              </q-chip>
            </div>
            <div class="edit-comment">
              <q-icon
                data-cy="changeUserBlacklistBtn"
                name="fa fa-edit"
                class="cursor-pointer my-icon"
                color="blue-grey-8"
                v-el-perms="'Addon.CashlessOperations.MetaDetail.UpdateBlackList'"
              >
                <q-menu
                  transition-show="scale"
                  transition-hide="scale"
                  @show="onHandleShowBlackListMenu"
                >
                  <div class="row q-pl-md q-pr-md q-pt-sm" style="max-width: 250px !important">
                    <div class="col-12">
                      <div class="text-subtitle2">
                        {{ $t('blacklisted') }}:
                        <q-toggle
                          v-model="selectedPlayer.player.isBlackListed"
                          color="negative"
                          @update:model-value="
                            updatePlayerBlacklist({
                              playerId: selectedPlayer.player.id,
                              isBlackListed: selectedPlayer.player.isBlackListed,
                              ...playerBlackListHistory[playerBlackListHistory.length - 1],
                            })
                          "
                          data-cy="playerIsBlacklistedToggle"
                        />
                        <q-badge color="orange">
                          <div class="text-caption">
                            {{ selectedPlayer.player.isBlackListed ? 'Active' : 'Not Blacklisted' }}
                          </div>
                        </q-badge>
                      </div>
                    </div>
                  </div>
                  <div class="row q-pa-xs q-pb-sm" style="max-width: 250px !important">
                    <q-item
                      dense
                      v-ripple
                      class="col-12"
                      v-for="(blackList, index) in playerBlackListHistory"
                      :key="index"
                    >
                      <q-item-section class="text-center">
                        <q-item-label class="text-capitalize flex content-center">
                          {{ blackList.reason }}
                        </q-item-label>
                        <q-item-label caption lines="1" class="text-capitalize flex items-center">
                          {{ blackList.requestBy }}
                          <q-icon
                            name="o_info"
                            size="15px"
                            class="text-dark cursor-pointer q-ml-md"
                          >
                            <q-tooltip class="q-card app-cart-grey text-dark">
                              <div class="text-body2">
                                {{ $t('requestBy') }} :
                                {{ blackList.requestBy }}
                              </div>
                              <div class="text-body2">
                                {{ $t('blackListNote') }} :
                                {{ blackList.reason }}
                              </div>
                              <div class="text-body2">
                                {{ $t('createdAt') }} :
                                {{ date.formatDate(blackList.createdAt, 'DD.MM.YYYY HH:mm') }}
                              </div>
                            </q-tooltip>
                          </q-icon>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </div>
                </q-menu>
              </q-icon>
            </div>
          </div>
        </div>
        <div class="col-12">
          <div class="text-body2 flex justify-between content-end items-center comment-caption">
            <div>
              {{ $t('playerClass') }}:

              <span v-if="selectedPlayer.player.class" class="q-ml-sm">
                {{ selectedPlayer.player.class }}
              </span>
            </div>

            <div class="edit-comment">
              <q-icon
                data-cy="changePlayerClass"
                name="fa fa-edit"
                class="q-ml-sm cursor-pointer my-icon"
                color="blue-grey-8"
                v-el-perms="'Addon.CashlessOperations.MetaDetail.UpdatePlayerClass'"
              >
                <q-menu transition-show="scale" transition-hide="scale">
                  <q-scroll-area class="popup-scroll text-center">
                    <div class="column text-center app-cart-grey q-card--bordered">
                      <div class="text-subtitle2 q-pa-sm">
                        {{ $t('classes') }}
                      </div>
                    </div>

                    <q-list
                      data-cy="classList"
                      dense
                      v-for="(cls, index) in playerClasses"
                      :key="index"
                    >
                      <q-item
                        clickable
                        v-close-popup
                        @click="
                          playerStore.updatePlayerClass({
                            playerId: selectedPlayer.player.id,
                            userClassId: cls.id,
                          })
                        "
                        dense
                      >
                        <q-item-section
                          :class="{
                            'bg-blue-grey-2': cls.name === selectedPlayer.player.class,
                          }"
                        >
                          {{ cls.name }}
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-scroll-area>
                </q-menu>
              </q-icon>
            </div>
          </div>
        </div>
        <div class="col-12">
          <div
            class="text-body2 text-body2 flex justify-between content-end items-center comment-caption"
          >
            <div>
              {{ $t('discount') }}:
              <span class="q-ml-sm" v-if="selectedPlayer.player.discount">
                % {{ selectedPlayer.player.discount }}
              </span>
            </div>

            <div class="edit-comment">
              <q-icon
                data-cy="makePlayerDiscount"
                name="fa fa-edit"
                class="q-ml-sm cursor-pointer my-icon"
                color="blue-grey-8"
                v-el-perms="'Addon.CashlessOperations.MetaDetail.UpdateDiscount'"
              >
                <q-popup-edit
                  v-model="selectedPlayer.player.discount"
                  auto-save
                  v-slot="scope"
                  transition-show="scale"
                  transition-hide="scale"
                  anchor="top middle"
                  persistent
                >
                  <div class="text-subtitle2">
                    {{ $t('enterDiscount') }}
                  </div>
                  <q-input
                    type="number"
                    v-model="scope.value"
                    dense
                    autofocus
                    outlined
                    @keyup.enter="scope.set"
                    :rules="[(val) => scope.validate(val) || $t('maxDiscount')]"
                    data-cy="playerDiscountInput"
                    style="width: 200px"
                  >
                  </q-input>
                  <div class="col-12 row justify-end">
                    <q-btn
                      flat
                      dense
                      color="negative"
                      icon="o_cancel"
                      :label="$t('cancel')"
                      @click.stop.prevent="scope.cancel"
                      no-caps
                    />
                    <q-btn
                      flat
                      dense
                      color="deep-purple"
                      icon="save"
                      :label="$t('save')"
                      @click.stop.prevent="scope.set"
                      :disable="
                        scope.validate(scope.value) === false || scope.initialValue === scope.value
                      "
                      @click="
                        playerStore.updatePlayerDiscount({
                          playerId: selectedPlayer.player.id,
                          discount: scope.value ? scope.value : null,
                        })
                      "
                      no-caps
                      data-cy="savePlayerDiscount"
                    />
                  </div>
                </q-popup-edit>
              </q-icon>
            </div>
          </div>
        </div>
        <div class="col-12">
          <div class="text-body2 text-body2 flex justify-start content-end items-center">
            {{ $t('lastSeen') }}:
            <span class="bg-orange-4 text-caption border-sm q-ml-md">
              {{ date.formatDate(selectedPlayer.player.lastSeenDate, 'DD.MM.YYYY HH:mm') }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { usePlayer } from 'src/composables/player-operations/usePlayer'
const {
  selectedPlayer,
  playerStore,
  redirectToRidottoPlayerDetail,
  redirectToCustomerInformation,
  copyPlayerId,
  currencies,
  getCurrencyById,
  updatePlayerBlacklist,
  onHandleShowBlackListMenu,
  date,
  playerBlackListHistory,
  playerClasses,
} = usePlayer()

onMounted(async () => {
  await playerStore.fetchPlayerClasses()
  await playerStore.fetchAccountTypes()
})
</script>
<style lang="scss">
.border-sm {
  border-radius: 4px;
}
</style>
