<template>
  <div class="hello">
    <h1>All Users</h1>
    <ul>
      <li v-for="user in allUsers" :key="user.userID">
        {{ user.firstName }} {{ user.lastName }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAllUsers } from '../api/user.js';

const allUsers = ref([]);

onMounted(async () => {
  try {
    const response = await getAllUsers();
    allUsers.value = response.data.getAllUsers;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
});
</script>

<!-- <style scoped>
h1 {
  color: #b98eda;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 0.5rem 0;
}
</style> -->
