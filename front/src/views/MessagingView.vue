<template>
  <div class="card messaging">
    <div class="header">
      <img class="logoHeader" src="../../public/titreTransparent.png" alt="Logo Tcheat" />
      <button class="btn" @click="goToProfile">Profil</button>
    </div>
    
    <div class="blocs">
      <!-- Liste des conversations -->
      <div class="conversation-list">
        <h3>Mes conversations</h3>
        <button class="btn btn-primary mb-3" @click="openCreateModal">Créer une conversation</button>
        <ul>
          <li 
            v-for="conversation in filteredParticipants" 
            :key="conversation.conversationID" 
            @click="selectConversation(conversation)" 
            :class="{ active: selectedConversation && selectedConversation.conversationID === conversation.conversationID }">
            {{ conversation.participants[0].username }}
          </li>
        </ul>
      </div>
      
      <!-- Messages de la conversation sélectionnée -->
      <div class="conversation-messages container-Mess" v-if="selectedConversation">
        <h2>{{ selectedConversation.participants[0].username }}</h2>
        <div class="blocMessages">
          <div 
            v-for="message in selectedConversation.messages" 
            :key="message.messageID" 
            :class="{'message-sent': message.fromUser.userID === user.userID, 'message-received': message.fromUser.userID !== user.userID}">
            {{ message.content }}
          </div>
        </div>
        
        <form class="blocSend bottom-div" @submit.prevent="sendMessageToConversation">
          <div class="mb-3">
            <label for="messageContent" class="form-label">Nouveau message</label> <br/>
            <textarea id="messageContent" v-model="newMessageContent" class="form-control"></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Envoyer</button>
        </form>
      </div>
    </div>
    
    <!-- Modal pour créer une nouvelle conversation -->
    <div class="modal" tabindex="-1" role="dialog" v-if="showCreateModal">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="header">
            <button type="button" class="btn-close" @click="closeCreateModal">Fermer</button>
          </div>
          <div class="modal-header">
            <h2 class="modal-title">Créer une nouvelle conversation</h2>
          </div>
          <div class="modal-body">
            <form @submit.prevent="createConversationWithNewUser">
              <div class="mb-3">
                <label for="selectUser" class="form-label">Sélectionner un utilisateur</label> <br/>
                <select id="selectUser" v-model="selectedUserId" class="form-select">
                  <option v-for="user in users" :key="user.userID" :value="user.userID">{{ user.username }}</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary">Créer</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import socket from '../socket.js'; // Importer le socket
import { useAuthStore } from '../stores/authStore';
import { 
  createConversation, 
  getAllConversationsByParticipantId,
} from '../api/conversations.js';
import { 
  getAllMessagesByConversationId, 
  sendMessage 
} from '../api/message.js';
import { getAllUsers } from '../api/user.js';

// Variables réactives
const conversations = ref([]);
const users = ref([]);
const selectedUserId = ref(null);
const selectedConversation = ref(null);
const newMessageContent = ref('');
const showCreateModal = ref(false);

const authStore = useAuthStore();
const user = authStore.getUser;
const router = useRouter();

// Ecoute des événements Socket.IO
socket.on('reconnect', () => {
  if (user) {
    socket.emit('setSocketId', user.userID);
  }
});

// Ecoute de l'événement "sendNewMessageNotification"
socket.on('sendNewMessageNotification', (newMessage) => {
  if (selectedConversation.value && newMessage.conversationID === selectedConversation.value.conversationID) {
    selectedConversation.value.messages.push(newMessage);
  } else {
    fetchConversations();
  }
});

socket.on('sendUserConnect', (ConnectedUser) => {
  console.log(ConnectedUser);
});

socket.on('sendUserDisconnect', (DisconnectedUser) => {
  console.log(DisconnectedUser);
});

// Méthode pour récupérer les utilisateurs
const fetchUsers = async () => {
  try {
    const response = await getAllUsers();
    users.value = response.data.getAllUsers;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

// Méthode pour récupérer toutes les conversations
const fetchConversations = async () => {
  try {
    const response = await getAllConversationsByParticipantId(user.userID);
    conversations.value = response.data.getAllConversationsByParticipantId;

    // Sélectionner la première conversation par défaut si elle existe
    if (conversations.value.length > 0) {
      selectConversation(conversations.value[0]);
    }
  } catch (error) {
    console.error("Error fetching conversations:", error);
  }
};

// Méthode pour créer une nouvelle conversation
const createConversationWithNewUser = async () => {
  try {
    await createConversation(user.userID, selectedUserId.value);
    fetchConversations();
    closeCreateModal();
  } catch (error) {
    console.error("Error creating conversation:", error);
  }
};

// Méthode pour sélectionner une conversation et charger ses messages
const selectConversation = async (conversation) => {
  try {
    const response = await getAllMessagesByConversationId(conversation.conversationID);
    selectedConversation.value = {
      ...conversation,
      messages: response.data.getAllMessagesByConversationId
    };
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
};

// Méthode pour envoyer un message
const sendMessageToConversation = async () => {
  try {
    await sendMessage(newMessageContent.value, selectedConversation.value.conversationID, user.userID);
    newMessageContent.value = '';
    // Recharger les messages après envoi
    selectConversation(selectedConversation.value);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

// Ouvrir la modal de création de conversation
const openCreateModal = async () => {
  await fetchUsers();
  showCreateModal.value = true;
};

// Fermer la modal de création de conversation
const closeCreateModal = () => {
  showCreateModal.value = false;
};

// Liste des participants filtrés (sauf l'utilisateur actuel)
const filteredParticipants = computed(() => {
  return conversations.value.map(conversation => {
    const participants = conversation.participants.filter(participant => participant.userID !== user.userID);
    return { ...conversation, participants };
  }).filter(conversation => conversation.participants.length > 0);
});

// Redirection vers le profil
const goToProfile = () => {
  router.push('/profile');
};

// Monter le composant
onMounted(() => {
  fetchConversations();
});

// Se désabonner des sockets lors de la destruction du composant
onUnmounted(() => {
  socket.off('sendNewMessageNotification');
});
</script>

<style>
/* Styles spécifiques à la page de messagerie */
</style>
