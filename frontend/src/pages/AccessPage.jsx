import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { Heart } from 'lucide-react';

const AccessPage = () => {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await axios.post(`https://prasan-mandal-audumbar-b3v7rztyk-omkars-projects-7dec41be.vercel.app/api/auth/login`, { access_code: accessCode });
      login(response.data.token);
    } catch (err) {
      setError(err.response?.data?.message || t('invalidCode'));
    }
  };

  return (
    <div className="premium-bg">
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ background: 'white', padding: '15px', borderRadius: '50%', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
            <img src="/logo.png" alt="Logo" className="animate-float" style={{ width: '110px', height: '110px', objectFit: 'contain' }} />
          </div>
        </div>
        
        <h2 style={{ marginBottom: '0.5rem', fontSize: '1.8rem', background: 'linear-gradient(to right, var(--primary-color), var(--secondary-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {t('appTitle')}
        </h2>
        
        <p style={{ color: '#4b5563', marginBottom: '2.5rem', fontWeight: '500', fontSize: '0.95rem' }}>
          {t('enterAccessCode')}
        </p>
        
        {error && <div style={{ color: 'white', marginBottom: '1.5rem', padding: '0.8rem', background: 'rgba(239, 68, 68, 0.9)', borderRadius: '12px', fontWeight: '600', animation: 'fadeInUp 0.3s ease' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            className="premium-input"
            required
            autoFocus
          />
          <button type="submit" className="premium-btn">
            {t('login')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccessPage;
