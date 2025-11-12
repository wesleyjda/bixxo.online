'use client';

import { useState } from 'react';
import {
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Search,
  Filter,
  Eye,
  RefreshCw,
  Edit,
  X,
  Save,
  Download,
  Copy,
  FileText,
  User,
  Calendar,
  CreditCard,
  BarChart3,
  PieChart,
  TrendingDown,
  Zap
} from 'lucide-react';

type Tab = 'todos' | 'depositos' | 'saques' | 'estatisticas';
type ModalType = 'details' | 'edit' | null;
type DetailsTab = 'geral' | 'log';

interface Pedido {
  id: number;
  cliente: {
    id: number;
    nome: string;
    email: string;
    telefone: string;
  };
  tipo: 'Depósito' | 'Saque' | 'Ajuste';
  valor: number;
  gateway: 'OpenPix' | 'Bynet' | 'Cactos' | 'Manual';
  dataCriacao: string;
  dataPagamento?: string;
  status: 'Pendente' | 'Pago' | 'Cancelado' | 'Expirado' | 'Em processamento' | 'Erro';
  chavePix?: string;
  comprovante?: string;
  observacao?: string;
}

interface LogAtualizacao {
  id: number;
  data: string;
  usuario: string;
  acao: string;
  statusAnterior: string;
  statusNovo: string;
}

export default function PedidosPage() {
  const [activeTab, setActiveTab] = useState<Tab>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState<ModalType>(null);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [detailsTab, setDetailsTab] = useState<DetailsTab>('geral');
  const [selectedPedidos, setSelectedPedidos] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filtros avançados
  const [filtroId, setFiltroId] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string>('all');
  const [filtroGateway, setFiltroGateway] = useState<string>('all');
  const [filtroStatus, setFiltroStatus] = useState<string>('all');
  const [filtroDataInicio, setFiltroDataInicio] = useState('');
  const [filtroDataFim, setFiltroDataFim] = useState('');

  const bgColor = 'bg-[#1A1A1A]';
  const borderColor = 'border-[#2A2A2A]';
  const textColor = 'text-white';
  const textSecondary = 'text-gray-400';
  const hoverBg = 'hover:bg-[#2A2A2A]';

  // Dados mockados
  const [pedidos, setPedidos] = useState<Pedido[]>([
    {
      id: 1001,
      cliente: {
        id: 1,
        nome: 'João Silva Santos',
        email: 'joao.silva@email.com',
        telefone: '+55 11 98765-4321'
      },
      tipo: 'Depósito',
      valor: 500.00,
      gateway: 'OpenPix',
      dataCriacao: '16/01/2024 10:30',
      dataPagamento: '16/01/2024 10:35',
      status: 'Pago',
      chavePix: 'joao.silva@email.com',
      comprovante: 'https://example.com/comprovante1.pdf'
    },
    {
      id: 1002,
      cliente: {
        id: 2,
        nome: 'Maria Oliveira Costa',
        email: 'maria.oliveira@email.com',
        telefone: '+55 11 97654-3210'
      },
      tipo: 'Saque',
      valor: 200.00,
      gateway: 'Bynet',
      dataCriacao: '16/01/2024 09:15',
      status: 'Em processamento',
      chavePix: 'maria.oliveira@email.com'
    },
    {
      id: 1003,
      cliente: {
        id: 3,
        nome: 'Pedro Henrique Souza',
        email: 'pedro.souza@email.com',
        telefone: '+55 11 96543-2109'
      },
      tipo: 'Depósito',
      valor: 1000.00,
      gateway: 'Cactos',
      dataCriacao: '15/01/2024 18:45',
      status: 'Pendente',
      chavePix: '11965432109'
    },
    {
      id: 1004,
      cliente: {
        id: 4,
        nome: 'Ana Paula Ferreira',
        email: 'ana.ferreira@email.com',
        telefone: '+55 11 95432-1098'
      },
      tipo: 'Saque',
      valor: 350.00,
      gateway: 'OpenPix',
      dataCriacao: '15/01/2024 14:20',
      status: 'Cancelado',
      chavePix: 'ana.ferreira@email.com',
      observacao: 'Cancelado a pedido do cliente'
    },
    {
      id: 1005,
      cliente: {
        id: 5,
        nome: 'Carlos Eduardo Lima',
        email: 'carlos.lima@email.com',
        telefone: '+55 11 94321-0987'
      },
      tipo: 'Ajuste',
      valor: 100.00,
      gateway: 'Manual',
      dataCriacao: '14/01/2024 11:30',
      dataPagamento: '14/01/2024 11:30',
      status: 'Pago',
      observacao: 'Ajuste manual - bônus de boas-vindas'
    },
    {
      id: 1006,
      cliente: {
        id: 1,
        nome: 'João Silva Santos',
        email: 'joao.silva@email.com',
        telefone: '+55 11 98765-4321'
      },
      tipo: 'Depósito',
      valor: 250.00,
      gateway: 'OpenPix',
      dataCriacao: '14/01/2024 08:15',
      status: 'Expirado',
      chavePix: 'joao.silva@email.com'
    },
    {
      id: 1007,
      cliente: {
        id: 2,
        nome: 'Maria Oliveira Costa',
        email: 'maria.oliveira@email.com',
        telefone: '+55 11 97654-3210'
      },
      tipo: 'Depósito',
      valor: 750.00,
      gateway: 'Bynet',
      dataCriacao: '13/01/2024 16:40',
      status: 'Erro',
      chavePix: 'maria.oliveira@email.com',
      observacao: 'Erro na comunicação com o gateway'
    }
  ]);

  const logsAtualizacao: LogAtualizacao[] = [
    {
      id: 1,
      data: '16/01/2024 10:35',
      usuario: 'Admin Sistema',
      acao: 'Atualização automática via webhook',
      statusAnterior: 'Pendente',
      statusNovo: 'Pago'
    },
    {
      id: 2,
      data: '16/01/2024 10:30',
      usuario: 'João Silva Santos',
      acao: 'Pedido criado',
      statusAnterior: '-',
      statusNovo: 'Pendente'
    }
  ];

  // Estatísticas
  const stats = {
    total: pedidos.length,
    pendentes: pedidos.filter(p => p.status === 'Pendente').length,
    pagos: pedidos.filter(p => p.status === 'Pago').length,
    processamento: pedidos.filter(p => p.status === 'Em processamento').length,
    volumeTotal: pedidos.reduce((acc, p) => acc + p.valor, 0)
  };

  // Filtrar pedidos
  const filteredPedidos = pedidos.filter(pedido => {
    const matchesTab = 
      activeTab === 'todos' ||
      (activeTab === 'depositos' && pedido.tipo === 'Depósito') ||
      (activeTab === 'saques' && pedido.tipo === 'Saque');
    
    const matchesSearch = 
      pedido.id.toString().includes(searchTerm) ||
      pedido.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.valor.toString().includes(searchTerm);
    
    const matchesId = !filtroId || pedido.id.toString().includes(filtroId);
    const matchesCliente = !filtroCliente || 
      pedido.cliente.nome.toLowerCase().includes(filtroCliente.toLowerCase()) ||
      pedido.cliente.email.toLowerCase().includes(filtroCliente.toLowerCase());
    const matchesTipo = filtroTipo === 'all' || pedido.tipo === filtroTipo;
    const matchesGateway = filtroGateway === 'all' || pedido.gateway === filtroGateway;
    const matchesStatus = filtroStatus === 'all' || pedido.status === filtroStatus;
    
    return matchesTab && matchesSearch && matchesId && matchesCliente && matchesTipo && matchesGateway && matchesStatus;
  });

  const tabs = [
    { id: 'todos' as Tab, label: 'Todos os Pedidos', icon: <DollarSign size={20} /> },
    { id: 'depositos' as Tab, label: 'Depósitos', icon: <TrendingUp size={20} /> },
    { id: 'saques' as Tab, label: 'Saques', icon: <TrendingDown size={20} /> },
    { id: 'estatisticas' as Tab, label: 'Estatísticas', icon: <BarChart3 size={20} /> }
  ];

  const detailsTabs = [
    { id: 'geral' as DetailsTab, label: 'Informações Gerais', icon: <FileText size={18} /> },
    { id: 'log' as DetailsTab, label: 'Log de Atualizações', icon: <Clock size={18} /> }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendente':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'Pago':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'Cancelado':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'Expirado':
        return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
      case 'Em processamento':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'Erro':
        return 'bg-purple-500/20 text-purple-500 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  const handleSyncStatus = (id: number) => {
    alert(`Sincronizando status do pedido #${id} com o gateway...`);
    // Aqui seria feita a chamada à API do gateway
  };

  const handleSyncAll = () => {
    const pendentes = pedidos.filter(p => p.status === 'Pendente' || p.status === 'Em processamento');
    alert(`Sincronizando ${pendentes.length} pedido(s) pendente(s)...`);
  };

  const handleCopyPix = (chavePix?: string) => {
    if (chavePix) {
      navigator.clipboard.writeText(chavePix);
      alert('Chave PIX copiada!');
    }
  };

  const handleToggleSelect = (id: number) => {
    setSelectedPedidos(prev =>
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedPedidos.length === filteredPedidos.length) {
      setSelectedPedidos([]);
    } else {
      setSelectedPedidos(filteredPedidos.map(p => p.id));
    }
  };

  const handleBulkAction = (action: 'pago' | 'cancelar' | 'export' | 'delete') => {
    if (selectedPedidos.length === 0) {
      alert('Selecione pelo menos um pedido.');
      return;
    }

    switch (action) {
      case 'pago':
        setPedidos(pedidos.map(p =>
          selectedPedidos.includes(p.id) ? { ...p, status: 'Pago', dataPagamento: new Date().toLocaleString('pt-BR') } : p
        ));
        alert(`${selectedPedidos.length} pedido(s) marcado(s) como pago!`);
        setSelectedPedidos([]);
        break;
      case 'cancelar':
        setPedidos(pedidos.map(p =>
          selectedPedidos.includes(p.id) ? { ...p, status: 'Cancelado' } : p
        ));
        alert(`${selectedPedidos.length} pedido(s) cancelado(s)!`);
        setSelectedPedidos([]);
        break;
      case 'export':
        alert(`Exportando ${selectedPedidos.length} pedido(s) para CSV...`);
        break;
      case 'delete':
        if (confirm(`Tem certeza que deseja excluir ${selectedPedidos.length} pedido(s)?`)) {
          setPedidos(pedidos.filter(p => !selectedPedidos.includes(p.id)));
          alert(`${selectedPedidos.length} pedido(s) excluído(s)!`);
          setSelectedPedidos([]);
        }
        break;
    }
  };

  const openDetailsModal = (pedido: Pedido) => {
    setSelectedPedido(pedido);
    setDetailsTab('geral');
    setShowModal('details');
  };

  const openEditModal = (pedido: Pedido) => {
    setSelectedPedido(pedido);
    setShowModal('edit');
  };

  const handleSaveEdit = () => {
    if (!selectedPedido) return;
    alert('Pedido atualizado com sucesso!');
    setShowModal(null);
  };

  const limparFiltros = () => {
    setFiltroId('');
    setFiltroCliente('');
    setFiltroTipo('all');
    setFiltroGateway('all');
    setFiltroStatus('all');
    setFiltroDataInicio('');
    setFiltroDataFim('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${textColor}`}>Gestão de Pedidos</h1>
          <p className={textSecondary}>Acompanhe e gerencie depósitos, saques e transações financeiras</p>
        </div>
        <button
          onClick={handleSyncAll}
          className="px-6 py-3 bg-gradient-to-r from-[#00FF88] to-[#0066FF] text-white rounded-lg font-semibold hover:opacity-90 transition-all flex items-center gap-2"
        >
          <RefreshCw size={20} />
          Sincronizar Pendentes
        </button>
      </div>

      {/* Cards Superiores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className={`${bgColor} border ${borderColor} rounded-xl p-4 hover:shadow-lg transition-all duration-300`}>
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mb-3">
            <DollarSign className="text-blue-500" size={24} />
          </div>
          <p className={`text-xs ${textSecondary} mb-1`}>Total de Pedidos</p>
          <p className={`text-2xl font-bold ${textColor}`}>{stats.total}</p>
        </div>

        <div className={`${bgColor} border ${borderColor} rounded-xl p-4 hover:shadow-lg transition-all duration-300`}>
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 flex items-center justify-center mb-3">
            <Clock className="text-yellow-500" size={24} />
          </div>
          <p className={`text-xs ${textSecondary} mb-1`}>Pedidos Pendentes</p>
          <p className={`text-2xl font-bold ${textColor}`}>{stats.pendentes}</p>
        </div>

        <div className={`${bgColor} border ${borderColor} rounded-xl p-4 hover:shadow-lg transition-all duration-300`}>
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center mb-3">
            <CheckCircle className="text-green-500" size={24} />
          </div>
          <p className={`text-xs ${textSecondary} mb-1`}>Pagamentos Confirmados</p>
          <p className={`text-2xl font-bold ${textColor}`}>{stats.pagos}</p>
        </div>

        <div className={`${bgColor} border ${borderColor} rounded-xl p-4 hover:shadow-lg transition-all duration-300`}>
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center mb-3">
            <AlertCircle className="text-purple-500" size={24} />
          </div>
          <p className={`text-xs ${textSecondary} mb-1`}>Em Processamento</p>
          <p className={`text-2xl font-bold ${textColor}`}>{stats.processamento}</p>
        </div>

        <div className={`${bgColor} border ${borderColor} rounded-xl p-4 hover:shadow-lg transition-all duration-300`}>
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00FF88]/20 to-[#0066FF]/20 flex items-center justify-center mb-3">
            <TrendingUp className="text-[#00FF88]" size={24} />
          </div>
          <p className={`text-xs ${textSecondary} mb-1`}>Volume Total</p>
          <p className={`text-2xl font-bold ${textColor}`}>R$ {stats.volumeTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
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
          {activeTab === 'estatisticas' ? (
            // Aba de Estatísticas
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfico: Volume de Depósitos x Saques */}
                <div className={`${bgColor} border ${borderColor} rounded-xl p-6`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                      <BarChart3 className="text-blue-500" size={20} />
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold ${textColor}`}>Volume de Depósitos x Saques</h3>
                      <p className={`text-sm ${textSecondary}`}>Comparativo de transações</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={textColor}>Depósitos</span>
                        <span className="text-green-500 font-semibold">
                          R$ {pedidos.filter(p => p.tipo === 'Depósito').reduce((acc, p) => acc + p.valor, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="w-full h-3 bg-[#2A2A2A] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-green-600" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={textColor}>Saques</span>
                        <span className="text-red-500 font-semibold">
                          R$ {pedidos.filter(p => p.tipo === 'Saque').reduce((acc, p) => acc + p.valor, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="w-full h-3 bg-[#2A2A2A] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-red-500 to-red-600" style={{ width: '35%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gráfico: Valor por Gateway */}
                <div className={`${bgColor} border ${borderColor} rounded-xl p-6`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                      <PieChart className="text-purple-500" size={20} />
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold ${textColor}`}>Valor Movimentado por Gateway</h3>
                      <p className={`text-sm ${textSecondary}`}>Distribuição por plataforma</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {['OpenPix', 'Bynet', 'Cactos', 'Manual'].map((gateway, index) => {
                      const valor = pedidos.filter(p => p.gateway === gateway).reduce((acc, p) => acc + p.valor, 0);
                      const percentual = (valor / stats.volumeTotal) * 100;
                      const colors = ['from-blue-500 to-blue-600', 'from-purple-500 to-purple-600', 'from-pink-500 to-pink-600', 'from-gray-500 to-gray-600'];
                      return (
                        <div key={gateway}>
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-sm ${textColor}`}>{gateway}</span>
                            <span className={`text-sm ${textSecondary}`}>
                              R$ {valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({percentual.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full h-2 bg-[#2A2A2A] rounded-full overflow-hidden">
                            <div className={`h-full bg-gradient-to-r ${colors[index]}`} style={{ width: `${percentual}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Evolução Diária */}
              <div className={`${bgColor} border ${borderColor} rounded-xl p-6`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00FF88]/20 to-[#0066FF]/20 flex items-center justify-center">
                    <TrendingUp className="text-[#00FF88]" size={20} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${textColor}`}>Evolução Diária do Volume Financeiro</h3>
                    <p className={`text-sm ${textSecondary}`}>Últimos 7 dias</p>
                  </div>
                </div>
                <div className="flex items-end justify-between gap-2 h-48">
                  {[2500, 3200, 2800, 4100, 3600, 4500, 3900].map((valor, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-gradient-to-t from-[#00FF88] to-[#0066FF] rounded-t-lg transition-all hover:opacity-80" style={{ height: `${(valor / 5000) * 100}%` }}></div>
                      <span className={`text-xs ${textSecondary}`}>{10 + index}/01</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Abas de Pedidos
            <>
              {/* Filtros e Busca */}
              <div className="space-y-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${textSecondary}`} size={20} />
                    <input
                      type="text"
                      placeholder="Buscar por ID, cliente ou valor..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                    />
                  </div>
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
                        <label className={`block text-sm font-semibold ${textColor} mb-2`}>ID do Pedido</label>
                        <input
                          type="text"
                          value={filtroId}
                          onChange={(e) => setFiltroId(e.target.value)}
                          className={`w-full px-4 py-2 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                          placeholder="Digite o ID"
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold ${textColor} mb-2`}>Cliente</label>
                        <input
                          type="text"
                          value={filtroCliente}
                          onChange={(e) => setFiltroCliente(e.target.value)}
                          className={`w-full px-4 py-2 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                          placeholder="Nome ou e-mail"
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold ${textColor} mb-2`}>Tipo de Pedido</label>
                        <select
                          value={filtroTipo}
                          onChange={(e) => setFiltroTipo(e.target.value)}
                          className={`w-full px-4 py-2 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                        >
                          <option value="all">Todos</option>
                          <option value="Depósito">Depósito</option>
                          <option value="Saque">Saque</option>
                          <option value="Ajuste">Ajuste Manual</option>
                        </select>
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold ${textColor} mb-2`}>Gateway</label>
                        <select
                          value={filtroGateway}
                          onChange={(e) => setFiltroGateway(e.target.value)}
                          className={`w-full px-4 py-2 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                        >
                          <option value="all">Todos</option>
                          <option value="OpenPix">OpenPix</option>
                          <option value="Bynet">Bynet</option>
                          <option value="Cactos">Cactos</option>
                          <option value="Manual">Manual</option>
                        </select>
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold ${textColor} mb-2`}>Status</label>
                        <select
                          value={filtroStatus}
                          onChange={(e) => setFiltroStatus(e.target.value)}
                          className={`w-full px-4 py-2 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                        >
                          <option value="all">Todos</option>
                          <option value="Pendente">Pendente</option>
                          <option value="Pago">Pago</option>
                          <option value="Expirado">Expirado</option>
                          <option value="Cancelado">Cancelado</option>
                          <option value="Erro">Erro</option>
                          <option value="Em processamento">Em processamento</option>
                        </select>
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
                    <div className="flex gap-3">
                      <button
                        onClick={limparFiltros}
                        className={`px-4 py-2 ${bgColor} border ${borderColor} rounded-lg ${textColor} hover:bg-[#2A2A2A] transition-all`}
                      >
                        Limpar Filtros
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Ações em Massa */}
              {selectedPedidos.length > 0 && (
                <div className={`${bgColor} border-2 border-[#00FF88] rounded-lg p-4 mb-6 flex items-center justify-between`}>
                  <p className={`font-semibold ${textColor}`}>
                    {selectedPedidos.length} pedido(s) selecionado(s)
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBulkAction('pago')}
                      className="px-4 py-2 bg-green-500/20 border border-green-500/50 text-green-500 rounded-lg hover:bg-green-500/30 transition-all"
                    >
                      Marcar como Pago
                    </button>
                    <button
                      onClick={() => handleBulkAction('cancelar')}
                      className="px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500/30 transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleBulkAction('export')}
                      className={`px-4 py-2 ${bgColor} border ${borderColor} rounded-lg ${textColor} hover:bg-[#2A2A2A] transition-all flex items-center gap-2`}
                    >
                      <Download size={16} />
                      Exportar CSV
                    </button>
                    <button
                      onClick={() => handleBulkAction('delete')}
                      className="px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500/30 transition-all"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              )}

              {/* Tabela de Pedidos */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${borderColor}`}>
                      <th className={`text-left py-3 px-4`}>
                        <input
                          type="checkbox"
                          checked={selectedPedidos.length === filteredPedidos.length && filteredPedidos.length > 0}
                          onChange={handleSelectAll}
                          className="w-5 h-5 rounded border-gray-600 text-[#00FF88] focus:ring-[#00FF88]"
                        />
                      </th>
                      <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>ID</th>
                      <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Cliente</th>
                      <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Tipo</th>
                      <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Valor</th>
                      <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Gateway</th>
                      <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Data Criação</th>
                      <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Status</th>
                      <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Data Pagamento</th>
                      <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPedidos.map((pedido) => (
                      <tr key={pedido.id} className={`border-b ${borderColor} ${hoverBg}`}>
                        <td className={`py-3 px-4`}>
                          <input
                            type="checkbox"
                            checked={selectedPedidos.includes(pedido.id)}
                            onChange={() => handleToggleSelect(pedido.id)}
                            className="w-5 h-5 rounded border-gray-600 text-[#00FF88] focus:ring-[#00FF88]"
                          />
                        </td>
                        <td className={`py-3 px-4 text-sm ${textColor} font-semibold`}>#{pedido.id}</td>
                        <td className={`py-3 px-4 text-sm ${textColor}`}>{pedido.cliente.nome}</td>
                        <td className={`py-3 px-4 text-sm`}>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            pedido.tipo === 'Depósito' ? 'bg-green-500/20 text-green-500' :
                            pedido.tipo === 'Saque' ? 'bg-red-500/20 text-red-500' :
                            'bg-blue-500/20 text-blue-500'
                          }`}>
                            {pedido.tipo}
                          </span>
                        </td>
                        <td className={`py-3 px-4 text-sm ${textColor} font-semibold`}>
                          R$ {pedido.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className={`py-3 px-4 text-sm ${textSecondary}`}>{pedido.gateway}</td>
                        <td className={`py-3 px-4 text-sm ${textSecondary}`}>{pedido.dataCriacao}</td>
                        <td className={`py-3 px-4 text-sm`}>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(pedido.status)}`}>
                            {pedido.status}
                          </span>
                        </td>
                        <td className={`py-3 px-4 text-sm ${textSecondary}`}>{pedido.dataPagamento || '-'}</td>
                        <td className={`py-3 px-4 text-sm`}>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openDetailsModal(pedido)}
                              className="p-2 hover:bg-blue-500/20 rounded-lg transition-all"
                              title="Visualizar detalhes"
                            >
                              <Eye className="text-blue-500" size={16} />
                            </button>
                            <button
                              onClick={() => handleSyncStatus(pedido.id)}
                              className="p-2 hover:bg-purple-500/20 rounded-lg transition-all"
                              title="Sincronizar status"
                            >
                              <RefreshCw className="text-purple-500" size={16} />
                            </button>
                            <button
                              onClick={() => openEditModal(pedido)}
                              className="p-2 hover:bg-green-500/20 rounded-lg transition-all"
                              title="Editar pedido"
                            >
                              <Edit className="text-green-500" size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredPedidos.length === 0 && (
                <div className="text-center py-12">
                  <DollarSign className={`mx-auto mb-4 ${textSecondary}`} size={48} />
                  <p className={`text-lg ${textColor} mb-2`}>Nenhum pedido encontrado</p>
                  <p className={textSecondary}>Tente ajustar os filtros de busca</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal: Detalhes do Pedido */}
      {showModal === 'details' && selectedPedido && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className={`${bgColor} border ${borderColor} rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto`}>
            <div className={`sticky top-0 ${bgColor} border-b ${borderColor} p-6 flex items-center justify-between z-10`}>
              <div>
                <h3 className={`text-xl font-bold ${textColor}`}>Detalhes do Pedido</h3>
                <p className={textSecondary}>#{selectedPedido.id}</p>
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
              {/* Aba: Informações Gerais */}
              {detailsTab === 'geral' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-semibold ${textSecondary} mb-1`}>ID Interno</label>
                      <p className={`text-lg ${textColor} font-semibold`}>#{selectedPedido.id}</p>
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold ${textSecondary} mb-1`}>Cliente</label>
                      <p className={`text-lg ${textColor}`}>{selectedPedido.cliente.nome}</p>
                      <p className={`text-sm ${textSecondary}`}>{selectedPedido.cliente.email}</p>
                      <p className={`text-sm ${textSecondary}`}>{selectedPedido.cliente.telefone}</p>
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold ${textSecondary} mb-1`}>Tipo</label>
                      <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                        selectedPedido.tipo === 'Depósito' ? 'bg-green-500/20 text-green-500' :
                        selectedPedido.tipo === 'Saque' ? 'bg-red-500/20 text-red-500' :
                        'bg-blue-500/20 text-blue-500'
                      }`}>
                        {selectedPedido.tipo}
                      </span>
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold ${textSecondary} mb-1`}>Valor da Operação</label>
                      <p className={`text-2xl font-bold ${textColor}`}>
                        R$ {selectedPedido.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold ${textSecondary} mb-1`}>Gateway Utilizado</label>
                      <p className={`text-lg ${textColor}`}>{selectedPedido.gateway}</p>
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold ${textSecondary} mb-1`}>Data de Criação</label>
                      <p className={`text-lg ${textColor}`}>{selectedPedido.dataCriacao}</p>
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold ${textSecondary} mb-1`}>Status Atual</label>
                      <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(selectedPedido.status)}`}>
                        {selectedPedido.status}
                      </span>
                    </div>
                    {selectedPedido.chavePix && (
                      <div>
                        <label className={`block text-sm font-semibold ${textSecondary} mb-1`}>Chave PIX</label>
                        <div className="flex items-center gap-2">
                          <p className={`text-lg ${textColor}`}>{selectedPedido.chavePix}</p>
                          <button
                            onClick={() => handleCopyPix(selectedPedido.chavePix)}
                            className="p-2 hover:bg-blue-500/20 rounded-lg transition-all"
                            title="Copiar chave PIX"
                          >
                            <Copy className="text-blue-500" size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                    {selectedPedido.observacao && (
                      <div className="md:col-span-2">
                        <label className={`block text-sm font-semibold ${textSecondary} mb-1`}>Observação</label>
                        <p className={`text-lg ${textColor}`}>{selectedPedido.observacao}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => handleSyncStatus(selectedPedido.id)}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={20} />
                      Sincronizar com Gateway
                    </button>
                    {selectedPedido.comprovante && (
                      <button
                        onClick={() => window.open(selectedPedido.comprovante, '_blank')}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                      >
                        <FileText size={20} />
                        Ver Comprovante
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Aba: Log de Atualizações */}
              {detailsTab === 'log' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-lg font-bold ${textColor}`}>Histórico de Atualizações</h4>
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
                          <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Usuário</th>
                          <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Ação</th>
                          <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logsAtualizacao.map((log) => (
                          <tr key={log.id} className={`border-b ${borderColor} ${hoverBg}`}>
                            <td className={`py-3 px-4 text-sm ${textSecondary}`}>{log.data}</td>
                            <td className={`py-3 px-4 text-sm ${textColor}`}>{log.usuario}</td>
                            <td className={`py-3 px-4 text-sm ${textColor}`}>{log.acao}</td>
                            <td className={`py-3 px-4 text-sm ${textSecondary}`}>
                              {log.statusAnterior !== '-' && (
                                <span>{log.statusAnterior} → {log.statusNovo}</span>
                              )}
                              {log.statusAnterior === '-' && log.statusNovo}
                            </td>
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

      {/* Modal: Editar Pedido */}
      {showModal === 'edit' && selectedPedido && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${bgColor} border ${borderColor} rounded-xl p-6 w-full max-w-2xl`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${textColor}`}>Editar Pedido</h3>
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
                  <label className={`block text-sm font-semibold ${textColor} mb-2`}>Tipo</label>
                  <select
                    defaultValue={selectedPedido.tipo}
                    className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                  >
                    <option value="Depósito">Depósito</option>
                    <option value="Saque">Saque</option>
                    <option value="Ajuste">Ajuste Manual</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-semibold ${textColor} mb-2`}>Valor</label>
                  <input
                    type="number"
                    defaultValue={selectedPedido.valor}
                    className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                    step="0.01"
                    min="0"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold ${textColor} mb-2`}>Gateway</label>
                  <select
                    defaultValue={selectedPedido.gateway}
                    className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                  >
                    <option value="OpenPix">OpenPix</option>
                    <option value="Bynet">Bynet</option>
                    <option value="Cactos">Cactos</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-semibold ${textColor} mb-2`}>Status</label>
                  <select
                    defaultValue={selectedPedido.status}
                    className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="Pago">Pago</option>
                    <option value="Cancelado">Cancelado</option>
                    <option value="Expirado">Expirado</option>
                    <option value="Em processamento">Em processamento</option>
                    <option value="Erro">Erro</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className={`block text-sm font-semibold ${textColor} mb-2`}>Observação Administrativa</label>
                  <textarea
                    defaultValue={selectedPedido.observacao}
                    rows={3}
                    className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                    placeholder="Adicione uma observação..."
                  />
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
    </div>
  );
}
