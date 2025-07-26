import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SocketProvider } from "@/contexts/SocketContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Connect from "./pages/Connect";
import ConnectMemberDetail from "./pages/TeamMemberDetail";
import Mentors from "./pages/Mentors";
import MentorDetail from "./pages/MentorDetail";
import Funding from "./pages/Funding";
import FundingDetail from "./pages/FundingDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import CreateProject from "./pages/CreateProject";
import BecomeMentor from "./pages/BecomeMentor";
import Chat from "./pages/Chat";
import Notifications from "./pages/Notifications";
import CreateTeam from './pages/CreateTeams';
import ScrollToTop from "@/components/ScrollToTop";
import OtpVerification from "./pages/OtpVerification";
import About from "./pages/About";
import TeamSettings from "./pages/TeamSettings";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <>
    
  <QueryClientProvider client={queryClient}>
    
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <SocketProvider>
          <ScrollToTop />
            <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            {/*<Route path="/dashboard" element={<Dashboard />} />*/}
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/connect" element={<Connect />} />
            <Route path="/connect/:id" element={<ConnectMemberDetail />} />
            <Route path="/connect/create" element={
              <ProtectedRoute>
                <CreateTeam />
              </ProtectedRoute>
            } />
            <Route path="/mentors" element={<Mentors />} />
            <Route path="/mentors/:id" element={<MentorDetail />} />
            <Route path="/funding" element={<Funding />} />
            <Route path="/funding/:id" element={<FundingDetail />} />
            <Route path="/teams/:id" element={<TeamSettings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/otpverification" element={<OtpVerification/>}/>
            
            {/* Protected Routes */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/projects/create" element={
              <ProtectedRoute>
                <CreateProject />
              </ProtectedRoute>
            } />
            <Route path="/mentors/become" element={
              <ProtectedRoute>
                <BecomeMentor />
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            } />
            <Route path="/teams/create" element={
              <ProtectedRoute>
                <CreateTeam />
              </ProtectedRoute>
            }/>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
            </Routes>
          </SocketProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </>
);

export default App;
