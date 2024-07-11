<template>
    <div class="card">
      <img class="connexion" src="../../../front/public/titreTransparent.png" alt="Logo Tcheat" />

      <h1>C O N N E X I O N</h1>
      <form @submit.prevent="login">
        <input type="text" placeholder="Pseudo" v-model="username" />
        <input type="password" placeholder="Mot de passe" v-model="password" />
        <button type="submit">Se connecter</button>
      </form>
      <p>
        Pas de compte ? <router-link to="/register">Inscrivez-vous ici</router-link>
      </p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { loginUser } from '../api/auth.js';
  import { useAuthStore } from '../stores/authStore.js';
  
  const router = useRouter();
  const authStore = useAuthStore();
  const username = ref('');
  const password = ref('');
  
  const login = async () => {
    try {
    const response = await loginUser(username.value, password.value);
    console.log("login created:", response);
    authStore.setUser(response.data.login.user);
    authStore.setToken(response.data.login.token);
    
    router.push({ name: 'Messaging' });
  } catch (error) {
    console.error("Error creating conversation:", error);
  }
  };
  </script>
  