import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import socketService, { Message, Notification } from '../services/socket';

// Define the shape of the context
interface SocketContextType {
  isConnected: boolean;
  messages: Message[];
  notifications: Notification[];
  connectSocket: () => void;
  disconnectSocket: () => void;
  sendMessage: (recipientId: string, content: string) => boolean;
  sendNotification: (
    recipientId: string,
    type: Notification['type'],
    title: string,
    description: string,
    entityId?: string
  ) => boolean;
  clearMessages: () => void;
  clearNotifications: () => void;
}

// Create the context with default values
const SocketContext = createContext<SocketContextType>({
  isConnected: false,
  messages: [],
  notifications: [],
  connectSocket: () => {},
  disconnectSocket: () => {},
  sendMessage: () => false,
  sendNotification: () => false,
  clearMessages: () => {},
  clearNotifications: () => {},
});

// Props for the provider component
interface SocketProviderProps {
  children: ReactNode;
}

// Provider component
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  // State for managing connection status, messages, and notifications
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Function to connect the socket
  const connectSocket = () => {
    socketService.initialize();
  };

  // Function to disconnect the socket
  const disconnectSocket = () => {
    socketService.disconnect();
  };

  // Function to send a message
  const sendMessage = (recipientId: string, content: string): boolean => {
    return socketService.sendMessage(recipientId, content);
  };

  // Function to send a notification
  const sendNotification = (
    recipientId: string,
    type: Notification['type'],
    title: string,
    description: string,
    entityId?: string
  ): boolean => {
    return socketService.sendNotification(recipientId, type, title, description, entityId);
  };

  // Function to clear messages
  const clearMessages = () => {
    setMessages([]);
  };

  // Function to clear notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  // Set up event listeners when the component mounts
  useEffect(() => {
    // Connection status listener
    const connectionStatusUnsubscribe = socketService.addConnectionStatusListener(
      (status: boolean) => {
        setIsConnected(status);
      }
    );

    // Message listener
    const messageUnsubscribe = socketService.addMessageListener((message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Notification listener
    const notificationUnsubscribe = socketService.addNotificationListener(
      (notification: Notification) => {
        setNotifications((prevNotifications) => [...prevNotifications, notification]);
      }
    );

    // Check if user is authenticated and connect socket
    const token = localStorage.getItem('token');
    if (token) {
      connectSocket();
    }

    // Clean up listeners when the component unmounts
    return () => {
      connectionStatusUnsubscribe();
      messageUnsubscribe();
      notificationUnsubscribe();
      disconnectSocket();
    };
  }, []);

  // Authentication state change listener
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'token') {
        if (event.newValue) {
          // Token added - connect socket
          connectSocket();
        } else {
          // Token removed - disconnect socket
          disconnectSocket();
          clearMessages();
          clearNotifications();
        }
      }
    };

    // Listen for changes to localStorage (login/logout events)
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Provide the context value
  const contextValue: SocketContextType = {
    isConnected,
    messages,
    notifications,
    connectSocket,
    disconnectSocket,
    sendMessage,
    sendNotification,
    clearMessages,
    clearNotifications,
  };

  return <SocketContext.Provider value={contextValue}>{children}</SocketContext.Provider>;
};

// Custom hook for using the socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

// Hook for accessing only messages
export const useMessages = () => {
  return useSocket();
};

// Hook for accessing only notifications
export const useNotifications = () => {
  return (({ notifications, sendNotification, clearNotifications }) => ({
    notifications,
    sendNotification,
    clearNotifications,
  }))(useSocket());
};

// Hook for checking connection status
export const useSocketConnection = () => {
  return (({ isConnected, connectSocket, disconnectSocket }) => ({
    isConnected,
    connectSocket,
    disconnectSocket,
  }))(useSocket());
};

export default SocketContext;

