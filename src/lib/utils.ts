import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combina classes CSS usando clsx e tailwind-merge
 * Útil para combinar classes condicionais com classes base
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formata um valor monetário para o formato brasileiro
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Formata uma data para o formato brasileiro
 */
export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  
  return new Intl.DateTimeFormat('pt-BR').format(date)
}

/**
 * Trunca um texto para o tamanho máximo especificado
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Gera um ID único
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

/**
 * Calcula a distância entre dois pontos geográficos usando a fórmula de Haversine
 * @param lat1 Latitude do primeiro ponto em graus decimais
 * @param lon1 Longitude do primeiro ponto em graus decimais
 * @param lat2 Latitude do segundo ponto em graus decimais
 * @param lon2 Longitude do segundo ponto em graus decimais
 * @returns Distância em quilômetros
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Raio da Terra em km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distância em km
  return distance;
}

/**
 * Converte graus para radianos
 * @param deg Ângulo em graus
 * @returns Ângulo em radianos
 */
function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Formata um valor de distância para exibição
 * @param distance Distância em quilômetros
 * @returns String formatada com a unidade apropriada
 */
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance.toFixed(1)} km`;
}

/**
 * Formata um tempo estimado para exibição
 * @param minutes Tempo estimado em minutos
 * @returns String formatada com horas e minutos
 */
export function formatEstimatedTime(minutes: number): string {
  if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);
  return `${hours}h ${remainingMinutes}min`;
}

/**
 * Calcula o tempo estimado de chegada com base na distância
 * @param distance Distância em quilômetros
 * @param speedKmh Velocidade média em km/h (padrão: 30km/h)
 * @returns Tempo estimado em minutos
 */
export function calculateETA(distance: number, speedKmh: number = 30): number {
  // Tempo = distância / velocidade (em horas)
  // Convertemos para minutos multiplicando por 60
  return (distance / speedKmh) * 60;
}

/**
 * Ordena entregas por distância, prioridade ou data de criação
 * @param deliveries Array de entregas
 * @param sortBy Critério de ordenação ('distance', 'priority', 'date')
 * @param currentLocation Localização atual para cálculo de distância
 * @returns Array ordenado de entregas
 */
export function sortDeliveries(
  deliveries: any[],
  sortBy: 'distance' | 'priority' | 'date' = 'date',
  currentLocation?: { lat: number; lng: number }
): any[] {
  const sortedDeliveries = [...deliveries];

  switch (sortBy) {
    case 'distance':
      if (!currentLocation) return sortedDeliveries;
      
      // Adiciona a distância calculada a cada entrega
      sortedDeliveries.forEach(delivery => {
        if (delivery.coordinates) {
          delivery.calculatedDistance = calculateDistance(
            currentLocation.lat,
            currentLocation.lng,
            delivery.coordinates.lat,
            delivery.coordinates.lng
          );
        } else {
          delivery.calculatedDistance = Infinity;
        }
      });
      
      // Ordena por distância (menor para maior)
      return sortedDeliveries.sort((a, b) => a.calculatedDistance - b.calculatedDistance);
    
    case 'priority':
      // Ordena por prioridade (maior para menor)
      return sortedDeliveries.sort((a, b) => {
        const priorityMap: Record<string, number> = {
          'alta': 3,
          'média': 2,
          'baixa': 1
        };
        
        const priorityA = priorityMap[a.priority?.toLowerCase() || 'baixa'] || 1;
        const priorityB = priorityMap[b.priority?.toLowerCase() || 'baixa'] || 1;
        
        return priorityB - priorityA;
      });
    
    case 'date':
    default:
      // Ordena por data de criação (mais recente para mais antiga)
      return sortedDeliveries.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.data || 0).getTime();
        const dateB = new Date(b.createdAt || b.data || 0).getTime();
        return dateB - dateA;
      });
  }
} 