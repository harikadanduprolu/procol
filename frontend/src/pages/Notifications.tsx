
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Check, X, Bell, MessageSquare, Users, Folder } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const Notifications = () => {
  // Mock notifications data - would come from a backend in a real app
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'team_invite',
      status: 'pending',
      title: 'Team Invitation',
      message: 'You have been invited to join the UI/UX Design Team',
      timestamp: 'Just now',
      team: 'UI/UX Design Team',
      sender: 'Jane Smith'
    },
    {
      id: 2,
      type: 'project_invite',
      status: 'pending',
      title: 'Project Collaboration',
      message: 'You have been invited to collaborate on the Campus Navigation App project',
      timestamp: '2 hours ago',
      project: 'Campus Navigation App',
      sender: 'Alex Wong'
    },
    {
      id: 3,
      type: 'message',
      status: 'read',
      title: 'New Message',
      message: 'You have a new message in the Frontend Development team chat',
      timestamp: 'Yesterday',
      team: 'Frontend Development'
    },
    {
      id: 4,
      type: 'project_application',
      status: 'approved',
      title: 'Application Approved',
      message: 'Your application to join the Sustainable Energy Project has been approved',
      timestamp: '2 days ago',
      project: 'Sustainable Energy Project'
    },
    {
      id: 5,
      type: 'team_application',
      status: 'rejected',
      title: 'Application Rejected',
      message: 'Your application to join the Blockchain Research Team has been declined',
      timestamp: '3 days ago',
      team: 'Blockchain Research Team',
      reason: 'The team is currently at capacity'
    }
  ]);

  const handleAction = (id: number, action: string) => {
    // Update notification status based on action
    setNotifications(notifications.map(notification => 
      notification.id === id 
        ? { ...notification, status: action === 'accept' ? 'approved' : 'rejected' } 
        : notification
    ));
  };

  // Filter notifications by status
  const pendingNotifications = notifications.filter(n => n.status === 'pending');
  const approvedNotifications = notifications.filter(n => n.status === 'approved');
  const rejectedNotifications = notifications.filter(n => n.status === 'rejected');
  const allNotifications = [...pendingNotifications, ...approvedNotifications, ...rejectedNotifications];

  // Notification card component
  const NotificationCard = ({ notification }: { notification: any }) => {
    let icon = <Bell className="h-8 w-8 text-neon-blue" />;
    
    if (notification.type === 'message') {
      icon = <MessageSquare className="h-8 w-8 text-neon-purple" />;
    } else if (notification.type.includes('team')) {
      icon = <Users className="h-8 w-8 text-neon-green" />;
    } else if (notification.type.includes('project')) {
      icon = <Folder className="h-8 w-8 text-neon-pink" />;
    }

    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 p-2 bg-background rounded-full">
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{notification.title}</h3>
                <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
              </div>
              <p className="text-sm text-muted-foreground my-1">{notification.message}</p>
              
              {notification.status === 'approved' && (
                <Alert className="mt-2 bg-green-500/10 border-green-500/30">
                  <Check className="h-4 w-4 text-green-500" />
                  <AlertTitle>Approved</AlertTitle>
                  <AlertDescription>
                    {notification.type.includes('team') 
                      ? `You are now a member of ${notification.team}` 
                      : `You are now part of the ${notification.project} project`}
                  </AlertDescription>
                </Alert>
              )}
              
              {notification.status === 'rejected' && (
                <Alert className="mt-2 bg-red-500/10 border-red-500/30">
                  <X className="h-4 w-4 text-red-500" />
                  <AlertTitle>Declined</AlertTitle>
                  <AlertDescription>
                    {notification.reason || "Your request was not approved at this time."}
                  </AlertDescription>
                </Alert>
              )}
              
              {notification.status === 'pending' && (notification.type === 'team_invite' || notification.type === 'project_invite') && (
                <div className="flex gap-2 mt-3">
                  <Button 
                    className="bg-green-500 hover:bg-green-600 text-white" 
                    size="sm"
                    onClick={() => handleAction(notification.id, 'accept')}
                  >
                    <Check className="mr-1 h-4 w-4" /> Accept
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-red-500 text-red-500 hover:bg-red-500/10" 
                    size="sm"
                    onClick={() => handleAction(notification.id, 'reject')}
                  >
                    <X className="mr-1 h-4 w-4" /> Decline
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-surface-dark flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 pt-24 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold gradient-text">Notifications</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">You have {pendingNotifications.length} pending notifications</span>
          </div>
        </div>
        
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="all">
              All ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({pendingNotifications.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({approvedNotifications.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Declined ({rejectedNotifications.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {allNotifications.length > 0 ? (
              allNotifications.map(notification => (
                <NotificationCard key={notification.id} notification={notification} />
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No notifications</p>
            )}
          </TabsContent>
          
          <TabsContent value="pending">
            {pendingNotifications.length > 0 ? (
              pendingNotifications.map(notification => (
                <NotificationCard key={notification.id} notification={notification} />
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No pending notifications</p>
            )}
          </TabsContent>
          
          <TabsContent value="approved">
            {approvedNotifications.length > 0 ? (
              approvedNotifications.map(notification => (
                <NotificationCard key={notification.id} notification={notification} />
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No approved notifications</p>
            )}
          </TabsContent>
          
          <TabsContent value="rejected">
            {rejectedNotifications.length > 0 ? (
              rejectedNotifications.map(notification => (
                <NotificationCard key={notification.id} notification={notification} />
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No declined notifications</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default Notifications;
