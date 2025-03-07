'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { 
  CheckCircle, 
  X, 
  Camera, 
  Upload, 
  User, 
  CreditCard, 
  DollarSign 
} from 'lucide-react'
import SignatureCanvas from './SignatureCanvas'

interface DeliveryConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (data: DeliveryConfirmationData) => void
  deliveryId: string
  isPaid: boolean
  totalValue: number
}

export interface DeliveryConfirmationData {
  deliveryId: string
  signature: string | null
  photo: string | null
  receiverName: string
  receiverDocument: string
  paymentMethod?: string
  paymentAmount?: number
}

export default function DeliveryConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  deliveryId,
  isPaid,
  totalValue
}: DeliveryConfirmationModalProps) {
  const [step, setStep] = useState(1)
  const [signature, setSignature] = useState<string | null>(null)
  const [photo, setPhoto] = useState<string | null>(null)
  const [receiverName, setReceiverName] = useState('')
  const [receiverDocument, setReceiverDocument] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<string>(isPaid ? 'pre_pago' : 'dinheiro')
  const [paymentAmount, setPaymentAmount] = useState<number>(totalValue)
  const [isProcessing, setIsProcessing] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null)

  // Função para avançar para o próximo passo
  const nextStep = () => {
    setStep(prev => prev + 1)
  }

  // Função para voltar ao passo anterior
  const prevStep = () => {
    setStep(prev => prev - 1)
  }

  // Função para salvar a assinatura
  const handleSaveSignature = (signatureData: string) => {
    setSignature(signatureData)
    nextStep()
  }

  // Função para ativar a câmera
  const activateCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      setCameraStream(stream)
      setCameraActive(true)
      
      // Aguardar o próximo ciclo de renderização para garantir que o elemento de vídeo exista
      setTimeout(() => {
        if (videoRef) {
          videoRef.srcObject = stream
        }
      }, 0)
    } catch (error) {
      console.error('Erro ao acessar a câmera:', error)
      alert('Não foi possível acessar a câmera. Verifique as permissões.')
    }
  }

  // Função para capturar foto
  const capturePhoto = () => {
    if (!videoRef) return
    
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.videoWidth
    canvas.height = videoRef.videoHeight
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    ctx.drawImage(videoRef, 0, 0, canvas.width, canvas.height)
    
    const photoData = canvas.toDataURL('image/jpeg')
    setPhoto(photoData)
    
    // Desativar a câmera
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
    }
    
    setCameraActive(false)
    nextStep()
  }

  // Função para carregar foto da galeria
  const uploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setPhoto(event.target.result as string)
        nextStep()
      }
    }
    reader.readAsDataURL(file)
  }

  // Função para confirmar a entrega
  const handleConfirm = () => {
    setIsProcessing(true)
    
    const confirmationData: DeliveryConfirmationData = {
      deliveryId,
      signature,
      photo,
      receiverName,
      receiverDocument,
      ...(isPaid ? {} : { paymentMethod, paymentAmount })
    }
    
    // Simular um atraso de processamento
    setTimeout(() => {
      onConfirm(confirmationData)
      setIsProcessing(false)
      onClose()
      
      // Resetar o estado
      setStep(1)
      setSignature(null)
      setPhoto(null)
      setReceiverName('')
      setReceiverDocument('')
    }, 1500)
  }

  // Função para fechar o modal e limpar o estado
  const handleClose = () => {
    // Desativar a câmera se estiver ativa
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
    }
    
    setCameraActive(false)
    setStep(1)
    onClose()
  }

  // Renderizar o conteúdo com base no passo atual
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-center">Assinatura do Cliente</h3>
            <p className="text-sm text-gray-500 text-center">
              Peça ao cliente para assinar abaixo para confirmar o recebimento
            </p>
            <SignatureCanvas 
              height={200} 
              onSave={handleSaveSignature} 
            />
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-center">Foto da Entrega</h3>
            <p className="text-sm text-gray-500 text-center">
              Tire uma foto da entrega ou do comprovante
            </p>
            
            {cameraActive ? (
              <div className="space-y-2">
                <div className="relative bg-black rounded-md overflow-hidden" style={{ height: '200px' }}>
                  <video 
                    ref={ref => setVideoRef(ref)} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex justify-center">
                  <Button 
                    type="button" 
                    variant="primary" 
                    onClick={capturePhoto}
                  >
                    Capturar Foto
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  leftIcon={<Camera className="h-4 w-4" />}
                  onClick={activateCamera}
                >
                  Tirar Foto
                </Button>
                <div className="relative">
                  <Button 
                    type="button" 
                    variant="outline" 
                    leftIcon={<Upload className="h-4 w-4" />}
                    className="w-full"
                  >
                    Carregar da Galeria
                  </Button>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={uploadPhoto} 
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={nextStep}
                >
                  Pular este passo
                </Button>
              </div>
            )}
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-center">Informações do Recebedor</h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <label htmlFor="receiverName" className="text-sm font-medium text-gray-700">
                  Nome do Recebedor
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="receiverName"
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
                    placeholder="Nome completo"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label htmlFor="receiverDocument" className="text-sm font-medium text-gray-700">
                  CPF/RG do Recebedor
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="receiverDocument"
                    value={receiverDocument}
                    onChange={(e) => setReceiverDocument(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
                    placeholder="000.000.000-00"
                    required
                  />
                </div>
              </div>
              
              {!isPaid && (
                <>
                  <div className="space-y-1">
                    <label htmlFor="paymentMethod" className="text-sm font-medium text-gray-700">
                      Forma de Pagamento
                    </label>
                    <select
                      id="paymentMethod"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md w-full"
                      required
                    >
                      <option value="dinheiro">Dinheiro</option>
                      <option value="cartao_credito">Cartão de Crédito</option>
                      <option value="cartao_debito">Cartão de Débito</option>
                      <option value="pix">PIX</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label htmlFor="paymentAmount" className="text-sm font-medium text-gray-700">
                      Valor Recebido (R$)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id="paymentAmount"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(Number(e.target.value))}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                </>
              )}
              
              <div className="pt-2">
                <Button 
                  type="button" 
                  variant="primary" 
                  className="w-full"
                  onClick={handleConfirm}
                  disabled={!receiverName || !receiverDocument || isProcessing}
                >
                  {isProcessing ? 'Processando...' : 'Confirmar Entrega'}
                </Button>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  // Renderizar o indicador de progresso
  const renderProgressIndicator = () => {
    return (
      <div className="flex justify-center mb-4">
        <div className="flex items-center space-x-2">
          <div className={`w-2.5 h-2.5 rounded-full ${step >= 1 ? 'bg-primary-500' : 'bg-gray-300'}`} />
          <div className={`w-2.5 h-2.5 rounded-full ${step >= 2 ? 'bg-primary-500' : 'bg-gray-300'}`} />
          <div className={`w-2.5 h-2.5 rounded-full ${step >= 3 ? 'bg-primary-500' : 'bg-gray-300'}`} />
        </div>
      </div>
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Confirmação de Entrega</h2>
          <button 
            type="button" 
            className="text-gray-400 hover:text-gray-500"
            onClick={handleClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          {renderProgressIndicator()}
          {renderStepContent()}
        </div>
        
        {step > 1 && step < 3 && (
          <div className="p-4 border-t border-gray-200 flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={prevStep}
            >
              Voltar
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              onClick={nextStep}
            >
              Pular
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 