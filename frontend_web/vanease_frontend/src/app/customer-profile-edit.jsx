// src/components/customer-profile-edit.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const CustomerProfileEdit = () => {
  const { user, fetchUserProfile, token, setUser, role } = useAuth();  // Use token, setUser, and role from context
  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');

  // Fetch user profile on mount if user is not already available
  useEffect(() => {
    if (!user) {
      fetchUserProfile();  // Fetch the profile if it's not already loaded
    }
  }, [user, fetchUserProfile]);

  const handleSave = async () => {
    try {
      const config = {
        headers: {},
      };

      // Include the Authorization header only if the user is not a CUSTOMER
      if (role !== 'CUSTOMER') {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await axios.put('http://localhost:8080/api/users/me', {
        name,
        email,
      }, config);

      if (response.status === 200) {
        setUser(response.data);  // Update user with the saved data
        alert('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div>
      <h1>Edit Profile</h1>
      <form>
        <div>
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <button type="button" onClick={handleSave}>Save</button>
      </form>
    </div>
  );
};

export default CustomerProfileEdit;
