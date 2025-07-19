import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Users, Folder, CheckCheck, Check, AlertCircle, User } from 'lucide-react';
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
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userResults, setUserResults] = useState<ChatUser[]>([]);
  const [searchingUsers, setSearchingUsers] = useState(false);

  const formatTimestamp = (date: Date): string => {
    if (isToday(date)) return format(date, 'h:mm a');
    if (isYesterday(date)) return 'Yesterday, ' + format(date, 'h:mm a');
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

  const loadMessages = async (conversationId: string) => {
    if (!conversationId) return;
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
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages.');
      toast({ title: "Error", description: "Failed to load messages.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !activeChat || !isConnected || !authUser) return;
    
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
          await messageApi.sendMessage({
            senderId: authUser._id,
            recipientId: activeChat.id,
            content: messageText
          });
        }
      } catch (err) {
        console.error('Error saving message:', err);
      }
      setMessageText('');
    }
  };

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

  const selectChat = (chat: ChatConversation) => {
    if (activeChat?.id !== chat.id) {
      setActiveChat(chat);
      loadMessages(chat.id);
    }
  };

  const renderChatList = (chats: ChatConversation[], type: string) => (
    <div className="space-y-2">
      {chats.map(chat => (
        <div 
          key={chat.id}
          className={`p-3 cursor-pointer hover:bg-zinc-800/50 rounded-lg transition-colors ${
            activeChat?.id === chat.id ? 'bg-zinc-800' : ''
          }`}
          onClick={() => selectChat(chat)}
        >
          <div className="flex items-start gap-3">
            <Avatar>
              <AvatarFallback className={
                type === 'teams' 
                  ? 'bg-neon-purple/20 text-neon-purple' 
                  : 'bg-neon-blue/20 text-neon-blue'
              }>
                {chat.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <h3 className="font-medium truncate">{chat.name}</h3>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {chat.timestamp ? formatTimestamp(chat.timestamp) : ''}
                </span>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {chat.lastMessage || 'No messages yet'}
              </p>
            </div>
            {chat.unread > 0 && (
              <span className={`rounded-full text-white text-xs px-2 py-1 min-w-[1.5rem] text-center ${
                type === 'teams' ? 'bg-neon-purple' : 'bg-neon-blue'
              }`}>
                {chat.unread}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <div className="container mx-auto pt-24 pb-16 px-4">
        <h1 className="text-3xl font-bold gradient-text mb-6">Messages</h1>

        {/* Connection Status */}
        {!isConnected && (
          <div className="mb-4 bg-yellow-900/80 text-yellow-200 py-2 px-4 rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>You are offline. Messages won't be sent in real-time.</span>
          </div>
        )}

        {/* Top-level Tab Navigation */}
        <Tabs defaultValue="teams" onValueChange={setChatType} className="w-full">
          <TabsList className="mb-6 bg-zinc-800 p-1 rounded-lg max-w-md">
            <TabsTrigger value="users" className="flex-1 data-[state=active]:bg-neon-green/20">
              <User className="mr-2 h-4 w-4" /> All
            </TabsTrigger>
            <TabsTrigger value="teams" className="flex-1 data-[state=active]:bg-neon-purple/20">
              <Users className="mr-2 h-4 w-4" /> Teams
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex-1 data-[state=active]:bg-neon-blue/20">
              <Folder className="mr-2 h-4 w-4" /> Projects
            </TabsTrigger>
            <TabsTrigger value="users" className="flex-1 data-[state=active]:bg-neon-green/20">
              <User className="mr-2 h-4 w-4" /> Users
            </TabsTrigger>
          </TabsList>

          {/* Content Area - 2 Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-22rem)]">
            {/* Left Container: Search Bar + Chat List */}
            <div className="lg:col-span-1">
              <Card className="h-full bg-zinc-900/50 border-zinc-800 flex flex-col">
                <CardContent className="p-4 flex flex-col h-full">
                  {/* Search Bar */}
                  <div className="mb-4">
                    <Input
                      type="text"
                      placeholder="Search users or chats..."
                      value={searchText}
                      onChange={handleUserSearch}
                      className="w-full"
                    />
                    
                    {searchingUsers && (
                      <div className="mt-2 text-sm text-muted-foreground">Searching users...</div>
                    )}
                    
                    {userResults.length > 0 && (
                      <div className="mt-2 bg-zinc-800 rounded-lg p-2 max-h-40 overflow-y-auto">
                        <h3 className="text-sm font-semibold mb-2">Users</h3>
                        {userResults.map(user => (
                          <div
                            key={user._id}
                            className="p-2 hover:bg-zinc-700 cursor-pointer rounded flex items-center gap-2"
                            onClick={() => startDirectChat(user._id)}
                          >
                            <Avatar className="h-6 w-6">
                              {user.avatar ? (
                                <AvatarImage src={user.avatar} alt={user.name} />
                              ) : (
                                <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                              )}
                            </Avatar>
                            <span className="text-sm">{user.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Chat Lists */}
                  <div className="flex-1 overflow-hidden">
                    <TabsContent value="teams" className="mt-0 h-full overflow-y-auto">
                      {teamChats.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          No team chats found
                        </div>
                      ) : (
                        renderChatList(teamChats, 'teams')
                      )}
                    </TabsContent>

                    <TabsContent value="projects" className="mt-0 h-full overflow-y-auto">
                      {projectChats.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          No project chats found
                        </div>
                      ) : (
                        renderChatList(projectChats, 'projects')
                      )}
                    </TabsContent>

                    <TabsContent value="users" className="mt-0 h-full overflow-y-auto">
                      <div className="text-center py-8 text-muted-foreground">
                        Search for users above to start direct chats
                      </div>
                    </TabsContent>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Container: Chat Messages */}
            <div className="lg:col-span-2">
              <Card className="h-full flex flex-col bg-zinc-900/50 border-zinc-800">
                <CardContent className="flex flex-col h-full p-0">
                  {activeChat ? (
                    <>
                      {/* Chat Header */}
                      <div className="p-4 border-b border-zinc-800 flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className={
                            activeChat.type === 'team' 
                              ? 'bg-neon-purple/20 text-neon-purple' 
                              : 'bg-neon-blue/20 text-neon-blue'
                          }>
                            {activeChat.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{activeChat.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {activeChat.type === 'team' ? 'Team Chat' : 
                             activeChat.type === 'project' ? 'Project Chat' : 'Direct Chat'}
                          </p>
                        </div>
                      </div>
                      
                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                        
                        {activeChat.messages.map(message => (
                          <div key={message.id} className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] rounded-lg p-3 ${
                              message.isMine 
                                ? 'bg-neon-purple/20 text-white ml-auto' 
                                : 'bg-zinc-800/50 text-foreground'
                            }`}>
                              {!message.isMine && (
                                <div className="font-medium text-sm mb-1">{message.senderName || message.sender}</div>
                              )}
                              <div>{message.content}</div>
                              <div className="flex items-center justify-end gap-1 text-xs opacity-70 mt-1">
                                {message.timestamp instanceof Date 
                                  ? formatTimestamp(message.timestamp) 
                                  : 'Just now'}
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
                        <div ref={messagesEndRef} />
                      </div>
                      
                      {/* Message Input */}
                      <div className="p-4 border-t border-zinc-800">
                        <div className="flex gap-2">
                          <Textarea 
                            placeholder={isConnected ? "Type your message..." : "Connect to send messages"}
                            className="min-h-[60px] resize-none"
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            disabled={!isConnected}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
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
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Chat;
