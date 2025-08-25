<template>
  <q-card class="no-box-shadow" v-el-perms="showFriendsPermission">
    <div class="row app-cart-grey flex justify-between">
      <div class="text-subtitle2">
        <q-icon
          name="fas fa-users"
          size="14px"
          class="cursor-pointer q-ml-sm my-icon"
          color="blue-grey-8"
        />
        | {{ $t('friendsList') }}
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
                  {{ $t('addFriend') }}
                </div>
              </div>
              <div class="col-12 flex justify-center">
                <search-player-input
                  v-model="formValues.friendId"
                  :optionLabel="'value'"
                  :displayedValue="formValues.friendName"
                  @onSelectPlayer="
                    (args) => {
                      formValues.friendId = args?.id
                      formValues.friendName = args?.value
                    }
                  "
                  :label="$t('addFriend')"
                  class="super-small"
                />
                <q-btn
                  icon="save"
                  size="13px"
                  class="q-ml-sm"
                  :label="$t('save')"
                  @click="onSaveFriend()"
                  color="primary"
                  unelevated
                  no-caps
                  :disable="!formValues.friendId"
                />
                <q-btn
                  autofocus
                  no-caps
                  flat
                  dense
                  color="negative"
                  :label="$t('cancel')"
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
          v-el-perms="reloadFriendsPermission"
          size="18px"
          class="cursor-pointer q-mr-sm my-icon"
          color="blue-grey-8"
          @click="onReloadFriends()"
        />
      </div>
    </div>
    <q-card-section class="q-pa-xs">
      <q-list data-cy="playerNotesList">
        <q-item v-for="(friend, index) in friends" :key="index" class="q-pa-none friend-item" dense>
          <q-item-section class="flex justify-start">
            <q-item-label
              class="flex justify-start comment-caption content-center items-center text-caption"
              >{{ index + 1 }} . {{ friend.friendName }}
              <div class="edit-comment q-ml-md">
                <q-icon
                  name="far fa-trash-alt"
                  size="13px"
                  class="cursor-pointer"
                  color="negative"
                  @click="onDeleteFriend(friend)"
                />
              </div>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { i18n } from 'src/boot/i18n'
import { usePlayerStore } from 'src/stores/player-store'
const playerStore = usePlayerStore()
import SearchPlayerInput from 'src/components/atoms/SearchPlayerInput.vue'
const props = defineProps({
  player: {
    type: Object,
    required: true,
    default: () => {},
  },
  showFriendsPermission: {
    type: String,
    required: true,
    default: () => 'Addon.Operations.CustomerInformation.ShowFriends',
  },
  reloadFriendsPermission: {
    type: String,
    required: true,
    default: () => 'Addon.Operations.CustomerInformation.ReloadFriends',
  },
})
const $q = useQuasar()
const formValues = ref({
  playerId: props.player.id,
  playerName: props.player.value || props.player.name + ' ' + props.player.surname,
  friendId: '',
  friendName: '',
})
const friends = ref([])
const popup = ref(null)
const onSaveFriend = async () => {
  await playerStore.createPlayerFriend(formValues.value).then(async () => {
    await fetchFriends()
  })
  popup.value.hide()
}
const onDeleteFriend = async (friend) => {
  $q.dialog({
    title: i18n.global.t('deleteFriend'),
    message: i18n.global.t('onDeleteFriendMessage'),
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
    await playerStore.deletePlayerFriend(friend)
    await fetchFriends()
  })
}
const onReloadFriends = async () => {
  await fetchFriends()
}

onMounted(async () => {
  await fetchFriends()
})

const fetchFriends = async () => {
  friends.value = await playerStore.fetchPlayerFriends({
    playerId: props.player.id,
  })
}
</script>
<style lang="scss">
.friend-item {
  min-height: 25px !important;
}
</style>
