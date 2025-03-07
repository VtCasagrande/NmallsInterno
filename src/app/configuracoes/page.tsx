'use client'

import { useState } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Settings, 
  Truck, 
  Database, 
  Globe, 
  Mail, 
  Bell, 
  Shield, 
  Users,
  Save,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState('geral')
  
  // Configurações de exemplo
  const [configGeral, setConfigGeral] = useState({
    nomeEmpresa: 'NMalls Logística',
    enderecoEmpresa: 'Av. Paulista, 1000 - São Paulo, SP',
    telefoneEmpresa: '(11) 3456-7890',
    emailContato: 'contato@nmalls.com.br',
    moeda: 'BRL',
    fusoHorario: 'America/Sao_Paulo',
    formatoData: 'DD/MM/YYYY'
  })
  
  // Função para atualizar configurações gerais
  const handleChangeGeral = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setConfigGeral(prev => ({ ...prev, [name]: value }))
  }
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-4">
            <Card>
              <CardContent className="p-0">
                <nav className="flex flex-col">
                  <button
                    className={`flex items-center px-4 py-3 text-sm ${activeTab === 'geral' ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => setActiveTab('geral')}
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Configurações Gerais
                  </button>
                  <button
                    className={`flex items-center px-4 py-3 text-sm ${activeTab === 'entregas' ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => setActiveTab('entregas')}
                  >
                    <Truck className="h-4 w-4 mr-3" />
                    Entregas
                  </button>
                  <button
                    className={`flex items-center px-4 py-3 text-sm ${activeTab === 'banco' ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => setActiveTab('banco')}
                  >
                    <Database className="h-4 w-4 mr-3" />
                    Banco de Dados
                  </button>
                  <button
                    className={`flex items-center px-4 py-3 text-sm ${activeTab === 'integracao' ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => setActiveTab('integracao')}
                  >
                    <Globe className="h-4 w-4 mr-3" />
                    Integrações
                  </button>
                  <button
                    className={`flex items-center px-4 py-3 text-sm ${activeTab === 'notificacoes' ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => setActiveTab('notificacoes')}
                  >
                    <Bell className="h-4 w-4 mr-3" />
                    Notificações
                  </button>
                  <button
                    className={`flex items-center px-4 py-3 text-sm ${activeTab === 'seguranca' ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => setActiveTab('seguranca')}
                  >
                    <Shield className="h-4 w-4 mr-3" />
                    Segurança
                  </button>
                  <button
                    className={`flex items-center px-4 py-3 text-sm ${activeTab === 'usuarios' ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => setActiveTab('usuarios')}
                  >
                    <Users className="h-4 w-4 mr-3" />
                    Usuários e Permissões
                  </button>
                </nav>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Configurações Específicas</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="flex flex-col">
                  <Link href="/configuracoes/motorista">
                    <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                      <div className="flex items-center">
                        <Truck className="h-4 w-4 mr-3" />
                        Motoristas
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </Link>
                </nav>
              </CardContent>
            </Card>
          </div>
          
          {/* Conteúdo Principal */}
          <div className="flex-1">
            {activeTab === 'geral' && (
              <Card>
                <CardHeader>
                  <CardTitle>Configurações Gerais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="nomeEmpresa" className="text-sm font-medium text-gray-700">
                          Nome da Empresa
                        </label>
                        <input
                          type="text"
                          id="nomeEmpresa"
                          name="nomeEmpresa"
                          value={configGeral.nomeEmpresa}
                          onChange={handleChangeGeral}
                          className="px-3 py-2 border border-gray-300 rounded-md w-full"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="enderecoEmpresa" className="text-sm font-medium text-gray-700">
                          Endereço
                        </label>
                        <input
                          type="text"
                          id="enderecoEmpresa"
                          name="enderecoEmpresa"
                          value={configGeral.enderecoEmpresa}
                          onChange={handleChangeGeral}
                          className="px-3 py-2 border border-gray-300 rounded-md w-full"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="telefoneEmpresa" className="text-sm font-medium text-gray-700">
                          Telefone
                        </label>
                        <input
                          type="text"
                          id="telefoneEmpresa"
                          name="telefoneEmpresa"
                          value={configGeral.telefoneEmpresa}
                          onChange={handleChangeGeral}
                          className="px-3 py-2 border border-gray-300 rounded-md w-full"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="emailContato" className="text-sm font-medium text-gray-700">
                          E-mail de Contato
                        </label>
                        <input
                          type="email"
                          id="emailContato"
                          name="emailContato"
                          value={configGeral.emailContato}
                          onChange={handleChangeGeral}
                          className="px-3 py-2 border border-gray-300 rounded-md w-full"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="moeda" className="text-sm font-medium text-gray-700">
                          Moeda
                        </label>
                        <select
                          id="moeda"
                          name="moeda"
                          value={configGeral.moeda}
                          onChange={handleChangeGeral}
                          className="px-3 py-2 border border-gray-300 rounded-md w-full"
                        >
                          <option value="BRL">Real Brasileiro (R$)</option>
                          <option value="USD">Dólar Americano ($)</option>
                          <option value="EUR">Euro (€)</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="fusoHorario" className="text-sm font-medium text-gray-700">
                          Fuso Horário
                        </label>
                        <select
                          id="fusoHorario"
                          name="fusoHorario"
                          value={configGeral.fusoHorario}
                          onChange={handleChangeGeral}
                          className="px-3 py-2 border border-gray-300 rounded-md w-full"
                        >
                          <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                          <option value="America/Manaus">Manaus (GMT-4)</option>
                          <option value="America/Belem">Belém (GMT-3)</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="formatoData" className="text-sm font-medium text-gray-700">
                          Formato de Data
                        </label>
                        <select
                          id="formatoData"
                          name="formatoData"
                          value={configGeral.formatoData}
                          onChange={handleChangeGeral}
                          className="px-3 py-2 border border-gray-300 rounded-md w-full"
                        >
                          <option value="DD/MM/YYYY">DD/MM/AAAA</option>
                          <option value="MM/DD/YYYY">MM/DD/AAAA</option>
                          <option value="YYYY-MM-DD">AAAA-MM-DD</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="pt-4 flex justify-end">
                      <Button leftIcon={<Save className="h-4 w-4" />}>
                        Salvar Configurações
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {activeTab === 'entregas' && (
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Entregas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="raioEntrega" className="text-sm font-medium text-gray-700">
                          Raio de Entrega (km)
                        </label>
                        <input
                          type="number"
                          id="raioEntrega"
                          name="raioEntrega"
                          defaultValue="50"
                          className="px-3 py-2 border border-gray-300 rounded-md w-full"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="tempoEstimado" className="text-sm font-medium text-gray-700">
                          Tempo Estimado Padrão (minutos)
                        </label>
                        <input
                          type="number"
                          id="tempoEstimado"
                          name="tempoEstimado"
                          defaultValue="45"
                          className="px-3 py-2 border border-gray-300 rounded-md w-full"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="apiMapa" className="text-sm font-medium text-gray-700">
                          API de Mapas
                        </label>
                        <select
                          id="apiMapa"
                          name="apiMapa"
                          defaultValue="google"
                          className="px-3 py-2 border border-gray-300 rounded-md w-full"
                        >
                          <option value="google">Google Maps</option>
                          <option value="mapbox">Mapbox</option>
                          <option value="openstreetmap">OpenStreetMap</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="chaveAPI" className="text-sm font-medium text-gray-700">
                          Chave da API
                        </label>
                        <input
                          type="text"
                          id="chaveAPI"
                          name="chaveAPI"
                          defaultValue="AIzaSyD3H14Zz-x8s1s1s1s1s1s1s1s1s1s1s1s"
                          className="px-3 py-2 border border-gray-300 rounded-md w-full"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4 pt-4">
                      <h3 className="text-sm font-medium text-gray-700">Configurações de Rastreamento</h3>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="rastreamentoAtivo"
                          name="rastreamentoAtivo"
                          defaultChecked
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="rastreamentoAtivo" className="text-sm text-gray-700">
                          Rastreamento em tempo real ativo
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="notificacoesCliente"
                          name="notificacoesCliente"
                          defaultChecked
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="notificacoesCliente" className="text-sm text-gray-700">
                          Enviar notificações para o cliente
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="economizarBateria"
                          name="economizarBateria"
                          defaultChecked
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="economizarBateria" className="text-sm text-gray-700">
                          Modo de economia de bateria
                        </label>
                      </div>
                    </div>
                    
                    <div className="pt-4 flex justify-end">
                      <Button leftIcon={<Save className="h-4 w-4" />}>
                        Salvar Configurações
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {activeTab === 'banco' && (
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Banco de Dados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="tipoBanco" className="text-sm font-medium text-gray-700">
                          Tipo de Banco de Dados
                        </label>
                        <select
                          id="tipoBanco"
                          name="tipoBanco"
                          defaultValue="postgresql"
                          className="px-3 py-2 border border-gray-300 rounded-md w-full"
                        >
                          <option value="postgresql">PostgreSQL</option>
                          <option value="mysql">MySQL</option>
                          <option value="mongodb">MongoDB</option>
                          <option value="sqlite">SQLite</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="hostBanco" className="text-sm font-medium text-gray-700">
                          Host
                        </label>
                        <input
                          type="text"
                          id="hostBanco"
                          name="hostBanco"
                          defaultValue="localhost"
                          className="px-3 py-2 border border-gray-300 rounded-md w-full"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="portaBanco" className="text-sm font-medium text-gray-700">
                          Porta
                        </label>
                        <input
                          type="text"
                          id="portaBanco"
                          name="portaBanco"
                          defaultValue="5432"
                          className="px-3 py-2 border border-gray-300 rounded-md w-full"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="nomeBanco" className="text-sm font-medium text-gray-700">
                          Nome do Banco
                        </label>
                        <input
                          type="text"
                          id="nomeBanco"
                          name="nomeBanco"
                          defaultValue="nmalls_db"
                          className="px-3 py-2 border border-gray-300 rounded-md w-full"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="usuarioBanco" className="text-sm font-medium text-gray-700">
                          Usuário
                        </label>
                        <input
                          type="text"
                          id="usuarioBanco"
                          name="usuarioBanco"
                          defaultValue="postgres"
                          className="px-3 py-2 border border-gray-300 rounded-md w-full"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="senhaBanco" className="text-sm font-medium text-gray-700">
                          Senha
                        </label>
                        <input
                          type="password"
                          id="senhaBanco"
                          name="senhaBanco"
                          defaultValue="********"
                          className="px-3 py-2 border border-gray-300 rounded-md w-full"
                        />
                      </div>
                    </div>
                    
                    <div className="pt-4 flex justify-end space-x-2">
                      <Button variant="outline">
                        Testar Conexão
                      </Button>
                      <Button leftIcon={<Save className="h-4 w-4" />}>
                        Salvar Configurações
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {activeTab !== 'geral' && activeTab !== 'entregas' && activeTab !== 'banco' && (
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
                      {activeTab === 'integracao' && <Globe className="h-8 w-8" />}
                      {activeTab === 'notificacoes' && <Bell className="h-8 w-8" />}
                      {activeTab === 'seguranca' && <Shield className="h-8 w-8" />}
                      {activeTab === 'usuarios' && <Users className="h-8 w-8" />}
                    </div>
                    <h3 className="text-lg font-medium mb-2">Configurações em Desenvolvimento</h3>
                    <p className="text-gray-500 mb-4">
                      Esta seção está em desenvolvimento e estará disponível em breve.
                    </p>
                    <Button variant="outline">
                      Voltar para Configurações Gerais
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 