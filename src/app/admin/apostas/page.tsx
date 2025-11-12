"use client";

import { useState, useEffect } from "react";
import {
  Dice5,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Trophy,
  XCircle,
  Search,
  Filter,
  Eye,
  Ban,
  CheckCircle,
  User,
  Calendar,
  Clock,
  AlertCircle,
  BarChart3,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

type BetStatus = "aguardando" | "ganhou" | "perdeu" | "cancelada";
type BetType = "grupo" | "dezenas" | "centena" | "milhar" | "PT" | "PTV";

interface Bet {
  id: string;
  jogador: {
    nome: string;
    id: string;
  };
  tipo: BetType;
  numeros: string[];
  valorApostado: number;
  possivelRetorno: number;
  resultado?: string;
  status: BetStatus;
  dataHora: string;
  cotacao?: number;
}

export default function ApostasPage() {
  const [theme] = useState<"light" | "dark">("dark");
  const [activeTab, setActiveTab] = useState<"todas" | "pagamentos">("todas");
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterDate, setFilterDate] = useState("");
  const [filterMinValue, setFilterMinValue] = useState("");
  const [filterMaxValue, setFilterMaxValue] = useState("");

  // Modals
  const [betDetailModal, setBetDetailModal] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [selectedBet, setSelectedBet] = useState<Bet | null>(null);

  // Auto-refresh a cada 30 segundos
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        console.log("Auto-refresh: Atualizando apostas...");
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Dados mockados
  const stats = {
    totalApostasHoje: 247,
    totalApostado: 18450.0,
    apostasVencedoras: 89,
    apostasPerdedoras: 142,
    totalPagoPremios: 12350.0,
    lucroDia: 6100.0,
    variacaoApostas: 12.5,
    variacaoApostado: 8.3,
    variacaoVencedoras: -3.2,
    variacaoPerdedoras: 15.1,
    variacaoPremios: -5.4,
    variacaoLucro: 18.7,
  };

  const bets: Bet[] = [
    {
      id: "BET001",
      jogador: { nome: "João Silva", id: "USR123" },
      tipo: "grupo",
      numeros: ["12", "23", "34"],
      valorApostado: 50.0,
      possivelRetorno: 500.0,
      resultado: "23",
      status: "ganhou",
      dataHora: "10/01/2024 14:30",
      cotacao: 10.0,
    },
    {
      id: "BET002",
      jogador: { nome: "Maria Santos", id: "USR124" },
      tipo: "dezenas",
      numeros: ["45", "67"],
      valorApostado: 100.0,
      possivelRetorno: 800.0,
      resultado: "89",
      status: "perdeu",
      dataHora: "10/01/2024 15:20",
      cotacao: 8.0,
    },
    {
      id: "BET003",
      jogador: { nome: "Pedro Costa", id: "USR125" },
      tipo: "milhar",
      numeros: ["1234"],
      valorApostado: 25.0,
      possivelRetorno: 2500.0,
      resultado: "-",
      status: "aguardando",
      dataHora: "10/01/2024 16:45",
      cotacao: 100.0,
    },
    {
      id: "BET004",
      jogador: { nome: "Ana Lima", id: "USR126" },
      tipo: "PT",
      numeros: ["78", "89", "90"],
      valorApostado: 75.0,
      possivelRetorno: 600.0,
      resultado: "78",
      status: "ganhou",
      dataHora: "10/01/2024 17:10",
      cotacao: 8.0,
    },
    {
      id: "BET005",
      jogador: { nome: "Carlos Souza", id: "USR127" },
      tipo: "centena",
      numeros: ["456"],
      valorApostado: 30.0,
      possivelRetorno: 300.0,
      resultado: "123",
      status: "perdeu",
      dataHora: "10/01/2024 18:00",
      cotacao: 10.0,
    },
    {
      id: "BET006",
      jogador: { nome: "Juliana Alves", id: "USR128" },
      tipo: "PTV",
      numeros: ["12", "34", "56", "78"],
      valorApostado: 150.0,
      possivelRetorno: 1200.0,
      resultado: "-",
      status: "aguardando",
      dataHora: "10/01/2024 18:30",
      cotacao: 8.0,
    },
  ];

  const pendingPayments = bets.filter(
    (bet) => bet.status === "ganhou" && !bet.resultado
  );

  // Theme colors
  const bgColor = theme === "dark" ? "bg-[#1A1A1A]" : "bg-white";
  const borderColor = theme === "dark" ? "border-[#2A2A2A]" : "border-gray-200";
  const textColor = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const inputBg = theme === "dark" ? "bg-[#0F0F0F]" : "bg-gray-50";
  const hoverBg = theme === "dark" ? "hover:bg-[#2A2A2A]" : "hover:bg-gray-50";

  // Handlers
  const handleViewDetails = (bet: Bet) => {
    setSelectedBet(bet);
    setBetDetailModal(true);
  };

  const handleForceResult = (id: string) => {
    const result = prompt("Digite o resultado manual:");
    if (result) {
      alert(`Resultado "${result}" aplicado à aposta ${id}`);
    }
  };

  const handleCancelBet = (id: string) => {
    const justification = prompt("Digite a justificativa para cancelamento:");
    if (justification) {
      alert(`Aposta ${id} cancelada. Motivo: ${justification}`);
    }
  };

  const handlePayPrize = (id: string) => {
    if (confirm("Confirmar pagamento do prêmio?")) {
      alert(`Prêmio da aposta ${id} pago com sucesso!`);
    }
  };

  const handlePayAllPending = () => {
    if (
      confirm(
        `Confirmar pagamento de ${pendingPayments.length} apostas pendentes?`
      )
    ) {
      alert("Todos os prêmios pendentes foram pagos!");
    }
  };

  const handleViewPlayerHistory = (playerId: string) => {
    alert(`Redirecionando para histórico do jogador ${playerId}...`);
  };

  // Status badge
  const getStatusBadge = (status: BetStatus) => {
    const styles = {
      aguardando: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      ganhou: "bg-green-500/20 text-green-400 border-green-500/30",
      perdeu: "bg-red-500/20 text-red-400 border-red-500/30",
      cancelada: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    };
    const labels = {
      aguardando: "Aguardando",
      ganhou: "Ganhou",
      perdeu: "Perdeu",
      cancelada: "Cancelada",
    };
    const icons = {
      aguardando: <Clock className="w-3 h-3" />,
      ganhou: <Trophy className="w-3 h-3" />,
      perdeu: <XCircle className="w-3 h-3" />,
      cancelada: <Ban className="w-3 h-3" />,
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 w-fit ${styles[status]}`}
        title={`Status: ${labels[status]}`}
      >
        {icons[status]}
        {labels[status]}
      </span>
    );
  };

  const getBetTypeLabel = (type: BetType) => {
    const labels = {
      grupo: "Grupo",
      dezenas: "Dezenas",
      centena: "Centena",
      milhar: "Milhar",
      PT: "PT",
      PTV: "PTV",
    };
    return labels[type];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={`text-3xl font-bold ${textColor} flex items-center gap-3`}
          >
            <Dice5 className="w-8 h-8 text-purple-500" />
            Gestão de Apostas
          </h1>
          <p className={textSecondary}>
            Controle, auditoria e visualização de apostas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 text-green-500 focus:ring-green-500"
            />
            <span className={`text-sm ${textSecondary}`}>
              Auto-refresh (30s)
            </span>
          </label>
          <button
            onClick={() => alert("Atualizando apostas...")}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            <RefreshCw size={18} />
            Atualizar
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Total de Apostas Hoje */}
        <div
          className={`${bgColor} rounded-xl p-6 border ${borderColor} shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center`}
            >
              <Dice5 className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className={`text-sm font-medium ${textSecondary} mb-1`}>
            Total de Apostas Hoje
          </h3>
          <p className={`text-2xl font-bold ${textColor}`}>
            {stats.totalApostasHoje}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-4 h-4 text-green-400" />
            <span className="text-xs text-green-400">
              +{stats.variacaoApostas}% vs ontem
            </span>
          </div>
        </div>

        {/* Total Apostado */}
        <div
          className={`${bgColor} rounded-xl p-6 border ${borderColor} shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center`}
            >
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className={`text-sm font-medium ${textSecondary} mb-1`}>
            Total Apostado (R$)
          </h3>
          <p className={`text-2xl font-bold ${textColor}`}>
            R${" "}
            {stats.totalApostado.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-4 h-4 text-green-400" />
            <span className="text-xs text-green-400">
              +{stats.variacaoApostado}% vs ontem
            </span>
          </div>
        </div>

        {/* Apostas Vencedoras */}
        <div
          className={`${bgColor} rounded-xl p-6 border ${borderColor} shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center`}
            >
              <Trophy className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className={`text-sm font-medium ${textSecondary} mb-1`}>
            Apostas Vencedoras
          </h3>
          <p className={`text-2xl font-bold ${textColor}`}>
            {stats.apostasVencedoras}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowDownRight className="w-4 h-4 text-red-400" />
            <span className="text-xs text-red-400">
              {stats.variacaoVencedoras}% vs ontem
            </span>
          </div>
        </div>

        {/* Apostas Perdedoras */}
        <div
          className={`${bgColor} rounded-xl p-6 border ${borderColor} shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center`}
            >
              <XCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className={`text-sm font-medium ${textSecondary} mb-1`}>
            Apostas Perdedoras
          </h3>
          <p className={`text-2xl font-bold ${textColor}`}>
            {stats.apostasPerdedoras}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-4 h-4 text-green-400" />
            <span className="text-xs text-green-400">
              +{stats.variacaoPerdedoras}% vs ontem
            </span>
          </div>
        </div>

        {/* Total Pago em Prêmios */}
        <div
          className={`${bgColor} rounded-xl p-6 border ${borderColor} shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center`}
            >
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className={`text-sm font-medium ${textSecondary} mb-1`}>
            Total Pago em Prêmios
          </h3>
          <p className={`text-2xl font-bold ${textColor}`}>
            R${" "}
            {stats.totalPagoPremios.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowDownRight className="w-4 h-4 text-red-400" />
            <span className="text-xs text-red-400">
              {stats.variacaoPremios}% vs ontem
            </span>
          </div>
        </div>

        {/* Lucro / Prejuízo do Dia */}
        <div
          className={`${bgColor} rounded-xl p-6 border ${borderColor} shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center`}
            >
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className={`text-sm font-medium ${textSecondary} mb-1`}>
            Lucro / Prejuízo do Dia
          </h3>
          <p
            className={`text-2xl font-bold ${
              stats.lucroDia >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            R${" "}
            {stats.lucroDia.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-4 h-4 text-green-400" />
            <span className="text-xs text-green-400">
              +{stats.variacaoLucro}% vs ontem
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        className={`${bgColor} rounded-2xl shadow-lg border ${borderColor} overflow-hidden`}
      >
        {/* Tab Headers */}
        <div
          className={`flex border-b ${borderColor} ${
            theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"
          }`}
        >
          {[
            { id: "todas", label: "Todas as Apostas", icon: Dice5 },
            { id: "pagamentos", label: "Pagamentos Pendentes", icon: Trophy },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "todas" | "pagamentos")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-all relative ${
                activeTab === tab.id
                  ? `${textColor} ${bgColor}`
                  : `${textSecondary} ${hoverBg}`
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {/* Aba: Todas as Apostas */}
          {activeTab === "todas" && (
            <div className="space-y-6">
              {/* Filtros e Busca */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="relative md:col-span-2">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Buscar por nome ou ID da aposta..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors`}
                  />
                </div>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className={`px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                >
                  <option value="all">Todos os Status</option>
                  <option value="aguardando">Aguardando</option>
                  <option value="ganhou">Ganhou</option>
                  <option value="perdeu">Perdeu</option>
                  <option value="cancelada">Cancelada</option>
                </select>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className={`px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                >
                  <option value="all">Todos os Tipos</option>
                  <option value="grupo">Grupo</option>
                  <option value="dezenas">Dezenas</option>
                  <option value="centena">Centena</option>
                  <option value="milhar">Milhar</option>
                  <option value="PT">PT</option>
                  <option value="PTV">PTV</option>
                </select>

                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className={`px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                />

                <button
                  onClick={() => setReportModal(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500/20 text-blue-400 font-semibold rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  <BarChart3 size={18} />
                  Relatórios
                </button>
              </div>

              {/* Filtros de Valor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium ${textSecondary} mb-2`}
                  >
                    Valor Mínimo (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={filterMinValue}
                    onChange={(e) => setFilterMinValue(e.target.value)}
                    className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${textSecondary} mb-2`}
                  >
                    Valor Máximo (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={filterMaxValue}
                    onChange={(e) => setFilterMaxValue(e.target.value)}
                    className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                  />
                </div>
              </div>

              {/* Tabela */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr
                      className={`border-b ${borderColor} ${
                        theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"
                      }`}
                    >
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        ID
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Jogador
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Tipo
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Números
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Valor Apostado
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Possível Retorno
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Resultado
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Status
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Data/Hora
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${borderColor}`}>
                    {bets.map((bet) => (
                      <tr
                        key={bet.id}
                        className={`${hoverBg} transition-colors ${
                          bet.status === "ganhou"
                            ? "bg-green-500/5"
                            : bet.status === "perdeu"
                            ? "bg-red-500/5"
                            : ""
                        }`}
                      >
                        <td className={`px-4 py-4 text-sm ${textColor}`}>
                          {bet.id}
                        </td>
                        <td className={`px-4 py-4 text-sm`}>
                          <div>
                            <p className={`font-semibold ${textColor}`}>
                              {bet.jogador.nome}
                            </p>
                            <p className={`text-xs ${textSecondary}`}>
                              ID: {bet.jogador.id}
                            </p>
                          </div>
                        </td>
                        <td className={`px-4 py-4 text-sm ${textColor}`}>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                            {getBetTypeLabel(bet.tipo)}
                          </span>
                        </td>
                        <td className={`px-4 py-4 text-sm ${textColor}`}>
                          <div className="flex flex-wrap gap-1">
                            {bet.numeros.map((num, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-xs font-mono"
                              >
                                {num}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td
                          className={`px-4 py-4 text-sm font-semibold text-yellow-400`}
                        >
                          R$ {bet.valorApostado.toFixed(2)}
                        </td>
                        <td
                          className={`px-4 py-4 text-sm font-semibold text-green-400`}
                        >
                          R$ {bet.possivelRetorno.toFixed(2)}
                        </td>
                        <td className={`px-4 py-4 text-sm ${textColor}`}>
                          {bet.resultado && bet.resultado !== "-" ? (
                            <span className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">
                              {bet.resultado}
                            </span>
                          ) : (
                            <span className={textSecondary}>-</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          {getStatusBadge(bet.status)}
                        </td>
                        <td className={`px-4 py-4 text-sm ${textSecondary}`}>
                          {bet.dataHora}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewDetails(bet)}
                              className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                              title="Ver Detalhes"
                            >
                              <Eye size={16} />
                            </button>
                            {bet.status === "aguardando" && (
                              <>
                                <button
                                  onClick={() => handleForceResult(bet.id)}
                                  className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
                                  title="Forçar Resultado"
                                >
                                  <CheckCircle size={16} />
                                </button>
                                <button
                                  onClick={() => handleCancelBet(bet.id)}
                                  className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                  title="Cancelar"
                                >
                                  <Ban size={16} />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() =>
                                handleViewPlayerHistory(bet.jogador.id)
                              }
                              className="p-1.5 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors"
                              title="Histórico do Jogador"
                            >
                              <User size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Aba: Pagamentos Pendentes */}
          {activeTab === "pagamentos" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${textColor}`}>
                  Apostas Premiadas Pendentes de Pagamento
                </h3>
                <button
                  onClick={handlePayAllPending}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  <CheckCircle size={18} />
                  Pagar Todas as Pendentes ({pendingPayments.length})
                </button>
              </div>

              {pendingPayments.length === 0 ? (
                <div
                  className={`${inputBg} border ${borderColor} rounded-xl p-12 text-center`}
                >
                  <Trophy
                    className={`w-16 h-16 ${textSecondary} mx-auto mb-4`}
                  />
                  <p className={`text-lg font-semibold ${textColor} mb-2`}>
                    Nenhum pagamento pendente
                  </p>
                  <p className={`text-sm ${textSecondary}`}>
                    Todas as apostas premiadas foram pagas.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr
                        className={`border-b ${borderColor} ${
                          theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"
                        }`}
                      >
                        <th
                          className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                        >
                          ID
                        </th>
                        <th
                          className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                        >
                          Jogador
                        </th>
                        <th
                          className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                        >
                          Tipo
                        </th>
                        <th
                          className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                        >
                          Valor do Prêmio
                        </th>
                        <th
                          className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                        >
                          Data/Hora
                        </th>
                        <th
                          className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                        >
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${borderColor}`}>
                      {pendingPayments.map((bet) => (
                        <tr
                          key={bet.id}
                          className={`${hoverBg} transition-colors bg-green-500/5`}
                        >
                          <td className={`px-4 py-4 text-sm ${textColor}`}>
                            {bet.id}
                          </td>
                          <td className={`px-4 py-4 text-sm`}>
                            <div>
                              <p className={`font-semibold ${textColor}`}>
                                {bet.jogador.nome}
                              </p>
                              <p className={`text-xs ${textSecondary}`}>
                                ID: {bet.jogador.id}
                              </p>
                            </div>
                          </td>
                          <td className={`px-4 py-4 text-sm ${textColor}`}>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                              {getBetTypeLabel(bet.tipo)}
                            </span>
                          </td>
                          <td
                            className={`px-4 py-4 text-sm font-bold text-green-400`}
                          >
                            R$ {bet.possivelRetorno.toFixed(2)}
                          </td>
                          <td className={`px-4 py-4 text-sm ${textSecondary}`}>
                            {bet.dataHora}
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleViewDetails(bet)}
                                className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                                title="Ver Detalhes"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => handlePayPrize(bet.id)}
                                className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors font-semibold text-xs"
                              >
                                Pagar Prêmio
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Log de Pagamentos Realizados */}
              <div className="mt-8">
                <h3 className={`text-lg font-semibold ${textColor} mb-4`}>
                  Log de Pagamentos Realizados
                </h3>
                <div
                  className={`${inputBg} border ${borderColor} rounded-xl p-6`}
                >
                  <div className="space-y-3">
                    {[
                      {
                        id: "BET001",
                        jogador: "João Silva",
                        valor: 500.0,
                        data: "10/01/2024 14:35",
                      },
                      {
                        id: "BET004",
                        jogador: "Ana Lima",
                        valor: 600.0,
                        data: "10/01/2024 17:15",
                      },
                    ].map((log, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          theme === "dark" ? "bg-gray-800/50" : "bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <div>
                            <p className={`text-sm font-semibold ${textColor}`}>
                              {log.jogador} - {log.id}
                            </p>
                            <p className={`text-xs ${textSecondary}`}>
                              {log.data}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-bold text-green-400">
                          R$ {log.valor.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Detalhes da Aposta */}
      {betDetailModal && selectedBet && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className={`${bgColor} rounded-2xl shadow-2xl max-w-3xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto`}
          >
            <div className="flex items-center justify-between">
              <h3 className={`text-xl font-bold ${textColor}`}>
                Detalhes Completos da Aposta
              </h3>
              <button
                onClick={() => setBetDetailModal(false)}
                className={`p-2 rounded-lg ${hoverBg} transition-colors`}
              >
                <XCircle className={textSecondary} size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Informações Principais */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm ${textSecondary} mb-1`}>
                    ID da Aposta
                  </p>
                  <p className={`text-base font-semibold ${textColor}`}>
                    {selectedBet.id}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${textSecondary} mb-1`}>Status</p>
                  {getStatusBadge(selectedBet.status)}
                </div>
                <div>
                  <p className={`text-sm ${textSecondary} mb-1`}>Jogador</p>
                  <p className={`text-base font-semibold ${textColor}`}>
                    {selectedBet.jogador.nome}
                  </p>
                  <p className={`text-xs ${textSecondary}`}>
                    ID: {selectedBet.jogador.id}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${textSecondary} mb-1`}>
                    Tipo de Aposta
                  </p>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-400">
                    {getBetTypeLabel(selectedBet.tipo)}
                  </span>
                </div>
              </div>

              {/* Números e Combinações */}
              <div>
                <p className={`text-sm ${textSecondary} mb-2`}>
                  Números Escolhidos
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedBet.numeros.map((num, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-lg font-mono font-bold"
                    >
                      {num}
                    </span>
                  ))}
                </div>
              </div>

              {/* Valores */}
              <div className="grid grid-cols-3 gap-4">
                <div
                  className={`${inputBg} border ${borderColor} rounded-lg p-4`}
                >
                  <p className={`text-sm ${textSecondary} mb-1`}>
                    Valor Apostado
                  </p>
                  <p className="text-2xl font-bold text-yellow-400">
                    R$ {selectedBet.valorApostado.toFixed(2)}
                  </p>
                </div>
                <div
                  className={`${inputBg} border ${borderColor} rounded-lg p-4`}
                >
                  <p className={`text-sm ${textSecondary} mb-1`}>
                    Possível Retorno
                  </p>
                  <p className="text-2xl font-bold text-green-400">
                    R$ {selectedBet.possivelRetorno.toFixed(2)}
                  </p>
                </div>
                <div
                  className={`${inputBg} border ${borderColor} rounded-lg p-4`}
                >
                  <p className={`text-sm ${textSecondary} mb-1`}>
                    Cotação Usada
                  </p>
                  <p className="text-2xl font-bold text-cyan-400">
                    {selectedBet.cotacao}x
                  </p>
                </div>
              </div>

              {/* Resultado */}
              <div>
                <p className={`text-sm ${textSecondary} mb-2`}>Resultado</p>
                <div
                  className={`${inputBg} border ${borderColor} rounded-lg p-4 text-center`}
                >
                  {selectedBet.resultado && selectedBet.resultado !== "-" ? (
                    <div>
                      <p className="text-4xl font-bold text-cyan-400 font-mono mb-2">
                        {selectedBet.resultado}
                      </p>
                      <p className={`text-sm ${textSecondary}`}>
                        Resultado do sorteio
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Clock
                        className={`w-12 h-12 ${textSecondary} mx-auto mb-2`}
                      />
                      <p className={`text-sm ${textSecondary}`}>
                        Aguardando resultado
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Data e Hora */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm ${textSecondary} mb-1`}>
                    Data e Hora da Aposta
                  </p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className={`text-base ${textColor}`}>
                      {selectedBet.dataHora}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-3 pt-4 border-t border-gray-700">
              <button
                onClick={() => setBetDetailModal(false)}
                className={`flex-1 px-4 py-2.5 ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                } ${textColor} font-semibold rounded-lg hover:opacity-90 transition-opacity`}
              >
                Fechar
              </button>
              {selectedBet.status === "aguardando" && (
                <>
                  <button
                    onClick={() => {
                      handleForceResult(selectedBet.id);
                      setBetDetailModal(false);
                    }}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Validar Resultado
                  </button>
                  <button
                    onClick={() => {
                      handleCancelBet(selectedBet.id);
                      setBetDetailModal(false);
                    }}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Cancelar Aposta
                  </button>
                </>
              )}
              {selectedBet.status === "ganhou" && (
                <button
                  onClick={() => {
                    handlePayPrize(selectedBet.id);
                    setBetDetailModal(false);
                  }}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  Pagar Prêmio
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Relatórios Rápidos */}
      {reportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className={`${bgColor} rounded-2xl shadow-2xl max-w-4xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto`}
          >
            <div className="flex items-center justify-between">
              <h3 className={`text-xl font-bold ${textColor}`}>
                Relatórios Rápidos
              </h3>
              <button
                onClick={() => setReportModal(false)}
                className={`p-2 rounded-lg ${hoverBg} transition-colors`}
              >
                <XCircle className={textSecondary} size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Filtros de Período */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium ${textSecondary} mb-2`}
                  >
                    Data Inicial
                  </label>
                  <input
                    type="date"
                    className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${textSecondary} mb-2`}
                  >
                    Data Final
                  </label>
                  <input
                    type="date"
                    className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${textSecondary} mb-2`}
                  >
                    Tipo de Jogo
                  </label>
                  <select
                    className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                  >
                    <option value="all">Todos</option>
                    <option value="grupo">Grupo</option>
                    <option value="dezenas">Dezenas</option>
                    <option value="centena">Centena</option>
                    <option value="milhar">Milhar</option>
                    <option value="PT">PT</option>
                    <option value="PTV">PTV</option>
                  </select>
                </div>
              </div>

              {/* Cards de Relatório */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Total de Apostas por Período */}
                <div
                  className={`${inputBg} border ${borderColor} rounded-xl p-6`}
                >
                  <h4 className={`text-lg font-semibold ${textColor} mb-4`}>
                    Total de Apostas por Período
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={textSecondary}>Hoje</span>
                      <span className={`font-bold ${textColor}`}>247</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={textSecondary}>Esta Semana</span>
                      <span className={`font-bold ${textColor}`}>1,523</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={textSecondary}>Este Mês</span>
                      <span className={`font-bold ${textColor}`}>6,891</span>
                    </div>
                  </div>
                </div>

                {/* Lucro por Tipo de Jogo */}
                <div
                  className={`${inputBg} border ${borderColor} rounded-xl p-6`}
                >
                  <h4 className={`text-lg font-semibold ${textColor} mb-4`}>
                    Lucro por Tipo de Jogo
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={textSecondary}>Grupo</span>
                      <span className="font-bold text-green-400">
                        R$ 2,450.00
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={textSecondary}>Dezenas</span>
                      <span className="font-bold text-green-400">
                        R$ 1,890.00
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={textSecondary}>Milhar</span>
                      <span className="font-bold text-green-400">
                        R$ 1,760.00
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ranking de Jogadores Mais Ativos */}
                <div
                  className={`${inputBg} border ${borderColor} rounded-xl p-6`}
                >
                  <h4 className={`text-lg font-semibold ${textColor} mb-4`}>
                    Ranking de Jogadores Mais Ativos
                  </h4>
                  <div className="space-y-3">
                    {[
                      { nome: "João Silva", apostas: 45 },
                      { nome: "Maria Santos", apostas: 38 },
                      { nome: "Pedro Costa", apostas: 32 },
                    ].map((player, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              idx === 0
                                ? "bg-yellow-500/20 text-yellow-400"
                                : idx === 1
                                ? "bg-gray-500/20 text-gray-400"
                                : "bg-orange-500/20 text-orange-400"
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <span className={textColor}>{player.nome}</span>
                        </div>
                        <span className={`font-bold ${textColor}`}>
                          {player.apostas} apostas
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Percentual de Vitórias */}
                <div
                  className={`${inputBg} border ${borderColor} rounded-xl p-6`}
                >
                  <h4 className={`text-lg font-semibold ${textColor} mb-4`}>
                    Percentual de Vitórias
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={textSecondary}>Apostas Vencedoras</span>
                        <span className="font-bold text-green-400">36%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: "36%" }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={textSecondary}>Apostas Perdedoras</span>
                        <span className="font-bold text-red-400">57%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: "57%" }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={textSecondary}>Apostas Canceladas</span>
                        <span className="font-bold text-gray-400">7%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gray-500 h-2 rounded-full"
                          style={{ width: "7%" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botão de Exportar */}
              <div className="flex justify-end">
                <button
                  onClick={() => alert("Exportando relatório...")}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Download size={18} />
                  Exportar Relatório Completo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
