<template>
  <q-card class="no-box-shadow" v-el-perms="showPlayerAttechmentsPermission">
    <div class="row app-cart-grey flex justify-between">
      <div class="text-subtitle2">
        <q-icon
          name="cloud_upload"
          size="17px"
          class="cursor-pointer q-ml-sm my-icon"
          color="blue-grey-8"
        />
        | {{ $t('playerAttechmentsList') }}
      </div>
      <div>
        <q-icon
          name="o_add_comment"
          size="18px"
          class="cursor-pointer q-mr-md my-icon"
          color="blue-grey-8"
          @click="newPlayerAttechmentDialog = true"
        >
        </q-icon>
        <q-icon
          name="cached"
          v-el-perms="reloadPlayerAttechmentsPermission"
          size="18px"
          class="cursor-pointer q-mr-sm my-icon"
          color="blue-grey-8"
          @click="onReloadPlayerAttechments()"
        />
      </div>
    </div>
    <q-card-section class="q-pa-xs">
      <q-list data-cy="playerNotesList">
        <q-scroll-area
          :style="{
            height: playerAttechments.length > 0 ? minHeight + 'px' : 'auto',
          }"
        >
          <q-item
            v-for="(playerAttechment, index) in playerAttechments"
            :key="index"
            class="q-pa-none friend-item"
            dense
          >
            <q-item-section class="flex justify-start">
              <q-item-label
                class="flex justify-start comment-caption content-center items-center text-caption"
                >{{ index + 1 }} .
                <span class="text-capitalize open-link">
                  <a
                    :href="`${apiUrl}/api/PlayerAttachment/DownloadFile?id=${playerAttechment.id}`"
                    target="_blank"
                    class="text-decoration-none"
                    >{{ playerAttechment.fileName }}</a
                  >
                </span>
                <div class="edit-comment q-ml-md">
                  <q-icon
                    name="far fa-trash-alt"
                    size="13px"
                    class="cursor-pointer"
                    color="negative"
                    @click="onDeletePlayerAttechment(friend)"
                  />
                </div>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-scroll-area>
      </q-list>
    </q-card-section>
  </q-card>
  <q-dialog
    v-model="newPlayerAttechmentDialog"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="" square style="width: 500px">
      <q-card-section class="app-cart-grey q-pa-xs">
        <div class="text-subtitle1 text-bold q-pl-sm">
          {{ $t('uploadPlayerAttechment') }} <span class="text-negative">*</span>
        </div>
      </q-card-section>
      <q-card-section class="">
        <div class="text-subtitle2 q-mb-sm">
          {{ $t('selectFileToUpload') }}
        </div>
        <q-file
          v-model="formValues.file"
          :label="$t('selectFile')"
          outlined
          dense
          :rules="[(val) => val !== null || $t('pleaseSelectFile')]"
          counter
          :counter-label="counterLabelFn"
          max-files="1"
        >
          <template v-slot:prepend>
            <q-icon name="cloud_upload" />
          </template>
        </q-file>
      </q-card-section>
      <q-inner-loading :showing="loading">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading>
      <q-card-actions align="right">
        <q-btn
          no-caps
          color="negative"
          unelevated
          :label="$t('close')"
          icon="far fa-times-circle"
          @click="newPlayerAttechmentDialog = false"
        />
        <q-btn
          no-caps
          color="positive"
          unelevated
          :label="$t('upload')"
          icon="far fa-check-circle"
          @click="onSavePlayerAttechment"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { i18n } from 'src/boot/i18n'
import { usePlayerStore } from 'src/stores/player-store'
const playerStore = usePlayerStore()
const apiUrl = `${process.env.API_URL}:${process.env.API_PORT}`
const props = defineProps({
  player: {
    type: Object,
    required: true,
    default: () => {},
  },
  showPlayerAttechmentsPermission: {
    type: String,
    required: true,
    default: () => 'Addon.Operations.CustomerInformation.ShowPlayerAttechments',
  },
  reloadPlayerAttechmentsPermission: {
    type: String,
    required: true,
    default: () => 'Addon.Operations.CustomerInformation.ReloadPlayerAttechments',
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
const newPlayerAttechmentDialog = ref(false)
const formValues = ref({
  playerId: props.playerId,
  file: null,
})
const playerAttechments = ref([])

const loading = ref(false)
const onSavePlayerAttechment = async () => {
  loading.value = true
  const formData = new FormData()
  formData.append('playerId', props.playerId)
  formData.append('file', formValues.value.file)
  await playerStore
    .createPlayerAttechment(formData)
    .then(async () => {
      await fetchPlayerAttechments()
    })
    .finally(() => {
      $q.notify({
        message: i18n.global.t('playerAttechmentUploadedSuccessfully'),
        color: 'positive',
        position: 'bottom-right',
        timeout: 3000,
      })
      setTimeout(() => {
        loading.value = false
        newPlayerAttechmentDialog.value = false
      }, 2000)
    })
}
const onDeletePlayerAttechment = async (playerAttechment) => {
  $q.dialog({
    title: i18n.global.t('deletePlayerAttechment'),
    message: i18n.global.t('onDeletePlayerAttechmentMessage'),
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
    await playerStore.deletePlayerAttechment({
      id: playerAttechment.id,
    })
    await fetchPlayerAttechments()
  })
}
const onReloadPlayerAttechments = async () => {
  await fetchPlayerAttechments()
}

onMounted(async () => {
  await fetchPlayerAttechments()
})

const fetchPlayerAttechments = async () => {
  playerAttechments.value = await playerStore.fetchPlayerAttechments({
    playerId: props.playerId,
  })
}

const counterLabelFn = ({ totalSize, filesNumber, maxFiles }) => {
  return `${filesNumber} files of ${maxFiles} | ${totalSize}`
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
.text-decoration-none {
  text-decoration: none !important;
  color: inherit !important;
}
.text-decoration-none:hover {
  text-decoration: underline !important;
  color: $primary !important;
}
</style>
