'use client'

import { useState, useEffect } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { DeliveryStatusBadge } from '@/components/ui/Badge'
import { 
  Truck, 
  MapPin, 
  Calendar, 
  Clock, 
  User,
  Phone,
  ArrowRight,
  Navigation,
  CheckCircle,
  BarChart3,
  Package,
  DollarSign,
  Users,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'
import { trackingService, LocationData } from '@/services/TrackingService'
import MapComponent from '@/components/maps/MapComponent'
import { calculateDistance, formatDistance, formatEstimatedTime } from '@/lib/utils'

// Tipo para as entregas ativas
interface ActiveDelivery {
  id: string
  cliente: {
    nome: string
    telefone: string
  }
  endereco: string
  data: string
  horario: string
  status: string
  motorista: string
  coordenadas: {
    lat: number
    lng: number
  }
  ultimaAtualizacao: string
  distancia?: number
  tempoEstimado?: string
}

export default function DashboardPage() {
  // Estado para armazenar as entregas ativas
  const [activeDeliveries, setActiveDeliveries] = useState<ActiveDelivery[]>([
    {
      id: '1001',
      cliente: {
        nome: 'Mundo Animal',
        telefone: '(11) 98765-4321'
      },
      endereco: 'Av. Paulista, 1000 - São Paulo, SP',
      data: '16/03/2023',
      horario: '10:00 - 12:00',
      status: 'em_rota',
      motorista: 'João Oliveira',
      coordenadas: {
        lat: -23.5505,
        lng: -46.6333
      },
      ultimaAtualizacao: new Date().toLocaleTimeString()
    },
    {
      id: '1002',
      cliente: {
        nome: 'Pet Shop Feliz',
        telefone: '(11) 91234-5678'
      },
      endereco: 'Rua Augusta, 500 - São Paulo, SP',
      data: '16/03/2023',
      horario: '13:00 - 15:00',
      status: 'em_rota',
      motorista: 'Maria Silva',
      coordenadas: {
        lat: -23.5480,
        lng: -46.6400
      },
      ultimaAtualizacao: new Date().toLocaleTimeString()
    },
    {
      id: '1003',
      cliente: {
        nome: 'Clínica Veterinária Patinhas',
        telefone: '(11) 97777-8888'
      },
      endereco: 'Av. Brigadeiro Faria Lima, 2000 - São Paulo, SP',
      data: '16/03/2023',
      horario: '14:00 - 16:00',
      status: 'pendente',
      motorista: 'Carlos Santos',
      coordenadas: {
        lat: -23.5670,
        lng: -46.6920
      },
      ultimaAtualizacao: new Date().toLocaleTimeString()
    }
  ])

  // Estado para armazenar as localizações dos motoristas
  const [driverLocations, setDriverLocations] = useState<Record<string, LocationData>>({})
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null)

  // Estatísticas do dashboard
  const stats = [
    { 
      title: 'Entregas Hoje', 
      value: '12', 
      change: '+20%', 
      icon: <Truck className="h-6 w-6 text-primary-500" /> 
    },
    { 
      title: 'Entregas Pendentes', 
      value: '5', 
      change: '-10%', 
      icon: <Package className="h-6 w-6 text-yellow-500" /> 
    },
    { 
      title: 'Faturamento', 
      value: 'R$ 5.240', 
      change: '+15%', 
      icon: <DollarSign className="h-6 w-6 text-green-500" /> 
    },
    { 
      title: 'Motoristas Ativos', 
      value: '3', 
      change: '0%', 
      icon: <Users className="h-6 w-6 text-blue-500" /> 
    }
  ]

  // Alertas do sistema
  const alerts = [
    {
      id: 1,
      title: 'Entrega Atrasada',
      message: 'A entrega #998 está atrasada por mais de 30 minutos',
      type: 'warning',
      time: '10:45'
    },
    {
      id: 2,
      title: 'Novo Pedido',
      message: 'Novo pedido #1004 recebido de Petshop Amigo Fiel',
      type: 'info',
      time: '11:20'
    },
    {
      id: 3,
      title: 'Motorista Indisponível',
      message: 'O motorista Pedro Alves reportou problemas com o veículo',
      type: 'danger',
      time: '09:15'
    }
  ]

  // Simular atualizações de localização
  useEffect(() => {
    // Função para atualizar as localizações dos motoristas
    const updateDriverLocations = () => {
      // Em um cenário real, você buscaria essas informações do servidor
      // Aqui estamos simulando atualizações aleatórias
      setActiveDeliveries(prevDeliveries => 
        prevDeliveries.map(delivery => {
          if (delivery.status === 'em_rota') {
            // Simular movimento do motorista
            const newCoordinates = {
              lat: delivery.coordenadas.lat + (Math.random() - 0.5) * 0.001,
              lng: delivery.coordenadas.lng + (Math.random() - 0.5) * 0.001
            }
            
            // Atualizar o registro de localização
            setDriverLocations(prev => ({
              ...prev,
              [delivery.id]: {
                lat: newCoordinates.lat,
                lng: newCoordinates.lng,
                timestamp: Date.now(),
                driverId: delivery.motorista,
                deliveryId: delivery.id
              }
            }))
            
            return {
              ...delivery,
              coordenadas: newCoordinates,
              ultimaAtualizacao: new Date().toLocaleTimeString()
            }
          }
          return delivery
        })
      )
    }
    
    // Atualizar imediatamente
    updateDriverLocations()
    
    // Configurar intervalo para atualizações periódicas
    const interval = setInterval(updateDriverLocations, 5000)
    
    return () => clearInterval(interval)
  }, [])
  
  // Função para atualizar manualmente as localizações
  const refreshLocations = () => {
    setIsRefreshing(true)
    
    // Simular uma chamada de API
    setTimeout(() => {
      setActiveDeliveries(prevDeliveries => 
        prevDeliveries.map(delivery => {
          if (delivery.status === 'em_rota') {
            const newCoordinates = {
              lat: delivery.coordenadas.lat + (Math.random() - 0.5) * 0.001,
              lng: delivery.coordenadas.lng + (Math.random() - 0.5) * 0.001
            }
            
            return {
              ...delivery,
              coordenadas: newCoordinates,
              ultimaAtualizacao: new Date().toLocaleTimeString()
            }
          }
          return delivery
        })
      )
      
      setIsRefreshing(false)
    }, 1000)
  }

  // Preparar marcadores para o mapa
  const mapMarkers = activeDeliveries
    .filter(d => d.status === 'em_rota')
    .map(delivery => ({
      position: [delivery.coordenadas.lat, delivery.coordenadas.lng] as [number, number],
      popup: `${delivery.motorista} - Entrega #${delivery.id}`,
      id: delivery.id
    }))

  // Função para lidar com o clique em um marcador
  const handleMarkerClick = (id: string) => {
    setSelectedDelivery(id === selectedDelivery ? null : id)
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              leftIcon={<BarChart3 className="h-4 w-4" />}
            >
              Relatórios
            </Button>
            <Link href="/entregas">
              <Button 
                leftIcon={<Truck className="h-4 w-4" />}
              >
                Gerenciar Entregas
              </Button>
            </Link>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <p className={`text-xs mt-1 ${stat.change.startsWith('+') ? 'text-green-500' : stat.change.startsWith('-') ? 'text-red-500' : 'text-gray-500'}`}>
                      {stat.change} em relação à semana passada
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-full">
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mapa de Rastreamento */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Rastreamento em Tempo Real</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              leftIcon={<RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
              onClick={refreshLocations}
              disabled={isRefreshing}
            >
              Atualizar
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-96 rounded-md overflow-hidden relative">
              <MapComponent 
                height="100%"
                width="100%"
                markers={mapMarkers}
                onMarkerClick={handleMarkerClick}
              />
              
              {/* Informações da entrega selecionada */}
              {selectedDelivery && (
                <div className="absolute top-4 left-4 bg-white p-3 rounded-md shadow-md max-w-xs">
                  {(() => {
                    const delivery = activeDeliveries.find(d => d.id === selectedDelivery)
                    if (!delivery) return null
                    
                    return (
                      <>
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-bold">Entrega #{delivery.id}</h3>
                          <button 
                            className="text-gray-400 hover:text-gray-600"
                            onClick={() => setSelectedDelivery(null)}
                          >
                            ×
                          </button>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{delivery.cliente.nome}</p>
                        <p className="text-xs text-gray-500 mt-1">{delivery.endereco}</p>
                        <div className="flex justify-between items-center mt-2 text-xs">
                          <span className="text-gray-500">Motorista: {delivery.motorista}</span>
                          <span className="text-gray-500">{delivery.ultimaAtualizacao}</span>
                        </div>
                        <div className="mt-2 flex justify-end space-x-2">
                          <Link href={`/entregas/${delivery.id}`}>
                            <Button 
                              variant="outline" 
                              size="sm" 
                            >
                              Detalhes
                            </Button>
                          </Link>
                          <Link href={`/entregas/${delivery.id}/rastreamento`}>
                            <Button 
                              size="sm" 
                            >
                              Rastrear
                            </Button>
                          </Link>
                        </div>
                      </>
                    )
                  })()}
                </div>
              )}
              
              {/* Contador de entregas ativas */}
              <div className="absolute bottom-4 right-4 bg-white px-3 py-2 rounded-md shadow-md text-sm">
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4 text-primary-500" />
                  <span>{activeDeliveries.filter(d => d.status === 'em_rota').length} entregas em rota</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Entregas Ativas */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Entregas Ativas</CardTitle>
                <div className="text-sm text-gray-500">
                  Última atualização: {new Date().toLocaleTimeString()}
                </div>
              </CardHeader>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Motorista
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Última Atualização
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activeDeliveries.map((entrega) => (
                      <tr 
                        key={entrega.id} 
                        className={`hover:bg-gray-50 ${selectedDelivery === entrega.id ? 'bg-primary-50' : ''}`}
                        onClick={() => setSelectedDelivery(entrega.id === selectedDelivery ? null : entrega.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{entrega.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {entrega.cliente.nome}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <DeliveryStatusBadge status={entrega.status as any} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {entrega.motorista}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {entrega.ultimaAtualizacao}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <Link href={`/entregas/${entrega.id}`}>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                rightIcon={<ArrowRight className="h-3 w-3" />}
                              >
                                Detalhes
                              </Button>
                            </Link>
                            <Link href={`/entregas/${entrega.id}/rastreamento`}>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                leftIcon={<Navigation className="h-3 w-3" />}
                              >
                                Rastrear
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Alertas */}
          <Card>
            <CardHeader>
              <CardTitle>Alertas do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`p-4 rounded-lg border ${
                      alert.type === 'warning' ? 'border-yellow-200 bg-yellow-50' : 
                      alert.type === 'danger' ? 'border-red-200 bg-red-50' : 
                      'border-blue-200 bg-blue-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-3">
                        <div className={`mt-0.5 ${
                          alert.type === 'warning' ? 'text-yellow-500' : 
                          alert.type === 'danger' ? 'text-red-500' : 
                          'text-blue-500'
                        }`}>
                          <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{alert.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{alert.message}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">{alert.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
} 