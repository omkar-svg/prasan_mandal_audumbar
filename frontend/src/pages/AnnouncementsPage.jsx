import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { Megaphone, Trash2 } from 'lucide-react';

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const { token, role } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', message: '' });

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(`http://${window.location.hostname}:5000/api/announcements`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnnouncements(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://${window.location.hostname}:5000/api/announcements`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ title: '', message: '' });
      setShowForm(false);
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const passcode = window.prompt("Enter action passcode to delete:");
    if (!passcode) return;
    try {
      await axios.delete(`http://${window.location.hostname}:5000/api/announcements/${id}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'X-Passcode': passcode 
        }
      });
      fetchAnnouncements();
    } catch (err) {
      if (err.response && err.response.status === 403 && err.response.data.message.includes('passcode')) {
        alert("Incorrect passcode!");
      } else {
        console.error(err);
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>{t('announcements')}</h2>
        {role === 'admin' && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            <Megaphone size={18} /> {t('createAnnouncement')}
          </button>
        )}
      </div>

      {showForm && role === 'admin' && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>{t('newAnnouncement')}</h3>
          <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
            <div className="form-group">
              <label>{t('title')}</label>
              <input type="text" className="form-control" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>{t('message')}</label>
              <textarea className="form-control" rows="4" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} required></textarea>
            </div>
            <button type="submit" className="btn btn-primary">{t('publish')}</button>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {announcements.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>{t('noAnnouncementsAvailable')}</p>
        ) : (
          announcements.map(ann => (
            <div key={ann.id} className="card" style={{ borderLeft: '4px solid var(--primary-color)', position: 'relative' }}>
              {role === 'admin' && (
                <button 
                  onClick={() => handleDelete(ann.id)}
                  style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                  <Trash2 size={18} />
                </button>
              )}
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>{ann.title}</h3>
              <p style={{ color: 'var(--text-muted)', whiteSpace: 'pre-line', fontSize: '1.05rem', lineHeight: '1.6' }}>{ann.message}</p>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
                {t('published')}: {new Date(ann.createdAt).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AnnouncementsPage;
