import { NavItem } from '@/types';
export type Role = 'patient' | 'caregiver' | 'admin' | "doctor";



export const roleNavItems: Record<Role, NavItem[]> = {
  patient: [
    {
      title: 'Dashboard',
      url: '/dashboard/overview',
      icon: 'dashboard',
      shortcut: ['d', 'd'],
      isActive: false,
      items: [],
    },
    {
      title: 'AI',
      url: '/dashboard/ai',
      icon: 'brain',
      shortcut: ['a', 'l'],
      isActive: false,
      items: [],
    },
    {
      title: 'Alerts',
      url: '/dashboard/alert',
      icon: 'alertTriangle',
      shortcut: ['a', 'l'],
      isActive: false,
      items: [],
    },
    {
      title: 'medicine',
      url: '/dashboard/medicine',
      icon: 'pill',
      shortcut: ['m', 'e'],
      isActive: false,
      items: [],
    },
    {
      title: 'Medical Profile',
      url: '/dashboard/medical-profile',
      icon: 'billing',
      isActive: true,
      items: [],
    },
    {
      title: 'Chat',
      url: '/dashboard/chat',
      icon: 'chat',
      isActive: true,
      items: [],
    },
  ],
  caregiver: [
    {
      title: 'Patients',
      url: '/dashboard/patients',
      icon: 'users',
      shortcut: ['p', 't'],
      isActive: false,
      items: [],
    },
    {
      title: 'Chat',
      url: '/dashboard/chat',
      icon: 'chat',
      isActive: true,
      items: [],
    },
  ],
  doctor: [
    {
      title: 'Patients',
      url: '/dashboard/patients',
      icon: 'dashboard',
      shortcut: ['d', 'd'],
      isActive: false,
      items: [],
    },
    {
      title: 'Chat',
      url: '/dashboard/chat',
      icon: 'chat',
      isActive: true,
      items: [],
    },
  ],
  admin: [
    {
      title: 'Users',
      url: '/dashboard/users',
      icon: 'dashboard',
      shortcut: ['d', 'd'],
      isActive: false,
      items: [],
    },
    {
      title: 'Chat',
      url: '/dashboard/chat',
      icon: 'chat',
      isActive: true,
      items: [],
    },
  ],
};


