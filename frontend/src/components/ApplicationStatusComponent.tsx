// frontend/src/components/ApplicationStatusComponent.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText, Clock, CheckCircle, XCircle, AlertCircle, ExternalLink, DollarSign, Users, BookOpen
} from "lucide-react";
import { Link } from "react-router-dom";

interface Application {
  id: string;
  type: 'project' | 'funding' | 'mentorship' | 'team';
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  submittedDate: string;
  lastUpdated: string;
  amount?: string;
  organization?: string;
}

const ApplicationStatusComponent = () => {
  // Mock application data
  const applications: Application[] = [
    {
      id: '1',
      type: 'funding',
      title: 'AI Campus Navigator Funding',
      description: 'Grant application for AI-powered campus navigation system',
      status: 'approved',
      submittedDate: '2024-01-15',
      lastUpdated: '2024-01-20',
      amount: '$15,000',
      organization: 'University Innovation Fund'
    },
    {
      id: '2',
      type: 'project',
      title: 'Mental Health App - Team Application',
      description: 'Application to join the Mental Health Companion project team',
      status: 'pending',
      submittedDate: '2024-01-22',
      lastUpdated: '2024-01-22'
    },
    {
      id: '3',
      type: 'mentorship',
      title: 'Dr. Sarah Johnson - Mentorship Request',
      description: 'Request for mentorship in AI and Machine Learning',
      status: 'under_review',
      submittedDate: '2024-01-18',
      lastUpdated: '2024-01-24',
      organization: 'Stanford AI Lab'
    },
    {
      id: '4',
      type: 'funding',
      title: 'Sustainability Hackathon Sponsorship',
      description: 'Sponsorship application for environmental innovation project',
      status: 'rejected',
      submittedDate: '2024-01-10',
      lastUpdated: '2024-01-16',
      amount: '$5,000',
      organization: 'Green Tech Initiative'
    },
    {
      id: '5',
      type: 'team',
      title: 'Energy Monitor Dashboard Team',
      description: 'Application to create a new team for energy monitoring project',
      status: 'approved',
      submittedDate: '2024-01-12',
      lastUpdated: '2024-01-14'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'under_review':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: 'default',
      rejected: 'destructive',
      pending: 'secondary',
      under_review: 'outline'
    } as const;

    const labels = {
      approved: 'Approved',
      rejected: 'Rejected',
      pending: 'Pending',
      under_review: 'Under Review'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]} className="text-xs">
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'funding':
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'project':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'mentorship':
        return <BookOpen className="h-4 w-4 text-purple-500" />;
      case 'team':
        return <Users className="h-4 w-4 text-orange-500" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const pendingCount = applications.filter(app => app.status === 'pending' || app.status === 'under_review').length;
  const approvedCount = applications.filter(app => app.status === 'approved').length;
  const rejectedCount = applications.filter(app => app.status === 'rejected').length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-neon-blue" />
            Application Status
          </CardTitle>
          <CardDescription>Track your applications and their current status</CardDescription>
        </div>
        <div className="flex gap-2 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <span className="text-muted-foreground">{pendingCount} pending</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-muted-foreground">{approvedCount} approved</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applications.map((application) => (
            <div
              key={application.id}
              className="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">
                    {getTypeIcon(application.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm truncate">{application.title}</h4>
                      {getStatusBadge(application.status)}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {application.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Submitted {formatDate(application.submittedDate)}
                      </div>
                      {application.amount && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {application.amount}
                        </div>
                      )}
                      {application.organization && (
                        <div className="text-xs font-medium text-neon-purple">
                          {application.organization}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {getStatusIcon(application.status)}
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {application.status === 'pending' && (
                <div className="text-xs text-muted-foreground bg-yellow-50 dark:bg-yellow-950/20 rounded p-2 border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 text-yellow-600" />
                    <span>Awaiting review - typically takes 3-5 business days</span>
                  </div>
                </div>
              )}

              {application.status === 'approved' && application.type === 'funding' && (
                <div className="text-xs text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/20 rounded p-2 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    <span>Congratulations! Funding approved. Check your email for next steps.</span>
                  </div>
                </div>
              )}

              {application.status === 'rejected' && (
                <div className="text-xs text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/20 rounded p-2 border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    <span>Application was not approved. You can reapply after addressing feedback.</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {applications.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No applications yet</p>
            <p className="text-xs">Apply for funding, join projects, or request mentorship to see your status here</p>
          </div>
        )}

        <div className="flex gap-2 mt-6 pt-4 border-t">
          <Button variant="outline" size="sm" asChild>
            <Link to="/funding">
              <DollarSign className="h-4 w-4 mr-2" />
              Apply for Funding
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/projects">
              <Users className="h-4 w-4 mr-2" />
              Join Project
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/mentors">
              <BookOpen className="h-4 w-4 mr-2" />
              Find Mentor
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationStatusComponent;