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
  RefreshCw,
  ArrowLeftRight
} from 'lucide-react'
import Link from 'next/link'

// Dados de exemplo para trocas e empréstimos
const trocasExemplo = [
  {
    id: 'TRC-1001',
    cliente: 'Maria Oliveira',
    tipo: 'Troca',
    motivo: 'Produto com defeito',
    data: '2025-03-01',
    valor: 150.75,
    status: 'Aprovada',
    responsavel: 'João Silva'
  },
  {
    id: 'EMP-1002',
    cliente: 'Carlos Santos',
    tipo: 'Empréstimo',
    motivo: 'Teste de produto',
    data: '2025-03-02',
    valor: 450.50,
    status: 'Em análise',
    responsavel: 'Ana Ferreira'
  },
  {
    id: 'TRC-1003',
    cliente: 'Pedro Almeida',
    tipo: 'Troca',
    motivo: 'Tamanho incorreto',
    data: '2025-03-03',
    valor: 89.90,
    status: 'Concluída',
    responsavel: 'João Silva'
  },
  {
    id: 'EMP-1004',
    cliente: 'Fernanda Lima',
    tipo: 'Empréstimo',
    motivo: 'Evento corporativo',
    data: '2025-03-04',
    valor: 1200.00,
    status: 'Devolvido',
    responsavel: 'Carlos Mendes'
  },
  {
    id: 'TRC-1005',
    cliente: 'Juliana Costa',
    tipo: 'Troca',
    motivo: 'Cor diferente da anunciada',
    data: '2025-03-05',
    valor: 120.30,
    status: 'Recusada',
    responsavel: 'Ana Ferreira'
  }
]

export default function TrocasPage() {
  const [filtro, setFiltro] = useState('')
  const [tipoFiltro, setTipoFiltro] = useState<string>('todos')
  const [statusFiltro, setStatusFiltro] = useState<string>('todos')
  const [ordenacao, setOrdenacao] = useState<{campo: string, direcao: 'asc' | 'desc'}>({
    campo: 'data',
    direcao: 'desc'
  })
  
  // Função para filtrar trocas e empréstimos
  const trocasFiltradas = trocasExemplo.filter(troca => {
    // Filtro de texto
    const matchTexto = 
      troca.id.toLowerCase().includes(filtro.toLowerCase()) ||
      troca.cliente.toLowerCase().includes(filtro.toLowerCase()) ||
      troca.motivo.toLowerCase().includes(filtro.toLowerCase()) ||
      troca.responsavel.toLowerCase().includes(filtro.toLowerCase())
    
    // Filtro de tipo
    const matchTipo = tipoFiltro === 'todos' || troca.tipo.toLowerCase() === tipoFiltro.toLowerCase()
    
    // Filtro de status
    const matchStatus = statusFiltro === 'todos' || troca.status.toLowerCase() === statusFiltro.toLowerCase()
    
    return matchTexto && matchTipo && matchStatus
  })
  
  // Função para ordenar trocas e empréstimos
  const trocasOrdenadas = [...trocasFiltradas].sort((a, b) => {
    const { campo, direcao } = ordenacao
    
    if (campo === 'valor') {
      return direcao === 'asc' ? a.valor - b.valor : b.valor - a.valor
    }
    
    if (campo === 'data') {
      return direcao === 'asc' 
        ? new Date(a.data).getTime() - new Date(b.data).getTime()
        : new Date(b.data).getTime() - new Date(a.data).getTime()
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
  const formatarData = (dataString: string) => {
    const data = new Date(dataString)
    return data.toLocaleDateString('pt-BR')
  }
  
  // Função para formatar valor
  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }
  
  // Função para obter a cor do status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aprovada':
        return 'bg-blue-100 text-blue-800'
      case 'concluída':
        return 'bg-green-100 text-green-800'
      case 'em análise':
        return 'bg-yellow-100 text-yellow-800'
      case 'recusada':
        return 'bg-red-100 text-red-800'
      case 'devolvido':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  // Função para obter o ícone do tipo
  const getTipoIcon = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'troca':
        return <RefreshCw className="h-4 w-4 mr-1" />
      case 'empréstimo':
        return <ArrowLeftRight className="h-4 w-4 mr-1" />
      default:
        return null
    }
  }
  
  // Contadores para estatísticas
  const totalTrocas = trocasExemplo.filter(t => t.tipo === 'Troca').length
  const totalEmprestimos = trocasExemplo.filter(t => t.tipo === 'Empréstimo').length
  const totalAprovados = trocasExemplo.filter(t => t.status === 'Aprovada' || t.status === 'Concluída').length
  const totalPendentes = trocasExemplo.filter(t => t.status === 'Em análise').length
  
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Cabeçalho e Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <RefreshCw className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total de Trocas</p>
                <p className="text-2xl font-bold">{totalTrocas}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <ArrowLeftRight className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Empréstimos</p>
                <p className="text-2xl font-bold">{totalEmprestimos}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <RefreshCw className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Aprovados</p>
                <p className="text-2xl font-bold">{totalAprovados}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center">
              <div className="rounded-full bg-yellow-100 p-3 mr-4">
                <RefreshCw className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pendentes</p>
                <p className="text-2xl font-bold">{totalPendentes}</p>
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
                placeholder="Buscar trocas e empréstimos..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>
            
            <div className="flex-shrink-0">
              <select
                className="px-4 py-2 border border-gray-300 rounded-md w-full"
                value={tipoFiltro}
                onChange={(e) => setTipoFiltro(e.target.value)}
              >
                <option value="todos">Todos os tipos</option>
                <option value="troca">Trocas</option>
                <option value="empréstimo">Empréstimos</option>
              </select>
            </div>
            
            <div className="flex-shrink-0">
              <select
                className="px-4 py-2 border border-gray-300 rounded-md w-full"
                value={statusFiltro}
                onChange={(e) => setStatusFiltro(e.target.value)}
              >
                <option value="todos">Todos os status</option>
                <option value="aprovada">Aprovada</option>
                <option value="em análise">Em análise</option>
                <option value="concluída">Concluída</option>
                <option value="recusada">Recusada</option>
                <option value="devolvido">Devolvido</option>
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
            <Link href="/trocas/nova">
              <Button leftIcon={<Plus className="h-4 w-4" />}>
                Nova Solicitação
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Tabela de Trocas e Empréstimos */}
        <Card>
          <CardHeader>
            <CardTitle>Trocas e Empréstimos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 cursor-pointer" onClick={() => alternarOrdenacao('id')}>
                      <div className="flex items-center">
                        ID
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </th>
                    <th className="px-4 py-3 cursor-pointer" onClick={() => alternarOrdenacao('tipo')}>
                      <div className="flex items-center">
                        Tipo
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </th>
                    <th className="px-4 py-3 cursor-pointer" onClick={() => alternarOrdenacao('cliente')}>
                      <div className="flex items-center">
                        Cliente
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </th>
                    <th className="px-4 py-3 cursor-pointer" onClick={() => alternarOrdenacao('motivo')}>
                      <div className="flex items-center">
                        Motivo
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </th>
                    <th className="px-4 py-3 cursor-pointer" onClick={() => alternarOrdenacao('data')}>
                      <div className="flex items-center">
                        Data
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </th>
                    <th className="px-4 py-3 cursor-pointer" onClick={() => alternarOrdenacao('valor')}>
                      <div className="flex items-center">
                        Valor
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </th>
                    <th className="px-4 py-3 cursor-pointer" onClick={() => alternarOrdenacao('status')}>
                      <div className="flex items-center">
                        Status
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </th>
                    <th className="px-4 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {trocasOrdenadas.length > 0 ? (
                    trocasOrdenadas.map((troca) => (
                      <tr key={troca.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">
                          {troca.id}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            {getTipoIcon(troca.tipo)}
                            {troca.tipo}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {troca.cliente}
                        </td>
                        <td className="px-4 py-3">
                          {troca.motivo}
                        </td>
                        <td className="px-4 py-3">
                          {formatarData(troca.data)}
                        </td>
                        <td className="px-4 py-3 font-medium">
                          {formatarValor(troca.valor)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(troca.status)}`}>
                            {troca.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <Link href={`/trocas/${troca.id}`}>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="sr-only">Ver detalhes</span>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/trocas/${troca.id}/editar`}>
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
                        Nenhuma troca ou empréstimo encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Paginação */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Mostrando <span className="font-medium">{trocasOrdenadas.length}</span> de{' '}
                <span className="font-medium">{trocasExemplo.length}</span> registros
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