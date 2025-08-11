import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Smartphone, Monitor, Tablet, Server, MoreHorizontal, Filter } from 'lucide-react';
import { useDevices } from '../../contexts/DeviceContext';
import { useAuth } from '../../contexts/AuthContext';
import CreateDeviceModal from './CreateDeviceModal';
import AssignDeviceModal from './AssignDeviceModal';

const DeviceManagement: React.FC = () => {
  const { devices, deleteDevice, unassignDevice } = useDevices();
  const { users } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'desktop': return Monitor;
      case 'mobile': return Smartphone;
      case 'tablet': return Tablet;
      case 'server': return Server;
      default: return Monitor;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'offline': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-secondary-100 text-secondary-800';
    }
  };

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.os.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || device.type === filterType;
    const matchesStatus = filterStatus === 'all' || device.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleDeleteDevice = (deviceId: string) => {
    if (window.confirm('Are you sure you want to delete this device?')) {
      deleteDevice(deviceId);
    }
  };

  const handleAssignDevice = (deviceId: string) => {
    setSelectedDevice(deviceId);
    setShowAssignModal(true);
  };

  const handleUnassignDevice = (deviceId: string) => {
    if (window.confirm('Are you sure you want to unassign this device?')) {
      unassignDevice(deviceId);
    }
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.username || 'Unknown User';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Device Management</h1>
          <p className="text-secondary-600 mt-1">Manage virtual devices and assignments</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Device
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              type="text"
              placeholder="Search devices by name or OS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input"
            >
              <option value="all">All Types</option>
              <option value="desktop">Desktop</option>
              <option value="mobile">Mobile</option>
              <option value="tablet">Tablet</option>
              <option value="server">Server</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input"
            >
              <option value="all">All Status</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDevices.map((device, index) => {
          const DeviceIcon = getDeviceIcon(device.type);
          
          return (
            <motion.div
              key={device.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    device.status === 'online' ? 'bg-green-100' : 
                    device.status === 'offline' ? 'bg-red-100' : 'bg-yellow-100'
                  }`}>
                    <DeviceIcon className={`w-6 h-6 ${
                      device.status === 'online' ? 'text-green-600' : 
                      device.status === 'offline' ? 'text-red-600' : 'text-yellow-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900">{device.name}</h3>
                    <p className="text-sm text-secondary-600">{device.type} • {device.os}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(device.status)}`}>
                  {device.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-600">CPU:</span>
                  <span className="text-secondary-900">{device.specs.cpu}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-600">RAM:</span>
                  <span className="text-secondary-900">{device.specs.ram}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-600">Storage:</span>
                  <span className="text-secondary-900">{device.specs.storage}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-600">IP:</span>
                  <span className="text-secondary-900 font-mono text-xs">{device.ipAddress}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-600">Location:</span>
                  <span className="text-secondary-900">{device.location}</span>
                </div>
              </div>

              {device.assignedTo ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-900">Assigned to</p>
                      <p className="text-sm text-blue-700">{getUserName(device.assignedTo)}</p>
                    </div>
                    <button
                      onClick={() => handleUnassignDevice(device.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Unassign
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-secondary-600 text-center">Not assigned</p>
                </div>
              )}

              <div className="flex gap-2">
                {!device.assignedTo ? (
                  <button
                    onClick={() => handleAssignDevice(device.id)}
                    className="flex-1 btn-primary text-sm py-2"
                  >
                    Assign
                  </button>
                ) : (
                  <button
                    onClick={() => handleAssignDevice(device.id)}
                    className="flex-1 btn-secondary text-sm py-2"
                  >
                    Reassign
                  </button>
                )}
                
                <button className="btn-secondary text-sm py-2 px-3">
                  <Edit className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => handleDeleteDevice(device.id)}
                  className="btn-secondary text-sm py-2 px-3 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-secondary-500 mt-3">
                Created: {new Date(device.createdAt).toLocaleDateString()}
              </p>
            </motion.div>
          );
        })}
      </div>

      {filteredDevices.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card text-center py-12"
        >
          <Smartphone className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-secondary-900 mb-2">No devices found</h3>
          <p className="text-secondary-600">
            {searchTerm || filterType !== 'all' || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : 'Get started by creating your first virtual device'
            }
          </p>
        </motion.div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateDeviceModal onClose={() => setShowCreateModal(false)} />
      )}

      {showAssignModal && (
        <AssignDeviceModal
          deviceId={selectedDevice}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedDevice('');
          }}
        />
      )}
    </div>
  );
};

export default DeviceManagement;
