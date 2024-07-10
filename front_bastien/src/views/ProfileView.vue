<template>
    <div class="profile">
      <h1>Profil</h1>
      <div v-if="user">
        <p><strong>ID:</strong> {{ user.userID }}</p>
        <p><strong>Nom:</strong> {{ user.username }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
      </div>
      <button @click="logout" class="btn btn-primary">Déconnexion</button>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/authStore';
  
  const authStore = useAuthStore();
  const user = authStore.getUser;
  const router = useRouter();
  
  const logout = () => {
    authStore.clearAuth();
    router.push('/login');
  };
  </script>
  
  <style scoped>
  .profile {
    max-width: 600px;
    margin: 0 auto;
    padding: 1rem;
    text-align: center;
  }
  h1 {
    color: #42b983;
    margin-bottom: 1rem;
  }
  p {
    margin: 0.5rem 0;
  }
  button {
    margin-top: 1rem;
  }
  </style>
  