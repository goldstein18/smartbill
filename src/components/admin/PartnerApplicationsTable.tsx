
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Mail, Phone, Building } from 'lucide-react';
import { usePartnerApplications, PartnerApplication } from '@/hooks/usePartnerApplications';
import { format } from 'date-fns';

export const PartnerApplicationsTable: React.FC = () => {
  const { applications, isLoading, updateApplicationStatus } = usePartnerApplications();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Partner Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Partner Applications ({applications.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applications.map((application) => (
            <div key={application.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">
                    {application.first_name} {application.last_name}
                  </h3>
                  <p className="text-sm text-gray-600">{application.position} at {application.company}</p>
                </div>
                {getStatusBadge(application.status)}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{application.email}</span>
                </div>
                {application.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{application.phone}</span>
                  </div>
                )}
              </div>

              {application.experience && (
                <div className="space-y-1">
                  <p className="font-medium text-sm">Experience:</p>
                  <p className="text-sm text-gray-600">{application.experience}</p>
                </div>
              )}

              {application.network && (
                <div className="space-y-1">
                  <p className="font-medium text-sm">Network:</p>
                  <p className="text-sm text-gray-600">{application.network}</p>
                </div>
              )}

              {application.motivation && (
                <div className="space-y-1">
                  <p className="font-medium text-sm">Motivation:</p>
                  <p className="text-sm text-gray-600">{application.motivation}</p>
                </div>
              )}

              <div className="flex justify-between items-center pt-3 border-t">
                <span className="text-xs text-gray-500">
                  Applied {format(new Date(application.created_at), 'MMM d, yyyy')}
                </span>
                
                {application.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateApplicationStatus(application.id, 'rejected')}
                      className="text-red-600 hover:text-red-700"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => updateApplicationStatus(application.id, 'approved')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {applications.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No partner applications yet.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
