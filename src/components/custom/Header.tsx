'use client';

import { useState } from 'react';
import { Menu, X, User, LogIn, Trophy, Gamepad2, Wallet, History } from 'lucide-react';

interface HeaderProps {
  onNavigate?: (page: string) => void;
  isLoggedIn?: boolean;
}

export default function Header({ onNavigate, isLoggedIn = false }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavigation = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavigation('home')}
              className="flex items-center gap-2 text-white hover:text-yellow-300 transition-colors duration-200"
            >
              <div className="text-3xl">🎯</div>
              <div className="hidden sm:block">
                <div className="text-xl font-bold">Jogo do Bicho</div>
                <div className="text-xs text-emerald-100">Online</div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => handleNavigation('apostas')}
                  className="flex items-center gap-2 text-white hover:text-yellow-300 transition-colors duration-200 font-medium"
                >
                  <Gamepad2 size={18} />
                  <span>Jogar</span>
                </button>
                <button
                  onClick={() => handleNavigation('resultados')}
                  className="flex items-center gap-2 text-white hover:text-yellow-300 transition-colors duration-200 font-medium"
                >
                  <Trophy size={18} />
                  <span>Resultados</span>
                </button>
                <button
                  onClick={() => handleNavigation('carteira')}
                  className="flex items-center gap-2 text-white hover:text-yellow-300 transition-colors duration-200 font-medium"
                >
                  <Wallet size={18} />
                  <span>Carteira</span>
                </button>
                <button
                  onClick={() => handleNavigation('historico')}
                  className="flex items-center gap-2 text-white hover:text-yellow-300 transition-colors duration-200 font-medium"
                >
                  <History size={18} />
                  <span>Histórico</span>
                </button>
                <button
                  onClick={() => handleNavigation('conta')}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                >
                  <User size={18} />
                  <span>Minha Conta</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavigation('home')}
                  className="text-white hover:text-yellow-300 transition-colors duration-200 font-medium"
                >
                  Início
                </button>
                <button
                  onClick={() => handleNavigation('resultados')}
                  className="text-white hover:text-yellow-300 transition-colors duration-200 font-medium"
                >
                  Resultados
                </button>
                <button
                  onClick={() => handleNavigation('login')}
                  className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-semibold"
                >
                  <LogIn size={18} />
                  <span>Entrar</span>
                </button>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-white hover:text-yellow-300 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-emerald-700 rounded-b-lg shadow-xl mb-2 animate-in slide-in-from-top duration-200">
            <nav className="py-4 space-y-2">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => handleNavigation('apostas')}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 text-white hover:bg-emerald-600 transition-colors duration-200 font-medium"
                  >
                    <Gamepad2 size={20} />
                    <span>Jogar</span>
                  </button>
                  <button
                    onClick={() => handleNavigation('resultados')}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 text-white hover:bg-emerald-600 transition-colors duration-200 font-medium"
                  >
                    <Trophy size={20} />
                    <span>Resultados</span>
                  </button>
                  <button
                    onClick={() => handleNavigation('carteira')}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 text-white hover:bg-emerald-600 transition-colors duration-200 font-medium"
                  >
                    <Wallet size={20} />
                    <span>Carteira</span>
                  </button>
                  <button
                    onClick={() => handleNavigation('historico')}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 text-white hover:bg-emerald-600 transition-colors duration-200 font-medium"
                  >
                    <History size={20} />
                    <span>Histórico</span>
                  </button>
                  <div className="border-t border-emerald-600 my-2"></div>
                  <button
                    onClick={() => handleNavigation('conta')}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 text-white hover:bg-emerald-600 transition-colors duration-200 font-medium"
                  >
                    <User size={20} />
                    <span>Minha Conta</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNavigation('home')}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 text-white hover:bg-emerald-600 transition-colors duration-200 font-medium"
                  >
                    Início
                  </button>
                  <button
                    onClick={() => handleNavigation('resultados')}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 text-white hover:bg-emerald-600 transition-colors duration-200 font-medium"
                  >
                    Resultados
                  </button>
                  <div className="px-4 py-2">
                    <button
                      onClick={() => handleNavigation('login')}
                      className="flex items-center justify-center gap-2 w-full bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-semibold"
                    >
                      <LogIn size={20} />
                      <span>Entrar</span>
                    </button>
                  </div>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
