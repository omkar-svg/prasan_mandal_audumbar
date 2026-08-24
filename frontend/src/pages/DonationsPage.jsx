import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { IndianRupee, Trash2, Filter, ChevronDown, ChevronUp, Edit2 } from 'lucide-react';

const DonationsPage = () => {
  const [members, setMembers] = useState([]);
  const [donations, setDonations] = useState([]);
  const { token, role } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ memberId: '', amount: '' });
  const [filter, setFilter] = useState('all');
  
  const [expandedMemberId, setExpandedMemberId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editAmount, setEditAmount] = useState('');

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [donRes, memRes] = await Promise.all([
        axios.get(`https://prasan-mandal-audumbar.vercel.app/api/donations`, config),
        axios.get(`https://prasan-mandal-audumbar.vercel.app/api/members`, config)
      ]);
      setDonations(donRes.data);
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
      await axios.post(`https://prasan-mandal-audumbar.vercel.app/api/donations`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ memberId: '', amount: '' });
      setShowForm(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    const passcode = window.prompt("Enter action passcode to delete:");
    if (!passcode) return;
    try {
      await axios.delete(`https://prasan-mandal-audumbar.vercel.app/api/donations/${id}`, {
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

  const handleEditSave = async (id, e) => {
    e.stopPropagation();
    const passcode = window.prompt("Enter action passcode to save changes:");
    if (!passcode) return;
    try {
      await axios.put(`https://prasan-mandal-audumbar.vercel.app/api/donations/${id}`, { amount: editAmount }, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'X-Passcode': passcode 
        }
      });
      setEditingId(null);
      fetchData();
    } catch (err) {
      if (err.response && err.response.status === 403 && err.response.data.message.includes('passcode')) {
        alert("Incorrect passcode!");
      } else {
        console.error(err);
      }
    }
  };

  const filteredMembers = members.filter(m => {
    const matchesFilter = filter === 'all' 
      ? true 
      : filter === 'donated' 
        ? m.donated 
        : !m.donated;
        
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || (m.mobile && m.mobile.includes(searchTerm));
    return matchesFilter && matchesSearch;
  });

  const totalDonation = members.reduce((sum, m) => sum + (m.donationAmount || 0), 0);

  const toggleExpandMember = (id) => {
    setExpandedMemberId(expandedMemberId === id ? null : id);
  };

  const startEdit = (d, e) => {
    e.stopPropagation();
    setEditingId(d.id);
    setEditAmount(d.amount);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>{t('donationManagement')}</h2>
        {role === 'admin' && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            <IndianRupee size={18} /> {t('addDonation')}
          </button>
        )}
      </div>

      {showForm && role === 'admin' && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>{t('recordNewDonation')}</h3>
          <form onSubmit={handleSubmit} style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ margin: 0, flex: '1 1 200px' }}>
              <label>{t('selectMember')}</label>
              <select className="form-control" value={formData.memberId} onChange={e => setFormData({...formData, memberId: e.target.value})} required>
                <option value="">-- {t('selectMember')} --</option>
                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ margin: 0, flex: '1 1 200px' }}>
              <label>{t('amount')}</label>
              <input type="number" min="1" className="form-control" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ flex: '1 1 150px' }}>{t('saveDonation')}</button>
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

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <Filter size={18} color="var(--text-muted)" />
        <button className={`btn ${filter === 'all' ? 'btn-primary' : ''}`} style={filter !== 'all' ? { background: 'var(--surface-hover)', color: 'var(--text-main)' } : {}} onClick={() => setFilter('all')}>{t('all')}</button>
        <button className={`btn ${filter === 'donated' ? 'btn-primary' : ''}`} style={filter !== 'donated' ? { background: 'var(--surface-hover)', color: 'var(--text-main)' } : {}} onClick={() => setFilter('donated')}>{t('donated')}</button>
        <button className={`btn ${filter === 'not-donated' ? 'btn-primary' : ''}`} style={filter !== 'not-donated' ? { background: 'var(--surface-hover)', color: 'var(--text-main)' } : {}} onClick={() => setFilter('not-donated')}>{t('notDonated')}</button>
        
        {role === 'admin' && (
          <div style={{ marginLeft: 'auto', fontWeight: '700', color: 'var(--primary-color)', fontSize: '1rem' }}>
            {t('total')}: ₹{totalDonation}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {filteredMembers.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{t('noRecordsFound')}</p>
        ) : (
          filteredMembers.map(m => {
            const isExpanded = expandedMemberId === m.id;
            return (
              <div key={m.id} className="card" style={{ padding: '0.6rem 0.8rem', cursor: 'pointer', transition: 'all 0.2s', margin: 0 }} onClick={() => toggleExpandMember(m.id)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: 'var(--text-main)', fontSize: '1rem' }}>{m.name}</strong>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {m.donated && <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>₹{m.donationAmount}</span>}
                    <div style={{ color: 'var(--text-muted)' }}>
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>
                </div>
                
                {isExpanded && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'grid', gap: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t('amount')}</span>
                      <span style={{ color: m.donationAmount > 0 ? 'var(--success)' : 'var(--text-muted)', fontWeight: '600' }}>
                        ₹{m.donationAmount}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t('status')}</span>
                      <span>
                        {m.donated ? (
                          <span className="badge badge-success">{t('donated')}</span>
                        ) : (
                          <span className="badge badge-danger">{t('notDonated')}</span>
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {role === 'admin' && (
        <div style={{ marginTop: '3rem' }}>
          <h3>{t('donationHistoryAdmin')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '1.5rem' }}>
            {donations.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>{t('noRecordsFound')}</p>
            ) : (
              donations.map(d => (
                <div key={d.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.8rem', margin: 0 }}>
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '0.95rem' }}>{d.Member?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(d.createdAt).toLocaleDateString()}</div>
                  </div>
                  
                  {editingId === d.id ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input 
                        type="number" 
                        className="form-control" 
                        value={editAmount} 
                        onChange={(e) => setEditAmount(e.target.value)} 
                        style={{ width: '100px', padding: '0.4rem' }} 
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem' }} onClick={(e) => handleEditSave(d.id, e)}>Save</button>
                      <button className="btn" style={{ padding: '0.4rem 0.8rem', background: 'var(--surface-hover)' }} onClick={(e) => { e.stopPropagation(); setEditingId(null); }}>Cancel</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '1rem' }}>₹{d.amount}</div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn" style={{ padding: '0.4rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }} onClick={(e) => startEdit(d, e)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="btn btn-danger" style={{ padding: '0.4rem' }} onClick={(e) => handleDelete(d.id, e)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationsPage;
