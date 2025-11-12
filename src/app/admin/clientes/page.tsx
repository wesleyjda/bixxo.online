'use client';

import { useState } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  DollarSign,
  Search,
  Filter,
  Eye,
  Edit,
  Lock,
  Unlock,
  Trash2,
  Download,
  X,
  Save,
  Plus,
  Minus,
  TrendingUp,
  Calendar,
  Phone,
  Mail,
  CreditCard,
  History,
  Activity,
  AlertCircle
} from 'lucide-react';

type Tab = 'todos' | 'bloqueados';
type ModalType = 'details' | 'edit' | 'addBalance' | 'removeBalance' | null;
type DetailsTab = 'perfil' | 'carteira' | 'apostas' | 'historico';

interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  dataCadastro: string;
  ultimoAcesso: string;
  status: 'Ativo' | 'Bloqueado' | 'Aguardando';
  saldo: number;
  totalApostado: number;
  dataNascimento?: string;
  genero?: string;
}

interface Movimentacao {
  id: number;
  data: string;
  tipo: 'Depósito' | 'Saque' | 'Aposta' | 'Prêmio' | 'Ajuste';
  valor: number;
  status: 'Concluído' | 'Pendente' | 'Cancelado';
}

interface Aposta {
  id: number;
  jogo: string;
  valor: number;
  resultado: 'Ganhou' | 'Perdeu' | 'Pendente';
  data: string;
  status: 'Finalizada' | 'Em andamento';
}

interface HistoricoAcao {
  id: number;
  data: string;
  acao: string;
  ip: string;
}

export default function ClientesPage() {
  const [activeTab, setActiveTab] = useState<Tab>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showModal, setShowModal] = useState<ModalType>(null);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [detailsTab, setDetailsTab] = useState<DetailsTab>('perfil');
  const [selectedClientes, setSelectedClientes] = useState<number[]>([]);
  const [balanceAmount, setBalanceAmount] = useState('');
  const [balanceReason, setBalanceReason] = useState('');

  // Filtros avançados
  const [filtroId, setFiltroId] = useState('');
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroEmail, setFiltroEmail] = useState('');
  const [filtroCpf, setFiltroCpf] = useState('');
  const [filtroDataInicio, setFiltroDataInicio] = useState('');
  const [filtroDataFim, setFiltroDataFim] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Dados mockados
  const [clientes, setClientes] = useState<Cliente[]>([
    {
      id: 1,
      nome: 'João Silva Santos',
      email: 'joao.silva@email.com',
      telefone: '+55 11 98765-4321',
      cpf: '123.456.789-00',
      dataCadastro: '10/01/2024',
      ultimoAcesso: '16/01/2024 10:30',
      status: 'Ativo',
      saldo: 1250.50,
      totalApostado: 5430.00,
      dataNascimento: '15/03/1990',
      genero: 'Masculino'
    },
    {
      id: 2,
      nome: 'Maria Oliveira Costa',
      email: 'maria.oliveira@email.com',
      telefone: '+55 11 97654-3210',
      cpf: '987.654.321-00',
      dataCadastro: '12/01/2024',
      ultimoAcesso: '16/01/2024 09:15',
      status: 'Ativo',
      saldo: 850.00,
      totalApostado: 3200.00,
      dataNascimento: '22/07/1985',
      genero: 'Feminino'
    },
    {
      id: 3,
      nome: 'Pedro Henrique Souza',
      email: 'pedro.souza@email.com',
      telefone: '+55 11 96543-2109',
      cpf: '456.789.123-00',
      dataCadastro: '08/01/2024',
      ultimoAcesso: '15/01/2024 18:45',
      status: 'Bloqueado',
      saldo: 0.00,
      totalApostado: 8900.00,
      dataNascimento: '10/11/1992',
      genero: 'Masculino'
    },
    {
      id: 4,
      nome: 'Ana Paula Ferreira',
      email: 'ana.ferreira@email.com',
      telefone: '+55 11 95432-1098',
      cpf: '321.654.987-00',
      dataCadastro: '14/01/2024',
      ultimoAcesso: '16/01/2024 08:20',
      status: 'Ativo',
      saldo: 2100.75,
      totalApostado: 12500.00,
      dataNascimento: '05/09/1988',
      genero: 'Feminino'
    },
    {
      id: 5,
      nome: 'Carlos Eduardo Lima',
      email: 'carlos.lima@email.com',
      telefone: '+55 11 94321-0987',
      cpf: '789.123.456-00',
      dataCadastro: '15/01/2024',
      ultimoAcesso: '15/01/2024 20:10',
      status: 'Aguardando',
      saldo: 500.00,
      totalApostado: 500.00,
      dataNascimento: '18/04/1995',
      genero: 'Masculino'
    }
  ]);

  const movimentacoes: Movimentacao[] = [
    { id: 1, data: '16/01/2024 10:30', tipo: 'Depósito', valor: 500.00, status: 'Concluído' },
    { id: 2, data: '16/01/2024 09:15', tipo: 'Aposta', valor: -50.00, status: 'Concluído' },
    { id: 3, data: '15/01/2024 18:45', tipo: 'Prêmio', valor: 150.00, status: 'Concluído' },
    { id: 4, data: '15/01/2024 14:20', tipo: 'Saque', valor: -200.00, status: 'Pendente' },
    { id: 5, data: '14/01/2024 11:30', tipo: 'Ajuste', valor: 100.00, status: 'Concluído' }
  ];

  const apostas: Aposta[] = [
    { id: 1, jogo: 'Jogo do Bicho - Águia', valor: 50.00, resultado: 'Ganhou', data: '16/01/2024 10:30', status: 'Finalizada' },
    { id: 2, jogo: 'Jogo do Bicho - Leão', valor: 100.00, resultado: 'Perdeu', data: '15/01/2024 18:45', status: 'Finalizada' },
    { id: 3, jogo: 'Jogo do Bicho - Cavalo', valor: 75.00, resultado: 'Pendente', data: '16/01/2024 09:15', status: 'Em andamento' },
    { id: 4, jogo: 'Jogo do Bicho - Tigre', valor: 200.00, resultado: 'Ganhou', data: '14/01/2024 16:20', status: 'Finalizada' }
  ];

  const historicoAcoes: HistoricoAcao[] = [
    { id: 1, data: '16/01/2024 10:30', acao: 'Login realizado', ip: '192.168.1.1' },
    { id: 2, data: '16/01/2024 10:32', acao: 'Aposta realizada - R$ 50,00', ip: '192.168.1.1' },
    { id: 3, data: '16/01/2024 09:15', acao: 'Depósito via PIX - R$ 500,00', ip: '192.168.1.1' },
    { id: 4, data: '15/01/2024 18:45', acao: 'Atualização de dados cadastrais', ip: '10.0.0.25' },
    { id: 5, data: '15/01/2024 14:20', acao: 'Solicitação de saque - R$ 200,00', ip: '192.168.1.1' }
  ];

  const bgColor = 'bg-[#1A1A1A]';
  const borderColor = 'border-[#2A2A2A]';
  const textColor = 'text-white';
  const textSecondary = 'text-gray-400';
  const hoverBg = 'hover:bg-[#2A2A2A]';

  // Estatísticas
  const stats = {
    total: clientes.length,
    ativos: clientes.filter(c => c.status === 'Ativo').length,
    bloqueados: clientes.filter(c => c.status === 'Bloqueado').length,
    novos: clientes.filter(c => {
      const cadastro = new Date(c.dataCadastro.split('/').reverse().join('-'));
      const hoje = new Date();
      const diff = Math.floor((hoje.getTime() - cadastro.getTime()) / (1000 * 60 * 60 * 24));
      return diff <= 7;
    }).length,
    saldoTotal: clientes.reduce((acc, c) => acc + c.saldo, 0)
  };

  // Filtrar clientes
  const filteredClientes = clientes.filter(cliente => {
    const matchesTab = activeTab === 'todos' || (activeTab === 'bloqueados' && cliente.status === 'Bloqueado');
    const matchesSearch = cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliente.id.toString().includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || cliente.status === filterStatus;
    
    // Filtros avançados
    const matchesId = !filtroId || cliente.id.toString().includes(filtroId);
    const matchesNome = !filtroNome || cliente.nome.toLowerCase().includes(filtroNome.toLowerCase());
    const matchesEmail = !filtroEmail || cliente.email.toLowerCase().includes(filtroEmail.toLowerCase());
    const matchesCpf = !filtroCpf || cliente.cpf.includes(filtroCpf);
    
    return matchesTab && matchesSearch && matchesStatus && matchesId && matchesNome && matchesEmail && matchesCpf;
  });

  const tabs = [
    { id: 'todos' as Tab, label: 'Todos os Clientes', icon: <Users size={20} /> },
    { id: 'bloqueados' as Tab, label: 'Bloqueados', icon: <UserX size={20} /> }
  ];

  const detailsTabs = [
    { id: 'perfil' as DetailsTab, label: 'Perfil', icon: <Users size={18} /> },
    { id: 'carteira' as DetailsTab, label: 'Carteira', icon: <DollarSign size={18} /> },
    { id: 'apostas' as DetailsTab, label: 'Apostas', icon: <TrendingUp size={18} /> },
    { id: 'historico' as DetailsTab, label: 'Histórico', icon: <History size={18} /> }
  ];

  const handleToggleStatus = (id: number) => {
    setClientes(clientes.map(c => 
      c.id === id 
        ? { ...c, status: c.status === 'Ativo' ? 'Bloqueado' : 'Ativo' }
        : c
    ));
  };

  const handleDeleteCliente = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.')) {
      setClientes(clientes.filter(c => c.id !== id));
      alert('Cliente excluído com sucesso!');
    }
  };

  const handleToggleSelect = (id: number) => {
    setSelectedClientes(prev =>
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedClientes.length === filteredClientes.length) {
      setSelectedClientes([]);
    } else {
      setSelectedClientes(filteredClientes.map(c => c.id));
    }
  };

  const handleBulkAction = (action: 'block' | 'unblock' | 'delete' | 'export') => {
    if (selectedClientes.length === 0) {
      alert('Selecione pelo menos um cliente.');
      return;
    }

    switch (action) {
      case 'block':
        setClientes(clientes.map(c =>
          selectedClientes.includes(c.id) ? { ...c, status: 'Bloqueado' } : c
        ));
        alert(`${selectedClientes.length} cliente(s) bloqueado(s) com sucesso!`);
        setSelectedClientes([]);
        break;
      case 'unblock':
        setClientes(clientes.map(c =>
          selectedClientes.includes(c.id) ? { ...c, status: 'Ativo' } : c
        ));
        alert(`${selectedClientes.length} cliente(s) desbloqueado(s) com sucesso!`);
        setSelectedClientes([]);
        break;
      case 'delete':
        if (confirm(`Tem certeza que deseja excluir ${selectedClientes.length} cliente(s)?`)) {
          setClientes(clientes.filter(c => !selectedClientes.includes(c.id)));
          alert(`${selectedClientes.length} cliente(s) excluído(s) com sucesso!`);
          setSelectedClientes([]);
        }
        break;
      case 'export':
        alert(`Exportando ${selectedClientes.length} cliente(s) para CSV...`);
        break;
    }
  };

  const handleAddBalance = () => {
    if (!balanceAmount || parseFloat(balanceAmount) <= 0) {
      alert('Digite um valor válido.');
      return;
    }
    if (!selectedCliente) return;

    setClientes(clientes.map(c =>
      c.id === selectedCliente.id
        ? { ...c, saldo: c.saldo + parseFloat(balanceAmount) }
        : c
    ));
    alert(`R$ ${balanceAmount} adicionado ao saldo de ${selectedCliente.nome}!`);
    setBalanceAmount('');
    setBalanceReason('');
    setShowModal(null);
  };

  const handleRemoveBalance = () => {
    if (!balanceAmount || parseFloat(balanceAmount) <= 0) {
      alert('Digite um valor válido.');
      return;
    }
    if (!selectedCliente) return;

    const valor = parseFloat(balanceAmount);
    if (valor > selectedCliente.saldo) {
      alert('Valor maior que o saldo disponível.');
      return;
    }

    setClientes(clientes.map(c =>
      c.id === selectedCliente.id
        ? { ...c, saldo: c.saldo - valor }
        : c
    ));
    alert(`R$ ${balanceAmount} descontado do saldo de ${selectedCliente.nome}!`);
    setBalanceAmount('');
    setBalanceReason('');
    setShowModal(null);
  };

  const handleSaveEdit = () => {
    if (!selectedCliente) return;
    alert('Dados do cliente atualizados com sucesso!');
    setShowModal(null);
  };

  const openDetailsModal = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setDetailsTab('perfil');
    setShowModal('details');
  };

  const openEditModal = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setShowModal('edit');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${textColor}`}>Gestão de Clientes</h1>
          <p className={textSecondary}>Visualize, filtre e gerencie os jogadores da plataforma</p>
        </div>
      </div>

      {/* Cards Superiores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className={`${bgColor} border ${borderColor} rounded-xl p-4 hover:shadow-lg transition-all duration-300`}>
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mb-3">
            <Users className="text-blue-500" size={24} />
          </div>
          <p className={`text-xs ${textSecondary} mb-1`}>Total de Clientes</p>
          <p className={`text-2xl font-bold ${textColor}`}>{stats.total}</p>
        </div>

        <div className={`${bgColor} border ${borderColor} rounded-xl p-4 hover:shadow-lg transition-all duration-300`}>
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center mb-3">
            <UserCheck className="text-green-500" size={24} />
          </div>
          <p className={`text-xs ${textSecondary} mb-1`}>Clientes Ativos</p>
          <p className={`text-2xl font-bold ${textColor}`}>{stats.ativos}</p>
        </div>

        <div className={`${bgColor} border ${borderColor} rounded-xl p-4 hover:shadow-lg transition-all duration-300`}>
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center mb-3">
            <UserX className="text-red-500" size={24} />
          </div>
          <p className={`text-xs ${textSecondary} mb-1`}>Clientes Bloqueados</p>
          <p className={`text-2xl font-bold ${textColor}`}>{stats.bloqueados}</p>
        </div>

        <div className={`${bgColor} border ${borderColor} rounded-xl p-4 hover:shadow-lg transition-all duration-300`}>
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center mb-3">
            <Clock className="text-purple-500" size={24} />
          </div>
          <p className={`text-xs ${textSecondary} mb-1`}>Novos (7 dias)</p>
          <p className={`text-2xl font-bold ${textColor}`}>{stats.novos}</p>
        </div>

        <div className={`${bgColor} border ${borderColor} rounded-xl p-4 hover:shadow-lg transition-all duration-300`}>
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00FF88]/20 to-[#0066FF]/20 flex items-center justify-center mb-3">
            <DollarSign className="text-[#00FF88]" size={24} />
          </div>
          <p className={`text-xs ${textSecondary} mb-1`}>Saldo Total</p>
          <p className={`text-2xl font-bold ${textColor}`}>R$ {stats.saldoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className={`${bgColor} border ${borderColor} rounded-xl overflow-hidden`}>
        <div className="flex overflow-x-auto border-b border-[#2A2A2A]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#00FF88]/10 to-[#0066FF]/10 text-[#00FF88] border-b-2 border-[#00FF88]'
                  : `${textSecondary} ${hoverBg}`
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Filtros e Busca */}
          <div className="space-y-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${textSecondary}`} size={20} />
                <input
                  type="text"
                  placeholder="Buscar por nome, e-mail ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
              >
                <option value="all">Todos os Status</option>
                <option value="Ativo">Ativo</option>
                <option value="Bloqueado">Bloqueado</option>
                <option value="Aguardando">Aguardando</option>
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-6 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} hover:bg-[#2A2A2A] transition-all flex items-center gap-2`}
              >
                <Filter size={20} />
                Filtros Avançados
              </button>
            </div>

            {/* Filtros Avançados */}
            {showFilters && (
              <div className={`${bgColor} border ${borderColor} rounded-lg p-4 space-y-4`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={`block text-sm font-semibold ${textColor} mb-2`}>ID do Cliente</label>
                    <input
                      type="text"
                      value={filtroId}
                      onChange={(e) => setFiltroId(e.target.value)}
                      className={`w-full px-4 py-2 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                      placeholder="Digite o ID"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-semibold ${textColor} mb-2`}>Nome Completo</label>
                    <input
                      type="text"
                      value={filtroNome}
                      onChange={(e) => setFiltroNome(e.target.value)}
                      className={`w-full px-4 py-2 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                      placeholder="Digite o nome"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-semibold ${textColor} mb-2`}>E-mail</label>
                    <input
                      type="email"
                      value={filtroEmail}
                      onChange={(e) => setFiltroEmail(e.target.value)}
                      className={`w-full px-4 py-2 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                      placeholder="Digite o e-mail"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-semibold ${textColor} mb-2`}>CPF</label>
                    <input
                      type="text"
                      value={filtroCpf}
                      onChange={(e) => setFiltroCpf(e.target.value)}
                      className={`w-full px-4 py-2 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                      placeholder="Digite o CPF"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-semibold ${textColor} mb-2`}>Data Início</label>
                    <input
                      type="date"
                      value={filtroDataInicio}
                      onChange={(e) => setFiltroDataInicio(e.target.value)}
                      className={`w-full px-4 py-2 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-semibold ${textColor} mb-2`}>Data Fim</label>
                    <input
                      type="date"
                      value={filtroDataFim}
                      onChange={(e) => setFiltroDataFim(e.target.value)}
                      className={`w-full px-4 py-2 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    setFiltroId('');
                    setFiltroNome('');
                    setFiltroEmail('');
                    setFiltroCpf('');
                    setFiltroDataInicio('');
                    setFiltroDataFim('');
                  }}
                  className={`px-4 py-2 ${bgColor} border ${borderColor} rounded-lg ${textColor} hover:bg-[#2A2A2A] transition-all`}
                >
                  Limpar Filtros
                </button>
              </div>
            )}
          </div>

          {/* Ações em Massa */}
          {selectedClientes.length > 0 && (
            <div className={`${bgColor} border-2 border-[#00FF88] rounded-lg p-4 mb-6 flex items-center justify-between`}>
              <p className={`font-semibold ${textColor}`}>
                {selectedClientes.length} cliente(s) selecionado(s)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction('block')}
                  className="px-4 py-2 bg-orange-500/20 border border-orange-500/50 text-orange-500 rounded-lg hover:bg-orange-500/30 transition-all"
                >
                  Bloquear
                </button>
                <button
                  onClick={() => handleBulkAction('unblock')}
                  className="px-4 py-2 bg-green-500/20 border border-green-500/50 text-green-500 rounded-lg hover:bg-green-500/30 transition-all"
                >
                  Desbloquear
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500/30 transition-all"
                >
                  Excluir
                </button>
                <button
                  onClick={() => handleBulkAction('export')}
                  className={`px-4 py-2 ${bgColor} border ${borderColor} rounded-lg ${textColor} hover:bg-[#2A2A2A] transition-all flex items-center gap-2`}
                >
                  <Download size={16} />
                  Exportar CSV
                </button>
              </div>
            </div>
          )}

          {/* Tabela de Clientes */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${borderColor}`}>
                  <th className={`text-left py-3 px-4`}>
                    <input
                      type="checkbox"
                      checked={selectedClientes.length === filteredClientes.length && filteredClientes.length > 0}
                      onChange={handleSelectAll}
                      className="w-5 h-5 rounded border-gray-600 text-[#00FF88] focus:ring-[#00FF88]"
                    />
                  </th>
                  <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>ID</th>
                  <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Nome Completo</th>
                  <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>E-mail</th>
                  <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Telefone</th>
                  <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Data Cadastro</th>
                  <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Último Acesso</th>
                  <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Status</th>
                  <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Saldo</th>
                  <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredClientes.map((cliente) => (
                  <tr key={cliente.id} className={`border-b ${borderColor} ${hoverBg}`}>
                    <td className={`py-3 px-4`}>
                      <input
                        type="checkbox"
                        checked={selectedClientes.includes(cliente.id)}
                        onChange={() => handleToggleSelect(cliente.id)}
                        className="w-5 h-5 rounded border-gray-600 text-[#00FF88] focus:ring-[#00FF88]"
                      />
                    </td>
                    <td className={`py-3 px-4 text-sm ${textColor}`}>#{cliente.id}</td>
                    <td className={`py-3 px-4 text-sm ${textColor} font-medium`}>{cliente.nome}</td>
                    <td className={`py-3 px-4 text-sm ${textSecondary}`}>{cliente.email}</td>
                    <td className={`py-3 px-4 text-sm ${textSecondary}`}>{cliente.telefone}</td>
                    <td className={`py-3 px-4 text-sm ${textSecondary}`}>{cliente.dataCadastro}</td>
                    <td className={`py-3 px-4 text-sm ${textSecondary}`}>{cliente.ultimoAcesso}</td>
                    <td className={`py-3 px-4 text-sm`}>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        cliente.status === 'Ativo' ? 'bg-green-500/20 text-green-500' :
                        cliente.status === 'Bloqueado' ? 'bg-red-500/20 text-red-500' :
                        'bg-orange-500/20 text-orange-500'
                      }`}>
                        {cliente.status}
                      </span>
                    </td>
                    <td className={`py-3 px-4 text-sm ${textColor} font-semibold`}>
                      R$ {cliente.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className={`py-3 px-4 text-sm`}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openDetailsModal(cliente)}
                          className="p-2 hover:bg-blue-500/20 rounded-lg transition-all"
                          title="Visualizar detalhes"
                        >
                          <Eye className="text-blue-500" size={16} />
                        </button>
                        <button
                          onClick={() => openEditModal(cliente)}
                          className="p-2 hover:bg-green-500/20 rounded-lg transition-all"
                          title="Editar"
                        >
                          <Edit className="text-green-500" size={16} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(cliente.id)}
                          className="p-2 hover:bg-orange-500/20 rounded-lg transition-all"
                          title={cliente.status === 'Ativo' ? 'Bloquear' : 'Desbloquear'}
                        >
                          {cliente.status === 'Ativo' ? (
                            <Lock className="text-orange-500" size={16} />
                          ) : (
                            <Unlock className="text-green-500" size={16} />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteCliente(cliente.id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-all"
                          title="Excluir"
                        >
                          <Trash2 className="text-red-500" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredClientes.length === 0 && (
            <div className="text-center py-12">
              <Users className={`mx-auto mb-4 ${textSecondary}`} size={48} />
              <p className={`text-lg ${textColor} mb-2`}>Nenhum cliente encontrado</p>
              <p className={textSecondary}>Tente ajustar os filtros de busca</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Detalhes do Cliente */}
      {showModal === 'details' && selectedCliente && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className={`${bgColor} border ${borderColor} rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto`}>
            <div className={`sticky top-0 ${bgColor} border-b ${borderColor} p-6 flex items-center justify-between z-10`}>
              <div>
                <h3 className={`text-xl font-bold ${textColor}`}>Detalhes do Cliente</h3>
                <p className={textSecondary}>#{selectedCliente.id} - {selectedCliente.nome}</p>
              </div>
              <button
                onClick={() => setShowModal(null)}
                className={textSecondary}
              >
                <X size={24} />
              </button>
            </div>

            {/* Tabs Internas */}
            <div className="flex overflow-x-auto border-b border-[#2A2A2A] px-6">
              {detailsTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDetailsTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-semibold transition-all whitespace-nowrap ${
                    detailsTab === tab.id
                      ? 'text-[#00FF88] border-b-2 border-[#00FF88]'
                      : `${textSecondary} ${hoverBg}`
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* Aba: Perfil */}
              {detailsTab === 'perfil' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-semibold ${textSecondary} mb-1`}>Nome Completo</label>
                      <p className={`text-lg ${textColor}`}>{selectedCliente.nome}</p>
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold ${textSecondary} mb-1`}>E-mail</label>
                      <p className={`text-lg ${textColor}`}>{selectedCliente.email}</p>
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold ${textSecondary} mb-1`}>Telefone</label>
                      <p className={`text-lg ${textColor}`}>{selectedCliente.telefone}</p>
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold ${textSecondary} mb-1`}>CPF</label>
                      <p className={`text-lg ${textColor}`}>{selectedCliente.cpf}</p>
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold ${textSecondary} mb-1`}>Data de Nascimento</label>
                      <p className={`text-lg ${textColor}`}>{selectedCliente.dataNascimento || 'Não informado'}</p>
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold ${textSecondary} mb-1`}>Gênero</label>
                      <p className={`text-lg ${textColor}`}>{selectedCliente.genero || 'Não informado'}</p>
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold ${textSecondary} mb-1`}>Data de Cadastro</label>
                      <p className={`text-lg ${textColor}`}>{selectedCliente.dataCadastro}</p>
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold ${textSecondary} mb-1`}>Último Acesso</label>
                      <p className={`text-lg ${textColor}`}>{selectedCliente.ultimoAcesso}</p>
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold ${textSecondary} mb-1`}>Status Atual</label>
                      <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                        selectedCliente.status === 'Ativo' ? 'bg-green-500/20 text-green-500' :
                        selectedCliente.status === 'Bloqueado' ? 'bg-red-500/20 text-red-500' :
                        'bg-orange-500/20 text-orange-500'
                      }`}>
                        {selectedCliente.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => handleToggleStatus(selectedCliente.id)}
                      className={`flex-1 px-4 py-3 ${
                        selectedCliente.status === 'Ativo'
                          ? 'bg-orange-500/20 border border-orange-500/50 text-orange-500'
                          : 'bg-green-500/20 border border-green-500/50 text-green-500'
                      } rounded-lg font-semibold hover:opacity-80 transition-all flex items-center justify-center gap-2`}
                    >
                      {selectedCliente.status === 'Ativo' ? (
                        <>
                          <Lock size={20} />
                          Bloquear Cliente
                        </>
                      ) : (
                        <>
                          <Unlock size={20} />
                          Desbloquear Cliente
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteCliente(selectedCliente.id)}
                      className="flex-1 px-4 py-3 bg-red-500/20 border border-red-500/50 text-red-500 rounded-lg font-semibold hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 size={20} />
                      Excluir Cliente
                    </button>
                  </div>
                </div>
              )}

              {/* Aba: Carteira */}
              {detailsTab === 'carteira' && (
                <div className="space-y-6">
                  <div className={`${bgColor} border-2 ${borderColor} rounded-xl p-6`}>
                    <p className={`text-sm ${textSecondary} mb-2`}>Saldo Atual</p>
                    <p className={`text-4xl font-bold ${textColor}`}>
                      R$ {selectedCliente.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowModal('addBalance')}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus size={20} />
                      Adicionar Saldo
                    </button>
                    <button
                      onClick={() => setShowModal('removeBalance')}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                      <Minus size={20} />
                      Descontar Saldo
                    </button>
                  </div>

                  <div>
                    <h4 className={`text-lg font-bold ${textColor} mb-4`}>Histórico de Movimentações</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className={`border-b ${borderColor}`}>
                            <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Data</th>
                            <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Tipo</th>
                            <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Valor</th>
                            <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {movimentacoes.map((mov) => (
                            <tr key={mov.id} className={`border-b ${borderColor} ${hoverBg}`}>
                              <td className={`py-3 px-4 text-sm ${textSecondary}`}>{mov.data}</td>
                              <td className={`py-3 px-4 text-sm ${textColor}`}>{mov.tipo}</td>
                              <td className={`py-3 px-4 text-sm font-semibold ${
                                mov.valor > 0 ? 'text-green-500' : 'text-red-500'
                              }`}>
                                {mov.valor > 0 ? '+' : ''}R$ {Math.abs(mov.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </td>
                              <td className={`py-3 px-4 text-sm`}>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  mov.status === 'Concluído' ? 'bg-green-500/20 text-green-500' :
                                  mov.status === 'Pendente' ? 'bg-orange-500/20 text-orange-500' :
                                  'bg-red-500/20 text-red-500'
                                }`}>
                                  {mov.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Aba: Apostas */}
              {detailsTab === 'apostas' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`${bgColor} border ${borderColor} rounded-xl p-4`}>
                      <p className={`text-sm ${textSecondary} mb-1`}>Total Apostado</p>
                      <p className={`text-2xl font-bold ${textColor}`}>
                        R$ {selectedCliente.totalApostado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className={`${bgColor} border ${borderColor} rounded-xl p-4`}>
                      <p className={`text-sm ${textSecondary} mb-1`}>Total de Apostas</p>
                      <p className={`text-2xl font-bold ${textColor}`}>{apostas.length}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className={`text-lg font-bold ${textColor} mb-4`}>Histórico de Apostas</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className={`border-b ${borderColor}`}>
                            <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>ID</th>
                            <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Jogo</th>
                            <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Valor</th>
                            <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Resultado</th>
                            <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Data</th>
                            <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {apostas.map((aposta) => (
                            <tr key={aposta.id} className={`border-b ${borderColor} ${hoverBg}`}>
                              <td className={`py-3 px-4 text-sm ${textColor}`}>#{aposta.id}</td>
                              <td className={`py-3 px-4 text-sm ${textColor}`}>{aposta.jogo}</td>
                              <td className={`py-3 px-4 text-sm ${textColor} font-semibold`}>
                                R$ {aposta.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </td>
                              <td className={`py-3 px-4 text-sm`}>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  aposta.resultado === 'Ganhou' ? 'bg-green-500/20 text-green-500' :
                                  aposta.resultado === 'Perdeu' ? 'bg-red-500/20 text-red-500' :
                                  'bg-orange-500/20 text-orange-500'
                                }`}>
                                  {aposta.resultado}
                                </span>
                              </td>
                              <td className={`py-3 px-4 text-sm ${textSecondary}`}>{aposta.data}</td>
                              <td className={`py-3 px-4 text-sm ${textSecondary}`}>{aposta.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <button
                    className="w-full bg-gradient-to-r from-[#00FF88] to-[#0066FF] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all"
                  >
                    Ver Apostas Completas
                  </button>
                </div>
              )}

              {/* Aba: Histórico */}
              {detailsTab === 'historico' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-lg font-bold ${textColor}`}>Histórico de Ações</h4>
                    <button
                      className={`px-4 py-2 ${bgColor} border ${borderColor} rounded-lg ${textColor} hover:bg-[#2A2A2A] transition-all flex items-center gap-2`}
                    >
                      <Download size={16} />
                      Exportar CSV
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className={`border-b ${borderColor}`}>
                          <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Data/Hora</th>
                          <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Ação</th>
                          <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>IP</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historicoAcoes.map((acao) => (
                          <tr key={acao.id} className={`border-b ${borderColor} ${hoverBg}`}>
                            <td className={`py-3 px-4 text-sm ${textSecondary}`}>{acao.data}</td>
                            <td className={`py-3 px-4 text-sm ${textColor}`}>{acao.acao}</td>
                            <td className={`py-3 px-4 text-sm ${textSecondary}`}>{acao.ip}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Editar Cliente */}
      {showModal === 'edit' && selectedCliente && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${bgColor} border ${borderColor} rounded-xl p-6 w-full max-w-2xl`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${textColor}`}>Editar Cliente</h3>
              <button
                onClick={() => setShowModal(null)}
                className={textSecondary}
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-semibold ${textColor} mb-2`}>Nome Completo</label>
                  <input
                    type="text"
                    defaultValue={selectedCliente.nome}
                    className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold ${textColor} mb-2`}>E-mail</label>
                  <input
                    type="email"
                    defaultValue={selectedCliente.email}
                    className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold ${textColor} mb-2`}>Telefone / WhatsApp</label>
                  <input
                    type="tel"
                    defaultValue={selectedCliente.telefone}
                    className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold ${textColor} mb-2`}>CPF</label>
                  <input
                    type="text"
                    defaultValue={selectedCliente.cpf}
                    className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold ${textColor} mb-2`}>Status</label>
                  <select
                    defaultValue={selectedCliente.status}
                    className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Bloqueado">Bloqueado</option>
                    <option value="Aguardando">Aguardando</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-semibold ${textColor} mb-2`}>Saldo (somente leitura)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={`R$ ${selectedCliente.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                      disabled
                      className={`flex-1 px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textSecondary} cursor-not-allowed`}
                    />
                    <button
                      onClick={() => {
                        setShowModal('details');
                        setDetailsTab('carteira');
                      }}
                      className="px-4 py-3 bg-[#00FF88]/10 border border-[#00FF88]/30 text-[#00FF88] rounded-lg hover:bg-[#00FF88]/20 transition-all"
                    >
                      Carteira
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowModal(null)}
                  className={`flex-1 px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} hover:bg-[#2A2A2A] transition-all`}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-gradient-to-r from-[#00FF88] to-[#0066FF] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Adicionar Saldo */}
      {showModal === 'addBalance' && selectedCliente && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${bgColor} border ${borderColor} rounded-xl p-6 w-full max-w-md`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${textColor}`}>Adicionar Saldo</h3>
              <button
                onClick={() => {
                  setShowModal('details');
                  setDetailsTab('carteira');
                  setBalanceAmount('');
                  setBalanceReason('');
                }}
                className={textSecondary}
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-semibold ${textColor} mb-2`}>Cliente</label>
                <p className={`text-lg ${textColor}`}>{selectedCliente.nome}</p>
              </div>

              <div>
                <label className={`block text-sm font-semibold ${textColor} mb-2`}>Saldo Atual</label>
                <p className={`text-2xl font-bold text-[#00FF88]`}>
                  R$ {selectedCliente.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div>
                <label className={`block text-sm font-semibold ${textColor} mb-2`}>Valor a Adicionar</label>
                <input
                  type="number"
                  value={balanceAmount}
                  onChange={(e) => setBalanceAmount(e.target.value)}
                  className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold ${textColor} mb-2`}>Motivo (opcional)</label>
                <textarea
                  value={balanceReason}
                  onChange={(e) => setBalanceReason(e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                  placeholder="Descreva o motivo do ajuste..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowModal('details');
                    setDetailsTab('carteira');
                    setBalanceAmount('');
                    setBalanceReason('');
                  }}
                  className={`flex-1 px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} hover:bg-[#2A2A2A] transition-all`}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddBalance}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Descontar Saldo */}
      {showModal === 'removeBalance' && selectedCliente && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${bgColor} border ${borderColor} rounded-xl p-6 w-full max-w-md`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${textColor}`}>Descontar Saldo</h3>
              <button
                onClick={() => {
                  setShowModal('details');
                  setDetailsTab('carteira');
                  setBalanceAmount('');
                  setBalanceReason('');
                }}
                className={textSecondary}
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-semibold ${textColor} mb-2`}>Cliente</label>
                <p className={`text-lg ${textColor}`}>{selectedCliente.nome}</p>
              </div>

              <div>
                <label className={`block text-sm font-semibold ${textColor} mb-2`}>Saldo Atual</label>
                <p className={`text-2xl font-bold text-[#00FF88]`}>
                  R$ {selectedCliente.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div>
                <label className={`block text-sm font-semibold ${textColor} mb-2`}>Valor a Descontar</label>
                <input
                  type="number"
                  value={balanceAmount}
                  onChange={(e) => setBalanceAmount(e.target.value)}
                  className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  max={selectedCliente.saldo}
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold ${textColor} mb-2`}>Motivo (opcional)</label>
                <textarea
                  value={balanceReason}
                  onChange={(e) => setBalanceReason(e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                  placeholder="Descreva o motivo do desconto..."
                />
              </div>

              <div className={`${bgColor} border-2 border-orange-500/50 rounded-lg p-4 flex items-start gap-3`}>
                <AlertCircle className="text-orange-500 flex-shrink-0" size={20} />
                <p className={`text-sm ${textSecondary}`}>
                  Esta ação irá descontar o valor do saldo do cliente. Certifique-se de que o valor está correto.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowModal('details');
                    setDetailsTab('carteira');
                    setBalanceAmount('');
                    setBalanceReason('');
                  }}
                  className={`flex-1 px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} hover:bg-[#2A2A2A] transition-all`}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRemoveBalance}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <Minus size={20} />
                  Descontar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
