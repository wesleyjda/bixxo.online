'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, LogOut, Menu, X, Home, Gamepad2, Trophy, Wallet, History, Settings, Shield } from 'lucide-react';

interface NavbarProps {
  user?: {
    nome: string;
    saldo: number;
    role: string;
  } | null;
  onLogout?: () => void;
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

export default function Navbar({ user, onLogout, currentPage = 'home', onNavigate }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'apostas', label: 'Apostas', icon: Gamepad2 },
    { id: 'resultados', label: 'Resultados', icon: Trophy },
    { id: 'carteira', label: 'Carteira', icon: Wallet },
    { id: 'historico', label: 'Histórico', icon: History },
    { id: 'conta', label: 'Conta', icon: Settings },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <nav className="bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-white">
                🎯 JogoBicho<span className="text-yellow-300">Online</span>
              </h1>
            </div>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate?.(item.id)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
                      currentPage === item.id
                        ? 'bg-emerald-700 text-white'
                        : 'text-emerald-100 hover:bg-emerald-500 hover:text-white'
                    }`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </button>
                );
              })}
              
              {/* Botão Admin - apenas para administradores */}
              {isAdmin && (
                <Link
                  href="/admin/dashboard"
                  className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  <Shield size={16} />
                  Admin
                </Link>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-white">{user.nome}</div>
                    <div className="text-xs text-emerald-200">
                      Saldo: {formatCurrency(user.saldo)}
                    </div>
                  </div>
                  <div className="relative">
                    <button className="bg-emerald-700 p-2 rounded-full text-emerald-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-emerald-600 focus:ring-white">
                      <User size={20} />
                    </button>
                  </div>
                  <button
                    onClick={onLogout}
                    className="bg-red-600 hover:bg-red-700 p-2 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-emerald-600 focus:ring-white transition-colors duration-200"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onNavigate?.('login')}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Entrar
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-emerald-700 inline-flex items-center justify-center p-2 rounded-md text-emerald-200 hover:text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-emerald-700">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate?.(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors duration-200 flex items-center gap-2 ${
                    currentPage === item.id
                      ? 'bg-emerald-800 text-white'
                      : 'text-emerald-100 hover:bg-emerald-600 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
            
            {/* Botão Admin Mobile - apenas para administradores */}
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors duration-200 flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                <Shield size={18} />
                Admin
              </Link>
            )}
            
            {user && (
              <div className="border-t border-emerald-600 pt-4 pb-3">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <User className="h-8 w-8 text-emerald-200" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">{user.nome}</div>
                    <div className="text-sm font-medium text-emerald-200">
                      Saldo: {formatCurrency(user.saldo)}
                    </div>
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <button
                    onClick={() => {
                      onLogout?.();
                      setIsMenuOpen(false);
                    }}
                    className="block px-3 py-2 rounded-md text-base font-medium text-emerald-100 hover:text-white hover:bg-emerald-600 w-full text-left flex items-center gap-2"
                  >
                    <LogOut size={18} />
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
