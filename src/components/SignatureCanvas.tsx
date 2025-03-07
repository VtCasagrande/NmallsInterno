'use client'

import { useRef, useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Trash2 } from 'lucide-react'

interface SignatureCanvasProps {
  width?: number | string
  height?: number | string
  onSave?: (signatureData: string) => void
  className?: string
}

export default function SignatureCanvas({
  width = '100%',
  height = 200,
  onSave,
  className = ''
}: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)
  const [lastX, setLastX] = useState(0)
  const [lastY, setLastY] = useState(0)

  // Inicializar o canvas
  useEffect(() => {
    if (!canvasRef.current) return
    
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    
    if (!context) return
    
    // Configurar o contexto
    context.lineJoin = 'round'
    context.lineCap = 'round'
    context.lineWidth = 2
    context.strokeStyle = '#000'
    
    setCtx(context)
    
    // Ajustar o tamanho do canvas para corresponder ao tamanho do elemento
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
      
      // Reconfigurar o contexto após redimensionar
      context.lineJoin = 'round'
      context.lineCap = 'round'
      context.lineWidth = 2
      context.strokeStyle = '#000'
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    
    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  // Função para iniciar o desenho
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!ctx) return
    
    setIsDrawing(true)
    
    // Obter as coordenadas iniciais
    const { x, y } = getCoordinates(e)
    setLastX(x)
    setLastY(y)
  }

  // Função para desenhar
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx) return
    
    // Prevenir scroll em dispositivos móveis
    e.preventDefault()
    
    // Obter as coordenadas atuais
    const { x, y } = getCoordinates(e)
    
    // Desenhar a linha
    ctx.beginPath()
    ctx.moveTo(lastX, lastY)
    ctx.lineTo(x, y)
    ctx.stroke()
    
    // Atualizar as coordenadas
    setLastX(x)
    setLastY(y)
    setHasSignature(true)
  }

  // Função para parar o desenho
  const stopDrawing = () => {
    setIsDrawing(false)
  }

  // Função para obter as coordenadas do mouse ou toque
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return { x: 0, y: 0 }
    
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    
    // Verificar se é um evento de toque ou mouse
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      }
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    }
  }

  // Função para limpar a assinatura
  const clearSignature = () => {
    if (!ctx || !canvasRef.current) return
    
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    setHasSignature(false)
  }

  // Função para salvar a assinatura
  const saveSignature = () => {
    if (!canvasRef.current || !hasSignature) return
    
    const signatureData = canvasRef.current.toDataURL('image/png')
    
    if (onSave) {
      onSave(signatureData)
    }
  }

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="border border-gray-300 rounded-md mb-2 bg-white" style={{ width, height }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={clearSignature}
          leftIcon={<Trash2 className="h-4 w-4" />}
        >
          Limpar
        </Button>
        <Button 
          type="button" 
          variant="primary" 
          size="sm"
          onClick={saveSignature}
          disabled={!hasSignature}
        >
          Confirmar Assinatura
        </Button>
      </div>
    </div>
  )
} 