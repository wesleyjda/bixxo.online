"use client";

import { useState, useEffect } from "react";
import {
  CreditCard,
  Wifi,
  WifiOff,
  Calendar,
  Copy,
  Check,
  AlertTriangle,
  Settings,
  Zap,
  Construction,
} from "lucide-react";

type Gateway = "openpix" | "bynet" | "cactos";

interface GatewayConfig {
  openpix: {
    appId: string;
    apiUrl: string;
    webhook: string;
    active: boolean;
  };
  bynet: {
    secretKey: string;
    webhook: string;
    active: boolean;
  };
  cactos: {
    active: boolean;
  };
}

export default function GatewaysPage() {
  const [mounted, setMounted] = useState(false);
  const [theme] = useState<'light' | 'dark'>('dark');
  const [activeTab, setActiveTab] = useState<Gateway>("openpix");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingGateway, setPendingGateway] = useState<Gateway | null>(null);
  const [testResult, setTestResult] = useState<{
    show: boolean;
    success: boolean;
    message: string;
  }>({ show: false, success: false, message: "" });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [config, setConfig] = useState<GatewayConfig>({
    openpix: {
      appId: "",
      apiUrl: "https://api.openpix.com.br/api/v1",
      webhook: "https://seudominio.com/api/pagamentos/openpix/webhook",
      active: true,
    },
    bynet: {
      secretKey: "",
      webhook: "https://seudominio.com/api/pagamentos/bynet/webhook",
      active: false,
    },
    cactos: {
      active: false,
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeGateway = Object.entries(config).find(
    ([_, cfg]) => cfg.active
  )?.[0] as Gateway | undefined;

  const bgColor = theme === 'dark' ? 'bg-[#1A1A1A]' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-[#2A2A2A]' : 'border-gray-200';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const inputBg = theme === 'dark' ? 'bg-[#0F0F0F]' : 'bg-gray-50';

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleToggleGateway = (gateway: Gateway) => {
    if (gateway === 'cactos') {
      alert('Cactos Pay está em desenvolvimento. Aguarde futuras atualizações.');
      return;
    }

    const currentActive = Object.entries(config).find(
      ([_, cfg]) => cfg.active
    )?.[0];

    if (currentActive && currentActive !== gateway) {
      setPendingGateway(gateway);
      setShowConfirmModal(true);
    } else {
      toggleGateway(gateway);
    }
  };

  const confirmActivation = () => {
    if (pendingGateway) {
      toggleGateway(pendingGateway);
    }
    setShowConfirmModal(false);
    setPendingGateway(null);
  };

  const toggleGateway = (gateway: Gateway) => {
    setConfig((prev) => {
      const newConfig = { ...prev };
      Object.keys(newConfig).forEach((key) => {
        newConfig[key as Gateway].active = key === gateway;
      });
      return newConfig;
    });
  };

  const handleTestConnection = () => {
    setTimeout(() => {
      const success = Math.random() > 0.3;
      setTestResult({
        show: true,
        success,
        message: success
          ? "Conexão estabelecida com sucesso! Credenciais válidas."
          : "Erro ao conectar. Verifique suas credenciais e tente novamente.",
      });
    }, 1500);
  };

  const handleSaveConfig = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const getGatewayColor = (gateway: Gateway) => {
    const colors = {
      openpix: "from-green-500 to-emerald-600",
      bynet: "from-blue-500 to-indigo-600",
      cactos: "from-orange-500 to-amber-600",
    };
    return colors[gateway];
  };

  const getGatewayName = (gateway: Gateway) => {
    const names = {
      openpix: "OpenPix (Woovi)",
      bynet: "Bynet",
      cactos: "Cactos Pay",
    };
    return names[gateway];
  };

  // Previne hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${textColor} flex items-center gap-3`}>
            <CreditCard className="w-8 h-8 text-blue-600" />
            Gateways de Pagamento
          </h1>
          <p className={textSecondary}>
            Configure e gerencie seus métodos de pagamento
          </p>
        </div>
      </div>

      {/* Cards Informativos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Gateway Ativo */}
        <div className={`${bgColor} rounded-2xl shadow-lg p-6 border ${borderColor}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-sm font-medium ${textSecondary}`}>
              Gateway Ativo
            </h3>
            <Zap className="w-5 h-5 text-yellow-500" />
          </div>
          <p className={`text-2xl font-bold ${textColor}`}>
            {activeGateway ? getGatewayName(activeGateway) : "Nenhum"}
          </p>
          {activeGateway && (
            <div
              className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getGatewayColor(
                activeGateway
              )} text-white`}
            >
              Ativo
            </div>
          )}
        </div>

        {/* Status da Conexão */}
        <div className={`${bgColor} rounded-2xl shadow-lg p-6 border ${borderColor}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-sm font-medium ${textSecondary}`}>
              Status da Conexão
            </h3>
            {activeGateway ? (
              <Wifi className="w-5 h-5 text-green-500" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-500" />
            )}
          </div>
          <p className={`text-2xl font-bold ${textColor}`}>
            {activeGateway ? "Online" : "Offline"}
          </p>
          <div
            className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              activeGateway
                ? theme === 'dark' 
                  ? "bg-green-900/30 text-green-400"
                  : "bg-green-100 text-green-700"
                : theme === 'dark'
                ? "bg-red-900/30 text-red-400"
                : "bg-red-100 text-red-700"
            }`}
          >
            {activeGateway ? "Conectado" : "Desconectado"}
          </div>
        </div>

        {/* Última Sincronização */}
        <div className={`${bgColor} rounded-2xl shadow-lg p-6 border ${borderColor}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-sm font-medium ${textSecondary}`}>
              Última Sincronização
            </h3>
            <Calendar className="w-5 h-5 text-blue-500" />
          </div>
          <p className={`text-2xl font-bold ${textColor}`}>
            {new Date().toLocaleDateString("pt-BR")}
          </p>
          <p className={`text-sm ${textSecondary} mt-1`}>
            {new Date().toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      {/* Alerta de Gateway Único */}
      {Object.values(config).filter((cfg) => cfg.active).length > 0 && (
        <div className={`${theme === 'dark' ? 'bg-amber-900/20 border-amber-800' : 'bg-amber-50 border-amber-200'} border rounded-xl p-4 flex items-start gap-3`}>
          <AlertTriangle className={`w-5 h-5 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'} flex-shrink-0 mt-0.5`} />
          <div>
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-amber-200' : 'text-amber-900'}`}>
              Atenção: apenas um gateway pode ser utilizado por vez
            </p>
            <p className={`text-xs ${theme === 'dark' ? 'text-amber-300' : 'text-amber-700'} mt-1`}>
              Ao ativar um novo gateway, o atual será automaticamente
              desativado.
            </p>
          </div>
        </div>
      )}

      {/* Mensagem de Sucesso */}
      {saveSuccess && (
        <div className={`${theme === 'dark' ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'} border rounded-xl p-4 flex items-center gap-3`}>
          <Check className={`w-5 h-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
          <p className={`text-sm font-medium ${theme === 'dark' ? 'text-green-200' : 'text-green-900'}`}>
            Configurações salvas com sucesso!
          </p>
        </div>
      )}

      {/* Abas */}
      <div className={`${bgColor} rounded-2xl shadow-lg border ${borderColor} overflow-hidden`}>
        {/* Tab Headers */}
        <div className={`flex border-b ${borderColor} ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
          {(["openpix", "bynet", "cactos"] as Gateway[]).map((gateway) => (
            <button
              key={gateway}
              onClick={() => setActiveTab(gateway)}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-all relative ${
                activeTab === gateway
                  ? `${textColor} ${bgColor}`
                  : `${textSecondary} hover:${textColor}`
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                {getGatewayName(gateway)}
                {config[gateway].active && (
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                )}
              </span>
              {activeTab === gateway && (
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${getGatewayColor(
                    gateway
                  )}`}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {/* OpenPix */}
          {activeTab === "openpix" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getGatewayColor(
                    "openpix"
                  )} flex items-center justify-center`}
                >
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${textColor}`}>
                    OpenPix (Woovi)
                  </h3>
                  <p className={`text-sm ${textSecondary}`}>
                    Configure suas credenciais da Woovi
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-2`}>
                    App ID
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={config.openpix.appId}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        openpix: { ...config.openpix, appId: e.target.value },
                      })
                    }
                    placeholder="Digite o App ID"
                    className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-2`}>
                    URL da API
                  </label>
                  <input
                    type="text"
                    value={config.openpix.apiUrl}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        openpix: {
                          ...config.openpix,
                          apiUrl: e.target.value,
                        },
                      })
                    }
                    className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium ${textColor} mb-2`}>
                    Webhook de Retorno
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={config.openpix.webhook}
                      readOnly
                      className={`flex-1 px-4 py-3 rounded-lg border ${borderColor} ${theme === 'dark' ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-50 text-gray-700'}`}
                    />
                    <button
                      onClick={() =>
                        handleCopy(config.openpix.webhook, "openpix-webhook")
                      }
                      className={`px-4 py-3 rounded-xl ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-all`}
                    >
                      {copiedField === "openpix-webhook" ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <Copy className={`w-5 h-5 ${textSecondary}`} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className={`flex items-center justify-between p-4 ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-xl`}>
                <div>
                  <p className={`text-sm font-medium ${textColor}`}>
                    Ativar este gateway
                  </p>
                  <p className={`text-xs ${textSecondary} mt-1`}>
                    Desativa automaticamente outros gateways
                  </p>
                </div>
                <button
                  onClick={() => handleToggleGateway("openpix")}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    config.openpix.active ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      config.openpix.active ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Bynet */}
          {activeTab === "bynet" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getGatewayColor(
                    "bynet"
                  )} flex items-center justify-center`}
                >
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${textColor}`}>
                    Bynet
                  </h3>
                  <p className={`text-sm ${textSecondary}`}>
                    Configure sua chave secreta da Bynet
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-2`}>
                    Chave Secreta
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="password"
                    value={config.bynet.secretKey}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        bynet: {
                          ...config.bynet,
                          secretKey: e.target.value,
                        },
                      })
                    }
                    placeholder="Digite a chave secreta"
                    className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-2`}>
                    Webhook de Retorno
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={config.bynet.webhook}
                      readOnly
                      className={`flex-1 px-4 py-3 rounded-lg border ${borderColor} ${theme === 'dark' ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-50 text-gray-700'}`}
                    />
                    <button
                      onClick={() =>
                        handleCopy(config.bynet.webhook, "bynet-webhook")
                      }
                      className={`px-4 py-3 rounded-xl ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-all`}
                    >
                      {copiedField === "bynet-webhook" ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <Copy className={`w-5 h-5 ${textSecondary}`} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className={`flex items-center justify-between p-4 ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-xl`}>
                <div>
                  <p className={`text-sm font-medium ${textColor}`}>
                    Ativar este gateway
                  </p>
                  <p className={`text-xs ${textSecondary} mt-1`}>
                    Desativa automaticamente outros gateways
                  </p>
                </div>
                <button
                  onClick={() => handleToggleGateway("bynet")}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    config.bynet.active ? 'bg-blue-500' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      config.bynet.active ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Cactos Pay */}
          {activeTab === "cactos" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getGatewayColor(
                    "cactos"
                  )} flex items-center justify-center`}
                >
                  <Construction className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${textColor}`}>
                    Cactos Pay
                  </h3>
                  <p className={`text-sm ${textSecondary}`}>
                    Gateway em desenvolvimento
                  </p>
                </div>
              </div>

              <div className={`${theme === 'dark' ? 'bg-orange-900/20 border-orange-800' : 'bg-orange-50 border-orange-200'} border-2 rounded-xl p-8 text-center`}>
                <Construction className={`w-16 h-16 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'} mx-auto mb-4`} />
                <h4 className={`text-lg font-bold ${textColor} mb-2`}>
                  Em Desenvolvimento
                </h4>
                <p className={`${textSecondary} mb-4`}>
                  O gateway Cactos Pay está sendo desenvolvido e estará disponível em breve.
                </p>
                <p className={`text-sm ${textSecondary}`}>
                  Não temos contas para teste ainda. Aguarde futuras atualizações.
                </p>
              </div>

              <div className={`flex items-center justify-between p-4 ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-xl opacity-50 cursor-not-allowed`}>
                <div>
                  <p className={`text-sm font-medium ${textColor}`}>
                    Ativar este gateway
                  </p>
                  <p className={`text-xs ${textSecondary} mt-1`}>
                    Indisponível no momento
                  </p>
                </div>
                <button
                  disabled
                  className="relative w-14 h-8 rounded-full bg-gray-600 cursor-not-allowed"
                >
                  <div className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full" />
                </button>
              </div>
            </div>
          )}

          {/* Botões de Ação */}
          {activeTab !== 'cactos' && (
            <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleTestConnection}
                className={`flex-1 px-6 py-3 rounded-xl ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} ${textColor} font-medium transition-all flex items-center justify-center gap-2`}
              >
                <Settings className="w-5 h-5" />
                Testar Conexão
              </button>
              <button
                onClick={handleSaveConfig}
                className={`flex-1 px-6 py-3 rounded-xl bg-gradient-to-r ${getGatewayColor(
                  activeTab
                )} text-white font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2`}
              >
                <Check className="w-5 h-5" />
                Salvar Configurações
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Confirmação */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${bgColor} rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4`}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full ${theme === 'dark' ? 'bg-amber-900/30' : 'bg-amber-100'} flex items-center justify-center`}>
                <AlertTriangle className={`w-6 h-6 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`} />
              </div>
              <h3 className={`text-xl font-bold ${textColor}`}>
                Confirmar Ativação
              </h3>
            </div>
            <p className={textSecondary}>
              Ativar este gateway desativará os outros. Deseja continuar?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setPendingGateway(null);
                }}
                className={`flex-1 px-4 py-2 rounded-xl ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} ${textColor} font-medium transition-all`}
              >
                Cancelar
              </button>
              <button
                onClick={confirmActivation}
                className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:shadow-lg transition-all"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Resultado do Teste */}
      {testResult.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${bgColor} rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4`}>
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  testResult.success
                    ? theme === 'dark' ? "bg-green-900/30" : "bg-green-100"
                    : theme === 'dark' ? "bg-red-900/30" : "bg-red-100"
                }`}
              >
                {testResult.success ? (
                  <Check className={`w-6 h-6 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                ) : (
                  <AlertTriangle className={`w-6 h-6 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} />
                )}
              </div>
              <h3 className={`text-xl font-bold ${textColor}`}>
                {testResult.success ? "Sucesso!" : "Erro na Conexão"}
              </h3>
            </div>
            <p className={textSecondary}>
              {testResult.message}
            </p>
            <button
              onClick={() =>
                setTestResult({ show: false, success: false, message: "" })
              }
              className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:shadow-lg transition-all"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
