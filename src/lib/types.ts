// Tipos do Sistema de Jogo do Bicho

export interface User {
  id: string;
  nome: string;
  email: string;
  senha?: string;
  role: 'player' | 'admin';
  saldo: number;
  status: 'ativo' | 'bloqueado' | 'pendente';
  data_criacao: Date;
  foto?: string;
  telefone?: string;
}

export interface Carteira {
  id: string;
  usuario_id: string;
  saldo: number;
  data_atualizacao: Date;
}

export interface Transacao {
  id: string;
  carteira_id: string;
  usuario_id: string;
  tipo: 'credito' | 'debito' | 'saque' | 'bonus' | 'aposta' | 'premio';
  valor: number;
  status: 'pendente' | 'aprovado' | 'rejeitado' | 'processando';
  descricao: string;
  data: Date;
}

export interface Aposta {
  id: string;
  usuario_id: string;
  tipo: 'grupo' | 'dezena' | 'centena' | 'milhar';
  numero: string;
  bicho: string;
  valor: number;
  status: 'aguardando' | 'ganhou' | 'perdeu' | 'cancelada';
  resultado?: string;
  premio?: number;
  data: Date;
  sorteio_id?: string;
}

export interface Sorteio {
  id: string;
  data: Date;
  numeros_sorteados: string[];
  bichos_correspondentes: string[];
  status: 'agendado' | 'realizado' | 'cancelado';
  premio_total: number;
}

export interface Premiacao {
  id: string;
  aposta_id: string;
  usuario_id: string;
  valor_pago: number;
  data: Date;
  sorteio_id: string;
}

export interface Configuracao {
  chave: string;
  valor: string;
  descricao: string;
  tipo: 'numero' | 'texto' | 'boolean' | 'porcentagem';
}

export interface Bicho {
  id: number;
  nome: string;
  numeros: string[];
  emoji: string;
  cor: string;
}

// Dados dos bichos do jogo
export const BICHOS: Bicho[] = [
  { id: 1, nome: 'Avestruz', numeros: ['01', '02', '03', '04'], emoji: '🦓', cor: 'bg-yellow-500' },
  { id: 2, nome: 'Águia', numeros: ['05', '06', '07', '08'], emoji: '🦅', cor: 'bg-amber-600' },
  { id: 3, nome: 'Burro', numeros: ['09', '10', '11', '12'], emoji: '🫏', cor: 'bg-gray-500' },
  { id: 4, nome: 'Borboleta', numeros: ['13', '14', '15', '16'], emoji: '🦋', cor: 'bg-purple-500' },
  { id: 5, nome: 'Cachorro', numeros: ['17', '18', '19', '20'], emoji: '🐕', cor: 'bg-orange-500' },
  { id: 6, nome: 'Cabra', numeros: ['21', '22', '23', '24'], emoji: '🐐', cor: 'bg-lime-500' },
  { id: 7, nome: 'Carneiro', numeros: ['25', '26', '27', '28'], emoji: '🐑', cor: 'bg-slate-400' },
  { id: 8, nome: 'Camelo', numeros: ['29', '30', '31', '32'], emoji: '🐪', cor: 'bg-yellow-600' },
  { id: 9, nome: 'Cobra', numeros: ['33', '34', '35', '36'], emoji: '🐍', cor: 'bg-green-600' },
  { id: 10, nome: 'Coelho', numeros: ['37', '38', '39', '40'], emoji: '🐰', cor: 'bg-pink-400' },
  { id: 11, nome: 'Cavalo', numeros: ['41', '42', '43', '44'], emoji: '🐎', cor: 'bg-amber-700' },
  { id: 12, nome: 'Elefante', numeros: ['45', '46', '47', '48'], emoji: '🐘', cor: 'bg-gray-600' },
  { id: 13, nome: 'Galo', numeros: ['49', '50', '51', '52'], emoji: '🐓', cor: 'bg-red-500' },
  { id: 14, nome: 'Gato', numeros: ['53', '54', '55', '56'], emoji: '🐱', cor: 'bg-orange-400' },
  { id: 15, nome: 'Jacaré', numeros: ['57', '58', '59', '60'], emoji: '🐊', cor: 'bg-green-700' },
  { id: 16, nome: 'Leão', numeros: ['61', '62', '63', '64'], emoji: '🦁', cor: 'bg-yellow-500' },
  { id: 17, nome: 'Macaco', numeros: ['65', '66', '67', '68'], emoji: '🐵', cor: 'bg-amber-500' },
  { id: 18, nome: 'Porco', numeros: ['69', '70', '71', '72'], emoji: '🐷', cor: 'bg-pink-500' },
  { id: 19, nome: 'Pavão', numeros: ['73', '74', '75', '76'], emoji: '🦚', cor: 'bg-blue-500' },
  { id: 20, nome: 'Peru', numeros: ['77', '78', '79', '80'], emoji: '🦃', cor: 'bg-red-600' },
  { id: 21, nome: 'Touro', numeros: ['81', '82', '83', '84'], emoji: '🐂', cor: 'bg-red-700' },
  { id: 22, nome: 'Tigre', numeros: ['85', '86', '87', '88'], emoji: '🐅', cor: 'bg-orange-600' },
  { id: 23, nome: 'Urso', numeros: ['89', '90', '91', '92'], emoji: '🐻', cor: 'bg-amber-800' },
  { id: 24, nome: 'Veado', numeros: ['93', '94', '95', '96'], emoji: '🦌', cor: 'bg-green-500' },
  { id: 25, nome: 'Vaca', numeros: ['97', '98', '99', '00'], emoji: '🐄', cor: 'bg-slate-600' }
];

export interface DashboardStats {
  total_usuarios: number;
  usuarios_ativos: number;
  volume_apostas_hoje: number;
  volume_apostas_mes: number;
  premios_pagos_hoje: number;
  premios_pagos_mes: number;
  lucro_liquido: number;
  apostas_pendentes: number;
}

export interface NotificacaoSistema {
  id: string;
  usuario_id: string;
  titulo: string;
  mensagem: string;
  tipo: 'info' | 'sucesso' | 'aviso' | 'erro';
  lida: boolean;
  data: Date;
}