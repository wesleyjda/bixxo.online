'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Target,
  Gamepad2,
  Wallet,
  Settings,
  CreditCard,
  Megaphone,
  FileText,
  Shield,
  MessageSquare,
  FileEdit,
  ChevronLeft,
  ChevronRight,
  UserCheck
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  theme: 'light' | 'dark';
}

export default function AdminSidebar({ isOpen, onToggle, theme }: AdminSidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: Users, label: 'Usuários', href: '/admin/usuarios' },
    { icon: UserCheck, label: 'Clientes', href: '/admin/clientes' },
    { icon: CreditCard, label: 'Pedidos', href: '/admin/pedidos' },
    { icon: Target, label: 'Apostas', href: '/admin/apostas' },
    { icon: Gamepad2, label: 'Jogos', href: '/admin/jogos' },
    { icon: Wallet, label: 'Financeiro', href: '/admin/financeiro' },
    { icon: Settings, label: 'Configurações', href: '/admin/configuracoes' },
    { icon: CreditCard, label: 'Gateways', href: '/admin/gateways' },
    { icon: Megaphone, label: 'Campanhas', href: '/admin/campanhas' },
    { icon: FileText, label: 'Relatórios', href: '/admin/relatorios' },
    { icon: Shield, label: 'Equipe', href: '/admin/equipe' },
    { icon: MessageSquare, label: 'Suporte', href: '/admin/suporte' },
    { icon: FileEdit, label: 'CMS', href: '/admin/cms' },
  ];

  const bgColor = theme === 'dark' ? 'bg-[#0F0F0F]' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const borderColor = theme === 'dark' ? 'border-[#1A1A1A]' : 'border-gray-200';

  return (
    <aside
      className={`fixed left-0 top-0 h-screen ${bgColor} border-r ${borderColor} transition-all duration-300 z-40 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#1A1A1A]">
        {isOpen && (
          <div className="flex items-center gap-2">
            <div className="text-2xl">🎯</div>
            <div>
              <div className={`text-lg font-bold ${textColor}`}>
                Admin<span className="text-[#00FF88]">Panel</span>
              </div>
            </div>
          </div>
        )}
        {!isOpen && <div className="text-2xl mx-auto">🎯</div>}
        
        <button
          onClick={onToggle}
          className={`${mutedColor} hover:text-[#00FF88] transition-colors duration-200 ${!isOpen && 'mx-auto'}`}
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-[#00FF88]/20 to-[#0066FF]/20 text-[#00FF88] border border-[#00FF88]/30'
                  : `${mutedColor} hover:bg-[#1A1A1A] hover:text-white`
              }`}
            >
              <Icon size={20} className="flex-shrink-0" />
              {isOpen && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
