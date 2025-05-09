import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "./manager-user-management.css";

const ManagerUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");
  const navigate = useNavigate();
  
  // Get token from localStorage
  const token = localStorage.getItem('token');

  // Mock data in case the API is not available
  const mockUsers = [
    { id: 1, name: "John Doe", email: "john@example.com", phoneNumber: "123-456-7890", role: "CUSTOMER", status: "ACTIVE", createdAt: "2025-01-15" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", phoneNumber: "234-567-8901", role: "CUSTOMER", status: "ACTIVE", createdAt: "2025-02-20" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", phoneNumber: "345-678-9012", role: "MANAGER", status: "ACTIVE", createdAt: "2025-01-10" },
    { id: 4, name: "Alice Brown", email: "alice@example.com", phoneNumber: "456-789-0123", role: "CUSTOMER", status: "INACTIVE", createdAt: "2025-03-05" },
    { id: 5, name: "Charlie Wilson", email: "charlie@example.com", phoneNumber: "567-890-1234", role: "CUSTOMER", status: "ACTIVE", createdAt: "2025-02-28" },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Make sure we have a token
        if (!token) {
          throw new Error("Authentication token is missing");
        }

        const response = await axiosInstance.get("/api/users/all");
        console.log("Fetched users:", response.data);
        setUsers(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Please try again later.");
        toast.error("Failed to load users. Using sample data instead.");
        // If we can't fetch real data, use mock data for demo purposes
        setUsers(mockUsers);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  // Filter users based on search term and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phoneNumber || user.phone)?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === "ALL" || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const handleStatusChange = async (userId, newStatus) => {
    try {
      // In a real implementation, you would call an API to update the user status
      // await axiosInstance.patch(`/api/users/${userId}/status`, { status: newStatus });
      
      // For now, just update the local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
      toast.success(`User status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating user status:", err);
      toast.error("Failed to update user status. Please try again.");
    }
  };



  return (
    <div className="user-management-container">
      <h1 className="page-title">User Management</h1>
      
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="role-filter">
          <label htmlFor="role-select">Filter by Role:</label>
          <select
            id="role-select"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="role-select"
          >
            <option value="ALL">All Roles</option>
            <option value="CUSTOMER">Customer</option>
            <option value="MANAGER">Manager</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-message">Loading users...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <div className="user-stats">
            <div className="stat-card">
              <div className="stat-value">{users.length}</div>
              <div className="stat-label">Total Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {users.filter(user => user.role === "CUSTOMER").length}
              </div>
              <div className="stat-label">Customers</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {users.filter(user => user.role === "MANAGER").length}
              </div>
              <div className="stat-label">Managers</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {users.filter(user => user.status === "ACTIVE").length}
              </div>
              <div className="stat-label">Active Users</div>
            </div>
          </div>
          
          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="no-results">No users found matching your criteria</td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user.id} className={user.status === "INACTIVE" ? "inactive-row" : ""}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phoneNumber || user.phone || "N/A"}</td>
                      <td>
                        <span className={`role-badge role-${user.role?.toLowerCase()}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge status-${user.status?.toLowerCase()}`}>
                          {user.status || "ACTIVE"}
                        </span>
                      </td>
                      <td>
                        {user.createdAt 
                          ? new Date(user.createdAt).toLocaleDateString() 
                          : "N/A"}
                      </td>
                      <td className="actions-cell">
                        <select
                          value={user.status || "ACTIVE"}
                          onChange={(e) => handleStatusChange(user.id, e.target.value)}
                          className="status-select"
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="INACTIVE">Inactive</option>
                          <option value="SUSPENDED">Suspended</option>
                        </select>
                        <button 
                          className="view-details-btn"
                          onClick={() => navigate(`/manager/user-details/${user.id}`)}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ManagerUserManagement;
