import React, { useState, useRef, useEffect } from 'react';
import './Header.css';
import logoImage from '../images/logo_shi.png';
import userImage from './default-image.png';
import { Link } from 'react-router-dom';
import { Home, User, MessageCircle, LogOut } from 'lucide-react';
import ChatModal from './ChatModal'; // add
import api from '../services/api';  // 사용자 정보 가져오는 API

const Header = ({ onLogout }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false); // add
  const [isHidden, setIsHidden] = useState(false);  // 숨김 상태 추가

  const [userName, setUserName] = useState('');  // 사용자 이름 상태 추가

  const headerRef = useRef(null);
  const dropdownRef = useRef(null);

  const menuItems = [
    { name: '생산', subItems: ['용접불량율 현황'], links: ['/defect-rate'] },
    { name: '설계', subItems: ['구조/의장 생산설계 DP 현황', '예비 세부목차'], links: ['/design-structure', '#'] },
  ];

  const handleMouseEnter = (menuName) => {
    setActiveMenu(menuName);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  // add -----------
  const openModal = () => {
    setIsModalOpen(true);
    setIsHidden(false);  // 모달 열 때 숨김 상태 해제
    setIsDropdownOpen(false);  // 드롭다운 닫기
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const hideModal = () => {
    setIsHidden(true);  // 모달 숨기기
  };

  const showModalFromIcon = () => {
    setIsHidden(false);  // 숨김 해제
    setIsModalOpen(true);  // 모달 다시 열기
  };
  // ----------------

  useEffect(() => {
    // 사용자 이름 가져오기
    const fetchUserName = async () => {
      try {
        const response = await api.get('/auth/verify-token');  // 토큰 유효성 검증
        if (response.data && response.data.name) {
          setUserName(response.data.name);  // 사용자 이름 설정
        }
      } catch (error) {
        console.error('Failed to fetch user name', error);
      }
    };

    fetchUserName();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <header className="header" ref={headerRef}>
      <div className="header-content">
        <div className="header-left">
          <img src={logoImage} alt="Samsung Logo" className="logo_main" />
        </div>
        <nav className="header-nav">
          <Link to="/" className="nav-item home-icon">
            <Home size={24} />
          </Link>
          {menuItems.map((item) => (
            <div
              key={item.name}
              className={`nav-item ${activeMenu === item.name ? 'active' : ''}`}
              onMouseEnter={() => handleMouseEnter(item.name)}
            >
              {item.name}
            </div>
          ))}
        </nav>
        <div className="header-right">
          <span className="user-greeting">
            <span className="user-name">{userName}</span> 프로님 반갑습니다
          </span>
          <img src={userImage} alt="User" className="user-image" onClick={toggleDropdown} />
          {isDropdownOpen && (
            <div className="custom-dropdown-menu">
              <ul>
                <li>
                  <Link to="/my-page">
                    <User size={18} />
                    <span>My Page</span>
                  </Link>
                </li>
                <li onClick={openModal}>
                  <MessageCircle size={18} />
                  <span>My Chats</span>
                </li>
                <li onClick={onLogout}>
                  <LogOut size={18} />
                  <span>Log out</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      {activeMenu && (
        <div className="sub-menu-container" onMouseEnter={() => setActiveMenu(activeMenu)} onMouseLeave={handleMouseLeave}>
          <div className="sub-menu">
            {menuItems.map((item) => (
              <div key={item.name} className={`sub-menu-column ${activeMenu === item.name ? 'active' : ''}`}>
                {item.subItems.map((subItem, index) => (
                  <div key={subItem} className="sub-item">
                    <Link to={item.links[index]}>{subItem}</Link>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
      {isModalOpen && !isHidden && <ChatModal onClose={closeModal} onHide={hideModal} />}
      {/* 숨김 처리된 모달을 다시 불러오기 위한 아이콘 */}
      {isHidden && (
        <div className="chat-icon" onClick={showModalFromIcon}>
          💬
        </div>
      )}
    </header>
  );
};

export default Header;