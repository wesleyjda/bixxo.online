'use client';

import { useState } from 'react';
import { Bell, Moon, Sun, User, LogOut, Settings } from 'lucide-react';

interface AdminHeaderProps {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

export default function AdminHeader({ theme, onThemeToggle }: AdminHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const bgColor = theme === 'dark' ? 'bg-[#0F0F0F]' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const borderColor = theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200';

  return (
    <header className={`sticky top-0 z-30 ${bgColor} border-b ${borderColor} backdrop-blur-md bg-opacity-95`}>
      <div className="h-16 px-6 flex items-center justify-between">
        {/* Breadcrumb / Title */}
        <div>
          <h1 className={`text-xl font-bold ${textColor}`}>Dashboard</h1>
          <p className={`text-sm ${mutedColor}`}>Bem-vindo ao painel administrativo</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={onThemeToggle}
            className={`p-2 rounded-lg ${mutedColor} hover:bg-[#1A1A1A] hover:text-[#00FF88] transition-colors duration-200`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Notifications */}
          <button className={`p-2 rounded-lg ${mutedColor} hover:bg-[#1A1A1A] hover:text-[#00FF88] transition-colors duration-200 relative`}>
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${mutedColor} hover:bg-[#1A1A1A] hover:text-white transition-colors duration-200`}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00FF88] to-[#0066FF] flex items-center justify-center text-[#0A0A0A] font-bold">
                A
              </div>
              <span className={`font-medium ${textColor}`}>Admin</span>
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div className={`absolute right-0 mt-2 w-48 ${bgColor} rounded-lg shadow-2xl border ${borderColor} py-2`}>
                <button className={`w-full flex items-center gap-3 px-4 py-2 ${mutedColor} hover:bg-[#1A1A1A] hover:text-white transition-colors duration-200`}>
                  <User size={16} />
                  <span>Meu Perfil</span>
                </button>
                <button className={`w-full flex items-center gap-3 px-4 py-2 ${mutedColor} hover:bg-[#1A1A1A] hover:text-white transition-colors duration-200`}>
                  <Settings size={16} />
                  <span>Configurações</span>
                </button>
                <hr className={`my-2 ${borderColor}`} />
                <button className={`w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 transition-colors duration-200`}>
                  <LogOut size={16} />
                  <span>Sair</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
