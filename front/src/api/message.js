import client from './client';

export const getAllMessages = async () => {
  const query = `{ getAllMessages { messageID content timestamp fromUser { userID firstName lastName } conversation { conversationID } } }`;
  const response = await client.post('/', { query });
  return response.data;
};

export const getAllMessagesByConversationId = async (conversationID) => {
  const query = `{ getAllMessagesByConversationId(conversationID: ${conversationID}) { messageID content timestamp fromUser { userID firstName lastName } conversation { conversationID } } }`;
  const response = await client.post('/', { query });
  return response.data;
};

export const getAllMessagesByUserId = async (userID) => {
  const query = `{ getAllMessagesByUserId(userID: ${userID}) { messageID content timestamp fromUser { userID firstName lastName } conversation { conversationID } } }`;
  const response = await client.post('/', { query });
  return response.data;
};

export const getMessageById = async (messageID) => {
  const query = `{ getMessageById(messageID: ${messageID}) { messageID content timestamp fromUser { userID firstName lastName } conversation { conversationID } } }`;
  const response = await client.post('/', { query });
  return response.data;
};

export const sendMessage = async (content, conversationID, fromUserID) => {
  const query = `mutation { sendMessage(content: "${content}", conversationID: ${conversationID}, fromUserID: ${fromUserID}) { messageID content timestamp fromUser { userID firstName lastName } conversation { conversationID } } }`;
  const response = await client.post('/', { query });
  return response.data;
};
