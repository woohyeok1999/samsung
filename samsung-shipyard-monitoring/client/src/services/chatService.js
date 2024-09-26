import api from './api';

export const fetchUsers = async () => {
  try {
    const response = await api.get('/api/chat/users', { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const fetchFriends = async () => {
  try {
    const response = await api.get('/api/chat/friends', { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error fetching friends:', error);
    throw error;
  }
};

export const addFriend = async (friendId) => {
  try {
    const response = await api.post('/api/chat/add-friend', { friendId }, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error adding friend:', error);
    throw error;
  }
};

export const removeFriend = async (friendId) => {
  try {
    const response = await api.delete('/api/chat/remove-friend', { 
      data: { friendId },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error removing friend:', error);
    throw error;
  }
};

export const sendMessage = async (receiverId, message) => {
    try {
      const response = await api.post('/api/chat/messages', 
        { receiverId, message },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };
  
  export const getMessages = async (friendId) => {
    try {
      const response = await api.get(`/api/chat/messages/${friendId}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  };