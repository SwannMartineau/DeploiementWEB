<template>
  
    <div class="card profile">
      <div class="header">
        <img class="logoHeader" src="../../public/titreTransparent.png" alt="Logo Tcheat" />

      <button class="btn" @click="goToMessage">
        Messages
      </button>
    </div>
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
  import { logoutUser } from '../api/auth.js';
  
  const authStore = useAuthStore();
  const user = authStore.getUser;
  const router = useRouter();
  
  const logout = async () => {
    await logoutUser(user.userID)
    authStore.clearAuth();
    router.push('/login');
  };

  // Méthode pour rediriger vers la page de profil
  const goToMessage = () => {
    router.push('/messaging');
  };
  </script>
