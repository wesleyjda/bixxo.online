"use client";

import { useState } from "react";
import {
  Megaphone,
  Plus,
  Search,
  Eye,
  Edit,
  Power,
  Copy,
  Trash2,
  XCircle,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Gift,
  Zap,
  Bell,
  Target,
  BarChart3,
  Image as ImageIcon,
  Clock,
  CheckCircle,
  AlertCircle,
  History,
} from "lucide-react";

type CampaignStatus = "ativa" | "encerrada" | "programada";
type CampaignType =
  | "bonus"
  | "cashback"
  | "sorteio"
  | "aviso"
  | "especial";
type PublicoAlvo = "todos" | "novos" | "vips" | "personalizado";

interface Campaign {
  id: string;
  nome: string;
  tipo: CampaignType;
  dataInicio: string;
  dataTermino: string;
  status: CampaignStatus;
  publicoAlvo: PublicoAlvo;
  descricao?: string;
  valorBonus?: number;
  percentualCashback?: number;
  valorMinimo?: number;
  imagemUrl?: string;
  jogadoresImpactados?: number;
  bonusConcedido?: number;
  apostasGeradas?: number;
}

interface HistoryEntry {
  id: string;
  dataHora: string;
  usuario: string;
  acao: string;
  campanha: string;
}

export default function CampanhasPage() {
  const [theme] = useState<"light" | "dark">("dark");
  const [activeTab, setActiveTab] = useState<
    "geral" | "condicoes" | "beneficios" | "comunicacao" | "historico"
  >("geral");

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterPublico, setFilterPublico] = useState<string>("all");

  // Modals
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );

  // Form states
  const [formData, setFormData] = useState({
    nome: "",
    tipo: "bonus" as CampaignType,
    descricao: "",
    valorBonus: "",
    percentualCashback: "",
    valorMinimo: "",
    publicoAlvo: "todos" as PublicoAlvo,
    dataInicio: "",
    dataTermino: "",
    status: "programada" as CampaignStatus,
    imagemUrl: "",
    tituloAviso: "",
    textoAviso: "",
    corDestaque: "#8B5CF6",
    exibicao: "tela-inicial",
  });

  // Dados mockados
  const stats = {
    totalCampanhas: 24,
    campanhasAtivas: 5,
    campanhasEncerradas: 15,
    campanhasProgramadas: 4,
    ultimaAtualizacao: "10/01/2024 18:30",
  };

  const campaigns: Campaign[] = [
    {
      id: "CAMP001",
      nome: "Bônus de Boas-Vindas 100%",
      tipo: "bonus",
      dataInicio: "01/01/2024",
      dataTermino: "31/01/2024",
      status: "ativa",
      publicoAlvo: "novos",
      descricao: "Bônus de 100% no primeiro depósito",
      valorBonus: 500,
      valorMinimo: 50,
      jogadoresImpactados: 234,
      bonusConcedido: 45600,
      apostasGeradas: 123400,
    },
    {
      id: "CAMP002",
      nome: "Cashback Semanal 10%",
      tipo: "cashback",
      dataInicio: "05/01/2024",
      dataTermino: "05/02/2024",
      status: "ativa",
      publicoAlvo: "todos",
      descricao: "10% de cashback em todas as apostas perdidas",
      percentualCashback: 10,
      jogadoresImpactados: 567,
      bonusConcedido: 12300,
      apostasGeradas: 234500,
    },
    {
      id: "CAMP003",
      nome: "Sorteio de Prêmios - Natal",
      tipo: "sorteio",
      dataInicio: "20/12/2023",
      dataTermino: "25/12/2023",
      status: "encerrada",
      publicoAlvo: "todos",
      descricao: "Sorteio de R$ 10.000 em prêmios",
      jogadoresImpactados: 1234,
      apostasGeradas: 456700,
    },
    {
      id: "CAMP004",
      nome: "Promoção VIP Exclusiva",
      tipo: "especial",
      dataInicio: "15/01/2024",
      dataTermino: "15/02/2024",
      status: "programada",
      publicoAlvo: "vips",
      descricao: "Benefícios exclusivos para jogadores VIP",
      valorBonus: 1000,
    },
    {
      id: "CAMP005",
      nome: "Aviso: Manutenção Programada",
      tipo: "aviso",
      dataInicio: "12/01/2024",
      dataTermino: "12/01/2024",
      status: "programada",
      publicoAlvo: "todos",
      descricao: "Sistema em manutenção das 02h às 04h",
    },
  ];

  const historyEntries: HistoryEntry[] = [
    {
      id: "HIST001",
      dataHora: "10/01/2024 18:30",
      usuario: "Admin João",
      acao: "Criou campanha",
      campanha: "Bônus de Boas-Vindas 100%",
    },
    {
      id: "HIST002",
      dataHora: "10/01/2024 17:15",
      usuario: "Admin Maria",
      acao: "Editou campanha",
      campanha: "Cashback Semanal 10%",
    },
    {
      id: "HIST003",
      dataHora: "10/01/2024 16:00",
      usuario: "Admin Pedro",
      acao: "Encerrou campanha",
      campanha: "Sorteio de Prêmios - Natal",
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
  const handleCreate = () => {
    setFormData({
      nome: "",
      tipo: "bonus",
      descricao: "",
      valorBonus: "",
      percentualCashback: "",
      valorMinimo: "",
      publicoAlvo: "todos",
      dataInicio: "",
      dataTermino: "",
      status: "programada",
      imagemUrl: "",
      tituloAviso: "",
      textoAviso: "",
      corDestaque: "#8B5CF6",
      exibicao: "tela-inicial",
    });
    setCreateModal(true);
  };

  const handleEdit = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setFormData({
      nome: campaign.nome,
      tipo: campaign.tipo,
      descricao: campaign.descricao || "",
      valorBonus: campaign.valorBonus?.toString() || "",
      percentualCashback: campaign.percentualCashback?.toString() || "",
      valorMinimo: campaign.valorMinimo?.toString() || "",
      publicoAlvo: campaign.publicoAlvo,
      dataInicio: campaign.dataInicio,
      dataTermino: campaign.dataTermino,
      status: campaign.status,
      imagemUrl: campaign.imagemUrl || "",
      tituloAviso: "",
      textoAviso: "",
      corDestaque: "#8B5CF6",
      exibicao: "tela-inicial",
    });
    setEditModal(true);
  };

  const handleViewDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setDetailModal(true);
  };

  const handleToggleStatus = (id: string) => {
    alert(`Status da campanha ${id} alterado!`);
  };

  const handleDuplicate = (id: string) => {
    if (confirm("Deseja duplicar esta campanha?")) {
      alert(`Campanha ${id} duplicada com sucesso!`);
    }
  };

  const handleDelete = (id: string) => {
    if (
      confirm(
        "Tem certeza que deseja excluir esta campanha? Esta ação não pode ser desfeita."
      )
    ) {
      alert(`Campanha ${id} excluída!`);
    }
  };

  const handleSave = () => {
    if (!formData.nome || !formData.dataInicio || !formData.dataTermino) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    alert("Campanha salva com sucesso!");
    setCreateModal(false);
    setEditModal(false);
  };

  // Status badge
  const getStatusBadge = (status: CampaignStatus) => {
    const styles = {
      ativa: "bg-green-500/20 text-green-400 border-green-500/30",
      encerrada: "bg-gray-500/20 text-gray-400 border-gray-500/30",
      programada: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    };
    const labels = {
      ativa: "Ativa",
      encerrada: "Encerrada",
      programada: "Programada",
    };
    const icons = {
      ativa: <CheckCircle className="w-3 h-3" />,
      encerrada: <XCircle className="w-3 h-3" />,
      programada: <Clock className="w-3 h-3" />,
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

  const getCampaignTypeIcon = (type: CampaignType) => {
    const icons = {
      bonus: <DollarSign className="w-4 h-4" />,
      cashback: <TrendingUp className="w-4 h-4" />,
      sorteio: <Gift className="w-4 h-4" />,
      aviso: <Bell className="w-4 h-4" />,
      especial: <Zap className="w-4 h-4" />,
    };
    return icons[type];
  };

  const getCampaignTypeLabel = (type: CampaignType) => {
    const labels = {
      bonus: "Bônus",
      cashback: "Cashback",
      sorteio: "Sorteio",
      aviso: "Aviso",
      especial: "Especial",
    };
    return labels[type];
  };

  const getPublicoAlvoLabel = (publico: PublicoAlvo) => {
    const labels = {
      todos: "Todos",
      novos: "Novos Jogadores",
      vips: "VIPs",
      personalizado: "Personalizado",
    };
    return labels[publico];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={`text-3xl font-bold ${textColor} flex items-center gap-3`}
          >
            <Megaphone className="w-8 h-8 text-purple-500" />
            Gestão de Campanhas e Promoções
          </h1>
          <p className={textSecondary}>
            Configure, monitore e ative campanhas promocionais
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus size={18} />
          Nova Campanha
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total de Campanhas */}
        <div
          className={`${bgColor} rounded-xl p-6 border ${borderColor} shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center`}
            >
              <Megaphone className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className={`text-sm font-medium ${textSecondary} mb-1`}>
            Total de Campanhas
          </h3>
          <p className={`text-2xl font-bold ${textColor}`}>
            {stats.totalCampanhas}
          </p>
        </div>

        {/* Campanhas Ativas */}
        <div
          className={`${bgColor} rounded-xl p-6 border ${borderColor} shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center`}
            >
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className={`text-sm font-medium ${textSecondary} mb-1`}>
            Campanhas Ativas
          </h3>
          <p className={`text-2xl font-bold ${textColor}`}>
            {stats.campanhasAtivas}
          </p>
        </div>

        {/* Campanhas Encerradas */}
        <div
          className={`${bgColor} rounded-xl p-6 border ${borderColor} shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center`}
            >
              <XCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className={`text-sm font-medium ${textSecondary} mb-1`}>
            Campanhas Encerradas
          </h3>
          <p className={`text-2xl font-bold ${textColor}`}>
            {stats.campanhasEncerradas}
          </p>
        </div>

        {/* Campanhas Programadas */}
        <div
          className={`${bgColor} rounded-xl p-6 border ${borderColor} shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center`}
            >
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className={`text-sm font-medium ${textSecondary} mb-1`}>
            Campanhas Programadas
          </h3>
          <p className={`text-2xl font-bold ${textColor}`}>
            {stats.campanhasProgramadas}
          </p>
        </div>

        {/* Última Atualização */}
        <div
          className={`${bgColor} rounded-xl p-6 border ${borderColor} shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center`}
            >
              <History className="w-6 h-6 text-white" />
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
            { id: "geral", label: "Geral", icon: Megaphone },
            { id: "condicoes", label: "Condições", icon: Target },
            { id: "beneficios", label: "Benefícios", icon: BarChart3 },
            { id: "comunicacao", label: "Comunicação", icon: Bell },
            { id: "historico", label: "Histórico", icon: History },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(
                  tab.id as
                    | "geral"
                    | "condicoes"
                    | "beneficios"
                    | "comunicacao"
                    | "historico"
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative md:col-span-1">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Buscar por nome ou ID..."
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
                  <option value="ativa">Ativa</option>
                  <option value="encerrada">Encerrada</option>
                  <option value="programada">Programada</option>
                </select>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className={`px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                >
                  <option value="all">Todos os Tipos</option>
                  <option value="bonus">Bônus</option>
                  <option value="cashback">Cashback</option>
                  <option value="sorteio">Sorteio</option>
                  <option value="aviso">Aviso</option>
                  <option value="especial">Especial</option>
                </select>

                <select
                  value={filterPublico}
                  onChange={(e) => setFilterPublico(e.target.value)}
                  className={`px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                >
                  <option value="all">Todos os Públicos</option>
                  <option value="todos">Todos</option>
                  <option value="novos">Novos Jogadores</option>
                  <option value="vips">VIPs</option>
                  <option value="personalizado">Personalizado</option>
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
                        Nome da Campanha
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Tipo
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Data de Início
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Data de Término
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Status
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Público-Alvo
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${borderColor}`}>
                    {campaigns.map((campaign) => (
                      <tr
                        key={campaign.id}
                        className={`${hoverBg} transition-colors ${
                          campaign.status === "ativa"
                            ? "bg-green-500/5"
                            : campaign.status === "programada"
                            ? "bg-yellow-500/5"
                            : ""
                        }`}
                      >
                        <td className={`px-4 py-4 text-sm ${textColor}`}>
                          {campaign.id}
                        </td>
                        <td className={`px-4 py-4 text-sm`}>
                          <p className={`font-semibold ${textColor}`}>
                            {campaign.nome}
                          </p>
                          {campaign.descricao && (
                            <p className={`text-xs ${textSecondary} mt-1`}>
                              {campaign.descricao.substring(0, 50)}...
                            </p>
                          )}
                        </td>
                        <td className={`px-4 py-4 text-sm`}>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 flex items-center gap-1 w-fit">
                            {getCampaignTypeIcon(campaign.tipo)}
                            {getCampaignTypeLabel(campaign.tipo)}
                          </span>
                        </td>
                        <td className={`px-4 py-4 text-sm ${textColor}`}>
                          {campaign.dataInicio}
                        </td>
                        <td className={`px-4 py-4 text-sm ${textColor}`}>
                          {campaign.dataTermino}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          {getStatusBadge(campaign.status)}
                        </td>
                        <td className={`px-4 py-4 text-sm ${textColor}`}>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                            {getPublicoAlvoLabel(campaign.publicoAlvo)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewDetails(campaign)}
                              className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                              title="Ver Detalhes"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleEdit(campaign)}
                              className="p-1.5 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors"
                              title="Editar"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(campaign.id)}
                              className="p-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                              title="Ativar/Desativar"
                            >
                              <Power size={16} />
                            </button>
                            <button
                              onClick={() => handleDuplicate(campaign.id)}
                              className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
                              title="Duplicar"
                            >
                              <Copy size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(campaign.id)}
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

          {/* Aba: Condições e Regras */}
          {activeTab === "condicoes" && (
            <div className="space-y-6">
              <div
                className={`${inputBg} border ${borderColor} rounded-xl p-6`}
              >
                <h3 className={`text-lg font-semibold ${textColor} mb-4`}>
                  Condições Personalizadas de Ativação
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        className={`block text-sm font-medium ${textSecondary} mb-2`}
                      >
                        Tipo de Ativação
                      </label>
                      <select
                        className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                      >
                        <option>Primeiro depósito</option>
                        <option>Volume de apostas</option>
                        <option>Saldo mínimo</option>
                        <option>Código promocional</option>
                      </select>
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium ${textSecondary} mb-2`}
                      >
                        Limite Máximo de Resgate (R$)
                      </label>
                      <input
                        type="number"
                        placeholder="0.00"
                        className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                      />
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium ${textSecondary} mb-2`}
                      >
                        Ativações Permitidas por Jogador
                      </label>
                      <input
                        type="number"
                        placeholder="1"
                        className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                      />
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium ${textSecondary} mb-2`}
                      >
                        Modo de Aplicação
                      </label>
                      <select
                        className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                      >
                        <option>Aplicar automaticamente</option>
                        <option>Necessário código promocional</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <input
                      type="checkbox"
                      id="rollover"
                      className="w-4 h-4 rounded border-gray-600 text-purple-500 focus:ring-purple-500"
                    />
                    <label
                      htmlFor="rollover"
                      className={`text-sm ${textColor}`}
                    >
                      Exigir rollover (multiplicador de apostas antes do saque)
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Aba: Benefícios e Impacto */}
          {activeTab === "beneficios" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  className={`${inputBg} border ${borderColor} rounded-xl p-6`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    <h4 className={`text-sm font-medium ${textSecondary}`}>
                      Jogadores Impactados
                    </h4>
                  </div>
                  <p className={`text-2xl font-bold ${textColor}`}>1,035</p>
                </div>
                <div
                  className={`${inputBg} border ${borderColor} rounded-xl p-6`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    <h4 className={`text-sm font-medium ${textSecondary}`}>
                      Bônus Concedido
                    </h4>
                  </div>
                  <p className={`text-2xl font-bold text-green-400`}>
                    R$ 57.900
                  </p>
                </div>
                <div
                  className={`${inputBg} border ${borderColor} rounded-xl p-6`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    <h4 className={`text-sm font-medium ${textSecondary}`}>
                      Apostas Geradas
                    </h4>
                  </div>
                  <p className={`text-2xl font-bold text-purple-400`}>
                    R$ 358.100
                  </p>
                </div>
                <div
                  className={`${inputBg} border ${borderColor} rounded-xl p-6`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <BarChart3 className="w-5 h-5 text-cyan-400" />
                    <h4 className={`text-sm font-medium ${textSecondary}`}>
                      ROI Estimado
                    </h4>
                  </div>
                  <p className={`text-2xl font-bold text-cyan-400`}>+518%</p>
                </div>
              </div>

              <div
                className={`${inputBg} border ${borderColor} rounded-xl p-6`}
              >
                <h3 className={`text-lg font-semibold ${textColor} mb-4`}>
                  Logs de Campanhas em Execução
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      campanha: "Bônus de Boas-Vindas 100%",
                      jogador: "João Silva",
                      valor: 500,
                      data: "10/01/2024 18:30",
                    },
                    {
                      campanha: "Cashback Semanal 10%",
                      jogador: "Maria Santos",
                      valor: 120,
                      data: "10/01/2024 17:45",
                    },
                    {
                      campanha: "Bônus de Boas-Vindas 100%",
                      jogador: "Pedro Costa",
                      valor: 250,
                      data: "10/01/2024 16:20",
                    },
                  ].map((log, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        theme === "dark" ? "bg-gray-800/50" : "bg-gray-100"
                      }`}
                    >
                      <div>
                        <p className={`text-sm font-semibold ${textColor}`}>
                          {log.campanha}
                        </p>
                        <p className={`text-xs ${textSecondary}`}>
                          {log.jogador} - {log.data}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-green-400">
                        +R$ {log.valor.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Aba: Comunicação */}
          {activeTab === "comunicacao" && (
            <div className="space-y-6">
              <div
                className={`${inputBg} border ${borderColor} rounded-xl p-6`}
              >
                <h3 className={`text-lg font-semibold ${textColor} mb-4`}>
                  Configuração de Comunicação Visual
                </h3>
                <div className="space-y-4">
                  <div>
                    <label
                      className={`block text-sm font-medium ${textSecondary} mb-2`}
                    >
                      Título do Aviso
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Promoção Especial!"
                      className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium ${textSecondary} mb-2`}
                    >
                      Texto do Aviso
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Descreva a promoção..."
                      className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors resize-none`}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        className={`block text-sm font-medium ${textSecondary} mb-2`}
                      >
                        Imagem/Banner Principal
                      </label>
                      <div
                        className={`border-2 border-dashed ${borderColor} rounded-lg p-6 text-center cursor-pointer ${hoverBg} transition-colors`}
                      >
                        <ImageIcon
                          className={`w-12 h-12 ${textSecondary} mx-auto mb-2`}
                        />
                        <p className={`text-sm ${textSecondary}`}>
                          Clique para fazer upload
                        </p>
                        <p className={`text-xs ${textSecondary} mt-1`}>
                          PNG, JPG até 2MB
                        </p>
                      </div>
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium ${textSecondary} mb-2`}
                      >
                        Cor de Destaque
                      </label>
                      <input
                        type="color"
                        defaultValue="#8B5CF6"
                        className={`w-full h-12 rounded-lg border ${borderColor} cursor-pointer`}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium ${textSecondary} mb-2`}
                    >
                      Opção de Exibição
                    </label>
                    <select
                      className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                    >
                      <option>Tela inicial</option>
                      <option>Pop-up de login</option>
                      <option>Seção "Promoções"</option>
                      <option>Banner superior</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Aba: Histórico de Alterações */}
          {activeTab === "historico" && (
            <div className="space-y-6">
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
                        Usuário Responsável
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Ação Executada
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Campanha Afetada
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${borderColor}`}>
                    {historyEntries.map((entry) => (
                      <tr key={entry.id} className={`${hoverBg} transition-colors`}>
                        <td className={`px-4 py-4 text-sm ${textColor}`}>
                          {entry.dataHora}
                        </td>
                        <td className={`px-4 py-4 text-sm ${textColor}`}>
                          {entry.usuario}
                        </td>
                        <td className={`px-4 py-4 text-sm`}>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                            {entry.acao}
                          </span>
                        </td>
                        <td className={`px-4 py-4 text-sm ${textColor}`}>
                          {entry.campanha}
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

      {/* Modal: Criar/Editar Campanha */}
      {(createModal || editModal) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className={`${bgColor} rounded-2xl shadow-2xl max-w-4xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto`}
          >
            <div className="flex items-center justify-between">
              <h3 className={`text-xl font-bold ${textColor}`}>
                {createModal ? "Nova Campanha" : "Editar Campanha"}
              </h3>
              <button
                onClick={() => {
                  setCreateModal(false);
                  setEditModal(false);
                }}
                className={`p-2 rounded-lg ${hoverBg} transition-colors`}
              >
                <XCircle className={textSecondary} size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium ${textSecondary} mb-2`}
                  >
                    Nome da Campanha *
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                    placeholder="Ex: Bônus de Boas-Vindas"
                    className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${textSecondary} mb-2`}
                  >
                    Tipo *
                  </label>
                  <select
                    value={formData.tipo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tipo: e.target.value as CampaignType,
                      })
                    }
                    className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                  >
                    <option value="bonus">Bônus de depósito</option>
                    <option value="cashback">Cashback</option>
                    <option value="aviso">Aviso visual</option>
                    <option value="especial">Campanha especial</option>
                    <option value="sorteio">Sorteio</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${textSecondary} mb-2`}
                >
                  Descrição / Regras
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                  rows={4}
                  placeholder="Descreva as regras e condições da campanha..."
                  className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors resize-none`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(formData.tipo === "bonus" || formData.tipo === "especial") && (
                  <div>
                    <label
                      className={`block text-sm font-medium ${textSecondary} mb-2`}
                    >
                      Valor do Bônus (R$)
                    </label>
                    <input
                      type="number"
                      value={formData.valorBonus}
                      onChange={(e) =>
                        setFormData({ ...formData, valorBonus: e.target.value })
                      }
                      placeholder="0.00"
                      className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                    />
                  </div>
                )}
                {formData.tipo === "cashback" && (
                  <div>
                    <label
                      className={`block text-sm font-medium ${textSecondary} mb-2`}
                    >
                      Percentual de Cashback (%)
                    </label>
                    <input
                      type="number"
                      value={formData.percentualCashback}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          percentualCashback: e.target.value,
                        })
                      }
                      placeholder="0"
                      className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                    />
                  </div>
                )}
                <div>
                  <label
                    className={`block text-sm font-medium ${textSecondary} mb-2`}
                  >
                    Valor Mínimo (R$)
                  </label>
                  <input
                    type="number"
                    value={formData.valorMinimo}
                    onChange={(e) =>
                      setFormData({ ...formData, valorMinimo: e.target.value })
                    }
                    placeholder="0.00"
                    className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${textSecondary} mb-2`}
                  >
                    Público-Alvo *
                  </label>
                  <select
                    value={formData.publicoAlvo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        publicoAlvo: e.target.value as PublicoAlvo,
                      })
                    }
                    className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                  >
                    <option value="todos">Todos</option>
                    <option value="novos">Novos Jogadores</option>
                    <option value="vips">VIPs</option>
                    <option value="personalizado">Personalizado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium ${textSecondary} mb-2`}
                  >
                    Data de Início *
                  </label>
                  <input
                    type="date"
                    value={formData.dataInicio}
                    onChange={(e) =>
                      setFormData({ ...formData, dataInicio: e.target.value })
                    }
                    className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${textSecondary} mb-2`}
                  >
                    Data de Término *
                  </label>
                  <input
                    type="date"
                    value={formData.dataTermino}
                    onChange={(e) =>
                      setFormData({ ...formData, dataTermino: e.target.value })
                    }
                    className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${textSecondary} mb-2`}
                  >
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as CampaignStatus,
                      })
                    }
                    className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-purple-500 transition-colors`}
                  >
                    <option value="ativa">Ativa</option>
                    <option value="programada">Programada</option>
                    <option value="encerrada">Encerrada</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-700">
              <button
                onClick={() => {
                  setCreateModal(false);
                  setEditModal(false);
                }}
                className={`flex-1 px-4 py-2.5 ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                } ${textColor} font-semibold rounded-lg hover:opacity-90 transition-opacity`}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                Salvar Campanha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Detalhes da Campanha */}
      {detailModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className={`${bgColor} rounded-2xl shadow-2xl max-w-3xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto`}
          >
            <div className="flex items-center justify-between">
              <h3 className={`text-xl font-bold ${textColor}`}>
                Detalhes da Campanha
              </h3>
              <button
                onClick={() => setDetailModal(false)}
                className={`p-2 rounded-lg ${hoverBg} transition-colors`}
              >
                <XCircle className={textSecondary} size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm ${textSecondary} mb-1`}>ID</p>
                  <p className={`text-base font-semibold ${textColor}`}>
                    {selectedCampaign.id}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${textSecondary} mb-1`}>Status</p>
                  {getStatusBadge(selectedCampaign.status)}
                </div>
                <div>
                  <p className={`text-sm ${textSecondary} mb-1`}>Nome</p>
                  <p className={`text-base font-semibold ${textColor}`}>
                    {selectedCampaign.nome}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${textSecondary} mb-1`}>Tipo</p>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-400 flex items-center gap-1 w-fit">
                    {getCampaignTypeIcon(selectedCampaign.tipo)}
                    {getCampaignTypeLabel(selectedCampaign.tipo)}
                  </span>
                </div>
              </div>

              {selectedCampaign.descricao && (
                <div>
                  <p className={`text-sm ${textSecondary} mb-2`}>Descrição</p>
                  <p className={`text-base ${textColor}`}>
                    {selectedCampaign.descricao}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                {selectedCampaign.valorBonus && (
                  <div
                    className={`${inputBg} border ${borderColor} rounded-lg p-4`}
                  >
                    <p className={`text-sm ${textSecondary} mb-1`}>
                      Valor do Bônus
                    </p>
                    <p className="text-2xl font-bold text-green-400">
                      R$ {selectedCampaign.valorBonus.toFixed(2)}
                    </p>
                  </div>
                )}
                {selectedCampaign.percentualCashback && (
                  <div
                    className={`${inputBg} border ${borderColor} rounded-lg p-4`}
                  >
                    <p className={`text-sm ${textSecondary} mb-1`}>Cashback</p>
                    <p className="text-2xl font-bold text-purple-400">
                      {selectedCampaign.percentualCashback}%
                    </p>
                  </div>
                )}
                {selectedCampaign.valorMinimo && (
                  <div
                    className={`${inputBg} border ${borderColor} rounded-lg p-4`}
                  >
                    <p className={`text-sm ${textSecondary} mb-1`}>
                      Valor Mínimo
                    </p>
                    <p className="text-2xl font-bold text-yellow-400">
                      R$ {selectedCampaign.valorMinimo.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm ${textSecondary} mb-1`}>
                    Data de Início
                  </p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className={`text-base ${textColor}`}>
                      {selectedCampaign.dataInicio}
                    </p>
                  </div>
                </div>
                <div>
                  <p className={`text-sm ${textSecondary} mb-1`}>
                    Data de Término
                  </p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className={`text-base ${textColor}`}>
                      {selectedCampaign.dataTermino}
                    </p>
                  </div>
                </div>
              </div>

              {selectedCampaign.jogadoresImpactados && (
                <div className="grid grid-cols-3 gap-4">
                  <div
                    className={`${inputBg} border ${borderColor} rounded-lg p-4`}
                  >
                    <p className={`text-sm ${textSecondary} mb-1`}>
                      Jogadores Impactados
                    </p>
                    <p className={`text-2xl font-bold ${textColor}`}>
                      {selectedCampaign.jogadoresImpactados}
                    </p>
                  </div>
                  {selectedCampaign.bonusConcedido && (
                    <div
                      className={`${inputBg} border ${borderColor} rounded-lg p-4`}
                    >
                      <p className={`text-sm ${textSecondary} mb-1`}>
                        Bônus Concedido
                      </p>
                      <p className="text-2xl font-bold text-green-400">
                        R${" "}
                        {selectedCampaign.bonusConcedido.toLocaleString(
                          "pt-BR"
                        )}
                      </p>
                    </div>
                  )}
                  {selectedCampaign.apostasGeradas && (
                    <div
                      className={`${inputBg} border ${borderColor} rounded-lg p-4`}
                    >
                      <p className={`text-sm ${textSecondary} mb-1`}>
                        Apostas Geradas
                      </p>
                      <p className="text-2xl font-bold text-purple-400">
                        R${" "}
                        {selectedCampaign.apostasGeradas.toLocaleString(
                          "pt-BR"
                        )}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-700">
              <button
                onClick={() => setDetailModal(false)}
                className={`flex-1 px-4 py-2.5 ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                } ${textColor} font-semibold rounded-lg hover:opacity-90 transition-opacity`}
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  handleEdit(selectedCampaign);
                  setDetailModal(false);
                }}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                Editar Campanha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
