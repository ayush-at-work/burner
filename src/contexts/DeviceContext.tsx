import React, { createContext, useContext, useState } from 'react';
import { faker } from '@faker-js/faker';

export interface VirtualDevice {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet' | 'server';
  os: string;
  status: 'online' | 'offline' | 'maintenance';
  assignedTo: string | null;
  assignedToName?: string;
  specs: {
    cpu: string;
    ram: string;
    storage: string;
    gpu?: string;
  };
  createdAt: string;
  lastUsed?: string;
  ipAddress: string;
  location: string;
}

interface DeviceContextType {
  devices: VirtualDevice[];
  assignDevice: (deviceId: string, userId: string, userName: string) => void;
  unassignDevice: (deviceId: string) => void;
  createDevice: (deviceData: Omit<VirtualDevice, 'id' | 'createdAt' | 'assignedTo' | 'ipAddress'>) => void;
  deleteDevice: (deviceId: string) => void;
  updateDeviceStatus: (deviceId: string, status: VirtualDevice['status']) => void;
  getUserDevices: (userId: string) => VirtualDevice[];
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

const generateDefaultDevices = (): VirtualDevice[] => {
  const deviceTypes: VirtualDevice['type'][] = ['desktop', 'mobile', 'tablet', 'server'];
  const osOptions = {
    desktop: ['Windows 11', 'macOS Ventura', 'Ubuntu 22.04'],
    mobile: ['Android 13', 'iOS 16', 'HarmonyOS'],
    tablet: ['iPadOS 16', 'Android 13', 'Windows 11'],
    server: ['Ubuntu Server 22.04', 'CentOS 8', 'Windows Server 2022'],
  };

  return Array.from({ length: 12 }, (_, i) => {
    const type = deviceTypes[i % deviceTypes.length];
    const os = osOptions[type][Math.floor(Math.random() * osOptions[type].length)];
    
    return {
      id: (i + 1).toString(),
      name: `${type.charAt(0).toUpperCase() + type.slice(1)}-${faker.string.alphanumeric(4).toUpperCase()}`,
      type,
      os,
      status: ['online', 'offline', 'maintenance'][Math.floor(Math.random() * 3)] as VirtualDevice['status'],
      assignedTo: i < 6 ? (i < 3 ? '2' : '3') : null,
      assignedToName: i < 6 ? (i < 3 ? 'john_doe' : 'jane_smith') : undefined,
      specs: {
        cpu: faker.helpers.arrayElement(['Intel i7-12700K', 'AMD Ryzen 7 5800X', 'Apple M2', 'Intel Xeon E5-2680']),
        ram: faker.helpers.arrayElement(['8GB', '16GB', '32GB', '64GB']),
        storage: faker.helpers.arrayElement(['256GB SSD', '512GB SSD', '1TB SSD', '2TB SSD']),
        gpu: type === 'desktop' ? faker.helpers.arrayElement(['NVIDIA RTX 4070', 'AMD RX 6800 XT', 'Intel Arc A770']) : undefined,
      },
      createdAt: faker.date.past({ years: 1 }).toISOString(),
      lastUsed: Math.random() > 0.3 ? faker.date.recent({ days: 7 }).toISOString() : undefined,
      ipAddress: faker.internet.ip(),
      location: faker.location.city(),
    };
  });
};

export function DeviceProvider({ children }: { children: React.ReactNode }) {
  const [devices, setDevices] = useState<VirtualDevice[]>(generateDefaultDevices());

  const assignDevice = (deviceId: string, userId: string, userName: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, assignedTo: userId, assignedToName: userName }
        : device
    ));
  };

  const unassignDevice = (deviceId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, assignedTo: null, assignedToName: undefined }
        : device
    ));
  };

  const createDevice = (deviceData: Omit<VirtualDevice, 'id' | 'createdAt' | 'assignedTo' | 'ipAddress'>) => {
    const newDevice: VirtualDevice = {
      ...deviceData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      assignedTo: null,
      ipAddress: faker.internet.ip(),
    };
    setDevices(prev => [...prev, newDevice]);
  };

  const deleteDevice = (deviceId: string) => {
    setDevices(prev => prev.filter(device => device.id !== deviceId));
  };

  const updateDeviceStatus = (deviceId: string, status: VirtualDevice['status']) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, status }
        : device
    ));
  };

  const getUserDevices = (userId: string) => {
    return devices.filter(device => device.assignedTo === userId);
  };

  return (
    <DeviceContext.Provider value={{
      devices,
      assignDevice,
      unassignDevice,
      createDevice,
      deleteDevice,
      updateDeviceStatus,
      getUserDevices,
    }}>
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevices() {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDevices must be used within a DeviceProvider');
  }
  return context;
}
