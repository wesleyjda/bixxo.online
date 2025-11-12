'use client';

import { X, Check } from 'lucide-react';
import { ReactNode } from 'react';

interface Step {
  id: number;
  title: string;
  description: string;
}

interface MultiStepModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  steps: Step[];
  currentStep: number;
  children: ReactNode;
  onNext?: () => void;
  onPrevious?: () => void;
  onFinish?: () => void;
  canGoNext?: boolean;
  theme?: 'light' | 'dark';
}

export default function MultiStepModal({
  isOpen,
  onClose,
  title,
  steps,
  currentStep,
  children,
  onNext,
  onPrevious,
  onFinish,
  canGoNext = true,
  theme = 'dark'
}: MultiStepModalProps) {
  if (!isOpen) return null;

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === steps.length;

  const bgColor = theme === 'dark' ? 'bg-[#1A1A1A]' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-[#2A2A2A]' : 'border-gray-200';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`relative w-full max-w-3xl ${bgColor} rounded-2xl border ${borderColor} shadow-2xl animate-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${borderColor}`}>
          <div>
            <h2 className={`text-2xl font-bold ${textColor}`}>{title}</h2>
            <p className={`text-sm ${textSecondary} mt-1`}>
              Passo {currentStep} de {steps.length}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-[#2A2A2A]' : 'hover:bg-gray-100'} transition-colors`}
          >
            <X className={textSecondary} size={24} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const isActive = stepNumber === currentStep;
              const isCompleted = stepNumber < currentStep;

              return (
                <div key={step.id} className="flex items-center flex-1">
                  {/* Step Circle */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                        isCompleted
                          ? 'bg-gradient-to-r from-[#00FF88] to-[#0066FF] text-white'
                          : isActive
                          ? 'bg-gradient-to-r from-[#00FF88] to-[#0066FF] text-white ring-4 ring-[#00FF88]/20'
                          : theme === 'dark'
                          ? 'bg-[#2A2A2A] text-gray-500'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {isCompleted ? <Check size={20} /> : stepNumber}
                    </div>
                    <div className="mt-2 text-center">
                      <div
                        className={`text-xs font-medium ${
                          isActive || isCompleted ? 'text-[#00FF88]' : textSecondary
                        }`}
                      >
                        {step.title}
                      </div>
                      <div className={`text-xs ${textSecondary} mt-0.5 hidden sm:block`}>
                        {step.description}
                      </div>
                    </div>
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${
                        stepNumber < currentStep
                          ? 'bg-gradient-to-r from-[#00FF88] to-[#0066FF]'
                          : theme === 'dark'
                          ? 'bg-[#2A2A2A]'
                          : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between p-6 border-t ${borderColor}`}>
          <button
            onClick={onPrevious}
            disabled={isFirstStep}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
              isFirstStep
                ? 'bg-transparent text-gray-500 cursor-not-allowed'
                : theme === 'dark'
                ? 'bg-[#2A2A2A] text-white hover:bg-[#3A3A3A]'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
          >
            Voltar
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-colors ${
                theme === 'dark'
                  ? 'bg-[#2A2A2A] text-white hover:bg-[#3A3A3A]'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              Cancelar
            </button>

            {isLastStep ? (
              <button
                onClick={onFinish}
                disabled={!canGoNext}
                className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                  canGoNext
                    ? 'bg-gradient-to-r from-[#00FF88] to-[#0066FF] text-white hover:opacity-90'
                    : 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                }`}
              >
                Finalizar Cadastro
              </button>
            ) : (
              <button
                onClick={onNext}
                disabled={!canGoNext}
                className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                  canGoNext
                    ? 'bg-gradient-to-r from-[#00FF88] to-[#0066FF] text-white hover:opacity-90'
                    : 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                }`}
              >
                Próximo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
