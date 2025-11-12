'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulação de autenticação
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
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0066FF]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00FF88]/10 rounded-full blur-3xl"></div>
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

        {/* Card de Login */}
        <div className="bg-[#1A1A1A] rounded-2xl shadow-2xl border border-[#2A2A2A] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0066FF] to-[#0044CC] p-8 text-center">
            <div className="text-5xl mb-4">🎯</div>
            <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo de volta!</h1>
            <p className="text-white/80">Entre para continuar jogando</p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
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
                  className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 transition-all duration-200"
                  placeholder="seu@email.com"
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
                  className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg pl-12 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 transition-all duration-200"
                  placeholder="••••••••"
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

            {/* Esqueceu a senha */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-[#2A2A2A] bg-[#0F0F0F] text-[#0066FF] focus:ring-[#0066FF] focus:ring-offset-0"
                />
                <span className="ml-2 text-sm text-gray-400">Lembrar-me</span>
              </label>
              <button
                type="button"
                className="text-sm text-[#0066FF] hover:text-[#0088FF] transition-colors duration-200"
              >
                Esqueceu a senha?
              </button>
            </div>

            {/* Botão de Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#00FF88] to-[#00CC70] hover:from-[#00CC70] hover:to-[#00AA60] text-[#0A0A0A] font-bold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg shadow-[#00FF88]/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#0A0A0A]/30 border-t-[#0A0A0A] rounded-full animate-spin"></div>
                  <span>Entrando...</span>
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Entrar</span>
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

            {/* Link para Cadastro */}
            <div className="text-center">
              <p className="text-gray-400">
                Não tem uma conta?{' '}
                <Link
                  href="/cadastro"
                  className="text-[#00FF88] hover:text-[#00CC70] font-semibold transition-colors duration-200"
                >
                  Cadastre-se grátis
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Informações adicionais */}
        <div className="mt-6 text-center text-sm text-gray-400">
          <p>Ao entrar, você concorda com nossos</p>
          <div className="flex items-center justify-center gap-2 mt-1">
            <a href="#" className="text-[#0066FF] hover:text-[#0088FF] transition-colors">
              Termos de Uso
            </a>
            <span>•</span>
            <a href="#" className="text-[#0066FF] hover:text-[#0088FF] transition-colors">
              Política de Privacidade
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
