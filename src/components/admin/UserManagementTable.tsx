
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Crown, Calendar, Mail } from 'lucide-react';
import { useUserManagement, UserWithSubscription } from '@/hooks/useUserManagement';

const UserManagementTable: React.FC = () => {
  const { users, isLoading, cancelUserSubscription, upgradeUserSubscription } = useUserManagement();
  const [selectedUser, setSelectedUser] = useState<UserWithSubscription | null>(null);
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getSubscriptionBadge = (user: UserWithSubscription) => {
    if (!user.subscribed) {
      return <Badge variant="secondary">Free</Badge>;
    }
    
    const tier = user.subscription_tier || 'Unknown';
    const isExpired = user.subscription_end && new Date(user.subscription_end) < new Date();
    
    if (isExpired) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    
    return <Badge className="bg-green-600 hover:bg-green-700">{tier}</Badge>;
  };

  const handleManageSubscription = (user: UserWithSubscription) => {
    setSelectedUser(user);
    setSelectedTier(user.subscription_tier || '');
    setIsManageDialogOpen(true);
  };

  const handleUpdateSubscription = async () => {
    if (!selectedUser) return;
    
    if (selectedTier === 'cancel') {
      await cancelUserSubscription(selectedUser.id);
    } else {
      await upgradeUserSubscription(selectedUser.id, selectedTier);
    }
    
    setIsManageDialogOpen(false);
    setSelectedUser(null);
    setSelectedTier('');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management ({users.length} users)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium">
                        {user.display_name || 'No Name'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.id.substring(0, 8)}...
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {formatDate(user.created_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getSubscriptionBadge(user)}
                    </TableCell>
                    <TableCell>
                      {user.subscription_end ? formatDate(user.subscription_end) : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleManageSubscription(user)}
                        className="flex items-center gap-1"
                      >
                        <Crown className="h-3 w-3" />
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isManageDialogOpen} onOpenChange={setIsManageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Subscription</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedUser && (
              <div className="space-y-2">
                <p><strong>User:</strong> {selectedUser.display_name || 'No Name'}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Current Status:</strong> {getSubscriptionBadge(selectedUser)}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">New Subscription Tier</label>
              <Select value={selectedTier} onValueChange={setSelectedTier}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subscription tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basic">Basic Plan</SelectItem>
                  <SelectItem value="Premium">Premium Plan</SelectItem>
                  <SelectItem value="Enterprise">Enterprise Plan</SelectItem>
                  <SelectItem value="cancel">Cancel Subscription</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsManageDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateSubscription}
                disabled={!selectedTier}
              >
                Update Subscription
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserManagementTable;
