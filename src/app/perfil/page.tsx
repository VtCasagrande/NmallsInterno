'use client'

import { useState } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Bell, 
  Shield, 
  Save,
  Camera,
  LogOut
} from 'lucide-react'

// Dados de exemplo do usuário
const usuarioExemplo = {
  id: 'USR-1001',
  nome: 'João Silva',
  email: 'joao.silva@exemplo.com',
  telefone: '(11) 98765-4321',
  cargo: 'Administrador',
  departamento: 'Operações',
  avatar: null,
  dataCadastro: '2024-12-01',
  ultimoAcesso: '2025-03-05T10:30:00'
}

export default function PerfilPage() {
  const [usuario, setUsuario] = useState(usuarioExemplo)
  const [formData, setFormData] = useState({
    nome: usuario.nome,
    email: usuario.email,
    telefone: usuario.telefone,
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  })
  const [notificacoes, setNotificacoes] = useState({
    email: true,
    push: true,
    entregas: true,
    compras: true,
    trocas: false,
    influenciadores: true
  })
  const [editMode, setEditMode] = useState(false)
  const [activeTab, setActiveTab] = useState('perfil')
  const [isSaving, setIsSaving] = useState(false)
  
  // Função para atualizar o formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Função para alternar notificações
  const toggleNotificacao = (key: string) => {
    setNotificacoes(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }))
  }
  
  // Função para salvar alterações
  const handleSave = () => {
    setIsSaving(true)
    
    // Simular uma chamada de API
    setTimeout(() => {
      setUsuario(prev => ({
        ...prev,
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone
      }))
      setEditMode(false)
      setIsSaving(false)
    }, 1000)
  }
  
  // Função para formatar data
  const formatarData = (dataString: string) => {
    const data = new Date(dataString)
    return data.toLocaleDateString('pt-BR')
  }
  
  // Função para formatar data e hora
  const formatarDataHora = (dataString: string) => {
    const data = new Date(dataString)
    return `${data.toLocaleDateString('pt-BR')} às ${data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
  }
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-4">
            <Card>
              <CardContent className="p-6 flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {usuario.avatar ? (
                      <div className="relative h-24 w-24">
                        <div className="h-24 w-24 rounded-full bg-gray-200" />
                        {/* Placeholder para avatar - em produção usaria Image do Next.js */}
                      </div>
                    ) : (
                      <User className="h-12 w-12 text-gray-500" />
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-primary-500 text-white p-1 rounded-full">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="text-lg font-medium">{usuario.nome}</h3>
                <p className="text-sm text-gray-500">{usuario.cargo}</p>
                <p className="text-xs text-gray-400">{usuario.departamento}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-0">
                <nav className="flex flex-col">
                  <button
                    className={`flex items-center px-4 py-3 text-sm ${activeTab === 'perfil' ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => setActiveTab('perfil')}
                  >
                    <User className="h-4 w-4 mr-3" />
                    Informações Pessoais
                  </button>
                  <button
                    className={`flex items-center px-4 py-3 text-sm ${activeTab === 'seguranca' ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => setActiveTab('seguranca')}
                  >
                    <Lock className="h-4 w-4 mr-3" />
                    Segurança
                  </button>
                  <button
                    className={`flex items-center px-4 py-3 text-sm ${activeTab === 'notificacoes' ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => setActiveTab('notificacoes')}
                  >
                    <Bell className="h-4 w-4 mr-3" />
                    Notificações
                  </button>
                </nav>
              </CardContent>
            </Card>
            
            <Button 
              variant="outline" 
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
              leftIcon={<LogOut className="h-4 w-4" />}
            >
              Sair
            </Button>
          </div>
          
          {/* Conteúdo Principal */}
          <div className="flex-1">
            {activeTab === 'perfil' && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Informações Pessoais</CardTitle>
                  <Button 
                    variant={editMode ? "default" : "outline"}
                    onClick={() => editMode ? handleSave() : setEditMode(true)}
                    disabled={isSaving}
                  >
                    {editMode ? (
                      <>
                        {isSaving ? 'Salvando...' : 'Salvar'}
                        <Save className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      'Editar'
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="nome" className="text-sm font-medium text-gray-700">
                          Nome Completo
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="nome"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            disabled={!editMode}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">
                          E-mail
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={!editMode}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="telefone" className="text-sm font-medium text-gray-700">
                          Telefone
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            id="telefone"
                            name="telefone"
                            value={formData.telefone}
                            onChange={handleChange}
                            disabled={!editMode}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Cargo
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            value={usuario.cargo}
                            disabled
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full bg-gray-50 text-gray-500"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4 mt-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Informações da Conta</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">ID do Usuário</p>
                          <p className="font-medium">{usuario.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Departamento</p>
                          <p className="font-medium">{usuario.departamento}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Data de Cadastro</p>
                          <p className="font-medium">{formatarData(usuario.dataCadastro)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Último Acesso</p>
                          <p className="font-medium">{formatarDataHora(usuario.ultimoAcesso)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {activeTab === 'seguranca' && (
              <Card>
                <CardHeader>
                  <CardTitle>Segurança</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-gray-700">Alterar Senha</h3>
                      
                      <div className="space-y-2">
                        <label htmlFor="senhaAtual" className="text-sm font-medium text-gray-700">
                          Senha Atual
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="password"
                            id="senhaAtual"
                            name="senhaAtual"
                            value={formData.senhaAtual}
                            onChange={handleChange}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="novaSenha" className="text-sm font-medium text-gray-700">
                          Nova Senha
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="password"
                            id="novaSenha"
                            name="novaSenha"
                            value={formData.novaSenha}
                            onChange={handleChange}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="confirmarSenha" className="text-sm font-medium text-gray-700">
                          Confirmar Nova Senha
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="password"
                            id="confirmarSenha"
                            name="confirmarSenha"
                            value={formData.confirmarSenha}
                            onChange={handleChange}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
                          />
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <Button>
                          Alterar Senha
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4 mt-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Segurança da Conta</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Autenticação de Dois Fatores</p>
                            <p className="text-sm text-gray-500">Adicione uma camada extra de segurança à sua conta</p>
                          </div>
                          <Button variant="outline">
                            Configurar
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Sessões Ativas</p>
                            <p className="text-sm text-gray-500">Gerencie os dispositivos conectados à sua conta</p>
                          </div>
                          <Button variant="outline">
                            Gerenciar
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Histórico de Atividades</p>
                            <p className="text-sm text-gray-500">Visualize ações recentes realizadas na sua conta</p>
                          </div>
                          <Button variant="outline">
                            Visualizar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {activeTab === 'notificacoes' && (
              <Card>
                <CardHeader>
                  <CardTitle>Notificações</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-gray-700">Canais de Notificação</h3>
                      
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium">Notificações por E-mail</p>
                          <p className="text-sm text-gray-500">Receba atualizações no seu e-mail</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={notificacoes.email}
                            onChange={() => toggleNotificacao('email')}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium">Notificações Push</p>
                          <p className="text-sm text-gray-500">Receba notificações no navegador</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={notificacoes.push}
                            onChange={() => toggleNotificacao('push')}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4 mt-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Tipos de Notificação</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-2">
                          <div>
                            <p className="font-medium">Entregas</p>
                            <p className="text-sm text-gray-500">Atualizações sobre entregas e rastreamento</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={notificacoes.entregas}
                              onChange={() => toggleNotificacao('entregas')}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between py-2">
                          <div>
                            <p className="font-medium">Compras</p>
                            <p className="text-sm text-gray-500">Atualizações sobre pedidos e fornecedores</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={notificacoes.compras}
                              onChange={() => toggleNotificacao('compras')}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between py-2">
                          <div>
                            <p className="font-medium">Trocas e Empréstimos</p>
                            <p className="text-sm text-gray-500">Atualizações sobre solicitações de troca</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={notificacoes.trocas}
                              onChange={() => toggleNotificacao('trocas')}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between py-2">
                          <div>
                            <p className="font-medium">Influenciadores</p>
                            <p className="text-sm text-gray-500">Atualizações sobre campanhas e parcerias</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={notificacoes.influenciadores}
                              onChange={() => toggleNotificacao('influenciadores')}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 flex justify-end">
                      <Button>
                        Salvar Preferências
                      </Button>
                    </div>
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