<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    transition-show="slide-up"
    transition-hide="slide-down"
    backdrop-filter="brightness(40%)"
  >
    <q-card class=" " style="width: 500px">
      <q-bar>
        <div class="text-subtitle1 text-bold">
          {{ $t('importGiftExcel') }}
        </div>
      </q-bar>
      <q-card-section class="q-pt-none q-mt-md">
        <q-form @submit="onImportClick">
          <div class="row">
            <div class="col-12">
              <q-file
                v-model="file"
                outlined
                accept=".xlsx,.xls"
                :label="$t('selectFile')"
                dense
                :rules="[(val) => val !== null || $t('pleaseSelectFile')]"
              />
            </div>
            <div class="col-12 text-right">
              <q-btn
                :label="$t('cancel')"
                flat
                no-caps
                @click="onDialogCancel"
                color="negative"
                class="q-mr-sm"
                icon="close"
                type="button"
              />
              <q-btn
                :label="$t('import')"
                color="primary"
                unelevated
                no-caps
                type="submit"
                icon="file_upload"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { i18n } from 'boot/i18n'
import { useDialogPluginComponent, Loading } from 'quasar'
import { useOperationsStore } from 'src/stores/operations-store'
const operationStore = useOperationsStore()
defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const file = ref(null)
const onImportClick = async () => {
  const formData = new FormData()

  formData.append('file', file.value)
  formData.append('skipHeader', true)
  Loading.show({
    message: i18n.global.t('importing'),
  })
  await operationStore.importExcelPortfolioManagement(formData)
  Loading.hide()
  onDialogOK()
}
</script>

<style lang="scss"></style>
