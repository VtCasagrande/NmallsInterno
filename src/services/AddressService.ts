'use client'

// Interface para o endereço retornado pela API ViaCEP
interface ViaCEPAddress {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

// Interface para o endereço formatado
export interface FormattedAddress {
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  estado: string;
  complemento: string;
  enderecoCompleto: string;
}

// Interface para as coordenadas geográficas
export interface GeoCoordinates {
  lat: number;
  lng: number;
}

class AddressService {
  private static instance: AddressService;
  private isClient: boolean = false;
  private cache: Map<string, FormattedAddress> = new Map();
  private geoCache: Map<string, GeoCoordinates> = new Map();

  constructor() {
    this.isClient = typeof window !== 'undefined';
  }

  // Padrão Singleton
  public static getInstance(): AddressService {
    if (!AddressService.instance) {
      AddressService.instance = new AddressService();
    }
    return AddressService.instance;
  }

  // Método para buscar endereço pelo CEP
  public async getAddressByCEP(cep: string): Promise<FormattedAddress | null> {
    if (!this.isClient) return null;

    // Remover caracteres não numéricos
    const cleanCEP = cep.replace(/\D/g, '');
    
    // Validar CEP
    if (cleanCEP.length !== 8) {
      throw new Error('CEP inválido. O CEP deve conter 8 dígitos.');
    }

    // Verificar cache
    if (this.cache.has(cleanCEP)) {
      return this.cache.get(cleanCEP) || null;
    }

    try {
      // Fazer requisição para a API ViaCEP
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar CEP: ${response.statusText}`);
      }
      
      const data: ViaCEPAddress = await response.json();
      
      // Verificar se o CEP existe
      if (data.erro) {
        throw new Error('CEP não encontrado.');
      }
      
      // Formatar endereço
      const formattedAddress: FormattedAddress = {
        cep: data.cep,
        logradouro: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        estado: data.uf,
        complemento: data.complemento,
        enderecoCompleto: this.formatFullAddress(data)
      };
      
      // Armazenar no cache
      this.cache.set(cleanCEP, formattedAddress);
      
      return formattedAddress;
    } catch (error) {
      console.error('Erro ao buscar endereço pelo CEP:', error);
      return null;
    }
  }

  // Método para formatar o endereço completo
  private formatFullAddress(address: ViaCEPAddress): string {
    const parts = [
      address.logradouro,
      address.bairro,
      `${address.localidade} - ${address.uf}`,
      address.cep
    ].filter(Boolean);
    
    return parts.join(', ');
  }

  // Método para buscar coordenadas geográficas pelo endereço
  public async getCoordinatesByAddress(address: string): Promise<GeoCoordinates | null> {
    if (!this.isClient) return null;

    // Verificar cache
    if (this.geoCache.has(address)) {
      return this.geoCache.get(address) || null;
    }

    try {
      // Em um ambiente real, você usaria uma API de geocodificação como Google Maps, Mapbox, etc.
      // Aqui estamos simulando com coordenadas aleatórias em São Paulo
      
      // Simular uma chamada de API com um pequeno atraso
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Gerar coordenadas aleatórias em São Paulo
      const coordinates: GeoCoordinates = {
        lat: -23.55 + (Math.random() - 0.5) * 0.1,
        lng: -46.63 + (Math.random() - 0.5) * 0.1
      };
      
      // Armazenar no cache
      this.geoCache.set(address, coordinates);
      
      return coordinates;
    } catch (error) {
      console.error('Erro ao buscar coordenadas pelo endereço:', error);
      return null;
    }
  }

  // Método para formatar o CEP
  public formatCEP(cep: string): string {
    const cleanCEP = cep.replace(/\D/g, '');
    
    if (cleanCEP.length <= 5) {
      return cleanCEP;
    }
    
    return `${cleanCEP.substring(0, 5)}-${cleanCEP.substring(5)}`;
  }
}

export default AddressService.getInstance(); 