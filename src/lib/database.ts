// Simulação de banco de dados em memória para demonstração
// Em produção, usar Supabase, PostgreSQL, etc.

import { 
  User, 
  Aposta, 
  Sorteio, 
  Transacao, 
  DashboardStats,
  NotificacaoSistema 
} from './types';
import { generateId, gerarNumeroSorteio, getBichoByNumber } from './utils';

// Dados simulados em memória
let users: User[] = [
  {
    id: '1',
    nome: 'João Silva',
    email: 'joao@email.com',
    role: 'player',
    saldo: 150.00,
    status: 'ativo',
    data_criacao: new Date('2024-01-15'),
    telefone: '(11) 99999-9999'
  },
  {
    id: '2',
    nome: 'Admin Sistema',
    email: 'admin@sistema.com',
    role: 'admin',
    saldo: 0,
    status: 'ativo',
    data_criacao: new Date('2024-01-01')
  }
];

let apostas: Aposta[] = [
  {
    id: '1',
    usuario_id: '1',
    tipo: 'grupo',
    numero: '15',
    bicho: 'Jacaré',
    valor: 10.00,
    status: 'ganhou',
    premio: 180.00,
    data: new Date('2024-01-20T14:30:00'),
    resultado: '5789'
  },
  {
    id: '2',
    usuario_id: '1',
    tipo: 'dezena',
    numero: '25',
    bicho: 'Carneiro',
    valor: 5.00,
    status: 'perdeu',
    data: new Date('2024-01-20T15:00:00'),
    resultado: '1234'
  }
];

let sorteios: Sorteio[] = [
  {
    id: '1',
    data: new Date('2024-01-20T14:30:00'),
    numeros_sorteados: ['5789'],
    bichos_correspondentes: ['Jacaré'],
    status: 'realizado',
    premio_total: 1250.00
  }
];

let transacoes: Transacao[] = [
  {
    id: '1',
    carteira_id: '1',
    usuario_id: '1',
    tipo: 'credito',
    valor: 100.00,
    status: 'aprovado',
    descricao: 'Depósito inicial',
    data: new Date('2024-01-15T10:00:00')
  },
  {
    id: '2',
    carteira_id: '1',
    usuario_id: '1',
    tipo: 'premio',
    valor: 180.00,
    status: 'aprovado',
    descricao: 'Prêmio - Grupo Jacaré',
    data: new Date('2024-01-20T14:35:00')
  }
];

// Funções de usuário
export async function getUser(id: string): Promise<User | null> {
  return users.find(u => u.id === id) || null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return users.find(u => u.email === email) || null;
}

export async function createUser(userData: Omit<User, 'id' | 'data_criacao'>): Promise<User> {
  const newUser: User = {
    ...userData,
    id: generateId(),
    data_criacao: new Date()
  };
  users.push(newUser);
  return newUser;
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) return null;
  
  users[userIndex] = { ...users[userIndex], ...updates };
  return users[userIndex];
}

export async function getAllUsers(): Promise<User[]> {
  return users;
}

// Funções de aposta
export async function createAposta(apostaData: Omit<Aposta, 'id' | 'data'>): Promise<Aposta> {
  const newAposta: Aposta = {
    ...apostaData,
    id: generateId(),
    data: new Date()
  };
  apostas.push(newAposta);
  
  // Debitar saldo do usuário
  const user = users.find(u => u.id === apostaData.usuario_id);
  if (user) {
    user.saldo -= apostaData.valor;
    
    // Registrar transação
    await createTransacao({
      carteira_id: user.id,
      usuario_id: user.id,
      tipo: 'aposta',
      valor: -apostaData.valor,
      status: 'aprovado',
      descricao: `Aposta ${apostaData.tipo} - ${apostaData.bicho}`
    });
  }
  
  return newAposta;
}

export async function getApostasByUser(userId: string): Promise<Aposta[]> {
  return apostas.filter(a => a.usuario_id === userId).sort((a, b) => 
    new Date(b.data).getTime() - new Date(a.data).getTime()
  );
}

export async function getAllApostas(): Promise<Aposta[]> {
  return apostas.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
}

// Funções de sorteio
export async function createSorteio(): Promise<Sorteio> {
  const numeroSorteado = gerarNumeroSorteio();
  const bicho = getBichoByNumber(numeroSorteado.slice(-2));
  
  const newSorteio: Sorteio = {
    id: generateId(),
    data: new Date(),
    numeros_sorteados: [numeroSorteado],
    bichos_correspondentes: [bicho?.nome || 'Desconhecido'],
    status: 'realizado',
    premio_total: 0
  };
  
  sorteios.push(newSorteio);
  
  // Processar apostas pendentes
  await processarResultados(newSorteio);
  
  return newSorteio;
}

export async function getSorteios(limit: number = 10): Promise<Sorteio[]> {
  return sorteios
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, limit);
}

export async function getLastSorteio(): Promise<Sorteio | null> {
  return sorteios.length > 0 ? 
    sorteios.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())[0] : 
    null;
}

// Processar resultados das apostas
async function processarResultados(sorteio: Sorteio): Promise<void> {
  const numeroSorteado = sorteio.numeros_sorteados[0];
  const apostasAguardando = apostas.filter(a => a.status === 'aguardando');
  
  for (const aposta of apostasAguardando) {
    let ganhou = false;
    
    // Verificar se ganhou baseado no tipo de aposta
    switch (aposta.tipo) {
      case 'milhar':
        ganhou = aposta.numero.padStart(4, '0') === numeroSorteado;
        break;
      case 'centena':
        ganhou = aposta.numero.padStart(3, '0') === numeroSorteado.slice(-3);
        break;
      case 'dezena':
        ganhou = aposta.numero.padStart(2, '0') === numeroSorteado.slice(-2);
        break;
      case 'grupo':
        const bicho = getBichoByNumber(numeroSorteado.slice(-2));
        ganhou = bicho?.id.toString() === aposta.numero;
        break;
    }
    
    // Atualizar status da aposta
    aposta.status = ganhou ? 'ganhou' : 'perdeu';
    aposta.resultado = numeroSorteado;
    aposta.sorteio_id = sorteio.id;
    
    // Se ganhou, calcular e creditar prêmio
    if (ganhou) {
      const multiplicadores = {
        'grupo': 18,
        'dezena': 60,
        'centena': 600,
        'milhar': 4000
      };
      
      const premio = aposta.valor * multiplicadores[aposta.tipo as keyof typeof multiplicadores];
      aposta.premio = premio;
      
      // Creditar na carteira do usuário
      const user = users.find(u => u.id === aposta.usuario_id);
      if (user) {
        user.saldo += premio;
        
        // Registrar transação de prêmio
        await createTransacao({
          carteira_id: user.id,
          usuario_id: user.id,
          tipo: 'premio',
          valor: premio,
          status: 'aprovado',
          descricao: `Prêmio - ${aposta.tipo} ${aposta.bicho}`
        });
      }
      
      sorteio.premio_total += premio;
    }
  }
}

// Funções de transação
export async function createTransacao(transacaoData: Omit<Transacao, 'id' | 'data'>): Promise<Transacao> {
  const newTransacao: Transacao = {
    ...transacaoData,
    id: generateId(),
    data: new Date()
  };
  transacoes.push(newTransacao);
  return newTransacao;
}

export async function getTransacoesByUser(userId: string): Promise<Transacao[]> {
  return transacoes
    .filter(t => t.usuario_id === userId)
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
}

// Função para obter estatísticas do dashboard
export async function getDashboardStats(): Promise<DashboardStats> {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  
  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  
  const apostasHoje = apostas.filter(a => new Date(a.data) >= hoje);
  const apostasMes = apostas.filter(a => new Date(a.data) >= inicioMes);
  
  const volumeHoje = apostasHoje.reduce((sum, a) => sum + a.valor, 0);
  const volumeMes = apostasMes.reduce((sum, a) => sum + a.valor, 0);
  
  const premiosHoje = apostasHoje
    .filter(a => a.status === 'ganhou')
    .reduce((sum, a) => sum + (a.premio || 0), 0);
    
  const premiosMes = apostasMes
    .filter(a => a.status === 'ganhou')
    .reduce((sum, a) => sum + (a.premio || 0), 0);
  
  return {
    total_usuarios: users.length,
    usuarios_ativos: users.filter(u => u.status === 'ativo').length,
    volume_apostas_hoje: volumeHoje,
    volume_apostas_mes: volumeMes,
    premios_pagos_hoje: premiosHoje,
    premios_pagos_mes: premiosMes,
    lucro_liquido: volumeMes - premiosMes,
    apostas_pendentes: apostas.filter(a => a.status === 'aguardando').length
  };
}

// Função para simular login
export async function authenticateUser(email: string, senha: string): Promise<User | null> {
  // Em produção, verificar hash da senha
  const user = users.find(u => u.email === email);
  return user && user.status === 'ativo' ? user : null;
}