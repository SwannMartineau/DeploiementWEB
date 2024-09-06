<template>
    <div class="card">
      <img class="connexion" src="../../public/titreTransparent.png" alt="Logo Tcheat" />

      <h1>I N S C R I P T I O N</h1>
      <form @submit.prevent="register">
        <input type="text" placeholder="Pseudo" v-model="username" />
        <input type="text" placeholder="Email" v-model="email" />
        <input type="password" placeholder="Mot de passe" v-model="password" />
        <button type="submit">S'inscrire</button>
      </form>
      <p>
        Déjà un compte ? <router-link to="/login">Connectez-vous ici</router-link>
      </p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';  
  import { useRouter } from 'vue-router';
  import { registerUser } from '../api/auth.js';
  import { useAuthStore } from '../stores/authStore.js';  
  import socket from '../socket.js'; // Importer Socket.IO


  const router = useRouter();
  const authStore = useAuthStore();
  const username = ref('');
  const email = ref('');
  const password = ref('');
  
  const register = async () => {
    // Simulation d'une inscription réussie
    try {
    const response = await registerUser(username.value, email.value, password.value);
    const user = response.data.signUP.user;
    authStore.setUser(response.data.signUP.user);
    authStore.setToken(response.data.signUP.token);
    socket.emit('setSocketId', user.userID);
    router.push({ name: 'Messaging' });
  } catch (error) {
    console.error("Error creating conversation:", error);
  }
  };
  </script>