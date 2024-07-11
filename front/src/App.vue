<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();

if (!authStore.isAuthenticated) {
  const router = useRouter();
  router.push('/login');
}
</script>
