import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Monitor, Play, Square, RotateCcw, Settings, Maximize, Volume2, Wifi, HardDrive, Cpu, MemoryStick } from 'lucide-react';
import { VirtualDevice } from '../../contexts/DeviceContext';

interface DeviceControlModalProps {
  device: VirtualDevice;
  onClose: () => void;
}

const DeviceControlModal: React.FC<DeviceControlModalProps> = ({ device, onClose }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionProgress, setConnectionProgress] = useState(0);

  useEffect(() => {
    if (isConnecting) {
      const interval = setInterval(() => {
        setConnectionProgress(prev => {
          if (prev >= 100) {
            setIsConnecting(false);
            setIsConnected(true);
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isConnecting]);

  const handleConnect = () => {
    setIsConnecting(true);
    setConnectionProgress(0);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setConnectionProgress(0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-secondary-200">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              device.status === 'online' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <Monitor className={`w-6 h-6 ${
                device.status === 'online' ? 'text-green-600' : 'text-red-600'
              }`} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-secondary-900">{device.name}</h2>
              <p className="text-sm text-secondary-600">{device.type} • {device.os}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Connection Panel */}
            <div className="lg:col-span-2">
              <div className="bg-secondary-900 rounded-xl p-6 h-96 relative overflow-hidden">
                {!isConnected && !isConnecting ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Monitor className="w-16 h-16 text-secondary-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">Connect to {device.name}</h3>
                      <p className="text-secondary-400 mb-6">Click the button below to establish a remote connection</p>
                      <button
                        onClick={handleConnect}
                        className="btn-primary flex items-center gap-2 mx-auto"
                      >
                        <Play className="w-4 h-4" />
                        Connect
                      </button>
                    </div>
                  </div>
                ) : isConnecting ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Wifi className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">Connecting...</h3>
                      <p className="text-secondary-400 mb-4">Establishing secure connection to {device.name}</p>
                      <div className="w-full bg-secondary-700 rounded-full h-2 mb-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all duration-200"
                          style={{ width: `${connectionProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-secondary-500">{Math.round(connectionProgress)}% complete</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-white text-sm font-medium">Connected to {device.name}</span>
                      </div>
                      <button
                        onClick={handleDisconnect}
                        className="text-red-400 hover:text-red-300 text-sm font-medium"
                      >
                        Disconnect
                      </button>
                    </div>
                    
                    {/* Simulated Desktop */}
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg h-full relative overflow-hidden">
                      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white bg-opacity-20 rounded flex items-center justify-center">
                            <Monitor className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-white text-sm">{device.os}</span>
                        </div>
                      </div>
                      
                      {/* Floating windows simulation */}
                      <div className="absolute top-4 left-4 w-32 h-20 bg-white bg-opacity-90 rounded shadow-lg p-2">
                        <div className="w-full h-2 bg-secondary-200 rounded mb-1"></div>
                        <div className="w-3/4 h-2 bg-secondary-200 rounded mb-1"></div>
                        <div className="w-1/2 h-2 bg-secondary-200 rounded"></div>
                      </div>
                      
                      <div className="absolute top-16 right-4 w-40 h-24 bg-white bg-opacity-90 rounded shadow-lg p-2">
                        <div className="w-full h-2 bg-secondary-200 rounded mb-1"></div>
                        <div className="w-2/3 h-2 bg-secondary-200 rounded mb-1"></div>
                        <div className="w-4/5 h-2 bg-secondary-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Control Bar */}
              <div className="flex items-center justify-between mt-4 p-3 bg-secondary-100 rounded-lg">
                <div className="flex items-center gap-2">
                  <button className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-white rounded">
                    <Maximize className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-white rounded">
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-white rounded">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-secondary-600">
                  <Wifi className="w-4 h-4" />
                  <span>Connected ({device.ipAddress})</span>
                </div>
              </div>
            </div>

            {/* Device Info Panel */}
            <div className="space-y-4">
              <div className="card">
                <h3 className="font-semibold text-secondary-900 mb-4">Device Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Status:</span>
                    <span className={`font-medium ${
                      device.status === 'online' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {device.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Type:</span>
                    <span className="font-medium text-secondary-900">{device.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">OS:</span>
                    <span className="font-medium text-secondary-900">{device.os}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Location:</span>
                    <span className="font-medium text-secondary-900">{device.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">IP Address:</span>
                    <span className="font-medium text-secondary-900 font-mono text-sm">{device.ipAddress}</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="font-semibold text-secondary-900 mb-4">Hardware Specs</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Cpu className="w-4 h-4 text-secondary-600" />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-secondary-600">CPU</span>
                        <span className="text-sm font-medium text-secondary-900">{device.specs.cpu}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MemoryStick className="w-4 h-4 text-secondary-600" />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-secondary-600">RAM</span>
                        <span className="text-sm font-medium text-secondary-900">{device.specs.ram}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <HardDrive className="w-4 h-4 text-secondary-600" />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-secondary-600">Storage</span>
                        <span className="text-sm font-medium text-secondary-900">{device.specs.storage}</span>
                      </div>
                    </div>
                  </div>
                  
                  {device.specs.gpu && (
                    <div className="flex items-center gap-3">
                      <Monitor className="w-4 h-4 text-secondary-600" />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-secondary-600">GPU</span>
                          <span className="text-sm font-medium text-secondary-900">{device.specs.gpu}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {device.lastUsed && (
                <div className="card">
                  <h3 className="font-semibold text-secondary-900 mb-2">Usage Information</h3>
                  <p className="text-sm text-secondary-600">
                    Last used: {new Date(device.lastUsed).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DeviceControlModal;
