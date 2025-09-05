<template>
  <q-card class="no-box-shadow" v-el-perms="showLinkedPlayersPermission">
    <div class="row bg-orange-2 flex justify-between">
      <div class="text-subtitle2">
        <q-icon
          name="assignment_ind"
          size="17px"
          class="cursor-pointer q-ml-sm my-icon"
          color="blue-grey-8"
        />
        | {{ $t('linkedPlayers') }}
      </div>
      <div>
        <q-icon
          data-cy="playerCreateNoteBtn"
          name="o_add_comment"
          size="18px"
          class="cursor-pointer q-mr-md my-icon"
          color="blue-grey-8"
        >
          <q-popup-proxy
            :offset="[10, 10]"
            transition-show="scale"
            transition-hide="scale"
            ref="popup"
          >
            <div class="row q-pa-sm" style="max-width: 430px">
              <div class="col-12 q-mb-sm text-center">
                <div class="text-subtitle2">
                  {{ $t('linkOldPlayer') }}
                </div>
              </div>
              <div class="col-12 flex justify-center">
                <search-player-input
                  v-model="formValues.linkedPlayerId"
                  :optionLabel="'value'"
                  :displayedValue="formValues.linkedPlayerFullName"
                  @onSelectPlayer="
                    (args) => {
                      formValues.linkedPlayerId = args?.id
                      formValues.linkedPlayerFullName = args?.value
                    }
                  "
                  :label="$t('linkOldPlayer')"
                  class="super-small"
                />
                <q-btn
                  icon="save"
                  size="13px"
                  class="q-ml-sm"
                  :label="$t('save')"
                  @click="onSaveLinkedPlayer()"
                  color="primary"
                  unelevated
                  no-caps
                  :disable="!formValues.linkedPlayerId"
                />
                <q-btn
                  autofocus
                  no-caps
                  flat
                  dense
                  color="negative"
                  :label="$t('close')"
                  v-close-popup
                  class="q-ml-sm"
                  icon="close"
                />
              </div>
            </div>
          </q-popup-proxy>
        </q-icon>
        <q-icon
          name="cached"
          v-el-perms="reloadLinkedPlayersPermission"
          size="18px"
          class="cursor-pointer q-mr-sm my-icon"
          color="blue-grey-8"
          @click="onReloadFriends()"
        />
      </div>
    </div>
    <q-card-section class="q-pa-xs">
      <q-list data-cy="playerNotesList">
        <q-scroll-area
          :style="{
            height: linkedPlayers.length > 0 ? minHeight + 'px' : 'auto',
          }"
        >
          <q-item
            v-for="(friend, index) in linkedPlayers"
            :key="index"
            class="q-pa-none friend-item"
            dense
          >
            <q-item-section class="flex justify-start">
              <q-item-label
                class="flex justify-start comment-caption content-center items-center text-caption"
                >{{ index + 1 }} .
                <span
                  class="text-capitalize open-link"
                  @click="redirectToCustomerInformation(friend.linkedPlayerId)"
                  >{{ friend.linkedPlayerFullName }}</span
                >
                <q-icon
                  name="arrow_forward"
                  size="15px"
                  class="cursor-pointer q-ml-sm q-mr-sm"
                  color="blue-grey-8"
                />
                <span
                  class="text-capitalize cursor-pointer open-link"
                  @click="redirectToCustomerInformation(friend.playerId)"
                  >{{ friend.playerFullName }}</span
                >
                <div class="edit-comment q-ml-md">
                  <q-icon
                    name="far fa-trash-alt"
                    size="13px"
                    class="cursor-pointer"
                    color="negative"
                    @click="onDeleteLinkedPlayer(friend)"
                  />
                </div>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-scroll-area>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { i18n } from 'src/boot/i18n'
import { usePlayerStore } from 'src/stores/player-store'
import { useAuthStore } from 'src/stores/auth-store'
import { storeToRefs } from 'pinia'
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const playerStore = usePlayerStore()
import SearchPlayerInput from 'src/components/atoms/SearchPlayerInput.vue'
const router = useRouter()
const props = defineProps({
  player: {
    type: Object,
    required: true,
    default: () => {},
  },
  showLinkedPlayersPermission: {
    type: String,
    required: true,
    default: () => 'Addon.Operations.CustomerInformation.ShowLinkedPlayers',
  },
  reloadLinkedPlayersPermission: {
    type: String,
    required: true,
    default: () => 'Addon.Operations.CustomerInformation.ReloadLinkedPlayers',
  },
  playerId: {
    type: Number,
    required: true,
    default: () => null,
  },
  minHeight: {
    type: Number,
    required: false,
    default: () => 60,
  },
})
const $q = useQuasar()
const formValues = ref({
  createdByName: user.value.profile.name,
  playerId: props.playerId,
  playerFullName: props.player.value || props.player.name + ' ' + props.player.surname,
  linkedPlayerId: '',
  linkedPlayerFullName: '',
})
const linkedPlayers = ref([])
const popup = ref(null)
const onSaveLinkedPlayer = async () => {
  await playerStore.createPlayerLinkedPlayer(formValues.value).then(async () => {
    await fetchLinkedPlayers()
  })
  popup.value.hide()
}
const onDeleteLinkedPlayer = async (friend) => {
  $q.dialog({
    title: i18n.global.t('unlinkOldPlayer'),
    message: i18n.global.t('onDeleteLinkedPlayerMessage'),
    persistent: true,
    focus: 'cancel',
    ok: {
      flat: true,
      color: 'negative',
      label: i18n.global.t('yes'),
      class: 'text-capitalize',
    },
    cancel: {
      flat: true,
      color: 'primary',
      label: i18n.global.t('no'),
      class: 'text-capitalize',
    },
    transitionShow: 'slide-up',
    transitionHide: 'slide-down',
  }).onOk(async () => {
    await playerStore.deletePlayerLinkedPlayer({
      id: friend.id,
    })
    await fetchLinkedPlayers()
  })
}
const onReloadFriends = async () => {
  await fetchLinkedPlayers()
}

onMounted(async () => {
  await fetchLinkedPlayers()
})

const fetchLinkedPlayers = async () => {
  linkedPlayers.value = await playerStore.fetchPlayerLinkedPlayers({
    playerId: props.playerId,
  })
}
const redirectToCustomerInformation = (playerId) => {
  const routerData = router.resolve({
    name: 'customerInformation',
    query: { playerId: playerId },
  })
  window.open(routerData.href, '_blank')
}
</script>
<style lang="scss">
.friend-item {
  min-height: 25px !important;
}
.open-link {
  &:hover {
    text-decoration: underline;
  }
}
</style>
