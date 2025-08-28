<template>
  <q-card class="no-box-shadow" v-el-perms="showNotePermission">
    <div class="row app-cart-grey flex justify-between">
      <div class="text-subtitle2">
        <q-icon
          name="o_chat"
          size="18px"
          class="cursor-pointer q-ml-sm my-icon"
          color="blue-grey-8"
        />
        | {{ title }}
      </div>
      <div class="">
        <q-icon
          data-cy="playerCreateNoteBtn"
          v-el-perms="createNotePermission"
          name="o_add_comment"
          size="18px"
          class="cursor-pointer q-mr-md my-icon"
          color="blue-grey-8"
        >
          <q-popup-proxy
            :offset="[10, 10]"
            style="width: 300px"
            anchor="bottom left"
            transition-show="scale"
            transition-hide="scale"
            touch-position
            persistent
            ref="notePopup"
          >
            <q-card class="">
              <q-card-section class="q-pt-sm q-pb-none">
                <div class="text-subtitle2">
                  {{ $t('enterComment') }}
                </div>
              </q-card-section>
              <q-card-section class="q-pt-sm">
                <q-form @submit="onSubmitPlayerNote()">
                  <q-input
                    v-model="newNote"
                    type="textarea"
                    autofocus
                    dense
                    outlined
                    :rules="[(val) => val.length > 5 || $t('minCharacters', { min: 5 })]"
                    :placeholder="$t('minCharacters', { min: 5 })"
                    data-cy="playerNoteInput"
                  />
                  <div class="row justify-end">
                    <q-btn
                      autofocus
                      no-caps
                      flat
                      dense
                      color="negative"
                      :label="$t('cancel')"
                      class="q-mr-md"
                      icon="close"
                      @click="onCancelPlayerNote"
                    />

                    <q-btn
                      data-cy="saveNote"
                      unelevated
                      dense
                      color="deep-purple"
                      no-caps
                      type="submit"
                      icon="save"
                      :label="$t('save')"
                      :disable="newNote.length < 5"
                    />
                  </div>
                </q-form>
              </q-card-section>
            </q-card>
          </q-popup-proxy>
        </q-icon>
        <q-icon
          name="cached"
          v-el-perms="reloadNotesPermission"
          size="18px"
          class="cursor-pointer q-mr-sm my-icon"
          color="blue-grey-8"
          @click="fetchNotes"
        />
      </div>
    </div>
    <q-card-section class="q-pa-xs">
      <q-scroll-area
        :style="{
          height: notes.length > 0 ? minHeight + 'px' : 'auto',
        }"
      >
        <q-list data-cy="playerNotesList">
          <q-item v-for="(note, index) in notes" :key="index" class="q-pa-none">
            <q-item-section class="flex justify-start">
              <q-item-label class="text-caption wrap">{{ note.note }}</q-item-label>
              <q-item-label caption class="flex justify-start comment-caption">
                {{ note.createdByName }} |
                {{ date.formatDate(note.createdAt, 'DD.MM.YYYY HH:mm') }}
                <div class="edit-comment q-ml-xs">
                  <q-icon
                    name="far fa-trash-alt"
                    size="13px"
                    class="cursor-pointer"
                    color="negative"
                    @click="onDeletePlayerNote(note)"
                  />
                  <q-icon
                    name="fa fa-edit"
                    size="13px"
                    class="cursor-pointer q-ml-sm"
                    color="blue-grey-8"
                    @click="onEditPlayerNote(note, noteSource)"
                  />
                </div>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-card-section>
  </q-card>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePlayerStore } from 'src/stores/player-store'
import { useAuthStore } from 'src/stores/auth-store'
import { date, useQuasar } from 'quasar'
import { i18n } from 'boot/i18n'
const playerStore = usePlayerStore()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const $q = useQuasar()
const newNote = ref('')
const notePopup = ref(null)
const props = defineProps({
  showNotePermission: {
    type: String,
    required: true,
    default: () => 'Addon.CashlessOperations.MetaDetail.ShowNotes',
  },
  createNotePermission: {
    type: String,
    required: true,
    default: () => 'Addon.CashlessOperations.MetaDetail.CreateNote',
  },
  reloadNotesPermission: {
    type: String,
    required: true,
    default: () => 'Addon.CashlessOperations.MetaDetail.ReloadNotes',
  },
  noteSource: {
    type: String,
    required: true,
    default: () => 'General',
  },
  playerId: {
    type: Number,
    required: true,
    default: () => null,
  },
  minHeight: {
    type: Number,
    required: true,
    default: () => 60,
  },
  title: {
    type: String,
    required: true,
    default: () => 'General Notes',
  },
})
const onDeletePlayerNote = (note) => {
  $q.dialog({
    title: i18n.global.t('deleteNote'),
    message: i18n.global.t('onDeleteNoteMessage'),
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
  }).onOk(() => {
    playerStore.deletePlayerNote({
      playerId: props.playerId,
      id: note.id,
    })
  })
}
const editingNote = ref(null)
const onEditPlayerNote = (note) => {
  editingNote.value = note
  newNote.value = note.note
  notePopup.value.show()
}
const onCancelPlayerNote = () => {
  notePopup.value.hide()
  newNote.value = ''
  editingNote.value = null
}
const onSubmitPlayerNote = async () => {
  if (editingNote.value) {
    await playerStore.updatePlayerNote({
      ...editingNote.value,
      note: newNote.value,
      playerId: props.playerId,
    })
    notePopup.value.hide()
    editingNote.value = null
    newNote.value = ''
    fetchNotes()
  } else {
    await playerStore.createPlayerNote({
      playerId: props.playerId,
      note: newNote.value,
      creatorUserId: user.value.id,
      source: props.noteSource,
    })
    notePopup.value.hide()
    newNote.value = ''
    fetchNotes()
  }
}

const notes = ref([])

onMounted(async () => {
  await fetchNotes()
})
const fetchNotes = async () => {
  notes.value = await playerStore.fetchPlayerNotes({
    playerId: props.playerId,
    source: props.noteSource,
  })
}
</script>
