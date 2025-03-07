'use client'

// Interface para os dados do motorista
interface DriverData {
  id: string;
  name: string;
  phone?: string;
  email?: string;
}

// Interface para os dados da entrega
interface DeliveryData {
  id: string;
  cliente: string;
  endereco: string;
  numeroPedido?: string;
  data?: string;
  horario?: string;
}

// Interface para os tipos de notificação
type NotificationType = 'nova-entrega' | 'cancelamento' | 'alteracao' | 'info';

// Interface para as opções de notificação
interface NotificationOptions {
  title: string;
  message: string;
  type: NotificationType;
  data?: any;
}

class NotificationService {
  private static instance: NotificationService;
  private listeners: Map<string, Function[]> = new Map();
  private notificationHistory: Map<string, NotificationOptions[]> = new Map();
  private isClient: boolean = false;

  constructor() {
    this.isClient = typeof window !== 'undefined';
  }

  // Padrão Singleton
  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Método para enviar notificação para um motorista
  public async notifyDriver(
    driver: DriverData,
    delivery: DeliveryData,
    options?: Partial<NotificationOptions>
  ): Promise<boolean> {
    if (!this.isClient) return false;

    try {
      const notificationOptions: NotificationOptions = {
        title: options?.title || `Nova entrega atribuída`,
        message: options?.message || `Você recebeu uma nova entrega para ${delivery.cliente}`,
        type: options?.type || 'nova-entrega',
        data: {
          delivery,
          driver,
          timestamp: new Date().toISOString(),
          ...options?.data
        }
      };

      // Armazenar notificação no histórico
      if (!this.notificationHistory.has(driver.id)) {
        this.notificationHistory.set(driver.id, []);
      }
      this.notificationHistory.get(driver.id)?.push(notificationOptions);

      // Disparar evento para os listeners
      this.triggerEvent(driver.id, notificationOptions);

      // Simular envio de notificação push (em um ambiente real, usaria Web Push API)
      this.simulatePushNotification(driver, notificationOptions);

      console.log(`Notificação enviada para ${driver.name}:`, notificationOptions);
      return true;
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      return false;
    }
  }

  // Método para adicionar um listener para notificações de um motorista específico
  public addListener(driverId: string, callback: Function): void {
    if (!this.listeners.has(driverId)) {
      this.listeners.set(driverId, []);
    }
    this.listeners.get(driverId)?.push(callback);
  }

  // Método para remover um listener
  public removeListener(driverId: string, callback: Function): void {
    if (!this.listeners.has(driverId)) return;
    
    const listeners = this.listeners.get(driverId);
    if (!listeners) return;
    
    const index = listeners.indexOf(callback);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  }

  // Método para disparar evento para os listeners
  private triggerEvent(driverId: string, data: any): void {
    const listeners = this.listeners.get(driverId);
    if (!listeners) return;
    
    listeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Erro ao executar callback de notificação:', error);
      }
    });
  }

  // Método para obter o histórico de notificações de um motorista
  public getNotificationHistory(driverId: string): NotificationOptions[] {
    return this.notificationHistory.get(driverId) || [];
  }

  // Método para limpar o histórico de notificações de um motorista
  public clearNotificationHistory(driverId: string): void {
    this.notificationHistory.delete(driverId);
  }

  // Método para simular o envio de uma notificação push
  private simulatePushNotification(driver: DriverData, options: NotificationOptions): void {
    if (!this.isClient) return;
    
    // Verificar se o navegador suporta notificações
    if ('Notification' in window) {
      // Verificar se o usuário já concedeu permissão
      if (Notification.permission === 'granted') {
        this.showNotification(options.title, options.message);
      } 
      // Caso contrário, pedir permissão
      else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            this.showNotification(options.title, options.message);
          }
        });
      }
    }
  }

  // Método para mostrar uma notificação
  private showNotification(title: string, body: string): void {
    const notification = new Notification(title, {
      body,
      icon: '/icons/delivery-icon.png'
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
}

export default NotificationService.getInstance(); 