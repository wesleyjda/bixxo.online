'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/custom/Navbar';
import Header from '@/components/custom/Header';
import AuthForm from '@/components/custom/AuthForm';
import ApostasForm from '@/components/custom/ApostasForm';
import { 
  authenticateUser, 
  createUser, 
  getUser,
  createAposta,
  getApostasByUser,
  getSorteios,
  getTransacoesByUser,
  createSorteio,
  getDashboardStats
} from '@/lib/database';
import { formatCurrency, formatDate, getProximoSorteio } from '@/lib/utils';
import { BICHOS } from '@/lib/types';
import type { User, Aposta, Sorteio, Transacao, DashboardStats } from '@/lib/types';
import { 
  TrendingUp, 
  Trophy, 
  Clock, 
  DollarSign, 
  Users, 
  Target,
  History,
  Wallet,
  Settings,
  BarChart3,
  Calendar,
  Award,
  Gamepad2,
  ChevronRight,
  Star,
  Zap,
  Shield,
  Gift,
  ChevronDown
} from 'lucide-react';

type PageType = 'home' | 'login' | 'apostas' | 'resultados' | 'carteira' | 'historico' | 'conta' | 'admin';

export default function JogoBichoOnline() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [apostas, setApostas] = useState<Aposta[]>([]);
  const [sorteios, setSorteios] = useState<Sorteio[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [proximoSorteio, setProximoSorteio] = useState<Date>(getProximoSorteio());

  // Atualizar próximo sorteio a cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setProximoSorteio(getProximoSorteio());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Carregar dados do usuário
  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    try {
      const [userApostas, userTransacoes, recentSorteios] = await Promise.all([
        getApostasByUser(user.id),
        getTransacoesByUser(user.id),
        getSorteios(10)
      ]);
      
      setApostas(userApostas);
      setTransacoes(userTransacoes);
      setSorteios(recentSorteios);
      
      if (user.role === 'admin') {
        const stats = await getDashboardStats();
        setDashboardStats(stats);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleAuth = async (formData: any) => {
    setLoading(true);
    try {
      if (authMode === 'login') {
        const authenticatedUser = await authenticateUser(formData.email, formData.senha);
        if (authenticatedUser) {
          setUser(authenticatedUser);
          setCurrentPage('home');
        } else {
          alert('Email ou senha incorretos');
        }
      } else {
        const newUser = await createUser({
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          role: 'player',
          saldo: 50.00, // Bônus de boas-vindas
          status: 'ativo'
        });
        setUser(newUser);
        setCurrentPage('home');
      }
    } catch (error) {
      console.error('Erro na autenticação:', error);
      alert('Erro ao processar solicitação');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
    setApostas([]);
    setTransacoes([]);
    setDashboardStats(null);
  };

  const handleSubmitAposta = async (apostaData: any) => {
    if (!user) return;
    
    try {
      const novaAposta = await createAposta({
        usuario_id: user.id,
        tipo: apostaData.tipo,
        numero: apostaData.numero,
        bicho: apostaData.bicho,
        valor: apostaData.valor,
        status: 'aguardando'
      });
      
      // Atualizar saldo do usuário
      const updatedUser = await getUser(user.id);
      if (updatedUser) {
        setUser(updatedUser);
      }
      
      // Recarregar dados
      await loadUserData();
      
      alert('Aposta realizada com sucesso!');
      setCurrentPage('historico');
    } catch (error) {
      console.error('Erro ao fazer aposta:', error);
      alert('Erro ao processar aposta');
    }
  };

  const handleRealizarSorteio = async () => {
    try {
      await createSorteio();
      await loadUserData();
      
      // Atualizar usuário para refletir possíveis ganhos
      const updatedUser = await getUser(user!.id);
      if (updatedUser) {
        setUser(updatedUser);
      }
      
      alert('Sorteio realizado com sucesso!');
    } catch (error) {
      console.error('Erro ao realizar sorteio:', error);
      alert('Erro ao realizar sorteio');
    }
  };

  // Página de Login/Cadastro
  if (!user && (currentPage === 'login' || currentPage === 'home')) {
    return (
      <div className="min-h-screen bg-[#0A0A0A]">
        {currentPage === 'home' ? (
          <HomePage onNavigate={setCurrentPage} />
        ) : (
          <AuthForm
            mode={authMode}
            onSubmit={handleAuth}
            onToggleMode={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
            loading={loading}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navbar 
        user={user} 
        onLogout={handleLogout}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
      
      <main className="py-6">
        {currentPage === 'home' && user && (
          <DashboardPage 
            user={user} 
            apostas={apostas} 
            sorteios={sorteios}
            proximoSorteio={proximoSorteio}
            onNavigate={setCurrentPage}
            onRealizarSorteio={user.role === 'admin' ? handleRealizarSorteio : undefined}
          />
        )}
        
        {currentPage === 'apostas' && user && (
          <ApostasForm
            userSaldo={user.saldo}
            onSubmitAposta={handleSubmitAposta}
            proximoSorteio={proximoSorteio}
          />
        )}
        
        {currentPage === 'resultados' && (
          <ResultadosPage sorteios={sorteios} />
        )}
        
        {currentPage === 'carteira' && user && (
          <CarteiraPage user={user} transacoes={transacoes} />
        )}
        
        {currentPage === 'historico' && (
          <HistoricoPage apostas={apostas} />
        )}
        
        {currentPage === 'admin' && user?.role === 'admin' && dashboardStats && (
          <AdminPage 
            stats={dashboardStats} 
            onRealizarSorteio={handleRealizarSorteio}
          />
        )}
      </main>
    </div>
  );
}

// Componente da Página Inicial (sem login) - DESIGN MODERNO DARK
function HomePage({ onNavigate }: { onNavigate: (page: PageType) => void }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 30 });
  const [currentBanner, setCurrentBanner] = useState(0);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 3, minutes: 0, seconds: 0 }; // Reset
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Banner carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const banners = [
    { title: "Bônus de Boas-Vindas", subtitle: "R$ 50 para novos jogadores", color: "from-[#00FF88] to-[#00CC70]" },
    { title: "Prêmios de até 4000x", subtitle: "Multiplique seu dinheiro", color: "from-[#0066FF] to-[#0044CC]" },
    { title: "Sorteios a cada 3 horas", subtitle: "Mais chances de ganhar", color: "from-[#00FF88] to-[#0066FF]" }
  ];

  const ultimosGanhadores = [
    { nome: "João S.", premio: 2500, tempo: "5 min atrás", avatar: "🎯" },
    { nome: "Maria L.", premio: 1800, tempo: "12 min atrás", avatar: "🏆" },
    { nome: "Pedro M.", premio: 3200, tempo: "25 min atrás", avatar: "💎" },
    { nome: "Ana C.", premio: 950, tempo: "1h atrás", avatar: "⭐" }
  ];

  const faqs = [
    { q: "Como funciona o Jogo do Bicho?", a: "Escolha um bicho ou número e faça sua aposta. Se acertar o resultado do sorteio, você ganha!" },
    { q: "Quando são os sorteios?", a: "Realizamos sorteios a cada 3 horas, todos os dias da semana." },
    { q: "Como recebo meus prêmios?", a: "Os prêmios caem automaticamente na sua carteira assim que o sorteio é realizado." },
    { q: "Qual o valor mínimo de aposta?", a: "Você pode apostar a partir de R$ 1,00." }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header Fixo */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="text-3xl">🎯</div>
              <div>
                <div className="text-xl font-bold text-white">Bicho<span className="text-[#00FF88]">Online</span></div>
                <div className="text-xs text-gray-400">Jogue com segurança</div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('login')}
                className="hidden sm:block px-4 py-2 text-white hover:text-[#00FF88] transition-colors duration-200 font-medium"
              >
                Entrar
              </button>
              <button
                onClick={() => onNavigate('login')}
                className="bg-gradient-to-r from-[#00FF88] to-[#00CC70] hover:from-[#00CC70] hover:to-[#00AA60] text-[#0A0A0A] px-6 py-2 rounded-lg font-bold transition-all duration-200 shadow-lg shadow-[#00FF88]/30"
              >
                Cadastrar
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Espaçamento para header fixo */}
      <div className="h-16"></div>

      {/* Hero Section com Banner Carrossel */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Banner Carrossel */}
          <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
            {banners.map((banner, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  currentBanner === index ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className={`h-full bg-gradient-to-r ${banner.color} flex items-center justify-center text-center p-8`}>
                  <div>
                    <h2 className="text-4xl md:text-5xl font-bold text-[#0A0A0A] mb-4">{banner.title}</h2>
                    <p className="text-xl md:text-2xl text-[#0A0A0A]/90">{banner.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Indicadores */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBanner(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentBanner === index ? 'bg-white w-8' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Countdown e CTA */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Countdown Timer */}
            <div className="bg-gradient-to-br from-[#0066FF] to-[#0044CC] rounded-2xl p-8 shadow-2xl shadow-[#0066FF]/20">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Clock className="text-[#00FF88]" size={28} />
                  <h3 className="text-2xl font-bold text-white">Próximo Sorteio</h3>
                </div>
                
                <div className="flex justify-center gap-4 mb-6">
                  <div className="bg-[#0A0A0A]/40 backdrop-blur-sm rounded-xl p-4 min-w-[80px] border border-[#00FF88]/20">
                    <div className="text-4xl font-bold text-[#00FF88]">{String(timeLeft.hours).padStart(2, '0')}</div>
                    <div className="text-sm text-white/80">Horas</div>
                  </div>
                  <div className="bg-[#0A0A0A]/40 backdrop-blur-sm rounded-xl p-4 min-w-[80px] border border-[#00FF88]/20">
                    <div className="text-4xl font-bold text-[#00FF88]">{String(timeLeft.minutes).padStart(2, '0')}</div>
                    <div className="text-sm text-white/80">Min</div>
                  </div>
                  <div className="bg-[#0A0A0A]/40 backdrop-blur-sm rounded-xl p-4 min-w-[80px] border border-[#00FF88]/20">
                    <div className="text-4xl font-bold text-[#00FF88]">{String(timeLeft.seconds).padStart(2, '0')}</div>
                    <div className="text-sm text-white/80">Seg</div>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('login')}
                  className="w-full bg-[#00FF88] hover:bg-[#00CC70] text-[#0A0A0A] font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 shadow-lg shadow-[#00FF88]/30 flex items-center justify-center gap-2"
                >
                  <Zap size={24} />
                  Apostar Agora
                </button>
              </div>
            </div>

            {/* Cotação ao Vivo */}
            <div className="bg-[#1A1A1A] rounded-2xl p-8 shadow-2xl border border-[#2A2A2A]">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="text-[#00FF88]" size={24} />
                <h3 className="text-xl font-bold text-white">Cotação ao Vivo</h3>
              </div>
              
              <div className="space-y-3">
                {[
                  { bicho: "🦅 Águia", mult: "18x", popular: true },
                  { bicho: "🐅 Tigre", mult: "22x", popular: true },
                  { bicho: "🦁 Leão", mult: "15x", popular: false },
                  { bicho: "🐘 Elefante", mult: "28x", popular: false }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between bg-[#0A0A0A]/50 rounded-lg p-3 border border-[#2A2A2A]">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.bicho.split(' ')[0]}</span>
                      <span className="text-white font-medium">{item.bicho.split(' ')[1]}</span>
                      {item.popular && (
                        <span className="bg-[#00FF88]/20 text-[#00FF88] text-xs px-2 py-1 rounded-full font-semibold">
                          Popular
                        </span>
                      )}
                    </div>
                    <div className="text-[#00FF88] font-bold text-lg">{item.mult}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Últimos Ganhadores */}
      <section className="bg-[#0F0F0F] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Trophy className="text-[#00FF88]" size={32} />
              <h2 className="text-3xl font-bold text-white">Últimos Ganhadores</h2>
            </div>
            <p className="text-gray-400 text-lg">Veja quem está levando prêmios agora!</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ultimosGanhadores.map((ganhador, i) => (
              <div key={i} className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-xl p-6 border border-[#2A2A2A] hover:border-[#00FF88] transition-all duration-300 hover:scale-105">
                <div className="text-center">
                  <div className="text-4xl mb-3">{ganhador.avatar}</div>
                  <div className="text-white font-semibold mb-2">{ganhador.nome}</div>
                  <div className="text-2xl font-bold text-[#00FF88] mb-2">
                    {formatCurrency(ganhador.premio)}
                  </div>
                  <div className="text-sm text-gray-400">{ganhador.tempo}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Como Funciona?</h2>
            <p className="text-gray-400 text-lg">Simples, rápido e seguro</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-[#0066FF] to-[#0044CC] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#0066FF]/30">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Escolha seu Bicho</h3>
              <p className="text-gray-400">Selecione entre 25 bichos ou números específicos</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-[#00FF88] to-[#00CC70] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#00FF88]/30">
                <span className="text-2xl font-bold text-[#0A0A0A]">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Faça sua Aposta</h3>
              <p className="text-gray-400">Defina o valor e confirme sua aposta</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-[#0066FF] to-[#00FF88] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#0066FF]/30">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Ganhe Prêmios</h3>
              <p className="text-gray-400">Acertou? O prêmio cai na sua conta automaticamente!</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate('login')}
              className="bg-gradient-to-r from-[#00FF88] to-[#00CC70] hover:from-[#00CC70] hover:to-[#00AA60] text-[#0A0A0A] font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 shadow-lg shadow-[#00FF88]/30 inline-flex items-center gap-2"
            >
              Começar Agora
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Vantagens */}
      <section className="py-16 bg-[#0F0F0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-xl p-8 border border-[#2A2A2A]">
              <Shield className="text-[#0066FF] mb-4" size={40} />
              <h3 className="text-xl font-bold text-white mb-2">100% Seguro</h3>
              <p className="text-gray-400">Plataforma protegida com criptografia de ponta</p>
            </div>

            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-xl p-8 border border-[#2A2A2A]">
              <Zap className="text-[#00FF88] mb-4" size={40} />
              <h3 className="text-xl font-bold text-white mb-2">Pagamento Instantâneo</h3>
              <p className="text-gray-400">Ganhou? Receba na hora em sua carteira</p>
            </div>

            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-xl p-8 border border-[#2A2A2A]">
              <Gift className="text-[#0066FF] mb-4" size={40} />
              <h3 className="text-xl font-bold text-white mb-2">Bônus de Boas-Vindas</h3>
              <p className="text-gray-400">R$ 50 grátis para novos jogadores</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Perguntas Frequentes</h2>
            <p className="text-gray-400 text-lg">Tire suas dúvidas</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] overflow-hidden">
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-[#1F1F1F] transition-colors duration-200"
                >
                  <span className="text-white font-semibold">{faq.q}</span>
                  <ChevronDown
                    className={`text-gray-400 transition-transform duration-200 ${
                      faqOpen === i ? 'transform rotate-180' : ''
                    }`}
                    size={20}
                  />
                </button>
                {faqOpen === i && (
                  <div className="px-6 pb-6 text-gray-400">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] border-t border-[#1A1A1A] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="text-3xl">🎯</div>
                <div className="text-xl font-bold text-white">Bicho<span className="text-[#00FF88]">Online</span></div>
              </div>
              <p className="text-gray-400 text-sm">
                A melhor plataforma de Jogo do Bicho online do Brasil
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Jogue</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-[#00FF88] transition-colors">Como Jogar</a></li>
                <li><a href="#" className="hover:text-[#00FF88] transition-colors">Regras</a></li>
                <li><a href="#" className="hover:text-[#00FF88] transition-colors">Resultados</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-[#00FF88] transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-[#00FF88] transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-[#00FF88] transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-[#00FF88] transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-[#00FF88] transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-[#00FF88] transition-colors">Jogo Responsável</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#1A1A1A] pt-8 text-center text-gray-400 text-sm">
            <p>© 2024 BichoOnline. Todos os direitos reservados. | +18 | Jogue com responsabilidade</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Componente do Dashboard do Usuário
function DashboardPage({ 
  user, 
  apostas, 
  sorteios, 
  proximoSorteio, 
  onNavigate,
  onRealizarSorteio 
}: {
  user: User;
  apostas: Aposta[];
  sorteios: Sorteio[];
  proximoSorteio: Date;
  onNavigate: (page: PageType) => void;
  onRealizarSorteio?: () => void;
}) {
  const getTempoRestante = () => {
    const agora = new Date();
    const diff = proximoSorteio.getTime() - agora.getTime();
    
    if (diff <= 0) return '00:00';
    
    const minutos = Math.floor(diff / (1000 * 60));
    const segundos = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
  };

  const apostasRecentes = apostas.slice(0, 5);
  const ultimoSorteio = sorteios[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Olá, {user.nome}! 👋
        </h1>
        <p className="text-gray-400">Bem-vindo ao seu painel do Jogo do Bicho</p>
      </div>

      {/* Cards de Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-[#00FF88] to-[#00CC70] rounded-xl p-6 text-[#0A0A0A]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#0A0A0A]/70">Saldo Atual</p>
              <p className="text-2xl font-bold">{formatCurrency(user.saldo)}</p>
            </div>
            <Wallet size={32} className="text-[#0A0A0A]/70" />
          </div>
        </div>

        <div className="bg-[#1A1A1A] rounded-xl p-6 shadow-lg border border-[#2A2A2A]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Apostas Hoje</p>
              <p className="text-2xl font-bold text-white">
                {apostas.filter(a => {
                  const hoje = new Date();
                  const dataAposta = new Date(a.data);
                  return dataAposta.toDateString() === hoje.toDateString();
                }).length}
              </p>
            </div>
            <Target size={32} className="text-[#0066FF]" />
          </div>
        </div>

        <div className="bg-[#1A1A1A] rounded-xl p-6 shadow-lg border border-[#2A2A2A]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Próximo Sorteio</p>
              <p className="text-2xl font-bold text-white">{getTempoRestante()}</p>
            </div>
            <Clock size={32} className="text-[#00FF88]" />
          </div>
        </div>

        <div className="bg-[#1A1A1A] rounded-xl p-6 shadow-lg border border-[#2A2A2A]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Apostas Ganhas</p>
              <p className="text-2xl font-bold text-[#00FF88]">
                {apostas.filter(a => a.status === 'ganhou').length}
              </p>
            </div>
            <Trophy size={32} className="text-[#00FF88]" />
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="bg-[#1A1A1A] rounded-xl shadow-lg p-6 mb-8 border border-[#2A2A2A]">
        <h2 className="text-xl font-semibold mb-4 text-white">Ações Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate('apostas')}
            className="flex flex-col items-center p-4 rounded-lg border-2 border-[#00FF88]/30 hover:border-[#00FF88] hover:bg-[#00FF88]/10 transition-colors duration-200"
          >
            <Gamepad2 className="text-[#00FF88] mb-2" size={24} />
            <span className="font-medium text-white">Fazer Aposta</span>
          </button>
          
          <button
            onClick={() => onNavigate('resultados')}
            className="flex flex-col items-center p-4 rounded-lg border-2 border-[#0066FF]/30 hover:border-[#0066FF] hover:bg-[#0066FF]/10 transition-colors duration-200"
          >
            <Trophy className="text-[#0066FF] mb-2" size={24} />
            <span className="font-medium text-white">Ver Resultados</span>
          </button>
          
          <button
            onClick={() => onNavigate('carteira')}
            className="flex flex-col items-center p-4 rounded-lg border-2 border-[#00FF88]/30 hover:border-[#00FF88] hover:bg-[#00FF88]/10 transition-colors duration-200"
          >
            <Wallet className="text-[#00FF88] mb-2" size={24} />
            <span className="font-medium text-white">Minha Carteira</span>
          </button>
          
          <button
            onClick={() => onNavigate('historico')}
            className="flex flex-col items-center p-4 rounded-lg border-2 border-[#0066FF]/30 hover:border-[#0066FF] hover:bg-[#0066FF]/10 transition-colors duration-200"
          >
            <History className="text-[#0066FF] mb-2" size={24} />
            <span className="font-medium text-white">Histórico</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Último Sorteio */}
        <div className="bg-[#1A1A1A] rounded-xl shadow-lg p-6 border border-[#2A2A2A]">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
            <Trophy className="text-[#00FF88]" />
            Último Sorteio
          </h2>
          
          {ultimoSorteio ? (
            <div className="space-y-4">
              <div className="text-center p-4 bg-gradient-to-r from-[#00FF88]/20 to-[#0066FF]/20 rounded-lg border border-[#00FF88]/30">
                <div className="text-3xl font-bold text-white mb-2">
                  {ultimoSorteio.numeros_sorteados[0]}
                </div>
                <div className="text-lg text-gray-300">
                  🎯 {ultimoSorteio.bichos_correspondentes[0]}
                </div>
                <div className="text-sm text-gray-400 mt-2">
                  {formatDate(ultimoSorteio.data)}
                </div>
              </div>
              
              {onRealizarSorteio && (
                <button
                  onClick={onRealizarSorteio}
                  className="w-full bg-[#00FF88] hover:bg-[#00CC70] text-[#0A0A0A] py-2 px-4 rounded-lg transition-colors duration-200 font-bold"
                >
                  Realizar Novo Sorteio (Admin)
                </button>
              )}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">
              Nenhum sorteio realizado ainda
            </p>
          )}
        </div>

        {/* Apostas Recentes */}
        <div className="bg-[#1A1A1A] rounded-xl shadow-lg p-6 border border-[#2A2A2A]">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
            <History className="text-[#0066FF]" />
            Apostas Recentes
          </h2>
          
          {apostasRecentes.length > 0 ? (
            <div className="space-y-3">
              {apostasRecentes.map((aposta) => (
                <div key={aposta.id} className="flex items-center justify-between p-3 bg-[#0F0F0F] rounded-lg border border-[#2A2A2A]">
                  <div>
                    <div className="font-medium text-white">{aposta.bicho}</div>
                    <div className="text-sm text-gray-400">
                      {aposta.tipo} • {formatCurrency(aposta.valor)}
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    aposta.status === 'ganhou' 
                      ? 'bg-[#00FF88]/20 text-[#00FF88]'
                      : aposta.status === 'perdeu'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-[#0066FF]/20 text-[#0066FF]'
                  }`}>
                    {aposta.status === 'ganhou' ? 'Ganhou' : 
                     aposta.status === 'perdeu' ? 'Perdeu' : 'Aguardando'}
                  </div>
                </div>
              ))}
              
              <button
                onClick={() => onNavigate('historico')}
                className="w-full text-[#00FF88] hover:text-[#00CC70] py-2 text-sm font-medium"
              >
                Ver todas as apostas →
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">Você ainda não fez nenhuma aposta</p>
              <button
                onClick={() => onNavigate('apostas')}
                className="bg-[#00FF88] hover:bg-[#00CC70] text-[#0A0A0A] px-4 py-2 rounded-lg transition-colors duration-200 font-bold"
              >
                Fazer Primeira Aposta
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente da Página de Resultados
function ResultadosPage({ sorteios }: { sorteios: Sorteio[] }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#1A1A1A] rounded-xl shadow-lg p-6 border border-[#2A2A2A]">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
          <Trophy className="text-[#00FF88]" />
          Resultados dos Sorteios
        </h1>
        
        {sorteios.length > 0 ? (
          <div className="space-y-4">
            {sorteios.map((sorteio) => (
              <div key={sorteio.id} className="border border-[#2A2A2A] rounded-lg p-4 bg-[#0F0F0F]">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {sorteio.numeros_sorteados[0]}
                      </div>
                      <div className="text-sm text-gray-400">Número</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-semibold text-[#00FF88]">
                        🎯 {sorteio.bichos_correspondentes[0]}
                      </div>
                      <div className="text-sm text-gray-400">Bicho</div>
                    </div>
                  </div>
                  
                  <div className="text-right mt-4 md:mt-0">
                    <div className="text-sm text-gray-400">
                      {formatDate(sorteio.data)}
                    </div>
                    <div className="text-sm font-medium text-[#00FF88]">
                      Prêmios: {formatCurrency(sorteio.premio_total)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-8">
            Nenhum sorteio realizado ainda
          </p>
        )}
      </div>
    </div>
  );
}

// Componente da Página de Carteira
function CarteiraPage({ user, transacoes }: { user: User; transacoes: Transacao[] }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#1A1A1A] rounded-xl shadow-lg p-6 mb-6 border border-[#2A2A2A]">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
          <Wallet className="text-[#00FF88]" />
          Minha Carteira
        </h1>
        
        <div className="bg-gradient-to-r from-[#00FF88] to-[#00CC70] rounded-xl p-6 text-[#0A0A0A] mb-6">
          <div className="text-center">
            <p className="text-[#0A0A0A]/70 mb-2">Saldo Atual</p>
            <p className="text-4xl font-bold">{formatCurrency(user.saldo)}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="bg-[#00FF88] hover:bg-[#00CC70] text-[#0A0A0A] py-3 px-6 rounded-lg font-semibold transition-colors duration-200">
            Adicionar Saldo
          </button>
          <button className="bg-[#0066FF] hover:bg-[#0044CC] text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200">
            Solicitar Saque
          </button>
        </div>
      </div>
      
      <div className="bg-[#1A1A1A] rounded-xl shadow-lg p-6 border border-[#2A2A2A]">
        <h2 className="text-xl font-semibold mb-4 text-white">Histórico de Transações</h2>
        
        {transacoes.length > 0 ? (
          <div className="space-y-3">
            {transacoes.map((transacao) => (
              <div key={transacao.id} className="flex items-center justify-between p-3 border border-[#2A2A2A] rounded-lg bg-[#0F0F0F]">
                <div>
                  <div className="font-medium text-white">{transacao.descricao}</div>
                  <div className="text-sm text-gray-400">
                    {formatDate(transacao.data)}
                  </div>
                </div>
                <div className={`font-semibold ${
                  transacao.valor > 0 ? 'text-[#00FF88]' : 'text-red-400'
                }`}>
                  {transacao.valor > 0 ? '+' : ''}{formatCurrency(transacao.valor)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-8">
            Nenhuma transação encontrada
          </p>
        )}
      </div>
    </div>
  );
}

// Componente da Página de Histórico
function HistoricoPage({ apostas }: { apostas: Aposta[] }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#1A1A1A] rounded-xl shadow-lg p-6 border border-[#2A2A2A]">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
          <History className="text-[#0066FF]" />
          Histórico de Apostas
        </h1>
        
        {apostas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-[#2A2A2A]">
                  <th className="text-left py-3 px-4 text-gray-300">Data</th>
                  <th className="text-left py-3 px-4 text-gray-300">Tipo</th>
                  <th className="text-left py-3 px-4 text-gray-300">Bicho/Número</th>
                  <th className="text-left py-3 px-4 text-gray-300">Valor</th>
                  <th className="text-left py-3 px-4 text-gray-300">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300">Prêmio</th>
                </tr>
              </thead>
              <tbody>
                {apostas.map((aposta) => (
                  <tr key={aposta.id} className="border-b border-[#2A2A2A]">
                    <td className="py-3 px-4 text-sm text-gray-400">
                      {formatDate(aposta.data)}
                    </td>
                    <td className="py-3 px-4 capitalize text-white">{aposta.tipo}</td>
                    <td className="py-3 px-4 text-white">{aposta.bicho}</td>
                    <td className="py-3 px-4 text-white">{formatCurrency(aposta.valor)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        aposta.status === 'ganhou' 
                          ? 'bg-[#00FF88]/20 text-[#00FF88]'
                          : aposta.status === 'perdeu'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-[#0066FF]/20 text-[#0066FF]'
                      }`}>
                        {aposta.status === 'ganhou' ? 'Ganhou' : 
                         aposta.status === 'perdeu' ? 'Perdeu' : 'Aguardando'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#00FF88]">
                      {aposta.premio ? formatCurrency(aposta.premio) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-400 py-8">
            Nenhuma aposta encontrada
          </p>
        )}
      </div>
    </div>
  );
}

// Componente do Painel Administrativo
function AdminPage({ stats, onRealizarSorteio }: { 
  stats: DashboardStats; 
  onRealizarSorteio: () => void;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Painel Administrativo 🛠️
        </h1>
        <p className="text-gray-400">Controle e estatísticas do sistema</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#1A1A1A] rounded-xl p-6 shadow-lg border border-[#2A2A2A]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Total Usuários</p>
              <p className="text-2xl font-bold text-white">{stats.total_usuarios}</p>
            </div>
            <Users size={32} className="text-[#0066FF]" />
          </div>
        </div>

        <div className="bg-[#1A1A1A] rounded-xl p-6 shadow-lg border border-[#2A2A2A]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Volume Hoje</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(stats.volume_apostas_hoje)}
              </p>
            </div>
            <TrendingUp size={32} className="text-[#00FF88]" />
          </div>
        </div>

        <div className="bg-[#1A1A1A] rounded-xl p-6 shadow-lg border border-[#2A2A2A]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Prêmios Pagos</p>
              <p className="text-2xl font-bold text-red-400">
                {formatCurrency(stats.premios_pagos_hoje)}
              </p>
            </div>
            <Award size={32} className="text-[#00FF88]" />
          </div>
        </div>

        <div className="bg-[#1A1A1A] rounded-xl p-6 shadow-lg border border-[#2A2A2A]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Lucro Líquido</p>
              <p className="text-2xl font-bold text-[#00FF88]">
                {formatCurrency(stats.lucro_liquido)}
              </p>
            </div>
            <BarChart3 size={32} className="text-[#00FF88]" />
          </div>
        </div>
      </div>

      {/* Ações Admin */}
      <div className="bg-[#1A1A1A] rounded-xl shadow-lg p-6 border border-[#2A2A2A]">
        <h2 className="text-xl font-semibold mb-4 text-white">Ações Administrativas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={onRealizarSorteio}
            className="bg-[#00FF88] hover:bg-[#00CC70] text-[#0A0A0A] py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Target size={20} />
            Realizar Sorteio
          </button>
          
          <button className="bg-[#0066FF] hover:bg-[#0044CC] text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2">
            <Users size={20} />
            Gerenciar Usuários
          </button>
          
          <button className="bg-[#0066FF] hover:bg-[#0044CC] text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2">
            <BarChart3 size={20} />
            Relatórios
          </button>
        </div>
      </div>
    </div>
  );
}
