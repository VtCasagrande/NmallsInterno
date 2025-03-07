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
  ArrowLeft,
  Navigation,
  CheckCircle,
  Camera,
  MessageSquare,
  AlertTriangle,
  Compass,
  Battery
} from 'lucide-react'
import Link from 'next/link'
import { trackingService, LocationData, TrackingStatus } from '@/services/TrackingService'
import { calculateDistance, formatDistance, formatEstimatedTime, calculateETA } from '@/lib/utils'
import MapComponent from '@/components/maps/MapComponent'
import DeliveryConfirmationModal, { DeliveryConfirmationData } from '@/components/DeliveryConfirmationModal'

export default function RastreamentoPage({ params }: { params: { id: string } }) {
  // Estados para a interface
  const [isMobile, setIsMobile] = useState(false)
  const [navegadorPreferido, setNavegadorPreferido] = useState('google_maps')
  const [locationHistory, setLocationHistory] = useState<LocationData[]>([])
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  
  // Estado do rastreamento
  const [trackingStatus, setTrackingStatus] = useState<TrackingStatus>({
    isTracking: false,
    lastLocation: null,
    error: null,
    batteryLevel: null,
    distanceToDestination: null,
    estimatedTime: null
  })
  
  // Dados mockados para demonstração
  const entrega = {
    id: params.id,
    cliente: {
      nome: 'Mundo Animal',
      telefone: '(11) 98765-4321'
    },
    endereco: 'Av. Paulista, 1000 - São Paulo, SP',
    cep: '01310-100',
    data: '16/03/2023',
    horario: '10:00 - 12:00',
    status: 'em_rota',
    motorista: 'João Oliveira',
    destino: {
      lat: -23.5505,
      lng: -46.6333
    },
    isPaid: true, // Indica se o pedido já está pago
    valorTotal: 3450.75 // Valor total do pedido
  }

  // Verificar se é dispositivo móvel
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Carregar configurações do usuário
  useEffect(() => {
    const rastreamentoAtivo = localStorage.getItem('rastreamentoAtivo') === 'true'
    const navegador = localStorage.getItem('navegadorPreferido') || 'google_maps'
    
    setNavegadorPreferido(navegador)
    
    // Configurar o destino no serviço de rastreamento
    trackingService.setDestination(entrega.destino)
    
    // Se o rastreamento automático estiver ativado, iniciar rastreamento
    if (rastreamentoAtivo) {
      startTracking()
    }
    
    // Adicionar listener para atualizações de status
    const removeListener = trackingService.addListener((status) => {
      setTrackingStatus(status)
    })
    
    // Atualizar histórico de localizações
    const intervalId = setInterval(() => {
      setLocationHistory(trackingService.getLocationHistory())
    }, 5000)
    
    return () => {
      removeListener()
      clearInterval(intervalId)
    }
  }, [entrega.destino])

  // Função para iniciar o rastreamento
  const startTracking = () => {
    trackingService.startTracking(
      'driver-001', // ID do motorista
      params.id,    // ID da entrega
      entrega.destino
    )
  }

  // Função para parar o rastreamento
  const stopTracking = () => {
    trackingService.stopTracking()
  }

  // Função para confirmar a entrega
  const confirmDelivery = () => {
    setShowConfirmationModal(true)
  }
  
  // Função para processar a confirmação da entrega
  const handleDeliveryConfirmation = (data: DeliveryConfirmationData) => {
    console.log('Dados da confirmação:', data)
    
    // Aqui você enviaria a confirmação para o servidor
    // Em um caso real, você usaria fetch ou axios para enviar para sua API
    
    // Parar o rastreamento
    stopTracking()
    
    // Redirecionar para a página de detalhes da entrega após um breve atraso
    setTimeout(() => {
      window.location.href = `/entregas/${params.id}`
    }, 1500)
  }
  
  // Função para abrir navegação
  const openNavigation = () => {
    if (!trackingStatus.lastLocation) {
      alert('Localização atual não disponível')
      return
    }
    
    const destination = `${entrega.destino.lat},${entrega.destino.lng}`
    let url = ''
    
    switch (navegadorPreferido) {
      case 'google_maps':
        url = `https://www.google.com/maps/dir/?api=1&origin=${trackingStatus.lastLocation.lat},${trackingStatus.lastLocation.lng}&destination=${destination}&travelmode=driving`
        break
      case 'waze':
        url = `https://waze.com/ul?ll=${entrega.destino.lat},${entrega.destino.lng}&navigate=yes`
        break
      case 'apple_maps':
        url = `maps://maps.apple.com/?daddr=${entrega.destino.lat},${entrega.destino.lng}`
        break
      default:
        url = `https://www.google.com/maps/dir/?api=1&origin=${trackingStatus.lastLocation.lat},${trackingStatus.lastLocation.lng}&destination=${destination}&travelmode=driving`
    }
    
    window.open(url, '_blank')
  }
  
  // Função para ligar para o cliente
  const callCustomer = () => {
    window.open(`tel:${entrega.cliente.telefone.replace(/\D/g, '')}`, '_self')
  }

  // Função para simular uma localização para testes
  const simulateLocation = () => {
    trackingService.simulateLocation()
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center space-x-2 md:space-x-4">
            <Link href={`/entregas/${params.id}`}>
              <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Voltar
              </Button>
            </Link>
            <h1 className="text-xl md:text-2xl font-bold">Entrega #{params.id}</h1>
            <DeliveryStatusBadge status={entrega.status as any} />
          </div>
          <div className="flex space-x-2">
            {!trackingStatus.isTracking ? (
              <Button 
                leftIcon={<Navigation className="h-4 w-4" />}
                onClick={startTracking}
                size={isMobile ? "sm" : "md"}
              >
                {isMobile ? "Iniciar" : "Iniciar Rastreamento"}
              </Button>
            ) : (
              <Button 
                variant="outline"
                leftIcon={<Navigation className="h-4 w-4" />}
                onClick={stopTracking}
                size={isMobile ? "sm" : "md"}
              >
                {isMobile ? "Parar" : "Parar Rastreamento"}
              </Button>
            )}
            <Button 
              variant="primary" 
              leftIcon={<CheckCircle className="h-4 w-4" />}
              onClick={confirmDelivery}
              size={isMobile ? "sm" : "md"}
            >
              {isMobile ? "Confirmar" : "Confirmar Entrega"}
            </Button>
          </div>
        </div>

        {/* Mensagem de erro */}
        {trackingStatus.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            <div>
              <p className="font-medium">Erro no rastreamento</p>
              <p className="text-sm">{trackingStatus.error}</p>
            </div>
          </div>
        )}

        {/* Versão Mobile - Card Principal */}
        {isMobile && (
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Informações de Destino */}
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Destino</h3>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm text-gray-900">{entrega.cliente.nome}</p>
                      <p className="text-sm text-gray-500">{entrega.endereco}</p>
                      <div className="mt-2 flex space-x-2">
                        <Button 
                          variant="primary" 
                          size="sm" 
                          fullWidth
                          leftIcon={<Navigation className="h-3 w-3" />}
                          onClick={openNavigation}
                        >
                          Navegar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          fullWidth
                          leftIcon={<Phone className="h-3 w-3" />}
                          onClick={callCustomer}
                        >
                          Ligar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Status do Rastreamento */}
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Status</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-xs text-gray-500">Distância</p>
                      <p className="text-lg font-medium text-gray-900">
                        {trackingStatus.distanceToDestination 
                          ? `${trackingStatus.distanceToDestination.toFixed(1)} km` 
                          : 'N/A'}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-xs text-gray-500">Tempo estimado</p>
                      <p className="text-lg font-medium text-gray-900">
                        {trackingStatus.estimatedTime || 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  {trackingStatus.batteryLevel !== null && (
                    <div className="mt-2 flex items-center">
                      <Battery className={`h-4 w-4 mr-1 ${
                        trackingStatus.batteryLevel < 20 ? 'text-red-500' : 
                        trackingStatus.batteryLevel < 50 ? 'text-yellow-500' : 
                        'text-green-500'
                      }`} />
                      <span className="text-xs text-gray-500">
                        Bateria: {Math.round(trackingStatus.batteryLevel)}%
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Informações de Pagamento */}
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Pagamento</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">Status</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        entrega.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {entrega.isPaid ? 'Pago' : 'A receber'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-500">Valor</p>
                      <p className="text-sm font-medium text-gray-900">
                        {entrega.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Ações Rápidas */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Ações</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      leftIcon={<Clock className="h-4 w-4" />}
                    >
                      Atraso
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      leftIcon={<MessageSquare className="h-4 w-4" />}
                    >
                      Mensagem
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      leftIcon={<Camera className="h-4 w-4" />}
                    >
                      Foto
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      leftIcon={<Truck className="h-4 w-4" />}
                    >
                      Problema
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Versão Desktop - Layout em Grid */}
        {!isMobile && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Informações da Entrega */}
            <Card>
              <CardHeader>
                <CardTitle>Informações da Entrega</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Cliente</h3>
                      <p className="text-sm text-gray-500">{entrega.cliente.nome}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Telefone</h3>
                      <p className="text-sm text-gray-500">{entrega.cliente.telefone}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-1"
                        leftIcon={<Phone className="h-3 w-3" />}
                        onClick={callCustomer}
                      >
                        Ligar
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Endereço</h3>
                      <p className="text-sm text-gray-500">{entrega.endereco}</p>
                      <p className="text-sm text-gray-500">CEP: {entrega.cep}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-1"
                        leftIcon={<Navigation className="h-3 w-3" />}
                        onClick={openNavigation}
                      >
                        Abrir no Maps
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Data e Horário</h3>
                      <p className="text-sm text-gray-500">{entrega.data}, {entrega.horario}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status do Rastreamento */}
            <Card>
              <CardHeader>
                <CardTitle>Status do Rastreamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Status:</span>
                    <span className={`text-sm font-medium ${trackingStatus.isTracking ? 'text-green-500' : 'text-gray-500'}`}>
                      {trackingStatus.isTracking ? 'Rastreamento Ativo' : 'Rastreamento Inativo'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Distância até o destino:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {trackingStatus.distanceToDestination 
                        ? `${trackingStatus.distanceToDestination.toFixed(1)} km` 
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Tempo estimado:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {trackingStatus.estimatedTime || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Última atualização:</span>
                    <span className="text-sm text-gray-500">
                      {trackingStatus.lastLocation 
                        ? new Date(trackingStatus.lastLocation.timestamp).toLocaleTimeString() 
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Coordenadas atuais:</span>
                    <span className="text-sm text-gray-500">
                      {trackingStatus.lastLocation 
                        ? `${trackingStatus.lastLocation.lat.toFixed(6)}, ${trackingStatus.lastLocation.lng.toFixed(6)}` 
                        : 'N/A'}
                    </span>
                  </div>
                  {trackingStatus.batteryLevel !== null && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">Nível de bateria:</span>
                      <span className={`text-sm font-medium flex items-center ${
                        trackingStatus.batteryLevel < 20 ? 'text-red-500' : 
                        trackingStatus.batteryLevel < 50 ? 'text-yellow-500' : 
                        'text-green-500'
                      }`}>
                        <Battery className="h-4 w-4 mr-1" />
                        {Math.round(trackingStatus.batteryLevel)}%
                      </span>
                    </div>
                  )}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        fullWidth
                        leftIcon={<MessageSquare className="h-4 w-4" />}
                      >
                        Enviar Mensagem
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        fullWidth
                        leftIcon={<Camera className="h-4 w-4" />}
                      >
                        Tirar Foto
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ações Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    fullWidth
                    leftIcon={<Clock className="h-4 w-4" />}
                  >
                    Informar Atraso
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    fullWidth
                    leftIcon={<MapPin className="h-4 w-4" />}
                  >
                    Atualizar Endereço
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    fullWidth
                    leftIcon={<MessageSquare className="h-4 w-4" />}
                  >
                    Contatar Cliente
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    fullWidth
                    leftIcon={<Truck className="h-4 w-4" />}
                  >
                    Reportar Problema
                  </Button>
                  <div className="pt-4 border-t border-gray-200">
                    <Button 
                      variant="primary" 
                      fullWidth
                      leftIcon={<CheckCircle className="h-4 w-4" />}
                      onClick={confirmDelivery}
                    >
                      Confirmar Entrega
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Mapa de Rastreamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Compass className="h-5 w-5 mr-2 text-primary-500" />
              Mapa de Rastreamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`${isMobile ? 'h-64' : 'h-96'} rounded-md overflow-hidden relative`}>
              <MapComponent 
                height="100%"
                width="100%"
                currentLocation={trackingStatus.lastLocation}
                destination={entrega.destino}
                showRoute={true}
              />
              
              {/* Controles do mapa */}
              <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="rounded-full shadow-md"
                  onClick={simulateLocation}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                </Button>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="rounded-full shadow-md"
                  onClick={openNavigation}
                >
                  <Navigation className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Informações de status no mapa */}
              {trackingStatus.lastLocation && (
                <div className="absolute top-4 left-4 bg-white p-2 rounded-md shadow-md text-xs">
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">Distância:</span>
                    <span>{trackingStatus.distanceToDestination ? formatDistance(trackingStatus.distanceToDestination) : 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">ETA:</span>
                    <span>{trackingStatus.estimatedTime || 'N/A'}</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Histórico de Localizações - Apenas na versão desktop */}
        {!isMobile && locationHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Localizações</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Horário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Latitude
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Longitude
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {locationHistory.map((loc, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {locationHistory.length - index}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(loc.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {loc.lat.toFixed(6)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {loc.lng.toFixed(6)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Modal de Confirmação de Entrega */}
        <DeliveryConfirmationModal
          isOpen={showConfirmationModal}
          onClose={() => setShowConfirmationModal(false)}
          onConfirm={handleDeliveryConfirmation}
          deliveryId={params.id}
          isPaid={entrega.isPaid}
          totalValue={entrega.valorTotal}
        />
      </div>
    </MainLayout>
  )
} 