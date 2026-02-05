
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Handshake, BarChart3 } from 'lucide-react';
import { PartnerApplicationsTable } from '@/components/admin/PartnerApplicationsTable';
import { useAdminStats } from '@/hooks/useAdminStats';
import UserManagementTable from '@/components/admin/UserManagementTable';

const AdminDashboardPage: React.FC = () => {
  const { stats, isLoading } = useAdminStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
            <Badge className="bg-red-100 text-red-800">SUPER ADMIN</Badge>
          </div>
          <p className="text-gray-600">
            Manage partner applications, users, and system administration.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <Handshake className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Partner Applications</p>
                <p className="text-2xl font-bold">
                  {isLoading ? '...' : stats.totalPartnerApplications}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <Users className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">
                  {isLoading ? '...' : stats.totalUsers}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <BarChart3 className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                <p className="text-2xl font-bold">
                  {isLoading ? '...' : stats.activeSubscriptions}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* User Management */}
          <UserManagementTable />
          
          {/* Partner Applications */}
          <PartnerApplicationsTable />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
