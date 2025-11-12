'use client';

import { useState } from 'react';
import {
  Users,
  Shield,
  UserCheck,
  UserX,
  Clock,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Lock,
  Unlock,
  History,
  Eye,
  Mail,
  Key,
  CheckCircle,
  XCircle,
  Download,
  Send,
  MessageSquare,
  Activity,
  Monitor,
  AlertTriangle,
  Save,
  X
} from 'lucide-react';

type Tab = 'geral' | 'permissoes' | 'atividades' | 'contatos';

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Gerente' | 'Staff' | 'Suporte';
  status: 'Ativo' | 'Bloqueado';
  lastAccess: string;
}

interface ActivityLog {
  id: number;
  date: string;
  user: string;
  action: string;
  ip: string;
  device: string;
  result: 'Sucesso' | 'Erro';
}

export default function EquipePage() {
  const [activeTab, setActiveTab] = useState<Tab>('geral');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showModal, setShowModal] = useState<'add' | 'edit' | 'message' | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [broadcastMessage, setBroadcastMessage] = useState('');

  // Estados do formulário
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Staff' as TeamMember['role'],
    status: 'Ativo' as TeamMember['status'],
    forcePasswordReset: false
  });

  // Dados mockados
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: 1, name: 'João Silva', email: 'joao@admin.com', role: 'Admin', status: 'Ativo', lastAccess: '16/01/2024 10:30' },
    { id: 2, name: 'Maria Santos', email: 'maria@admin.com', role: 'Gerente', status: 'Ativo', lastAccess: '16/01/2024 09:15' },
    { id: 3, name: 'Pedro Costa', email: 'pedro@admin.com', role: 'Staff', status: 'Ativo', lastAccess: '15/01/2024 18:45' },
    { id: 4, name: 'Ana Oliveira', email: 'ana@admin.com', role: 'Suporte', status: 'Ativo', lastAccess: '15/01/2024 16:20' },
    { id: 5, name: 'Carlos Mendes', email: 'carlos@admin.com', role: 'Staff', status: 'Bloqueado', lastAccess: '10/01/2024 14:00' }
  ]);

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    { id: 1, date: '16/01/2024 10:30', user: 'João Silva', action: 'Aprovou saque de R$ 500,00', ip: '192.168.1.1', device: 'Chrome - Windows', result: 'Sucesso' },
    { id: 2, date: '16/01/2024 09:15', user: 'Maria Santos', action: 'Alterou configuração de gateway', ip: '192.168.1.2', device: 'Firefox - macOS', result: 'Sucesso' },
    { id: 3, date: '15/01/2024 18:45', user: 'Pedro Costa', action: 'Criou nova campanha promocional', ip: '192.168.1.3', device: 'Chrome - Windows', result: 'Sucesso' },
    { id: 4, date: '15/01/2024 16:20', user: 'Ana Oliveira', action: 'Respondeu ticket de suporte #1234', ip: '192.168.1.4', device: 'Safari - iOS', result: 'Sucesso' },
    { id: 5, date: '15/01/2024 14:00', user: 'Carlos Mendes', action: 'Tentativa de acesso negada', ip: '10.0.0.50', device: 'Chrome - Linux', result: 'Erro' }
  ]);

  const [permissions, setPermissions] = useState({
    dashboard: { view: true, edit: false },
    usuarios: { view: true, edit: true },
    apostas: { view: true, edit: true },
    jogos: { view: true, edit: false },
    financeiro: { view: true, edit: true },
    configuracoes: { view: false, edit: false },
    gateways: { view: true, edit: false },
    campanhas: { view: true, edit: true },
    relatorios: { view: true, edit: false },
    suporte: { view: true, edit: true }
  });

  const bgColor = 'bg-[#1A1A1A]';
  const borderColor = 'border-[#2A2A2A]';
  const textColor = 'text-white';
  const textSecondary = 'text-gray-400';
  const hoverBg = 'hover:bg-[#2A2A2A]';

  // Estatísticas
  const stats = {
    total: teamMembers.length,
    admins: teamMembers.filter(m => m.role === 'Admin').length,
    staff: teamMembers.filter(m => m.role === 'Staff' || m.role === 'Gerente').length,
    blocked: teamMembers.filter(m => m.status === 'Bloqueado').length,
    lastAccess: teamMembers[0]?.lastAccess || 'N/A'
  };

  // Filtrar membros
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const tabs = [
    { id: 'geral' as Tab, label: 'Geral', icon: <Users size={20} /> },
    { id: 'permissoes' as Tab, label: 'Permissões', icon: <Shield size={20} /> },
    { id: 'atividades' as Tab, label: 'Atividades', icon: <Activity size={20} /> },
    { id: 'contatos' as Tab, label: 'Contatos', icon: <MessageSquare size={20} /> }
  ];

  const handleAddMember = () => {
    const newMember: TeamMember = {
      id: teamMembers.length + 1,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: formData.status,
      lastAccess: 'Nunca'
    };
    setTeamMembers([...teamMembers, newMember]);
    setShowModal(null);
    resetForm();
    alert('Membro adicionado com sucesso! E-mail de boas-vindas enviado.');
  };

  const handleEditMember = () => {
    if (!selectedMember) return;
    setTeamMembers(teamMembers.map(m => 
      m.id === selectedMember.id 
        ? { ...m, name: formData.name, email: formData.email, role: formData.role, status: formData.status }
        : m
    ));
    setShowModal(null);
    setSelectedMember(null);
    resetForm();
    alert('Membro atualizado com sucesso!');
  };

  const handleDeleteMember = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este membro? Esta ação não pode ser desfeita.')) {
      setTeamMembers(teamMembers.filter(m => m.id !== id));
      alert('Membro excluído com sucesso!');
    }
  };

  const handleToggleStatus = (id: number) => {
    setTeamMembers(teamMembers.map(m => 
      m.id === id 
        ? { ...m, status: m.status === 'Ativo' ? 'Bloqueado' : 'Ativo' }
        : m
    ));
  };

  const handleSendBroadcast = () => {
    if (!broadcastMessage.trim()) {
      alert('Por favor, digite uma mensagem.');
      return;
    }
    alert(`Mensagem enviada para ${teamMembers.filter(m => m.status === 'Ativo').length} membros ativos!`);
    setBroadcastMessage('');
  };

  const handleExportLogs = (format: 'csv' | 'pdf') => {
    alert(`Exportando logs em formato ${format.toUpperCase()}...`);
  };

  const handleClearOldLogs = () => {
    if (confirm('Tem certeza que deseja limpar logs antigos? Esta ação não pode ser desfeita.')) {
      alert('Logs antigos foram removidos com sucesso!');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'Staff',
      status: 'Ativo',
      forcePasswordReset: false
    });
  };

  const openEditModal = (member: TeamMember) => {
    setSelectedMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      password: '',
      role: member.role,
      status: member.status,
      forcePasswordReset: false
    });
    setShowModal('edit');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${textColor}`}>Gestão da Equipe</h1>
          <p className={textSecondary}>Gerencie usuários internos, permissões e atividades administrativas</p>
        </div>
        <button
          onClick={() => setShowModal('add')}
          className="bg-gradient-to-r from-[#00FF88] to-[#0066FF] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Adicionar Membro
        </button>
      </div>

      {/* Cards Superiores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className={`${bgColor} border ${borderColor} rounded-xl p-4 hover:shadow-lg transition-all duration-300`}>
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mb-3">
            <Users className="text-blue-500" size={24} />
          </div>
          <p className={`text-xs ${textSecondary} mb-1`}>Total de Membros</p>
          <p className={`text-2xl font-bold ${textColor}`}>{stats.total}</p>
        </div>

        <div className={`${bgColor} border ${borderColor} rounded-xl p-4 hover:shadow-lg transition-all duration-300`}>
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center mb-3">
            <Shield className="text-purple-500" size={24} />
          </div>
          <p className={`text-xs ${textSecondary} mb-1`}>Administradores</p>
          <p className={`text-2xl font-bold ${textColor}`}>{stats.admins}</p>
        </div>

        <div className={`${bgColor} border ${borderColor} rounded-xl p-4 hover:shadow-lg transition-all duration-300`}>
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center mb-3">
            <UserCheck className="text-green-500" size={24} />
          </div>
          <p className={`text-xs ${textSecondary} mb-1`}>Staffs / Operadores</p>
          <p className={`text-2xl font-bold ${textColor}`}>{stats.staff}</p>
        </div>

        <div className={`${bgColor} border ${borderColor} rounded-xl p-4 hover:shadow-lg transition-all duration-300`}>
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center mb-3">
            <UserX className="text-red-500" size={24} />
          </div>
          <p className={`text-xs ${textSecondary} mb-1`}>Contas Bloqueadas</p>
          <p className={`text-2xl font-bold ${textColor}`}>{stats.blocked}</p>
        </div>

        <div className={`${bgColor} border ${borderColor} rounded-xl p-4 hover:shadow-lg transition-all duration-300`}>
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center mb-3">
            <Clock className="text-orange-500" size={24} />
          </div>
          <p className={`text-xs ${textSecondary} mb-1`}>Último Acesso</p>
          <p className={`text-sm font-bold ${textColor}`}>{stats.lastAccess}</p>
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
          {/* Aba 1: Geral */}
          {activeTab === 'geral' && (
            <div className="space-y-6">
              {/* Filtros e Busca */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${textSecondary}`} size={20} />
                  <input
                    type="text"
                    placeholder="Buscar por nome ou e-mail..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                  />
                </div>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className={`px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                >
                  <option value="all">Todos os Cargos</option>
                  <option value="Admin">Admin</option>
                  <option value="Gerente">Gerente</option>
                  <option value="Staff">Staff</option>
                  <option value="Suporte">Suporte</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className={`px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                >
                  <option value="all">Todos os Status</option>
                  <option value="Ativo">Ativo</option>
                  <option value="Bloqueado">Bloqueado</option>
                </select>
              </div>

              {/* Tabela de Membros */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${borderColor}`}>
                      <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>ID</th>
                      <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Nome Completo</th>
                      <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>E-mail</th>
                      <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Cargo</th>
                      <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Status</th>
                      <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Último Acesso</th>
                      <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((member) => (
                      <tr key={member.id} className={`border-b ${borderColor} ${hoverBg}`}>
                        <td className={`py-3 px-4 text-sm ${textColor}`}>#{member.id}</td>
                        <td className={`py-3 px-4 text-sm ${textColor} font-medium`}>{member.name}</td>
                        <td className={`py-3 px-4 text-sm ${textSecondary}`}>{member.email}</td>
                        <td className={`py-3 px-4 text-sm`}>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            member.role === 'Admin' ? 'bg-purple-500/20 text-purple-500' :
                            member.role === 'Gerente' ? 'bg-blue-500/20 text-blue-500' :
                            member.role === 'Staff' ? 'bg-green-500/20 text-green-500' :
                            'bg-orange-500/20 text-orange-500'
                          }`}>
                            {member.role}
                          </span>
                        </td>
                        <td className={`py-3 px-4 text-sm`}>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            member.status === 'Ativo' 
                              ? 'bg-green-500/20 text-green-500' 
                              : 'bg-red-500/20 text-red-500'
                          }`}>
                            {member.status}
                          </span>
                        </td>
                        <td className={`py-3 px-4 text-sm ${textSecondary}`}>{member.lastAccess}</td>
                        <td className={`py-3 px-4 text-sm`}>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditModal(member)}
                              className="p-2 hover:bg-blue-500/20 rounded-lg transition-all"
                              title="Editar"
                            >
                              <Edit className="text-blue-500" size={16} />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(member.id)}
                              className="p-2 hover:bg-orange-500/20 rounded-lg transition-all"
                              title={member.status === 'Ativo' ? 'Bloquear' : 'Desbloquear'}
                            >
                              {member.status === 'Ativo' ? (
                                <Lock className="text-orange-500" size={16} />
                              ) : (
                                <Unlock className="text-green-500" size={16} />
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteMember(member.id)}
                              className="p-2 hover:bg-red-500/20 rounded-lg transition-all"
                              title="Excluir"
                            >
                              <Trash2 className="text-red-500" size={16} />
                            </button>
                            <button
                              className="p-2 hover:bg-purple-500/20 rounded-lg transition-all"
                              title="Histórico"
                            >
                              <History className="text-purple-500" size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredMembers.length === 0 && (
                <div className="text-center py-12">
                  <Users className={`mx-auto mb-4 ${textSecondary}`} size={48} />
                  <p className={`text-lg ${textColor} mb-2`}>Nenhum membro encontrado</p>
                  <p className={textSecondary}>Tente ajustar os filtros de busca</p>
                </div>
              )}
            </div>
          )}

          {/* Aba 2: Permissões */}
          {activeTab === 'permissoes' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className={`text-lg font-bold ${textColor}`}>Controle de Permissões</h3>
                  <p className={textSecondary}>Defina o que cada função pode visualizar e editar</p>
                </div>
                <select
                  className={`px-4 py-2 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                >
                  <option>Aplicar modelo de: Admin</option>
                  <option>Aplicar modelo de: Gerente</option>
                  <option>Aplicar modelo de: Staff</option>
                </select>
              </div>

              <div className="space-y-3">
                {Object.entries(permissions).map(([section, perms]) => (
                  <div key={section} className={`${bgColor} border ${borderColor} rounded-lg p-4`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className={`font-semibold ${textColor} capitalize`}>
                          {section === 'usuarios' ? 'Usuários' :
                           section === 'configuracoes' ? 'Configurações' :
                           section === 'relatorios' ? 'Relatórios' :
                           section}
                        </p>
                      </div>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={perms.view}
                            onChange={(e) => setPermissions({
                              ...permissions,
                              [section]: { ...perms, view: e.target.checked }
                            })}
                            className="w-5 h-5 rounded border-gray-600 text-[#00FF88] focus:ring-[#00FF88]"
                          />
                          <span className={`text-sm ${textSecondary}`}>Visualizar</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={perms.edit}
                            onChange={(e) => setPermissions({
                              ...permissions,
                              [section]: { ...perms, edit: e.target.checked }
                            })}
                            className="w-5 h-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                          />
                          <span className={`text-sm ${textSecondary}`}>Editar</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => alert('Permissões salvas com sucesso!')}
                className="w-full bg-gradient-to-r from-[#00FF88] to-[#0066FF] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <Save size={20} />
                Salvar Permissões
              </button>
            </div>
          )}

          {/* Aba 3: Atividades */}
          {activeTab === 'atividades' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-lg font-bold ${textColor}`}>Log de Atividades</h3>
                  <p className={textSecondary}>Histórico de ações executadas pela equipe</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleExportLogs('csv')}
                    className={`px-4 py-2 ${bgColor} border ${borderColor} rounded-lg ${textColor} hover:bg-[#2A2A2A] transition-all flex items-center gap-2`}
                  >
                    <Download size={16} />
                    CSV
                  </button>
                  <button
                    onClick={() => handleExportLogs('pdf')}
                    className={`px-4 py-2 ${bgColor} border ${borderColor} rounded-lg ${textColor} hover:bg-[#2A2A2A] transition-all flex items-center gap-2`}
                  >
                    <Download size={16} />
                    PDF
                  </button>
                  <button
                    onClick={handleClearOldLogs}
                    className="px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500/30 transition-all"
                  >
                    Limpar Antigos
                  </button>
                </div>
              </div>

              {/* Filtros de Logs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <select
                  className={`px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                >
                  <option>Todos os Usuários</option>
                  {teamMembers.map(m => (
                    <option key={m.id}>{m.name}</option>
                  ))}
                </select>
                <select
                  className={`px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                >
                  <option>Todas as Ações</option>
                  <option>Aprovações</option>
                  <option>Configurações</option>
                  <option>Campanhas</option>
                  <option>Suporte</option>
                </select>
                <input
                  type="date"
                  className={`px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                />
              </div>

              {/* Tabela de Logs */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${borderColor}`}>
                      <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Data/Hora</th>
                      <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Usuário</th>
                      <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Ação</th>
                      <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>IP</th>
                      <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Dispositivo</th>
                      <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Resultado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityLogs.map((log) => (
                      <tr key={log.id} className={`border-b ${borderColor} ${hoverBg}`}>
                        <td className={`py-3 px-4 text-sm ${textSecondary}`}>{log.date}</td>
                        <td className={`py-3 px-4 text-sm ${textColor} font-medium`}>{log.user}</td>
                        <td className={`py-3 px-4 text-sm ${textColor}`}>{log.action}</td>
                        <td className={`py-3 px-4 text-sm ${textSecondary}`}>{log.ip}</td>
                        <td className={`py-3 px-4 text-sm ${textSecondary}`}>{log.device}</td>
                        <td className={`py-3 px-4 text-sm`}>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            log.result === 'Sucesso' 
                              ? 'bg-green-500/20 text-green-500' 
                              : 'bg-red-500/20 text-red-500'
                          }`}>
                            {log.result}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Aba 4: Contatos */}
          {activeTab === 'contatos' && (
            <div className="space-y-6">
              {/* Mensagem Broadcast */}
              <div className={`${bgColor} border ${borderColor} rounded-xl p-6`}>
                <h3 className={`text-lg font-bold ${textColor} mb-4 flex items-center gap-2`}>
                  <Send className="text-[#00FF88]" size={20} />
                  Mensagem de Sistema (Broadcast)
                </h3>
                <p className={`text-sm ${textSecondary} mb-4`}>
                  Envie um aviso para todos os membros ativos da equipe
                </p>
                <textarea
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  rows={4}
                  placeholder="Digite sua mensagem aqui..."
                  className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent mb-4`}
                />
                <button
                  onClick={handleSendBroadcast}
                  className="w-full bg-gradient-to-r from-[#00FF88] to-[#0066FF] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  Enviar para Todos
                </button>
              </div>

              {/* Lista de Contatos */}
              <div>
                <h3 className={`text-lg font-bold ${textColor} mb-4`}>Contatos da Equipe</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teamMembers.filter(m => m.status === 'Ativo').map((member) => (
                    <div key={member.id} className={`${bgColor} border ${borderColor} rounded-xl p-4 hover:shadow-lg transition-all`}>
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00FF88]/20 to-[#0066FF]/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-xl font-bold text-[#00FF88]">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold ${textColor} truncate`}>{member.name}</p>
                          <p className={`text-xs ${textSecondary} truncate`}>{member.email}</p>
                          <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-semibold ${
                            member.role === 'Admin' ? 'bg-purple-500/20 text-purple-500' :
                            member.role === 'Gerente' ? 'bg-blue-500/20 text-blue-500' :
                            member.role === 'Staff' ? 'bg-green-500/20 text-green-500' :
                            'bg-orange-500/20 text-orange-500'
                          }`}>
                            {member.role}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedMember(member);
                          setShowModal('message');
                        }}
                        className="w-full mt-4 px-4 py-2 bg-[#00FF88]/10 border border-[#00FF88]/30 text-[#00FF88] rounded-lg hover:bg-[#00FF88]/20 transition-all flex items-center justify-center gap-2"
                      >
                        <MessageSquare size={16} />
                        Enviar Mensagem
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Adicionar/Editar Membro */}
      {(showModal === 'add' || showModal === 'edit') && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${bgColor} border ${borderColor} rounded-xl p-6 w-full max-w-md`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${textColor}`}>
                {showModal === 'add' ? 'Adicionar Novo Membro' : 'Editar Membro'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(null);
                  setSelectedMember(null);
                  resetForm();
                }}
                className={textSecondary}
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-semibold ${textColor} mb-2`}>Nome Completo</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                  placeholder="João Silva"
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold ${textColor} mb-2`}>E-mail de Login</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                  placeholder="joao@admin.com"
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold ${textColor} mb-2`}>Senha</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                  placeholder={showModal === 'edit' ? 'Deixe em branco para manter' : 'Digite a senha'}
                />
                {showModal === 'add' && (
                  <button
                    onClick={() => {
                      const randomPassword = Math.random().toString(36).slice(-8);
                      setFormData({ ...formData, password: randomPassword });
                    }}
                    className={`text-sm text-[#00FF88] mt-1 hover:underline`}
                  >
                    Gerar senha automaticamente
                  </button>
                )}
              </div>

              <div>
                <label className={`block text-sm font-semibold ${textColor} mb-2`}>Cargo / Função</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as TeamMember['role'] })}
                  className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                >
                  <option value="Admin">Admin</option>
                  <option value="Gerente">Gerente</option>
                  <option value="Staff">Staff</option>
                  <option value="Suporte">Suporte</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-semibold ${textColor} mb-2`}>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as TeamMember['status'] })}
                  className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Bloqueado">Bloqueado</option>
                </select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.forcePasswordReset}
                  onChange={(e) => setFormData({ ...formData, forcePasswordReset: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-600 text-[#00FF88] focus:ring-[#00FF88]"
                />
                <span className={`text-sm ${textColor}`}>Obrigar redefinição de senha no próximo login</span>
              </label>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowModal(null);
                    setSelectedMember(null);
                    resetForm();
                  }}
                  className={`flex-1 px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} hover:bg-[#2A2A2A] transition-all`}
                >
                  Cancelar
                </button>
                <button
                  onClick={showModal === 'add' ? handleAddMember : handleEditMember}
                  className="flex-1 bg-gradient-to-r from-[#00FF88] to-[#0066FF] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all"
                >
                  {showModal === 'add' ? 'Adicionar' : 'Salvar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Enviar Mensagem */}
      {showModal === 'message' && selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${bgColor} border ${borderColor} rounded-xl p-6 w-full max-w-md`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${textColor}`}>
                Enviar Mensagem para {selectedMember.name}
              </h3>
              <button
                onClick={() => {
                  setShowModal(null);
                  setSelectedMember(null);
                }}
                className={textSecondary}
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <textarea
                rows={6}
                placeholder="Digite sua mensagem..."
                className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
              />

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowModal(null);
                    setSelectedMember(null);
                  }}
                  className={`flex-1 px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} hover:bg-[#2A2A2A] transition-all`}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    alert(`Mensagem enviada para ${selectedMember.name}!`);
                    setShowModal(null);
                    setSelectedMember(null);
                  }}
                  className="flex-1 bg-gradient-to-r from-[#00FF88] to-[#0066FF] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
