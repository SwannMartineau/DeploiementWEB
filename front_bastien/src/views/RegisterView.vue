<template>
    <div class="register">
      <h1>Register</h1>
      <form @submit.prevent="register">
        <input type="text" placeholder="Username" v-model="username" />
        <input type="text" placeholder="Email" v-model="email" />
        <input type="password" placeholder="Password" v-model="password" />
        <button type="submit">Register</button>
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

  const router = useRouter();
  const authStore = useAuthStore();
  const username = ref('');
  const email = ref('');
  const password = ref('');
  
  const register = async () => {
    // Simulation d'une inscription réussie
    console.log('User registered:', username.value);
    try {
    const response = await registerUser(username.value, email.value, password.value);
    authStore.setUser(response.data.signUP.user);
    authStore.setToken(response.data.signUP.token);
    console.log("login created:", response);
    router.push({ name: 'Messaging' });
  } catch (error) {
    console.error("Error creating conversation:", error);
  }
  };
  </script>
  
  <style scoped>
  .register {
    max-width: 300px;
    margin: 0 auto;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  h1 {
    color: #42b983;
    text-align: center;
  }
  form {
    display: flex;
    flex-direction: column;
  }
  input {
    margin-bottom: 1rem;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  button {
    padding: 0.5rem;
    border: none;
    border-radius: 4px;
    background-color: #42b983;
    color: white;
    cursor: pointer;
  }
  button:hover {
    background-color: #36a372;
  }
  p {
    text-align: center;
    margin-top: 1rem;
  }
  </style>
  