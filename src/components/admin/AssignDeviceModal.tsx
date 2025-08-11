import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, User, Search, Monitor, Smartphone, Tablet, Server } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useDevices } from '../../contexts/DeviceContext';

interface AssignDeviceModalProps {
  deviceId?: string;
  onClose: () => void;
}

const AssignDeviceModal: React.FC<AssignDeviceModalProps> = ({ deviceId, onClose }) => {
  const { users } = useAuth();
  const { devices, assignDevice } = useDevices();
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedDeviceId, setSelectedDeviceId] = useState(deviceId || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const regularUsers = users.filter(user => user.role === 'user');
  const filteredUsers = regularUsers.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableDevices = devices.filter(device => !device.assignedTo);
  const selectedDevice = devices.find(d => d.id === selectedDeviceId);

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'desktop': return Monitor;
      case 'mobile': return Smartphone;
      case 'tablet': return Tablet;
      case 'server': return Server;
      default: return Monitor;
    }
  };

  const getUserDeviceCount = (userId: string) => {
    return devices.filter(device => device.assignedTo === userId).length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUserId || !selectedDeviceId) return;

    setIsSubmitting(true);
    
    try {
      const selectedUser = users.find(u => u.id === selectedUserId);
      if (selectedUser) {
        assignDevice(selectedDeviceId, selectedUserId, selectedUser.username);
        onClose();
      }
    } catch (error) {
      console.error('Failed to assign device:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-secondary-200">
          <h2 className="text-xl font-semibold text-secondary-900">Assign Device</h2>
          <button
            onClick={onClose}
            className="p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-[calc(90vh-8rem)]">
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            {/* Device Selection */}
            {!deviceId && (
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-3">
                  Select Device
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {availableDevices.map((device) => {
                    const DeviceIcon = getDeviceIcon(device.type);
                    return (
                      <button
                        key={device.id}
                        type="button"
                        onClick={() => setSelectedDeviceId(device.id)}
                        className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                          selectedDeviceId === device.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-secondary-200 hover:border-secondary-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <DeviceIcon className="w-5 h-5 text-secondary-600" />
                          <div>
                            <p className="font-medium text-secondary-900">{device.name}</p>
                            <p className="text-sm text-secondary-600">{device.type} • {device.os}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Selected Device Info */}
            {selectedDevice && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Selected Device</h3>
                <div className="flex items-center gap-3">
                  {React.createElement(getDeviceIcon(selectedDevice.type), {
                    className: "w-6 h-6 text-blue-600"
                  })}
                  <div>
                    <p className="font-medium text-blue-900">{selectedDevice.name}</p>
                    <p className="text-sm text-blue-700">{selectedDevice.type} • {selectedDevice.os}</p>
                    <p className="text-xs text-blue-600">{selectedDevice.specs.cpu} • {selectedDevice.specs.ram}</p>
                  </div>
                </div>
              </div>
            )}

            {/* User Search */}
            <div>
              <label htmlFor="userSearch" className="block text-sm font-medium text-secondary-700 mb-2">
                Search Users
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <input
                  id="userSearch"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                  placeholder="Search by username or email..."
                />
              </div>
            </div>

            {/* User Selection */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-3">
                Select User
              </label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => setSelectedUserId(user.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedUserId === user.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-secondary-200 hover:border-secondary-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary-200 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-secondary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-secondary-900">{user.username}</p>
                          <p className="text-sm text-secondary-600">{user.email}</p>
                          <p className="text-xs text-secondary-500">
                            Joined {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {getUserDeviceCount(user.id)} devices
                        </span>
                        {user.lastLogin && (
                          <p className="text-xs text-secondary-500 mt-1">
                            Last seen {new Date(user.lastLogin).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <User className="w-12 h-12 text-secondary-400 mx-auto mb-3" />
                  <p className="text-secondary-600">
                    {searchTerm ? 'No users found matching your search' : 'No users available'}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-secondary-200 p-6">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedUserId || !selectedDeviceId || isSubmitting}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Assigning...' : 'Assign Device'}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AssignDeviceModal;
