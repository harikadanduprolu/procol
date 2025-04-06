import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Users, Folder } from 'lucide-react';

const Chat = () => {
  const [messageText, setMessageText] = useState('');
  
  // Mock data for chats - in a real app, this would come from a database
  const teamChats = [
    {
      id: 1,
      name: "UI/UX Design Team",
      avatar: "",
      lastMessage: "Let's meet tomorrow to discuss the new wireframes",
      timestamp: "2h ago",
      unread: 3,
      messages: [
        { id: 1, sender: "Jane Smith", content: "Hi everyone, I've uploaded the wireframes", timestamp: "Yesterday, 4:30 PM", isMine: false },
        { id: 2, sender: "Alex Wong", content: "They look great! I have some feedback on the navigation", timestamp: "Yesterday, 5:45 PM", isMine: false },
        { id: 3, sender: "You", content: "I'll review them tonight", timestamp: "Yesterday, 6:20 PM", isMine: true },
      ]
    },
    {
      id: 2,
      name: "Frontend Development",
      avatar: "",
      lastMessage: "Updated the component library",
      timestamp: "1d ago",
      unread: 0,
      messages: [
        { id: 1, sender: "David Lee", content: "I've pushed the new component updates", timestamp: "Monday, 10:15 AM", isMine: false },
        { id: 2, sender: "You", content: "Great work! The buttons look much better now", timestamp: "Monday, 11:30 AM", isMine: true },
      ]
    },
  ];
  
  const projectChats = [
    {
      id: 1,
      name: "Campus Navigation App",
      avatar: "",
      lastMessage: "The API integration is complete",
      timestamp: "3h ago",
      unread: 5,
      messages: [
        { id: 1, sender: "Project Lead", content: "Team, we're on track for the demo next week", timestamp: "Today, 9:00 AM", isMine: false },
        { id: 2, sender: "Backend Dev", content: "API endpoints are now documented", timestamp: "Today, 11:30 AM", isMine: false },
        { id: 3, sender: "You", content: "I'll start integrating them today", timestamp: "Today, 12:15 PM", isMine: true },
      ]
    },
    {
      id: 2,
      name: "Sustainable Energy Project",
      avatar: "",
      lastMessage: "Research findings attached",
      timestamp: "2d ago",
      unread: 0,
      messages: [
        { id: 1, sender: "Research Lead", content: "Here are the latest findings from our survey", timestamp: "Monday, 3:45 PM", isMine: false },
        { id: 2, sender: "You", content: "This is great data, it will help with our projections", timestamp: "Monday, 4:30 PM", isMine: true },
      ]
    },
  ];

  const [activeChat, setActiveChat] = useState(teamChats[0]);
  const [chatType, setChatType] = useState('teams');

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    // In a real app, this would send the message to a backend
    console.log("Sending message:", messageText);
    
    // For demo purposes, we'll add the message to the current chat
    const newMessage = {
      id: activeChat.messages.length + 1,
      sender: "You",
      content: messageText,
      timestamp: "Just now",
      isMine: true
    };
    
    // Update the active chat
    setActiveChat({
      ...activeChat,
      messages: [...activeChat.messages, newMessage]
    });
    
    // Clear the input
    setMessageText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectChat = (chat: any) => {
    setActiveChat(chat);
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      
      <div className="flex-1 flex flex-col container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-bold gradient-text mb-6">Messages</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-16rem)] relative">
          {/* Chat List */}
          <div className="lg:col-span-1 overflow-hidden relative z-10">
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
                          className={`p-4 cursor-pointer hover:bg-accent/50 transition-colors ${activeChat.id === chat.id && chatType === 'teams' ? 'bg-accent' : ''}`}
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
                                <span className="text-xs text-muted-foreground whitespace-nowrap">{chat.timestamp}</span>
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
                          className={`p-4 cursor-pointer hover:bg-accent/50 transition-colors ${activeChat.id === chat.id && chatType === 'projects' ? 'bg-accent' : ''}`}
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
                                <span className="text-xs text-muted-foreground whitespace-nowrap">{chat.timestamp}</span>
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
                      {activeChat.messages.map(message => (
                        <div key={message.id} className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] rounded-lg p-3 ${message.isMine 
                            ? 'bg-neon-purple/20 text-white ml-auto' 
                            : 'bg-zinc-800/50 text-foreground'}`}
                          >
                            {!message.isMine && (
                              <div className="font-medium text-sm mb-1">{message.sender}</div>
                            )}
                            <div>{message.content}</div>
                            <div className="text-xs opacity-70 mt-1 text-right">{message.timestamp}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Message Input */}
                    <div className="p-4 border-t border-zinc-800 relative z-20">
                      <div className="flex gap-2">
                        <Textarea 
                          placeholder="Type your message..." 
                          className="min-h-[60px]"
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyDown={handleKeyDown}
                        />
                        <Button 
                          className="bg-neon-purple hover:bg-neon-purple/80" 
                          size="icon"
                          onClick={handleSendMessage}
                          disabled={!messageText.trim()}
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
