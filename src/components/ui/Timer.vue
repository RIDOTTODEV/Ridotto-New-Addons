<template>
  <q-card flat class="sideBarBg text-white" bordered square>
    <q-card-section class="q-pa-none">
      <div class="row q-pa-xs q-pb-none">
        <div class="col-4 flex flex-center">
          <q-btn icon="alarm" unelevated class="footer-text text-white" />
        </div>
        <div class="col-8 row flex flex-center">
          <div class="text-subtitle1 footer-text text-bold col-12 text-white">
            {{ time }}
          </div>
          <div class="text-caption footer-text col-12 text-white" style="margin-top: -5px">
            {{ date }}
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup>
import { ref } from 'vue'
const time = ref(new Date().toLocaleTimeString())
setInterval(() => {
  time.value = new Date().toLocaleTimeString()
}, 1000)
const date = ref(new Date().toDateString())
</script>
<style scoped lang="scss">
.sideBarBg {
  background-color: #3c5d7a !important;
}
</style>
