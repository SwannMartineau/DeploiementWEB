<template>
    <div class="login">
      <h1>Login</h1>
      <form @submit.prevent="login">
        <input type="text" placeholder="Username" v-model="username" />
        <input type="password" placeholder="Password" v-model="password" />
        <button type="submit">Login</button>
      </form>
      <p>
        Pas de compte ? <router-link to="/register">Inscrivez-vous ici</router-link>
      </p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const username = ref('');
  const password = ref('');
  
  const login = () => {
    // Simulation d'une connexion réussie
    router.push({ name: 'Messaging' });
  };
  </script>
  
  <style scoped>
  .login {
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
  