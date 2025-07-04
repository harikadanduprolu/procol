import { io, Socket } from 'socket.io-client';

// Types for messages and notifications
export interface Message {
  id?: string;
  sender: string;
  recipient: string;
  content: string;
  timestamp?: Date;
  read?: boolean;
}

export interface Notification {
  id?: string;
  recipient: string;
  type: 'project' | 'team' | 'funding' | 'message' | 'system';
  title: string;
  description: string;
  entityId?: string;
  timestamp?: Date;
  read?: boolean;
}

// Socket events
export type SocketEvents = {
  join: (userId: string) => void;
  message: (message: Omit<Message, 'id' | 'timestamp' | 'read'>) => void;
  notification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  disconnect: () => void;
};

// Socket response events
export type SocketResponseEvents = {
  connect: () => void;
  disconnect: () => void;
  connect_error: (error: Error) => void;
  newMessage: (message: Message) => void;
  newNotification: (notification: Notification) => void;
};

class SocketService {
  private socket: Socket<SocketResponseEvents, SocketEvents> | null = null;
  private connected = false;
  private messageListeners: ((message: Message) => void)[] = [];
  private notificationListeners: ((notification: Notification) => void)[] = [];
  private connectionStatusListeners: ((status: boolean) => void)[] = [];

  // Initialize the socket connection
  initialize() {
    // Get the base URL from environment variables, or use default
    const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://procol-backend.onrender.com';

    // Get the auth token from localStorage
    const token = localStorage.getItem('token');

    // Close existing connection if any
    this.disconnect();

    // Create a new Socket.IO connection with auth token
    this.socket = io(SOCKET_URL, {
      auth: token ? { token } : undefined,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Set up event listeners
    this.setupEventListeners();

    return this;
  }

  private setupEventListeners() {
    if (!this.socket) {
      return;
    }

    // Connection events
    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
      this.connected = true;
      this.notifyConnectionStatusListeners(true);
      
      // Join the user's room for receiving messages and notifications
      const userId = this.getUserIdFromToken();
      if (userId) {
        this.joinRoom(userId);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.connected = false;
      this.notifyConnectionStatusListeners(false);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.connected = false;
      this.notifyConnectionStatusListeners(false);
    });

    // Message and notification events
    this.socket.on('newMessage', (message) => {
      console.log('New message received:', message);
      this.notifyMessageListeners(message);
    });

    this.socket.on('newNotification', (notification) => {
      console.log('New notification received:', notification);
      this.notifyNotificationListeners(notification);
    });
  }

  // Get user ID from JWT token
  private getUserIdFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    try {
      // Parse the JWT token payload
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id || payload.userId || payload.sub;
    } catch (error) {
      console.error('Error parsing JWT token:', error);
      return null;
    }
  }

  // Join a room for private messaging
  joinRoom(userId: string) {
    if (this.socket && this.connected) {
      this.socket.emit('join', userId);
      console.log(`Joined room: ${userId}`);
    }
  }

  // Send a message
  sendMessage(recipientId: string, content: string) {
    const userId = this.getUserIdFromToken();
    if (!userId || !this.socket || !this.connected) {
      console.error('Cannot send message: not connected or not authenticated');
      return false;
    }

    const message: Omit<Message, 'id' | 'timestamp' | 'read'> = {
      sender: userId,
      recipient: recipientId,
      content
    };

    this.socket.emit('message', message);
    return true;
  }

  // Send a notification
  sendNotification(
    recipientId: string, 
    type: Notification['type'], 
    title: string, 
    description: string, 
    entityId?: string
  ) {
    if (!this.socket || !this.connected) {
      console.error('Cannot send notification: not connected');
      return false;
    }

    const notification: Omit<Notification, 'id' | 'timestamp' | 'read'> = {
      recipient: recipientId,
      type,
      title,
      description,
      entityId
    };

    this.socket.emit('notification', notification);
    return true;
  }

  // Disconnect the socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  // Check if socket is connected
  isConnected() {
    return this.connected;
  }

  // Add a message listener
  addMessageListener(callback: (message: Message) => void) {
    this.messageListeners.push(callback);
    return () => this.removeMessageListener(callback);
  }

  // Remove a message listener
  removeMessageListener(callback: (message: Message) => void) {
    this.messageListeners = this.messageListeners.filter(listener => listener !== callback);
  }

  // Notify all message listeners
  private notifyMessageListeners(message: Message) {
    this.messageListeners.forEach(listener => listener(message));
  }

  // Add a notification listener
  addNotificationListener(callback: (notification: Notification) => void) {
    this.notificationListeners.push(callback);
    return () => this.removeNotificationListener(callback);
  }

  // Remove a notification listener
  removeNotificationListener(callback: (notification: Notification) => void) {
    this.notificationListeners = this.notificationListeners.filter(listener => listener !== callback);
  }

  // Notify all notification listeners
  private notifyNotificationListeners(notification: Notification) {
    this.notificationListeners.forEach(listener => listener(notification));
  }

  // Add a connection status listener
  addConnectionStatusListener(callback: (status: boolean) => void) {
    this.connectionStatusListeners.push(callback);
    return () => this.removeConnectionStatusListener(callback);
  }

  // Remove a connection status listener
  removeConnectionStatusListener(callback: (status: boolean) => void) {
    this.connectionStatusListeners = this.connectionStatusListeners.filter(listener => listener !== callback);
  }

  // Notify all connection status listeners
  private notifyConnectionStatusListeners(status: boolean) {
    this.connectionStatusListeners.forEach(listener => listener(status));
  }
}

// Create and export a singleton instance
const socketService = new SocketService();
export default socketService;

