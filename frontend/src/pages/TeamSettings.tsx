import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Settings, 
  Users, 
  Shield, 
  UserPlus, 
  UserMinus, 
  Crown, 
  Mail,
  ArrowLeft,
  Save,
  Trash2,
  Edit3
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const TeamSettings = () => {
  const { id } = useParams<{ id: string }>();
  const [currentUserRole, setCurrentUserRole] = useState<'admin' | 'member'>('admin');
  
  // Mock team data
  const team = {
    id: id || '1',
    name: "AI Campus Navigator Team",
    description: "Building an AI-powered system to help students navigate campus facilities and resources.",
    projectTitle: "AI-Powered Campus Navigator",
    createdAt: "2024-01-15",
    admin: {
      id: "1",
      name: "Alex Rivera",
      email: "alex.rivera@stanford.edu",
      avatar: ""
    },
    members: [
      {
        id: "2",
        name: "Mia Chen",
        email: "mia.chen@stanford.edu",
        role: "UX Designer",
        joinedAt: "2024-01-20",
        permissions: {
          canInvite: true,
          canManageProject: false,
          canViewAnalytics: true
        }
      },
      {
        id: "3",
        name: "Jordan Taylor",
        email: "jordan.taylor@stanford.edu",
        role: "Data Scientist",
        joinedAt: "2024-01-22",
        permissions: {
          canInvite: false,
          canManageProject: false,
          canViewAnalytics: true
        }
      }
    ],
    settings: {
      allowMembersToInvite: true,
      requireApprovalForNewMembers: true,
      allowMembersToLeave: true,
      publicTeam: false,
      enableNotifications: true
    }
  };

  const [teamSettings, setTeamSettings] = useState(team.settings);
  const [teamInfo, setTeamInfo] = useState({
    name: team.name,
    description: team.description
  });

  const handleSettingChange = (setting: string, value: boolean) => {
    setTeamSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleMemberPermissionChange = (memberId: string, permission: string, value: boolean) => {
    // Update member permissions logic here
    console.log(`Updating ${permission} for member ${memberId} to ${value}`);
  };

  const handleRemoveMember = (memberId: string) => {
    // Remove member logic here
    console.log(`Removing member ${memberId}`);
  };

  const isAdmin = currentUserRole === 'admin';

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <Link to="/teams" className="inline-flex items-center text-content-secondary hover:text-neon-blue mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Teams
          </Link>
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-content-primary mb-2">Team Settings</h1>
              <p className="text-content-secondary">{team.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-neon-purple/10 text-neon-purple border-neon-purple/30">
                {isAdmin ? 'Admin' : 'Member'}
              </Badge>
              {isAdmin && <Crown className="h-5 w-5 text-yellow-500" />}
            </div>
          </div>

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid grid-cols-4 bg-surface-dark/50">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="danger" disabled={!isAdmin}>Danger Zone</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card className="glass-card neon-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-neon-blue" />
                    Team Information
                  </CardTitle>
                  <CardDescription>
                    Basic information about your team
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Team Name</label>
                    <Input 
                      value={teamInfo.name}
                      onChange={(e) => setTeamInfo(prev => ({...prev, name: e.target.value}))}
                      disabled={!isAdmin}
                      className="bg-surface-dark/50 border-white/10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea 
                      value={teamInfo.description}
                      onChange={(e) => setTeamInfo(prev => ({...prev, description: e.target.value}))}
                      disabled={!isAdmin}
                      className="bg-surface-dark/50 border-white/10 min-h-[100px]"
                    />
                  </div>
                  {isAdmin && (
                    <Button className="bg-neon-blue hover:bg-neon-blue/80">
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card className="glass-card neon-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-neon-purple" />
                    Team Settings
                  </CardTitle>
                  <CardDescription>
                    Configure how your team operates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Allow members to invite others</h4>
                      <p className="text-sm text-content-secondary">Team members can send invitations to new people</p>
                    </div>
                    <Switch 
                      checked={teamSettings.allowMembersToInvite}
                      onCheckedChange={(value) => handleSettingChange('allowMembersToInvite', value)}
                      disabled={!isAdmin}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Require approval for new members</h4>
                      <p className="text-sm text-content-secondary">Admin must approve all new member requests</p>
                    </div>
                    <Switch 
                      checked={teamSettings.requireApprovalForNewMembers}
                      onCheckedChange={(value) => handleSettingChange('requireApprovalForNewMembers', value)}
                      disabled={!isAdmin}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Allow members to leave</h4>
                      <p className="text-sm text-content-secondary">Members can leave the team on their own</p>
                    </div>
                    <Switch 
                      checked={teamSettings.allowMembersToLeave}
                      onCheckedChange={(value) => handleSettingChange('allowMembersToLeave', value)}
                      disabled={!isAdmin}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Public team</h4>
                      <p className="text-sm text-content-secondary">Make this team visible to all users</p>
                    </div>
                    <Switch 
                      checked={teamSettings.publicTeam}
                      onCheckedChange={(value) => handleSettingChange('publicTeam', value)}
                      disabled={!isAdmin}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="members" className="space-y-6">
              <Card className="glass-card neon-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-neon-blue" />
                        Team Members ({team.members.length + 1})
                      </CardTitle>
                      <CardDescription>
                        Manage your team members and their roles
                      </CardDescription>
                    </div>
                    {isAdmin && (
                      <Button className="bg-neon-purple hover:bg-neon-purple/80">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Invite Member
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Team Admin */}
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-yellow-500/20">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={team.admin.avatar} alt={team.admin.name} />
                          <AvatarFallback className="bg-gradient-to-br from-neon-purple to-neon-blue text-white">
                            {team.admin.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{team.admin.name}</h4>
                            <Crown className="h-4 w-4 text-yellow-500" />
                            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30 text-xs">
                              Admin
                            </Badge>
                          </div>
                          <p className="text-sm text-content-secondary">{team.admin.email}</p>
                        </div>
                      </div>
                      <div className="text-sm text-content-secondary">
                        Team Leader
                      </div>
                    </div>

                    {/* Team Members */}
                    {team.members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback className="bg-neon-blue/20 text-neon-blue">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{member.name}</h4>
                              <Badge variant="outline" className="bg-neon-blue/10 text-neon-blue border-neon-blue/30 text-xs">
                                {member.role}
                              </Badge>
                            </div>
                            <p className="text-sm text-content-secondary">{member.email}</p>
                            <p className="text-xs text-content-secondary">Joined {member.joinedAt}</p>
                          </div>
                        </div>
                        {isAdmin && (
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="border-neon-blue text-neon-blue hover:bg-neon-blue/10">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-500/10">
                                  <UserMinus className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-surface-dark/95 backdrop-blur-xl border-white/10">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to remove {member.name} from the team? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleRemoveMember(member.id)}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Remove
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="permissions" className="space-y-6">
              <Card className="glass-card neon-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-neon-purple" />
                    Member Permissions
                  </CardTitle>
                  <CardDescription>
                    {isAdmin ? 'Configure what team members can do' : 'View your permissions in this team'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {team.members.map((member) => (
                      <div key={member.id} className="p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3 mb-4">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-neon-blue/20 text-neon-blue text-sm">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{member.name}</h4>
                            <p className="text-xs text-content-secondary">{member.role}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3 ml-11">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Can invite new members</span>
                            <Switch 
                              checked={member.permissions.canInvite}
                              onCheckedChange={(value) => handleMemberPermissionChange(member.id, 'canInvite', value)}
                              disabled={!isAdmin}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Can manage project settings</span>
                            <Switch 
                              checked={member.permissions.canManageProject}
                              onCheckedChange={(value) => handleMemberPermissionChange(member.id, 'canManageProject', value)}
                              disabled={!isAdmin}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Can view team analytics</span>
                            <Switch 
                              checked={member.permissions.canViewAnalytics}
                              onCheckedChange={(value) => handleMemberPermissionChange(member.id, 'canViewAnalytics', value)}
                              disabled={!isAdmin}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {isAdmin && (
              <TabsContent value="danger" className="space-y-6">
                <Card className="glass-card border-red-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-400">
                      <Trash2 className="h-5 w-5" />
                      Danger Zone
                    </CardTitle>
                    <CardDescription>
                      Irreversible and destructive actions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border border-red-500/30 rounded-lg bg-red-500/5">
                      <h4 className="font-medium text-red-400 mb-2">Delete Team</h4>
                      <p className="text-sm text-content-secondary mb-4">
                        Once you delete a team, there is no going back. Please be certain.
                      </p>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Team
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-surface-dark/95 backdrop-blur-xl border-white/10">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the team
                              and remove all data associated with it.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-red-500 hover:bg-red-600">
                              Yes, delete team
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TeamSettings;
