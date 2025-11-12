// Fontes disponíveis no sistema
// Este arquivo garante que todas as fontes estejam carregadas

import { Inter, Roboto, Fira_Code, JetBrains_Mono } from 'next/font/google';

// Configuração das fontes
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

export const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
  display: 'swap',
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

// CSS personalizado para as fontes
export const fontClasses = {
  'font-inter': inter.className,
  'font-roboto': roboto.className,
  'font-fira-code': firaCode.className,
  'font-jetbrains': jetbrainsMono.className,
};