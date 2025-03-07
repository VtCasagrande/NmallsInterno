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
  ShoppingBag
} from 'lucide-react'
import Link from 'next/link'

// Dados de exemplo para compras
const comprasExemplo = [
  {
    id: 'PED-1001',
    fornecedor: 'Distribuidora ABC',
    data: '2025-03-01',
    valor: 1250.75,
    status: 'Entregue',
    responsavel: 'Maria Silva',
    itens: 12
  },
  {
    id: 'PED-1002',
    fornecedor: 'Atacadista XYZ',
    data: '2025-03-02',
    valor: 3450.50,
    status: 'Em trânsito',
    responsavel: 'João Oliveira',
    itens: 24
  },
  {
    id: 'PED-1003',
    fornecedor: 'Indústria 123',
    data: '2025-03-03',
    valor: 750.25,
    status: 'Pendente',
    responsavel: 'Ana Santos',
    itens: 8
  },
  {
    id: 'PED-1004',
    fornecedor: 'Fornecedor Rápido',
    data: '2025-03-04',
    valor: 2100.00,
    status: 'Cancelado',
    responsavel: 'Carlos Ferreira',
    itens: 15
  },
  {
    id: 'PED-1005',
    fornecedor: 'Distribuidora ABC',
    data: '2025-03-05',
    valor: 1800.30,
    status: 'Entregue',
    responsavel: 'Maria Silva',
    itens: 10
  }
]

export default function ComprasPage() {
  const [filtro, setFiltro] = useState('')
  const [statusFiltro, setStatusFiltro] = useState<string>('todos')
  const [ordenacao, setOrdenacao] = useState<{campo: string, direcao: 'asc' | 'desc'}>({
    campo: 'data',
    direcao: 'desc'
  })
  
  // Função para filtrar compras
  const comprasFiltradas = comprasExemplo.filter(compra => {
    // Filtro de texto
    const matchTexto = 
      compra.id.toLowerCase().includes(filtro.toLowerCase()) ||
      compra.fornecedor.toLowerCase().includes(filtro.toLowerCase()) ||
      compra.responsavel.toLowerCase().includes(filtro.toLowerCase())
    
    // Filtro de status
    const matchStatus = statusFiltro === 'todos' || compra.status.toLowerCase() === statusFiltro.toLowerCase()
    
    return matchTexto && matchStatus
  })
  
  // Função para ordenar compras
  const comprasOrdenadas = [...comprasFiltradas].sort((a, b) => {
    const { campo, direcao } = ordenacao
    
    if (campo === 'valor') {
      return direcao === 'asc' ? a.valor - b.valor : b.valor - a.valor
    }
    
    if (campo === 'data') {
      return direcao === 'asc' 
        ? new Date(a.data).getTime() - new Date(b.data).getTime()
        : new Date(b.data).getTime() - new Date(a.data).getTime()
    }
    
    if (campo === 'itens') {
      return direcao === 'asc' ? a.itens - b.itens : b.itens - a.itens
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
      case 'entregue':
        return 'bg-green-100 text-green-800'
      case 'em trânsito':
        return 'bg-blue-100 text-blue-800'
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Cabeçalho e Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total de Compras</p>
                <p className="text-2xl font-bold">{comprasExemplo.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <ShoppingBag className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Entregues</p>
                <p className="text-2xl font-bold">
                  {comprasExemplo.filter(c => c.status === 'Entregue').length}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center">
              <div className="rounded-full bg-yellow-100 p-3 mr-4">
                <ShoppingBag className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pendentes</p>
                <p className="text-2xl font-bold">
                  {comprasExemplo.filter(c => c.status === 'Pendente').length}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <ShoppingBag className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Valor Total</p>
                <p className="text-2xl font-bold">
                  {formatarValor(comprasExemplo.reduce((total, compra) => total + compra.valor, 0))}
                </p>
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
                placeholder="Buscar compras..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>
            
            <div className="flex-shrink-0">
              <select
                className="px-4 py-2 border border-gray-300 rounded-md w-full"
                value={statusFiltro}
                onChange={(e) => setStatusFiltro(e.target.value)}
              >
                <option value="todos">Todos os status</option>
                <option value="entregue">Entregue</option>
                <option value="em trânsito">Em trânsito</option>
                <option value="pendente">Pendente</option>
                <option value="cancelado">Cancelado</option>
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
            <Link href="/compras/nova">
              <Button leftIcon={<Plus className="h-4 w-4" />}>
                Nova Compra
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Tabela de Compras */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Compras</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 cursor-pointer" onClick={() => alternarOrdenacao('id')}>
                      <div className="flex items-center">
                        Pedido
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </th>
                    <th className="px-4 py-3 cursor-pointer" onClick={() => alternarOrdenacao('fornecedor')}>
                      <div className="flex items-center">
                        Fornecedor
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
                    <th className="px-4 py-3 cursor-pointer" onClick={() => alternarOrdenacao('responsavel')}>
                      <div className="flex items-center">
                        Responsável
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </th>
                    <th className="px-4 py-3 cursor-pointer" onClick={() => alternarOrdenacao('itens')}>
                      <div className="flex items-center">
                        Itens
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </th>
                    <th className="px-4 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {comprasOrdenadas.length > 0 ? (
                    comprasOrdenadas.map((compra) => (
                      <tr key={compra.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">
                          {compra.id}
                        </td>
                        <td className="px-4 py-3">
                          {compra.fornecedor}
                        </td>
                        <td className="px-4 py-3">
                          {formatarData(compra.data)}
                        </td>
                        <td className="px-4 py-3 font-medium">
                          {formatarValor(compra.valor)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(compra.status)}`}>
                            {compra.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {compra.responsavel}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {compra.itens}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <Link href={`/compras/${compra.id}`}>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="sr-only">Ver detalhes</span>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/compras/${compra.id}/editar`}>
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
                        Nenhuma compra encontrada
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Paginação */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Mostrando <span className="font-medium">{comprasOrdenadas.length}</span> de{' '}
                <span className="font-medium">{comprasExemplo.length}</span> compras
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