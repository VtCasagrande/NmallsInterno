'use client'

import { useState, useEffect } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Settings, 
  MapPin, 
  Bell, 
  User,
  Shield,
  Navigation,
  Truck,
  Battery,
  Smartphone,
  Save,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

export default function ConfiguracoesMotoristaPage() {
  // Estados para as configurações
  const [rastreamentoAtivo, setRastreamentoAtivo] = useState(false)
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true)
  const [economizarBateria, setEconomizarBateria] = useState(true)
  const [intervaloAtualizacao, setIntervaloAtualizacao] = useState(30)
  const [navegadorPreferido, setNavegadorPreferido] = useState('google_maps')
  const [perfilPublico, setPerfilPublico] = useState(true)
  const [salvando, setSalvando] = useState(false)
  
  // Simular carregamento das configurações
  useEffect(() => {
    // Aqui você carregaria as configurações do usuário do backend
    const timeout = setTimeout(() => {
      setRastreamentoAtivo(localStorage.getItem('rastreamentoAtivo') === 'true')
      setNotificacoesAtivas(localStorage.getItem('notificacoesAtivas') !== 'false')
      setEconomizarBateria(localStorage.getItem('economizarBateria') !== 'false')
      setIntervaloAtualizacao(parseInt(localStorage.getItem('intervaloAtualizacao') || '30'))
      setNavegadorPreferido(localStorage.getItem('navegadorPreferido') || 'google_maps')
      setPerfilPublico(localStorage.getItem('perfilPublico') !== 'false')
    }, 500)
    
    return () => clearTimeout(timeout)
  }, [])
  
  // Salvar configurações
  const salvarConfiguracoes = () => {
    setSalvando(true)
    
    // Simular salvamento no backend
    setTimeout(() => {
      localStorage.setItem('rastreamentoAtivo', rastreamentoAtivo.toString())
      localStorage.setItem('notificacoesAtivas', notificacoesAtivas.toString())
      localStorage.setItem('economizarBateria', economizarBateria.toString())
      localStorage.setItem('intervaloAtualizacao', intervaloAtualizacao.toString())
      localStorage.setItem('navegadorPreferido', navegadorPreferido)
      localStorage.setItem('perfilPublico', perfilPublico.toString())
      
      setSalvando(false)
      alert('Configurações salvas com sucesso!')
    }, 1000)
  }
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Voltar
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Configurações do Motorista</h1>
          </div>
          <Button 
            variant="primary" 
            leftIcon={<Save className="h-4 w-4" />}
            onClick={salvarConfiguracoes}
            isLoading={salvando}
          >
            Salvar Configurações
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Configurações de Rastreamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Navigation className="h-5 w-5 mr-2 text-primary-500" />
                Rastreamento em Tempo Real
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Ativar rastreamento automático</h3>
                    <p className="text-sm text-gray-500">
                      Quando ativado, sua localização será compartilhada automaticamente durante o horário de trabalho
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={rastreamentoAtivo}
                      onChange={() => setRastreamentoAtivo(!rastreamentoAtivo)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Intervalo de atualização</h3>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="range" 
                      min="10" 
                      max="120" 
                      step="10"
                      value={intervaloAtualizacao}
                      onChange={(e) => setIntervaloAtualizacao(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm font-medium text-gray-700 min-w-[60px]">{intervaloAtualizacao} seg</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Intervalo menor = maior precisão, mas maior consumo de bateria
                  </p>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Modo economia de bateria</h3>
                      <p className="text-sm text-gray-500">
                        Reduz a frequência de atualizações quando a bateria estiver baixa
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={economizarBateria}
                        onChange={() => setEconomizarBateria(!economizarBateria)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configurações de Navegação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary-500" />
                Navegação e Mapas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Aplicativo de navegação preferido</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3">
                      <input 
                        type="radio" 
                        name="navegador" 
                        value="google_maps" 
                        checked={navegadorPreferido === 'google_maps'}
                        onChange={() => setNavegadorPreferido('google_maps')}
                        className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Google Maps</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input 
                        type="radio" 
                        name="navegador" 
                        value="waze" 
                        checked={navegadorPreferido === 'waze'}
                        onChange={() => setNavegadorPreferido('waze')}
                        className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Waze</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input 
                        type="radio" 
                        name="navegador" 
                        value="apple_maps" 
                        checked={navegadorPreferido === 'apple_maps'}
                        onChange={() => setNavegadorPreferido('apple_maps')}
                        className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Apple Maps</span>
                    </label>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    fullWidth
                    leftIcon={<MapPin className="h-4 w-4" />}
                  >
                    Testar navegação
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configurações de Notificações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2 text-primary-500" />
                Notificações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Notificações push</h3>
                    <p className="text-sm text-gray-500">
                      Receba alertas sobre novas entregas e atualizações
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={notificacoesAtivas}
                      onChange={() => setNotificacoesAtivas(!notificacoesAtivas)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    fullWidth
                    leftIcon={<Bell className="h-4 w-4" />}
                  >
                    Testar notificação
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configurações de Perfil */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2 text-primary-500" />
                Perfil e Privacidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Perfil público para clientes</h3>
                    <p className="text-sm text-gray-500">
                      Permite que clientes vejam seu nome e foto durante entregas
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={perfilPublico}
                      onChange={() => setPerfilPublico(!perfilPublico)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    fullWidth
                    leftIcon={<User className="h-4 w-4" />}
                  >
                    Editar perfil
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-end">
          <Button 
            variant="primary" 
            leftIcon={<Save className="h-4 w-4" />}
            onClick={salvarConfiguracoes}
            isLoading={salvando}
          >
            Salvar Configurações
          </Button>
        </div>
      </div>
    </MainLayout>
  )
} 