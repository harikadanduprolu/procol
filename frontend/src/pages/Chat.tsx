import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Users, Folder, CheckCheck, Check, Clock, AlertCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { useSocket } from '@/contexts/SocketContext';
import { messageApi, authApi } from '@/services/api';
import { Message as MessageType } from '@/services/socket';
import { format, isToday, isYesterday } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

interface ChatUser {
  id?: string;
  _id: string;
  name: string;
  avatar?: string;
  online?: boolean;
  lastSeen?: Date;
}

interface ChatMessage extends MessageType {
  isMine?: boolean;
  senderName?: string;
}

interface ChatConversation {
  id: string;
  name: string;
  avatar?: string;
  type: 'team' | 'project' | 'direct';
  lastMessage?: string;
  timestamp?: Date;
  unread: number;
  participants?: ChatUser[];
  messages: ChatMessage[];
  isTyping?: boolean;
}

const Chat = () => {
  const { toast } = useToast();
  const { isConnected, messages: socketMessages, sendMessage } = useSocket();
  const { user: authUser } = useAuth();
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');

  const [teamChats, setTeamChats] = useState<ChatConversation[]>([]);
  const [projectChats, setProjectChats] = useState<ChatConversation[]>([]);
  const [activeChat, setActiveChat] = useState<ChatConversation | null>(null);
  const [chatType, setChatType] = useState('teams');
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [userResults, setUserResults] = useState<ChatUser[]>([]);
  const [searchingUsers, setSearchingUsers] = useState(false);

  const formatTimestamp = (date: Date): string => {
    if (isToday(date)) {
      return format(date, 'h:mm a');
    }
    if (isYesterday(date)) {
      return 'Yesterday, ' + format(date, 'h:mm a');
    }
    return format(date, 'MMM d, h:mm a');
  };

  useEffect(() => {
    const fetchConversations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await messageApi.getConversations();
        const conversations = response.data;
        const teams: ChatConversation[] = [];
        const projects: ChatConversation[] = [];

        conversations.forEach((convo: any) => {
          const formatted: ChatConversation = {
            id: convo._id,
            name: convo.name,
            avatar: convo.avatar,
            type: convo.type,
            lastMessage: convo.lastMessage?.content,
            timestamp: convo.lastMessage?.timestamp ? new Date(convo.lastMessage.timestamp) : undefined,
            unread: convo.unreadCount || 0,
            participants: convo.participants,
            messages: [],
            isTyping: false
          };
          convo.type === 'team' ? teams.push(formatted) : convo.type === 'project' && projects.push(formatted);
        });

        setTeamChats(teams);
        setProjectChats(projects);
        if (teams.length) {
          setActiveChat(teams[0]);
          loadMessages(teams[0].id);
        } else if (projects.length) {
          setActiveChat(projects[0]);
          setChatType('projects');
          loadMessages(projects[0].id);
        }
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError('Failed to load conversations. Please try again.');
        toast({ title: "Error", description: "Failed to load conversations.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    if (socketMessages.length && activeChat) {
      const lastMessage = socketMessages[socketMessages.length - 1];
      const isForCurrentChat = lastMessage.recipient === activeChat.id || lastMessage.sender === activeChat.id;
      if (isForCurrentChat) {
        setActiveChat(prev => prev ? { ...prev, messages: [...prev.messages, { ...lastMessage, isMine: false }], lastMessage: lastMessage.content, timestamp: lastMessage.timestamp as Date, isTyping: false } : prev);
        markMessageAsRead(lastMessage.sender);
      } else {
        updateUnreadCount(lastMessage);
      }
    }
  }, [socketMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  const loadMessages = async (conversationId: string) => {
    if (!conversationId) {
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await messageApi.getMessages(conversationId);
      const messages: ChatMessage[] = response.data.map((msg: any) => ({
        id: msg._id,
        sender: msg.sender._id,
        senderName: msg.sender.name,
        recipient: msg.recipient,
        content: msg.content,
        timestamp: new Date(msg.timestamp),
        read: msg.read,
        isMine: authUser && msg.sender._id === authUser._id
      }));
      if (activeChat) {
        setActiveChat(prev => prev ? { ...prev, messages, unread: 0 } : prev);
      }
      markMessageAsRead(conversationId);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages.');
      toast({ title: "Error", description: "Failed to load messages.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const markMessageAsRead = async (conversationId: string) => {
    try {
      await messageApi.markAsRead(conversationId);
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  };

  const updateUnreadCount = (message: MessageType) => {
    const updateChats = (chats: ChatConversation[]) => chats.map(chat => (chat.id === message.sender || chat.id === message.recipient) ? { ...chat, unread: chat.unread + 1, lastMessage: message.content, timestamp: message.timestamp as Date } : chat);
    setTeamChats(prev => updateChats(prev));
    setProjectChats(prev => updateChats(prev));
  };

  const handleTyping = () => {
    if (!activeChat || !isConnected) {
      return;
    }
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    const timeout = setTimeout(() => {}, 2000);
    setTypingTimeout(timeout);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !activeChat || !isConnected || !authUser) {
      return;
    }
    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: authUser._id,
      senderName: authUser.name,
      recipient: activeChat.id,
      content: messageText,
      timestamp: new Date(),
      read: false,
      isMine: true
    };

    const success = sendMessage(activeChat.id, messageText);
    if (success) {
      setActiveChat(prev => prev ? { ...prev, messages: [...prev.messages, newMessage], lastMessage: messageText, timestamp: new Date() } : prev);
      try {
        if (activeChat.type === 'team') {
          await messageApi.sendTeamMessage(activeChat.id, messageText);
        } else if (activeChat.type === 'project') {
          await messageApi.sendProjectMessage(activeChat.id, messageText);
        } else {
          await messageApi.sendMessage({ recipientId: activeChat.id, content: messageText });
        }
      } catch (err) {
        console.error('Error saving message:', err);
        toast({ title: "Warning", description: "Message sent but may not be saved.", variant: "destructive" });
      }
      setMessageText('');
    } else {
      toast({ title: "Error", description: "Failed to send message.", variant: "destructive" });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else {
      handleTyping();
    }
  };

  const selectChat = (chat: ChatConversation) => {
    if (activeChat?.id !== chat.id) {
      setActiveChat(chat);
      loadMessages(chat.id);
    }
  };

  // User search handler
  const handleUserSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    if (e.target.value.length > 1) {
      setSearchingUsers(true);
      try {
        const res = await authApi.searchUsers(e.target.value);
        setUserResults(res.data.users || []);
      } catch (err) {
        setUserResults([]);
      } finally {
        setSearchingUsers(false);
      }
    } else {
      setUserResults([]);
    }
  };

  const startDirectChat = async (userId: string) => {
    try {
      const res = await messageApi.createConversation({ userId });
      const convo = res.data.conversation;
      setActiveChat({
        id: convo._id,
        name: convo.name,
        avatar: convo.avatar,
        type: 'direct',
        lastMessage: convo.lastMessage?.content,
        timestamp: convo.lastMessage?.timestamp ? new Date(convo.lastMessage.timestamp) : undefined,
        unread: 0,
        participants: convo.participants,
        messages: [],
        isTyping: false
      });
      loadMessages(convo._id);
      setUserResults([]);
      setSearchText('');
    } catch (err) {
      toast({ title: 'Error', description: 'Could not start chat', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <div className="flex-1 flex flex-col container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-bold gradient-text mb-6">Messages</h1>

        <Input
          type="text"
          placeholder="Search users or chats..."
          value={searchText}
          onChange={handleUserSearch}
          className="mb-4 w-full"
        />

        {searchingUsers && <div className="mb-2 text-content-secondary">Searching users...</div>}
        {userResults.length > 0 && (
          <ul className="mb-4 bg-zinc-900 rounded shadow p-2 max-h-60 overflow-y-auto">
            {userResults.map(user => (
              <li
                key={user._id}
                className="p-2 hover:bg-zinc-800 cursor-pointer rounded flex items-center gap-2"
                onClick={() => startDirectChat(user._id)}
              >
                <Avatar className="h-6 w-6">
                  {user.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : <AvatarFallback>{user.name.slice(0,2).toUpperCase()}</AvatarFallback>}
                </Avatar>
                <span>{user.name}</span>
              </li>
            ))}
          </ul>
        )}
<div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-16rem)] relative">
          {/* Loading State */}
          {isLoading && !activeChat && (
            <div className="col-span-1 lg:col-span-4 flex items-center justify-center h-[calc(100vh-20rem)]">
              <div className="flex flex-col items-center">
                <Spinner size="lg" />
                <p className="mt-4 text-muted-foreground">Loading conversations...</p>
              </div>
            </div>
          )}
          
          {/* Error State */}
          {error && !isLoading && !activeChat && (
            <div className="col-span-1 lg:col-span-4 flex items-center justify-center h-[calc(100vh-20rem)]">
              <div className="flex flex-col items-center text-center">
                <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                <h3 className="text-xl font-medium mb-2">Error Loading Conversations</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            </div>
          )}
          
          {/* Connection Status */}
          {!isConnected && (
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-yellow-900/80 text-yellow-200 py-2 px-4 rounded-md flex items-center gap-2 z-50">
              <AlertCircle className="h-4 w-4" />
              <span>You are offline. Messages won't be sent in real-time.</span>
            </div>
          )}
          
          {/* Chat List */}
          <div className={`lg:col-span-1 overflow-hidden relative z-10 ${(isLoading && !activeChat) || (error && !activeChat) ? 'hidden' : ''}`}>
            <Tabs defaultValue="teams" className="w-full h-full flex flex-col" onValueChange={setChatType}>
              <TabsList className="w-full mb-4">
                <TabsTrigger value="teams" className="flex-1"><Users className="mr-2 h-4 w-4" /> Teams</TabsTrigger>
                <TabsTrigger value="projects" className="flex-1"><Folder className="mr-2 h-4 w-4" /> Projects</TabsTrigger>
              </TabsList>
              
              <TabsContent value="teams" className="mt-0 flex-1 overflow-hidden">
                <Card className="h-full bg-zinc-900/50 border-zinc-800">
                  <CardContent className="p-0 h-full overflow-y-auto">
                    <div className="divide-y divide-border">
                      {teamChats.map(chat => (
                        <div 
                          key={chat.id}
                          className={`p-4 cursor-pointer hover:bg-accent/50 transition-colors ${activeChat?.id === chat.id && chatType === 'teams' ? 'bg-accent' : ''}`}
                          onClick={() => {
                            selectChat(chat);
                            setChatType('teams');
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-neon-purple/20 text-neon-purple">
                                {chat.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center">
                                <h3 className="font-medium truncate">{chat.name}</h3>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">{chat.timestamp ? formatTimestamp(chat.timestamp) : ''}</span>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                            </div>
                            {chat.unread > 0 && (
                              <span className="rounded-full bg-neon-purple text-white text-xs px-2 py-1 min-w-[1.5rem] text-center">
                                {chat.unread}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="projects" className="mt-0 flex-1 overflow-hidden">
                <Card className="h-full bg-zinc-900/50 border-zinc-800">
                  <CardContent className="p-0 h-full overflow-y-auto">
                    <div className="divide-y divide-border">
                      {projectChats.map(chat => (
                        <div 
                          key={chat.id}
                          className={`p-4 cursor-pointer hover:bg-accent/50 transition-colors ${activeChat?.id === chat.id && chatType === 'projects' ? 'bg-accent' : ''}`}
                          onClick={() => {
                            selectChat(chat);
                            setChatType('projects');
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-neon-blue/20 text-neon-blue">
                                {chat.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center">
                                <h3 className="font-medium truncate">{chat.name}</h3>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">{chat.timestamp ? formatTimestamp(chat.timestamp) : ''}</span>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                            </div>
                            {chat.unread > 0 && (
                              <span className="rounded-full bg-neon-blue text-white text-xs px-2 py-1 min-w-[1.5rem] text-center">
                                {chat.unread}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Chat Messages */}
          <div className="lg:col-span-3 flex flex-col relative z-10">
            <Card className="h-full flex flex-col bg-zinc-900/50 border-zinc-800">
              <CardContent className="flex flex-col h-full p-0">
                {activeChat ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-zinc-800 flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className={chatType === 'teams' ? 'bg-neon-purple/20 text-neon-purple' : 'bg-neon-blue/20 text-neon-blue'}>
                          {activeChat.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{activeChat.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {chatType === 'teams' ? 'Team Chat' : 'Project Chat'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-24rem)]">
                      {isLoading && (
                        <div className="flex justify-center py-8">
                          <Spinner />
                        </div>
                      )}
                      
                      {!isLoading && activeChat.messages.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>No messages yet. Start the conversation!</p>
                        </div>
                      )}
                      
                      {(activeChat.messages as ChatMessage[]).map(message => (
                        <div key={message.id} className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] rounded-lg p-3 ${message.isMine 
                            ? 'bg-neon-purple/20 text-white ml-auto' 
                            : 'bg-zinc-800/50 text-foreground'}`}
                          >
                            {!message.isMine && (
                              <div className="font-medium text-sm mb-1">{message.senderName || message.sender}</div>
                            )}
                            <div>{message.content}</div>
                            <div className="flex items-center justify-end gap-1 text-xs opacity-70 mt-1">
                              {message.timestamp instanceof Date 
                                ? formatTimestamp(message.timestamp) 
                                : typeof message.timestamp === 'string' 
                                  ? message.timestamp
                                  : 'Just now'
                              }
                              
                              {message.isMine && (
                                <span className="ml-1">
                                  {message.read ? (
                                    <CheckCheck className="h-3 w-3 text-neon-purple" />
                                  ) : (
                                    <Check className="h-3 w-3" />
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Typing indicator */}
                      {activeChat.isTyping && (
                        <div className="flex justify-start">
                          <div className="rounded-lg p-3 bg-zinc-800/30 text-foreground max-w-[70%]">
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Invisible element for auto-scroll */}
                      <div ref={messagesEndRef} />
                    </div>
                    
                    {/* Message Input */}
                    <div className="p-4 border-t border-zinc-800 relative z-20">
                      <div className="flex gap-2">
                        <Textarea 
                          placeholder={isConnected ? "Type your message..." : "Connect to send messages"}
                          className="min-h-[60px]"
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          disabled={!isConnected}
                          onKeyDown={handleKeyDown}
                        />
                        <Button 
                          className="bg-neon-purple hover:bg-neon-purple/80" 
                          size="icon"
                          onClick={handleSendMessage}
                          disabled={!messageText.trim() || !isConnected}
                        >
                          <Send size={18} />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Select a chat to start messaging</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Chat;
