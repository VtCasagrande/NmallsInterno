'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MainLayout from '@/components/layout/MainLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Search, Loader2 } from 'lucide-react'
import Link from 'next/link'
import MapComponent from '@/components/maps/MapComponent'
import { LocationData } from '@/services/TrackingService'
import AddressService, { FormattedAddress, GeoCoordinates } from '@/services/AddressService'
import NotificationService from '@/services/NotificationService'

export default function NovaEntregaPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingAddress, setIsLoadingAddress] = useState(false)
  const [addressError, setAddressError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    numeroPedido: '',
    cliente: '',
    telefone: '',
    cep: '',
    endereco: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    complemento: '',
    data: '',
    horario: '',
    motorista: '',
    prioridade: 'média',
    observacoes: '',
    itens: [{ nome: '', quantidade: 1, valor: 0 }]
  })
  const [destino, setDestino] = useState<GeoCoordinates | null>(null)
  const [addressFound, setAddressFound] = useState(false)
  
  // Função para atualizar o formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Se o campo for CEP e tiver 8 dígitos, buscar endereço automaticamente
    if (name === 'cep') {
      const cleanCEP = value.replace(/\D/g, '')
      if (cleanCEP.length === 8) {
        buscarEnderecoPorCEP(cleanCEP)
      }
    }
  }
  
  // Função para buscar endereço pelo CEP
  const buscarEnderecoPorCEP = async (cep: string) => {
    setIsLoadingAddress(true)
    setAddressError(null)
    setAddressFound(false)
    
    try {
      const endereco = await AddressService.getAddressByCEP(cep)
      
      if (endereco) {
        setFormData(prev => ({
          ...prev,
          endereco: endereco.logradouro || '',
          bairro: endereco.bairro || '',
          cidade: endereco.cidade || '',
          estado: endereco.estado || '',
          complemento: endereco.complemento || ''
        }))
        
        setAddressFound(true)
        
        // Buscar coordenadas do endereço
        buscarCoordenadas(endereco.enderecoCompleto)
      } else {
        setAddressError('CEP não encontrado')
      }
    } catch (error) {
      setAddressError(error instanceof Error ? error.message : 'Erro ao buscar endereço')
    } finally {
      setIsLoadingAddress(false)
    }
  }
  
  // Função para atualizar itens
  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItens = [...formData.itens]
    newItens[index] = { ...newItens[index], [field]: value }
    setFormData(prev => ({ ...prev, itens: newItens }))
  }
  
  // Função para adicionar item
  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      itens: [...prev.itens, { nome: '', quantidade: 1, valor: 0 }]
    }))
  }
  
  // Função para remover item
  const removeItem = (index: number) => {
    if (formData.itens.length <= 1) return
    const newItens = [...formData.itens]
    newItens.splice(index, 1)
    setFormData(prev => ({ ...prev, itens: newItens }))
  }
  
  // Função para buscar coordenadas do endereço
  const buscarCoordenadas = async (endereco: string) => {
    try {
      const coordenadas = await AddressService.getCoordinatesByAddress(endereco)
      if (coordenadas) {
        setDestino(coordenadas)
      }
    } catch (error) {
      console.error('Erro ao buscar coordenadas:', error)
    }
  }
  
  // Função para formatar o CEP
  const formatarCEP = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    const cepFormatado = AddressService.formatCEP(value)
    setFormData(prev => ({ ...prev, cep: cepFormatado }))
  }
  
  // Função para enviar o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Gerar ID único para a entrega
      const entregaId = `ENT-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
      
      // Dados da entrega
      const dadosEntrega = {
        id: entregaId,
        numeroPedido: formData.numeroPedido,
        cliente: formData.cliente,
        telefone: formData.telefone,
        endereco: `${formData.endereco}, ${formData.numero}, ${formData.bairro}, ${formData.cidade} - ${formData.estado}, ${formData.cep}`,
        complemento: formData.complemento,
        data: formData.data,
        horario: formData.horario,
        motorista: formData.motorista,
        prioridade: formData.prioridade,
        observacoes: formData.observacoes,
        itens: formData.itens,
        valorTotal: valorTotal,
        coordenadas: destino,
        status: 'pendente',
        createdAt: new Date().toISOString()
      }
      
      // Em um caso real, você enviaria os dados para o servidor
      console.log('Dados da entrega:', dadosEntrega)
      
      // Se um motorista foi selecionado, enviar notificação
      if (formData.motorista) {
        // Buscar dados do motorista (simulado)
        const motoristas = {
          'João Oliveira': { id: 'driver-001', name: 'João Oliveira', phone: '11987654321' },
          'Maria Silva': { id: 'driver-002', name: 'Maria Silva', phone: '11976543210' },
          'Carlos Santos': { id: 'driver-003', name: 'Carlos Santos', phone: '11965432109' }
        }
        
        const motoristaSelecionado = motoristas[formData.motorista as keyof typeof motoristas]
        
        if (motoristaSelecionado) {
          // Enviar notificação para o motorista
          await NotificationService.notifyDriver(
            motoristaSelecionado,
            {
              id: entregaId,
              cliente: formData.cliente,
              endereco: `${formData.endereco}, ${formData.numero}`,
              numeroPedido: formData.numeroPedido,
              data: formData.data,
              horario: formData.horario
            },
            {
              title: `Nova entrega #${formData.numeroPedido || entregaId}`,
              message: `Você recebeu uma nova entrega para ${formData.cliente} em ${formData.bairro}, ${formData.cidade}`,
              type: 'nova-entrega'
            }
          )
        }
      }
      
      // Simular atraso da API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirecionar para a lista de entregas
      router.push('/entregas')
    } catch (error) {
      console.error('Erro ao salvar entrega:', error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Calcular valor total
  const valorTotal = formData.itens.reduce((total, item) => {
    return total + (Number(item.quantidade) * Number(item.valor))
  }, 0)
  
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
            <h1 className="text-2xl font-bold">Nova Entrega</h1>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Informações do Cliente */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Informações do Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="numeroPedido" className="text-sm font-medium text-gray-700">
                      Número do Pedido
                    </label>
                    <input
                      type="text"
                      id="numeroPedido"
                      name="numeroPedido"
                      value={formData.numeroPedido}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Ex: PED-12345"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="cliente" className="text-sm font-medium text-gray-700">
                      Nome do Cliente
                    </label>
                    <input
                      type="text"
                      id="cliente"
                      name="cliente"
                      value={formData.cliente}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="telefone" className="text-sm font-medium text-gray-700">
                      Telefone
                    </label>
                    <input
                      type="text"
                      id="telefone"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="cep" className="text-sm font-medium text-gray-700">
                      CEP
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        id="cep"
                        name="cep"
                        value={formData.cep}
                        onChange={handleChange}
                        onBlur={formatarCEP}
                        className="w-full px-3 py-2 border border-gray-300 rounded-l-md"
                        placeholder="00000-000"
                        required
                      />
                      <Button 
                        type="button" 
                        variant="default"
                        className="rounded-l-none"
                        onClick={() => buscarEnderecoPorCEP(formData.cep)}
                        disabled={isLoadingAddress || formData.cep.replace(/\D/g, '').length !== 8}
                      >
                        {isLoadingAddress ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                      </Button>
                    </div>
                    {addressError && (
                      <p className="text-sm text-red-500 mt-1">{addressError}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="endereco" className="text-sm font-medium text-gray-700">
                      Endereço
                    </label>
                    <input
                      type="text"
                      id="endereco"
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="numero" className="text-sm font-medium text-gray-700">
                      Número
                    </label>
                    <input
                      type="text"
                      id="numero"
                      name="numero"
                      value={formData.numero}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="bairro" className="text-sm font-medium text-gray-700">
                      Bairro
                    </label>
                    <input
                      type="text"
                      id="bairro"
                      name="bairro"
                      value={formData.bairro}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="cidade" className="text-sm font-medium text-gray-700">
                      Cidade
                    </label>
                    <input
                      type="text"
                      id="cidade"
                      name="cidade"
                      value={formData.cidade}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="estado" className="text-sm font-medium text-gray-700">
                      Estado
                    </label>
                    <input
                      type="text"
                      id="estado"
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="complemento" className="text-sm font-medium text-gray-700">
                      Complemento
                    </label>
                    <input
                      type="text"
                      id="complemento"
                      name="complemento"
                      value={formData.complemento}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
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
                  <div className="space-y-2">
                    <label htmlFor="data" className="text-sm font-medium text-gray-700">
                      Data (opcional)
                    </label>
                    <input
                      type="date"
                      id="data"
                      name="data"
                      value={formData.data}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="horario" className="text-sm font-medium text-gray-700">
                      Horário (opcional)
                    </label>
                    <input
                      type="time"
                      id="horario"
                      name="horario"
                      value={formData.horario}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="motorista" className="text-sm font-medium text-gray-700">
                      Motorista
                    </label>
                    <select
                      id="motorista"
                      name="motorista"
                      value={formData.motorista}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Selecione um motorista</option>
                      <option value="João Oliveira">João Oliveira</option>
                      <option value="Maria Silva">Maria Silva</option>
                      <option value="Carlos Santos">Carlos Santos</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="prioridade" className="text-sm font-medium text-gray-700">
                      Prioridade
                    </label>
                    <select
                      id="prioridade"
                      name="prioridade"
                      value={formData.prioridade}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="baixa">Baixa</option>
                      <option value="média">Média</option>
                      <option value="alta">Alta</option>
                      <option value="urgente">Urgente</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="observacoes" className="text-sm font-medium text-gray-700">
                      Observações
                    </label>
                    <textarea
                      id="observacoes"
                      name="observacoes"
                      value={formData.observacoes}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Mapa */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Localização</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] rounded-md overflow-hidden">
                  <MapComponent
                    destination={destino}
                    height="100%"
                    width="100%"
                    zoom={15}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Itens do Pedido */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Itens do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {formData.itens.map((item, index) => (
                    <div key={index} className="space-y-2 p-3 border border-gray-200 rounded-md">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Item {index + 1}</h4>
                        {formData.itens.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeItem(index)}
                          >
                            Remover
                          </Button>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Nome do Item
                        </label>
                        <input
                          type="text"
                          value={item.nome}
                          onChange={(e) => handleItemChange(index, 'nome', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Quantidade
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantidade}
                            onChange={(e) => handleItemChange(index, 'quantidade', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Valor (R$)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.valor}
                            onChange={(e) => handleItemChange(index, 'valor', parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={addItem}
                  >
                    Adicionar Item
                  </Button>
                  
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Valor Total:</span>
                      <span className="font-bold text-lg">
                        {valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Link href="/entregas">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : 'Salvar Entrega'}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  )
} 