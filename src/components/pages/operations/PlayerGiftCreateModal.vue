<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="width: 700px; max-width: 80vw">
      <q-card-section class="row items-center q-pa-md">
        <div class="text-h6">
          {{ formValues.id ? $t('editPlayerGift') : $t('newPlayerGift') }}
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="q-pa-md">
        <q-form @submit="onSubmit" class="q-gutter-y-md">
          <SearchPlayerInput
            v-model="formValues.playerId"
            :label="$t('player')"
            @onSelectPlayer="onSelectedPlayer"
            v-if="!initialValues.playerId"
            :optionLabel="'value'"
            :displayedValue="formValues.playerFullName"
            @onClear="onClearPlayer"
            @onSelectedPlayer="onSelectedPlayer"
            class="full-width"
          />
          <q-select-box
            v-model="formValues.giftId"
            :label="$t('gift')"
            :options="gifts"
            :rules="[(val) => !!val]"
            option-label="name"
            option-value="id"
            @update:model-value="
              (val) => {
                const gift = gifts.find((g) => g.id === val)
                if (gift) {
                  formValues.giftName = gift.name
                }
              }
            "
            hide-bottom-space
          />

          <q-field
            outlined
            dense
            v-model="formValues.plannedDate"
            :label="$t('plannedDate')"
            stack-label
            class="super-small"
          >
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">
                {{ formValues.plannedDate }}
              </div>
            </template>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer" />
            </template>
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-date v-model="formValues.plannedDate" mask="DD.MM.YYYY">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup :label="$t('close')" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-field>

          <q-field
            outlined
            dense
            v-model="formValues.givenDate"
            :label="$t('givenDate')"
            stack-label
            @clear="formValues.givenDate = null"
            class="super-small"
          >
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">
                {{ formValues.givenDate }}
              </div>
            </template>
            <template v-slot:append>
              <q-icon
                v-if="formValues.givenDate"
                name="cancel"
                @click.stop.prevent="formValues.givenDate = null"
                class="cursor-pointer"
              />
              <q-icon name="event" class="cursor-pointer" />
            </template>
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-date v-model="formValues.givenDate" mask="DD.MM.YYYY">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup :label="$t('close')" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-field>

          <q-card-actions align="right">
            <q-btn
              unelevated
              icon="close"
              color="negative"
              size="md"
              :label="$t('cancel')"
              class="q-mr-md"
              flat
              no-caps
              v-close-popup
            />
            <q-btn
              unelevated
              icon="save"
              color="deep-purple"
              size="md"
              :label="$t('save')"
              type="submit"
              no-caps
            />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.q-dialog-plugin {
  width: 700px;
  max-width: 80vw;
}
</style>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useDialogPluginComponent } from 'quasar'
import { useOperationsStore } from 'src/stores/operations-store'
import { storeToRefs } from 'pinia'
const operationStore = useOperationsStore()
const { gifts } = storeToRefs(operationStore)
import { date } from 'quasar'

const props = defineProps({
  initialValues: {
    type: Object,
    default: () => ({}),
  },
})

defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()

const formValues = ref({})
const selectedPlayer = ref(null)

const onSubmit = () => {
  const payload = { ...formValues.value }
  if (payload.plannedDate) {
    const plannedDateObj = date.extractDate(payload.plannedDate, 'DD.MM.YYYY')
    if (plannedDateObj) {
      const userTimezoneOffset = plannedDateObj.getTimezoneOffset() * 60000
      payload.plannedDate = new Date(plannedDateObj.getTime() - userTimezoneOffset).toISOString()
    }
  }
  if (payload.givenDate) {
    const givenDateObj = date.extractDate(payload.givenDate, 'DD.MM.YYYY')
    if (givenDateObj) {
      const userTimezoneOffset = givenDateObj.getTimezoneOffset() * 60000
      payload.givenDate = new Date(givenDateObj.getTime() - userTimezoneOffset).toISOString()
    } else {
      payload.givenDate = null
    }
  }
  onDialogOK(payload)
}

watch(
  () => props.initialValues,
  (newVal) => {
    if (!newVal.id) {
      formValues.value = {
        ...newVal,
        plannedDate: date.formatDate(new Date(), 'DD.MM.YYYY'),
        givenDate: null,
      }
    } else {
      formValues.value = {
        ...newVal,
        plannedDate: date.formatDate(newVal.plannedDate, 'DD.MM.YYYY'),
        givenDate: newVal.givenDate ? date.formatDate(newVal.givenDate, 'DD.MM.YYYY') : null,
      }
    }

    if (newVal && newVal.playerId) {
      selectedPlayer.value = {
        id: newVal.playerId,
        value: newVal.playerFullName,
      }
    } else {
      selectedPlayer.value = null
    }
  },
  { immediate: true },
)

onMounted(() => {
  operationStore.fetchGiftList()
})

const onSelectedPlayer = (player) => {
  formValues.value.playerId = player.id
  formValues.value.playerFullName = player.value
}

const onClearPlayer = () => {
  formValues.value.playerId = null
  formValues.value.playerFullName = null
}
</script>
