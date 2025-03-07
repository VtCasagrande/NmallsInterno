'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { LocationData } from '@/services/TrackingService'
import { calculateDistance } from '@/lib/utils'

// Interface para os marcadores
interface MapMarker {
  position: [number, number]
  popup?: string
  icon?: L.Icon
  id?: string
}

interface MapComponentProps {
  center?: [number, number]
  zoom?: number
  markers?: MapMarker[]
  currentLocation?: LocationData | null
  destination?: { lat: number; lng: number } | null
  showRoute?: boolean
  height?: string
  width?: string
  className?: string
  onMarkerClick?: (id: string) => void
}

// Função para criar ícones personalizados - definida fora do componente para evitar problemas de escopo
const createCustomIcon = (color: string, title: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="relative">
        <div class="w-6 h-6 rounded-full bg-${color}-500 border-2 border-white shadow-md flex items-center justify-center text-white text-xs font-bold">
          ${title.charAt(0)}
        </div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  })
}

export default function MapComponentClient({
  center = [-23.5505, -46.6333], // São Paulo como padrão
  zoom = 13,
  markers = [],
  currentLocation = null,
  destination = null,
  showRoute = false,
  height = '100%',
  width = '100%',
  className = '',
  onMarkerClick
}: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [mapReady, setMapReady] = useState(false)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)
  const routeLayerRef = useRef<L.Polyline | null>(null)

  // Corrigir problema com os ícones do Leaflet no Next.js
  useEffect(() => {
    // Apenas executar no cliente
    if (typeof window !== 'undefined') {
      try {
        // @ts-ignore
        delete L.Icon.Default.prototype._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: '/images/marker-icon-2x.png',
          iconUrl: '/images/marker-icon.png',
          shadowUrl: '/images/marker-shadow.png',
        })
      } catch (error) {
        console.error('Erro ao configurar ícones do Leaflet:', error)
      }
    }
  }, [])

  // Inicializar o mapa
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    try {
      // Criar o mapa
      const map = L.map(mapContainerRef.current).setView(center, zoom)
      
      // Adicionar camada de mapa
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map)
      
      // Criar camada para marcadores
      const markersLayer = L.layerGroup().addTo(map)
      markersLayerRef.current = markersLayer
      
      // Salvar referência do mapa
      mapRef.current = map
      setMapReady(true)
    } catch (error) {
      console.error('Erro ao inicializar o mapa:', error)
    }
    
    // Limpar ao desmontar
    return () => {
      try {
        if (mapRef.current) {
          // Remover camadas primeiro para evitar problemas com eventos
          if (markersLayerRef.current) {
            markersLayerRef.current.clearLayers()
            markersLayerRef.current.remove()
          }
          
          if (routeLayerRef.current) {
            routeLayerRef.current.remove()
          }
          
          // Remover o mapa com tratamento de erro
          mapRef.current.remove()
        }
      } catch (error) {
        console.error('Erro ao limpar o mapa:', error)
      } finally {
        // Garantir que as referências sejam limpas
        mapRef.current = null
        markersLayerRef.current = null
        routeLayerRef.current = null
      }
    }
  }, [center, zoom])

  // Atualizar marcadores quando mudarem
  useEffect(() => {
    if (!mapReady || !mapRef.current || !markersLayerRef.current) return
    
    try {
      // Limpar marcadores existentes
      markersLayerRef.current.clearLayers()
      
      // Adicionar novos marcadores
      markers.forEach(marker => {
        if (!markersLayerRef.current) return
        
        const markerInstance = L.marker(marker.position, { icon: marker.icon })
        
        if (marker.popup) {
          markerInstance.bindPopup(marker.popup)
        }
        
        if (marker.id && onMarkerClick) {
          markerInstance.on('click', () => onMarkerClick(marker.id!))
        }
        
        markerInstance.addTo(markersLayerRef.current)
      })
      
      // Adicionar marcador para localização atual
      if (currentLocation && markersLayerRef.current) {
        const currentMarker = L.marker([currentLocation.lat, currentLocation.lng], {
          icon: createCustomIcon('blue', 'Sua localização')
        })
        currentMarker.bindPopup('Sua localização atual')
        currentMarker.addTo(markersLayerRef.current)
      }
      
      // Adicionar marcador para destino
      if (destination && markersLayerRef.current) {
        const destinationMarker = L.marker([destination.lat, destination.lng], {
          icon: createCustomIcon('red', 'Destino')
        })
        destinationMarker.bindPopup('Destino')
        destinationMarker.addTo(markersLayerRef.current)
      }
      
      // Ajustar visualização para incluir todos os marcadores
      if ((markers.length > 0 || currentLocation || destination) && mapRef.current) {
        const bounds = L.latLngBounds([])
        
        markers.forEach(marker => {
          bounds.extend(marker.position)
        })
        
        if (currentLocation) {
          bounds.extend([currentLocation.lat, currentLocation.lng])
        }
        
        if (destination) {
          bounds.extend([destination.lat, destination.lng])
        }
        
        if (!bounds.isEmpty()) {
          mapRef.current.fitBounds(bounds, { padding: [50, 50] })
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar marcadores:', error)
    }
  }, [mapReady, markers, currentLocation, destination, onMarkerClick])

  // Desenhar rota entre localização atual e destino
  useEffect(() => {
    if (!mapReady || !mapRef.current || !currentLocation || !destination || !showRoute) return
    
    try {
      // Remover rota existente
      if (routeLayerRef.current) {
        routeLayerRef.current.remove()
        routeLayerRef.current = null
      }
      
      // Desenhar linha reta entre os pontos (simplificado)
      const routeLine = L.polyline(
        [
          [currentLocation.lat, currentLocation.lng],
          [destination.lat, destination.lng]
        ],
        { color: 'blue', weight: 3, opacity: 0.7, dashArray: '10, 10' }
      )
      
      routeLine.addTo(mapRef.current)
      routeLayerRef.current = routeLine
      
      // Adicionar informação de distância
      const distance = calculateDistance(
        currentLocation.lat,
        currentLocation.lng,
        destination.lat,
        destination.lng
      )
      
      const midPoint = [
        (currentLocation.lat + destination.lat) / 2,
        (currentLocation.lng + destination.lng) / 2
      ]
      
      const distanceMarker = L.marker(midPoint as [number, number], {
        icon: L.divIcon({
          className: 'distance-marker',
          html: `<div class="bg-white px-2 py-1 rounded shadow text-xs">${distance.toFixed(1)} km</div>`,
          iconSize: [80, 20],
          iconAnchor: [40, 10]
        })
      })
      
      distanceMarker.addTo(mapRef.current)
    } catch (error) {
      console.error('Erro ao desenhar rota:', error)
    }
  }, [mapReady, currentLocation, destination, showRoute])

  return (
    <div 
      ref={mapContainerRef} 
      style={{ height, width }} 
      className={`rounded-md overflow-hidden ${className}`}
    />
  )
} 