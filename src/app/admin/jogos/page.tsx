"use client";

import { useState } from "react";
import {
  Gamepad2,
  Plus,
  Edit,
  Copy,
  Trash2,
  Power,
  PowerOff,
  Search,
  Clock,
  DollarSign,
  TrendingUp,
  Calendar,
  History,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Eye,
} from "lucide-react";

type GameStatus = "ativo" | "inativo";
type GameType = "grupo" | "dezena" | "centena" | "milhar" | "PT" | "PTV";
type DrawStatus = "agendado" | "em_andamento" | "encerrado" | "sorteado";

interface Game {
  id: string;
  nome: string;
  codigo: string;
  tipo: GameType;
  cotacao: number;
  valorMinimo: number;
  valorMaximo: number;
  limiteGanho: number;
  ordemExibicao: number;
  horarioFechamento: string;
  permiteCombinada: boolean;
  status: GameStatus;
}

interface Draw {
  id: string;
  jogoId: string;
  jogoNome: string;
  dataAbertura: string;
  dataFechamento: string;
  dataSorteio: string;
  status: DrawStatus;
  resultado?: string;
  limiteApostas?: number;
  repetirDiariamente: boolean;
}

interface ChangeLog {
  id: string;
  dataHora: string;
  usuario: string;
  tipoAlteracao: string;
  jogoAfetado: string;
  valorAnterior?: string;
  valorNovo?: string;
}

export default function JogosPage() {
  const [theme] = useState<"light" | "dark">("dark");
  const [activeTab, setActiveTab] = useState<
    "geral" | "cotacoes" | "sorteios" | "historico"
  >("geral");

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  // Modals
  const [gameModal, setGameModal] = useState(false);
  const [drawModal, setDrawModal] = useState(false);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form states
  const [formData, setFormData] = useState<Partial<Game>>({
    nome: "",
    codigo: "",
    tipo: "grupo",
    cotacao: 0,
    valorMinimo: 0,
    valorMaximo: 0,
    limiteGanho: 0,
    ordemExibicao: 0,
    horarioFechamento: "",
    permiteCombinada: false,
    status: "ativo",
  });

  const [drawFormData, setDrawFormData] = useState({
    jogoId: "",
    dataAbertura: "",
    dataFechamento: "",
    dataSorteio: "",
    limiteApostas: "",
    repetirDiariamente: false,
  });

  // Dados mockados
  const stats = {
    totalJogos: 12,
    jogosAtivos: 10,
    jogosInativos: 2,
    sorteiosProgramadosHoje: 8,
    ultimaAtualizacao: "10/01/2024 18:45",
  };

  const games: Game[] = [
    {
      id: "GAME001",
      nome: "Palpite Turbo",
      codigo: "PT",
      tipo: "grupo",
      cotacao: 10.0,
      valorMinimo: 5.0,
      valorMaximo: 500.0,
      limiteGanho: 5000.0,
      ordemExibicao: 1,
      horarioFechamento: "18:00",
      permiteCombinada: true,
      status: "ativo",
    },
    {
      id: "GAME002",
      nome: "Palpite Turbo VIP",
      codigo: "PTV",
      tipo: "grupo",
      cotacao: 12.0,
      valorMinimo: 10.0,
      valorMaximo: 1000.0,
      limiteGanho: 10000.0,
      ordemExibicao: 2,
      horarioFechamento: "19:00",
      permiteCombinada: true,
      status: "ativo",
    },
    {
      id: "GAME003",
      nome: "Dezenas da Sorte",
      codigo: "DEZ",
      tipo: "dezena",
      cotacao: 8.0,
      valorMinimo: 2.0,
      valorMaximo: 200.0,
      limiteGanho: 2000.0,
      ordemExibicao: 3,
      horarioFechamento: "17:30",
      permiteCombinada: false,
      status: "ativo",
    },
    {
      id: "GAME004",
      nome: "Centena Federal",
      codigo: "CEN",
      tipo: "centena",
      cotacao: 15.0,
      valorMinimo: 5.0,
      valorMaximo: 300.0,
      limiteGanho: 4500.0,
      ordemExibicao: 4,
      horarioFechamento: "20:00",
      permiteCombinada: false,
      status: "ativo",
    },
    {
      id: "GAME005",
      nome: "Milhar Premium",
      codigo: "MIL",
      tipo: "milhar",
      cotacao: 100.0,
      valorMinimo: 1.0,
      valorMaximo: 100.0,
      limiteGanho: 10000.0,
      ordemExibicao: 5,
      horarioFechamento: "21:00",
      permiteCombinada: false,
      status: "inativo",
    },
  ];

  const draws: Draw[] = [
    {
      id: "DRAW001",
      jogoId: "GAME001",
      jogoNome: "Palpite Turbo",
      dataAbertura: "10/01/2024 06:00",
      dataFechamento: "10/01/2024 18:00",
      dataSorteio: "10/01/2024 18:30",
      status: "em_andamento",
      repetirDiariamente: true,
    },
    {
      id: "DRAW002",
      jogoId: "GAME002",
      jogoNome: "Palpite Turbo VIP",
      dataAbertura: "10/01/2024 06:00",
      dataFechamento: "10/01/2024 19:00",
      dataSorteio: "10/01/2024 19:30",
      status: "agendado",
      repetirDiariamente: true,
    },
    {
      id: "DRAW003",
      jogoId: "GAME003",
      jogoNome: "Dezenas da Sorte",
      dataAbertura: "09/01/2024 06:00",
      dataFechamento: "09/01/2024 17:30",
      dataSorteio: "09/01/2024 18:00",
      status: "sorteado",
      resultado: "23",
      repetirDiariamente: true,
    },
  ];

  const changeLogs: ChangeLog[] = [
    {
      id: "LOG001",
      dataHora: "10/01/2024 15:30",
      usuario: "Admin Master",
      tipoAlteracao: "Edição de Cotação",
      jogoAfetado: "Palpite Turbo (PT)",
      valorAnterior: "9.5x",
      valorNovo: "10.0x",
    },
    {
      id: "LOG002",
      dataHora: "10/01/2024 14:20",
      usuario: "Admin Master",
      tipoAlteracao: "Criação de Jogo",
      jogoAfetado: "Milhar Premium (MIL)",
    },
    {
      id: "LOG003",
      dataHora: "10/01/2024 12:15",
      usuario: "Admin Master",
      tipoAlteracao: "Atualização de Horário",
      jogoAfetado: "Dezenas da Sorte (DEZ)",
      valorAnterior: "17:00",
      valorNovo: "17:30",
    },
  ];

  // Theme colors
  const bgColor = theme === "dark" ? "bg-[#1A1A1A]" : "bg-white";
  const borderColor = theme === "dark" ? "border-[#2A2A2A]" : "border-gray-200";
  const textColor = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const inputBg = theme === "dark" ? "bg-[#0F0F0F]" : "bg-gray-50";
  const hoverBg = theme === "dark" ? "hover:bg-[#2A2A2A]" : "hover:bg-gray-50";

  // Handlers
  const handleCreateGame = () => {
    setIsEditMode(false);
    setFormData({
      nome: "",
      codigo: "",
      tipo: "grupo",
      cotacao: 0,
      valorMinimo: 0,
      valorMaximo: 0,
      limiteGanho: 0,
      ordemExibicao: 0,
      horarioFechamento: "",
      permiteCombinada: false,
      status: "ativo",
    });
    setGameModal(true);
  };

  const handleEditGame = (game: Game) => {
    setIsEditMode(true);
    setSelectedGame(game);
    setFormData(game);
    setGameModal(true);
  };

  const handleDuplicateGame = (game: Game) => {
    setIsEditMode(false);
    setFormData({
      ...game,
      id: undefined,
      nome: `${game.nome} (Cópia)`,
      codigo: `${game.codigo}_COPY`,
    });
    setGameModal(true);
  };

  const handleToggleStatus = (id: string) => {
    alert(`Status do jogo ${id} alterado!`);
  };

  const handleDeleteGame = (game: Game) => {
    setSelectedGame(game);
    setDeleteConfirmModal(true);
  };

  const confirmDelete = () => {
    if (selectedGame) {
      alert(`Jogo ${selectedGame.nome} excluído com sucesso!`);
      setDeleteConfirmModal(false);
      setSelectedGame(null);
    }
  };

  const handleSaveGame = () => {
    if (isEditMode) {
      alert(`Jogo ${formData.nome} atualizado com sucesso!`);
    } else {
      alert(`Jogo ${formData.nome} criado com sucesso!`);
    }
    setGameModal(false);
  };

  const handleSaveDraw = () => {
    alert("Sorteio programado com sucesso!");
    setDrawModal(false);
  };

  const handleSaveAllQuotes = () => {
    alert("Todas as cotações foram salvas com sucesso!");
  };

  const handleApplyQuoteToType = (type: GameType) => {
    const value = prompt(`Digite a cotação a ser aplicada em todos os jogos do tipo "${type}":`);
    if (value) {
      alert(`Cotação ${value}x aplicada a todos os jogos do tipo "${type}"`);
    }
  };

  // Status badge
  const getStatusBadge = (status: GameStatus) => {
    const styles = {
      ativo: "bg-green-500/20 text-green-400 border-green-500/30",
      inativo: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    };
    const labels = {
      ativo: "Ativo",
      inativo: "Inativo",
    };
    const icons = {
      ativo: <Power className="w-3 h-3" />,
      inativo: <PowerOff className="w-3 h-3" />,
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 w-fit ${styles[status]}`}
      >
        {icons[status]}
        {labels[status]}
      </span>
    );
  };

  const getDrawStatusBadge = (status: DrawStatus) => {
    const styles = {
      agendado: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      em_andamento: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      encerrado: "bg-gray-500/20 text-gray-400 border-gray-500/30",
      sorteado: "bg-green-500/20 text-green-400 border-green-500/30",
    };
    const labels = {
      agendado: "Agendado",
      em_andamento: "Em Andamento",
      encerrado: "Encerrado",
      sorteado: "Sorteado",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 w-fit ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  const getGameTypeLabel = (type: GameType) => {
    const labels = {
      grupo: "Grupo",
      dezena: "Dezena",
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
            <Gamepad2 className="w-8 h-8 text-purple-500" />
            Gestão de Jogos
          </h1>
          <p className={textSecondary}>
            Controle de jogos, cotações, limites e sorteios programados
          </p>
        </div>
        <button
          onClick={handleCreateGame}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus size={18} />
          Criar Novo Jogo
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Total de Jogos */}
        <div
          className={`${bgColor} rounded-xl p-6 border ${borderColor} shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center`}
            >
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className={`text-sm font-medium ${textSecondary} mb-1`}>
            Total de Jogos
          </h3>
          <p className={`text-2xl font-bold ${textColor}`}>
            {stats.totalJogos}
          </p>
        </div>

        {/* Jogos Ativos */}
        <div
          className={`${bgColor} rounded-xl p-6 border ${borderColor} shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center`}
            >
              <Power className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className={`text-sm font-medium ${textSecondary} mb-1`}>
            Jogos Ativos
          </h3>
          <p className={`text-2xl font-bold ${textColor}`}>
            {stats.jogosAtivos}
          </p>
        </div>

        {/* Jogos Inativos */}
        <div
          className={`${bgColor} rounded-xl p-6 border ${borderColor} shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center`}
            >
              <PowerOff className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className={`text-sm font-medium ${textSecondary} mb-1`}>
            Jogos Inativos
          </h3>
          <p className={`text-2xl font-bold ${textColor}`}>
            {stats.jogosInativos}
          </p>
        </div>

        {/* Sorteios Programados Hoje */}
        <div
          className={`${bgColor} rounded-xl p-6 border ${borderColor} shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center`}
            >
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className={`text-sm font-medium ${textSecondary} mb-1`}>
            Sorteios Hoje
          </h3>
          <p className={`text-2xl font-bold ${textColor}`}>
            {stats.sorteiosProgramadosHoje}
          </p>
        </div>

        {/* Última Atualização */}
        <div
          className={`${bgColor} rounded-xl p-6 border ${borderColor} shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center`}
            >
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className={`text-sm font-medium ${textSecondary} mb-1`}>
            Última Atualização
          </h3>
          <p className={`text-sm font-bold ${textColor}`}>
            {stats.ultimaAtualizacao}
          </p>
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
            { id: "geral", label: "Geral", icon: Gamepad2 },
            { id: "cotacoes", label: "Cotações", icon: DollarSign },
            { id: "sorteios", label: "Sorteios", icon: Calendar },
            { id: "historico", label: "Histórico", icon: History },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(
                  tab.id as "geral" | "cotacoes" | "sorteios" | "historico"
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
          {/* Aba: Geral */}
          {activeTab === "geral" && (
            <div className="space-y-6">
              {/* Filtros e Busca */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative md:col-span-1">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Buscar por nome ou código..."
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
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className={`px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                >
                  <option value="all">Todos os Tipos</option>
                  <option value="grupo">Grupo</option>
                  <option value="dezena">Dezena</option>
                  <option value="centena">Centena</option>
                  <option value="milhar">Milhar</option>
                  <option value="PT">PT</option>
                  <option value="PTV">PTV</option>
                </select>
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
                        Nome
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Código
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Tipo
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Cotação
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Min / Max
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Status
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Fechamento
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${borderColor}`}>
                    {games.map((game) => (
                      <tr
                        key={game.id}
                        className={`${hoverBg} transition-colors`}
                      >
                        <td className={`px-4 py-4 text-sm ${textColor}`}>
                          {game.id}
                        </td>
                        <td className={`px-4 py-4 text-sm font-semibold ${textColor}`}>
                          {game.nome}
                        </td>
                        <td className={`px-4 py-4 text-sm`}>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 font-mono">
                            {game.codigo}
                          </span>
                        </td>
                        <td className={`px-4 py-4 text-sm ${textColor}`}>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                            {getGameTypeLabel(game.tipo)}
                          </span>
                        </td>
                        <td className={`px-4 py-4 text-sm font-bold text-green-400`}>
                          {game.cotacao}x
                        </td>
                        <td className={`px-4 py-4 text-sm ${textSecondary}`}>
                          R$ {game.valorMinimo.toFixed(2)} / R${" "}
                          {game.valorMaximo.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          {getStatusBadge(game.status)}
                        </td>
                        <td className={`px-4 py-4 text-sm ${textColor}`}>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-gray-400" />
                            {game.horarioFechamento}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditGame(game)}
                              className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                              title="Editar"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDuplicateGame(game)}
                              className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
                              title="Duplicar"
                            >
                              <Copy size={16} />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(game.id)}
                              className={`p-1.5 rounded-lg ${
                                game.status === "ativo"
                                  ? "bg-gray-500/20 text-gray-400 hover:bg-gray-500/30"
                                  : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                              } transition-colors`}
                              title={
                                game.status === "ativo"
                                  ? "Desativar"
                                  : "Ativar"
                              }
                            >
                              {game.status === "ativo" ? (
                                <PowerOff size={16} />
                              ) : (
                                <Power size={16} />
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteGame(game)}
                              className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                              title="Excluir"
                            >
                              <Trash2 size={16} />
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

          {/* Aba: Cotações */}
          {activeTab === "cotacoes" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${textColor}`}>
                  Edição Rápida de Cotações
                </h3>
                <button
                  onClick={handleSaveAllQuotes}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Save size={18} />
                  Salvar Todas as Cotações
                </button>
              </div>

              {/* Tabela de Cotações */}
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
                        Nome do Jogo
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Código
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Tipo
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Cotação Atual
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${borderColor}`}>
                    {games.map((game) => (
                      <tr
                        key={game.id}
                        className={`${hoverBg} transition-colors`}
                      >
                        <td className={`px-4 py-4 text-sm font-semibold ${textColor}`}>
                          {game.nome}
                        </td>
                        <td className={`px-4 py-4 text-sm`}>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 font-mono">
                            {game.codigo}
                          </span>
                        </td>
                        <td className={`px-4 py-4 text-sm ${textColor}`}>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                            {getGameTypeLabel(game.tipo)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            defaultValue={game.cotacao}
                            className={`w-24 px-3 py-2 ${inputBg} border ${borderColor} rounded-lg ${textColor} font-bold text-green-400 focus:outline-none focus:border-purple-500 transition-colors`}
                          />
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <button
                            onClick={() => handleApplyQuoteToType(game.tipo)}
                            className="px-3 py-1.5 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors font-semibold text-xs"
                          >
                            Aplicar a todos do tipo
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Aba: Sorteios */}
          {activeTab === "sorteios" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${textColor}`}>
                  Sorteios Programados
                </h3>
                <button
                  onClick={() => setDrawModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Plus size={18} />
                  Novo Sorteio Programado
                </button>
              </div>

              {/* Tabela de Sorteios */}
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
                        Jogo Vinculado
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Abertura
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Fechamento
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Sorteio
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Status
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Resultado
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${borderColor}`}>
                    {draws.map((draw) => (
                      <tr
                        key={draw.id}
                        className={`${hoverBg} transition-colors`}
                      >
                        <td className={`px-4 py-4 text-sm ${textColor}`}>
                          {draw.id}
                        </td>
                        <td className={`px-4 py-4 text-sm font-semibold ${textColor}`}>
                          {draw.jogoNome}
                        </td>
                        <td className={`px-4 py-4 text-sm ${textSecondary}`}>
                          {draw.dataAbertura}
                        </td>
                        <td className={`px-4 py-4 text-sm ${textSecondary}`}>
                          {draw.dataFechamento}
                        </td>
                        <td className={`px-4 py-4 text-sm ${textSecondary}`}>
                          {draw.dataSorteio}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          {getDrawStatusBadge(draw.status)}
                        </td>
                        <td className={`px-4 py-4 text-sm ${textColor}`}>
                          {draw.resultado ? (
                            <span className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">
                              {draw.resultado}
                            </span>
                          ) : (
                            <span className={textSecondary}>-</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                              title="Ver Detalhes"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                              title="Cancelar"
                            >
                              <X size={16} />
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

          {/* Aba: Histórico */}
          {activeTab === "historico" && (
            <div className="space-y-6">
              <h3 className={`text-lg font-semibold ${textColor}`}>
                Histórico de Alterações
              </h3>

              {/* Filtros */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="date"
                  className={`px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                />
                <select
                  className={`px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                >
                  <option value="all">Todos os Usuários</option>
                  <option value="admin">Admin Master</option>
                </select>
                <select
                  className={`px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                >
                  <option value="all">Todos os Tipos</option>
                  <option value="criacao">Criação</option>
                  <option value="edicao">Edição</option>
                  <option value="exclusao">Exclusão</option>
                  <option value="cotacao">Atualização de Cotação</option>
                </select>
              </div>

              {/* Tabela de Logs */}
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
                        Data/Hora
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Usuário
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Tipo de Alteração
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Jogo Afetado
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Valor Anterior
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Valor Novo
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${borderColor}`}>
                    {changeLogs.map((log) => (
                      <tr
                        key={log.id}
                        className={`${hoverBg} transition-colors`}
                      >
                        <td className={`px-4 py-4 text-sm ${textSecondary}`}>
                          {log.dataHora}
                        </td>
                        <td className={`px-4 py-4 text-sm ${textColor}`}>
                          {log.usuario}
                        </td>
                        <td className={`px-4 py-4 text-sm`}>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                            {log.tipoAlteracao}
                          </span>
                        </td>
                        <td className={`px-4 py-4 text-sm font-semibold ${textColor}`}>
                          {log.jogoAfetado}
                        </td>
                        <td className={`px-4 py-4 text-sm ${textSecondary}`}>
                          {log.valorAnterior || "-"}
                        </td>
                        <td className={`px-4 py-4 text-sm font-semibold text-green-400`}>
                          {log.valorNovo || "-"}
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

      {/* Modal: Criar/Editar Jogo */}
      {gameModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className={`${bgColor} rounded-2xl shadow-2xl max-w-3xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto`}
          >
            <div className="flex items-center justify-between">
              <h3 className={`text-xl font-bold ${textColor}`}>
                {isEditMode ? "Editar Jogo" : "Criar Novo Jogo"}
              </h3>
              <button
                onClick={() => setGameModal(false)}
                className={`p-2 rounded-lg ${hoverBg} transition-colors`}
              >
                <X className={textSecondary} size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Nome do Jogo */}
              <div>
                <label
                  className={`block text-sm font-medium ${textSecondary} mb-2`}
                >
                  Nome do Jogo
                </label>
                <input
                  type="text"
                  placeholder="Ex: Palpite Turbo"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                />
              </div>

              {/* Código Interno */}
              <div>
                <label
                  className={`block text-sm font-medium ${textSecondary} mb-2`}
                >
                  Código Interno
                </label>
                <input
                  type="text"
                  placeholder="Ex: PT, COR, FED"
                  value={formData.codigo}
                  onChange={(e) =>
                    setFormData({ ...formData, codigo: e.target.value })
                  }
                  className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} font-mono focus:outline-none focus:border-purple-500 transition-colors`}
                />
              </div>

              {/* Tipo */}
              <div>
                <label
                  className={`block text-sm font-medium ${textSecondary} mb-2`}
                >
                  Tipo
                </label>
                <select
                  value={formData.tipo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tipo: e.target.value as GameType,
                    })
                  }
                  className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                >
                  <option value="grupo">Grupo</option>
                  <option value="dezena">Dezena</option>
                  <option value="centena">Centena</option>
                  <option value="milhar">Milhar</option>
                  <option value="PT">PT</option>
                  <option value="PTV">PTV</option>
                </select>
              </div>

              {/* Grid de Valores */}
              <div className="grid grid-cols-2 gap-4">
                {/* Cotação */}
                <div>
                  <label
                    className={`block text-sm font-medium ${textSecondary} mb-2`}
                  >
                    Cotação (multiplicador)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Ex: 10.0"
                    value={formData.cotacao}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cotacao: parseFloat(e.target.value),
                      })
                    }
                    className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                  />
                </div>

                {/* Valor Mínimo */}
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
                    placeholder="Ex: 5.00"
                    value={formData.valorMinimo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        valorMinimo: parseFloat(e.target.value),
                      })
                    }
                    className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                  />
                </div>

                {/* Valor Máximo */}
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
                    placeholder="Ex: 500.00"
                    value={formData.valorMaximo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        valorMaximo: parseFloat(e.target.value),
                      })
                    }
                    className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                  />
                </div>

                {/* Limite de Ganho */}
                <div>
                  <label
                    className={`block text-sm font-medium ${textSecondary} mb-2`}
                  >
                    Limite de Ganho Máximo (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Ex: 5000.00"
                    value={formData.limiteGanho}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        limiteGanho: parseFloat(e.target.value),
                      })
                    }
                    className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                  />
                </div>

                {/* Ordem de Exibição */}
                <div>
                  <label
                    className={`block text-sm font-medium ${textSecondary} mb-2`}
                  >
                    Ordem de Exibição
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Ex: 1"
                    value={formData.ordemExibicao}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ordemExibicao: parseInt(e.target.value),
                      })
                    }
                    className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                  />
                </div>

                {/* Horário de Fechamento */}
                <div>
                  <label
                    className={`block text-sm font-medium ${textSecondary} mb-2`}
                  >
                    Horário de Fechamento
                  </label>
                  <input
                    type="time"
                    value={formData.horarioFechamento}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        horarioFechamento: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                  />
                </div>
              </div>

              {/* Checkbox: Permite Combinada */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="permiteCombinada"
                  checked={formData.permiteCombinada}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      permiteCombinada: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded border-gray-600 text-purple-500 focus:ring-purple-500"
                />
                <label
                  htmlFor="permiteCombinada"
                  className={`text-sm font-medium ${textColor} cursor-pointer`}
                >
                  Permite aposta combinada
                </label>
              </div>

              {/* Status */}
              <div>
                <label
                  className={`block text-sm font-medium ${textSecondary} mb-2`}
                >
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as GameStatus,
                    })
                  }
                  className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4 border-t border-gray-700">
              <button
                onClick={() => setGameModal(false)}
                className={`flex-1 px-4 py-2.5 ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                } ${textColor} font-semibold rounded-lg hover:opacity-90 transition-opacity`}
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveGame}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                {isEditMode ? "Salvar Alterações" : "Criar Jogo"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Novo Sorteio Programado */}
      {drawModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className={`${bgColor} rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-6`}
          >
            <div className="flex items-center justify-between">
              <h3 className={`text-xl font-bold ${textColor}`}>
                Novo Sorteio Programado
              </h3>
              <button
                onClick={() => setDrawModal(false)}
                className={`p-2 rounded-lg ${hoverBg} transition-colors`}
              >
                <X className={textSecondary} size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Selecionar Jogo */}
              <div>
                <label
                  className={`block text-sm font-medium ${textSecondary} mb-2`}
                >
                  Selecionar Jogo
                </label>
                <select
                  value={drawFormData.jogoId}
                  onChange={(e) =>
                    setDrawFormData({ ...drawFormData, jogoId: e.target.value })
                  }
                  className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                >
                  <option value="">Selecione um jogo</option>
                  {games.map((game) => (
                    <option key={game.id} value={game.id}>
                      {game.nome} ({game.codigo})
                    </option>
                  ))}
                </select>
              </div>

              {/* Grid de Datas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Data/Hora de Abertura */}
                <div>
                  <label
                    className={`block text-sm font-medium ${textSecondary} mb-2`}
                  >
                    Data/Hora de Abertura
                  </label>
                  <input
                    type="datetime-local"
                    value={drawFormData.dataAbertura}
                    onChange={(e) =>
                      setDrawFormData({
                        ...drawFormData,
                        dataAbertura: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                  />
                </div>

                {/* Data/Hora de Fechamento */}
                <div>
                  <label
                    className={`block text-sm font-medium ${textSecondary} mb-2`}
                  >
                    Data/Hora de Fechamento
                  </label>
                  <input
                    type="datetime-local"
                    value={drawFormData.dataFechamento}
                    onChange={(e) =>
                      setDrawFormData({
                        ...drawFormData,
                        dataFechamento: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                  />
                </div>

                {/* Data/Hora do Sorteio */}
                <div>
                  <label
                    className={`block text-sm font-medium ${textSecondary} mb-2`}
                  >
                    Data/Hora do Sorteio
                  </label>
                  <input
                    type="datetime-local"
                    value={drawFormData.dataSorteio}
                    onChange={(e) =>
                      setDrawFormData({
                        ...drawFormData,
                        dataSorteio: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                  />
                </div>
              </div>

              {/* Limite de Apostas */}
              <div>
                <label
                  className={`block text-sm font-medium ${textSecondary} mb-2`}
                >
                  Limite de Apostas por Sorteio (opcional)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="Deixe vazio para ilimitado"
                  value={drawFormData.limiteApostas}
                  onChange={(e) =>
                    setDrawFormData({
                      ...drawFormData,
                      limiteApostas: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                />
              </div>

              {/* Checkbox: Repetir Diariamente */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="repetirDiariamente"
                  checked={drawFormData.repetirDiariamente}
                  onChange={(e) =>
                    setDrawFormData({
                      ...drawFormData,
                      repetirDiariamente: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded border-gray-600 text-purple-500 focus:ring-purple-500"
                />
                <label
                  htmlFor="repetirDiariamente"
                  className={`text-sm font-medium ${textColor} cursor-pointer`}
                >
                  Repetir diariamente (gerar automaticamente)
                </label>
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4 border-t border-gray-700">
              <button
                onClick={() => setDrawModal(false)}
                className={`flex-1 px-4 py-2.5 ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                } ${textColor} font-semibold rounded-lg hover:opacity-90 transition-opacity`}
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveDraw}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                Salvar Sorteio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirmação de Exclusão */}
      {deleteConfirmModal && selectedGame && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className={`${bgColor} rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-6`}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${textColor}`}>
                  Confirmar Exclusão
                </h3>
                <p className={`text-sm ${textSecondary}`}>
                  Esta ação não pode ser desfeita
                </p>
              </div>
            </div>

            <p className={`text-sm ${textColor}`}>
              Tem certeza que deseja excluir o jogo{" "}
              <span className="font-bold">{selectedGame.nome}</span>?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmModal(false)}
                className={`flex-1 px-4 py-2.5 ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                } ${textColor} font-semibold rounded-lg hover:opacity-90 transition-opacity`}
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
