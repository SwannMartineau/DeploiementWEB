import client from './client';

export const loginUser = async (username, password) => {
  const query = `mutation { login( username:"${username}", password:"${password}" ) { token user{ userID username email } } }`;
  const response = await client.post('/', { query });
  return response.data;
};

export const logoutUser = async (id) => {
  const query = `mutation { logout(userID:${id})}`;
  const response = await client.post('/', { query });
  return response.data;
};

export const registerUser = async (username, email, password) => {
    const query = `mutation { signUP(username:"${username}", password:"${password}", email:"${email}") {token user{ userID username email } } }`;
    const response = await client.post('/', { query });
    return response.data;
  };