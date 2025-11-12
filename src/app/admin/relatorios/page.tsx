"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Dice5,
  Gift,
  Calendar,
  Download,
  Filter,
  FileText,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Eye,
} from "lucide-react";

type ReportType = "apostas" | "financeiro" | "usuarios" | "campanhas";

export default function RelatoriosPage() {
  const [theme] = useState<"light" | "dark">("dark");
  const [activeTab, setActiveTab] = useState<
    "financeiro" | "apostas" | "usuarios" | "campanhas" | "personalizados"
  >("financeiro");
  const [mounted, setMounted] = useState(false);

  // Filtros
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [reportType, setReportType] = useState<string>("all");
  const [selectedGame, setSelectedGame] = useState<string>("all");

  // Dados mockados
  const stats = {
    totalApostas: 1247,
    totalPremios: 45320.5,
    volumeFinanceiro: 128450.0,
    lucroLiquido: 38200.0,
    usuariosAtivos: 342,
    variacaoApostas: 12.5,
    variacaoPremios: -5.4,
    variacaoVolume: 18.7,
    variacaoLucro: 22.3,
    variacaoUsuarios: 8.9,
  };

  // Theme colors
  const bgColor = theme === "dark" ? "bg-[#1A1A1A]" : "bg-white";
  const borderColor = theme === "dark" ? "border-[#2A2A2A]" : "border-gray-200";
  const textColor = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const inputBg = theme === "dark" ? "bg-[#0F0F0F]" : "bg-gray-50";
  const hoverBg = theme === "dark" ? "hover:bg-[#2A2A2A]" : "hover:bg-gray-50";

  // Função helper para formatação consistente de números
  const formatNumber = (num: number) => {
    return num.toLocaleString("pt-BR");
  };

  const formatCurrency = (num: number) => {
    return num.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Handlers
  const handleApplyFilters = () => {
    alert("Filtros aplicados! Atualizando relatórios...");
  };

  const handleExportCSV = () => {
    alert("Exportando dados em formato CSV...");
  };

  const handleExportPDF = () => {
    alert("Gerando PDF com logo e dados do sistema...");
  };

  // Fix hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={`text-3xl font-bold ${textColor} flex items-center gap-3`}
          >
            <BarChart3 className="w-8 h-8 text-purple-500" />
            Relatórios e Estatísticas
          </h1>
          <p className={textSecondary}>
            Dados consolidados de todo o sistema com gráficos interativos
          </p>
        </div>
        <button
          onClick={() => alert("Atualizando dados...")}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          <RefreshCw size={18} />
          Atualizar
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Total de Apostas */}
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
            Total de Apostas
          </h3>
          <p className={`text-2xl font-bold ${textColor}`} suppressHydrationWarning>
            {formatNumber(stats.totalApostas)}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-4 h-4 text-green-400" />
            <span className="text-xs text-green-400">
              +{stats.variacaoApostas}% vs período anterior
            </span>
          </div>
        </div>

        {/* Total de Prêmios Pagos */}
        <div
          className={`${bgColor} rounded-xl p-6 border ${borderColor} shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center`}
            >
              <Gift className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className={`text-sm font-medium ${textSecondary} mb-1`}>
            Total de Prêmios Pagos
          </h3>
          <p className={`text-2xl font-bold ${textColor}`} suppressHydrationWarning>
            R$ {formatCurrency(stats.totalPremios)}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowDownRight className="w-4 h-4 text-red-400" />
            <span className="text-xs text-red-400">
              {stats.variacaoPremios}% vs período anterior
            </span>
          </div>
        </div>

        {/* Volume Financeiro */}
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
            Volume Financeiro Total
          </h3>
          <p className={`text-2xl font-bold ${textColor}`} suppressHydrationWarning>
            R$ {formatCurrency(stats.volumeFinanceiro)}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-4 h-4 text-green-400" />
            <span className="text-xs text-green-400">
              +{stats.variacaoVolume}% vs período anterior
            </span>
          </div>
        </div>

        {/* Lucro Líquido */}
        <div
          className={`${bgColor} rounded-xl p-6 border ${borderColor} shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center`}
            >
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className={`text-sm font-medium ${textSecondary} mb-1`}>
            Lucro Líquido
          </h3>
          <p className={`text-2xl font-bold text-green-400`} suppressHydrationWarning>
            R$ {formatCurrency(stats.lucroLiquido)}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-4 h-4 text-green-400" />
            <span className="text-xs text-green-400">
              +{stats.variacaoLucro}% vs período anterior
            </span>
          </div>
        </div>

        {/* Usuários Ativos */}
        <div
          className={`${bgColor} rounded-xl p-6 border ${borderColor} shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center`}
            >
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className={`text-sm font-medium ${textSecondary} mb-1`}>
            Usuários Ativos
          </h3>
          <p className={`text-2xl font-bold ${textColor}`} suppressHydrationWarning>
            {formatNumber(stats.usuariosAtivos)}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-4 h-4 text-green-400" />
            <span className="text-xs text-green-400">
              +{stats.variacaoUsuarios}% vs período anterior
            </span>
          </div>
        </div>
      </div>

      {/* Filtros Globais */}
      <div
        className={`${bgColor} rounded-2xl shadow-lg border ${borderColor} p-6`}
      >
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-purple-500" />
          <h3 className={`text-lg font-semibold ${textColor}`}>
            Filtros Globais
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Data Inicial */}
          <div>
            <label
              className={`block text-sm font-medium ${textSecondary} mb-2`}
            >
              Data Inicial
            </label>
            <input
              type="date"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
              className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
            />
          </div>

          {/* Data Final */}
          <div>
            <label
              className={`block text-sm font-medium ${textSecondary} mb-2`}
            >
              Data Final
            </label>
            <input
              type="date"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
              className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
            />
          </div>

          {/* Tipo de Relatório */}
          <div>
            <label
              className={`block text-sm font-medium ${textSecondary} mb-2`}
            >
              Tipo de Relatório
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
            >
              <option value="all">Todos</option>
              <option value="apostas">Apostas</option>
              <option value="financeiro">Financeiro</option>
              <option value="usuarios">Usuários</option>
              <option value="campanhas">Campanhas</option>
            </select>
          </div>

          {/* Jogo Específico */}
          <div>
            <label
              className={`block text-sm font-medium ${textSecondary} mb-2`}
            >
              Jogo Específico
            </label>
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
            >
              <option value="all">Todos os Jogos</option>
              <option value="PT">Palpite Turbo (PT)</option>
              <option value="PTV">Palpite Turbo VIP (PTV)</option>
              <option value="DEZ">Dezenas da Sorte</option>
              <option value="CEN">Centena Federal</option>
            </select>
          </div>

          {/* Botões */}
          <div className="flex flex-col gap-2">
            <label
              className={`block text-sm font-medium ${textSecondary} mb-2`}
            >
              Ações
            </label>
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>

        {/* Botões de Exportação */}
        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-700">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-500/20 text-green-400 font-semibold rounded-lg hover:bg-green-500/30 transition-colors"
          >
            <Download size={18} />
            Exportar CSV
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-500/20 text-red-400 font-semibold rounded-lg hover:bg-red-500/30 transition-colors"
          >
            <FileText size={18} />
            Gerar PDF
          </button>
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
            { id: "financeiro", label: "Financeiro", icon: DollarSign },
            { id: "apostas", label: "Apostas", icon: Dice5 },
            { id: "usuarios", label: "Usuários", icon: Users },
            { id: "campanhas", label: "Campanhas", icon: Gift },
            { id: "personalizados", label: "Personalizados", icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(
                  tab.id as
                    | "financeiro"
                    | "apostas"
                    | "usuarios"
                    | "campanhas"
                    | "personalizados"
                )
              }
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
          {/* Aba: Financeiro */}
          {activeTab === "financeiro" && (
            <div className="space-y-6">
              <h3 className={`text-xl font-bold ${textColor} mb-4`}>
                Relatórios Financeiros
              </h3>

              {/* Cards de Resumo Financeiro */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div
                  className={`${inputBg} border ${borderColor} rounded-xl p-6`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    </div>
                    <h4 className={`text-sm font-medium ${textSecondary}`}>
                      Total de Depósitos
                    </h4>
                  </div>
                  <p className="text-2xl font-bold text-green-400">
                    R$ 85.450,00
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    +15.3% vs período anterior
                  </p>
                </div>

                <div
                  className={`${inputBg} border ${borderColor} rounded-xl p-6`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <ArrowDownRight className="w-5 h-5 text-red-400" />
                    </div>
                    <h4 className={`text-sm font-medium ${textSecondary}`}>
                      Total de Saques
                    </h4>
                  </div>
                  <p className="text-2xl font-bold text-red-400">
                    R$ 32.150,00
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    -8.2% vs período anterior
                  </p>
                </div>

                <div
                  className={`${inputBg} border ${borderColor} rounded-xl p-6`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-yellow-400" />
                    </div>
                    <h4 className={`text-sm font-medium ${textSecondary}`}>
                      Ajustes
                    </h4>
                  </div>
                  <p className="text-2xl font-bold text-yellow-400">
                    R$ 1.250,00
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    +2.1% vs período anterior
                  </p>
                </div>

                <div
                  className={`${inputBg} border ${borderColor} rounded-xl p-6`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-purple-400" />
                    </div>
                    <h4 className={`text-sm font-medium ${textSecondary}`}>
                      Despesas
                    </h4>
                  </div>
                  <p className="text-2xl font-bold text-purple-400">
                    R$ 8.900,00
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    +5.7% vs período anterior
                  </p>
                </div>
              </div>

              {/* Gráfico de Barras - Entradas x Saídas */}
              <div
                className={`${inputBg} border ${borderColor} rounded-xl p-6`}
              >
                <h4 className={`text-lg font-semibold ${textColor} mb-4`}>
                  Entradas x Saídas (Últimos 7 dias)
                </h4>
                <div className="h-64 flex items-end justify-between gap-2">
                  {[
                    { dia: "Seg", entrada: 12000, saida: 4500 },
                    { dia: "Ter", entrada: 15000, saida: 5200 },
                    { dia: "Qua", entrada: 11000, saida: 3800 },
                    { dia: "Qui", entrada: 18000, saida: 6100 },
                    { dia: "Sex", entrada: 16500, saida: 5900 },
                    { dia: "Sáb", entrada: 20000, saida: 7200 },
                    { dia: "Dom", entrada: 14500, saida: 4800 },
                  ].map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col gap-2">
                      <div className="flex gap-1 items-end h-48">
                        <div
                          className="flex-1 bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg"
                          style={{
                            height: `${(item.entrada / 20000) * 100}%`,
                          }}
                          title={`Entrada: R$ ${formatNumber(item.entrada)}`}
                        />
                        <div
                          className="flex-1 bg-gradient-to-t from-red-500 to-red-400 rounded-t-lg"
                          style={{ height: `${(item.saida / 20000) * 100}%` }}
                          title={`Saída: R$ ${formatNumber(item.saida)}`}
                        />
                      </div>
                      <p
                        className={`text-xs text-center font-medium ${textSecondary}`}
                      >
                        {item.dia}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-500" />
                    <span className={`text-sm ${textSecondary}`}>
                      Entradas
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-red-500" />
                    <span className={`text-sm ${textSecondary}`}>Saídas</span>
                  </div>
                </div>
              </div>

              {/* Distribuição por Gateway */}
              <div
                className={`${inputBg} border ${borderColor} rounded-xl p-6`}
              >
                <h4 className={`text-lg font-semibold ${textColor} mb-4`}>
                  Distribuição por Gateway
                </h4>
                <div className="space-y-4">
                  {[
                    { nome: "OpenPix", valor: 45200, percentual: 52.9 },
                    { nome: "Bynet", valor: 28300, percentual: 33.1 },
                    { nome: "Cactos", valor: 11950, percentual: 14.0 },
                  ].map((gateway, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-medium ${textColor}`}>
                          {gateway.nome}
                        </span>
                        <span className="text-sm font-bold text-green-400" suppressHydrationWarning>
                          R$ {formatNumber(gateway.valor)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full"
                          style={{ width: `${gateway.percentual}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {gateway.percentual}% do total
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tabela de Detalhamento Diário */}
              <div
                className={`${inputBg} border ${borderColor} rounded-xl p-6`}
              >
                <h4 className={`text-lg font-semibold ${textColor} mb-4`}>
                  Detalhamento Diário
                </h4>
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
                          Data
                        </th>
                        <th
                          className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                        >
                          Entradas
                        </th>
                        <th
                          className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                        >
                          Saídas
                        </th>
                        <th
                          className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                        >
                          Saldo Final
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${borderColor}`}>
                      {[
                        {
                          data: "10/01/2024",
                          entrada: 14500,
                          saida: 4800,
                          saldo: 9700,
                        },
                        {
                          data: "09/01/2024",
                          entrada: 20000,
                          saida: 7200,
                          saldo: 12800,
                        },
                        {
                          data: "08/01/2024",
                          entrada: 16500,
                          saida: 5900,
                          saldo: 10600,
                        },
                        {
                          data: "07/01/2024",
                          entrada: 18000,
                          saida: 6100,
                          saldo: 11900,
                        },
                        {
                          data: "06/01/2024",
                          entrada: 11000,
                          saida: 3800,
                          saldo: 7200,
                        },
                      ].map((row, idx) => (
                        <tr key={idx} className={`${hoverBg} transition-colors`}>
                          <td className={`px-4 py-4 text-sm ${textColor}`}>
                            {row.data}
                          </td>
                          <td className="px-4 py-4 text-sm font-semibold text-green-400" suppressHydrationWarning>
                            R$ {formatNumber(row.entrada)}
                          </td>
                          <td className="px-4 py-4 text-sm font-semibold text-red-400" suppressHydrationWarning>
                            R$ {formatNumber(row.saida)}
                          </td>
                          <td className="px-4 py-4 text-sm font-bold text-cyan-400" suppressHydrationWarning>
                            R$ {formatNumber(row.saldo)}
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
          {activeTab === "apostas" && (
            <div className="space-y-6">
              <h3 className={`text-xl font-bold ${textColor} mb-4`}>
                Relatórios de Apostas
              </h3>

              {/* Gráfico de Pizza - Total de Apostas por Jogo */}
              <div
                className={`${inputBg} border ${borderColor} rounded-xl p-6`}
              >
                <h4 className={`text-lg font-semibold ${textColor} mb-4`}>
                  Total de Apostas por Jogo
                </h4>
                <div className="flex items-center justify-center">
                  <div className="relative w-64 h-64">
                    <svg viewBox="0 0 100 100" className="transform -rotate-90">
                      {/* Palpite Turbo - 35% */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#8B5CF6"
                        strokeWidth="20"
                        strokeDasharray="87.96 251.33"
                        strokeDashoffset="0"
                      />
                      {/* Dezenas - 25% */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="20"
                        strokeDasharray="62.83 251.33"
                        strokeDashoffset="-87.96"
                      />
                      {/* Centena - 20% */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="20"
                        strokeDasharray="50.27 251.33"
                        strokeDashoffset="-150.79"
                      />
                      {/* Milhar - 15% */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="20"
                        strokeDasharray="37.70 251.33"
                        strokeDashoffset="-201.06"
                      />
                      {/* PTV - 5% */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="20"
                        strokeDasharray="12.57 251.33"
                        strokeDashoffset="-238.76"
                      />
                    </svg>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                  {[
                    { nome: "Palpite Turbo", cor: "bg-purple-500", valor: 35 },
                    { nome: "Dezenas", cor: "bg-blue-500", valor: 25 },
                    { nome: "Centena", cor: "bg-green-500", valor: 20 },
                    { nome: "Milhar", cor: "bg-yellow-500", valor: 15 },
                    { nome: "PTV", cor: "bg-red-500", valor: 5 },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded ${item.cor}`} />
                      <span className={`text-sm ${textColor}`}>
                        {item.nome} ({item.valor}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gráfico de Colunas - Lucro e Perda por Tipo */}
              <div
                className={`${inputBg} border ${borderColor} rounded-xl p-6`}
              >
                <h4 className={`text-lg font-semibold ${textColor} mb-4`}>
                  Lucro e Perda por Tipo de Jogo
                </h4>
                <div className="h-64 flex items-end justify-between gap-4">
                  {[
                    { nome: "PT", lucro: 8500, perda: 3200 },
                    { nome: "PTV", lucro: 12000, perda: 4500 },
                    { nome: "DEZ", lucro: 6800, perda: 2900 },
                    { nome: "CEN", lucro: 9200, perda: 3800 },
                    { nome: "MIL", lucro: 15000, perda: 5100 },
                  ].map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col gap-2">
                      <div className="flex gap-2 items-end h-48">
                        <div
                          className="flex-1 bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg"
                          style={{ height: `${(item.lucro / 15000) * 100}%` }}
                          title={`Lucro: R$ ${formatNumber(item.lucro)}`}
                        />
                        <div
                          className="flex-1 bg-gradient-to-t from-red-500 to-red-400 rounded-t-lg"
                          style={{ height: `${(item.perda / 15000) * 100}%` }}
                          title={`Perda: R$ ${formatNumber(item.perda)}`}
                        />
                      </div>
                      <p
                        className={`text-xs text-center font-medium ${textSecondary}`}
                      >
                        {item.nome}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-500" />
                    <span className={`text-sm ${textSecondary}`}>Lucro</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-red-500" />
                    <span className={`text-sm ${textSecondary}`}>Perda</span>
                  </div>
                </div>
              </div>

              {/* Percentual de Apostas Vencedoras x Perdedoras */}
              <div
                className={`${inputBg} border ${borderColor} rounded-xl p-6`}
              >
                <h4 className={`text-lg font-semibold ${textColor} mb-4`}>
                  Percentual de Apostas Vencedoras x Perdedoras
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${textColor}`}>
                        Apostas Vencedoras
                      </span>
                      <span className="text-sm font-bold text-green-400">
                        36.2%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full"
                        style={{ width: "36.2%" }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${textColor}`}>
                        Apostas Perdedoras
                      </span>
                      <span className="text-sm font-bold text-red-400">
                        63.8%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-red-500 to-red-400 h-3 rounded-full"
                        style={{ width: "63.8%" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Ranking dos Jogos Mais Apostados */}
              <div
                className={`${inputBg} border ${borderColor} rounded-xl p-6`}
              >
                <h4 className={`text-lg font-semibold ${textColor} mb-4`}>
                  Ranking dos Jogos Mais Apostados
                </h4>
                <div className="space-y-3">
                  {[
                    { nome: "Palpite Turbo", apostas: 4523, valor: 45230 },
                    { nome: "Milhar Premium", apostas: 3891, valor: 38910 },
                    { nome: "Palpite Turbo VIP", apostas: 3245, valor: 64900 },
                    { nome: "Centena Federal", apostas: 2876, valor: 28760 },
                    { nome: "Dezenas da Sorte", apostas: 2134, valor: 21340 },
                  ].map((jogo, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        theme === "dark" ? "bg-gray-800/50" : "bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            idx === 0
                              ? "bg-yellow-500/20 text-yellow-400"
                              : idx === 1
                              ? "bg-gray-500/20 text-gray-400"
                              : idx === 2
                              ? "bg-orange-500/20 text-orange-400"
                              : "bg-blue-500/20 text-blue-400"
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <div>
                          <p className={`text-sm font-semibold ${textColor}`}>
                            {jogo.nome}
                          </p>
                          <p className={`text-xs ${textSecondary}`} suppressHydrationWarning>
                            {formatNumber(jogo.apostas)} apostas
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-green-400" suppressHydrationWarning>
                        R$ {formatNumber(jogo.valor)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tabela de Resumo Diário */}
              <div
                className={`${inputBg} border ${borderColor} rounded-xl p-6`}
              >
                <h4 className={`text-lg font-semibold ${textColor} mb-4`}>
                  Resumo Diário
                </h4>
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
                          Data
                        </th>
                        <th
                          className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                        >
                          Total Apostado
                        </th>
                        <th
                          className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                        >
                          Pago em Prêmios
                        </th>
                        <th
                          className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                        >
                          Lucro Líquido
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${borderColor}`}>
                      {[
                        {
                          data: "10/01/2024",
                          apostado: 18450,
                          premios: 6520,
                          lucro: 11930,
                        },
                        {
                          data: "09/01/2024",
                          apostado: 22100,
                          premios: 8900,
                          lucro: 13200,
                        },
                        {
                          data: "08/01/2024",
                          apostado: 19800,
                          premios: 7200,
                          lucro: 12600,
                        },
                        {
                          data: "07/01/2024",
                          apostado: 21500,
                          premios: 8100,
                          lucro: 13400,
                        },
                        {
                          data: "06/01/2024",
                          apostado: 17900,
                          premios: 6800,
                          lucro: 11100,
                        },
                      ].map((row, idx) => (
                        <tr key={idx} className={`${hoverBg} transition-colors`}>
                          <td className={`px-4 py-4 text-sm ${textColor}`}>
                            {row.data}
                          </td>
                          <td className="px-4 py-4 text-sm font-semibold text-blue-400" suppressHydrationWarning>
                            R$ {formatNumber(row.apostado)}
                          </td>
                          <td className="px-4 py-4 text-sm font-semibold text-yellow-400" suppressHydrationWarning>
                            R$ {formatNumber(row.premios)}
                          </td>
                          <td className="px-4 py-4 text-sm font-bold text-green-400" suppressHydrationWarning>
                            R$ {formatNumber(row.lucro)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Aba: Usuários */}
          {activeTab === "usuarios" && (
            <div className="space-y-6">
              <h3 className={`text-xl font-bold ${textColor} mb-4`}>
                Relatórios de Usuários
              </h3>

              {/* Cards de Métricas de Usuários */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div
                  className={`${inputBg} border ${borderColor} rounded-xl p-6`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-400" />
                    </div>
                    <h4 className={`text-sm font-medium ${textSecondary}`}>
                      Usuários Novos
                    </h4>
                  </div>
                  <p className="text-2xl font-bold text-blue-400">127</p>
                  <p className="text-xs text-gray-500 mt-1">
                    +18.5% vs período anterior
                  </p>
                </div>

                <div
                  className={`${inputBg} border ${borderColor} rounded-xl p-6`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-green-400" />
                    </div>
                    <h4 className={`text-sm font-medium ${textSecondary}`}>
                      Usuários Ativos
                    </h4>
                  </div>
                  <p className="text-2xl font-bold text-green-400">342</p>
                  <p className="text-xs text-gray-500 mt-1">
                    +8.9% vs período anterior
                  </p>
                </div>

                <div
                  className={`${inputBg} border ${borderColor} rounded-xl p-6`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-500/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-gray-400" />
                    </div>
                    <h4 className={`text-sm font-medium ${textSecondary}`}>
                      Usuários Inativos
                    </h4>
                  </div>
                  <p className="text-2xl font-bold text-gray-400">89</p>
                  <p className="text-xs text-gray-500 mt-1">
                    -12.3% vs período anterior
                  </p>
                </div>

                <div
                  className={`${inputBg} border ${borderColor} rounded-xl p-6`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-purple-400" />
                    </div>
                    <h4 className={`text-sm font-medium ${textSecondary}`}>
                      Ticket Médio
                    </h4>
                  </div>
                  <p className="text-2xl font-bold text-purple-400">R$ 85,50</p>
                  <p className="text-xs text-gray-500 mt-1">
                    +5.2% vs período anterior
                  </p>
                </div>
              </div>

              {/* Gráfico de Linha - Evolução de Cadastros */}
              <div
                className={`${inputBg} border ${borderColor} rounded-xl p-6`}
              >
                <h4 className={`text-lg font-semibold ${textColor} mb-4`}>
                  Evolução de Cadastros Diários
                </h4>
                <div className="h-64 relative">
                  <svg
                    viewBox="0 0 700 200"
                    className="w-full h-full"
                    preserveAspectRatio="none"
                  >
                    {/* Grid lines */}
                    <line
                      x1="0"
                      y1="50"
                      x2="700"
                      y2="50"
                      stroke="#374151"
                      strokeWidth="1"
                      opacity="0.3"
                    />
                    <line
                      x1="0"
                      y1="100"
                      x2="700"
                      y2="100"
                      stroke="#374151"
                      strokeWidth="1"
                      opacity="0.3"
                    />
                    <line
                      x1="0"
                      y1="150"
                      x2="700"
                      y2="150"
                      stroke="#374151"
                      strokeWidth="1"
                      opacity="0.3"
                    />

                    {/* Line chart */}
                    <polyline
                      points="0,120 100,80 200,100 300,60 400,90 500,50 600,70 700,40"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Gradient definition */}
                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#3B82F6" />
                      </linearGradient>
                    </defs>

                    {/* Data points */}
                    {[
                      { x: 0, y: 120 },
                      { x: 100, y: 80 },
                      { x: 200, y: 100 },
                      { x: 300, y: 60 },
                      { x: 400, y: 90 },
                      { x: 500, y: 50 },
                      { x: 600, y: 70 },
                      { x: 700, y: 40 },
                    ].map((point, idx) => (
                      <circle
                        key={idx}
                        cx={point.x}
                        cy={point.y}
                        r="4"
                        fill="#8B5CF6"
                      />
                    ))}
                  </svg>
                  <div className="flex justify-between mt-2">
                    {[
                      "04/01",
                      "05/01",
                      "06/01",
                      "07/01",
                      "08/01",
                      "09/01",
                      "10/01",
                      "11/01",
                    ].map((date, idx) => (
                      <span
                        key={idx}
                        className={`text-xs ${textSecondary} text-center`}
                      >
                        {date}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top 10 Jogadores */}
              <div
                className={`${inputBg} border ${borderColor} rounded-xl p-6`}
              >
                <h4 className={`text-lg font-semibold ${textColor} mb-4`}>
                  Top 10 Jogadores por Volume de Apostas
                </h4>
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
                          Posição
                        </th>
                        <th
                          className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                        >
                          Jogador
                        </th>
                        <th
                          className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                        >
                          Total Apostado
                        </th>
                        <th
                          className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                        >
                          Nº de Apostas
                        </th>
                        <th
                          className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                        >
                          Ticket Médio
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${borderColor}`}>
                      {[
                        {
                          nome: "João Silva",
                          apostado: 12500,
                          apostas: 145,
                          ticket: 86.21,
                        },
                        {
                          nome: "Maria Santos",
                          apostado: 11200,
                          apostas: 132,
                          ticket: 84.85,
                        },
                        {
                          nome: "Pedro Costa",
                          apostado: 9800,
                          apostas: 118,
                          ticket: 83.05,
                        },
                        {
                          nome: "Ana Lima",
                          apostado: 8900,
                          apostas: 105,
                          ticket: 84.76,
                        },
                        {
                          nome: "Carlos Souza",
                          apostado: 8200,
                          apostas: 98,
                          ticket: 83.67,
                        },
                        {
                          nome: "Juliana Alves",
                          apostado: 7800,
                          apostas: 92,
                          ticket: 84.78,
                        },
                        {
                          nome: "Roberto Dias",
                          apostado: 7200,
                          apostas: 87,
                          ticket: 82.76,
                        },
                        {
                          nome: "Fernanda Rocha",
                          apostado: 6900,
                          apostas: 81,
                          ticket: 85.19,
                        },
                        {
                          nome: "Lucas Martins",
                          apostado: 6500,
                          apostas: 76,
                          ticket: 85.53,
                        },
                        {
                          nome: "Patricia Gomes",
                          apostado: 6100,
                          apostas: 72,
                          ticket: 84.72,
                        },
                      ].map((player, idx) => (
                        <tr key={idx} className={`${hoverBg} transition-colors`}>
                          <td className="px-4 py-4 text-sm">
                            <span
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                idx === 0
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : idx === 1
                                  ? "bg-gray-500/20 text-gray-400"
                                  : idx === 2
                                  ? "bg-orange-500/20 text-orange-400"
                                  : "bg-blue-500/20 text-blue-400"
                              }`}
                            >
                              {idx + 1}
                            </span>
                          </td>
                          <td className={`px-4 py-4 text-sm font-semibold ${textColor}`}>
                            {player.nome}
                          </td>
                          <td className="px-4 py-4 text-sm font-bold text-green-400" suppressHydrationWarning>
                            R$ {formatNumber(player.apostado)}
                          </td>
                          <td className={`px-4 py-4 text-sm ${textColor}`}>
                            {player.apostas}
                          </td>
                          <td className="px-4 py-4 text-sm font-semibold text-purple-400">
                            R$ {player.ticket.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Filtro por Cargo */}
              <div
                className={`${inputBg} border ${borderColor} rounded-xl p-6`}
              >
                <h4 className={`text-lg font-semibold ${textColor} mb-4`}>
                  Distribuição por Cargo
                </h4>
                <div className="space-y-4">
                  {[
                    { cargo: "Jogador", total: 412, percentual: 95.4 },
                    { cargo: "Admin", total: 12, percentual: 2.8 },
                    { cargo: "Staff", total: 8, percentual: 1.8 },
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-medium ${textColor}`}>
                          {item.cargo}
                        </span>
                        <span className="text-sm font-bold text-blue-400">
                          {item.total} usuários ({item.percentual}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                          style={{ width: `${item.percentual}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Aba: Campanhas */}
          {activeTab === "campanhas" && (
            <div className="space-y-6">
              <h3 className={`text-xl font-bold ${textColor} mb-4`}>
                Relatórios de Campanhas
              </h3>

              {/* Cards de Métricas de Campanhas */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div
                  className={`${inputBg} border ${borderColor} rounded-xl p-6`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Gift className="w-5 h-5 text-purple-400" />
                    </div>
                    <h4 className={`text-sm font-medium ${textSecondary}`}>
                      Campanhas Ativas
                    </h4>
                  </div>
                  <p className="text-2xl font-bold text-purple-400">8</p>
                  <p className="text-xs text-gray-500 mt-1">
                    +2 vs período anterior
                  </p>
                </div>

                <div
                  className={`${inputBg} border ${borderColor} rounded-xl p-6`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-yellow-400" />
                    </div>
                    <h4 className={`text-sm font-medium ${textSecondary}`}>
                      Valor em Bônus
                    </h4>
                  </div>
                  <p className="text-2xl font-bold text-yellow-400">
                    R$ 15.450
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    +22.5% vs período anterior
                  </p>
                </div>

                <div
                  className={`${inputBg} border ${borderColor} rounded-xl p-6`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    </div>
                    <h4 className={`text-sm font-medium ${textSecondary}`}>
                      Taxa de Conversão
                    </h4>
                  </div>
                  <p className="text-2xl font-bold text-green-400">68.5%</p>
                  <p className="text-xs text-gray-500 mt-1">
                    +5.2% vs período anterior
                  </p>
                </div>

                <div
                  className={`${inputBg} border ${borderColor} rounded-xl p-6`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h4 className={`text-sm font-medium ${textSecondary}`}>
                      ROI Estimado
                    </h4>
                  </div>
                  <p className="text-2xl font-bold text-cyan-400">285%</p>
                  <p className="text-xs text-gray-500 mt-1">
                    +18.3% vs período anterior
                  </p>
                </div>
              </div>

              {/* Gráfico de Barras - Comparação de Campanhas */}
              <div
                className={`${inputBg} border ${borderColor} rounded-xl p-6`}
              >
                <h4 className={`text-lg font-semibold ${textColor} mb-4`}>
                  Comparação de Campanhas por Eficácia
                </h4>
                <div className="space-y-4">
                  {[
                    {
                      nome: "Bônus de Boas-Vindas",
                      conversao: 85,
                      valor: 5200,
                    },
                    { nome: "Cashback Semanal", conversao: 72, valor: 3800 },
                    { nome: "Sorteio Mensal", conversao: 68, valor: 2900 },
                    { nome: "Bônus de Depósito", conversao: 65, valor: 2100 },
                    { nome: "Promoção Especial", conversao: 58, valor: 1450 },
                  ].map((campanha, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-medium ${textColor}`}>
                          {campanha.nome}
                        </span>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-green-400 font-semibold">
                            {campanha.conversao}% conversão
                          </span>
                          <span className="text-xs text-yellow-400 font-semibold" suppressHydrationWarning>
                            R$ {formatNumber(campanha.valor)}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                          style={{ width: `${campanha.conversao}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tabela de Detalhamento de Campanhas */}
              <div
                className={`${inputBg} border ${borderColor} rounded-xl p-6`}
              >
                <h4 className={`text-lg font-semibold ${textColor} mb-4`}>
                  Detalhamento de Campanhas
                </h4>
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
                          Campanha
                        </th>
                        <th
                          className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                        >
                          Usuários Impactados
                        </th>
                        <th
                          className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                        >
                          Valor Concedido
                        </th>
                        <th
                          className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                        >
                          Apostas Geradas
                        </th>
                        <th
                          className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                        >
                          ROI
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${borderColor}`}>
                      {[
                        {
                          nome: "Bônus de Boas-Vindas",
                          usuarios: 127,
                          valor: 5200,
                          apostas: 18900,
                          roi: 363,
                        },
                        {
                          nome: "Cashback Semanal",
                          usuarios: 342,
                          valor: 3800,
                          apostas: 12400,
                          roi: 326,
                        },
                        {
                          nome: "Sorteio Mensal",
                          usuarios: 89,
                          valor: 2900,
                          apostas: 8200,
                          roi: 283,
                        },
                        {
                          nome: "Bônus de Depósito",
                          usuarios: 156,
                          valor: 2100,
                          apostas: 6800,
                          roi: 324,
                        },
                        {
                          nome: "Promoção Especial",
                          usuarios: 78,
                          valor: 1450,
                          apostas: 3900,
                          roi: 269,
                        },
                      ].map((row, idx) => (
                        <tr key={idx} className={`${hoverBg} transition-colors`}>
                          <td className={`px-4 py-4 text-sm font-semibold ${textColor}`}>
                            {row.nome}
                          </td>
                          <td className={`px-4 py-4 text-sm ${textColor}`}>
                            {row.usuarios}
                          </td>
                          <td className="px-4 py-4 text-sm font-semibold text-yellow-400" suppressHydrationWarning>
                            R$ {formatNumber(row.valor)}
                          </td>
                          <td className="px-4 py-4 text-sm font-semibold text-green-400" suppressHydrationWarning>
                            R$ {formatNumber(row.apostas)}
                          </td>
                          <td className="px-4 py-4 text-sm font-bold text-cyan-400">
                            {row.roi}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Aba: Personalizados */}
          {activeTab === "personalizados" && (
            <div className="space-y-6">
              <h3 className={`text-xl font-bold ${textColor} mb-4`}>
                Relatórios Personalizados
              </h3>

              <div
                className={`${inputBg} border ${borderColor} rounded-xl p-6`}
              >
                <h4 className={`text-lg font-semibold ${textColor} mb-4`}>
                  Criar Relatório Personalizado
                </h4>

                <div className="space-y-4">
                  {/* Origem de Dados */}
                  <div>
                    <label
                      className={`block text-sm font-medium ${textSecondary} mb-2`}
                    >
                      Origem de Dados
                    </label>
                    <select
                      className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                    >
                      <option value="apostas">Apostas</option>
                      <option value="usuarios">Usuários</option>
                      <option value="financeiro">Financeiro</option>
                      <option value="campanhas">Campanhas</option>
                    </select>
                  </div>

                  {/* Colunas Desejadas */}
                  <div>
                    <label
                      className={`block text-sm font-medium ${textSecondary} mb-2`}
                    >
                      Colunas Desejadas
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        "ID",
                        "Nome",
                        "Data",
                        "Valor",
                        "Status",
                        "Tipo",
                        "Resultado",
                        "Jogador",
                      ].map((col, idx) => (
                        <label
                          key={idx}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-600 text-purple-500 focus:ring-purple-500"
                          />
                          <span className={`text-sm ${textColor}`}>{col}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Filtros Avançados */}
                  <div>
                    <label
                      className={`block text-sm font-medium ${textSecondary} mb-2`}
                    >
                      Filtros Avançados
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        type="date"
                        placeholder="Data Inicial"
                        className={`px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                      />
                      <input
                        type="date"
                        placeholder="Data Final"
                        className={`px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                      />
                      <select
                        className={`px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                      >
                        <option value="all">Todos os Status</option>
                        <option value="ativo">Ativo</option>
                        <option value="inativo">Inativo</option>
                      </select>
                    </div>
                  </div>

                  {/* Botões de Exportação */}
                  <div className="flex gap-3 pt-4 border-t border-gray-700">
                    <button
                      onClick={() => alert("Gerando relatório personalizado...")}
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Gerar Relatório
                    </button>
                    <button
                      onClick={handleExportCSV}
                      className="flex items-center gap-2 px-4 py-2.5 bg-green-500/20 text-green-400 font-semibold rounded-lg hover:bg-green-500/30 transition-colors"
                    >
                      <Download size={18} />
                      Exportar CSV
                    </button>
                    <button
                      onClick={() => alert("Exportando XLSX...")}
                      className="flex items-center gap-2 px-4 py-2.5 bg-blue-500/20 text-blue-400 font-semibold rounded-lg hover:bg-blue-500/30 transition-colors"
                    >
                      <Download size={18} />
                      Exportar XLSX
                    </button>
                    <button
                      onClick={handleExportPDF}
                      className="flex items-center gap-2 px-4 py-2.5 bg-red-500/20 text-red-400 font-semibold rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      <FileText size={18} />
                      Exportar PDF
                    </button>
                  </div>
                </div>
              </div>

              {/* Relatórios Salvos */}
              <div
                className={`${inputBg} border ${borderColor} rounded-xl p-6`}
              >
                <h4 className={`text-lg font-semibold ${textColor} mb-4`}>
                  Relatórios Salvos
                </h4>
                <div className="space-y-3">
                  {[
                    {
                      nome: "Relatório Mensal de Apostas",
                      data: "10/01/2024",
                      tipo: "Apostas",
                    },
                    {
                      nome: "Análise Financeira Trimestral",
                      data: "08/01/2024",
                      tipo: "Financeiro",
                    },
                    {
                      nome: "Performance de Campanhas",
                      data: "05/01/2024",
                      tipo: "Campanhas",
                    },
                  ].map((relatorio, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        theme === "dark" ? "bg-gray-800/50" : "bg-gray-100"
                      }`}
                    >
                      <div>
                        <p className={`text-sm font-semibold ${textColor}`}>
                          {relatorio.nome}
                        </p>
                        <p className={`text-xs ${textSecondary}`}>
                          {relatorio.tipo} • Criado em {relatorio.data}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors">
                          <Download size={16} />
                        </button>
                        <button className="p-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors">
                          <Eye size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
