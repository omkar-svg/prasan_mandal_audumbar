import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { ShieldPlus, Trash2 } from 'lucide-react';

const OfficersPage = () => {
  const [officers, setOfficers] = useState([]);
  const [members, setMembers] = useState([]);
  const { token, role } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ memberId: '', position: '' });

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [offRes, memRes] = await Promise.all([
        axios.get(`https://prasan-mandal-audumbar-b3v7rztyk-omkars-projects-7dec41be.vercel.app/api/officers`, config),
        axios.get(`https://prasan-mandal-audumbar-b3v7rztyk-omkars-projects-7dec41be.vercel.app/api/members`, config)
      ]);
      setOfficers(offRes.data);
      setMembers(memRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`https://prasan-mandal-audumbar-b3v7rztyk-omkars-projects-7dec41be.vercel.app/api/officers`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ memberId: '', position: '' });
      setShowForm(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const passcode = window.prompt("Enter action passcode to delete:");
    if (!passcode) return;
    try {
      await axios.delete(`https://prasan-mandal-audumbar-b3v7rztyk-omkars-projects-7dec41be.vercel.app/api/officers/${id}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'X-Passcode': passcode 
        }
      });
      fetchData();
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
        <h2>{t('mandalOfficers')}</h2>
        {role === 'admin' && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            <ShieldPlus size={18} /> {t('addOfficer')}
          </button>
        )}
      </div>

      {showForm && role === 'admin' && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>{t('assignOfficerRole')}</h3>
          <form onSubmit={handleSubmit} style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ margin: 0, flex: '1 1 200px' }}>
              <label>{t('selectMember')}</label>
              <select className="form-control" value={formData.memberId} onChange={e => setFormData({...formData, memberId: e.target.value})} required>
                <option value="">-- {t('selectMember')} --</option>
                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ margin: 0, flex: '1 1 200px' }}>
              <label>{t('position')}</label>
              <input type="text" className="form-control" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ flex: '1 1 100px' }}>{t('save')}</button>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {officers.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>{t('noOfficers')}</p>
        ) : (
          officers.map(o => (
            <div key={o.id} className="card" style={{ borderTop: '4px solid var(--secondary-color)', position: 'relative' }}>
              {role === 'admin' && (
                <button 
                  onClick={() => handleDelete(o.id)}
                  style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                  <Trash2 size={16} />
                </button>
              )}
              <div style={{ fontSize: '0.9rem', color: 'var(--secondary-color)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
                {o.position}
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-main)' }}>
                {o.Member ? o.Member.name : t('unknownMember')}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OfficersPage;
