'use client';

import { useState } from 'react';
import {
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Eye,
  Send,
  X,
  Plus,
  Download,
  User,
  Calendar,
  Tag,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';

type Tab = 'tickets' | 'mensagens' | 'relatorios';
type ModalType = 'details' | 'novo' | null;
type Prioridade = 'Baixa' | 'Média' | 'Alta' | 'Urgente';
type Status = 'Aberto' | 'Em andamento' | 'Resolvido' | 'Encerrado';
type TipoTicket = 'Financeiro' | 'Técnico' | 'Conta' | 'Geral';

interface Ticket {
  id: number;
  cliente: {
    id: number;
    nome: string;
    email: string;
  };
  assunto: string;
  categoria: TipoTicket;
  prioridade: Prioridade;
  status: Status;
  dataAbertura: string;
  ultimaAtualizacao: string;
  mensagens: Mensagem[];
}

interface Mensagem {
  id: number;
  remetente: 'cliente' | 'equipe';
  nomeRemetente: string;
  conteudo: string;
  dataHora: string;
}

export default function SuportePage() {
  const [activeTab, setActiveTab] = useState<Tab>('tickets');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState<ModalType>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedTickets, setSelectedTickets] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [novaMensagem, setNovaMensagem] = useState('');

  // Filtros avançados
  const [filtroId, setFiltroId] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');
  const [filtroEmail, setFiltroEmail] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('all');
  const [filtroTipo, setFiltroTipo] = useState<string>('all');
  const [filtroDataInicio, setFiltroDataInicio] = useState('');
  const [filtroDataFim, setFiltroDataFim] = useState('');

  const bgColor = 'bg-[#1A1A1A]';
  const borderColor = 'border-[#2A2A2A]';
  const textColor = 'text-white';
  const textSecondary = 'text-gray-400';
  const hoverBg = 'hover:bg-[#2A2A2A]';

  // Dados mockados
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 2001,
      cliente: {
        id: 1,
        nome: 'João Silva Santos',
        email: 'joao.silva@email.com'
      },
      assunto: 'Problema com saque via PIX',
      categoria: 'Financeiro',
      prioridade: 'Alta',
      status: 'Aberto',
      dataAbertura: '16/01/2024 10:30',
      ultimaAtualizacao: '16/01/2024 10:30',
      mensagens: [
        {
          id: 1,
          remetente: 'cliente',
          nomeRemetente: 'João Silva Santos',
          conteudo: 'Olá, solicitei um saque de R$ 500,00 há 2 dias e ainda não recebi. Podem verificar?',
          dataHora: '16/01/2024 10:30'
        }
      ]
    },
    {
      id: 2002,
      cliente: {
        id: 2,
        nome: 'Maria Oliveira Costa',
        email: 'maria.oliveira@email.com'
      },
      assunto: 'Erro ao fazer login',
      categoria: 'Técnico',
      prioridade: 'Média',
      status: 'Em andamento',
      dataAbertura: '15/01/2024 14:20',
      ultimaAtualizacao: '16/01/2024 09:15',
      mensagens: [
        {
          id: 1,
          remetente: 'cliente',
          nomeRemetente: 'Maria Oliveira Costa',
          conteudo: 'Não consigo fazer login na minha conta. Aparece erro de senha incorreta.',
          dataHora: '15/01/2024 14:20'
        },
        {
          id: 2,
          remetente: 'equipe',
          nomeRemetente: 'Suporte Técnico',
          conteudo: 'Olá Maria! Vamos verificar sua conta. Você tentou recuperar a senha?',
          dataHora: '16/01/2024 09:15'
        }
      ]
    },
    {
      id: 2003,
      cliente: {
        id: 3,
        nome: 'Pedro Henrique Souza',
        email: 'pedro.souza@email.com'
      },
      assunto: 'Dúvida sobre bônus de boas-vindas',
      categoria: 'Geral',
      prioridade: 'Baixa',
      status: 'Resolvido',
      dataAbertura: '14/01/2024 11:30',
      ultimaAtualizacao: '15/01/2024 08:45',
      mensagens: [
        {
          id: 1,
          remetente: 'cliente',
          nomeRemetente: 'Pedro Henrique Souza',
          conteudo: 'Como funciona o bônus de boas-vindas? Preciso fazer algum depósito mínimo?',
          dataHora: '14/01/2024 11:30'
        },
        {
          id: 2,
          remetente: 'equipe',
          nomeRemetente: 'Atendimento',
          conteudo: 'Olá Pedro! O bônus é de 100% no primeiro depósito, mínimo de R$ 50,00. Quer mais informações?',
          dataHora: '14/01/2024 16:20'
        },
        {
          id: 3,
          remetente: 'cliente',
          nomeRemetente: 'Pedro Henrique Souza',
          conteudo: 'Perfeito, obrigado! Já entendi.',
          dataHora: '15/01/2024 08:45'
        }
      ]
    },
    {
      id: 2004,
      cliente: {
        id: 4,
        nome: 'Ana Paula Ferreira',
        email: 'ana.ferreira@email.com'
      },
      assunto: 'Conta bloqueada sem motivo',
      categoria: 'Conta',
      prioridade: 'Urgente',
      status: 'Em andamento',
      dataAbertura: '16/01/2024 08:15',
      ultimaAtualizacao: '16/01/2024 09:30',
      mensagens: [
        {
          id: 1,
          remetente: 'cliente',
          nomeRemetente: 'Ana Paula Ferreira',
          conteudo: 'Minha conta foi bloqueada do nada! Preciso de ajuda urgente!',
          dataHora: '16/01/2024 08:15'
        },
        {
          id: 2,
          remetente: 'equipe',
          nomeRemetente: 'Suporte',
          conteudo: 'Ana, vamos verificar o que aconteceu. Aguarde alguns minutos.',
          dataHora: '16/01/2024 09:30'
        }
      ]
    },
    {
      id: 2005,
      cliente: {
        id: 5,
        nome: 'Carlos Eduardo Lima',
        email: 'carlos.lima@email.com'
      },
      assunto: 'Depósito não creditado',
      categoria: 'Financeiro',
      prioridade: 'Alta',
      status: 'Aberto',
      dataAbertura: '16/01/2024 07:45',
      ultimaAtualizacao: '16/01/2024 07:45',
      mensagens: [
        {
          id: 1,
          remetente: 'cliente',
          nomeRemetente: 'Carlos Eduardo Lima',
          conteudo: 'Fiz um depósito de R$ 200,00 via PIX há 1 hora e não foi creditado na minha conta.',
          dataHora: '16/01/2024 07:45'
        }
      ]
    }
  ]);

  // Estatísticas
  const stats = {
    total: tickets.length,
    abertos: tickets.filter(t => t.status === 'Aberto').length,
    emAndamento: tickets.filter(t => t.status === 'Em andamento').length,
    resolvidos: tickets.filter(t => t.status === 'Resolvido').length,
    tempoMedioResposta: '2h 15min'
  };

  // Filtrar tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.id.toString().includes(searchTerm) ||
      ticket.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.assunto.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesId = !filtroId || ticket.id.toString().includes(filtroId);
    const matchesCliente = !filtroCliente || ticket.cliente.nome.toLowerCase().includes(filtroCliente.toLowerCase());
    const matchesEmail = !filtroEmail || ticket.cliente.email.toLowerCase().includes(filtroEmail.toLowerCase());
    const matchesStatus = filtroStatus === 'all' || ticket.status === filtroStatus;
    const matchesTipo = filtroTipo === 'all' || ticket.categoria === filtroTipo;
    
    return matchesSearch && matchesId && matchesCliente && matchesEmail && matchesStatus && matchesTipo;
  });

  const tabs = [
    { id: 'tickets' as Tab, label: 'Tickets', icon: <MessageSquare size={20} /> },
    { id: 'mensagens' as Tab, label: 'Mensagens Diretas', icon: <Send size={20} /> },
    { id: 'relatorios' as Tab, label: 'Relatórios', icon: <BarChart3 size={20} /> }
  ];

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'Aberto':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'Em andamento':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'Resolvido':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'Encerrado':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  const getPrioridadeColor = (prioridade: Prioridade) => {
    switch (prioridade) {
      case 'Baixa':
        return 'bg-gray-500/20 text-gray-500';
      case 'Média':
        return 'bg-blue-500/20 text-blue-500';
      case 'Alta':
        return 'bg-orange-500/20 text-orange-500';
      case 'Urgente':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  const handleToggleSelect = (id: number) => {
    setSelectedTickets(prev =>
      prev.includes(id) ? prev.filter(tId => tId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedTickets.length === filteredTickets.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(filteredTickets.map(t => t.id));
    }
  };

  const handleBulkAction = (action: 'resolver' | 'atribuir' | 'excluir') => {
    if (selectedTickets.length === 0) {
      alert('Selecione pelo menos um ticket.');
      return;
    }

    switch (action) {
      case 'resolver':
        setTickets(tickets.map(t =>
          selectedTickets.includes(t.id) ? { ...t, status: 'Resolvido' } : t
        ));
        alert(`${selectedTickets.length} ticket(s) marcado(s) como resolvido!`);
        setSelectedTickets([]);
        break;
      case 'atribuir':
        alert(`Atribuindo ${selectedTickets.length} ticket(s) a outro atendente...`);
        break;
      case 'excluir':
        if (confirm(`Tem certeza que deseja excluir ${selectedTickets.length} ticket(s)?`)) {
          setTickets(tickets.filter(t => !selectedTickets.includes(t.id)));
          alert(`${selectedTickets.length} ticket(s) excluído(s)!`);
          setSelectedTickets([]);
        }
        break;
    }
  };

  const handleEnviarMensagem = () => {
    if (!novaMensagem.trim() || !selectedTicket) return;

    const novaMensagemObj: Mensagem = {
      id: selectedTicket.mensagens.length + 1,
      remetente: 'equipe',
      nomeRemetente: 'Atendimento',
      conteudo: novaMensagem,
      dataHora: new Date().toLocaleString('pt-BR')
    };

    setTickets(tickets.map(t =>
      t.id === selectedTicket.id
        ? {
            ...t,
            mensagens: [...t.mensagens, novaMensagemObj],
            ultimaAtualizacao: novaMensagemObj.dataHora
          }
        : t
    ));

    setNovaMensagem('');
    alert('Mensagem enviada com sucesso!');
  };

  const handleMarcarResolvido = () => {
    if (!selectedTicket) return;

    setTickets(tickets.map(t =>
      t.id === selectedTicket.id ? { ...t, status: 'Resolvido' } : t
    ));

    alert('Ticket marcado como resolvido!');
    setShowModal(null);
  };

  const handleEncerrarTicket = () => {
    if (!selectedTicket) return;

    if (confirm('Tem certeza que deseja encerrar este ticket?')) {
      setTickets(tickets.map(t =>
        t.id === selectedTicket.id ? { ...t, status: 'Encerrado' } : t
      ));

      alert('Ticket encerrado!');
      setShowModal(null);
    }
  };

  const limparFiltros = () => {
    setFiltroId('');
    setFiltroCliente('');
    setFiltroEmail('');
    setFiltroStatus('all');
    setFiltroTipo('all');
    setFiltroDataInicio('');
    setFiltroDataFim('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${textColor}`}>Suporte e Atendimento</h1>
          <p className={textSecondary}>Gerencie tickets, mensagens e comunicações com clientes</p>
        </div>
        <button
          onClick={() => setShowModal('novo')}
          className="px-6 py-3 bg-gradient-to-r from-[#00FF88] to-[#0066FF] text-white rounded-lg font-semibold hover:opacity-90 transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Ticket
        </button>
      </div>

      {/* Cards Superiores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className={`${bgColor} border ${borderColor} rounded-xl p-4 hover:shadow-lg transition-all duration-300`}>
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mb-3">
            <MessageSquare className="text-blue-500" size={24} />
          </div>
          <p className={`text-xs ${textSecondary} mb-1`}>Total de Tickets</p>
          <p className={`text-2xl font-bold ${textColor}`}>{stats.total}</p>
        </div>

        <div className={`${bgColor} border ${borderColor} rounded-xl p-4 hover:shadow-lg transition-all duration-300`}>
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 flex items-center justify-center mb-3">
            <AlertCircle className="text-yellow-500" size={24} />
          </div>
          <p className={`text-xs ${textSecondary} mb-1`}>Abertos</p>
          <p className={`text-2xl font-bold ${textColor}`}>{stats.abertos}</p>
        </div>

        <div className={`${bgColor} border ${borderColor} rounded-xl p-4 hover:shadow-lg transition-all duration-300`}>
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center mb-3">
            <Clock className="text-purple-500" size={24} />
          </div>
          <p className={`text-xs ${textSecondary} mb-1`}>Em Andamento</p>
          <p className={`text-2xl font-bold ${textColor}`}>{stats.emAndamento}</p>
        </div>

        <div className={`${bgColor} border ${borderColor} rounded-xl p-4 hover:shadow-lg transition-all duration-300`}>
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center mb-3">
            <CheckCircle className="text-green-500" size={24} />
          </div>
          <p className={`text-xs ${textSecondary} mb-1`}>Resolvidos</p>
          <p className={`text-2xl font-bold ${textColor}`}>{stats.resolvidos}</p>
        </div>

        <div className={`${bgColor} border ${borderColor} rounded-xl p-4 hover:shadow-lg transition-all duration-300`}>
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00FF88]/20 to-[#0066FF]/20 flex items-center justify-center mb-3">
            <Zap className="text-[#00FF88]" size={24} />
          </div>
          <p className={`text-xs ${textSecondary} mb-1`}>Tempo Médio</p>
          <p className={`text-2xl font-bold ${textColor}`}>{stats.tempoMedioResposta}</p>
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
          {activeTab === 'tickets' && (
            <>
              {/* Filtros e Busca */}
              <div className="space-y-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${textSecondary}`} size={20} />
                    <input
                      type="text"
                      placeholder="Buscar por ID, cliente, e-mail ou assunto..."
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
                        <label className={`block text-sm font-semibold ${textColor} mb-2`}>ID do Ticket</label>
                        <input
                          type="text"
                          value={filtroId}
                          onChange={(e) => setFiltroId(e.target.value)}
                          className={`w-full px-4 py-2 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                          placeholder="Digite o ID"
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold ${textColor} mb-2`}>Nome do Cliente</label>
                        <input
                          type="text"
                          value={filtroCliente}
                          onChange={(e) => setFiltroCliente(e.target.value)}
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
                        <label className={`block text-sm font-semibold ${textColor} mb-2`}>Status</label>
                        <select
                          value={filtroStatus}
                          onChange={(e) => setFiltroStatus(e.target.value)}
                          className={`w-full px-4 py-2 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                        >
                          <option value="all">Todos</option>
                          <option value="Aberto">Aberto</option>
                          <option value="Em andamento">Em andamento</option>
                          <option value="Resolvido">Resolvido</option>
                          <option value="Encerrado">Encerrado</option>
                        </select>
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold ${textColor} mb-2`}>Tipo</label>
                        <select
                          value={filtroTipo}
                          onChange={(e) => setFiltroTipo(e.target.value)}
                          className={`w-full px-4 py-2 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                        >
                          <option value="all">Todos</option>
                          <option value="Financeiro">Financeiro</option>
                          <option value="Técnico">Técnico</option>
                          <option value="Conta">Conta</option>
                          <option value="Geral">Geral</option>
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
                    <button
                      onClick={limparFiltros}
                      className={`px-4 py-2 ${bgColor} border ${borderColor} rounded-lg ${textColor} hover:bg-[#2A2A2A] transition-all`}
                    >
                      Limpar Filtros
                    </button>
                  </div>
                )}
              </div>

              {/* Ações em Massa */}
              {selectedTickets.length > 0 && (
                <div className={`${bgColor} border-2 border-[#00FF88] rounded-lg p-4 mb-6 flex items-center justify-between`}>
                  <p className={`font-semibold ${textColor}`}>
                    {selectedTickets.length} ticket(s) selecionado(s)
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBulkAction('resolver')}
                      className="px-4 py-2 bg-green-500/20 border border-green-500/50 text-green-500 rounded-lg hover:bg-green-500/30 transition-all"
                    >
                      Marcar como Resolvido
                    </button>
                    <button
                      onClick={() => handleBulkAction('atribuir')}
                      className="px-4 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-500 rounded-lg hover:bg-blue-500/30 transition-all"
                    >
                      Atribuir
                    </button>
                    <button
                      onClick={() => handleBulkAction('excluir')}
                      className="px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500/30 transition-all"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              )}

              {/* Tabela de Tickets */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${borderColor}`}>
                      <th className={`text-left py-3 px-4`}>
                        <input
                          type="checkbox"
                          checked={selectedTickets.length === filteredTickets.length && filteredTickets.length > 0}
                          onChange={handleSelectAll}
                          className="w-5 h-5 rounded border-gray-600 text-[#00FF88] focus:ring-[#00FF88]"
                        />
                      </th>
                      <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>ID</th>
                      <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Cliente</th>
                      <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Assunto / Categoria</th>
                      <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Prioridade</th>
                      <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Status</th>
                      <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Data Abertura</th>
                      <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Última Atualização</th>
                      <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.map((ticket) => (
                      <tr key={ticket.id} className={`border-b ${borderColor} ${hoverBg}`}>
                        <td className={`py-3 px-4`}>
                          <input
                            type="checkbox"
                            checked={selectedTickets.includes(ticket.id)}
                            onChange={() => handleToggleSelect(ticket.id)}
                            className="w-5 h-5 rounded border-gray-600 text-[#00FF88] focus:ring-[#00FF88]"
                          />
                        </td>
                        <td className={`py-3 px-4 text-sm ${textColor} font-semibold`}>#{ticket.id}</td>
                        <td className={`py-3 px-4 text-sm ${textColor}`}>
                          <div>
                            <p className="font-medium">{ticket.cliente.nome}</p>
                            <p className={`text-xs ${textSecondary}`}>{ticket.cliente.email}</p>
                          </div>
                        </td>
                        <td className={`py-3 px-4 text-sm ${textColor}`}>
                          <div>
                            <p className="font-medium">{ticket.assunto}</p>
                            <p className={`text-xs ${textSecondary}`}>{ticket.categoria}</p>
                          </div>
                        </td>
                        <td className={`py-3 px-4 text-sm`}>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPrioridadeColor(ticket.prioridade)}`}>
                            {ticket.prioridade}
                          </span>
                        </td>
                        <td className={`py-3 px-4 text-sm`}>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className={`py-3 px-4 text-sm ${textSecondary}`}>{ticket.dataAbertura}</td>
                        <td className={`py-3 px-4 text-sm ${textSecondary}`}>{ticket.ultimaAtualizacao}</td>
                        <td className={`py-3 px-4 text-sm`}>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedTicket(ticket);
                                setShowModal('details');
                              }}
                              className="p-2 hover:bg-blue-500/20 rounded-lg transition-all"
                              title="Visualizar conversa"
                            >
                              <Eye className="text-blue-500" size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedTicket(ticket);
                                setShowModal('details');
                              }}
                              className="p-2 hover:bg-green-500/20 rounded-lg transition-all"
                              title="Responder"
                            >
                              <Send className="text-green-500" size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredTickets.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className={`mx-auto mb-4 ${textSecondary}`} size={48} />
                  <p className={`text-lg ${textColor} mb-2`}>Nenhum ticket encontrado</p>
                  <p className={textSecondary}>Tente ajustar os filtros de busca</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'mensagens' && (
            <div className="text-center py-12">
              <Send className={`mx-auto mb-4 ${textSecondary}`} size={48} />
              <p className={`text-lg ${textColor} mb-2`}>Mensagens Diretas</p>
              <p className={textSecondary}>Funcionalidade em desenvolvimento - Chat rápido com clientes</p>
            </div>
          )}

          {activeTab === 'relatorios' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tickets por Categoria */}
                <div className={`${bgColor} border ${borderColor} rounded-xl p-6`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                      <BarChart3 className="text-blue-500" size={20} />
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold ${textColor}`}>Volume de Tickets por Categoria</h3>
                      <p className={`text-sm ${textSecondary}`}>Distribuição por tipo</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {['Financeiro', 'Técnico', 'Conta', 'Geral'].map((categoria, index) => {
                      const count = tickets.filter(t => t.categoria === categoria).length;
                      const percentual = (count / tickets.length) * 100;
                      const colors = ['from-green-500 to-green-600', 'from-blue-500 to-blue-600', 'from-purple-500 to-purple-600', 'from-gray-500 to-gray-600'];
                      return (
                        <div key={categoria}>
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-sm ${textColor}`}>{categoria}</span>
                            <span className={`text-sm ${textSecondary}`}>
                              {count} tickets ({percentual.toFixed(1)}%)
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

                {/* Tempo Médio de Resposta */}
                <div className={`${bgColor} border ${borderColor} rounded-xl p-6`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00FF88]/20 to-[#0066FF]/20 flex items-center justify-center">
                      <Clock className="text-[#00FF88]" size={20} />
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold ${textColor}`}>Tempo Médio de Resposta</h3>
                      <p className={`text-sm ${textSecondary}`}>Por categoria</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className={`${bgColor} border ${borderColor} rounded-lg p-4`}>
                      <p className={`text-sm ${textSecondary} mb-1`}>Financeiro</p>
                      <p className={`text-2xl font-bold ${textColor}`}>1h 45min</p>
                    </div>
                    <div className={`${bgColor} border ${borderColor} rounded-lg p-4`}>
                      <p className={`text-sm ${textSecondary} mb-1`}>Técnico</p>
                      <p className={`text-2xl font-bold ${textColor}`}>2h 30min</p>
                    </div>
                    <div className={`${bgColor} border ${borderColor} rounded-lg p-4`}>
                      <p className={`text-sm ${textSecondary} mb-1`}>Geral</p>
                      <p className={`text-2xl font-bold ${textColor}`}>3h 15min</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gráfico de Linha: Tickets Abertos x Resolvidos */}
              <div className={`${bgColor} border ${borderColor} rounded-xl p-6`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center">
                    <TrendingUp className="text-green-500" size={20} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${textColor}`}>Tickets Abertos x Resolvidos</h3>
                    <p className={`text-sm ${textSecondary}`}>Últimos 7 dias</p>
                  </div>
                </div>
                <div className="flex items-end justify-between gap-2 h-48">
                  {[
                    { abertos: 12, resolvidos: 8 },
                    { abertos: 15, resolvidos: 10 },
                    { abertos: 10, resolvidos: 12 },
                    { abertos: 18, resolvidos: 14 },
                    { abertos: 14, resolvidos: 16 },
                    { abertos: 20, resolvidos: 15 },
                    { abertos: 16, resolvidos: 18 }
                  ].map((dia, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex gap-1">
                        <div
                          className="flex-1 bg-gradient-to-t from-yellow-500 to-yellow-600 rounded-t-lg"
                          style={{ height: `${(dia.abertos / 20) * 180}px` }}
                          title={`Abertos: ${dia.abertos}`}
                        ></div>
                        <div
                          className="flex-1 bg-gradient-to-t from-green-500 to-green-600 rounded-t-lg"
                          style={{ height: `${(dia.resolvidos / 20) * 180}px` }}
                          title={`Resolvidos: ${dia.resolvidos}`}
                        ></div>
                      </div>
                      <span className={`text-xs ${textSecondary}`}>{10 + index}/01</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className={`text-sm ${textSecondary}`}>Abertos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className={`text-sm ${textSecondary}`}>Resolvidos</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Detalhes e Conversa */}
      {showModal === 'details' && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className={`${bgColor} border ${borderColor} rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col`}>
            {/* Cabeçalho */}
            <div className={`${bgColor} border-b ${borderColor} p-6 flex items-center justify-between`}>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className={`text-xl font-bold ${textColor}`}>{selectedTicket.cliente.nome}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(selectedTicket.status)}`}>
                    {selectedTicket.status}
                  </span>
                </div>
                <p className={`text-sm ${textSecondary} mb-1`}>{selectedTicket.cliente.email}</p>
                <p className={`text-sm ${textColor} font-medium`}>{selectedTicket.assunto}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getPrioridadeColor(selectedTicket.prioridade)}`}>
                    {selectedTicket.prioridade}
                  </span>
                  <span className={`text-xs ${textSecondary}`}>#{selectedTicket.id}</span>
                </div>
              </div>
              <button
                onClick={() => setShowModal(null)}
                className={textSecondary}
              >
                <X size={24} />
              </button>
            </div>

            {/* Corpo: Histórico da Conversa */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {selectedTicket.mensagens.map((mensagem) => (
                <div
                  key={mensagem.id}
                  className={`flex ${mensagem.remetente === 'equipe' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${mensagem.remetente === 'equipe' ? 'bg-gradient-to-r from-[#00FF88]/20 to-[#0066FF]/20 border border-[#00FF88]/30' : `${bgColor} border ${borderColor}`} rounded-lg p-4`}>
                    <div className="flex items-center gap-2 mb-2">
                      <User size={16} className={mensagem.remetente === 'equipe' ? 'text-[#00FF88]' : textSecondary} />
                      <span className={`text-sm font-semibold ${textColor}`}>{mensagem.nomeRemetente}</span>
                      <span className={`text-xs ${textSecondary}`}>{mensagem.dataHora}</span>
                    </div>
                    <p className={`text-sm ${textColor}`}>{mensagem.conteudo}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Rodapé: Campo de Resposta */}
            <div className={`${bgColor} border-t ${borderColor} p-6`}>
              <div className="space-y-4">
                <textarea
                  value={novaMensagem}
                  onChange={(e) => setNovaMensagem(e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                  placeholder="Digite sua resposta..."
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleEnviarMensagem}
                    className="flex-1 bg-gradient-to-r from-[#00FF88] to-[#0066FF] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    <Send size={20} />
                    Enviar Resposta
                  </button>
                  <button
                    onClick={handleMarcarResolvido}
                    className="px-6 py-3 bg-green-500/20 border border-green-500/50 text-green-500 rounded-lg font-semibold hover:bg-green-500/30 transition-all"
                  >
                    Marcar como Resolvido
                  </button>
                  <button
                    onClick={handleEncerrarTicket}
                    className="px-6 py-3 bg-red-500/20 border border-red-500/50 text-red-500 rounded-lg font-semibold hover:bg-red-500/30 transition-all"
                  >
                    Encerrar Ticket
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Novo Ticket */}
      {showModal === 'novo' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${bgColor} border ${borderColor} rounded-xl p-6 w-full max-w-2xl`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${textColor}`}>Novo Ticket Manual</h3>
              <button
                onClick={() => setShowModal(null)}
                className={textSecondary}
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-semibold ${textColor} mb-2`}>Cliente</label>
                <input
                  type="text"
                  className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                  placeholder="Buscar por nome ou e-mail"
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold ${textColor} mb-2`}>Assunto</label>
                <input
                  type="text"
                  className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                  placeholder="Digite o assunto do ticket"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-semibold ${textColor} mb-2`}>Tipo</label>
                  <select
                    className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                  >
                    <option value="Financeiro">Financeiro</option>
                    <option value="Técnico">Técnico</option>
                    <option value="Conta">Conta</option>
                    <option value="Geral">Geral</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-semibold ${textColor} mb-2`}>Prioridade</label>
                  <select
                    className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                    <option value="Urgente">Urgente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold ${textColor} mb-2`}>Descrição Inicial</label>
                <textarea
                  rows={4}
                  className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                  placeholder="Descreva o problema ou solicitação..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowModal(null)}
                  className={`flex-1 px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} hover:bg-[#2A2A2A] transition-all`}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    alert('Ticket criado com sucesso!');
                    setShowModal(null);
                  }}
                  className="flex-1 bg-gradient-to-r from-[#00FF88] to-[#0066FF] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Criar Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
