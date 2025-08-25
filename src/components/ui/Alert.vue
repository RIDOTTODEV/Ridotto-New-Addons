<template>
  <transition name="slide-fade" mode="out-in">
    <q-card v-if="show" class="no-box-shadow full-width border-radius-sm" flat>
      <q-card-section class="q-pa-none">
        <div
          :class="alertType.color + ' flex row justify-between q-pa-sm '"
          style="border-radius: inherit"
        >
          <div class="div flex items-center">
            <q-icon
              :name="alertType.icon"
              :color="alertType.iconColor"
              size="30px"
              class="q-mr-sm"
            />
            <div class="text-subtitle2" :class="alertType.textColor">
              {{ message }}
            </div>
          </div>
          <div class="div">
            <q-btn round rounded @click="close" icon="close" flat dense />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </transition>
</template>
<script setup>
import { ref, inject } from "vue";
const bus = inject("bus");

const props = defineProps({
  message: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
});
const message = ref(props.message);
const type = ref(props.type);
const alertTypes = {
  success: {
    icon: "o_check_circle",
    color: "bg-positive",
    textColor: "text-positive",
    iconColor: "positive",
  },
  error: {
    icon: "o_report",
    color: "bg-negative",
    textColor: "text-negative",
    iconColor: "negative",
  },
  warning: {
    icon: "o_warning",
    color: "bg-warning",
    textColor: "text-warning",
    iconColor: "warning",
  },
  info: {
    icon: "o_info",
    color: "bg-info",
    textColor: "text-info",
    iconColor: "info",
  },
};
const alertType = ref(alertTypes[type.value]);
const show = ref(false);
const close = () => {
  show.value = false;
};
bus.on("showAlert", (alert) => {
  if (alert.message) {
    show.value = true;
    message.value = alert.message;
    type.value = alert.type;
    alertType.value = alertTypes[type.value];
  }
});
</script>
<style scoped>
.bg-positive {
  background-color: rgb(225 246 232) !important;
}
.bg-negative {
  background-color: #f8d7da !important;
}
.bg-warning {
  background-color: #fff3cd !important;
}
.bg-info {
  background-color: rgb(223 244 248) !important;
}
.text-positive {
  color: #28c76f;
}
.text-negative {
  color: #ff4c51 !important ;
}
.text-warning {
  color: #ff9f43 !important;
}
.text-info {
  color: #00bad1 !important;
}
.border-radius-sm {
  border-radius: 6px;
}
</style>
