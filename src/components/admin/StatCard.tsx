'use client';

import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  theme?: 'light' | 'dark';
}

export default function StatCard({ title, value, icon: Icon, trend, theme = 'dark' }: StatCardProps) {
  const bgColor = theme === 'dark' ? 'bg-[#1A1A1A]' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const borderColor = theme === 'dark' ? 'border-[#2A2A2A]' : 'border-gray-200';

  return (
    <div className={`${bgColor} rounded-xl p-6 border ${borderColor} shadow-lg hover:shadow-xl transition-shadow duration-200`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm ${mutedColor} mb-1`}>{title}</p>
          <p className={`text-3xl font-bold ${textColor} mb-2`}>{value}</p>
          {trend && (
            <div className={`flex items-center gap-1 text-sm ${trend.isPositive ? 'text-[#00FF88]' : 'text-red-400'}`}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{trend.value}</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-lg bg-gradient-to-br from-[#00FF88]/20 to-[#0066FF]/20">
          <Icon size={24} className="text-[#00FF88]" />
        </div>
      </div>
    </div>
  );
}
