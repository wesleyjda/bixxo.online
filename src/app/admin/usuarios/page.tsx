'use client';

import { useState } from 'react';
import StatCard from '@/components/admin/StatCard';
import DataTable from '@/components/admin/DataTable';
import Modal from '@/components/admin/Modal';
import MultiStepModal from '@/components/admin/MultiStepModal';
import {
  Users,
  UserCheck,
  UserX,
  Shield,
  Briefcase,
  User,
  Search,
  Filter,
  Edit,
  Lock,
  Unlock,
  Wallet,
  Trash2,
  History,
  Plus,
  Minus,
  UserPlus,
  Mail,
  KeyRound,
  UserCog,
  CheckCircle
} from 'lucide-react';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: 'admin' | 'staff' | 'player';
  status: 'ativo' | 'bloqueado';
  saldo: number;
  dataCadastro: string;
}

export default function UsuariosPage() {
  const [theme] = useState<'light' | 'dark'>('dark');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Modals
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [balanceModalOpen, setBalanceModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [createUserModalOpen, setCreateUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);

  // Form states
  const [editForm, setEditForm] = useState({ nome: '', email: '', role: 'player' });
  const [balanceForm, setBalanceForm] = useState({ tipo: 'credito', valor: '' });

  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const [newUserForm, setNewUserForm] = useState({
    // Step 1: Dados Pessoais
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    dataNascimento: '',
    
    // Step 2: Credenciais
    senha: '',
    confirmarSenha: '',
    
    // Step 3: Configurações
    role: 'player' as 'admin' | 'staff' | 'player',
    status: 'ativo' as 'ativo' | 'bloqueado',
    saldoInicial: '',
    
    // Step 4: Revisão
    observacoes: ''
  });

  const steps = [
    { id: 1, title: 'Dados Pessoais', description: 'Informações básicas' },
    { id: 2, title: 'Credenciais', description: 'Senha de acesso' },
    { id: 3, title: 'Configurações', description: 'Cargo e permissões' },
    { id: 4, title: 'Revisão', description: 'Confirmar dados' }
  ];

  // Dados mockados
  const usuarios: Usuario[] = [
    { id: 1, nome: 'Admin Master', email: 'admin@jogo.com', role: 'admin', status: 'ativo', saldo: 50000, dataCadastro: '01/01/2024' },
    { id: 2, nome: 'João Silva', email: 'joao@email.com', role: 'player', status: 'ativo', saldo: 1250.50, dataCadastro: '05/01/2024' },
    { id: 3, nome: 'Maria Santos', email: 'maria@email.com', role: 'player', status: 'ativo', saldo: 3420.00, dataCadastro: '07/01/2024' },
    { id: 4, nome: 'Pedro Costa', email: 'pedro@email.com', role: 'player', status: 'bloqueado', saldo: 0, dataCadastro: '08/01/2024' },
    { id: 5, nome: 'Ana Lima', email: 'ana@email.com', role: 'staff', status: 'ativo', saldo: 5000, dataCadastro: '03/01/2024' },
    { id: 6, nome: 'Carlos Souza', email: 'carlos@email.com', role: 'player', status: 'ativo', saldo: 890.75, dataCadastro: '09/01/2024' },
    { id: 7, nome: 'Juliana Alves', email: 'juliana@email.com', role: 'player', status: 'ativo', saldo: 2100.00, dataCadastro: '10/01/2024' },
    { id: 8, nome: 'Roberto Dias', email: 'roberto@email.com', role: 'player', status: 'bloqueado', saldo: 150.00, dataCadastro: '06/01/2024' }
  ];

  const historicoMock = [
    { id: 1, tipo: 'Aposta', descricao: 'Grupo 15 - Jacaré', valor: -50.00, data: '10/01/2024 14:30' },
    { id: 2, tipo: 'Prêmio', descricao: 'Ganhou Dezena 45', valor: 500.00, data: '10/01/2024 12:15' },
    { id: 3, tipo: 'Depósito', descricao: 'PIX recebido', valor: 1000.00, data: '09/01/2024 18:20' },
    { id: 4, tipo: 'Saque', descricao: 'PIX enviado', valor: -300.00, data: '08/01/2024 10:45' }
  ];

  // Estatísticas
  const totalUsuarios = usuarios.length;
  const usuariosAtivos = usuarios.filter(u => u.status === 'ativo').length;
  const usuariosBloqueados = usuarios.filter(u => u.status === 'bloqueado').length;
  const admins = usuarios.filter(u => u.role === 'admin').length;
  const staffs = usuarios.filter(u => u.role === 'staff').length;
  const jogadores = usuarios.filter(u => u.role === 'player').length;

  const stats = [
    { title: 'Total de Usuários', value: totalUsuarios.toString(), icon: Users, trend: { value: '+12% este mês', isPositive: true } },
    { title: 'Usuários Ativos', value: usuariosAtivos.toString(), icon: UserCheck, trend: { value: `${((usuariosAtivos/totalUsuarios)*100).toFixed(0)}% do total`, isPositive: true } },
    { title: 'Bloqueados', value: usuariosBloqueados.toString(), icon: UserX, trend: { value: `${((usuariosBloqueados/totalUsuarios)*100).toFixed(0)}% do total`, isPositive: false } },
    { title: 'Administradores', value: admins.toString(), icon: Shield, trend: { value: 'Acesso total', isPositive: true } },
    { title: 'Staff', value: staffs.toString(), icon: Briefcase, trend: { value: 'Moderadores', isPositive: true } },
    { title: 'Jogadores', value: jogadores.toString(), icon: User, trend: { value: `${((jogadores/totalUsuarios)*100).toFixed(0)}% do total`, isPositive: true } }
  ];

  // Filtros
  const filteredUsers = usuarios.filter(user => {
    const matchSearch = user.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === 'all' || user.role === filterRole;
    const matchStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  // Handlers
  const handleEdit = (user: Usuario) => {
    setSelectedUser(user);
    setEditForm({ nome: user.nome, email: user.email, role: user.role });
    setEditModalOpen(true);
  };

  const handleBalance = (user: Usuario) => {
    setSelectedUser(user);
    setBalanceForm({ tipo: 'credito', valor: '' });
    setBalanceModalOpen(true);
  };

  const handleHistory = (user: Usuario) => {
    setSelectedUser(user);
    setHistoryModalOpen(true);
  };

  const handleToggleStatus = (user: Usuario) => {
    alert(`${user.status === 'ativo' ? 'Bloquear' : 'Desbloquear'} usuário: ${user.nome}`);
  };

  const handleDelete = (user: Usuario) => {
    if (confirm(`Tem certeza que deseja excluir o usuário ${user.nome}?`)) {
      alert(`Usuário ${user.nome} excluído!`);
    }
  };

  const handleSaveEdit = () => {
    alert(`Usuário ${selectedUser?.nome} atualizado com sucesso!`);
    setEditModalOpen(false);
  };

  const handleSaveBalance = () => {
    const valor = parseFloat(balanceForm.valor);
    if (isNaN(valor) || valor <= 0) {
      alert('Digite um valor válido!');
      return;
    }
    alert(`${balanceForm.tipo === 'credito' ? 'Crédito' : 'Débito'} de R$ ${valor.toFixed(2)} aplicado para ${selectedUser?.nome}`);
    setBalanceModalOpen(false);
  };

  // Multi-step handlers
  const handleOpenCreateUser = () => {
    setNewUserForm({
      nome: '',
      email: '',
      telefone: '',
      cpf: '',
      dataNascimento: '',
      senha: '',
      confirmarSenha: '',
      role: 'player',
      status: 'ativo',
      saldoInicial: '',
      observacoes: ''
    });
    setCurrentStep(1);
    setCreateUserModalOpen(true);
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!newUserForm.nome || !newUserForm.email) {
          alert('Preencha nome e email!');
          return false;
        }
        return true;
      case 2:
        if (!newUserForm.senha || newUserForm.senha !== newUserForm.confirmarSenha) {
          alert('Senhas não conferem!');
          return false;
        }
        if (newUserForm.senha.length < 6) {
          alert('Senha deve ter no mínimo 6 caracteres!');
          return false;
        }
        return true;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return true;
    }
  };

  const handleFinishCreateUser = () => {
    if (validateCurrentStep()) {
      alert(`Usuário ${newUserForm.nome} cadastrado com sucesso!`);
      setCreateUserModalOpen(false);
    }
  };

  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        return newUserForm.nome.length > 0 && newUserForm.email.length > 0;
      case 2:
        return newUserForm.senha.length >= 6 && newUserForm.senha === newUserForm.confirmarSenha;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      admin: 'bg-[#FFD700]/20 text-[#FFD700] border-[#FFD700]/30',
      staff: 'bg-[#0066FF]/20 text-[#0066FF] border-[#0066FF]/30',
      player: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    const labels = { admin: 'Admin', staff: 'Staff', player: 'Jogador' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[role as keyof typeof styles]}`}>
        {labels[role as keyof typeof labels]}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        status === 'ativo' 
          ? 'bg-[#00FF88]/20 text-[#00FF88]' 
          : 'bg-red-500/20 text-red-400'
      }`}>
        {status === 'ativo' ? 'Ativo' : 'Bloqueado'}
      </span>
    );
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nome', label: 'Nome' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Cargo', render: (value: string) => getRoleBadge(value) },
    { key: 'status', label: 'Status', render: (value: string) => getStatusBadge(value) },
    { 
      key: 'saldo', 
      label: 'Saldo', 
      render: (value: number) => (
        <span className="font-semibold text-[#00FF88]">
          R$ {value.toFixed(2)}
        </span>
      )
    },
    { key: 'dataCadastro', label: 'Cadastro' },
    {
      key: 'acoes',
      label: 'Ações',
      render: (_: any, user: Usuario) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(user)}
            className="p-1.5 rounded-lg bg-[#0066FF]/20 text-[#0066FF] hover:bg-[#0066FF]/30 transition-colors"
            title="Editar"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleToggleStatus(user)}
            className={`p-1.5 rounded-lg transition-colors ${
              user.status === 'ativo'
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-[#00FF88]/20 text-[#00FF88] hover:bg-[#00FF88]/30'
            }`}
            title={user.status === 'ativo' ? 'Bloquear' : 'Desbloquear'}
          >
            {user.status === 'ativo' ? <Lock size={16} /> : <Unlock size={16} />}
          </button>
          <button
            onClick={() => handleBalance(user)}
            className="p-1.5 rounded-lg bg-[#00FF88]/20 text-[#00FF88] hover:bg-[#00FF88]/30 transition-colors"
            title="Ajustar Saldo"
          >
            <Wallet size={16} />
          </button>
          <button
            onClick={() => handleHistory(user)}
            className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
            title="Histórico"
          >
            <History size={16} />
          </button>
          <button
            onClick={() => handleDelete(user)}
            className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
            title="Excluir"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={newUserForm.nome}
                  onChange={(e) => setNewUserForm({ ...newUserForm, nome: e.target.value })}
                  placeholder="Digite o nome completo"
                  className="w-full px-4 py-2.5 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF88] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  placeholder="email@exemplo.com"
                  className="w-full px-4 py-2.5 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF88] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={newUserForm.telefone}
                  onChange={(e) => setNewUserForm({ ...newUserForm, telefone: e.target.value })}
                  placeholder="(00) 00000-0000"
                  className="w-full px-4 py-2.5 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF88] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  CPF
                </label>
                <input
                  type="text"
                  value={newUserForm.cpf}
                  onChange={(e) => setNewUserForm({ ...newUserForm, cpf: e.target.value })}
                  placeholder="000.000.000-00"
                  className="w-full px-4 py-2.5 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF88] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  value={newUserForm.dataNascimento}
                  onChange={(e) => setNewUserForm({ ...newUserForm, dataNascimento: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg text-white focus:outline-none focus:border-[#00FF88] transition-colors"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="bg-[#0066FF]/10 border border-[#0066FF]/30 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <KeyRound className="text-[#0066FF] mt-0.5" size={20} />
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">Segurança da Senha</h4>
                  <p className="text-xs text-gray-400">
                    A senha deve ter no mínimo 6 caracteres e será enviada por email ao usuário.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Senha *
              </label>
              <input
                type="password"
                value={newUserForm.senha}
                onChange={(e) => setNewUserForm({ ...newUserForm, senha: e.target.value })}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-2.5 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF88] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirmar Senha *
              </label>
              <input
                type="password"
                value={newUserForm.confirmarSenha}
                onChange={(e) => setNewUserForm({ ...newUserForm, confirmarSenha: e.target.value })}
                placeholder="Digite a senha novamente"
                className="w-full px-4 py-2.5 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF88] transition-colors"
              />
              {newUserForm.senha && newUserForm.confirmarSenha && newUserForm.senha !== newUserForm.confirmarSenha && (
                <p className="text-xs text-red-400 mt-1">As senhas não conferem</p>
              )}
              {newUserForm.senha && newUserForm.senha.length < 6 && (
                <p className="text-xs text-red-400 mt-1">Senha muito curta (mínimo 6 caracteres)</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cargo / Permissão *
                </label>
                <select
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value as any })}
                  className="w-full px-4 py-2.5 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg text-white focus:outline-none focus:border-[#00FF88] transition-colors"
                >
                  <option value="player">Jogador</option>
                  <option value="staff">Staff / Moderador</option>
                  <option value="admin">Administrador</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {newUserForm.role === 'admin' && 'Acesso total ao sistema'}
                  {newUserForm.role === 'staff' && 'Acesso moderado ao painel'}
                  {newUserForm.role === 'player' && 'Acesso apenas às apostas'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status Inicial *
                </label>
                <select
                  value={newUserForm.status}
                  onChange={(e) => setNewUserForm({ ...newUserForm, status: e.target.value as any })}
                  className="w-full px-4 py-2.5 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg text-white focus:outline-none focus:border-[#00FF88] transition-colors"
                >
                  <option value="ativo">Ativo</option>
                  <option value="bloqueado">Bloqueado</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Saldo Inicial (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newUserForm.saldoInicial}
                  onChange={(e) => setNewUserForm({ ...newUserForm, saldoInicial: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-4 py-2.5 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF88] transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Deixe em branco para iniciar com saldo zero
                </p>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="bg-[#00FF88]/10 border border-[#00FF88]/30 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-[#00FF88] mt-0.5" size={20} />
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">Revise os Dados</h4>
                  <p className="text-xs text-gray-400">
                    Confira todas as informações antes de finalizar o cadastro.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-[#0F0F0F] p-4 rounded-lg border border-[#2A2A2A]">
                <h4 className="text-sm font-semibold text-[#00FF88] mb-3">Dados Pessoais</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Nome:</span>
                    <p className="text-white font-medium">{newUserForm.nome || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <p className="text-white font-medium">{newUserForm.email || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Telefone:</span>
                    <p className="text-white font-medium">{newUserForm.telefone || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">CPF:</span>
                    <p className="text-white font-medium">{newUserForm.cpf || '-'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#0F0F0F] p-4 rounded-lg border border-[#2A2A2A]">
                <h4 className="text-sm font-semibold text-[#0066FF] mb-3">Configurações</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Cargo:</span>
                    <p className="text-white font-medium">
                      {newUserForm.role === 'admin' && 'Administrador'}
                      {newUserForm.role === 'staff' && 'Staff / Moderador'}
                      {newUserForm.role === 'player' && 'Jogador'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <p className="text-white font-medium">
                      {newUserForm.status === 'ativo' ? 'Ativo' : 'Bloqueado'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Saldo Inicial:</span>
                    <p className="text-white font-medium">
                      R$ {newUserForm.saldoInicial || '0.00'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Observações (Opcional)
              </label>
              <textarea
                value={newUserForm.observacoes}
                onChange={(e) => setNewUserForm({ ...newUserForm, observacoes: e.target.value })}
                placeholder="Adicione observações sobre este usuário..."
                rows={3}
                className="w-full px-4 py-2.5 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF88] transition-colors resize-none"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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

      {/* Filtros */}
      <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2A2A2A]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="text-[#00FF88]" size={20} />
            <h3 className="text-lg font-semibold text-white">Filtros</h3>
          </div>
          
          <button
            onClick={handleOpenCreateUser}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#00FF88] to-[#0066FF] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            <UserPlus size={18} />
            Cadastrar Novo Usuário
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF88] transition-colors"
            />
          </div>

          {/* Filtro Cargo */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2.5 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg text-white focus:outline-none focus:border-[#00FF88] transition-colors"
          >
            <option value="all">Todos os Cargos</option>
            <option value="admin">Administradores</option>
            <option value="staff">Staff</option>
            <option value="player">Jogadores</option>
          </select>

          {/* Filtro Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg text-white focus:outline-none focus:border-[#00FF88] transition-colors"
          >
            <option value="all">Todos os Status</option>
            <option value="ativo">Ativos</option>
            <option value="bloqueado">Bloqueados</option>
          </select>
        </div>
      </div>

      {/* Tabela de Usuários */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">
            Lista de Usuários ({filteredUsers.length})
          </h3>
        </div>
        <DataTable columns={columns} data={filteredUsers} theme={theme} />
      </div>

      {/* Modal Cadastrar Usuário (Multi-Step) */}
      <MultiStepModal
        isOpen={createUserModalOpen}
        onClose={() => setCreateUserModalOpen(false)}
        title="Cadastrar Novo Usuário"
        steps={steps}
        currentStep={currentStep}
        onNext={handleNextStep}
        onPrevious={handlePreviousStep}
        onFinish={handleFinishCreateUser}
        canGoNext={canGoNext()}
        theme={theme}
      >
        {renderStepContent()}
      </MultiStepModal>

      {/* Modal Editar Usuário */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Editar Usuário"
        theme={theme}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
            <input
              type="text"
              value={editForm.nome}
              onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg text-white focus:outline-none focus:border-[#00FF88] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg text-white focus:outline-none focus:border-[#00FF88] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Cargo</label>
            <select
              value={editForm.role}
              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg text-white focus:outline-none focus:border-[#00FF88] transition-colors"
            >
              <option value="player">Jogador</option>
              <option value="staff">Staff</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSaveEdit}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#00FF88] to-[#0066FF] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Salvar Alterações
            </button>
            <button
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2.5 bg-[#2A2A2A] text-white font-semibold rounded-lg hover:bg-[#3A3A3A] transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Ajustar Saldo */}
      <Modal
        isOpen={balanceModalOpen}
        onClose={() => setBalanceModalOpen(false)}
        title="Ajustar Saldo"
        theme={theme}
      >
        <div className="space-y-4">
          <div className="bg-[#0F0F0F] p-4 rounded-lg border border-[#2A2A2A]">
            <div className="text-sm text-gray-400 mb-1">Saldo Atual</div>
            <div className="text-2xl font-bold text-[#00FF88]">
              R$ {selectedUser?.saldo.toFixed(2)}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Operação</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setBalanceForm({ ...balanceForm, tipo: 'credito' })}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                  balanceForm.tipo === 'credito'
                    ? 'bg-[#00FF88]/20 text-[#00FF88] border-2 border-[#00FF88]'
                    : 'bg-[#0F0F0F] text-gray-400 border border-[#2A2A2A] hover:border-[#00FF88]/50'
                }`}
              >
                <Plus size={18} />
                Crédito
              </button>
              <button
                onClick={() => setBalanceForm({ ...balanceForm, tipo: 'debito' })}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                  balanceForm.tipo === 'debito'
                    ? 'bg-red-500/20 text-red-400 border-2 border-red-500'
                    : 'bg-[#0F0F0F] text-gray-400 border border-[#2A2A2A] hover:border-red-500/50'
                }`}
              >
                <Minus size={18} />
                Débito
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={balanceForm.valor}
              onChange={(e) => setBalanceForm({ ...balanceForm, valor: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg text-white focus:outline-none focus:border-[#00FF88] transition-colors"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSaveBalance}
              className={`flex-1 px-4 py-2.5 font-semibold rounded-lg transition-opacity ${
                balanceForm.tipo === 'credito'
                  ? 'bg-gradient-to-r from-[#00FF88] to-[#0066FF] text-white hover:opacity-90'
                  : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:opacity-90'
              }`}
            >
              Confirmar {balanceForm.tipo === 'credito' ? 'Crédito' : 'Débito'}
            </button>
            <button
              onClick={() => setBalanceModalOpen(false)}
              className="px-4 py-2.5 bg-[#2A2A2A] text-white font-semibold rounded-lg hover:bg-[#3A3A3A] transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Histórico */}
      <Modal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        title={`Histórico - ${selectedUser?.nome}`}
        theme={theme}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0F0F0F] p-4 rounded-lg border border-[#2A2A2A]">
              <div className="text-sm text-gray-400 mb-1">Saldo Atual</div>
              <div className="text-xl font-bold text-[#00FF88]">
                R$ {selectedUser?.saldo.toFixed(2)}
              </div>
            </div>
            <div className="bg-[#0F0F0F] p-4 rounded-lg border border-[#2A2A2A]">
              <div className="text-sm text-gray-400 mb-1">Total de Apostas</div>
              <div className="text-xl font-bold text-[#0066FF]">
                {historicoMock.filter(h => h.tipo === 'Aposta').length}
              </div>
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {historicoMock.map((item) => (
              <div
                key={item.id}
                className="bg-[#0F0F0F] p-4 rounded-lg border border-[#2A2A2A] hover:border-[#00FF88]/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.tipo === 'Prêmio' || item.tipo === 'Depósito'
                      ? 'bg-[#00FF88]/20 text-[#00FF88]'
                      : item.tipo === 'Aposta' || item.tipo === 'Saque'
                      ? 'bg-[#0066FF]/20 text-[#0066FF]'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {item.tipo}
                  </span>
                  <span className={`text-lg font-bold ${
                    item.valor > 0 ? 'text-[#00FF88]' : 'text-red-400'
                  }`}>
                    {item.valor > 0 ? '+' : ''}R$ {Math.abs(item.valor).toFixed(2)}
                  </span>
                </div>
                <div className="text-sm text-gray-300 mb-1">{item.descricao}</div>
                <div className="text-xs text-gray-500">{item.data}</div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
