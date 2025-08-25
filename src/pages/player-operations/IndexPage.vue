<template>
  <q-page class="q-pa-md">
    <div class="row">
      <div class="col-md-4 q-pa-sm col-sm-12 col-xs-12">
        <q-card class="no-box-shadow app-cart-grey q-mb-md">
          <q-card-section class="q-pa-none">
            <div class="">
              <q-card class="q-mb-md no-box-shadow col-12 q-mt-xl">
                <q-card-section class="text-center q-pb-none">
                  <div class="text-subtitle1 text-bold">
                    <q-icon name="remove" />
                    {{ $t('searchUsers') }}
                  </div>
                  <div class="text-subtitle2">
                    {{ $t('searchUserDesc') }}
                  </div>
                </q-card-section>
                <q-card-actions>
                  <q-select
                    dense
                    autofocus
                    :placeholder="selectedPlayer === null ? $t('searchUsers') : ''"
                    outlined
                    use-input
                    clearable
                    v-model="selectedPlayer"
                    :options="searchedPlayerOptions"
                    :option-label="(opt) => opt.value + ' - ' + opt.id"
                    class="full-width"
                    :loading="searchPlayerLoading"
                    input-debounce="500"
                    @filter="onSearchPlayer"
                    :popup-content-class="
                      searchedPlayerOptions.length > 0 ? 'user-exist-popup-content' : ''
                    "
                    behavior="menu"
                    data-cy="searchPlayer"
                  >
                    <template v-slot:no-option>
                      <q-item v-if="searchPlayerLoading">
                        <q-item-section class="text-grey">
                          {{ $t('base.notFound') }}
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </q-card-actions>
                <q-card-section class="q-pt-sm">
                  <LastSearchedPlayer
                    :lastSearchedPlayers="lastSearchedPlayers"
                    :redirectToPlayerDetail="redirectToPlayerDetail"
                  />
                </q-card-section>
              </q-card>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-8 q-pa-sm">
        <CashdeskSummary
          :cashDeskSummary="cashDeskSummary"
          :reloadCashDeskSummary="cashdeskStore.getCashDeskSummary"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import LastSearchedPlayer from 'src/components/pages/player-operations/LastSearchedPlayers.vue'
import CashdeskSummary from 'src/components/pages/player-operations/CashdeskSummary.vue'
import { usePlayerSearch } from 'src/composables/player-operations/usePlayerSearch'
const {
  lastSearchedPlayers,
  onSearchPlayer,
  searchedPlayerOptions,
  selectedPlayer,
  searchPlayerLoading,
  redirectToPlayerDetail,
  cashDeskSummary,
  cashdeskStore,
} = usePlayerSearch()
</script>
