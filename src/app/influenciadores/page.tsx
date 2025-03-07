'use client'

import { useState } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  ArrowUpDown, 
  Eye, 
  Edit, 
  Trash2,
  Users,
  Instagram as InstagramIcon,
  Youtube as YoutubeIcon,
  MessageCircle,
  Facebook as FacebookIcon,
  Share2,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// Dados de exemplo para influenciadores
const influenciadoresExemplo = [
  {
    id: 'INF-1001',
    nome: 'Ana Silva',
    avatar: '/avatars/ana-silva.jpg',
    categoria: 'Moda',
    seguidores: 250000,
    engajamento: 3.5,
    plataformas: ['Instagram', 'TikTok'],
    status: 'Ativo',
    ultimaCampanha: '2025-02-15'
  },
  {
    id: 'INF-1002',
    nome: 'Carlos Oliveira',
    avatar: '/avatars/carlos-oliveira.jpg',
    categoria: 'Tecnologia',
    seguidores: 500000,
    engajamento: 4.2,
    plataformas: ['Youtube', 'Twitter'],
    status: 'Ativo',
    ultimaCampanha: '2025-02-20'
  },
  {
    id: 'INF-1003',
    nome: 'Juliana Santos',
    avatar: '/avatars/juliana-santos.jpg',
    categoria: 'Beleza',
    seguidores: 180000,
    engajamento: 5.1,
    plataformas: ['Instagram', 'Youtube', 'TikTok'],
    status: 'Inativo',
    ultimaCampanha: '2025-01-10'
  },
  {
    id: 'INF-1004',
    nome: 'Pedro Almeida',
    avatar: '/avatars/pedro-almeida.jpg',
    categoria: 'Esportes',
    seguidores: 320000,
    engajamento: 2.8,
    plataformas: ['Instagram', 'Facebook'],
    status: 'Ativo',
    ultimaCampanha: '2025-03-01'
  },
  {
    id: 'INF-1005',
    nome: 'Mariana Costa',
    avatar: '/avatars/mariana-costa.jpg',
    categoria: 'Lifestyle',
    seguidores: 420000,
    engajamento: 3.9,
    plataformas: ['Instagram', 'TikTok', 'Youtube'],
    status: 'Em análise',
    ultimaCampanha: null
  }
]

export default function InfluenciadoresPage() {
  const [filtro, setFiltro] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('todas')
  const [statusFiltro, setStatusFiltro] = useState<string>('todos')
  const [plataformaFiltro, setPlataformaFiltro] = useState<string>('todas')
  const [ordenacao, setOrdenacao] = useState<{campo: string, direcao: 'asc' | 'desc'}>({
    campo: 'seguidores',
    direcao: 'desc'
  })
  
  // Função para filtrar influenciadores
  const influenciadoresFiltrados = influenciadoresExemplo.filter(influenciador => {
    // Filtro de texto
    const matchTexto = 
      influenciador.id.toLowerCase().includes(filtro.toLowerCase()) ||
      influenciador.nome.toLowerCase().includes(filtro.toLowerCase())
    
    // Filtro de categoria
    const matchCategoria = categoriaFiltro === 'todas' || influenciador.categoria.toLowerCase() === categoriaFiltro.toLowerCase()
    
    // Filtro de status
    const matchStatus = statusFiltro === 'todos' || influenciador.status.toLowerCase() === statusFiltro.toLowerCase()
    
    // Filtro de plataforma
    const matchPlataforma = plataformaFiltro === 'todas' || 
      influenciador.plataformas.some(p => p.toLowerCase() === plataformaFiltro.toLowerCase())
    
    return matchTexto && matchCategoria && matchStatus && matchPlataforma
  })
  
  // Função para ordenar influenciadores
  const influenciadoresOrdenados = [...influenciadoresFiltrados].sort((a, b) => {
    const { campo, direcao } = ordenacao
    
    if (campo === 'seguidores' || campo === 'engajamento') {
      return direcao === 'asc' 
        ? (a as any)[campo] - (b as any)[campo]
        : (b as any)[campo] - (a as any)[campo]
    }
    
    if (campo === 'ultimaCampanha') {
      // Tratar valores nulos (sem campanha)
      if (a.ultimaCampanha === null && b.ultimaCampanha === null) return 0
      if (a.ultimaCampanha === null) return direcao === 'asc' ? -1 : 1
      if (b.ultimaCampanha === null) return direcao === 'asc' ? 1 : -1
      
      return direcao === 'asc' 
        ? new Date(a.ultimaCampanha).getTime() - new Date(b.ultimaCampanha).getTime()
        : new Date(b.ultimaCampanha).getTime() - new Date(a.ultimaCampanha).getTime()
    }
    
    // Ordenação de texto
    const valorA = (a as any)[campo].toLowerCase()
    const valorB = (b as any)[campo].toLowerCase()
    
    if (direcao === 'asc') {
      return valorA.localeCompare(valorB)
    } else {
      return valorB.localeCompare(valorA)
    }
  })
  
  // Função para alternar ordenação
  const alternarOrdenacao = (campo: string) => {
    setOrdenacao(prev => {
      if (prev.campo === campo) {
        return { campo, direcao: prev.direcao === 'asc' ? 'desc' : 'asc' }
      }
      return { campo, direcao: 'asc' }
    })
  }
  
  // Função para formatar data
  const formatarData = (dataString: string | null) => {
    if (!dataString) return 'Sem campanhas'
    const data = new Date(dataString)
    return data.toLocaleDateString('pt-BR')
  }
  
  // Função para formatar número de seguidores
  const formatarSeguidores = (seguidores: number) => {
    if (seguidores >= 1000000) {
      return `${(seguidores / 1000000).toFixed(1)}M`
    } else if (seguidores >= 1000) {
      return `${(seguidores / 1000).toFixed(1)}K`
    }
    return seguidores.toString()
  }
  
  // Função para obter a cor do status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ativo':
        return 'bg-green-100 text-green-800'
      case 'inativo':
        return 'bg-red-100 text-red-800'
      case 'em análise':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  // Função para obter o ícone da plataforma
  const getPlataformaIcon = (plataforma: string) => {
    switch (plataforma.toLowerCase()) {
      case 'instagram':
        return <InstagramIcon className="h-4 w-4 text-pink-600" />
      case 'youtube':
        return <YoutubeIcon className="h-4 w-4 text-red-600" />
      case 'tiktok':
        return <Share2 className="h-4 w-4 text-black" />
      case 'twitter':
        return <MessageCircle className="h-4 w-4 text-blue-400" />
      case 'facebook':
        return <FacebookIcon className="h-4 w-4 text-blue-600" />
      default:
        return <ExternalLink className="h-4 w-4 text-gray-500" />
    }
  }
  
  // Contadores para estatísticas
  const totalInfluenciadores = influenciadoresExemplo.length
  const totalAtivos = influenciadoresExemplo.filter(i => i.status === 'Ativo').length
  const totalSeguidores = influenciadoresExemplo.reduce((total, i) => total + i.seguidores, 0)
  const mediaEngajamento = influenciadoresExemplo.reduce((total, i) => total + i.engajamento, 0) / totalInfluenciadores
  
  // Categorias únicas para o filtro
  const categorias = Array.from(new Set(influenciadoresExemplo.map(i => i.categoria)))
  
  // Plataformas únicas para o filtro
  const plataformas = Array.from(
    new Set(influenciadoresExemplo.flatMap(i => i.plataformas))
  )
  
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Cabeçalho e Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total de Influenciadores</p>
                <p className="text-2xl font-bold">{totalInfluenciadores}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Ativos</p>
                <p className="text-2xl font-bold">{totalAtivos}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total de Seguidores</p>
                <p className="text-2xl font-bold">{formatarSeguidores(totalSeguidores)}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center">
              <div className="rounded-full bg-yellow-100 p-3 mr-4">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Média de Engajamento</p>
                <p className="text-2xl font-bold">{mediaEngajamento.toFixed(1)}%</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Filtros e Ações */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar influenciadores..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>
            
            <div className="flex-shrink-0">
              <select
                className="px-4 py-2 border border-gray-300 rounded-md w-full"
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
              >
                <option value="todas">Todas as categorias</option>
                {categorias.map(categoria => (
                  <option key={categoria} value={categoria.toLowerCase()}>
                    {categoria}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex-shrink-0">
              <select
                className="px-4 py-2 border border-gray-300 rounded-md w-full"
                value={plataformaFiltro}
                onChange={(e) => setPlataformaFiltro(e.target.value)}
              >
                <option value="todas">Todas as plataformas</option>
                {plataformas.map(plataforma => (
                  <option key={plataforma} value={plataforma.toLowerCase()}>
                    {plataforma}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex-shrink-0">
              <select
                className="px-4 py-2 border border-gray-300 rounded-md w-full"
                value={statusFiltro}
                onChange={(e) => setStatusFiltro(e.target.value)}
              >
                <option value="todos">Todos os status</option>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
                <option value="em análise">Em análise</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" leftIcon={<Filter className="h-4 w-4" />}>
              Filtros
            </Button>
            <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
              Exportar
            </Button>
            <Link href="/influenciadores/novo">
              <Button leftIcon={<Plus className="h-4 w-4" />}>
                Novo Influenciador
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Tabela de Influenciadores */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Influenciadores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 cursor-pointer" onClick={() => alternarOrdenacao('nome')}>
                      <div className="flex items-center">
                        Influenciador
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </th>
                    <th className="px-4 py-3 cursor-pointer" onClick={() => alternarOrdenacao('categoria')}>
                      <div className="flex items-center">
                        Categoria
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </th>
                    <th className="px-4 py-3 cursor-pointer" onClick={() => alternarOrdenacao('seguidores')}>
                      <div className="flex items-center">
                        Seguidores
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </th>
                    <th className="px-4 py-3 cursor-pointer" onClick={() => alternarOrdenacao('engajamento')}>
                      <div className="flex items-center">
                        Engajamento
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </th>
                    <th className="px-4 py-3">
                      <div className="flex items-center">
                        Plataformas
                      </div>
                    </th>
                    <th className="px-4 py-3 cursor-pointer" onClick={() => alternarOrdenacao('status')}>
                      <div className="flex items-center">
                        Status
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </th>
                    <th className="px-4 py-3 cursor-pointer" onClick={() => alternarOrdenacao('ultimaCampanha')}>
                      <div className="flex items-center">
                        Última Campanha
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </th>
                    <th className="px-4 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {influenciadoresOrdenados.length > 0 ? (
                    influenciadoresOrdenados.map((influenciador) => (
                      <tr key={influenciador.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 relative">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                {influenciador.avatar ? (
                                  <div className="relative h-10 w-10">
                                    <div className="h-10 w-10 rounded-full bg-gray-200" />
                                    {/* Placeholder para avatar - em produção usaria Image do Next.js */}
                                  </div>
                                ) : (
                                  <Users className="h-5 w-5 text-gray-500" />
                                )}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{influenciador.nome}</div>
                              <div className="text-gray-500 text-xs">{influenciador.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {influenciador.categoria}
                        </td>
                        <td className="px-4 py-3 font-medium">
                          {formatarSeguidores(influenciador.seguidores)}
                        </td>
                        <td className="px-4 py-3">
                          {influenciador.engajamento}%
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-1">
                            {influenciador.plataformas.map(plataforma => (
                              <div key={plataforma} className="tooltip" data-tip={plataforma}>
                                {getPlataformaIcon(plataforma)}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(influenciador.status)}`}>
                            {influenciador.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {formatarData(influenciador.ultimaCampanha)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <Link href={`/influenciadores/${influenciador.id}`}>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="sr-only">Ver detalhes</span>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/influenciadores/${influenciador.id}/editar`}>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="sr-only">Editar</span>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500">
                              <span className="sr-only">Excluir</span>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="bg-white border-b">
                      <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                        Nenhum influenciador encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Paginação */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Mostrando <span className="font-medium">{influenciadoresOrdenados.length}</span> de{' '}
                <span className="font-medium">{influenciadoresExemplo.length}</span> influenciadores
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Anterior
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Próxima
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
} 