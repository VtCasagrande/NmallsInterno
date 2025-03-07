'use client'

import { useEffect, useRef, useState, memo } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { LocationData } from '@/services/TrackingService'
import { calculateDistance } from '@/lib/utils'

// Componente de mapa dinâmico para evitar problemas de SSR
import dynamic from 'next/dynamic'

// Interface para os marcadores
interface MapMarker {
  position: [number, number]
  popup?: string
  icon?: any
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

// Componente de mapa que será carregado apenas no cliente
const MapWithNoSSR = dynamic(() => import('./MapComponentClient').catch(err => {
  console.error('Erro ao carregar o componente de mapa:', err)
  // Retornar um componente de fallback em caso de erro
  return () => (
    <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-md">
      <div className="text-center">
        <p className="text-gray-500">Não foi possível carregar o mapa</p>
        <p className="text-sm text-gray-400 mt-2">Tente recarregar a página</p>
      </div>
    </div>
  )
}), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-md">
      <div className="text-center">
        <p className="text-gray-500">Carregando mapa...</p>
      </div>
    </div>
  ),
})

// Componente memoizado para evitar renderizações desnecessárias
const MemoizedMapWithNoSSR = memo(MapWithNoSSR, (prevProps, nextProps) => {
  // Comparação personalizada para evitar re-renderizações desnecessárias
  // Só re-renderiza se alguma propriedade relevante para o mapa mudar
  
  // Verificar se o centro mudou
  if (prevProps.center?.[0] !== nextProps.center?.[0] || 
      prevProps.center?.[1] !== nextProps.center?.[1]) {
    return false; // Re-renderizar
  }
  
  // Verificar se o zoom mudou
  if (prevProps.zoom !== nextProps.zoom) {
    return false; // Re-renderizar
  }
  
  // Verificar se os marcadores mudaram
  if (JSON.stringify(prevProps.markers) !== JSON.stringify(nextProps.markers)) {
    return false; // Re-renderizar
  }
  
  // Verificar se a localização atual mudou
  if (prevProps.currentLocation?.lat !== nextProps.currentLocation?.lat ||
      prevProps.currentLocation?.lng !== nextProps.currentLocation?.lng) {
    return false; // Re-renderizar
  }
  
  // Verificar se o destino mudou
  if (prevProps.destination?.lat !== nextProps.destination?.lat ||
      prevProps.destination?.lng !== nextProps.destination?.lng) {
    return false; // Re-renderizar
  }
  
  // Verificar se a rota mudou
  if (prevProps.showRoute !== nextProps.showRoute) {
    return false; // Re-renderizar
  }
  
  // Se chegou até aqui, não há necessidade de re-renderizar
  return true;
});

function MapComponent(props: MapComponentProps) {
  // Usar um ref para armazenar as props e evitar re-renderizações desnecessárias
  const propsRef = useRef<MapComponentProps>(props);
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Atualizar as props com debounce para evitar re-renderizações frequentes
  useEffect(() => {
    // Limpar o timer anterior
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Definir um novo timer
    debounceTimerRef.current = setTimeout(() => {
      // Verificar se as props realmente mudaram
      const shouldUpdateMap = 
        propsRef.current.center?.[0] !== props.center?.[0] ||
        propsRef.current.center?.[1] !== props.center?.[1] ||
        propsRef.current.zoom !== props.zoom ||
        JSON.stringify(propsRef.current.markers) !== JSON.stringify(props.markers) ||
        propsRef.current.currentLocation?.lat !== props.currentLocation?.lat ||
        propsRef.current.currentLocation?.lng !== props.currentLocation?.lng ||
        propsRef.current.destination?.lat !== props.destination?.lat ||
        propsRef.current.destination?.lng !== props.destination?.lng ||
        propsRef.current.showRoute !== props.showRoute;
      
      if (shouldUpdateMap) {
        propsRef.current = props;
        setShouldUpdate(prev => !prev); // Alternar para forçar re-renderização
      }
    }, 500); // 500ms de debounce
    
    // Limpar o timer ao desmontar
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [props]);
  
  return <MemoizedMapWithNoSSR {...propsRef.current} />;
}

export default memo(MapComponent); 