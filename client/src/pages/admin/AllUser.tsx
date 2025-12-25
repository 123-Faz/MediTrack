// components/UserManagement.tsx
import type { userLayoutContextType } from '@/layout/userDashboard/types';
import { useOutletContext } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Edit, 
  Trash2, 
  Search, 
  User,
  Mail,
  Calendar,
  Save,
  X,
  Eye,
  EyeOff,
  MoreVertical,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const {setBreadcrumb} = useOutletContext<userLayoutContextType>();

  useEffect(() => {
    setBreadcrumb(['Dashboard', 'All User'])
  }, [setBreadcrumb])

  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getCookie('admin_token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch('http://localhost:8000/api/v1/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);

    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      username: user.username,
      email: user.email,
      password: ''
    });
    setShowPassword(false);
    setActionMenu(null);
    setShowEditModal(true);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setActionMenu(null);
    setShowDeleteModal(true);
  };

  const closeModals = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedUser(null);
    setEditForm({ username: '', email: '', password: '' });
    setError(null);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setActionLoading(true);
      setError(null);

      const token = getCookie('admin_token');
      if (!token || !selectedUser) {
        setError('Authentication required');
        return;
      }

      const response = await fetch(`http://localhost:8000/api/v1/admin/users/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }

      const updatedUser = await response.json();
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user._id === selectedUser._id ? updatedUser : user
      ));

      closeModals();

    } catch (err) {
      console.error('Error updating user:', err);
      setError(err instanceof Error ? err.message : 'Failed to update user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      setActionLoading(true);
      setError(null);

      const token = getCookie('admin_token');
      if (!token || !selectedUser) {
        setError('Authentication required');
        return;
      }

      const response = await fetch(`http://localhost:8000/api/v1/admin/users/${selectedUser._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }

      // Remove from local state
      setUsers(prev => prev.filter(user => user._id !== selectedUser._id));
      closeModals();

    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const toggleActionMenu = (userId: string) => {
    setActionMenu(actionMenu === userId ? null : userId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg2 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-bl6 mx-auto mb-4"></div>
          <p className="text-fg1-4 text-lg font-semibold">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error && !showEditModal && !showDeleteModal) {
    return (
      <div className="min-h-screen bg-bg2 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-rd1 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-rd6" />
          </div>
          <h3 className="text-lg font-semibold text-fg0 mb-2">Unable to Load Users</h3>
          <p className="text-fg1-4 mb-4">{error}</p>
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-bl6 text-white rounded-lg hover:bg-bl7 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg2 themeShift p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-center text-bl5 mb-2">
            User Management 👥
          </h1>
          <p className="text-bg6 text-center text-lg">
            Manage all system users and their accounts
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-bg1 rounded-2xl shadow-lg border border-bg2 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-bl1 rounded-xl">
                <Users className="w-6 h-6 text-bl5" />
              </div>
              <span className="text-bl5 bg-bl7 px-2 py-1 rounded-lg text-sm font-bold">
                {users.length}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-fg0 mb-2">{users.length}</h3>
            <p className="text-fg1-4 font-medium">Total Users</p>
          </div>

          {/* New This Month */}
          <div className="bg-bg1 rounded-2xl shadow-lg border border-bg2 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gr1 rounded-xl">
                <Calendar className="w-6 h-6 text-gr6" />
              </div>
              <span className="text-gr6 bg-gr1 px-2 py-1 rounded-lg text-sm font-bold">
                +{users.filter(user => new Date(user.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-fg0 mb-2">
              {users.filter(user => new Date(user.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
            </h3>
            <p className="text-fg1-4 font-medium">New This Month</p>
          </div>

          {/* Short Usernames */}
          <div className="bg-bg1 rounded-2xl shadow-lg border border-bg2 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yl1 rounded-xl">
                <User className="w-6 h-6 text-yl6" />
              </div>
              <span className="text-yl6 bg-yl1 px-2 py-1 rounded-lg text-sm font-bold">
                {users.filter(user => user.username.length <= 5).length}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-fg0 mb-2">
              {users.filter(user => user.username.length <= 5).length}
            </h3>
            <p className="text-fg1-4 font-medium">Short Usernames</p>
          </div>

          {/* Active Accounts */}
          <div className="bg-bg1 rounded-2xl shadow-lg border border-bg2 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-ppl1 rounded-xl">
                <Users className="w-6 h-6 text-ppl5" />
              </div>
              <span className="text-ppl5 bg-ppl1 px-2 py-1 rounded-lg text-sm font-bold">
                100%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-fg0 mb-2">{users.length}</h3>
            <p className="text-fg1-4 font-medium">Active Accounts</p>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="bg-bg1 rounded-2xl shadow-lg border border-bg2 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fg1-4 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users by username or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-bg2 border border-bg3 rounded-xl focus:ring-2 focus:ring-bl5 focus:border-bl5 transition-all duration-200 themeShift"
                />
              </div>
            </div>
            <button
              onClick={fetchUsers}
              className="px-6 py-3 bg-bl6 text-white rounded-xl hover:bg-bl7 transition-colors font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh List
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-bg1 rounded-2xl shadow-lg border border-bg2 overflow-hidden">
          {/* Table Header */}
          <div className="bg-bg2 px-6 py-4 border-b border-bg3">
            <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-fg0">
              <div className="col-span-3">User</div>
              <div className="col-span-4">Email</div>
              <div className="col-span-3">Joined Date</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
          </div>

          {/* Table Body */}
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-bg4 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-fg0 mb-2">No users found</h3>
              <p className="text-fg1-4">
                {users.length === 0 
                  ? "No users are registered in the system." 
                  : "No users match your current search."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-bg3">
              {filteredUsers.map((user) => (
                <div key={user._id} className="px-6 py-4 hover:bg-bg2 transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* User Info */}
                    <div className="col-span-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-bl6 rounded-lg flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-fg0">{user.username}</div>
                          <div className="text-xs text-fg1-5">ID: {user._id.slice(-8)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="col-span-4">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-fg1-5" />
                        <span className="text-fg1-4 truncate">{user.email}</span>
                      </div>
                    </div>

                    {/* Join Date */}
                    <div className="col-span-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-fg1-5" />
                        <span className="text-fg1-4">{formatDate(user.createdAt)}</span>
                      </div>
                      <div className="text-xs text-fg1-5 mt-1">
                        Updated: {formatDate(user.updatedAt)}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 text-bl6 hover:bg-bl1 rounded-xl transition-all duration-200 hover:scale-105"
                          title="Edit User"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => openDeleteModal(user)}
                          className="p-2 text-rd6 hover:bg-rd1 rounded-xl transition-all duration-200 hover:scale-105"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        {/* Mobile Action Menu */}
                        <div className="relative md:hidden">
                          <button
                            onClick={() => toggleActionMenu(user._id)}
                            className="p-2 text-fg1-5 hover:text-fg0 hover:bg-bg3 rounded-xl transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          
                          {actionMenu === user._id && (
                            <div className="absolute right-0 top-10 bg-bg1 rounded-xl shadow-lg border border-bg3 py-2 z-10 min-w-[120px]">
                              <button
                                onClick={() => openEditModal(user)}
                                className="w-full px-4 py-2 text-left text-sm text-bl6 hover:bg-bl1 flex items-center space-x-2"
                              >
                                <Edit className="w-4 h-4" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => openDeleteModal(user)}
                                className="w-full px-4 py-2 text-left text-sm text-rd6 hover:bg-rd1 flex items-center space-x-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit User Modal */}
        {showEditModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-bg1 rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-bg3">
              <div className="p-6 border-b border-bg3">
                <h3 className="text-2xl font-bold text-fg0">
                  Edit User
                </h3>
                <p className="text-fg1-4 mt-2">
                  Update <span className="font-semibold text-bl6">{selectedUser.username}</span>'s information
                </p>
              </div>

              <form onSubmit={handleUpdateUser} className="p-6">
                {error && (
                  <div className="mb-6 p-4 bg-rd1 border border-rd2 rounded-xl">
                    <p className="text-rd8">{error}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-fg0 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                      className="w-full px-3 py-3 bg-bg2 border border-bg3 rounded-xl focus:ring-2 focus:ring-bl5 focus:border-bl5 transition-all duration-200 themeShift"
                      placeholder="Enter username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-fg0 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-3 bg-bg2 border border-bg3 rounded-xl focus:ring-2 focus:ring-bl5 focus:border-bl5 transition-all duration-200 themeShift"
                      placeholder="Enter email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-fg0 mb-2">
                      New Password (leave blank to keep current)
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={editForm.password}
                        onChange={(e) => setEditForm(prev => ({ ...prev, password: e.target.value }))}
                        className="w-full px-3 py-3 bg-bg2 border border-bg3 rounded-xl focus:ring-2 focus:ring-bl5 focus:border-bl5 transition-all duration-200 themeShift pr-10"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-fg1-5 hover:text-fg0"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-4 border-t border-bg3">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="flex-1 px-4 py-3 border border-bg3 text-fg1-4 rounded-xl hover:bg-bg2 transition-colors flex items-center justify-center gap-2 hover:border-fg1-5"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 px-4 py-3 bg-bl6 text-white rounded-xl hover:bg-bl7 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    {actionLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {actionLoading ? 'Updating...' : 'Update User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-bg1 rounded-3xl max-w-md w-full border border-bg3">
              <div className="p-6 border-b border-bg3">
                <h3 className="text-2xl font-bold text-fg0">
                  Delete User
                </h3>
                <p className="text-fg1-4 mt-2">
                  This action cannot be undone
                </p>
              </div>

              <div className="p-6">
                {error && (
                  <div className="mb-6 p-4 bg-rd1 border border-rd2 rounded-xl">
                    <p className="text-rd8">{error}</p>
                  </div>
                )}

                <div className="text-center">
                  <div className="w-16 h-16 bg-rd1 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-8 h-8 text-rd6" />
                  </div>
                  <h4 className="text-lg font-semibold text-fg0 mb-2">
                    Delete {selectedUser.username}?
                  </h4>
                  <p className="text-fg1-4 mb-6">
                    Are you sure you want to delete user <strong className="text-fg0">{selectedUser.username}</strong>? 
                    This will permanently remove their account and all associated data.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={closeModals}
                    className="flex-1 px-4 py-3 border border-bg3 text-fg1-4 rounded-xl hover:bg-bg2 transition-colors hover:border-fg1-5"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteUser}
                    disabled={actionLoading}
                    className="flex-1 px-4 py-3 bg-rd6 text-white rounded-xl hover:bg-rd7 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    {actionLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    {actionLoading ? 'Deleting...' : 'Delete User'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;