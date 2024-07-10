import client from './client';

export const getAllConversations = async () => {
  const query = `{ getAllConversations { conversationID participants { userID username } } }`;
  const response = await client.post('/', { query });
  return response.data;
};

export const getAllConversationsByParticipantId = async (participantID) => {
  const query = `{ getAllConversationsByParticipantId(participantID: ${participantID}) { conversationID participants { userID username email } } }`;
  const response = await client.post('/', { query });
  return response.data;
};

export const getConversationById = async (conversationID) => {
  const query = `{ getConversationById(conversationID: ${conversationID}) { conversationID messages { messageID content } participants { userID username } } }`;
  const response = await client.post('/', { query });
  return response.data;
};

export const createConversation = async (user1Id, user2Id) => {
  const query = `mutation { createConversation(user1Id: ${user1Id}, user2Id: ${user2Id}) { conversationID participants { userID username } } }`;
  const response = await client.post('/', { query });
  return response.data;
};
