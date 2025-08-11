import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, User, Mail, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface CreateUserModalProps {
  onClose: () => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ onClose }) => {
  const { createUser, users } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'user' as 'user' | 'admin',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!formData.username.trim()) {
      newErrors.push('Username is required');
    } else if (formData.username.length < 3) {
      newErrors.push('Username must be at least 3 characters');
    } else if (users.some(u => u.username === formData.username)) {
      newErrors.push('Username already exists');
    }

    if (!formData.email.trim()) {
      newErrors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.push('Invalid email format');
    } else if (users.some(u => u.email === formData.email)) {
      newErrors.push('Email already exists');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      createUser(formData);
      onClose();
    } catch (error) {
      setErrors(['Failed to create user. Please try again.']);
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
        className="bg-white rounded-xl shadow-xl w-full max-w-md"
      >
        <div className="flex items-center justify-between p-6 border-b border-secondary-200">
          <h2 className="text-xl font-semibold text-secondary-900">Create New User</h2>
          <button
            onClick={onClose}
            className="p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-secondary-700 mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="input pl-10"
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input pl-10"
                placeholder="Enter email address"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-secondary-700 mb-2">
              Role
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'user' | 'admin' })}
              className="input"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Default Password</p>
                <p>The user will be created with the default password: <code className="bg-blue-100 px-1 rounded">user123</code></p>
                <p className="mt-1 text-blue-700">Users should change their password after first login.</p>
              </div>
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
              {isSubmitting ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateUserModal;
