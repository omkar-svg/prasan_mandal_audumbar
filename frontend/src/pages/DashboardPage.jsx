import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { Users, Shield, HeartHandshake, UserX, Megaphone } from 'lucide-react';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const { token, role } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [statsRes, annRes] = await Promise.all([
          axios.get(`http://${window.location.hostname}:5000/api/dashboard`, config),
          axios.get(`http://${window.location.hostname}:5000/api/announcements`, config)
        ]);
        setStats(statsRes.data);
        setAnnouncements(annRes.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      }
    };
    fetchDashboard();
  }, [token]);

  if (!stats) return <div className="container">Loading...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>{t('dashboard')}</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem 0.5rem', textAlign: 'center' }}>
          <Users size={20} color="var(--secondary-color)" style={{ marginBottom: '0.3rem' }} />
          <div style={{ fontSize: '1.2rem', fontWeight: '700', lineHeight: '1' }}>{stats.totalMembers}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '0.3rem' }}>{t('totalMembers')}</div>
        </div>
        
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem 0.5rem', textAlign: 'center' }}>
          <Shield size={20} color="var(--success)" style={{ marginBottom: '0.3rem' }} />
          <div style={{ fontSize: '1.2rem', fontWeight: '700', lineHeight: '1' }}>{stats.totalOfficers}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '0.3rem' }}>{t('totalOfficers')}</div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem 0.5rem', textAlign: 'center' }}>
          <HeartHandshake size={20} color="var(--primary-color)" style={{ marginBottom: '0.3rem' }} />
          <div style={{ fontSize: '1.2rem', fontWeight: '700', lineHeight: '1' }}>{stats.donatedMembersCount}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '0.3rem' }}>{t('donated')}</div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem 0.5rem', textAlign: 'center' }}>
          <UserX size={20} color="var(--danger)" style={{ marginBottom: '0.3rem' }} />
          <div style={{ fontSize: '1.2rem', fontWeight: '700', lineHeight: '1' }}>{stats.notDonatedMembersCount}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '0.3rem' }}>{t('notDonated')}</div>
        </div>
      </div>

      {role === 'admin' && stats.totalExpenses !== undefined && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(249, 115, 22, 0.05))', borderColor: 'var(--primary-color)' }}>
            <div style={{ color: 'var(--primary-color)', fontSize: '1.1rem', fontWeight: '600' }}>{t('totalDonationCollected')}</div>
            <div style={{ fontSize: '2.2rem', fontWeight: '700', color: 'var(--text-main)' }}>₹{stats.totalDonationSum || 0}</div>
          </div>
          
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))', borderColor: 'var(--danger)' }}>
            <div style={{ color: 'var(--danger)', fontSize: '1.1rem', fontWeight: '600' }}>{t('totalExpenses')}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--text-main)' }}>₹{stats.totalExpenses || 0}</div>
          </div>

          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))', borderColor: 'var(--success)' }}>
            <div style={{ color: 'var(--success)', fontSize: '1.1rem', fontWeight: '600' }}>{t('remainingBalance')}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--text-main)' }}>₹{stats.remainingBalance || 0}</div>
          </div>
        </div>
      )}

      <div>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <Megaphone size={20} color="var(--primary-color)" /> {t('latestAnnouncements')}
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {announcements.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>{t('noAnnouncements')}</p>
          ) : (
            announcements.map((ann, idx) => (
              <div key={ann.id} className="card" style={{ borderLeft: '4px solid var(--primary-color)' }}>
                <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>{idx + 1}. {ann.title}</h4>
                <p style={{ color: 'var(--text-muted)', whiteSpace: 'pre-line' }}>{ann.message}</p>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                  {new Date(ann.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
