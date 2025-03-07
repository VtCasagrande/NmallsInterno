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
  Package,
  Phone,
  Mail,
  DollarSign,
  ArrowLeft,
  Edit,
  Printer,
  Share2,
  CheckCircle,
  FileText,
  Image as ImageIcon
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function EntregaDetalhesPage({ params }: { params: { id: string } }) {
  // Dados mockados para demonstração
  const entrega = {
    id: params.id,
    cliente: {
      nome: 'Mundo Animal',
      email: 'contato@mundoanimal.com.br',
      telefone: '(11) 98765-4321'
    },
    endereco: 'Av. Paulista, 1000 - São Paulo, SP',
    cep: '01310-100',
    data: '16/03/2023',
    horario: '10:00 - 12:00',
    status: 'entregue',
    motorista: 'João Oliveira',
    plataforma: 'JadLog',
    valor: 3450.00,
    isPaid: true,
    pagamento: {
      metodo: 'Boleto Bancário',
      status: 'Pago',
      vencimento: '20/03/2023'
    },
    itens: [
      { id: 1, produto: 'Ração Premium Cães Adultos', quantidade: 10, valor: 1200.00 },
      { id: 2, produto: 'Brinquedo Interativo para Gatos', quantidade: 15, valor: 750.00 },
      { id: 3, produto: 'Coleira Antipulgas', quantidade: 20, valor: 1000.00 },
      { id: 4, produto: 'Shampoo Hipoalergênico', quantidade: 5, valor: 500.00 }
    ],
    historico: [
      { data: '15/03/2023 14:30', status: 'Pedido criado', usuario: 'Maria Silva' },
      { data: '15/03/2023 15:45', status: 'Separação iniciada', usuario: 'Carlos Oliveira' },
      { data: '15/03/2023 17:20', status: 'Separação concluída', usuario: 'Carlos Oliveira' },
      { data: '16/03/2023 08:15', status: 'Em rota de entrega', usuario: 'João Oliveira' },
      { data: '16/03/2023 11:45', status: 'Entregue', usuario: 'João Oliveira' }
    ],
    coordenadas: {
      latitude: -23.5505,
      longitude: -46.6333
    },
    confirmacao: {
      assinatura: '/images/signature-example.png',
      foto: '/images/delivery-photo-example.jpg',
      recebedor: {
        nome: 'Ana Silva',
        documento: '123.456.789-00'
      },
      dataHora: '16/03/2023 11:45'
    }
  }

  // Formatar valor para exibição
  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/entregas">
              <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Voltar
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Detalhes da Entrega #{params.id}</h1>
            <DeliveryStatusBadge status={entrega.status} />
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" leftIcon={<Edit className="h-4 w-4" />}>
              Editar
            </Button>
            <Button variant="outline" leftIcon={<Printer className="h-4 w-4" />}>
              Imprimir
            </Button>
            <Button variant="outline" leftIcon={<Share2 className="h-4 w-4" />}>
              Compartilhar
            </Button>
            {entrega.status === 'em_rota' && (
              <Link href={`/entregas/${params.id}/rastreamento`}>
                <Button leftIcon={<Truck className="h-4 w-4" />}>
                  Rastrear Entrega
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações do Cliente */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Nome</h3>
                    <p className="text-sm text-gray-500">{entrega.cliente.nome}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Email</h3>
                    <p className="text-sm text-gray-500">{entrega.cliente.email}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Telefone</h3>
                    <p className="text-sm text-gray-500">{entrega.cliente.telefone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações da Entrega */}
          <Card>
            <CardHeader>
              <CardTitle>Informações da Entrega</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Endereço</h3>
                    <p className="text-sm text-gray-500">{entrega.endereco}</p>
                    <p className="text-sm text-gray-500">CEP: {entrega.cep}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Data</h3>
                    <p className="text-sm text-gray-500">{entrega.data}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Horário</h3>
                    <p className="text-sm text-gray-500">{entrega.horario}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Truck className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Motorista</h3>
                    <p className="text-sm text-gray-500">{entrega.motorista}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Package className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Plataforma</h3>
                    <p className="text-sm text-gray-500">{entrega.plataforma}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resumo Financeiro */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo Financeiro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <DollarSign className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Valor Total</h3>
                    <p className="text-lg font-semibold text-gray-900">{formatarValor(entrega.valor)}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Forma de Pagamento</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm text-gray-500">Método</p>
                      <p className="text-sm font-medium">{entrega.pagamento.metodo}</p>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm text-gray-500">Status</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        entrega.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {entrega.pagamento.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">Vencimento</p>
                      <p className="text-sm text-gray-500">{entrega.pagamento.vencimento}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Itens do Pedido */}
        <Card>
          <CardHeader>
            <CardTitle>Itens do Pedido</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {entrega.itens.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{item.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.produto}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantidade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.valor}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Histórico de Status */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flow-root">
              <ul className="-mb-8">
                {entrega.historico.map((evento, eventoIdx) => (
                  <li key={eventoIdx}>
                    <div className="relative pb-8">
                      {eventoIdx !== entrega.historico.length - 1 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center ring-8 ring-white">
                            <Truck className="h-4 w-4 text-primary-600" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              {evento.status} <span className="font-medium text-gray-900">por {evento.usuario}</span>
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {evento.data}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Mapa Estático (Placeholder) */}
        <Card>
          <CardHeader>
            <CardTitle>Localização da Entrega</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-8 w-8 text-primary-500 mx-auto mb-2" />
                <p className="text-gray-500">Mapa de localização será exibido aqui</p>
                <p className="text-sm text-gray-400">Latitude: {entrega.coordenadas.latitude}, Longitude: {entrega.coordenadas.longitude}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Confirmação de Entrega - Apenas se a entrega estiver concluída */}
        {entrega.status === 'entregue' && entrega.confirmacao && (
          <Card>
            <CardHeader>
              <CardTitle>Confirmação de Entrega</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informações do Recebedor */}
                <div className="space-y-4">
                  <div className="flex items-start">
                    <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Recebedor</h3>
                      <p className="text-sm text-gray-500">{entrega.confirmacao.recebedor.nome}</p>
                      <p className="text-xs text-gray-500">CPF/RG: {entrega.confirmacao.recebedor.documento}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Data e Hora</h3>
                      <p className="text-sm text-gray-500">{entrega.confirmacao.dataHora}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Status</h3>
                      <p className="text-sm text-green-500">Entrega confirmada</p>
                    </div>
                  </div>
                </div>
                
                {/* Assinatura e Foto */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      Assinatura
                    </h3>
                    <div className="border border-gray-200 rounded-md p-2 bg-gray-50">
                      {entrega.confirmacao.assinatura ? (
                        <div className="relative h-20 w-full">
                          <div className="h-20 w-full bg-white rounded-md flex items-center justify-center">
                            {/* Em produção, usaria o componente Image do Next.js */}
                            <p className="text-sm text-gray-500">Assinatura disponível</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-2">Assinatura não disponível</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <ImageIcon className="h-4 w-4 mr-1" />
                      Foto da Entrega
                    </h3>
                    <div className="border border-gray-200 rounded-md p-2 bg-gray-50">
                      {entrega.confirmacao.foto ? (
                        <div className="relative h-32 w-full">
                          <div className="h-32 w-full bg-gray-200 rounded-md flex items-center justify-center">
                            {/* Em produção, usaria o componente Image do Next.js */}
                            <p className="text-sm text-gray-500">Foto disponível</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-2">Foto não disponível</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
} 