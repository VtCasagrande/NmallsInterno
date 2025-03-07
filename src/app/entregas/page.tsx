import MainLayout from '@/components/layout/MainLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { DeliveryStatusBadge } from '@/components/ui/Badge'
import { 
  Truck, 
  Filter, 
  Search, 
  Plus, 
  MapPin, 
  Calendar, 
  Clock, 
  User,
  ArrowUpDown
} from 'lucide-react'
import Link from 'next/link'

export default function EntregasPage() {
  // Dados mockados para demonstração
  const entregas = [
    {
      id: 'ENT-001',
      cliente: 'Pet Shop Canino Feliz',
      endereco: 'Rua das Flores, 123 - São Paulo, SP',
      data: '15/03/2023',
      horario: '14:00 - 16:00',
      status: 'pendente',
      motorista: 'Carlos Silva',
      plataforma: 'Frismar',
      valor: 'R$ 1.250,00'
    },
    {
      id: 'ENT-002',
      cliente: 'Mundo Animal',
      endereco: 'Av. Paulista, 1000 - São Paulo, SP',
      data: '16/03/2023',
      horario: '10:00 - 12:00',
      status: 'em_rota',
      motorista: 'João Oliveira',
      plataforma: 'JadLog',
      valor: 'R$ 3.450,00'
    },
    {
      id: 'ENT-003',
      cliente: 'Pet Center Marginal',
      endereco: 'Marginal Pinheiros, 5000 - São Paulo, SP',
      data: '16/03/2023',
      horario: '13:00 - 15:00',
      status: 'adiado',
      motorista: 'Pedro Santos',
      plataforma: 'Shopee',
      valor: 'R$ 2.780,00'
    },
    {
      id: 'ENT-004',
      cliente: 'Cobasi Tatuapé',
      endereco: 'Rua Tuiuti, 2500 - São Paulo, SP',
      data: '17/03/2023',
      horario: '09:00 - 11:00',
      status: 'entregue',
      motorista: 'André Martins',
      plataforma: 'MELI',
      valor: 'R$ 4.120,00'
    },
    {
      id: 'ENT-005',
      cliente: 'Petz Moema',
      endereco: 'Av. Moema, 500 - São Paulo, SP',
      data: '17/03/2023',
      horario: '15:00 - 17:00',
      status: 'cancelado',
      motorista: 'Roberto Alves',
      plataforma: 'Frismar',
      valor: 'R$ 1.890,00'
    }
  ]

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gerenciamento de Entregas</h1>
          <Link href="/entregas/nova">
            <Button leftIcon={<Plus className="h-4 w-4" />}>
              Nova Entrega
            </Button>
          </Link>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">Todos</option>
                  <option value="pendente">Pendente</option>
                  <option value="em_rota">Em Rota</option>
                  <option value="entregue">Entregue</option>
                  <option value="cancelado">Cancelado</option>
                  <option value="adiado">Adiado</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="data" className="block text-sm font-medium text-gray-700 mb-1">
                  Data
                </label>
                <input
                  type="date"
                  id="data"
                  className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label htmlFor="motorista" className="block text-sm font-medium text-gray-700 mb-1">
                  Motorista
                </label>
                <select
                  id="motorista"
                  className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">Todos</option>
                  <option value="carlos">Carlos Silva</option>
                  <option value="joao">João Oliveira</option>
                  <option value="pedro">Pedro Santos</option>
                  <option value="andre">André Martins</option>
                  <option value="roberto">Roberto Alves</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="busca" className="block text-sm font-medium text-gray-700 mb-1">
                  Busca
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="busca"
                    placeholder="Cliente, endereço ou ID"
                    className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline" leftIcon={<Filter className="h-4 w-4" />}>
                Limpar Filtros
              </Button>
              <Button leftIcon={<Search className="h-4 w-4" />}>
                Aplicar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Abas de Status */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <a href="#" className="border-primary-500 text-primary-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
              Todas
            </a>
            <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
              Em Rota
            </a>
            <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
              Pendentes
            </a>
            <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
              Agendadas
            </a>
            <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
              Concluídas
            </a>
          </nav>
        </div>

        {/* Lista de Entregas */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-1 cursor-pointer">
                      <span>ID</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-1 cursor-pointer">
                      <span>Cliente</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Endereço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-1 cursor-pointer">
                      <span>Data/Horário</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-1 cursor-pointer">
                      <span>Status</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Motorista
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plataforma
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {entregas.map((entrega) => (
                  <tr key={entrega.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <Link href={`/entregas/${entrega.id}`} className="text-primary-600 hover:text-primary-900">
                        {entrega.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        {entrega.cliente}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        {entrega.endereco}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          {entrega.data}
                        </div>
                        <div className="flex items-center mt-1">
                          <Clock className="h-4 w-4 mr-2 text-gray-400" />
                          {entrega.horario}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <DeliveryStatusBadge status={entrega.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entrega.motorista}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entrega.plataforma}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entrega.valor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <Link href={`/entregas/${entrega.id}`}>
                          <Button variant="outline" size="sm">
                            Detalhes
                          </Button>
                        </Link>
                        {entrega.status === 'em_rota' && (
                          <Link href={`/entregas/${entrega.id}/rastreamento`}>
                            <Button variant="primary" size="sm">
                              Rastrear
                            </Button>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Mostrando 5 de 25 entregas
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>
                Anterior
              </Button>
              <Button variant="outline" size="sm">
                Próxima
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  )
} 