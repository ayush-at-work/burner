import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Monitor, Users, Smartphone, Activity, Plus, Search, Filter } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useDevices } from '../contexts/DeviceContext';
import UserManagement from './admin/UserManagement';
import DeviceManagement from './admin/DeviceManagement';
import AssignDeviceModal from './admin/AssignDeviceModal';

const AdminDashboard: React.FC = () => {
  const { users } = useAuth();
  const { devices } = useDevices();
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string>('');

  const totalDevices = devices.length;
  const assignedDevices = devices.filter(d => d.assignedTo).length;
  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const totalUsers = users.filter(u => u.role === 'user').length;

  const stats = [
    {
      title: 'Total Devices',
      value: totalDevices,
      icon: Smartphone,
      color: 'bg-blue-500',
      change: '+2 this week'
    },
    {
      title: 'Assigned Devices',
      value: assignedDevices,
      icon: Users,
      color: 'bg-green-500',
      change: `${assignedDevices}/${totalDevices} assigned`
    },
    {
      title: 'Online Devices',
      value: onlineDevices,
      icon: Activity,
      color: 'bg-emerald-500',
      change: `${Math.round((onlineDevices/totalDevices) * 100)}% uptime`
    },
    {
      title: 'Active Users',
      value: totalUsers,
      icon: Monitor,
      color: 'bg-purple-500',
      change: '+1 this month'
    },
  ];

  const recentDevices = devices
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const handleAssignDevice = (deviceId: string) => {
    setSelectedDevice(deviceId);
    setShowAssignModal(true);
  };

  return (
    <Routes>
      <Route path="/users" element={<UserManagement />} />
      <Route path="/devices" element={<DeviceManagement />} />
      <Route path="/" element={
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900">Admin Dashboard</h1>
              <p className="text-secondary-600 mt-1">Manage virtual devices and user assignments</p>
            </div>
            <button
              onClick={() => setShowAssignModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Quick Assign
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-secondary-900 mt-1">{stat.value}</p>
                    <p className="text-xs text-secondary-500 mt-1">{stat.change}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Recent Activity & Device Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Devices */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-secondary-900">Recent Devices</h2>
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-secondary-400" />
                  <Filter className="w-4 h-4 text-secondary-400" />
                </div>
              </div>
              <div className="space-y-3">
                {recentDevices.map((device) => (
                  <div key={device.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        device.status === 'online' ? 'bg-green-100' : 
                        device.status === 'offline' ? 'bg-red-100' : 'bg-yellow-100'
                      }`}>
                        <Smartphone className={`w-5 h-5 ${
                          device.status === 'online' ? 'text-green-600' : 
                          device.status === 'offline' ? 'text-red-600' : 'text-yellow-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-secondary-900">{device.name}</p>
                        <p className="text-sm text-secondary-600">{device.os}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        device.assignedTo 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-secondary-100 text-secondary-800'
                      }`}>
                        {device.assignedTo ? 'Assigned' : 'Available'}
                      </span>
                      {!device.assignedTo && (
                        <button
                          onClick={() => handleAssignDevice(device.id)}
                          className="ml-2 text-primary-600 hover:text-primary-700 text-xs font-medium"
                        >
                          Assign
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Device Status Overview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="card"
            >
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">Device Status Overview</h2>
              <div className="space-y-4">
                {/* Status Distribution */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-secondary-700">Online</span>
                    <span className="text-sm text-secondary-600">{onlineDevices} devices</span>
                  </div>
                  <div className="w-full bg-secondary-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(onlineDevices / totalDevices) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-secondary-700">Assigned</span>
                    <span className="text-sm text-secondary-600">{assignedDevices} devices</span>
                  </div>
                  <div className="w-full bg-secondary-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(assignedDevices / totalDevices) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="pt-4 border-t border-secondary-200">
                  <h3 className="text-sm font-medium text-secondary-700 mb-3">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="btn-secondary text-sm py-2">
                      Add Device
                    </button>
                    <button className="btn-secondary text-sm py-2">
                      Bulk Assign
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Assignment Modal */}
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
      } />
    </Routes>
  );
};

export default AdminDashboard;
