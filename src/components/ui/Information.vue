<template>
  <q-card flat square class="q-pa-none">
    <q-card-section class="q-pa-none">
      <q-banner
        class="q-card--bordered flex justify-start content-center items-center notifyHeight"
      >
        <template v-slot:avatar>
          <q-icon name="o_info" color="orange" size="20px" />
        </template>
        <div v-html="content"></div>
      </q-banner>
    </q-card-section>
  </q-card>
</template>

<script setup>
defineProps({
  content: {
    type: String,
    required: true,
  },
})
</script>

<style scoped>
.notifyHeight {
  min-height: 40px;
}
</style>
