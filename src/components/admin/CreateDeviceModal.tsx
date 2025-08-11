import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Monitor, Smartphone, Tablet, Server, AlertCircle } from 'lucide-react';
import { useDevices } from '../../contexts/DeviceContext';

interface CreateDeviceModalProps {
  onClose: () => void;
}

const CreateDeviceModal: React.FC<CreateDeviceModalProps> = ({ onClose }) => {
  const { createDevice } = useDevices();
  const [formData, setFormData] = useState({
    name: '',
    type: 'desktop' as 'desktop' | 'mobile' | 'tablet' | 'server',
    os: '',
    status: 'offline' as 'online' | 'offline' | 'maintenance',
    location: '',
    specs: {
      cpu: '',
      ram: '',
      storage: '',
      gpu: '',
    },
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deviceTypeOptions = [
    { value: 'desktop', label: 'Desktop', icon: Monitor },
    { value: 'mobile', label: 'Mobile', icon: Smartphone },
    { value: 'tablet', label: 'Tablet', icon: Tablet },
    { value: 'server', label: 'Server', icon: Server },
  ];

  const osOptions = {
    desktop: ['Windows 11', 'Windows 10', 'macOS Ventura', 'macOS Monterey', 'Ubuntu 22.04', 'Ubuntu 20.04'],
    mobile: ['Android 13', 'Android 12', 'iOS 16', 'iOS 15', 'HarmonyOS 3.0'],
    tablet: ['iPadOS 16', 'iPadOS 15', 'Android 13', 'Android 12', 'Windows 11'],
    server: ['Ubuntu Server 22.04', 'Ubuntu Server 20.04', 'CentOS 8', 'Windows Server 2022', 'Windows Server 2019'],
  };

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!formData.name.trim()) newErrors.push('Device name is required');
    if (!formData.os) newErrors.push('Operating system is required');
    if (!formData.location.trim()) newErrors.push('Location is required');
    if (!formData.specs.cpu.trim()) newErrors.push('CPU specification is required');
    if (!formData.specs.ram.trim()) newErrors.push('RAM specification is required');
    if (!formData.specs.storage.trim()) newErrors.push('Storage specification is required');

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      createDevice(formData);
      onClose();
    } catch (error) {
      setErrors(['Failed to create device. Please try again.']);
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
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-secondary-200">
          <h2 className="text-xl font-semibold text-secondary-900">Create New Device</h2>
          <button
            onClick={onClose}
            className="p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
                  <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-2">
                Device Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                placeholder="e.g., Desktop-DEV01"
                required
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-secondary-700 mb-2">
                Location
              </label>
              <input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="input"
                placeholder="e.g., New York, USA"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-3">
              Device Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {deviceTypeOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setFormData({ 
                        ...formData, 
                        type: option.value as any,
                        os: '', // Reset OS when type changes
                        specs: { ...formData.specs, gpu: option.value === 'desktop' ? formData.specs.gpu : '' }
                      });
                    }}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.type === option.value
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-secondary-200 hover:border-secondary-300'
                    }`}
                  >
                    <IconComponent className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="os" className="block text-sm font-medium text-secondary-700 mb-2">
                Operating System
              </label>
              <select
                id="os"
                value={formData.os}
                onChange={(e) => setFormData({ ...formData, os: e.target.value })}
                className="input"
                required
              >
                <option value="">Select OS</option>
                {osOptions[formData.type].map((os) => (
                  <option key={os} value={os}>{os}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-secondary-700 mb-2">
                Initial Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="input"
              >
                <option value="offline">Offline</option>
                <option value="online">Online</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-secondary-900">Hardware Specifications</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cpu" className="block text-sm font-medium text-secondary-700 mb-2">
                  CPU
                </label>
                <input
                  id="cpu"
                  type="text"
                  value={formData.specs.cpu}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    specs: { ...formData.specs, cpu: e.target.value } 
                  })}
                  className="input"
                  placeholder="e.g., Intel i7-12700K"
                  required
                />
              </div>

              <div>
                <label htmlFor="ram" className="block text-sm font-medium text-secondary-700 mb-2">
                  RAM
                </label>
                <select
                  id="ram"
                  value={formData.specs.ram}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    specs: { ...formData.specs, ram: e.target.value } 
                  })}
                  className="input"
                  required
                >
                  <option value="">Select RAM</option>
                  <option value="4GB">4GB</option>
                  <option value="8GB">8GB</option>
                  <option value="16GB">16GB</option>
                  <option value="32GB">32GB</option>
                  <option value="64GB">64GB</option>
                  <option value="128GB">128GB</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="storage" className="block text-sm font-medium text-secondary-700 mb-2">
                  Storage
                </label>
                <select
                  id="storage"
                  value={formData.specs.storage}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    specs: { ...formData.specs, storage: e.target.value } 
                  })}
                  className="input"
                  required
                >
                  <option value="">Select Storage</option>
                  <option value="128GB SSD">128GB SSD</option>
                  <option value="256GB SSD">256GB SSD</option>
                  <option value="512GB SSD">512GB SSD</option>
                  <option value="1TB SSD">1TB SSD</option>
                  <option value="2TB SSD">2TB SSD</option>
                  <option value="4TB SSD">4TB SSD</option>
                </select>
              </div>

              {formData.type === 'desktop' && (
                <div>
                  <label htmlFor="gpu" className="block text-sm font-medium text-secondary-700 mb-2">
                    GPU (Optional)
                  </label>
                  <input
                    id="gpu"
                    type="text"
                    value={formData.specs.gpu}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      specs: { ...formData.specs, gpu: e.target.value } 
                    })}
                    className="input"
                    placeholder="e.g., NVIDIA RTX 4070"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Device'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateDeviceModal;
