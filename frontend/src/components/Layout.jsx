import React, { useContext } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { LogOut, LayoutDashboard, Users, Shield, Heart, Megaphone, Languages, Wallet } from 'lucide-react';

const Layout = ({ children }) => {
  const { role, logout } = useContext(AuthContext);
  const { lang, toggleLanguage, t } = useContext(LanguageContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/access');
  };

  const navItems = [
    { path: '/dashboard', label: t('dashboard'), icon: <LayoutDashboard size={20} /> },
    { path: '/members', label: t('members'), icon: <Users size={20} /> },
    { path: '/officers', label: t('officers'), icon: <Shield size={20} /> },
    { path: '/donations', label: t('donations'), icon: <Heart size={20} /> },
    { path: '/expenses', label: t('expenses'), icon: <Wallet size={20} /> },
    { path: '/announcements', label: t('announcements'), icon: <Megaphone size={20} /> },
  ];

  return (
    <>
      <nav className="navbar">
        <div className="container nav-content">
          <div className="nav-brand">
            <img src="/logo.png" alt="Logo" style={{ width: '56px', height: '56px', objectFit: 'contain' }} />
            {t('appTitle')}
          </div>
          
          <div className="desktop-nav-links">
            {navItems.map(item => (
              <NavLink key={item.path} to={item.path} className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                {item.label}
              </NavLink>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button onClick={toggleLanguage} className="btn" style={{ padding: '0.4rem 0.8rem', background: 'var(--surface-color)', color: 'var(--text-main)', border: '1px solid var(--border)' }}>
              <Languages size={16} /> {lang === 'en' ? 'मराठी' : 'English'}
            </button>

            <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '0.4rem 0.8rem' }} title={t('logout')}>
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </nav>

      <main className="container page-container" style={{ paddingBottom: '80px' }}>
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-bottom-nav">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink key={item.path} to={item.path} className={`mobile-nav-item ${isActive ? 'active' : ''}`}>
              <div className="mobile-nav-icon">{item.icon}</div>
              <span className="mobile-nav-label">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </>
  );
};

export default Layout;
