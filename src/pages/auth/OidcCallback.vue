<template>
  <div class="callback-page"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import mainOidc from 'src/helpers/oidc-lib'

const router = useRouter()

onMounted(async () => {
  console.log('OidcCallback mounted')
  try {
    await mainOidc.mgr.signinRedirectCallback()
    router.push('/')
  } catch (error) {
    console.error('Callback işlemi sırasında hata:', error)
    router.push('/login')
  }
})
</script>
