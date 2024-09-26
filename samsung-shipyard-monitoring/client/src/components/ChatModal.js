import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './ChatModal.css';
import { fetchUsers, fetchFriends, addFriend, removeFriend, sendMessage, getMessages } from '../services/chatService';
import api from '../services/api';
import { FaUser, FaStar } from 'react-icons/fa'; // 사용자와 즐겨찾기(친구) 아이콘

const UserSearch = ({ departments, onSearch }) => {
  const [department, setDepartment] = useState('전체');
  const [name, setName] = useState('');

  // '전체'를 제외한 나머지 항목을 오름차순 정렬
  const sortedDepartments = ['전체', ...departments.filter(dept => dept !== '전체').sort()];

  const handleSearch = () => {
    onSearch(department, name);
  };

  return (
    <div className="user-search">
      <select 
        value={department} 
        onChange={(e) => setDepartment(e.target.value)}
        className="department-select"
      >
        {sortedDepartments.map(dept => (
          <option key={dept} value={dept}>{dept}</option>
        ))}
      </select>
      <input 
        type="text" 
        value={name} 
        onChange={(e) => setName(e.target.value)}
        placeholder="이름 입력"
        className="name-input"
      />
      <button onClick={handleSearch} className="search-button">검색</button>
    </div>
  );
};

const ChatModal = ({ onClose, onHide }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [lastPosition, setLastPosition] = useState(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [departments, setDepartments] = useState([]);
  const socketRef = useRef();
  const messagesEndRef = useRef(null);
  const modalRef = useRef(null);
  const [currentUserId, setCurrentUserId] = useState(localStorage.getItem('userId'));

  useEffect(() => {
    socketRef.current = io('https://localhost:5000', {
      withCredentials: true,
    });

    socketRef.current.on('receiveMessage', (message) => {
      if (selectedFriend && (message.sender_id === selectedFriend.id || message.receiver_id === selectedFriend.id)) {
        setMessages((prevMessages) => [...prevMessages, {...message, is_sent: message.sender_id === currentUserId}]);
      }
    });

    setCurrentUserId(localStorage.getItem('userId'));

    const fetchDepartments = async () => {
      try {
        const response = await api.get('/api/chat/departments');
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };
    fetchDepartments();

    return () => {
      socketRef.current.disconnect();
    };
  }, [selectedFriend, currentUserId]);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers().then((data) => setUsers(data.sort((a, b) => a.name.localeCompare(b.name))));
    } else if (activeTab === 'friends') {
      fetchFriends().then((data) => setFriends(data.sort((a, b) => a.name.localeCompare(b.name))));
    }
  }, [activeTab]);

  useEffect(() => {
    if (selectedFriend) {
      getMessages(selectedFriend.id).then(setMessages);
    }
  }, [selectedFriend]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const setInitialPosition = () => {
      if (modalRef.current) {
        const rect = modalRef.current.getBoundingClientRect();
        const x = (window.innerWidth - rect.width) / 2;
        const y = (window.innerHeight - rect.height) / 2;
        setPosition({ x, y });
      }
    };

    setInitialPosition();
    window.addEventListener('resize', setInitialPosition);

    return () => {
      window.removeEventListener('resize', setInitialPosition);
    };
  }, []);

  useEffect(() => {
    if (lastPosition) {
      setPosition(lastPosition);
    }
  }, [lastPosition]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSelectedFriend(null);
    setMessages([]);
  };

  const handleAddFriend = async (e, friendId) => {
    e.preventDefault();
    try {
      await addFriend(friendId);
      const updatedUsers = await fetchUsers();
      const updatedFriends = await fetchFriends();
      setUsers(updatedUsers.sort((a, b) => a.name.localeCompare(b.name)));
      setFriends(updatedFriends.sort((a, b) => a.name.localeCompare(b.name)));
      alert('친구가 성공적으로 추가되었습니다!');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert('이미 친구로 등록된 사용자입니다.');
      } else {
        console.error('친구 추가 중 오류 발생:', error);
        alert('친구 추가에 실패했습니다. 다시 시도해 주세요.');
      }
    }
  };

  const handleRemoveFriend = async (e, friendId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await removeFriend(friendId);
      const updatedFriends = await fetchFriends();
      setFriends(updatedFriends.sort((a, b) => a.name.localeCompare(b.name)));
      if (selectedFriend && selectedFriend.id === friendId) {
        setSelectedFriend(null);
        setMessages([]);
      }
      alert('친구가 성공적으로 삭제되었습니다!');
    } catch (error) {
      console.error('친구 삭제 중 오류 발생:', error);
      alert('친구 삭제에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedFriend) return;
  
    try {
      await sendMessage(selectedFriend.id, newMessage);
  
      const newMsg = {
        message: newMessage,
        sender_id: currentUserId,
        receiver_id: selectedFriend.id,
        is_sent: true,
      };
  
      setNewMessage('');
  
      socketRef.current.emit('sendMessage', newMsg);
    } catch (error) {
      console.error('메시지 전송 중 오류 발생:', error);
      alert('메시지 전송에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const handleFriendSelect = (friend) => {
    setSelectedFriend(friend);
  };

  const handleMouseDown = (e) => {
    if (e.target.classList && e.target.classList.contains('chat-modal-header')) {
      setIsDragging(true);
      setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - startPos.x,
        y: e.clientY - startPos.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === 'chat-modal-overlay') {
      handleHide();
    }
  };

  const handleHide = () => {
    setLastPosition(position);
    onHide();
  };

  const handleSearch = async (department, name) => {
    try {
      const response = await api.get(`/api/chat/search-users?department=${department}&name=${name}`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div id="chat-modal-overlay" className="chat-modal-overlay" onClick={handleOutsideClick}>
      <div
        ref={modalRef}
        className="chat-modal-window"
        style={{ top: `${position.y}px`, left: `${position.x}px` }}
        onMouseDown={handleMouseDown}
      >
        <div className="chat-modal-header">
          <h2>My Chats</h2>
          <div className="chat-modal-buttons">
            <button className="chat-hide-button" onClick={handleHide}>-</button>
            <button className="chat-close-button" onClick={onClose}>X</button>
          </div>
        </div>
  
        <div className="chat-modal-content">
          <div className="chat-tabs">
            <button 
              className={`chat-tab ${activeTab === 'users' ? 'active' : ''}`} 
              onClick={() => handleTabClick('users')}
              title="사용자 목록"
            >
              <FaUser />
            </button>
            <button 
              className={`chat-tab ${activeTab === 'friends' ? 'active' : ''}`} 
              onClick={() => handleTabClick('friends')}
              title="내 친구"
            >
              <FaStar />
            </button>
          </div>
  
          <div className="chat-main-content">
            {activeTab === 'users' && (
              <div className="user-list">
                <UserSearch departments={departments} onSearch={handleSearch} />
                {users.map((user) => (
                  <div className="user-item" key={user.id}>
                    <img 
                      src={process.env.PUBLIC_URL + '/default-image.png'} 
                      alt="user" 
                      className="user-image"
                      onError={(e) => {e.target.onerror = null; e.target.src = 'https://via.placeholder.com/50'}}
                      title={`Email: ${user.email}\nPhone: ${user.phone}`}
                    />
                    <div className="user-info">
                      <span className="user-name">{user.name}</span>
                      <span className="user-department">{user.department}</span>
                    </div>
                    <button className="add-friend-button" onClick={(e) => handleAddFriend(e, user.id)}>+</button>
                  </div>
                ))}
              </div>
            )}
  
            {activeTab === 'friends' && !selectedFriend && (
              <div className="friends-list">
                {friends.map((friend) => (
                  <div 
                    className={`friend-item ${selectedFriend?.id === friend.id ? 'selected' : ''}`} 
                    key={friend.id}
                    onClick={() => handleFriendSelect(friend)}
                  >
                    <img 
                      src={process.env.PUBLIC_URL + '/default-image.png'} 
                      alt="friend" 
                      className="friend-image"
                      onError={(e) => {e.target.onerror = null; e.target.src = 'https://via.placeholder.com/50'}}
                      title={`Email: ${friend.email}\nPhone: ${friend.phone}`}
                    />
                    <div className="friend-info">
                      <span className="friend-name">{friend.name}</span>
                      <span className="friend-department">{friend.department}</span>
                    </div>
                    <button className="remove-friend-button" onClick={(e) => handleRemoveFriend(e, friend.id)}>-</button>
                  </div>
                ))}
              </div>
            )}
  
            {selectedFriend && (
              <div className="chat-area">
                <div className="chat-header">
                  <h3>{selectedFriend.name}</h3>
                </div>
                <div className="messages-container">
                  {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.is_sent ? 'sent' : 'received'}`}>
                      <span className="message-content">{msg.message}</span>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="message-input-form">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="메시지를 입력하세요..."
                  />
                  <button type="submit">전송</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;