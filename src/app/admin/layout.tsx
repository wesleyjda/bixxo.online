'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0A0A0A]' : 'bg-gray-50'}`}>
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} theme={theme} />
      
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <AdminHeader theme={theme} onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
