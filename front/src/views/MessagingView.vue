<template>
  <div class="card messaging">
    <div class="header">
      <img class="logoHeader" src="../../public/titreTransparent.png" alt="Logo Tcheat" />
      <button class="btn" @click="goToProfile">Profil</button>
    </div>
    
    <div class="blocs">
      <!-- Liste des conversations -->
      <div class="conversation-list">
        <button class="btn btn-primary mb-3" @click="openCreateModal">Créer une conversation</button>
        <h3>Mes conversations</h3>
        <ul>
          <li 
            v-for="(conversation, index) in filteredParticipants" 
            :key="conversation.conversationID" 
            @click="selectConversation(conversation)" 
            :class="{ active: selectedConversation && selectedConversation.conversationID === conversation.conversationID }">
            <div v-if="index==0">Global</div>
            <div v-else>{{ conversation.participants[0].username }}</div>
            
          </li>
        </ul>
      </div>
      
      <!-- Messages de la conversation sélectionnée -->
      <div class="conversation-messages container-Mess" v-if="selectedConversation">
        <h2>{{ selectedConversation.participants[0].username }}</h2>
        <div class="blocMessages" ref="messageContainer">
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
            <textarea 
            id="messageContent" 
            v-model="newMessageContent" 
            class="form-control" 
            @keydown.enter="sendMessageToConversation">
          </textarea>
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
import { ref, computed, onMounted, onUnmounted, onUpdated } from 'vue';
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
const messageContainer = ref(null);

socket.on('reconnect', () => {
  if (user) {
    socket.emit('setSocketId', user.userID);
  }
});

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

const fetchUsers = async () => {
  try {
    const response = await getAllUsers();
    users.value = response.data.getAllUsers;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

const fetchConversations = async () => {
  try {
    const response = await getAllConversationsByParticipantId(user.userID);
    conversations.value = response.data.getAllConversationsByParticipantId;

    if (conversations.value.length > 0) {
      selectConversation(conversations.value[0]);
    }
  } catch (error) {
    console.error("Error fetching conversations:", error);
  }
};

const createConversationWithNewUser = async () => {
  try {
    await createConversation(user.userID, selectedUserId.value);
    fetchConversations();
    closeCreateModal();
  } catch (error) {
    console.error("Error creating conversation:", error);
  }
};

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

const sendMessageToConversation = async () => {
  try {
    await sendMessage(newMessageContent.value, selectedConversation.value.conversationID, user.userID);
    newMessageContent.value = '';
    selectConversation(selectedConversation.value);
    scrollToBottom();
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

const scrollToBottom = () => {
      const container = messageContainer.value;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    };

    onUpdated(() => {
      scrollToBottom();
    });

const openCreateModal = async () => {
  await fetchUsers();
  showCreateModal.value = true;
};

const closeCreateModal = () => {
  showCreateModal.value = false;
};

const filteredParticipants = computed(() => {
  return conversations.value.map(conversation => {
    const participants = conversation.participants.filter(participant => participant.userID !== user.userID);
    return { ...conversation, participants };
  }).filter(conversation => conversation.participants.length > 0);
});

const goToProfile = () => {
  router.push('/profile');
};

onMounted(() => {
  fetchConversations();
});

onUnmounted(() => {
  socket.off('sendNewMessageNotification');
});
</script>

