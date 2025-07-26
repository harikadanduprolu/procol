// frontend/src/components/AppSidebar.tsx
import { useState } from "react";
import {
  Home, FolderOpen, Users, BookOpen, DollarSign, MessageSquare, Bell, User, Plus, ChevronDown
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Projects", url: "/projects", icon: FolderOpen },
  { title: "Connect", url: "/connect", icon: Users },
  { title: "Mentors", url: "/mentors", icon: BookOpen },
  { title: "Funding", url: "/funding", icon: DollarSign },
];

const personalItems = [
  { title: "Messages", url: "/chat", icon: MessageSquare },
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Profile", url: "/profile", icon: User },
];

const createItems = [
  { title: "New Project", url: "/projects/create" },
  { title: "Create Team", url: "/teams/create" },
  { title: "Become Mentor", url: "/mentors/become" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const collapsed = state === "collapsed";

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-neon-purple/10 text-neon-purple border-r-2 border-neon-purple font-medium"
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-card border-r">
        {/* Logo/Brand */}
        <div className="p-4 border-b">
          {!collapsed ? (
            <h2 className="text-xl font-bold bg-gradient-to-r from-neon-purple to-neon-blue bg-clip-text text-transparent">
              ProCollab
            </h2>
          ) : (
            <div className="w-8 h-8 rounded bg-gradient-to-r from-neon-purple to-neon-blue flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
          )}
        </div>
        {/* Create Button */}
        {!collapsed && (
          <div className="p-4">
            <Collapsible open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between border-neon-purple/20 hover:border-neon-purple/40"
                >
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isCreateOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 mt-2">
                {createItems.map((item) => (
                  <NavLink key={item.title} to={item.url}>
                    <Button variant="ghost" className="w-full justify-start text-sm text-muted-foreground hover:text-foreground">
                      {item.title}
                    </Button>
                  </NavLink>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* Personal */}
        <SidebarGroup>
          <SidebarGroupLabel>Personal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {personalItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}