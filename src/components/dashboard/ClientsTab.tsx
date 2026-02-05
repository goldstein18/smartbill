
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Client, TimeEntry } from "@/types";
import { useClients } from "@/hooks/useClients";
import { useTimeEntries } from "@/hooks/useTimeEntries";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useDemo } from "@/context/DemoContext";
import { useDemoAuth } from "@/hooks/useDemoAuth";
import { EnhancedInvoiceGenerationDialog } from "@/components/invoice/EnhancedInvoiceGenerationDialog";
import { ClientImportExport } from "@/components/clients/ClientImportExport";
import { Plus, Users, Clock, DollarSign, FileText, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ClientAnalyticsChart } from "@/components/analytics/ClientAnalyticsChart";

export const ClientsTab: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { isDemoMode, demoTimeEntries, demoClients } = useDemo();
  const { demoUser } = useDemoAuth();
  
  // Use demo data if in demo mode, otherwise use real data
  const { clients: realClients, addClient, updateClient, deleteClient } = useClients(user);
  const { timeEntries: realTimeEntries } = useTimeEntries(user);
  
  const clients = isDemoMode ? demoClients : realClients;
  const timeEntries = isDemoMode ? demoTimeEntries : realTimeEntries;
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    hourlyRate: 0,
    contactPerson: "",
    color: "#3B82F6"
  });

  const handleAddClient = async () => {
    if (isDemoMode) {
      toast.error("Cannot add clients in demo mode");
      return;
    }

    if (!newClient.name.trim()) {
      toast.error("Client name is required");
      return;
    }

    const success = await addClient({
      name: newClient.name,
      email: newClient.email || null,
      phone: newClient.phone || null,
      hourlyRate: newClient.hourlyRate || 0,
      contactPerson: newClient.contactPerson || null,
      color: newClient.color
    });

    if (success) {
      setNewClient({
        name: "",
        email: "",
        phone: "",
        hourlyRate: 0,
        contactPerson: "",
        color: "#3B82F6"
      });
      setIsAddDialogOpen(false);
      toast.success("Client added successfully!");
    }
  };

  const handleEditClient = async () => {
    if (isDemoMode) {
      toast.error("Cannot edit clients in demo mode");
      return;
    }

    if (!editingClient) return;

    const success = await updateClient(editingClient);
    if (success) {
      setIsEditDialogOpen(false);
      setEditingClient(null);
      toast.success("Client updated successfully!");
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (isDemoMode) {
      toast.error("Cannot delete clients in demo mode");
      return;
    }

    if (window.confirm("Are you sure you want to delete this client? This action cannot be undone.")) {
      const success = await deleteClient(clientId);
      if (success) {
        toast.success("Client deleted successfully!");
      }
    }
  };

  const handleImportClients = async (clientsToImport: Omit<Client, 'id'>[]) => {
    if (isDemoMode) {
      toast.error("Cannot import clients in demo mode");
      return;
    }

    let successCount = 0;
    let errorCount = 0;

    for (const client of clientsToImport) {
      try {
        const success = await addClient(client);
        if (success) {
          successCount++;
        } else {
          errorCount++;
        }
      } catch (error) {
        console.error('Error importing client:', client.name, error);
        errorCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`Successfully imported ${successCount} clients!`);
    }
    if (errorCount > 0) {
      toast.error(`Failed to import ${errorCount} clients`);
    }
  };

  const openEditDialog = (client: Client) => {
    if (isDemoMode) {
      toast.error("Cannot edit clients in demo mode");
      return;
    }
    setEditingClient({ ...client });
    setIsEditDialogOpen(true);
  };

  const getClientStats = (clientId: string) => {
    const clientEntries = timeEntries.filter(entry => entry.clientId === clientId);
    const totalHours = clientEntries.reduce((sum, entry) => sum + entry.duration, 0) / 3600;
    const client = clients.find(c => c.id === clientId);
    const totalEarnings = client ? totalHours * client.hourlyRate : 0;
    
    return {
      totalHours: totalHours.toFixed(1),
      totalEarnings: totalEarnings.toFixed(2),
      entriesCount: clientEntries.length
    };
  };

  const hasTimeEntries = (clientId: string) => {
    return timeEntries.some(entry => entry.clientId === clientId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Clients</h2>
          <p className="text-gray-600 mt-1">
            {isDemoMode ? "Demo client data showing legal practice overview" : "Manage your clients and generate invoices"}
          </p>
        </div>
        <div className="flex gap-2">
          <ClientImportExport
            clients={clients}
            onImport={handleImportClients}
          />
          {!isDemoMode && (
            <>
              <Button onClick={() => setIsInvoiceDialogOpen(true)} className="gap-2">
                <FileText className="h-4 w-4" />
                Generate Invoice
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Client
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Client</DialogTitle>
                    <DialogDescription>
                      Create a new client to track time and generate invoices for.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Client Name *</Label>
                      <Input
                        id="name"
                        value={newClient.name}
                        onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                        placeholder="Enter client name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newClient.email}
                        onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                        placeholder="client@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={newClient.phone}
                        onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactPerson">Contact Person</Label>
                      <Input
                        id="contactPerson"
                        value={newClient.contactPerson}
                        onChange={(e) => setNewClient({ ...newClient, contactPerson: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                      <Input
                        id="hourlyRate"
                        type="number"
                        min="0"
                        step="0.01"
                        value={newClient.hourlyRate}
                        onChange={(e) => setNewClient({ ...newClient, hourlyRate: parseFloat(e.target.value) || 0 })}
                        placeholder="75.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="color">Color</Label>
                      <Input
                        id="color"
                        type="color"
                        value={newClient.color}
                        onChange={(e) => setNewClient({ ...newClient, color: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddClient}>Add Client</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
          {isDemoMode && (
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Client
            </Button>
          )}
        </div>
      </div>

      {/* Client Analytics Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Client Time Distribution</CardTitle>
          <CardDescription>
            Hours tracked by client {isDemoMode ? "(Demo Data)" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClientAnalyticsChart
            timeEntries={timeEntries}
            clients={clients}
          />
        </CardContent>
      </Card>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => {
          const stats = getClientStats(client.id);
          return (
            <Card key={client.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: client.color }}
                    />
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                  </div>
                  {!isDemoMode && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditDialog(client)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteClient(client.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <CardDescription>
                  {client.contactPerson && <div>Contact: {client.contactPerson}</div>}
                  {client.email && <div>{client.email}</div>}
                  {client.phone && <div>{client.phone}</div>}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span>Hourly Rate</span>
                    </div>
                    <span className="font-medium">${client.hourlyRate.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>Total Hours</span>
                    </div>
                    <span className="font-medium">{stats.totalHours}h</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span>Total Earnings</span>
                    </div>
                    <span className="font-medium">${stats.totalEarnings}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>Time Entries</span>
                    </div>
                    <Badge variant="secondary">{stats.entriesCount}</Badge>
                  </div>
                </div>
                {hasTimeEntries(client.id) && (
                  <div className="mt-3 pt-3 border-t">
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      Ready for Invoice
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {clients.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Users className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No clients yet</h3>
              <p className="text-gray-500 text-center mb-4">
                {isDemoMode 
                  ? "This is demo mode - real data would show your clients here."
                  : "Add your first client to start tracking time and generating invoices."
                }
              </p>
              {!isDemoMode && (
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Client
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Client Dialog - Only show in non-demo mode */}
      {!isDemoMode && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Client</DialogTitle>
              <DialogDescription>
                Update client information and settings.
              </DialogDescription>
            </DialogHeader>
            {editingClient && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Client Name *</Label>
                  <Input
                    id="edit-name"
                    value={editingClient.name}
                    onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                    placeholder="Enter client name"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editingClient.email || ""}
                    onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                    placeholder="client@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    value={editingClient.phone || ""}
                    onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-contactPerson">Contact Person</Label>
                  <Input
                    id="edit-contactPerson"
                    value={editingClient.contactPerson || ""}
                    onChange={(e) => setEditingClient({ ...editingClient, contactPerson: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-hourlyRate">Hourly Rate ($)</Label>
                  <Input
                    id="edit-hourlyRate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={editingClient.hourlyRate}
                    onChange={(e) => setEditingClient({ ...editingClient, hourlyRate: parseFloat(e.target.value) || 0 })}
                    placeholder="75.00"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-color">Color</Label>
                  <Input
                    id="edit-color"
                    type="color"
                    value={editingClient.color}
                    onChange={(e) => setEditingClient({ ...editingClient, color: e.target.value })}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditClient}>Update Client</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Enhanced Invoice Generation Dialog - Only show in non-demo mode */}
      {!isDemoMode && (
        <EnhancedInvoiceGenerationDialog
          isOpen={isInvoiceDialogOpen}
          onOpenChange={setIsInvoiceDialogOpen}
          clients={clients}
          timeEntries={timeEntries}
          onInvoiceCreated={(invoiceId) => {
            toast.success("Invoice created successfully!");
            console.log("Created invoice with ID:", invoiceId);
          }}
        />
      )}
    </div>
  );
};
