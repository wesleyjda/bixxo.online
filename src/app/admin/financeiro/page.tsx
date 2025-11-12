"use client";

import { useState } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign,
  Filter,
  Search,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  Plus,
  Download,
  Calendar,
  User,
  CreditCard,
  AlertCircle,
  FileText,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  Edit,
  Trash2,
} from "lucide-react";

type TransactionStatus = "pago" | "pendente" | "cancelado";
type TransactionType = "pix" | "ajuste" | "saque";
type AdjustmentType = "credito" | "debito";
type Gateway = "OpenPix" | "Bynet" | "Cactos";
type ExpenseType = "despesa" | "retirada";
type ExpenseCategory = "Ads" | "Infraestrutura" | "Prêmios" | "Taxas" | "Outros";

interface Transaction {
  id: string;
  usuario: string;
  valor: number;
  status: TransactionStatus;
  metodo: Gateway;
  dataCriacao: string;
  dataPagamento?: string;
  qrCode?: string;
  chavePix?: string;
}

interface Adjustment {
  id: string;
  usuario: string;
  tipo: AdjustmentType;
  valor: number;
  motivo: string;
  responsavel: string;
  data: string;
}

interface Withdrawal {
  id: string;
  usuario: string;
  valor: number;
  metodo: string;
  status: TransactionStatus;
  data: string;
  contaDestino: string;
  banco?: string;
  agencia?: string;
  conta?: string;
}

interface Statement {
  id: string;
  tipo: TransactionType;
  usuario: string;
  valor: number;
  status: TransactionStatus;
  data: string;
  descricao: string;
}

interface Expense {
  id: string;
  tipo: ExpenseType;
  categoria: ExpenseCategory;
  descricao: string;
  valor: number;
  responsavel: string;
  data: string;
}

export default function FinanceiroPage() {
  const [theme] = useState<"light" | "dark">("dark");
  const [activeTab, setActiveTab] = useState<
    "transacoes" | "ajustes" | "saques" | "extrato" | "despesas"
  >("transacoes");

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterGateway, setFilterGateway] = useState<string>("all");
  const [filterDate, setFilterDate] = useState("");
  const [filterExpenseType, setFilterExpenseType] = useState<string>("all");
  const [filterExpenseCategory, setFilterExpenseCategory] = useState<string>("all");
  const [filterResponsavel, setFilterResponsavel] = useState<string>("all");

  // Modals
  const [pixDetailModal, setPixDetailModal] = useState(false);
  const [adjustmentModal, setAdjustmentModal] = useState(false);
  const [withdrawalModal, setWithdrawalModal] = useState(false);
  const [expenseModal, setExpenseModal] = useState(false);
  const [expenseDetailModal, setExpenseDetailModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [selectedWithdrawal, setSelectedWithdrawal] =
    useState<Withdrawal | null>(null);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  // Forms
  const [adjustmentForm, setAdjustmentForm] = useState({
    usuario: "",
    tipo: "credito" as AdjustmentType,
    valor: "",
    motivo: "",
  });

  const [expenseForm, setExpenseForm] = useState({
    tipo: "despesa" as ExpenseType,
    categoria: "Ads" as ExpenseCategory,
    descricao: "",
    valor: "",
    responsavel: "",
    data: new Date().toISOString().split("T")[0],
  });

  // Dados mockados - Despesas e Retiradas
  const expenses: Expense[] = [
    {
      id: "EXP001",
      tipo: "despesa",
      categoria: "Ads",
      descricao: "Campanha Google Ads - Janeiro",
      valor: 2500.0,
      responsavel: "Admin Master",
      data: "10/01/2024 10:00",
    },
    {
      id: "EXP002",
      tipo: "retirada",
      categoria: "Outros",
      descricao: "Retirada mensal - Sócio 1",
      valor: 5000.0,
      responsavel: "João Silva",
      data: "09/01/2024 14:30",
    },
    {
      id: "EXP003",
      tipo: "despesa",
      categoria: "Infraestrutura",
      descricao: "Servidor AWS - Janeiro",
      valor: 850.0,
      responsavel: "Admin Master",
      data: "08/01/2024 09:15",
    },
    {
      id: "EXP004",
      tipo: "despesa",
      categoria: "Prêmios",
      descricao: "Pagamento de prêmios - Semana 1",
      valor: 12000.0,
      responsavel: "Admin Master",
      data: "07/01/2024 16:45",
    },
  ];

  // Calcular totais de despesas e retiradas
  const totalDespesas = expenses
    .filter((e) => e.tipo === "despesa")
    .reduce((sum, e) => sum + e.valor, 0);

  const totalRetiradas = expenses
    .filter((e) => e.tipo === "retirada")
    .reduce((sum, e) => sum + e.valor, 0);

  // Calcular totais do mês atual
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const despesasMes = expenses
    .filter((e) => {
      const expenseDate = new Date(e.data.split(" ")[0].split("/").reverse().join("-"));
      return (
        e.tipo === "despesa" &&
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, e) => sum + e.valor, 0);

  const retiradasMes = expenses
    .filter((e) => {
      const expenseDate = new Date(e.data.split(" ")[0].split("/").reverse().join("-"));
      return (
        e.tipo === "retirada" &&
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, e) => sum + e.valor, 0);

  // Dados mockados
  const stats = {
    saldoCirculacao: 125430.5,
    totalDepositos: 89250.0,
    totalSaques: 45320.0,
    transacoesPendentes: 12,
    valorLiquido: 169360.5,
    totalDespesas: totalDespesas,
    totalRetiradas: totalRetiradas,
  };

  // Saldo líquido considerando despesas e retiradas
  const saldoLiquido = stats.totalDepositos - stats.totalSaques - totalDespesas - totalRetiradas;

  const transactions: Transaction[] = [
    {
      id: "TXN001",
      usuario: "João Silva",
      valor: 150.0,
      status: "pago",
      metodo: "OpenPix",
      dataCriacao: "10/01/2024 14:30",
      dataPagamento: "10/01/2024 14:32",
      qrCode: "00020126580014br.gov.bcb.pix...",
      chavePix: "joao@email.com",
    },
    {
      id: "TXN002",
      usuario: "Maria Santos",
      valor: 500.0,
      status: "pendente",
      metodo: "Bynet",
      dataCriacao: "10/01/2024 15:20",
    },
    {
      id: "TXN003",
      usuario: "Pedro Costa",
      valor: 250.0,
      status: "cancelado",
      metodo: "OpenPix",
      dataCriacao: "09/01/2024 10:15",
    },
    {
      id: "TXN004",
      usuario: "Ana Lima",
      valor: 1000.0,
      status: "pago",
      metodo: "OpenPix",
      dataCriacao: "09/01/2024 16:45",
      dataPagamento: "09/01/2024 16:47",
    },
  ];

  const adjustments: Adjustment[] = [
    {
      id: "ADJ001",
      usuario: "João Silva",
      tipo: "credito",
      valor: 100.0,
      motivo: "Bônus de boas-vindas",
      responsavel: "Admin Master",
      data: "10/01/2024 10:00",
    },
    {
      id: "ADJ002",
      usuario: "Maria Santos",
      tipo: "debito",
      valor: 50.0,
      motivo: "Correção de saldo",
      responsavel: "Admin Master",
      data: "09/01/2024 14:30",
    },
  ];

  const withdrawals: Withdrawal[] = [
    {
      id: "WTH001",
      usuario: "Carlos Souza",
      valor: 300.0,
      metodo: "PIX",
      status: "pendente",
      data: "10/01/2024 11:20",
      contaDestino: "carlos@email.com",
    },
    {
      id: "WTH002",
      usuario: "Juliana Alves",
      valor: 500.0,
      metodo: "Transferência Bancária",
      status: "pago",
      data: "09/01/2024 09:15",
      contaDestino: "Banco do Brasil - Ag: 1234 - Conta: 56789-0",
      banco: "Banco do Brasil",
      agencia: "1234",
      conta: "56789-0",
    },
  ];

  const statements: Statement[] = [
    ...transactions.map((t) => ({
      id: t.id,
      tipo: "pix" as TransactionType,
      usuario: t.usuario,
      valor: t.valor,
      status: t.status,
      data: t.dataCriacao,
      descricao: `Depósito via ${t.metodo}`,
    })),
    ...adjustments.map((a) => ({
      id: a.id,
      tipo: "ajuste" as TransactionType,
      usuario: a.usuario,
      valor: a.tipo === "credito" ? a.valor : -a.valor,
      status: "pago" as TransactionStatus,
      data: a.data,
      descricao: a.motivo,
    })),
    ...withdrawals.map((w) => ({
      id: w.id,
      tipo: "saque" as TransactionType,
      usuario: w.usuario,
      valor: -w.valor,
      status: w.status,
      data: w.data,
      descricao: `Saque via ${w.metodo}`,
    })),
  ].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  // Theme colors
  const bgColor = theme === "dark" ? "bg-[#1A1A1A]" : "bg-white";
  const borderColor = theme === "dark" ? "border-[#2A2A2A]" : "border-gray-200";
  const textColor = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const inputBg = theme === "dark" ? "bg-[#0F0F0F]" : "bg-gray-50";
  const hoverBg = theme === "dark" ? "hover:bg-[#2A2A2A]" : "hover:bg-gray-50";

  // Handlers
  const handleViewPixDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setPixDetailModal(true);
  };

  const handleSyncTransaction = (id: string) => {
    alert(`Sincronizando transação ${id}...`);
  };

  const handleConfirmTransaction = (id: string) => {
    alert(`Transação ${id} confirmada manualmente!`);
  };

  const handleCancelTransaction = (id: string) => {
    if (confirm("Tem certeza que deseja cancelar esta transação?")) {
      alert(`Transação ${id} cancelada!`);
    }
  };

  const handleAddAdjustment = () => {
    if (
      !adjustmentForm.usuario ||
      !adjustmentForm.valor ||
      !adjustmentForm.motivo
    ) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }
    alert(
      `Ajuste de ${adjustmentForm.tipo} de R$ ${adjustmentForm.valor} aplicado para ${adjustmentForm.usuario}`
    );
    setAdjustmentModal(false);
    setAdjustmentForm({ usuario: "", tipo: "credito", valor: "", motivo: "" });
  };

  const handleViewWithdrawal = (withdrawal: Withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setWithdrawalModal(true);
  };

  const handleApproveWithdrawal = (id: string) => {
    if (confirm("Confirmar aprovação deste saque?")) {
      alert(`Saque ${id} aprovado e valor debitado!`);
      setWithdrawalModal(false);
    }
  };

  const handleRejectWithdrawal = (id: string) => {
    if (confirm("Rejeitar este saque e devolver o valor?")) {
      alert(`Saque ${id} rejeitado e valor devolvido!`);
      setWithdrawalModal(false);
    }
  };

  const handleSyncAll = () => {
    alert("Sincronizando todas as transações com os gateways...");
  };

  const handleExportCSV = () => {
    alert("Exportando extrato em CSV...");
  };

  const handleExportPDF = () => {
    alert("Exportando extrato em PDF...");
  };

  const handleAddExpense = () => {
    if (
      !expenseForm.descricao ||
      !expenseForm.valor ||
      !expenseForm.responsavel
    ) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }
    alert(
      `${expenseForm.tipo === "despesa" ? "Despesa" : "Retirada"} de R$ ${expenseForm.valor} registrada com sucesso!`
    );
    setExpenseModal(false);
    setExpenseForm({
      tipo: "despesa",
      categoria: "Ads",
      descricao: "",
      valor: "",
      responsavel: "",
      data: new Date().toISOString().split("T")[0],
    });
  };

  const handleViewExpenseDetails = (expense: Expense) => {
    setSelectedExpense(expense);
    setExpenseDetailModal(true);
  };

  const handleEditExpense = (id: string) => {
    alert(`Editando despesa/retirada ${id}...`);
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este lançamento?")) {
      alert(`Lançamento ${id} excluído!`);
    }
  };

  // Status badge
  const getStatusBadge = (status: TransactionStatus) => {
    const styles = {
      pago: "bg-green-500/20 text-green-400 border-green-500/30",
      pendente: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      cancelado: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    const labels = {
      pago: "Pago",
      pendente: "Pendente",
      cancelado: "Cancelado",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  const getTypeIcon = (type: TransactionType) => {
    const icons = {
      pix: <CreditCard className="w-4 h-4" />,
      ajuste: <FileText className="w-4 h-4" />,
      saque: <TrendingDown className="w-4 h-4" />,
    };
    return icons[type];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${textColor} flex items-center gap-3`}>
            <Wallet className="w-8 h-8 text-green-500" />
            Gestão Financeira
          </h1>
          <p className={textSecondary}>
            Controle completo de transações e carteira do sistema
          </p>
        </div>
        <button
          onClick={handleSyncAll}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          <RefreshCw size={18} />
          Sincronizar Tudo
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {/* Saldo em Circulação */}
        <div
          className={`${bgColor} rounded-xl p-6 border ${borderColor} shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center`}
            >
              <Wallet className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className={`text-sm font-medium ${textSecondary} mb-1`}>
            Saldo em Circulação
          </h3>
          <p className={`text-2xl font-bold ${textColor}`}>
            R$ {stats.saldoCirculacao.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-4 h-4 text-green-400" />
            <span className="text-xs text-green-400">+8.5% este mês</span>
          </div>
        </div>

        {/* Total Depósitos */}
        <div
          className={`${bgColor} rounded-xl p-6 border ${borderColor} shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center`}
            >
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className={`text-sm font-medium ${textSecondary} mb-1`}>
            Total de Depósitos
          </h3>
          <p className={`text-2xl font-bold ${textColor}`}>
            R$ {stats.totalDepositos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-4 h-4 text-green-400" />
            <span className="text-xs text-green-400">+12.3% este mês</span>
          </div>
        </div>

        {/* Total Saques */}
        <div
          className={`${bgColor} rounded-xl p-6 border ${borderColor} shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center`}
            >
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className={`text-sm font-medium ${textSecondary} mb-1`}>
            Total de Saques
          </h3>
          <p className={`text-2xl font-bold ${textColor}`}>
            R$ {stats.totalSaques.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowDownRight className="w-4 h-4 text-red-400" />
            <span className="text-xs text-red-400">-5.2% este mês</span>
          </div>
        </div>

        {/* Total Despesas */}
        <div
          className={`${bgColor} rounded-xl p-6 border ${borderColor} shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center`}
            >
              <Receipt className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className={`text-sm font-medium ${textSecondary} mb-1`}>
            Total de Despesas
          </h3>
          <p className={`text-2xl font-bold ${textColor}`}>
            R$ {stats.totalDespesas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowDownRight className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-orange-400">Operacional</span>
          </div>
        </div>

        {/* Total Retiradas */}
        <div
          className={`${bgColor} rounded-xl p-6 border ${borderColor} shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center`}
            >
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className={`text-sm font-medium ${textSecondary} mb-1`}>
            Total de Retiradas
          </h3>
          <p className={`text-2xl font-bold ${textColor}`}>
            R$ {stats.totalRetiradas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowDownRight className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-purple-400">Sócios</span>
          </div>
        </div>

        {/* Transações Pendentes */}
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
            Transações Pendentes
          </h3>
          <p className={`text-2xl font-bold ${textColor}`}>
            {stats.transacoesPendentes}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <AlertCircle className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-yellow-400">Requer atenção</span>
          </div>
        </div>

        {/* Valor Líquido */}
        <div
          className={`${bgColor} rounded-xl p-6 border ${borderColor} shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center`}
            >
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className={`text-sm font-medium ${textSecondary} mb-1`}>
            Valor Líquido Disponível
          </h3>
          <p className={`text-2xl font-bold ${textColor}`}>
            R$ {stats.valorLiquido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-4 h-4 text-green-400" />
            <span className="text-xs text-green-400">Saldo positivo</span>
          </div>
        </div>
      </div>

      {/* Alerta de Pendências */}
      {stats.transacoesPendentes > 0 && (
        <div
          className={`${
            theme === "dark"
              ? "bg-yellow-900/20 border-yellow-800"
              : "bg-yellow-50 border-yellow-200"
          } border rounded-xl p-4 flex items-start gap-3`}
        >
          <AlertCircle
            className={`w-5 h-5 ${
              theme === "dark" ? "text-yellow-400" : "text-yellow-600"
            } flex-shrink-0 mt-0.5`}
          />
          <div>
            <p
              className={`text-sm font-medium ${
                theme === "dark" ? "text-yellow-200" : "text-yellow-900"
              }`}
            >
              Você tem {stats.transacoesPendentes} transações pendentes há mais
              de 24h
            </p>
            <p
              className={`text-xs ${
                theme === "dark" ? "text-yellow-300" : "text-yellow-700"
              } mt-1`}
            >
              Recomendamos sincronizar ou confirmar manualmente estas
              transações.
            </p>
          </div>
        </div>
      )}

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
            { id: "transacoes", label: "Transações Pix", icon: CreditCard },
            { id: "ajustes", label: "Ajustes de Saldo", icon: FileText },
            { id: "saques", label: "Saques", icon: TrendingDown },
            { id: "despesas", label: "Despesas e Retiradas", icon: Receipt },
            { id: "extrato", label: "Extrato Geral", icon: BarChart3 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(
                  tab.id as "transacoes" | "ajustes" | "saques" | "extrato" | "despesas"
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
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-600" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {/* Aba 1: Transações Pix */}
          {activeTab === "transacoes" && (
            <div className="space-y-6">
              {/* Filtros */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Buscar por ID ou usuário..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors`}
                  />
                </div>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className={`px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-green-500 transition-colors`}
                >
                  <option value="all">Todos os Status</option>
                  <option value="pago">Pago</option>
                  <option value="pendente">Pendente</option>
                  <option value="cancelado">Cancelado</option>
                </select>

                <select
                  value={filterGateway}
                  onChange={(e) => setFilterGateway(e.target.value)}
                  className={`px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-green-500 transition-colors`}
                >
                  <option value="all">Todos os Gateways</option>
                  <option value="OpenPix">OpenPix</option>
                  <option value="Bynet">Bynet</option>
                  <option value="Cactos">Cactos</option>
                </select>

                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className={`px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-green-500 transition-colors`}
                />
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
                        Usuário
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Valor
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Status
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Gateway
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Data Criação
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Data Pagamento
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${borderColor}`}>
                    {transactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className={`${hoverBg} transition-colors`}
                      >
                        <td className={`px-4 py-4 text-sm ${textColor}`}>
                          {transaction.id}
                        </td>
                        <td className={`px-4 py-4 text-sm ${textColor}`}>
                          {transaction.usuario}
                        </td>
                        <td className={`px-4 py-4 text-sm font-semibold text-green-400`}>
                          R$ {transaction.valor.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          {getStatusBadge(transaction.status)}
                        </td>
                        <td className={`px-4 py-4 text-sm ${textColor}`}>
                          {transaction.metodo}
                        </td>
                        <td className={`px-4 py-4 text-sm ${textSecondary}`}>
                          {transaction.dataCriacao}
                        </td>
                        <td className={`px-4 py-4 text-sm ${textSecondary}`}>
                          {transaction.dataPagamento || "-"}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewPixDetails(transaction)}
                              className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                              title="Ver Detalhes"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() =>
                                handleSyncTransaction(transaction.id)
                              }
                              className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
                              title="Sincronizar"
                            >
                              <RefreshCw size={16} />
                            </button>
                            {transaction.status === "pendente" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleConfirmTransaction(transaction.id)
                                  }
                                  className="p-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                                  title="Confirmar"
                                >
                                  <CheckCircle size={16} />
                                </button>
                                <button
                                  onClick={() =>
                                    handleCancelTransaction(transaction.id)
                                  }
                                  className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                  title="Cancelar"
                                >
                                  <XCircle size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Aba 2: Ajustes de Saldo */}
          {activeTab === "ajustes" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${textColor}`}>
                  Histórico de Ajustes Manuais
                </h3>
                <button
                  onClick={() => setAdjustmentModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Plus size={18} />
                  Novo Ajuste
                </button>
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
                        Usuário
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Tipo
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Valor
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Motivo
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Responsável
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Data
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${borderColor}`}>
                    {adjustments.map((adjustment) => (
                      <tr
                        key={adjustment.id}
                        className={`${hoverBg} transition-colors`}
                      >
                        <td className={`px-4 py-4 text-sm ${textColor}`}>
                          {adjustment.id}
                        </td>
                        <td className={`px-4 py-4 text-sm ${textColor}`}>
                          {adjustment.usuario}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              adjustment.tipo === "credito"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {adjustment.tipo === "credito"
                              ? "Crédito"
                              : "Débito"}
                          </span>
                        </td>
                        <td
                          className={`px-4 py-4 text-sm font-semibold ${
                            adjustment.tipo === "credito"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {adjustment.tipo === "credito" ? "+" : "-"}R${" "}
                          {adjustment.valor.toFixed(2)}
                        </td>
                        <td className={`px-4 py-4 text-sm ${textSecondary}`}>
                          {adjustment.motivo}
                        </td>
                        <td className={`px-4 py-4 text-sm ${textColor}`}>
                          {adjustment.responsavel}
                        </td>
                        <td className={`px-4 py-4 text-sm ${textSecondary}`}>
                          {adjustment.data}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Aba 3: Saques */}
          {activeTab === "saques" && (
            <div className="space-y-6">
              <h3 className={`text-lg font-semibold ${textColor}`}>
                Solicitações de Saque
              </h3>

              {/* Filtros */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className={`px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-green-500 transition-colors`}
                >
                  <option value="all">Todos os Status</option>
                  <option value="pago">Aprovado</option>
                  <option value="pendente">Pendente</option>
                  <option value="cancelado">Rejeitado</option>
                </select>

                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className={`px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-green-500 transition-colors`}
                />

                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Buscar usuário..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors`}
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
                        Usuário
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Valor
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Método
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Status
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Data
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Conta Destino
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${borderColor}`}>
                    {withdrawals.map((withdrawal) => (
                      <tr
                        key={withdrawal.id}
                        className={`${hoverBg} transition-colors`}
                      >
                        <td className={`px-4 py-4 text-sm ${textColor}`}>
                          {withdrawal.id}
                        </td>
                        <td className={`px-4 py-4 text-sm ${textColor}`}>
                          {withdrawal.usuario}
                        </td>
                        <td className={`px-4 py-4 text-sm font-semibold text-red-400`}>
                          R$ {withdrawal.valor.toFixed(2)}
                        </td>
                        <td className={`px-4 py-4 text-sm ${textColor}`}>
                          {withdrawal.metodo}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          {getStatusBadge(withdrawal.status)}
                        </td>
                        <td className={`px-4 py-4 text-sm ${textSecondary}`}>
                          {withdrawal.data}
                        </td>
                        <td className={`px-4 py-4 text-sm ${textSecondary}`}>
                          {withdrawal.contaDestino}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <button
                            onClick={() => handleViewWithdrawal(withdrawal)}
                            className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                            title="Ver Detalhes"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Aba 4: Despesas e Retiradas */}
          {activeTab === "despesas" && (
            <div className="space-y-6">
              {/* Cards Internos */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  className={`${bgColor} rounded-xl p-6 border ${borderColor} shadow-lg`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center`}
                    >
                      <Receipt className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className={`text-sm font-medium ${textSecondary} mb-1`}>
                    Total de Despesas (Mês)
                  </h3>
                  <p className={`text-2xl font-bold ${textColor}`}>
                    R$ {despesasMes.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div
                  className={`${bgColor} rounded-xl p-6 border ${borderColor} shadow-lg`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center`}
                    >
                      <User className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className={`text-sm font-medium ${textSecondary} mb-1`}>
                    Total de Retiradas (Mês)
                  </h3>
                  <p className={`text-2xl font-bold ${textColor}`}>
                    R$ {retiradasMes.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div
                  className={`${bgColor} rounded-xl p-6 border ${borderColor} shadow-lg`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center`}
                    >
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className={`text-sm font-medium ${textSecondary} mb-1`}>
                    Saldo Líquido
                  </h3>
                  <p className={`text-2xl font-bold ${saldoLiquido >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    R$ {saldoLiquido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${textColor}`}>
                  Histórico de Despesas e Retiradas
                </h3>
                <button
                  onClick={() => setExpenseModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Plus size={18} />
                  Novo Lançamento
                </button>
              </div>

              {/* Filtros */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select
                  value={filterExpenseType}
                  onChange={(e) => setFilterExpenseType(e.target.value)}
                  className={`px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-green-500 transition-colors`}
                >
                  <option value="all">Todos os Tipos</option>
                  <option value="despesa">Despesa</option>
                  <option value="retirada">Retirada de Sócio</option>
                </select>

                <select
                  value={filterExpenseCategory}
                  onChange={(e) => setFilterExpenseCategory(e.target.value)}
                  className={`px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-green-500 transition-colors`}
                >
                  <option value="all">Todas as Categorias</option>
                  <option value="Ads">Ads</option>
                  <option value="Infraestrutura">Infraestrutura</option>
                  <option value="Prêmios">Prêmios</option>
                  <option value="Taxas">Taxas</option>
                  <option value="Outros">Outros</option>
                </select>

                <select
                  value={filterResponsavel}
                  onChange={(e) => setFilterResponsavel(e.target.value)}
                  className={`px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-green-500 transition-colors`}
                >
                  <option value="all">Todos os Responsáveis</option>
                  <option value="Admin Master">Admin Master</option>
                  <option value="João Silva">João Silva</option>
                </select>

                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className={`px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-green-500 transition-colors`}
                />
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
                        Tipo
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Categoria
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Descrição
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Valor
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Responsável
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Data
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${borderColor}`}>
                    {expenses.map((expense) => (
                      <tr
                        key={expense.id}
                        className={`${hoverBg} transition-colors`}
                      >
                        <td className={`px-4 py-4 text-sm ${textColor}`}>
                          {expense.id}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              expense.tipo === "despesa"
                                ? "bg-orange-500/20 text-orange-400"
                                : "bg-purple-500/20 text-purple-400"
                            }`}
                          >
                            {expense.tipo === "despesa" ? "Despesa" : "Retirada"}
                          </span>
                        </td>
                        <td className={`px-4 py-4 text-sm ${textColor}`}>
                          {expense.categoria}
                        </td>
                        <td className={`px-4 py-4 text-sm ${textSecondary}`}>
                          {expense.descricao}
                        </td>
                        <td className={`px-4 py-4 text-sm font-semibold text-red-400`}>
                          R$ {expense.valor.toFixed(2)}
                        </td>
                        <td className={`px-4 py-4 text-sm ${textColor}`}>
                          {expense.responsavel}
                        </td>
                        <td className={`px-4 py-4 text-sm ${textSecondary}`}>
                          {expense.data}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewExpenseDetails(expense)}
                              className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                              title="Ver Detalhes"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleEditExpense(expense.id)}
                              className="p-1.5 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors"
                              title="Editar"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteExpense(expense.id)}
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

          {/* Aba 5: Extrato Geral */}
          {activeTab === "extrato" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${textColor}`}>
                  Extrato Consolidado
                </h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-500/20 text-blue-400 font-semibold rounded-lg hover:bg-blue-500/30 transition-colors"
                  >
                    <Download size={18} />
                    Exportar CSV
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="flex items-center gap-2 px-4 py-2.5 bg-red-500/20 text-red-400 font-semibold rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <Download size={18} />
                    Exportar PDF
                  </button>
                </div>
              </div>

              {/* Filtros */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  className={`px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-green-500 transition-colors`}
                >
                  <option value="all">Todos os Tipos</option>
                  <option value="pix">Depósitos (Pix)</option>
                  <option value="ajuste">Ajustes Manuais</option>
                  <option value="saque">Saques</option>
                </select>

                <input
                  type="date"
                  className={`px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-green-500 transition-colors`}
                />

                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Buscar usuário..."
                    className={`w-full pl-10 pr-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors`}
                  />
                </div>
              </div>

              {/* Gráfico Placeholder */}
              <div
                className={`${inputBg} border ${borderColor} rounded-xl p-8 text-center`}
              >
                <BarChart3
                  className={`w-16 h-16 ${textSecondary} mx-auto mb-4`}
                />
                <p className={`text-sm ${textSecondary}`}>
                  Gráfico de fluxo de entrada e saída (em desenvolvimento)
                </p>
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
                        Tipo
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Usuário
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Descrição
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Valor
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Status
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider`}
                      >
                        Data
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${borderColor}`}>
                    {statements.map((statement) => (
                      <tr
                        key={statement.id}
                        className={`${hoverBg} transition-colors`}
                      >
                        <td className={`px-4 py-4 text-sm ${textColor}`}>
                          {statement.id}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(statement.tipo)}
                            <span className={textColor}>
                              {statement.tipo === "pix" && "Depósito"}
                              {statement.tipo === "ajuste" && "Ajuste"}
                              {statement.tipo === "saque" && "Saque"}
                            </span>
                          </div>
                        </td>
                        <td className={`px-4 py-4 text-sm ${textColor}`}>
                          {statement.usuario}
                        </td>
                        <td className={`px-4 py-4 text-sm ${textSecondary}`}>
                          {statement.descricao}
                        </td>
                        <td
                          className={`px-4 py-4 text-sm font-semibold ${
                            statement.valor > 0 ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {statement.valor > 0 ? "+" : ""}R${" "}
                          {Math.abs(statement.valor).toFixed(2)}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          {getStatusBadge(statement.status)}
                        </td>
                        <td className={`px-4 py-4 text-sm ${textSecondary}`}>
                          {statement.data}
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

      {/* Modal: Detalhes do Pix */}
      {pixDetailModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className={`${bgColor} rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-6`}
          >
            <div className="flex items-center justify-between">
              <h3 className={`text-xl font-bold ${textColor}`}>
                Detalhes da Transação Pix
              </h3>
              <button
                onClick={() => setPixDetailModal(false)}
                className={`p-2 rounded-lg ${hoverBg} transition-colors`}
              >
                <XCircle className={textSecondary} size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm ${textSecondary} mb-1`}>ID da Transação</p>
                  <p className={`text-base font-semibold ${textColor}`}>
                    {selectedTransaction.id}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${textSecondary} mb-1`}>Usuário</p>
                  <p className={`text-base font-semibold ${textColor}`}>
                    {selectedTransaction.usuario}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${textSecondary} mb-1`}>Valor</p>
                  <p className="text-2xl font-bold text-green-400">
                    R$ {selectedTransaction.valor.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${textSecondary} mb-1`}>Status</p>
                  {getStatusBadge(selectedTransaction.status)}
                </div>
                <div>
                  <p className={`text-sm ${textSecondary} mb-1`}>Gateway</p>
                  <p className={`text-base font-semibold ${textColor}`}>
                    {selectedTransaction.metodo}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${textSecondary} mb-1`}>Chave Pix</p>
                  <p className={`text-base font-semibold ${textColor}`}>
                    {selectedTransaction.chavePix || "-"}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${textSecondary} mb-1`}>Data de Criação</p>
                  <p className={`text-base ${textColor}`}>
                    {selectedTransaction.dataCriacao}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${textSecondary} mb-1`}>Data de Pagamento</p>
                  <p className={`text-base ${textColor}`}>
                    {selectedTransaction.dataPagamento || "-"}
                  </p>
                </div>
              </div>

              {selectedTransaction.qrCode && (
                <div>
                  <p className={`text-sm ${textSecondary} mb-2`}>QR Code Pix</p>
                  <div
                    className={`${inputBg} border ${borderColor} rounded-lg p-4`}
                  >
                    <code className={`text-xs ${textColor} break-all`}>
                      {selectedTransaction.qrCode}
                    </code>
                  </div>
                </div>
              )}

              <div
                className={`${
                  theme === "dark"
                    ? "bg-blue-900/20 border-blue-800"
                    : "bg-blue-50 border-blue-200"
                } border rounded-lg p-4`}
              >
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-blue-200" : "text-blue-900"
                  }`}
                >
                  <strong>Logs de Sincronização:</strong> Última sincronização em{" "}
                  {new Date().toLocaleString("pt-BR")}
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-700">
              <button
                onClick={() => setPixDetailModal(false)}
                className={`flex-1 px-4 py-2.5 ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                } ${textColor} font-semibold rounded-lg hover:opacity-90 transition-opacity`}
              >
                Fechar
              </button>
              {selectedTransaction.status === "pendente" && (
                <>
                  <button
                    onClick={() => {
                      handleConfirmTransaction(selectedTransaction.id);
                      setPixDetailModal(false);
                    }}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Confirmar Pagamento
                  </button>
                  <button
                    onClick={() => {
                      handleCancelTransaction(selectedTransaction.id);
                      setPixDetailModal(false);
                    }}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Cancelar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Novo Ajuste de Saldo */}
      {adjustmentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className={`${bgColor} rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-6`}
          >
            <div className="flex items-center justify-between">
              <h3 className={`text-xl font-bold ${textColor}`}>
                Novo Ajuste de Saldo
              </h3>
              <button
                onClick={() => setAdjustmentModal(false)}
                className={`p-2 rounded-lg ${hoverBg} transition-colors`}
              >
                <XCircle className={textSecondary} size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>
                  Usuário *
                </label>
                <select
                  value={adjustmentForm.usuario}
                  onChange={(e) =>
                    setAdjustmentForm({
                      ...adjustmentForm,
                      usuario: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-green-500 transition-colors`}
                >
                  <option value="">Selecione um usuário</option>
                  <option value="João Silva">João Silva</option>
                  <option value="Maria Santos">Maria Santos</option>
                  <option value="Pedro Costa">Pedro Costa</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>
                  Tipo de Operação *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() =>
                      setAdjustmentForm({ ...adjustmentForm, tipo: "credito" })
                    }
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                      adjustmentForm.tipo === "credito"
                        ? "bg-green-500/20 text-green-400 border-2 border-green-500"
                        : `${inputBg} ${textSecondary} border ${borderColor} hover:border-green-500/50`
                    }`}
                  >
                    <Plus size={18} />
                    Crédito
                  </button>
                  <button
                    onClick={() =>
                      setAdjustmentForm({ ...adjustmentForm, tipo: "debito" })
                    }
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                      adjustmentForm.tipo === "debito"
                        ? "bg-red-500/20 text-red-400 border-2 border-red-500"
                        : `${inputBg} ${textSecondary} border ${borderColor} hover:border-red-500/50`
                    }`}
                  >
                    <TrendingDown size={18} />
                    Débito
                  </button>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>
                  Valor (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={adjustmentForm.valor}
                  onChange={(e) =>
                    setAdjustmentForm({
                      ...adjustmentForm,
                      valor: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-green-500 transition-colors`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>
                  Motivo / Observação *
                </label>
                <textarea
                  rows={3}
                  placeholder="Descreva o motivo do ajuste..."
                  value={adjustmentForm.motivo}
                  onChange={(e) =>
                    setAdjustmentForm({
                      ...adjustmentForm,
                      motivo: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none`}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-700">
              <button
                onClick={() => setAdjustmentModal(false)}
                className={`flex-1 px-4 py-2.5 ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                } ${textColor} font-semibold rounded-lg hover:opacity-90 transition-opacity`}
              >
                Cancelar
              </button>
              <button
                onClick={handleAddAdjustment}
                className={`flex-1 px-4 py-2.5 font-semibold rounded-lg transition-opacity ${
                  adjustmentForm.tipo === "credito"
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90"
                    : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:opacity-90"
                }`}
              >
                Confirmar {adjustmentForm.tipo === "credito" ? "Crédito" : "Débito"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Detalhes do Saque */}
      {withdrawalModal && selectedWithdrawal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className={`${bgColor} rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-6`}
          >
            <div className="flex items-center justify-between">
              <h3 className={`text-xl font-bold ${textColor}`}>
                Detalhes do Saque
              </h3>
              <button
                onClick={() => setWithdrawalModal(false)}
                className={`p-2 rounded-lg ${hoverBg} transition-colors`}
              >
                <XCircle className={textSecondary} size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm ${textSecondary} mb-1`}>ID do Saque</p>
                  <p className={`text-base font-semibold ${textColor}`}>
                    {selectedWithdrawal.id}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${textSecondary} mb-1`}>Usuário</p>
                  <p className={`text-base font-semibold ${textColor}`}>
                    {selectedWithdrawal.usuario}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${textSecondary} mb-1`}>Valor</p>
                  <p className="text-2xl font-bold text-red-400">
                    R$ {selectedWithdrawal.valor.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${textSecondary} mb-1`}>Status</p>
                  {getStatusBadge(selectedWithdrawal.status)}
                </div>
                <div>
                  <p className={`text-sm ${textSecondary} mb-1`}>Método</p>
                  <p className={`text-base font-semibold ${textColor}`}>
                    {selectedWithdrawal.metodo}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${textSecondary} mb-1`}>Data da Solicitação</p>
                  <p className={`text-base ${textColor}`}>
                    {selectedWithdrawal.data}
                  </p>
                </div>
              </div>

              <div
                className={`${inputBg} border ${borderColor} rounded-lg p-4`}
              >
                <p className={`text-sm font-semibold ${textColor} mb-2`}>
                  Dados Bancários
                </p>
                <div className="space-y-1">
                  <p className={`text-sm ${textSecondary}`}>
                    <strong>Conta Destino:</strong>{" "}
                    {selectedWithdrawal.contaDestino}
                  </p>
                  {selectedWithdrawal.banco && (
                    <>
                      <p className={`text-sm ${textSecondary}`}>
                        <strong>Banco:</strong> {selectedWithdrawal.banco}
                      </p>
                      <p className={`text-sm ${textSecondary}`}>
                        <strong>Agência:</strong> {selectedWithdrawal.agencia}
                      </p>
                      <p className={`text-sm ${textSecondary}`}>
                        <strong>Conta:</strong> {selectedWithdrawal.conta}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-700">
              <button
                onClick={() => setWithdrawalModal(false)}
                className={`flex-1 px-4 py-2.5 ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                } ${textColor} font-semibold rounded-lg hover:opacity-90 transition-opacity`}
              >
                Fechar
              </button>
              {selectedWithdrawal.status === "pendente" && (
                <>
                  <button
                    onClick={() => handleApproveWithdrawal(selectedWithdrawal.id)}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Aprovar Saque
                  </button>
                  <button
                    onClick={() => handleRejectWithdrawal(selectedWithdrawal.id)}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Rejeitar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Novo Lançamento (Despesa/Retirada) */}
      {expenseModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className={`${bgColor} rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-6`}
          >
            <div className="flex items-center justify-between">
              <h3 className={`text-xl font-bold ${textColor}`}>
                Novo Lançamento
              </h3>
              <button
                onClick={() => setExpenseModal(false)}
                className={`p-2 rounded-lg ${hoverBg} transition-colors`}
              >
                <XCircle className={textSecondary} size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>
                  Tipo *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() =>
                      setExpenseForm({ ...expenseForm, tipo: "despesa" })
                    }
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                      expenseForm.tipo === "despesa"
                        ? "bg-orange-500/20 text-orange-400 border-2 border-orange-500"
                        : `${inputBg} ${textSecondary} border ${borderColor} hover:border-orange-500/50`
                    }`}
                  >
                    <Receipt size={18} />
                    Despesa
                  </button>
                  <button
                    onClick={() =>
                      setExpenseForm({ ...expenseForm, tipo: "retirada" })
                    }
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                      expenseForm.tipo === "retirada"
                        ? "bg-purple-500/20 text-purple-400 border-2 border-purple-500"
                        : `${inputBg} ${textSecondary} border ${borderColor} hover:border-purple-500/50`
                    }`}
                  >
                    <User size={18} />
                    Retirada de Sócio
                  </button>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>
                  Categoria *
                </label>
                <select
                  value={expenseForm.categoria}
                  onChange={(e) =>
                    setExpenseForm({
                      ...expenseForm,
                      categoria: e.target.value as ExpenseCategory,
                    })
                  }
                  className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-green-500 transition-colors`}
                >
                  <option value="Ads">Ads</option>
                  <option value="Infraestrutura">Infraestrutura</option>
                  <option value="Prêmios">Prêmios</option>
                  <option value="Taxas">Taxas</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>
                  Valor (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={expenseForm.valor}
                  onChange={(e) =>
                    setExpenseForm({
                      ...expenseForm,
                      valor: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-green-500 transition-colors`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>
                  Descrição / Observação *
                </label>
                <textarea
                  rows={3}
                  placeholder="Descreva o lançamento..."
                  value={expenseForm.descricao}
                  onChange={(e) =>
                    setExpenseForm({
                      ...expenseForm,
                      descricao: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>
                  Responsável *
                </label>
                <input
                  type="text"
                  placeholder="Nome do responsável"
                  value={expenseForm.responsavel}
                  onChange={(e) =>
                    setExpenseForm({
                      ...expenseForm,
                      responsavel: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>
                  Data *
                </label>
                <input
                  type="date"
                  value={expenseForm.data}
                  onChange={(e) =>
                    setExpenseForm({
                      ...expenseForm,
                      data: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-2.5 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:outline-none focus:border-green-500 transition-colors`}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-700">
              <button
                onClick={() => setExpenseModal(false)}
                className={`flex-1 px-4 py-2.5 ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                } ${textColor} font-semibold rounded-lg hover:opacity-90 transition-opacity`}
              >
                Cancelar
              </button>
              <button
                onClick={handleAddExpense}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                Salvar Lançamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Detalhes da Despesa/Retirada */}
      {expenseDetailModal && selectedExpense && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className={`${bgColor} rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-6`}
          >
            <div className="flex items-center justify-between">
              <h3 className={`text-xl font-bold ${textColor}`}>
                Detalhes do Lançamento
              </h3>
              <button
                onClick={() => setExpenseDetailModal(false)}
                className={`p-2 rounded-lg ${hoverBg} transition-colors`}
              >
                <XCircle className={textSecondary} size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm ${textSecondary} mb-1`}>ID</p>
                  <p className={`text-base font-semibold ${textColor}`}>
                    {selectedExpense.id}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${textSecondary} mb-1`}>Tipo</p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedExpense.tipo === "despesa"
                        ? "bg-orange-500/20 text-orange-400"
                        : "bg-purple-500/20 text-purple-400"
                    }`}
                  >
                    {selectedExpense.tipo === "despesa" ? "Despesa" : "Retirada"}
                  </span>
                </div>
                <div>
                  <p className={`text-sm ${textSecondary} mb-1`}>Categoria</p>
                  <p className={`text-base font-semibold ${textColor}`}>
                    {selectedExpense.categoria}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${textSecondary} mb-1`}>Valor</p>
                  <p className="text-2xl font-bold text-red-400">
                    R$ {selectedExpense.valor.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${textSecondary} mb-1`}>Responsável</p>
                  <p className={`text-base font-semibold ${textColor}`}>
                    {selectedExpense.responsavel}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${textSecondary} mb-1`}>Data</p>
                  <p className={`text-base ${textColor}`}>
                    {selectedExpense.data}
                  </p>
                </div>
              </div>

              <div>
                <p className={`text-sm ${textSecondary} mb-2`}>Descrição</p>
                <div
                  className={`${inputBg} border ${borderColor} rounded-lg p-4`}
                >
                  <p className={`text-sm ${textColor}`}>
                    {selectedExpense.descricao}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-700">
              <button
                onClick={() => setExpenseDetailModal(false)}
                className={`flex-1 px-4 py-2.5 ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                } ${textColor} font-semibold rounded-lg hover:opacity-90 transition-opacity`}
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  handleEditExpense(selectedExpense.id);
                  setExpenseDetailModal(false);
                }}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                Editar
              </button>
              <button
                onClick={() => {
                  handleDeleteExpense(selectedExpense.id);
                  setExpenseDetailModal(false);
                }}
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
