import { createRouter, createWebHistory } from 'vue-router';
import Login from './views/LoginView.vue';
import Register from './views/RegisterView.vue';
import Messaging from './views/MessagingView.vue';
import Profile from './views/ProfileView.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/messaging',
    name: 'Messaging',
    component: Messaging
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
