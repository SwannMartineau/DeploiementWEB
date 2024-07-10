import client from './client';

export const getAllUsers = async () => {
  const query = `query{ getAllUsers { userID username email } }`;
  const response = await client.post('/', { query });
  return response.data;
};

export const getUserById = async (userID) => {
  const query = `{ getUserById(userID: ${userID}) { userID username email } }`;
  const response = await client.post('/', { query });
  return response.data;
};

export const getIdentityById = async (userID) => {
  const query = `query{ getIdentityById(userID: ${userID}) }`;
  const response = await client.get('/', { 'query': query });
  return response.data;
};
