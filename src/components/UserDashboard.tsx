import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Smartphone, Tablet, Server, Play, Square, RotateCcw, Settings, ExternalLink, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useDevices } from '../contexts/DeviceContext';
import DeviceControlModal from './user/DeviceControlModal';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getUserDevices, updateDeviceStatus } = useDevices();
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [showControlModal, setShowControlModal] = useState(false);

  const userDevices = getUserDevices(user?.id || '');

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
      case 'online': return 'text-green-600 bg-green-100';
      case 'offline': return 'text-red-600 bg-red-100';
      case 'maintenance': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-secondary-600 bg-secondary-100';
    }
  };

  const handleDeviceAction = (deviceId: string, action: 'start' | 'stop' | 'restart') => {
    switch (action) {
      case 'start':
        updateDeviceStatus(deviceId, 'online');
        break;
      case 'stop':
        updateDeviceStatus(deviceId, 'offline');
        break;
      case 'restart':
        updateDeviceStatus(deviceId, 'maintenance');
        setTimeout(() => updateDeviceStatus(deviceId, 'online'), 2000);
        break;
    }
  };

  const handleConnectDevice = (deviceId: string) => {
    setSelectedDevice(deviceId);
    setShowControlModal(true);
  };

  const onlineDevices = userDevices.filter(d => d.status === 'online').length;
  const totalDevices = userDevices.length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">My Virtual Devices</h1>
          <p className="text-secondary-600 mt-1">Access and control your assigned virtual devices</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-secondary-600">Welcome back,</p>
          <p className="text-xl font-semibold text-secondary-900">{user?.username}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Total Devices</p>
              <p className="text-3xl font-bold text-secondary-900 mt-1">{totalDevices}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Monitor className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Online Now</p>
              <p className="text-3xl font-bold text-secondary-900 mt-1">{onlineDevices}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <Wifi className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Offline</p>
              <p className="text-3xl font-bold text-secondary-900 mt-1">{totalDevices - onlineDevices}</p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <WifiOff className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Devices Grid */}
      {userDevices.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card text-center py-12"
        >
          <Monitor className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-secondary-900 mb-2">No Devices Assigned</h3>
          <p className="text-secondary-600">Contact your administrator to get devices assigned to your account.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userDevices.map((device, index) => {
            const DeviceIcon = getDeviceIcon(device.type);
            
            return (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card hover:shadow-lg transition-all duration-300 group"
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
                    <span className="text-secondary-600">Location:</span>
                    <span className="text-secondary-900">{device.location}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {device.status === 'offline' ? (
                    <button
                      onClick={() => handleDeviceAction(device.id, 'start')}
                      className="flex-1 btn-primary text-sm py-2 flex items-center justify-center gap-1"
                    >
                      <Play className="w-4 h-4" />
                      Start
                    </button>
                  ) : device.status === 'online' ? (
                    <>
                      <button
                        onClick={() => handleConnectDevice(device.id)}
                        className="flex-1 btn-primary text-sm py-2 flex items-center justify-center gap-1"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Connect
                      </button>
                      <button
                        onClick={() => handleDeviceAction(device.id, 'stop')}
                        className="btn-secondary text-sm py-2 px-3"
                      >
                        <Square className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      disabled
                      className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center gap-1 opacity-50 cursor-not-allowed"
                    >
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      Restarting...
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDeviceAction(device.id, 'restart')}
                    className="btn-secondary text-sm py-2 px-3"
                    disabled={device.status === 'maintenance'}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {device.lastUsed && (
                  <p className="text-xs text-secondary-500 mt-3">
                    Last used: {new Date(device.lastUsed).toLocaleDateString()}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Device Control Modal */}
      {showControlModal && selectedDevice && (
        <DeviceControlModal
          device={userDevices.find(d => d.id === selectedDevice)!}
          onClose={() => {
            setShowControlModal(false);
            setSelectedDevice(null);
          }}
        />
      )}
    </div>
  );
};

export default UserDashboard;
