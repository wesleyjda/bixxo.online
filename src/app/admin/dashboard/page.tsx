'use client';

import { useState } from 'react';
import StatCard from '@/components/admin/StatCard';
import DataTable from '@/components/admin/DataTable';
import {
  Users,
  Target,
  Trophy,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity
} from 'lucide-react';

export default function AdminDashboard() {
  const [theme] = useState<'light' | 'dark'>('dark');

  // Dados mockados
  const stats = [
    {
      title: 'Total de Usuários',
      value: '1,234',
      icon: Users,
      trend: { value: '+12% vs mês passado', isPositive: true }
    },
    {
      title: 'Apostas Hoje',
      value: '456',
      icon: Target,
      trend: { value: '+8% vs ontem', isPositive: true }
    },
    {
      title: 'Prêmios Pagos',
      value: 'R$ 45.678',
      icon: Trophy,
      trend: { value: '-5% vs ontem', isPositive: false }
    },
    {
      title: 'Saldo Total',
      value: 'R$ 123.456',
      icon: DollarSign,
      trend: { value: '+15% vs mês passado', isPositive: true }
    }
  ];

  const ultimasApostas = [
    { id: 1, usuario: 'João Silva', tipo: 'Grupo', valor: 'R$ 50,00', status: 'Aguardando', data: '10/01/2024 14:30' },
    { id: 2, usuario: 'Maria Santos', tipo: 'Dezena', valor: 'R$ 100,00', status: 'Ganhou', data: '10/01/2024 14:25' },
    { id: 3, usuario: 'Pedro Costa', tipo: 'Centena', valor: 'R$ 25,00', status: 'Perdeu', data: '10/01/2024 14:20' },
    { id: 4, usuario: 'Ana Lima', tipo: 'Grupo', valor: 'R$ 75,00', status: 'Aguardando', data: '10/01/2024 14:15' },
    { id: 5, usuario: 'Carlos Souza', tipo: 'Milhar', valor: 'R$ 200,00', status: 'Aguardando', data: '10/01/2024 14:10' }
  ];

  const ultimasTransacoes = [
    { id: 1, usuario: 'João Silva', tipo: 'Depósito', valor: 'R$ 500,00', metodo: 'PIX', status: 'Aprovado', data: '10/01/2024 14:30' },
    { id: 2, usuario: 'Maria Santos', tipo: 'Saque', valor: 'R$ 300,00', metodo: 'PIX', status: 'Processando', data: '10/01/2024 14:25' },
    { id: 3, usuario: 'Pedro Costa', tipo: 'Depósito', valor: 'R$ 150,00', metodo: 'PIX', status: 'Aprovado', data: '10/01/2024 14:20' },
    { id: 4, usuario: 'Ana Lima', tipo: 'Saque', valor: 'R$ 200,00', metodo: 'PIX', status: 'Aprovado', data: '10/01/2024 14:15' }
  ];

  const apostasColumns = [
    { key: 'usuario', label: 'Usuário' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'valor', label: 'Valor' },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Ganhou' ? 'bg-[#00FF88]/20 text-[#00FF88]' :
          value === 'Perdeu' ? 'bg-red-500/20 text-red-400' :
          'bg-[#0066FF]/20 text-[#0066FF]'
        }`}>
          {value}
        </span>
      )
    },
    { key: 'data', label: 'Data/Hora' }
  ];

  const transacoesColumns = [
    { key: 'usuario', label: 'Usuário' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'valor', label: 'Valor' },
    { key: 'metodo', label: 'Método' },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Aprovado' ? 'bg-[#00FF88]/20 text-[#00FF88]' :
          value === 'Processando' ? 'bg-[#0066FF]/20 text-[#0066FF]' :
          'bg-red-500/20 text-red-400'
        }`}>
          {value}
        </span>
      )
    },
    { key: 'data', label: 'Data/Hora' }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            theme={theme}
          />
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2A2A2A]">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="text-[#00FF88]" size={20} />
            Apostas Diárias (Últimos 7 dias)
          </h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {[45, 62, 58, 73, 69, 81, 76].map((value, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-[#00FF88] to-[#0066FF] rounded-t-lg transition-all duration-300 hover:opacity-80"
                  style={{ height: `${value}%` }}
                />
                <span className="text-xs text-gray-400">
                  {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2A2A2A]">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="text-[#0066FF]" size={20} />
            Ganhos vs Perdas (Últimos 7 dias)
          </h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {[
              { ganhos: 65, perdas: 35 },
              { ganhos: 58, perdas: 42 },
              { ganhos: 72, perdas: 28 },
              { ganhos: 61, perdas: 39 },
              { ganhos: 68, perdas: 32 },
              { ganhos: 75, perdas: 25 },
              { ganhos: 70, perdas: 30 }
            ].map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col gap-1">
                  <div
                    className="w-full bg-[#00FF88] rounded-t-lg"
                    style={{ height: `${data.ganhos * 2}px` }}
                  />
                  <div
                    className="w-full bg-red-500 rounded-b-lg"
                    style={{ height: `${data.perdas * 2}px` }}
                  />
                </div>
                <span className="text-xs text-gray-400">
                  {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Últimas Apostas */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Últimas Apostas</h3>
        <DataTable
          columns={apostasColumns}
          data={ultimasApostas}
          theme={theme}
        />
      </div>

      {/* Últimas Transações */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Últimas Transações</h3>
        <DataTable
          columns={transacoesColumns}
          data={ultimasTransacoes}
          theme={theme}
        />
      </div>
    </div>
  );
}
