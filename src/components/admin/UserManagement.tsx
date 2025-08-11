import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, User, Mail, Calendar, MoreHorizontal } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useDevices } from '../../contexts/DeviceContext';
import CreateUserModal from './CreateUserModal';

const UserManagement: React.FC = () => {
  const { users, deleteUser } = useAuth();
  const { devices } = useDevices();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const regularUsers = users.filter(user => user.role === 'user');
  const filteredUsers = regularUsers.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserDeviceCount = (userId: string) => {
    return devices.filter(device => device.assignedTo === userId).length;
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">User Management</h1>
          <p className="text-secondary-600 mt-1">Manage user accounts and permissions</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <button className="btn-secondary flex items-center gap-2">
            <MoreHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-secondary-900">User</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-secondary-900">Email</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-secondary-900">Devices</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-secondary-900">Last Login</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-secondary-900">Created</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-secondary-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-200">
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-secondary-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-secondary-900">{user.username}</p>
                        <p className="text-sm text-secondary-600">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-secondary-400" />
                      <span className="text-secondary-900">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {getUserDeviceCount(user.id)} devices
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-secondary-400" />
                      <span className="text-sm text-secondary-600">
                        {user.lastLogin 
                          ? new Date(user.lastLogin).toLocaleDateString()
                          : 'Never'
                        }
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-secondary-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-1 text-secondary-600 hover:text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No users found</h3>
            <p className="text-secondary-600">
              {searchTerm ? 'Try adjusting your search criteria' : 'Get started by creating your first user'}
            </p>
          </div>
        )}
      </motion.div>

      {/* Create User Modal */}
      {showCreateModal && (
        <CreateUserModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};

export default UserManagement;
