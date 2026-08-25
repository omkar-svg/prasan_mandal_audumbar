import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ShieldAlert, UserPlus, Trash2, Users } from 'lucide-react';

const API_URL = 'https://prasan-mandal-audumbar.vercel.app/api';

const SecretAdminPage = () => {
  const { token, role } = useContext(AuthContext);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // New Member Form
  const [newName, setNewName] = useState('');
  const [newMobile, setNewMobile] = useState('');
  const [newRole, setNewRole] = useState('normal');

  useEffect(() => {
    fetchMembers();
  }, [token]);

  const fetchMembers = async () => {
    try {
      const response = await axios.get(`${API_URL}/members`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members', error);
      showMessage('Failed to load members', 'error');
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/members`, {
        name: newName,
        mobile: newMobile,
        role: newRole
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showMessage('Member added successfully', 'success');
      setNewName('');
      setNewMobile('');
      setNewRole('normal');
      fetchMembers();
    } catch (error) {
      showMessage(error.response?.data?.message || 'Error adding member', 'error');
    }
    setLoading(false);
  };

  const handleRoleChange = async (id, currentName, currentMobile, newRoleVal) => {
    try {
      await axios.put(`${API_URL}/members/${id}`, {
        name: currentName,
        mobile: currentMobile,
        role: newRoleVal
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showMessage('Role updated successfully', 'success');
      fetchMembers();
    } catch (error) {
      showMessage(error.response?.data?.message || 'Error updating role', 'error');
    }
  };

  const handleDeleteMember = async (member) => {
    const enteredMobile = window.prompt(`To confirm deletion of ${member.name}, please enter their mobile number (${member.mobile}):`);
    
    if (enteredMobile === null) return; // User cancelled
    
    if (enteredMobile !== member.mobile) {
      showMessage("Mobile number did not match. Deletion cancelled.", "error");
      return;
    }

    try {
      await axios.delete(`${API_URL}/members/${member.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showMessage('Member deleted successfully', 'success');
      fetchMembers();
    } catch (error) {
      showMessage(error.response?.data?.message || 'Error deleting member', 'error');
    }
  };

  if (role !== 'admin') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5rem' }}>
        <div className="card" style={{ textAlign: 'center', padding: '3rem', maxWidth: '400px' }}>
          <ShieldAlert size={48} color="var(--primary-color)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ marginBottom: '1rem' }}>Access Denied</h3>
          <p style={{ color: 'var(--text-muted)' }}>You must be an admin to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
        <ShieldAlert size={28} color="var(--primary-color)" />
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>System Admin Panel</h2>
      </div>

      {message.text && (
        <div style={{ 
          padding: '0.8rem 1rem', 
          marginBottom: '1.5rem', 
          borderRadius: '8px',
          fontSize: '0.9rem',
          background: message.type === 'success' ? '#dcfce7' : '#fee2e2',
          color: message.type === 'success' ? '#166534' : '#991b1b',
          border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`
        }}>
          {message.text}
        </div>
      )}

      {/* Add Member Section */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
          <UserPlus size={18} /> Add New Member
        </h3>
        <form onSubmit={handleAddMember} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>Name</label>
            <input 
              type="text" 
              className="form-control" 
              value={newName} 
              onChange={(e) => setNewName(e.target.value)} 
              required 
            />
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>Mobile Number</label>
            <input 
              type="tel" 
              className="form-control" 
              value={newMobile} 
              onChange={(e) => setNewMobile(e.target.value)} 
              required 
            />
          </div>
          <div style={{ flex: '0 1 150px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>Role</label>
            <select 
              className="form-control"
              value={newRole} 
              onChange={(e) => setNewRole(e.target.value)} 
            >
              <option value="normal">Normal</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: '0 1 auto' }}>
            {loading ? 'Adding...' : 'Add Member'}
          </button>
        </form>
      </div>

      {/* Manage Members Section */}
      <div className="card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
          <Users size={18} /> Manage Existing Members
        </h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '0.8rem', color: 'var(--text-muted)' }}>Name</th>
                <th style={{ padding: '0.8rem', color: 'var(--text-muted)' }}>Mobile</th>
                <th style={{ padding: '0.8rem', color: 'var(--text-muted)' }}>Role</th>
                <th style={{ padding: '0.8rem', color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No members found.
                  </td>
                </tr>
              ) : (
                members.map(member => (
                  <tr key={member.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '0.8rem', fontWeight: '500', color: 'var(--text-main)' }}>{member.name}</td>
                    <td style={{ padding: '0.8rem', color: 'var(--text-muted)' }}>{member.mobile}</td>
                    <td style={{ padding: '0.8rem' }}>
                      <select 
                        value={member.role || 'normal'} 
                        onChange={(e) => handleRoleChange(member.id, member.name, member.mobile, e.target.value)}
                        className="form-control"
                        style={{ 
                          padding: '0.4rem', 
                          minWidth: '100px',
                          background: member.role === 'admin' ? 'rgba(249, 115, 22, 0.1)' : 'white',
                          borderColor: member.role === 'admin' ? 'var(--primary-color)' : 'var(--border)'
                        }}
                      >
                        <option value="normal">Normal</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td style={{ padding: '0.8rem', textAlign: 'right' }}>
                      <button 
                        onClick={() => handleDeleteMember(member)}
                        className="btn btn-danger" 
                        style={{ padding: '0.4rem 0.6rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SecretAdminPage;
