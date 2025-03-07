import { calculateDistance } from '@/lib/utils'

export interface LocationData {
  lat: number
  lng: number
  timestamp: number
  driverId?: string
  deliveryId?: string
}

export interface TrackingOptions {
  enableHighAccuracy?: boolean
  maximumAge?: number
  timeout?: number
  interval?: number
  onBatteryLow?: boolean
}

export interface TrackingStatus {
  isTracking: boolean
  lastLocation: LocationData | null
  error: string | null
  batteryLevel: number | null
  distanceToDestination: number | null
  estimatedTime: string | null
}

class TrackingService {
  private watchId: number | null = null
  private locationHistory: LocationData[] = []
  private isTracking: boolean = false
  private lastLocation: LocationData | null = null
  private error: string | null = null
  private batteryLevel: number | null = null
  private listeners: ((status: TrackingStatus) => void)[] = []
  private destination: { lat: number; lng: number } | null = null
  private distanceToDestination: number | null = null
  private estimatedTime: string | null = null
  private options: TrackingOptions = {
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 5000,
    interval: 30,
    onBatteryLow: true
  }
  private intervalId: NodeJS.Timeout | null = null
  private driverId: string | null = null
  private deliveryId: string | null = null
  private isClient: boolean = false
  private static instance: TrackingService | null = null

  constructor() {
    // Verificar se estamos no cliente ou no servidor
    this.isClient = typeof window !== 'undefined'
    
    if (this.isClient) {
      // Monitorar nível de bateria se disponível
      if ('getBattery' in navigator) {
        try {
          // @ts-ignore - getBattery não está no tipo padrão do navigator
          navigator.getBattery().then((battery: any) => {
            this.batteryLevel = battery.level * 100
            
            battery.addEventListener('levelchange', () => {
              this.batteryLevel = battery.level * 100
              this.notifyListeners()
              
              // Ajustar intervalo se bateria estiver baixa e a opção estiver ativada
              if (this.options.onBatteryLow && this.batteryLevel < 20) {
                this.adjustTrackingInterval(true)
              } else if (this.options.onBatteryLow && this.batteryLevel >= 20) {
                this.adjustTrackingInterval(false)
              }
            })
          })
        } catch (error) {
          console.error('Erro ao acessar bateria:', error)
        }
      }
      
      // Carregar configurações do localStorage
      this.loadSettings()
    }
  }

  // Método para obter a instância singleton
  public static getInstance(): TrackingService {
    if (!TrackingService.instance) {
      TrackingService.instance = new TrackingService()
    }
    return TrackingService.instance
  }
  
  private loadSettings() {
    if (!this.isClient) return
    
    try {
      const interval = parseInt(localStorage.getItem('intervaloAtualizacao') || '30')
      const onBatteryLow = localStorage.getItem('economizarBateria') !== 'false'
      
      this.options = {
        ...this.options,
        interval,
        onBatteryLow
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
    }
  }
  
  private adjustTrackingInterval(isBatteryLow: boolean) {
    if (!this.isTracking || !this.intervalId) return
    
    clearInterval(this.intervalId)
    
    const interval = isBatteryLow 
      ? Math.max(60, this.options.interval || 30) // Mínimo de 60 segundos quando bateria baixa
      : this.options.interval || 30
      
    this.startPeriodicTracking(interval)
  }
  
  private startPeriodicTracking(interval: number) {
    if (!this.isClient) return
    
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
    
    // Enviar localização imediatamente
    this.sendLocationToServer()
    
    // Configurar envio periódico
    this.intervalId = setInterval(() => {
      this.sendLocationToServer()
    }, interval * 1000)
  }
  
  private sendLocationToServer() {
    if (!this.lastLocation) return
    
    // Aqui você enviaria a localização para o servidor
    console.log('Enviando localização para o servidor:', {
      ...this.lastLocation,
      driverId: this.driverId,
      deliveryId: this.deliveryId
    })
    
    // Simulação de envio para o servidor
    // Em um caso real, você usaria fetch ou axios para enviar para sua API
  }

  public startTracking(
    driverId?: string, 
    deliveryId?: string, 
    destination?: { lat: number; lng: number },
    options?: Partial<TrackingOptions>
  ) {
    if (!this.isClient || this.isTracking) return
    
    // Atualizar opções se fornecidas
    if (options) {
      this.options = { ...this.options, ...options }
    } else {
      // Recarregar configurações do localStorage
      this.loadSettings()
    }
    
    // Armazenar IDs para envio ao servidor
    this.driverId = driverId || null
    this.deliveryId = deliveryId || null
    
    // Armazenar destino se fornecido
    if (destination) {
      this.destination = destination
    }
    
    if (!navigator.geolocation) {
      this.error = 'Geolocalização não é suportada pelo seu navegador'
      this.notifyListeners()
      return
    }
    
    try {
      this.watchId = navigator.geolocation.watchPosition(
        this.handlePositionUpdate.bind(this),
        this.handlePositionError.bind(this),
        {
          enableHighAccuracy: this.options.enableHighAccuracy,
          maximumAge: this.options.maximumAge,
          timeout: this.options.timeout
        }
      )
      
      this.isTracking = true
      this.error = null
      this.notifyListeners()
      
      // Iniciar envio periódico para o servidor
      this.startPeriodicTracking(this.options.interval || 30)
      
    } catch (err) {
      this.error = `Erro ao iniciar rastreamento: ${err instanceof Error ? err.message : String(err)}`
      this.notifyListeners()
    }
  }
  
  private handlePositionUpdate(position: GeolocationPosition) {
    const newLocation: LocationData = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      timestamp: Date.now(),
      driverId: this.driverId || undefined,
      deliveryId: this.deliveryId || undefined
    }
    
    this.lastLocation = newLocation
    this.locationHistory.push(newLocation)
    this.error = null
    
    // Calcular distância até o destino se disponível
    if (this.destination) {
      const distance = calculateDistance(
        newLocation.lat,
        newLocation.lng,
        this.destination.lat,
        this.destination.lng
      )
      
      this.distanceToDestination = distance
      
      // Estimar tempo (assumindo velocidade média de 30 km/h em área urbana)
      const timeInMinutes = Math.round((distance / 30) * 60)
      let timeText = ''
      
      if (timeInMinutes < 1) {
        timeText = 'Menos de 1 minuto'
      } else if (timeInMinutes < 60) {
        timeText = `${timeInMinutes} minutos`
      } else {
        const hours = Math.floor(timeInMinutes / 60)
        const minutes = timeInMinutes % 60
        timeText = `${hours}h ${minutes}min`
      }
      
      this.estimatedTime = timeText
    }
    
    this.notifyListeners()
  }
  
  private handlePositionError(error: GeolocationPositionError) {
    this.error = `Erro ao obter localização: ${error.message}`
    this.notifyListeners()
  }

  public stopTracking() {
    if (!this.isClient || !this.isTracking) return
    
    if (this.watchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(this.watchId)
      this.watchId = null
    }
    
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    
    this.isTracking = false
    this.notifyListeners()
  }
  
  public getStatus(): TrackingStatus {
    return {
      isTracking: this.isTracking,
      lastLocation: this.lastLocation,
      error: this.error,
      batteryLevel: this.batteryLevel,
      distanceToDestination: this.distanceToDestination,
      estimatedTime: this.estimatedTime
    }
  }
  
  public getLocationHistory(): LocationData[] {
    return [...this.locationHistory]
  }
  
  public clearLocationHistory() {
    this.locationHistory = []
    this.notifyListeners()
  }
  
  public addListener(callback: (status: TrackingStatus) => void) {
    if (!this.isClient) return () => {}
    
    this.listeners.push(callback)
    // Notificar imediatamente com o status atual
    callback(this.getStatus())
    return () => this.removeListener(callback)
  }
  
  public removeListener(callback: (status: TrackingStatus) => void) {
    if (!this.isClient) return
    
    this.listeners = this.listeners.filter(listener => listener !== callback)
  }
  
  private notifyListeners() {
    if (!this.isClient) return
    
    const status = this.getStatus()
    this.listeners.forEach(listener => listener(status))
  }
  
  public setDestination(destination: { lat: number; lng: number }) {
    this.destination = destination
    
    // Recalcular distância e tempo se tivermos uma localização atual
    if (this.lastLocation) {
      const distance = calculateDistance(
        this.lastLocation.lat,
        this.lastLocation.lng,
        destination.lat,
        destination.lng
      )
      
      this.distanceToDestination = distance
      
      // Estimar tempo (assumindo velocidade média de 30 km/h em área urbana)
      const timeInMinutes = Math.round((distance / 30) * 60)
      let timeText = ''
      
      if (timeInMinutes < 1) {
        timeText = 'Menos de 1 minuto'
      } else if (timeInMinutes < 60) {
        timeText = `${timeInMinutes} minutos`
      } else {
        const hours = Math.floor(timeInMinutes / 60)
        const minutes = timeInMinutes % 60
        timeText = `${hours}h ${minutes}min`
      }
      
      this.estimatedTime = timeText
      this.notifyListeners()
    }
  }
  
  // Método para simular uma localização (útil para testes)
  public simulateLocation(location?: LocationData) {
    if (!this.isClient) return
    
    // Se não for fornecida uma localização, gerar uma aleatória próxima à última conhecida ou ao destino
    if (!location) {
      const baseLocation = this.lastLocation || (this.destination ? 
        { lat: this.destination.lat, lng: this.destination.lng, timestamp: Date.now() } : 
        { lat: -23.5505, lng: -46.6333, timestamp: Date.now() } // São Paulo como padrão
      )
      
      // Gerar uma localização aleatória em um raio de ~500m
      const randomLat = baseLocation.lat + (Math.random() - 0.5) * 0.01
      const randomLng = baseLocation.lng + (Math.random() - 0.5) * 0.01
      
      location = {
        lat: randomLat,
        lng: randomLng,
        timestamp: Date.now(),
        driverId: this.driverId || undefined,
        deliveryId: this.deliveryId || undefined
      }
    }
    
    this.lastLocation = location
    this.locationHistory.push(location)
    
    // Calcular distância até o destino se disponível
    if (this.destination) {
      const distance = calculateDistance(
        location.lat,
        location.lng,
        this.destination.lat,
        this.destination.lng
      )
      
      this.distanceToDestination = distance
      
      // Estimar tempo
      const timeInMinutes = Math.round((distance / 30) * 60)
      let timeText = ''
      
      if (timeInMinutes < 1) {
        timeText = 'Menos de 1 minuto'
      } else if (timeInMinutes < 60) {
        timeText = `${timeInMinutes} minutos`
      } else {
        const hours = Math.floor(timeInMinutes / 60)
        const minutes = timeInMinutes % 60
        timeText = `${hours}h ${minutes}min`
      }
      
      this.estimatedTime = timeText
    }
    
    this.notifyListeners()
  }
}

// Exportar uma instância singleton do serviço
export const trackingService = new TrackingService() 