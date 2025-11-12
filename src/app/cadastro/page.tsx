'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, Mail, Lock, User, Phone, Eye, EyeOff, ArrowLeft, Gift } from 'lucide-react';
import Link from 'next/link';

export default function CadastroPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.senha !== formData.confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    setLoading(true);
    
    // Simulação de cadastro
    setTimeout(() => {
      setLoading(false);
      router.push('/');
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4 py-12">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00FF88]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#0066FF]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Botão Voltar */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00FF88] transition-colors duration-200 mb-6"
        >
          <ArrowLeft size={20} />
          <span>Voltar para início</span>
        </Link>

        {/* Card de Cadastro */}
        <div className="bg-[#1A1A1A] rounded-2xl shadow-2xl border border-[#2A2A2A] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#00FF88] to-[#00CC70] p-8 text-center">
            <div className="text-5xl mb-4">🎯</div>
            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Crie sua conta</h1>
            <p className="text-[#0A0A0A]/80">Cadastre-se e ganhe R$ 50 de bônus!</p>
          </div>

          {/* Banner de Bônus */}
          <div className="bg-gradient-to-r from-[#0066FF]/20 to-[#00FF88]/20 border-y border-[#2A2A2A] p-4">
            <div className="flex items-center justify-center gap-2 text-center">
              <Gift className="text-[#00FF88]" size={24} />
              <p className="text-white font-semibold">
                Bônus de Boas-Vindas: <span className="text-[#00FF88]">R$ 50,00</span>
              </p>
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {/* Nome Completo */}
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-300 mb-2">
                Nome Completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="text-gray-400" size={20} />
                </div>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF88] focus:ring-2 focus:ring-[#00FF88]/20 transition-all duration-200"
                  placeholder="João Silva"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="text-gray-400" size={20} />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF88] focus:ring-2 focus:ring-[#00FF88]/20 transition-all duration-200"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            {/* Telefone */}
            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-gray-300 mb-2">
                Telefone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="text-gray-400" size={20} />
                </div>
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF88] focus:ring-2 focus:ring-[#00FF88]/20 transition-all duration-200"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="text-gray-400" size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="senha"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg pl-12 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF88] focus:ring-2 focus:ring-[#00FF88]/20 transition-all duration-200"
                  placeholder="Mínimo 6 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirmar Senha */}
            <div>
              <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-300 mb-2">
                Confirmar Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="text-gray-400" size={20} />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmarSenha"
                  name="confirmarSenha"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg pl-12 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF88] focus:ring-2 focus:ring-[#00FF88]/20 transition-all duration-200"
                  placeholder="Repita sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Termos */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="termos"
                required
                className="w-4 h-4 mt-1 rounded border-[#2A2A2A] bg-[#0F0F0F] text-[#00FF88] focus:ring-[#00FF88] focus:ring-offset-0"
              />
              <label htmlFor="termos" className="ml-2 text-sm text-gray-400">
                Eu concordo com os{' '}
                <a href="#" className="text-[#00FF88] hover:text-[#00CC70] transition-colors">
                  Termos de Uso
                </a>{' '}
                e{' '}
                <a href="#" className="text-[#00FF88] hover:text-[#00CC70] transition-colors">
                  Política de Privacidade
                </a>
              </label>
            </div>

            {/* Botão de Cadastro */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#00FF88] to-[#00CC70] hover:from-[#00CC70] hover:to-[#00AA60] text-[#0A0A0A] font-bold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg shadow-[#00FF88]/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#0A0A0A]/30 border-t-[#0A0A0A] rounded-full animate-spin"></div>
                  <span>Criando conta...</span>
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  <span>Criar Conta Grátis</span>
                </>
              )}
            </button>

            {/* Divisor */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#2A2A2A]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#1A1A1A] text-gray-400">ou</span>
              </div>
            </div>

            {/* Link para Login */}
            <div className="text-center">
              <p className="text-gray-400">
                Já tem uma conta?{' '}
                <Link
                  href="/login"
                  className="text-[#0066FF] hover:text-[#0088FF] font-semibold transition-colors duration-200"
                >
                  Faça login
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Informações adicionais */}
        <div className="mt-6 text-center">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-2">
              🔒 Seus dados estão seguros e protegidos
            </p>
            <p className="text-xs text-gray-500">
              +18 anos • Jogue com responsabilidade
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
