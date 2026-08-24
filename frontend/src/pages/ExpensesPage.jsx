import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { Wallet, Trash2, Edit2 } from 'lucide-react';

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const { token, role } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ description: '', amount: '' });
  
  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ description: '', amount: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`https://prasan-mandal-audumbar-b3v7rztyk-omkars-projects-7dec41be.vercel.app/api/expenses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`https://prasan-mandal-audumbar-b3v7rztyk-omkars-projects-7dec41be.vercel.app/api/expenses`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ description: '', amount: '' });
      setShowForm(false);
      fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    const passcode = window.prompt("Enter action passcode to delete:");
    if (!passcode) return;
    try {
      await axios.delete(`https://prasan-mandal-audumbar-b3v7rztyk-omkars-projects-7dec41be.vercel.app/api/expenses/${id}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'X-Passcode': passcode 
        }
      });
      fetchExpenses();
    } catch (err) {
      if (err.response && err.response.status === 403 && err.response.data.message.includes('passcode')) {
        alert("Incorrect passcode!");
      } else {
        console.error(err);
      }
    }
  };

  const startEdit = (exp, e) => {
    e.stopPropagation();
    setEditingId(exp.id);
    setEditData({ description: exp.description, amount: exp.amount });
  };

  const handleEditSave = async (id, e) => {
    e.stopPropagation();
    const passcode = window.prompt("Enter action passcode to save changes:");
    if (!passcode) return;
    try {
      await axios.put(`https://prasan-mandal-audumbar-b3v7rztyk-omkars-projects-7dec41be.vercel.app/api/expenses/${id}`, editData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'X-Passcode': passcode 
        }
      });
      setEditingId(null);
      fetchExpenses();
    } catch (err) {
      if (err.response && err.response.status === 403 && err.response.data.message.includes('passcode')) {
        alert("Incorrect passcode!");
      } else {
        console.error(err);
      }
    }
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>{t('expenseManagement')}</h2>
        {role === 'admin' && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            <Wallet size={18} /> {t('addExpense')}
          </button>
        )}
      </div>

      {showForm && role === 'admin' && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>{t('recordNewExpense')}</h3>
          <form onSubmit={handleSubmit} style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ margin: 0, flex: '1 1 200px' }}>
              <label>{t('description')}</label>
              <input type="text" className="form-control" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
            </div>
            <div className="form-group" style={{ margin: 0, flex: '1 1 200px' }}>
              <label>{t('amount')}</label>
              <input type="number" min="1" className="form-control" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ flex: '1 1 150px' }}>{t('saveExpense')}</button>
          </form>
        </div>
      )}

      <div style={{ marginBottom: '2rem', fontSize: '1.2rem', fontWeight: '700', color: 'var(--danger)' }}>
        {t('totalExpenses')}: ₹{totalExpenses}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <input 
          type="text" 
          className="form-control" 
          placeholder="Search expenses..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {expenses.filter(exp => exp.description.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{t('noRecordsFound')}</p>
        ) : (
          expenses.filter(exp => exp.description.toLowerCase().includes(searchTerm.toLowerCase())).map(exp => (
            <div key={exp.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.8rem', margin: 0 }}>
              {editingId === exp.id ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={editData.description} 
                    onChange={(e) => setEditData({...editData, description: e.target.value})} 
                    style={{ flex: '1', minWidth: '150px', padding: '0.4rem' }} 
                  />
                  <input 
                    type="number" 
                    className="form-control" 
                    value={editData.amount} 
                    onChange={(e) => setEditData({...editData, amount: e.target.value})} 
                    style={{ width: '100px', padding: '0.4rem' }} 
                  />
                  <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem' }} onClick={(e) => handleEditSave(exp.id, e)}>Save</button>
                  <button className="btn" style={{ padding: '0.4rem 0.8rem', background: 'var(--surface-hover)' }} onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <strong style={{ color: 'var(--text-main)', fontSize: '1.1rem' }}>{exp.description}</strong>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
                      {new Date(exp.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ color: 'var(--danger)', fontWeight: 'bold', fontSize: '1.1rem' }}>₹{exp.amount}</span>
                    {role === 'admin' && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn" style={{ padding: '0.4rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }} onClick={(e) => startEdit(exp, e)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="btn btn-danger" style={{ padding: '0.4rem' }} onClick={(e) => handleDelete(exp.id, e)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpensesPage;
