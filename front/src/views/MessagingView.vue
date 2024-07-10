<template>
  <div class="messaging">
    <div class="conversation-list">
      <h2>Conversations</h2>
      <button class="btn btn-primary mb-3" @click="openCreateModal">Créer une conversation</button>
      <ul>
        <li v-for="conversation in filteredParticipants" :key="conversation.userID"  @click="selectConversation(conversation)" :class="{ active: selectedConversation && selectedConversation.conversationID === conversation.conversationID }">
          {{ conversation.participants[0].firstName }} {{ conversation.participants[0].lastName }}
        </li>
      </ul>
    </div>

    <div class="conversation-messages" v-if="selectedConversation">
      <h2>Conversation ID: {{ selectedConversation.conversationID }}</h2>
      <ul>
        <li v-for="message in selectedConversation.messages" :key="message.messageID">
          {{ message.content }}
        </li>
      </ul>
      <form @submit.prevent="sendMessageToConversation">
        <div class="mb-3">
          <label for="messageContent" class="form-label">Nouveau message</label>
          <textarea id="messageContent" v-model="newMessageContent" class="form-control"></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Envoyer</button>
      </form>
    </div>

    <!-- Modal pour créer une nouvelle conversation -->
    <div class="modal" tabindex="-1" role="dialog" v-if="showCreateModal">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Créer une nouvelle conversation</h5>
            <button type="button" class="btn-close" @click="closeCreateModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="createConversationWithNewUser">
              <div class="mb-3">
                <label for="selectUser" class="form-label">Sélectionner un utilisateur</label>
                <select id="selectUser" v-model="selectedUserId" class="form-select">
                  <option v-for="user in users" :key="user.userID" :value="user.userID">{{ user.firstName }} {{ user.lastName }}</option>
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
import { ref, computed, onMounted } from 'vue';
import { getAllUsers } from '../api/user.js';
import { 
  createConversation, 
  getAllConversationsByParticipantId,
} from '../api/conversations.js';
import { 
  getAllMessagesByConversationId, 
  sendMessage 
} from '../api/message.js';

const conversations = ref([]);
const users = ref([]);
const selectedUserId = ref(null);
const showCreateModal = ref(false);
const selectedConversation = ref(null);
const newMessageContent = ref('');

// Méthode pour récupérer tous les utilisateurs
const fetchUsers = async () => {
  try {
    const response = await getAllUsers();
    users.value = response.data.getAllUsers;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

// Méthode pour créer une conversation
const createConversationWithNewUser = async () => {
  try {
    const response = await createConversation(1, selectedUserId.value);
    console.log("Conversation created:", response);
    fetchConversations();
    closeCreateModal();
  } catch (error) {
    console.error("Error creating conversation:", error);
  }
};

// Méthode pour récupérer toutes les conversations
const fetchConversations = async () => {
  try {
    const response = await getAllConversationsByParticipantId(1); // Remplacez par l'ID de l'utilisateur connecté
    conversations.value = response.data.getAllConversationsByParticipantId;

    // Sélectionner la première conversation par défaut si la liste n'est pas vide
    if (conversations.value.length > 0) {
      selectConversation(conversations.value[0]);
    }
  } catch (error) {
    console.error("Error fetching conversations:", error);
  }
};

// Méthode pour sélectionner une conversation
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

// Méthode pour envoyer un nouveau message
const sendMessageToConversation = async () => {
  try {
    const response = await sendMessage(newMessageContent.value, selectedConversation.value.conversationID, 1);
    console.log("Message sent:", response);
    // Actualiser les messages après l'envoi
    selectConversation(selectedConversation.value);
    newMessageContent.value = ''; // Effacer le champ de texte après l'envoi
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

// Ouvrir la modal de création de conversation
const openCreateModal = () => {
  fetchUsers();
  showCreateModal.value = true;
};

// Fermer la modal de création de conversation
const closeCreateModal = () => {
  showCreateModal.value = false;
};

// Calcul de la liste filtrée des participants pour affichage
const filteredParticipants = computed(() => {
  return conversations.value.map(conversation => {
    const filteredParticipants = conversation.participants.filter(participant => participant.userID !== "1");
    if (filteredParticipants.length === 1) {
      return {
        ...conversation,
        participants: filteredParticipants
      };
    } else {
      return {
        ...conversation,
        participants: []
      };
    }
  }).filter(conversation => conversation.participants.length > 0);
});
  
onMounted(fetchConversations);
</script>

<style scoped>
.messaging {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
}

.conversation-list {
  width: 30%;
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 1rem;
  margin-right: 1rem;
}

.conversation-messages {
  flex: 1;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 1rem;
}

h2 {
  color: #42b983;
  font-size: 1.5rem;
  margin-top: 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 0.5rem 0;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

form {
  margin-top: 1rem;
}

.modal {
  display: none;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  z-index: 999;
}

.modal-dialog {
  margin: 10% auto;
  width: 50%;
  max-width: 600px;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border: 1px solid #888;
  border-radius: 5px;
}

.active {
  background-color: #f0f0f0;
}

.btn-primary {
  background-color: #42b983;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
}

.btn-primary:hover {
  background-color: #2ca674;
}
</style>
