'use client';

import { useState } from 'react';
import {
  Settings,
  Palette,
  Globe,
  MessageSquare,
  Mail,
  Database,
  Upload,
  Save,
  TestTube,
  Download,
  RotateCcw,
  Image as ImageIcon,
  Sun,
  Moon,
  Check,
  X,
  Instagram,
  Facebook,
  Youtube,
  Send,
  Phone,
  Shield,
  Lock,
  Key,
  Smartphone,
  Monitor,
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react';

type Tab = 'identidade' | 'preferencias' | 'seo' | 'whatsapp' | 'email' | 'backup' | 'seguranca';

interface ConfigCard {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState<Tab>('identidade');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [showModal, setShowModal] = useState<string | null>(null);

  // Estados para Identidade Visual
  const [siteName, setSiteName] = useState('JogoBichoOnline');
  const [siteTitle, setSiteTitle] = useState('Jogo do Bicho Online - Apostas');
  const [metaDescription, setMetaDescription] = useState('Plataforma de apostas do jogo do bicho online');
  const [primaryColor, setPrimaryColor] = useState('#00FF88');
  const [defaultTheme, setDefaultTheme] = useState<'light' | 'dark'>('dark');

  // Estados para Preferências
  const [dateFormat, setDateFormat] = useState('DD/MM/AAAA');
  const [timeFormat, setTimeFormat] = useState('24h');
  const [maxBetsPerMinute, setMaxBetsPerMinute] = useState('10');
  const [minBetValue, setMinBetValue] = useState('1.00');
  const [maxBetValue, setMaxBetValue] = useState('1000.00');
  const [systemNotifications, setSystemNotifications] = useState(true);
  const [siteDomain, setSiteDomain] = useState('https://seudominio.com.br');
  const [supportEmail, setSupportEmail] = useState('suporte@seudominio.com.br');
  const [supportWhatsapp, setSupportWhatsapp] = useState('+55 11 99999-9999');

  // Estados para SEO
  const [metaKeywords, setMetaKeywords] = useState('jogo do bicho, apostas, online');
  const [ogImage, setOgImage] = useState('');
  const [socialLinks, setSocialLinks] = useState({
    instagram: '',
    facebook: '',
    youtube: '',
    tiktok: '',
    whatsapp: '',
    telegram: ''
  });

  // Estados para WhatsApp
  const [whatsappConfig, setWhatsappConfig] = useState({
    apiToken: '',
    senderNumber: '',
    apiUrl: '',
    messages: {
      registration: true,
      betConfirmation: true,
      winNotification: true,
      loseNotification: true,
      withdrawalReady: true
    }
  });

  // Estados para Email
  const [emailConfig, setEmailConfig] = useState({
    smtpServer: '',
    smtpPort: '587',
    smtpEmail: '',
    smtpPassword: '',
    smtpSecurity: 'TLS',
    templates: {
      registration: true,
      passwordRecovery: true,
      balanceAdded: true,
      withdrawalRequest: true,
      betConfirmed: true,
      betResult: true
    }
  });

  // Estados para Backup
  const [autoBackup, setAutoBackup] = useState<'daily' | 'weekly'>('daily');

  // Estados para Segurança
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [maxLoginAttempts, setMaxLoginAttempts] = useState('5');
  const [autoBlockIp, setAutoBlockIp] = useState(true);
  const [blockedIps, setBlockedIps] = useState([
    { ip: '192.168.1.100', date: '15/01/2024 14:30', reason: 'Múltiplas tentativas' },
    { ip: '10.0.0.50', date: '14/01/2024 09:15', reason: 'Atividade suspeita' }
  ]);
  const [recentLogins, setRecentLogins] = useState([
    { date: '16/01/2024 10:30', ip: '192.168.1.1', device: 'Chrome - Windows 10' },
    { date: '16/01/2024 08:15', ip: '192.168.1.1', device: 'Firefox - Windows 10' },
    { date: '15/01/2024 18:45', ip: '10.0.0.25', device: 'Safari - macOS' },
    { date: '15/01/2024 14:20', ip: '192.168.1.1', device: 'Chrome - Windows 10' }
  ]);

  const bgColor = theme === 'dark' ? 'bg-[#1A1A1A]' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-[#2A2A2A]' : 'border-gray-200';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const hoverBg = theme === 'dark' ? 'hover:bg-[#2A2A2A]' : 'hover:bg-gray-100';

  const configCards: ConfigCard[] = [
    {
      label: 'Logo Atual',
      value: 'logo.svg',
      icon: <ImageIcon className="text-blue-500" size={24} />,
      color: 'from-blue-500/20 to-blue-600/20'
    },
    {
      label: 'Favicon',
      value: 'favicon.ico',
      icon: <ImageIcon className="text-purple-500" size={24} />,
      color: 'from-purple-500/20 to-purple-600/20'
    },
    {
      label: 'Nome do Sistema',
      value: siteName,
      icon: <Settings className="text-[#00FF88]" size={24} />,
      color: 'from-[#00FF88]/20 to-[#0066FF]/20'
    },
    {
      label: 'Versão',
      value: 'v1.0.0',
      icon: <Database className="text-orange-500" size={24} />,
      color: 'from-orange-500/20 to-orange-600/20'
    },
    {
      label: 'Tema Padrão',
      value: defaultTheme === 'dark' ? 'Escuro' : 'Claro',
      icon: defaultTheme === 'dark' ? <Moon className="text-indigo-500" size={24} /> : <Sun className="text-yellow-500" size={24} />,
      color: defaultTheme === 'dark' ? 'from-indigo-500/20 to-indigo-600/20' : 'from-yellow-500/20 to-yellow-600/20'
    }
  ];

  const tabs = [
    { id: 'identidade' as Tab, label: 'Identidade Visual', icon: <Palette size={20} /> },
    { id: 'preferencias' as Tab, label: 'Preferências', icon: <Settings size={20} /> },
    { id: 'seo' as Tab, label: 'SEO e Redes', icon: <Globe size={20} /> },
    { id: 'whatsapp' as Tab, label: 'WhatsApp API', icon: <MessageSquare size={20} /> },
    { id: 'email' as Tab, label: 'E-mails', icon: <Mail size={20} /> },
    { id: 'seguranca' as Tab, label: 'Segurança', icon: <Shield size={20} /> },
    { id: 'backup' as Tab, label: 'Backup', icon: <Database size={20} /> }
  ];

  const handleSave = () => {
    alert('Configurações salvas com sucesso!');
  };

  const handleTest = (type: string) => {
    alert(`Teste de ${type} enviado!`);
  };

  const handleBackup = () => {
    alert('Backup iniciado com sucesso!');
  };

  const handleRestore = () => {
    if (confirm('Tem certeza que deseja restaurar o backup anterior? Esta ação não pode ser desfeita.')) {
      alert('Backup restaurado com sucesso!');
    }
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }
    alert('Senha alterada com sucesso!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleEnable2FA = () => {
    if (!verificationCode) {
      alert('Por favor, insira o código de verificação.');
      return;
    }
    setTwoFactorEnabled(true);
    alert('Autenticação em duas etapas ativada com sucesso!');
    setVerificationCode('');
  };

  const handleEndAllSessions = () => {
    if (confirm('Tem certeza que deseja encerrar todas as sessões ativas? Você será desconectado.')) {
      alert('Todas as sessões foram encerradas.');
    }
  };

  const handleUnblockIp = (ip: string) => {
    if (confirm(`Deseja desbloquear o IP ${ip}?`)) {
      setBlockedIps(blockedIps.filter(item => item.ip !== ip));
      alert(`IP ${ip} desbloqueado com sucesso!`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${textColor}`}>Configurações Gerais</h1>
          <p className={textSecondary}>Gerencie toda a identidade visual, comunicação e integrações da plataforma</p>
        </div>
      </div>

      {/* Cards Superiores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {configCards.map((card, index) => (
          <div
            key={index}
            className={`${bgColor} border ${borderColor} rounded-xl p-4 hover:shadow-lg transition-all duration-300`}
          >
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
              {card.icon}
            </div>
            <p className={`text-xs ${textSecondary} mb-1`}>{card.label}</p>
            <p className={`text-lg font-bold ${textColor} truncate`}>{card.value}</p>
          </div>
        ))}
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
          {/* Aba 1: Identidade Visual */}
          {activeTab === 'identidade' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upload Logo */}
                <div>
                  <label className={`block text-sm font-semibold ${textColor} mb-2`}>Logo do Sistema</label>
                  <div className={`border-2 border-dashed ${borderColor} rounded-lg p-8 text-center ${hoverBg} cursor-pointer transition-all`}>
                    <Upload className={`mx-auto mb-2 ${textSecondary}`} size={32} />
                    <p className={`text-sm ${textSecondary}`}>Clique para fazer upload</p>
                    <p className={`text-xs ${textSecondary} mt-1`}>PNG, SVG (max 2MB)</p>
                  </div>
                </div>

                {/* Upload Favicon */}
                <div>
                  <label className={`block text-sm font-semibold ${textColor} mb-2`}>Favicon</label>
                  <div className={`border-2 border-dashed ${borderColor} rounded-lg p-8 text-center ${hoverBg} cursor-pointer transition-all`}>
                    <Upload className={`mx-auto mb-2 ${textSecondary}`} size={32} />
                    <p className={`text-sm ${textSecondary}`}>Clique para fazer upload</p>
                    <p className={`text-xs ${textSecondary} mt-1`}>ICO, PNG (32x32)</p>
                  </div>
                </div>
              </div>

              {/* Nome do Site */}
              <div>
                <label className={`block text-sm font-semibold ${textColor} mb-2`}>Nome do Site</label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                  placeholder="Nome do seu site"
                />
              </div>

              {/* Título da Aba */}
              <div>
                <label className={`block text-sm font-semibold ${textColor} mb-2`}>Título da Aba do Navegador</label>
                <input
                  type="text"
                  value={siteTitle}
                  onChange={(e) => setSiteTitle(e.target.value)}
                  className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                  placeholder="Título que aparece na aba"
                />
              </div>

              {/* Meta Descrição */}
              <div>
                <label className={`block text-sm font-semibold ${textColor} mb-2`}>Meta Descrição SEO</label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                  placeholder="Descrição do site para mecanismos de busca"
                />
              </div>

              {/* Tema Padrão */}
              <div>
                <label className={`block text-sm font-semibold ${textColor} mb-2`}>Tema Padrão</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setDefaultTheme('light')}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                      defaultTheme === 'light'
                        ? 'border-[#00FF88] bg-[#00FF88]/10'
                        : `${borderColor} ${hoverBg}`
                    }`}
                  >
                    <Sun className="mx-auto mb-2" size={32} />
                    <p className={`font-semibold ${textColor}`}>Claro</p>
                  </button>
                  <button
                    onClick={() => setDefaultTheme('dark')}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                      defaultTheme === 'dark'
                        ? 'border-[#00FF88] bg-[#00FF88]/10'
                        : `${borderColor} ${hoverBg}`
                    }`}
                  >
                    <Moon className="mx-auto mb-2" size={32} />
                    <p className={`font-semibold ${textColor}`}>Escuro</p>
                  </button>
                </div>
              </div>

              {/* Cor Primária */}
              <div>
                <label className={`block text-sm font-semibold ${textColor} mb-2`}>Cor Primária do Layout</label>
                <div className="flex gap-4 items-center">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-20 h-12 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className={`flex-1 px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                    placeholder="#00FF88"
                  />
                </div>
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-[#00FF88] to-[#0066FF] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <Save size={20} />
                Salvar Alterações
              </button>
            </div>
          )}

          {/* Aba 2: Preferências do Sistema */}
          {activeTab === 'preferencias' && (
            <div className="space-y-6">
              {/* Idioma (Fixo) */}
              <div>
                <label className={`block text-sm font-semibold ${textColor} mb-2`}>Idioma</label>
                <input
                  type="text"
                  value="Português (Brasil)"
                  disabled
                  className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textSecondary} cursor-not-allowed`}
                />
              </div>

              {/* Fuso Horário (Fixo) */}
              <div>
                <label className={`block text-sm font-semibold ${textColor} mb-2`}>Fuso Horário</label>
                <input
                  type="text"
                  value="America/São_Paulo (GMT-3)"
                  disabled
                  className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textSecondary} cursor-not-allowed`}
                />
              </div>

              {/* Formato de Data */}
              <div>
                <label className={`block text-sm font-semibold ${textColor} mb-2`}>Formato de Data</label>
                <select
                  value={dateFormat}
                  onChange={(e) => setDateFormat(e.target.value)}
                  className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                >
                  <option value="DD/MM/AAAA">DD/MM/AAAA</option>
                  <option value="MM/DD/AAAA">MM/DD/AAAA</option>
                  <option value="AAAA-MM-DD">AAAA-MM-DD</option>
                </select>
              </div>

              {/* Formato de Hora */}
              <div>
                <label className={`block text-sm font-semibold ${textColor} mb-2`}>Formato de Hora</label>
                <select
                  value={timeFormat}
                  onChange={(e) => setTimeFormat(e.target.value)}
                  className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                >
                  <option value="24h">24 horas</option>
                  <option value="12h">12 horas (AM/PM)</option>
                </select>
              </div>

              {/* Limites de Apostas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-semibold ${textColor} mb-2`}>Apostas/Minuto (Máx)</label>
                  <input
                    type="number"
                    value={maxBetsPerMinute}
                    onChange={(e) => setMaxBetsPerMinute(e.target.value)}
                    className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold ${textColor} mb-2`}>Valor Mínimo (R$)</label>
                  <input
                    type="text"
                    value={minBetValue}
                    onChange={(e) => setMinBetValue(e.target.value)}
                    className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold ${textColor} mb-2`}>Valor Máximo (R$)</label>
                  <input
                    type="text"
                    value={maxBetValue}
                    onChange={(e) => setMaxBetValue(e.target.value)}
                    className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                  />
                </div>
              </div>

              {/* Notificações do Sistema */}
              <div className={`flex items-center justify-between p-4 ${bgColor} border ${borderColor} rounded-lg`}>
                <div>
                  <p className={`font-semibold ${textColor}`}>Notificações do Sistema</p>
                  <p className={`text-sm ${textSecondary}`}>Ativar notificações automáticas para usuários</p>
                </div>
                <button
                  onClick={() => setSystemNotifications(!systemNotifications)}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    systemNotifications ? 'bg-[#00FF88]' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      systemNotifications ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Seção de Suporte e Domínio */}
              <div className={`${bgColor} border-2 ${borderColor} rounded-xl p-6 mt-8`}>
                <h3 className={`text-lg font-bold ${textColor} mb-4 flex items-center gap-2`}>
                  <Phone className="text-[#00FF88]" size={20} />
                  Informações de Suporte
                </h3>
                <p className={`text-sm ${textSecondary} mb-6`}>
                  Essas informações serão usadas em notificações automáticas, rodapé e comunicações da plataforma
                </p>

                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-semibold ${textColor} mb-2`}>Domínio do Site</label>
                    <input
                      type="url"
                      value={siteDomain}
                      onChange={(e) => setSiteDomain(e.target.value)}
                      className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                      placeholder="https://seudominio.com.br"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold ${textColor} mb-2`}>E-mail de Suporte</label>
                    <input
                      type="email"
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                      placeholder="suporte@seudominio.com.br"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold ${textColor} mb-2`}>WhatsApp de Suporte</label>
                    <input
                      type="tel"
                      value={supportWhatsapp}
                      onChange={(e) => setSupportWhatsapp(e.target.value)}
                      className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                      placeholder="+55 11 99999-9999"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-[#00FF88] to-[#0066FF] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <Save size={20} />
                Salvar Alterações
              </button>
            </div>
          )}

          {/* Aba 3: SEO e Mídias Sociais */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              {/* Meta Keywords */}
              <div>
                <label className={`block text-sm font-semibold ${textColor} mb-2`}>Palavras-chave (Keywords)</label>
                <input
                  type="text"
                  value={metaKeywords}
                  onChange={(e) => setMetaKeywords(e.target.value)}
                  className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                  placeholder="palavra1, palavra2, palavra3"
                />
                <p className={`text-xs ${textSecondary} mt-1`}>Separe as palavras-chave com vírgulas</p>
              </div>

              {/* Imagem OpenGraph */}
              <div>
                <label className={`block text-sm font-semibold ${textColor} mb-2`}>Imagem de Compartilhamento (OpenGraph)</label>
                <div className={`border-2 border-dashed ${borderColor} rounded-lg p-8 text-center ${hoverBg} cursor-pointer transition-all`}>
                  <Upload className={`mx-auto mb-2 ${textSecondary}`} size={32} />
                  <p className={`text-sm ${textSecondary}`}>Clique para fazer upload</p>
                  <p className={`text-xs ${textSecondary} mt-1`}>Recomendado: 1200x630px</p>
                </div>
              </div>

              {/* Redes Sociais */}
              <div className="space-y-4">
                <h3 className={`text-lg font-bold ${textColor}`}>Links das Redes Sociais</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-semibold ${textColor} mb-2 flex items-center gap-2`}>
                      <Instagram size={18} className="text-pink-500" />
                      Instagram
                    </label>
                    <input
                      type="url"
                      value={socialLinks.instagram}
                      onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                      className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                      placeholder="https://instagram.com/seu-perfil"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold ${textColor} mb-2 flex items-center gap-2`}>
                      <Facebook size={18} className="text-blue-500" />
                      Facebook
                    </label>
                    <input
                      type="url"
                      value={socialLinks.facebook}
                      onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                      className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                      placeholder="https://facebook.com/sua-pagina"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold ${textColor} mb-2 flex items-center gap-2`}>
                      <Youtube size={18} className="text-red-500" />
                      YouTube
                    </label>
                    <input
                      type="url"
                      value={socialLinks.youtube}
                      onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                      className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                      placeholder="https://youtube.com/seu-canal"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold ${textColor} mb-2 flex items-center gap-2`}>
                      <Send size={18} className="text-cyan-500" />
                      TikTok
                    </label>
                    <input
                      type="url"
                      value={socialLinks.tiktok}
                      onChange={(e) => setSocialLinks({ ...socialLinks, tiktok: e.target.value })}
                      className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                      placeholder="https://tiktok.com/@seu-perfil"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold ${textColor} mb-2 flex items-center gap-2`}>
                      <Phone size={18} className="text-green-500" />
                      WhatsApp
                    </label>
                    <input
                      type="text"
                      value={socialLinks.whatsapp}
                      onChange={(e) => setSocialLinks({ ...socialLinks, whatsapp: e.target.value })}
                      className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                      placeholder="https://wa.me/5511999999999"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold ${textColor} mb-2 flex items-center gap-2`}>
                      <Send size={18} className="text-blue-400" />
                      Telegram
                    </label>
                    <input
                      type="url"
                      value={socialLinks.telegram}
                      onChange={(e) => setSocialLinks({ ...socialLinks, telegram: e.target.value })}
                      className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                      placeholder="https://t.me/seu-canal"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-[#00FF88] to-[#0066FF] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <Save size={20} />
                Salvar Alterações
              </button>
            </div>
          )}

          {/* Aba 4: WhatsApp API */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-semibold ${textColor} mb-2`}>API Token</label>
                  <input
                    type="password"
                    value={whatsappConfig.apiToken}
                    onChange={(e) => setWhatsappConfig({ ...whatsappConfig, apiToken: e.target.value })}
                    className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                    placeholder="Token da API do WhatsApp"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold ${textColor} mb-2`}>Número Remetente</label>
                  <input
                    type="text"
                    value={whatsappConfig.senderNumber}
                    onChange={(e) => setWhatsappConfig({ ...whatsappConfig, senderNumber: e.target.value })}
                    className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                    placeholder="+55 11 99999-9999"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold ${textColor} mb-2`}>URL Base da API</label>
                <input
                  type="url"
                  value={whatsappConfig.apiUrl}
                  onChange={(e) => setWhatsappConfig({ ...whatsappConfig, apiUrl: e.target.value })}
                  className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                  placeholder="https://api.whatsapp.com/v1"
                />
              </div>

              <div className="space-y-3">
                <h3 className={`text-lg font-bold ${textColor}`}>Mensagens Automáticas</h3>
                
                {[
                  { key: 'registration', label: 'Confirmação de Cadastro' },
                  { key: 'betConfirmation', label: 'Resumo de Aposta Realizada' },
                  { key: 'winNotification', label: 'Notificação de Vitória' },
                  { key: 'loseNotification', label: 'Notificação de Derrota' },
                  { key: 'withdrawalReady', label: 'Crédito Liberado para Saque' }
                ].map((msg) => (
                  <div key={msg.key} className={`flex items-center justify-between p-4 ${bgColor} border ${borderColor} rounded-lg`}>
                    <p className={`font-medium ${textColor}`}>{msg.label}</p>
                    <button
                      onClick={() => setWhatsappConfig({
                        ...whatsappConfig,
                        messages: {
                          ...whatsappConfig.messages,
                          [msg.key]: !whatsappConfig.messages[msg.key as keyof typeof whatsappConfig.messages]
                        }
                      })}
                      className={`relative w-14 h-8 rounded-full transition-colors ${
                        whatsappConfig.messages[msg.key as keyof typeof whatsappConfig.messages] ? 'bg-[#00FF88]' : 'bg-gray-600'
                      }`}
                    >
                      <div
                        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                          whatsappConfig.messages[msg.key as keyof typeof whatsappConfig.messages] ? 'translate-x-6' : ''
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-gradient-to-r from-[#00FF88] to-[#0066FF] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  Salvar Alterações
                </button>
                <button
                  onClick={() => handleTest('WhatsApp')}
                  className={`px-6 py-3 ${bgColor} border ${borderColor} rounded-lg font-semibold ${textColor} hover:bg-[#2A2A2A] transition-all flex items-center gap-2`}
                >
                  <TestTube size={20} />
                  Testar Envio
                </button>
              </div>
            </div>
          )}

          {/* Aba 5: E-mails e Notificações */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <h3 className={`text-lg font-bold ${textColor}`}>Configuração SMTP</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-semibold ${textColor} mb-2`}>Servidor SMTP</label>
                  <input
                    type="text"
                    value={emailConfig.smtpServer}
                    onChange={(e) => setEmailConfig({ ...emailConfig, smtpServer: e.target.value })}
                    className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                    placeholder="smtp.gmail.com"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold ${textColor} mb-2`}>Porta</label>
                  <input
                    type="text"
                    value={emailConfig.smtpPort}
                    onChange={(e) => setEmailConfig({ ...emailConfig, smtpPort: e.target.value })}
                    className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                    placeholder="587"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold ${textColor} mb-2`}>E-mail Remetente</label>
                  <input
                    type="email"
                    value={emailConfig.smtpEmail}
                    onChange={(e) => setEmailConfig({ ...emailConfig, smtpEmail: e.target.value })}
                    className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                    placeholder="noreply@seusite.com"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold ${textColor} mb-2`}>Senha</label>
                  <input
                    type="password"
                    value={emailConfig.smtpPassword}
                    onChange={(e) => setEmailConfig({ ...emailConfig, smtpPassword: e.target.value })}
                    className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold ${textColor} mb-2`}>Segurança</label>
                <select
                  value={emailConfig.smtpSecurity}
                  onChange={(e) => setEmailConfig({ ...emailConfig, smtpSecurity: e.target.value })}
                  className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                >
                  <option value="TLS">TLS</option>
                  <option value="SSL">SSL</option>
                  <option value="NONE">Nenhuma</option>
                </select>
              </div>

              <div className="space-y-3">
                <h3 className={`text-lg font-bold ${textColor}`}>Modelos de E-mails Automáticos</h3>
                
                {[
                  { key: 'registration', label: 'Cadastro de Usuário' },
                  { key: 'passwordRecovery', label: 'Recuperação de Senha' },
                  { key: 'balanceAdded', label: 'Adição de Saldo' },
                  { key: 'withdrawalRequest', label: 'Solicitação de Saque' },
                  { key: 'betConfirmed', label: 'Aposta Confirmada' },
                  { key: 'betResult', label: 'Resultado de Aposta' }
                ].map((template) => (
                  <div key={template.key} className={`flex items-center justify-between p-4 ${bgColor} border ${borderColor} rounded-lg`}>
                    <div className="flex-1">
                      <p className={`font-medium ${textColor}`}>{template.label}</p>
                      <p className={`text-xs ${textSecondary} mt-1`}>Placeholders: {'{'}nome{'}'}, {'{'}valor{'}'}, {'{'}saldo{'}'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowModal(template.key)}
                        className={`px-4 py-2 ${bgColor} border ${borderColor} rounded-lg text-sm font-medium ${textColor} hover:bg-[#2A2A2A] transition-all`}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setEmailConfig({
                          ...emailConfig,
                          templates: {
                            ...emailConfig.templates,
                            [template.key]: !emailConfig.templates[template.key as keyof typeof emailConfig.templates]
                          }
                        })}
                        className={`relative w-14 h-8 rounded-full transition-colors ${
                          emailConfig.templates[template.key as keyof typeof emailConfig.templates] ? 'bg-[#00FF88]' : 'bg-gray-600'
                        }`}
                      >
                        <div
                          className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                            emailConfig.templates[template.key as keyof typeof emailConfig.templates] ? 'translate-x-6' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-gradient-to-r from-[#00FF88] to-[#0066FF] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  Salvar Alterações
                </button>
                <button
                  onClick={() => handleTest('E-mail')}
                  className={`px-6 py-3 ${bgColor} border ${borderColor} rounded-lg font-semibold ${textColor} hover:bg-[#2A2A2A] transition-all flex items-center gap-2`}
                >
                  <TestTube size={20} />
                  Testar Envio
                </button>
              </div>
            </div>
          )}

          {/* Aba 6: Segurança */}
          {activeTab === 'seguranca' && (
            <div className="space-y-6">
              {/* Seção 1: Alterar Senha */}
              <div className={`${bgColor} border ${borderColor} rounded-xl p-6`}>
                <h3 className={`text-lg font-bold ${textColor} mb-4 flex items-center gap-2`}>
                  <Lock className="text-[#00FF88]" size={20} />
                  Alterar Senha
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-semibold ${textColor} mb-2`}>Senha Atual</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className={`w-full px-4 py-3 pr-12 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                        placeholder="Digite sua senha atual"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 ${textSecondary} hover:text-[#00FF88]`}
                      >
                        {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold ${textColor} mb-2`}>Nova Senha</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={`w-full px-4 py-3 pr-12 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                        placeholder="Digite sua nova senha"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 ${textSecondary} hover:text-[#00FF88]`}
                      >
                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold ${textColor} mb-2`}>Confirmar Nova Senha</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full px-4 py-3 pr-12 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                        placeholder="Confirme sua nova senha"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 ${textSecondary} hover:text-[#00FF88]`}
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleChangePassword}
                    className="w-full bg-gradient-to-r from-[#00FF88] to-[#0066FF] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    <Key size={20} />
                    Alterar Senha
                  </button>
                </div>
              </div>

              {/* Seção 2: Autenticação em Duas Etapas (2FA) */}
              <div className={`${bgColor} border ${borderColor} rounded-xl p-6`}>
                <h3 className={`text-lg font-bold ${textColor} mb-4 flex items-center gap-2`}>
                  <Smartphone className="text-blue-500" size={20} />
                  Autenticação em Duas Etapas (2FA)
                </h3>

                <div className={`flex items-center justify-between p-4 ${bgColor} border ${borderColor} rounded-lg mb-4`}>
                  <div>
                    <p className={`font-semibold ${textColor}`}>Ativar 2FA</p>
                    <p className={`text-sm ${textSecondary}`}>Adicione uma camada extra de segurança</p>
                  </div>
                  <button
                    onClick={() => {
                      if (twoFactorEnabled) {
                        if (confirm('Deseja desativar a autenticação em duas etapas?')) {
                          setTwoFactorEnabled(false);
                          alert('2FA desativado com sucesso!');
                        }
                      } else {
                        setTwoFactorEnabled(true);
                      }
                    }}
                    className={`relative w-14 h-8 rounded-full transition-colors ${
                      twoFactorEnabled ? 'bg-[#00FF88]' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                        twoFactorEnabled ? 'translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>

                {twoFactorEnabled && !verificationCode && (
                  <div className="space-y-4">
                    <div className={`${bgColor} border ${borderColor} rounded-lg p-6 text-center`}>
                      <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center mb-4">
                        <p className="text-gray-400 text-sm">QR Code</p>
                      </div>
                      <p className={`text-sm ${textSecondary} mb-2`}>
                        Escaneie este código com seu aplicativo autenticador
                      </p>
                      <p className={`text-xs ${textSecondary}`}>
                        Google Authenticator, Authy ou similar
                      </p>
                    </div>

                    <div>
                      <label className={`block text-sm font-semibold ${textColor} mb-2`}>Código de Verificação</label>
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent text-center text-2xl tracking-widest`}
                        placeholder="000000"
                        maxLength={6}
                      />
                    </div>

                    <button
                      onClick={handleEnable2FA}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all"
                    >
                      Confirmar Ativação
                    </button>
                  </div>
                )}

                {twoFactorEnabled && verificationCode && (
                  <div className={`${bgColor} border-2 border-green-500/50 rounded-lg p-4 flex items-center gap-3`}>
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="text-green-500" size={20} />
                    </div>
                    <div>
                      <p className={`font-semibold ${textColor}`}>2FA Ativado</p>
                      <p className={`text-sm ${textSecondary}`}>Sua conta está protegida com autenticação em duas etapas</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Seção 3: Sessões e Logins */}
              <div className={`${bgColor} border ${borderColor} rounded-xl p-6`}>
                <h3 className={`text-lg font-bold ${textColor} mb-4 flex items-center gap-2`}>
                  <Monitor className="text-purple-500" size={20} />
                  Sessões e Logins Recentes
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`border-b ${borderColor}`}>
                        <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Data/Hora</th>
                        <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Endereço IP</th>
                        <th className={`text-left py-3 px-4 text-sm font-semibold ${textColor}`}>Dispositivo/Navegador</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentLogins.map((login, index) => (
                        <tr key={index} className={`border-b ${borderColor} ${hoverBg}`}>
                          <td className={`py-3 px-4 text-sm ${textColor}`}>{login.date}</td>
                          <td className={`py-3 px-4 text-sm ${textSecondary}`}>{login.ip}</td>
                          <td className={`py-3 px-4 text-sm ${textSecondary}`}>{login.device}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  onClick={handleEndAllSessions}
                  className={`w-full mt-4 ${bgColor} border-2 border-orange-500 text-orange-500 py-3 rounded-lg font-semibold hover:bg-orange-500/10 transition-all`}
                >
                  Encerrar Todas as Sessões Ativas
                </button>
              </div>

              {/* Seção 4: Tentativas de Login Inválidas */}
              <div className={`${bgColor} border ${borderColor} rounded-xl p-6`}>
                <h3 className={`text-lg font-bold ${textColor} mb-4 flex items-center gap-2`}>
                  <AlertTriangle className="text-red-500" size={20} />
                  Tentativas de Login Inválidas
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-semibold ${textColor} mb-2`}>
                      Máximo de tentativas de login antes de bloqueio
                    </label>
                    <input
                      type="number"
                      value={maxLoginAttempts}
                      onChange={(e) => setMaxLoginAttempts(e.target.value)}
                      className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                      min="3"
                      max="10"
                    />
                    <p className={`text-xs ${textSecondary} mt-1`}>Padrão: 5 tentativas</p>
                  </div>

                  <div className={`flex items-center justify-between p-4 ${bgColor} border ${borderColor} rounded-lg`}>
                    <div>
                      <p className={`font-semibold ${textColor}`}>Bloquear IP automaticamente</p>
                      <p className={`text-sm ${textSecondary}`}>Após tentativas excedidas</p>
                    </div>
                    <button
                      onClick={() => setAutoBlockIp(!autoBlockIp)}
                      className={`relative w-14 h-8 rounded-full transition-colors ${
                        autoBlockIp ? 'bg-[#00FF88]' : 'bg-gray-600'
                      }`}
                    >
                      <div
                        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                          autoBlockIp ? 'translate-x-6' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {blockedIps.length > 0 && (
                    <div>
                      <h4 className={`text-sm font-semibold ${textColor} mb-3`}>IPs Bloqueados</h4>
                      <div className="space-y-2">
                        {blockedIps.map((item, index) => (
                          <div
                            key={index}
                            className={`flex items-center justify-between p-3 ${bgColor} border ${borderColor} rounded-lg`}
                          >
                            <div>
                              <p className={`font-medium ${textColor}`}>{item.ip}</p>
                              <p className={`text-xs ${textSecondary}`}>
                                {item.date} - {item.reason}
                              </p>
                            </div>
                            <button
                              onClick={() => handleUnblockIp(item.ip)}
                              className="px-4 py-2 bg-red-500/20 text-red-500 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-all"
                            >
                              Desbloquear
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSave}
                  className="w-full mt-4 bg-gradient-to-r from-[#00FF88] to-[#0066FF] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  Salvar Configurações de Segurança
                </button>
              </div>
            </div>
          )}

          {/* Aba 7: Backup e Sistema */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div className={`${bgColor} border ${borderColor} rounded-xl p-6`}>
                <h3 className={`text-lg font-bold ${textColor} mb-4`}>Informações do Sistema</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className={`text-sm ${textSecondary}`}>Versão do Sistema</p>
                    <p className={`text-xl font-bold ${textColor}`}>v1.0.0</p>
                  </div>
                  <div>
                    <p className={`text-sm ${textSecondary}`}>Status dos Serviços</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      <p className={`font-semibold text-green-500`}>Online</p>
                    </div>
                  </div>
                  <div>
                    <p className={`text-sm ${textSecondary}`}>Último Backup</p>
                    <p className={`text-xl font-bold ${textColor}`}>Hoje, 14:30</p>
                  </div>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold ${textColor} mb-2`}>Backup Automático</label>
                <select
                  value={autoBackup}
                  onChange={(e) => setAutoBackup(e.target.value as 'daily' | 'weekly')}
                  className={`w-full px-4 py-3 ${bgColor} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-[#00FF88] focus:border-transparent`}
                >
                  <option value="daily">Diário (todo dia às 03:00)</option>
                  <option value="weekly">Semanal (todo domingo às 03:00)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleBackup}
                  className="bg-gradient-to-r from-[#00FF88] to-[#0066FF] text-white py-4 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Fazer Backup Manual
                </button>

                <button
                  onClick={handleRestore}
                  className={`${bgColor} border-2 border-orange-500 text-orange-500 py-4 rounded-lg font-semibold hover:bg-orange-500/10 transition-all flex items-center justify-center gap-2`}
                >
                  <RotateCcw size={20} />
                  Restaurar Backup Anterior
                </button>
              </div>

              <div className={`${bgColor} border-2 border-red-500/50 rounded-xl p-6`}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <X className="text-red-500" size={20} />
                  </div>
                  <div>
                    <h4 className={`font-bold ${textColor} mb-1`}>Atenção: Ação Irreversível</h4>
                    <p className={`text-sm ${textSecondary}`}>
                      Restaurar um backup anterior irá substituir TODOS os dados atuais do sistema. 
                      Esta ação não pode ser desfeita. Certifique-se de fazer um backup manual antes de restaurar.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
