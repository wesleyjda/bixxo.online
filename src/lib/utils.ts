// Utilitários do Sistema de Jogo do Bicho

import { BICHOS, type Bicho } from './types';

// Formatação de moeda brasileira
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

// Formatação de data brasileira
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Formatação de data simples
export function formatDateSimple(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
}

// Buscar bicho por número
export function getBichoByNumber(numero: string): Bicho | undefined {
  const num = numero.padStart(2, '0');
  return BICHOS.find(bicho => bicho.numeros.includes(num));
}

// Buscar bicho por ID
export function getBichoById(id: number): Bicho | undefined {
  return BICHOS.find(bicho => bicho.id === id);
}

// Calcular prêmio baseado no tipo de aposta
export function calcularPremio(tipo: string, valor: number): number {
  const multiplicadores = {
    'grupo': 18,    // 1 para 18
    'dezena': 60,   // 1 para 60
    'centena': 600, // 1 para 600
    'milhar': 4000  // 1 para 4000
  };
  
  return valor * (multiplicadores[tipo as keyof typeof multiplicadores] || 1);
}

// Gerar número aleatório para sorteio
export function gerarNumeroSorteio(): string {
  return Math.floor(Math.random() * 10000).toString().padStart(4, '0');
}

// Validar número de aposta
export function validarNumeroAposta(numero: string, tipo: string): boolean {
  const num = numero.replace(/\D/g, '');
  
  switch (tipo) {
    case 'grupo':
      return num.length >= 1 && num.length <= 2 && parseInt(num) >= 1 && parseInt(num) <= 25;
    case 'dezena':
      return num.length === 2 && parseInt(num) >= 0 && parseInt(num) <= 99;
    case 'centena':
      return num.length === 3 && parseInt(num) >= 0 && parseInt(num) <= 999;
    case 'milhar':
      return num.length === 4 && parseInt(num) >= 0 && parseInt(num) <= 9999;
    default:
      return false;
  }
}

// Gerar ID único
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Verificar se aposta ganhou
export function verificarAposta(aposta: { tipo: string; numero: string }, numeroSorteado: string): boolean {
  const numAposta = aposta.numero.padStart(4, '0');
  const numSorteado = numeroSorteado.padStart(4, '0');
  
  switch (aposta.tipo) {
    case 'milhar':
      return numAposta === numSorteado;
    case 'centena':
      return numAposta.slice(-3) === numSorteado.slice(-3);
    case 'dezena':
      return numAposta.slice(-2) === numSorteado.slice(-2);
    case 'grupo':
      const bicho = getBichoByNumber(numSorteado.slice(-2));
      return bicho?.id.toString() === aposta.numero;
    default:
      return false;
  }
}

// Obter próximo horário de sorteio
export function getProximoSorteio(): Date {
  const agora = new Date();
  const proximoSorteio = new Date(agora);
  
  // Sorteios a cada 5 minutos para demonstração
  const minutos = Math.ceil(agora.getMinutes() / 5) * 5;
  proximoSorteio.setMinutes(minutos, 0, 0);
  
  if (proximoSorteio <= agora) {
    proximoSorteio.setMinutes(proximoSorteio.getMinutes() + 5);
  }
  
  return proximoSorteio;
}

// Calcular tempo restante para próximo sorteio
export function getTempoRestante(proximoSorteio: Date): string {
  const agora = new Date();
  const diff = proximoSorteio.getTime() - agora.getTime();
  
  if (diff <= 0) return '00:00';
  
  const minutos = Math.floor(diff / (1000 * 60));
  const segundos = Math.floor((diff % (1000 * 60)) / 1000);
  
  return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
}

// Validar email
export function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Validar senha
export function validarSenha(senha: string): { valida: boolean; erros: string[] } {
  const erros: string[] = [];
  
  if (senha.length < 6) {
    erros.push('Senha deve ter pelo menos 6 caracteres');
  }
  
  if (!/[A-Z]/.test(senha)) {
    erros.push('Senha deve ter pelo menos uma letra maiúscula');
  }
  
  if (!/[0-9]/.test(senha)) {
    erros.push('Senha deve ter pelo menos um número');
  }
  
  return {
    valida: erros.length === 0,
    erros
  };
}