import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { UserPlus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const { token, role } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', mobile: '' });
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMembers = async () => {
    try {
      const res = await axios.get(`https://prasan-mandal-audumbar.vercel.app/api/members`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMembers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`https://prasan-mandal-audumbar.vercel.app/api/members`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ name: '', mobile: '' });
      setShowForm(false);
      fetchMembers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    const passcode = window.prompt("Enter action passcode to delete:");
    if (!passcode) return;
    try {
      await axios.delete(`https://prasan-mandal-audumbar.vercel.app/api/members/${id}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'X-Passcode': passcode 
        }
      });
      fetchMembers();
    } catch (err) {
      if (err.response && err.response.status === 403 && err.response.data.message.includes('passcode')) {
        alert("Incorrect passcode!");
      } else {
        console.error(err);
      }
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.mobile.includes(searchTerm)
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>{t('membersManagement')}</h2>
        {role === 'admin' && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            <UserPlus size={18} /> {t('addMember')}
          </button>
        )}
      </div>

      {showForm && role === 'admin' && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>{t('addNewMember')}</h3>
          <form onSubmit={handleSubmit} style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ margin: 0, flex: '1 1 200px' }}>
              <label>{t('name')}</label>
              <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="form-group" style={{ margin: 0, flex: '1 1 200px' }}>
              <label>{t('mobileNumber')}</label>
              <input type="text" className="form-control" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ flex: '1 1 100px' }}>{t('save')}</button>
          </form>
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <input 
          type="text" 
          className="form-control" 
          placeholder="Search by name or mobile..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {members.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{t('noMembersFound')}</p>
        ) : (
          filteredMembers.map(m => {
            const isExpanded = expandedId === m.id;
            return (
              <div key={m.id} className="card" style={{ padding: '0.6rem 0.8rem', cursor: 'pointer', transition: 'all 0.2s', margin: 0 }} onClick={() => toggleExpand(m.id)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: 'var(--text-main)', fontSize: '1rem' }}>{m.name}</strong>
                  <div style={{ color: 'var(--text-muted)' }}>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
                
                {isExpanded && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'grid', gap: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t('mobileNumber')}</span>
                      <span>{m.mobile}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t('donationAmount')}</span>
                      <span style={{ fontWeight: '600' }}>₹{m.donationAmount}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t('status')}</span>
                      <span>
                        {m.donated ? (
                          <span className="badge badge-success">✅ {t('donated')}</span>
                        ) : (
                          <span className="badge badge-danger">❌ {t('notDonated')}</span>
                        )}
                      </span>
                    </div>
                    {role === 'admin' && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                        <button className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }} onClick={(e) => handleDelete(m.id, e)}>
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  );
};

export default MembersPage;
