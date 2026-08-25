import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ShieldAlert, Save, UserPlus, RefreshCw } from 'lucide-react';

const API_URL = 'https://prasan-mandal-audumbar.vercel.app/api';

const SecretAdminPage = () => {
  const { token, role } = useContext(AuthContext);
  const [members, setMembers] = useState([]);
  const [passcode, setPasscode] = useState('');
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
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
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
    if (!passcode) {
      showMessage('Action Passcode is required to change roles', 'error');
      return;
    }
    try {
      await axios.put(`${API_URL}/members/${id}`, {
        name: currentName,
        mobile: currentMobile,
        role: newRoleVal
      }, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'x-passcode': passcode
        }
      });
      showMessage('Role updated successfully', 'success');
      fetchMembers();
    } catch (error) {
      showMessage(error.response?.data?.message || 'Error updating role', 'error');
    }
  };

  if (role !== 'admin') {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '15px' }}>
          <ShieldAlert size={64} color="var(--primary-color)" style={{ margin: '0 auto 1rem' }} />
          <h2>Access Denied</h2>
          <p>You must be an admin to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <h2>System Admin Panel</h2>
        <div>
          <input 
            type="password"
            placeholder="Action Passcode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="premium-input"
            style={{ width: '200px', marginBottom: 0 }}
          />
        </div>
      </div>

      {message.text && (
        <div style={{ 
          padding: '1rem', 
          marginBottom: '1.5rem', 
          borderRadius: '10px',
          background: message.type === 'success' ? '#dcfce7' : '#fee2e2',
          color: message.type === 'success' ? '#166534' : '#991b1b'
        }}>
          {message.text}
        </div>
      )}

      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <UserPlus size={20} /> Add New Member
        </h3>
        <form onSubmit={handleAddMember} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Name" 
            value={newName} 
            onChange={(e) => setNewName(e.target.value)} 
            className="premium-input" 
            required 
            style={{ marginBottom: 0 }}
          />
          <input 
            type="tel" 
            placeholder="Mobile Number" 
            value={newMobile} 
            onChange={(e) => setNewMobile(e.target.value)} 
            className="premium-input" 
            required 
            style={{ marginBottom: 0 }}
          />
          <select 
            value={newRole} 
            onChange={(e) => setNewRole(e.target.value)} 
            className="premium-input"
            style={{ marginBottom: 0 }}
          >
            <option value="normal">Normal</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="premium-btn" disabled={loading}>
            Add Member
          </button>
        </form>
      </div>

      <div className="glass-card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <RefreshCw size={20} /> Manage Roles
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee' }}>
                <th style={{ padding: '1rem', color: '#666' }}>Name</th>
                <th style={{ padding: '1rem', color: '#666' }}>Mobile</th>
                <th style={{ padding: '1rem', color: '#666' }}>Role</th>
              </tr>
            </thead>
            <tbody>
              {members.map(member => (
                <tr key={member.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{member.name}</td>
                  <td style={{ padding: '1rem', color: '#666' }}>{member.mobile}</td>
                  <td style={{ padding: '1rem' }}>
                    <select 
                      value={member.role || 'normal'} 
                      onChange={(e) => handleRoleChange(member.id, member.name, member.mobile, e.target.value)}
                      style={{ 
                        padding: '0.5rem', 
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        background: member.role === 'admin' ? '#fef3c7' : '#f3f4f6'
                      }}
                    >
                      <option value="normal">Normal</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SecretAdminPage;
