import React, { useState, useRef, useEffect } from 'react';
import './Header.css';
import logoImage from '../images/logo_shi.png';
import userImage from '../images/img_profile.jpg';
import { Link } from 'react-router-dom';
import { Home, User, MessageCircle, LogOut } from 'lucide-react';

const Header = ({ onLogout }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const headerRef = useRef(null);
  const dropdownRef = useRef(null);

  const menuItems = [
    { name: '설계', subItems: ['구조/의장 생산설계 DP 현황', '예비 세부목차'], links: ['/design-structure', '#'] },
    { name: '생산', subItems: ['용접불량율 현황'], links: ['/defect-rate'] },
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
        <div className="header-right" ref={dropdownRef}>
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
                <li>
                  <Link to="/my-chats">
                    <MessageCircle size={18} />
                    <span>My Chats</span>
                  </Link>
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
    </header>
  );
};

export default Header;