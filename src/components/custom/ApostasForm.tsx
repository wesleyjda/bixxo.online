'use client';

import { useState } from 'react';
import { BICHOS, type Bicho } from '@/lib/types';
import { formatCurrency, calcularPremio } from '@/lib/utils';
import { DollarSign, Target, Trophy, Clock } from 'lucide-react';

interface ApostasFormProps {
  userSaldo: number;
  onSubmitAposta: (aposta: {
    tipo: string;
    numero: string;
    bicho: string;
    valor: number;
  }) => void;
  proximoSorteio?: Date;
}

export default function ApostasForm({ userSaldo, onSubmitAposta, proximoSorteio }: ApostasFormProps) {
  const [tipoAposta, setTipoAposta] = useState<'grupo' | 'dezena' | 'centena' | 'milhar'>('grupo');
  const [bichoSelecionado, setBichoSelecionado] = useState<Bicho | null>(null);
  const [numeroAposta, setNumeroAposta] = useState('');
  const [valorAposta, setValorAposta] = useState(5);
  const [showConfirmacao, setShowConfirmacao] = useState(false);

  const tiposAposta = [
    { 
      id: 'grupo', 
      nome: 'Grupo', 
      descricao: 'Aposte no grupo do bicho (1 para 18)',
      multiplicador: 18,
      exemplo: 'Ex: Grupo 15 (Jacaré)'
    },
    { 
      id: 'dezena', 
      nome: 'Dezena', 
      descricao: 'Aposte nos últimos 2 números (1 para 60)',
      multiplicador: 60,
      exemplo: 'Ex: 25, 67, 89'
    },
    { 
      id: 'centena', 
      nome: 'Centena', 
      descricao: 'Aposte nos últimos 3 números (1 para 600)',
      multiplicador: 600,
      exemplo: 'Ex: 125, 567, 889'
    },
    { 
      id: 'milhar', 
      nome: 'Milhar', 
      descricao: 'Aposte nos 4 números (1 para 4000)',
      multiplicador: 4000,
      exemplo: 'Ex: 1234, 5678, 9999'
    }
  ];

  const valoresRapidos = [5, 10, 20, 50, 100];

  const handleTipoChange = (tipo: 'grupo' | 'dezena' | 'centena' | 'milhar') => {
    setTipoAposta(tipo);
    setBichoSelecionado(null);
    setNumeroAposta('');
  };

  const handleBichoSelect = (bicho: Bicho) => {
    setBichoSelecionado(bicho);
    setNumeroAposta(bicho.id.toString());
  };

  const handleNumeroChange = (numero: string) => {
    // Limitar caracteres baseado no tipo
    const maxLength = {
      grupo: 2,
      dezena: 2,
      centena: 3,
      milhar: 4
    };
    
    const numeroLimpo = numero.replace(/\D/g, '').slice(0, maxLength[tipoAposta]);
    setNumeroAposta(numeroLimpo);
    
    // Se for grupo, encontrar o bicho correspondente
    if (tipoAposta === 'grupo' && numeroLimpo) {
      const bichoId = parseInt(numeroLimpo);
      const bicho = BICHOS.find(b => b.id === bichoId);
      setBichoSelecionado(bicho || null);
    }
  };

  const premioEstimado = calcularPremio(tipoAposta, valorAposta);

  const isValidAposta = () => {
    if (!numeroAposta || valorAposta <= 0 || valorAposta > userSaldo) return false;
    
    switch (tipoAposta) {
      case 'grupo':
        const num = parseInt(numeroAposta);
        return num >= 1 && num <= 25;
      case 'dezena':
        return numeroAposta.length === 2;
      case 'centena':
        return numeroAposta.length === 3;
      case 'milhar':
        return numeroAposta.length === 4;
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    if (!isValidAposta()) return;
    
    onSubmitAposta({
      tipo: tipoAposta,
      numero: numeroAposta,
      bicho: bichoSelecionado?.nome || `Número ${numeroAposta}`,
      valor: valorAposta
    });
    
    // Reset form
    setNumeroAposta('');
    setBichoSelecionado(null);
    setValorAposta(5);
    setShowConfirmacao(false);
  };

  const getTempoRestante = () => {
    if (!proximoSorteio) return '00:00';
    
    const agora = new Date();
    const diff = proximoSorteio.getTime() - agora.getTime();
    
    if (diff <= 0) return '00:00';
    
    const minutos = Math.floor(diff / (1000 * 60));
    const segundos = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">🎯 Fazer Aposta</h1>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <DollarSign size={20} />
              <span>Saldo: {formatCurrency(userSaldo)}</span>
            </div>
            {proximoSorteio && (
              <div className="flex items-center gap-2">
                <Clock size={20} />
                <span>Próximo sorteio: {getTempoRestante()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tipos de Aposta */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Target className="text-emerald-600" />
          Tipo de Aposta
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiposAposta.map((tipo) => (
            <button
              key={tipo.id}
              onClick={() => handleTipoChange(tipo.id as any)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                tipoAposta === tipo.id
                  ? 'border-emerald-500 bg-emerald-50 shadow-md'
                  : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
              }`}
            >
              <div className="font-semibold text-lg">{tipo.nome}</div>
              <div className="text-sm text-gray-600 mb-2">{tipo.descricao}</div>
              <div className="text-xs text-emerald-600 font-medium">{tipo.exemplo}</div>
              <div className="text-sm font-bold text-emerald-700 mt-2">
                Prêmio: {tipo.multiplicador}x
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Seleção de Número/Bicho */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          {tipoAposta === 'grupo' ? 'Escolha o Bicho' : 'Digite o Número'}
        </h2>

        {tipoAposta === 'grupo' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {BICHOS.map((bicho) => (
              <button
                key={bicho.id}
                onClick={() => handleBichoSelect(bicho)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                  bichoSelecionado?.id === bicho.id
                    ? 'border-emerald-500 bg-emerald-50 shadow-md'
                    : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                }`}
              >
                <div className="text-2xl mb-1">{bicho.emoji}</div>
                <div className="font-semibold text-sm">{bicho.nome}</div>
                <div className="text-xs text-gray-600">Grupo {bicho.id}</div>
              </button>
            ))}
          </div>
        ) : (
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número da {tipoAposta}
            </label>
            <input
              type="text"
              value={numeroAposta}
              onChange={(e) => handleNumeroChange(e.target.value)}
              placeholder={`Digite ${tipoAposta === 'dezena' ? '2' : tipoAposta === 'centena' ? '3' : '4'} números`}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-center text-xl font-mono"
              maxLength={tipoAposta === 'dezena' ? 2 : tipoAposta === 'centena' ? 3 : 4}
            />
          </div>
        )}
      </div>

      {/* Valor da Aposta */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <DollarSign className="text-emerald-600" />
          Valor da Aposta
        </h2>
        
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {valoresRapidos.map((valor) => (
              <button
                key={valor}
                onClick={() => setValorAposta(valor)}
                disabled={valor > userSaldo}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  valorAposta === valor
                    ? 'bg-emerald-500 text-white'
                    : valor > userSaldo
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-emerald-100 hover:text-emerald-700'
                }`}
              >
                {formatCurrency(valor)}
              </button>
            ))}
          </div>
          
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor personalizado
            </label>
            <input
              type="number"
              min="1"
              max={userSaldo}
              value={valorAposta}
              onChange={(e) => setValorAposta(Math.max(1, Math.min(userSaldo, parseInt(e.target.value) || 1)))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Resumo da Aposta */}
      {numeroAposta && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Trophy className="text-yellow-600" />
            Resumo da Aposta
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Tipo de Aposta</div>
              <div className="font-semibold capitalize">{tipoAposta}</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600">
                {tipoAposta === 'grupo' ? 'Bicho' : 'Número'}
              </div>
              <div className="font-semibold">
                {tipoAposta === 'grupo' && bichoSelecionado ? (
                  <span className="flex items-center gap-2">
                    {bichoSelecionado.emoji} {bichoSelecionado.nome}
                  </span>
                ) : (
                  numeroAposta
                )}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600">Valor Apostado</div>
              <div className="font-semibold text-red-600">{formatCurrency(valorAposta)}</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600">Prêmio se Ganhar</div>
              <div className="font-semibold text-green-600">{formatCurrency(premioEstimado)}</div>
            </div>
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={!isValidAposta()}
            className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {!isValidAposta() 
              ? 'Preencha todos os campos' 
              : `Confirmar Aposta - ${formatCurrency(valorAposta)}`
            }
          </button>
        </div>
      )}
    </div>
  );
}