
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSupabaseAppContext, SupabaseAppProvider } from "@/context/SupabaseAppProvider";
import { Client } from "@/types";
import { Plus, FileText } from "lucide-react";
import { EnhancedInvoiceGenerationDialog } from "@/components/invoice/EnhancedInvoiceGenerationDialog";
import { ClientImportExport } from "@/components/clients/ClientImportExport";
import { toast } from "sonner";

const ClientsPage: React.FC = () => {
  const { clients, timeEntries, stats, addClient, updateClient, deleteClient } = useSupabaseAppContext();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState<Omit<Client, "id">>({
    name: "",
    hourlyRate: 0,
    color: "#8347ff",
    email: "",
    phone: ""
  });
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [contactPersonName, setContactPersonName] = useState("");
  const [editContactPersonName, setEditContactPersonName] = useState("");
  
  const handleAddClient = () => {
    if (newClient.name && newClient.hourlyRate > 0) {
      const clientData = {
        ...newClient,
        // Use contactPersonName for the contact person field if provided
        contactPerson: contactPersonName || undefined
      };
      addClient(clientData);
      setNewClient({
        name: "",
        hourlyRate: 0,
        color: "#8347ff",
        email: "",
        phone: ""
      });
      setContactPersonName("");
      setIsAddDialogOpen(false);
    }
  };

  const handleOpenEditDialog = (client: Client) => {
    setEditingClient({ ...client });
    setEditContactPersonName(client.contactPerson || "");
    setIsEditDialogOpen(true);
  };

  const handleSaveClient = () => {
    if (editingClient) {
      const updatedClient = {
        ...editingClient,
        contactPerson: editContactPersonName || undefined
      };
      updateClient(updatedClient);
      setIsEditDialogOpen(false);
      setEditingClient(null);
      setEditContactPersonName("");
    }
  };

  const handleImportClients = async (clientsToImport: Omit<Client, 'id'>[]) => {
    console.log('Starting import process with clients:', clientsToImport);
    let successCount = 0;
    let errorCount = 0;

    for (const client of clientsToImport) {
      console.log('Importing client:', client.name);
      try {
        const result = await addClient(client);
        console.log('Import result for', client.name, ':', result);
        if (result) {
          successCount++;
        } else {
          errorCount++;
          console.error('Failed to import client (returned false):', client.name);
        }
      } catch (error) {
        console.error('Error importing client:', client.name, error);
        errorCount++;
      }
    }

    console.log('Import completed. Success:', successCount, 'Errors:', errorCount);

    if (successCount > 0) {
      toast.success(`Successfully imported ${successCount} clients!`);
    }
    if (errorCount > 0) {
      toast.error(`Failed to import ${errorCount} clients`);
    }
  };

  const getClientStats = (clientId: string) => {
    const clientStat = stats.clientDistribution.find(
      client => client.clientId === clientId
    );
    
    return {
      hours: clientStat?.hours || 0,
      amount: clientStat?.amount || 0
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clients</h1>
        <div className="flex gap-2">
          <ClientImportExport
            clients={clients}
            onImport={handleImportClients}
          />
          <Button 
            variant="outline"
            onClick={() => setIsInvoiceDialogOpen(true)}
            disabled={clients.length === 0}
          >
            <FileText className="h-4 w-4 mr-2" />
            Generate Invoice
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Client
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
                <DialogDescription>
                  Add a new client to assign time entries.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="client-name" className="text-right text-sm font-medium">
                    Name *
                  </Label>
                  <Input
                    id="client-name"
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    className="col-span-3"
                    placeholder="Client name"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="hourly-rate" className="text-right text-sm font-medium">
                    Hourly Rate *
                  </Label>
                  <div className="col-span-3 relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                    <Input
                      id="hourly-rate"
                      type="number"
                      value={newClient.hourlyRate || ""}
                      onChange={(e) => setNewClient({ 
                        ...newClient, 
                        hourlyRate: parseFloat(e.target.value) || 0 
                      })}
                      className="pl-8"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contact-person" className="text-right text-sm font-medium">
                    Contact Person
                  </Label>
                  <Input
                    id="contact-person"
                    value={contactPersonName}
                    onChange={(e) => setContactPersonName(e.target.value)}
                    className="col-span-3"
                    placeholder="Contact person name"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="client-email" className="text-right text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="client-email"
                    type="email"
                    value={newClient.email || ""}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    className="col-span-3"
                    placeholder="client@example.com"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="client-phone" className="text-right text-sm font-medium">
                    Phone
                  </Label>
                  <Input
                    id="client-phone"
                    type="tel"
                    value={newClient.phone || ""}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    className="col-span-3"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="client-color" className="text-right text-sm font-medium">
                    Color
                  </Label>
                  <div className="col-span-3 flex gap-2 items-center">
                    <Input
                      id="client-color"
                      type="color"
                      value={newClient.color}
                      onChange={(e) => setNewClient({ ...newClient, color: e.target.value })}
                      className="w-12 h-8 p-1"
                    />
                    <span className="text-sm text-muted-foreground">{newClient.color}</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={handleAddClient}
                  disabled={!newClient.name || newClient.hourlyRate <= 0}
                >
                  Add Client
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {clients.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Hourly Rate</TableHead>
                <TableHead>Hours Tracked</TableHead>
                <TableHead>Total Billable</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map(client => {
                const { hours, amount } = getClientStats(client.id);
                
                return (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: client.color }} 
                        />
                        <span className="font-medium">{client.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {client.contactPerson && (
                          <div className="font-medium">{client.contactPerson}</div>
                        )}
                        {client.email && (
                          <div className="text-muted-foreground">{client.email}</div>
                        )}
                        {client.phone && (
                          <div className="text-muted-foreground">{client.phone}</div>
                        )}
                        {!client.contactPerson && !client.email && !client.phone && (
                          <span className="text-muted-foreground">No contact info</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>${client.hourlyRate.toFixed(2)}/hr</TableCell>
                    <TableCell>{hours.toFixed(1)}h</TableCell>
                    <TableCell>${amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleOpenEditDialog(client)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => deleteClient(client.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8 border rounded-md bg-muted/20">
          <p className="text-muted-foreground mb-4">No clients added yet</p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add your first client
          </Button>
        </div>
      )}

      {editingClient && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Client</DialogTitle>
              <DialogDescription>
                Make changes to the client information.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-client-name" className="text-right text-sm font-medium">
                  Name *
                </Label>
                <Input
                  id="edit-client-name"
                  value={editingClient.name}
                  onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-hourly-rate" className="text-right text-sm font-medium">
                  Hourly Rate *
                </Label>
                <div className="col-span-3 relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                  <Input
                    id="edit-hourly-rate"
                    type="number"
                    value={editingClient.hourlyRate}
                    onChange={(e) => setEditingClient({ 
                      ...editingClient, 
                      hourlyRate: parseFloat(e.target.value) || 0 
                    })}
                    className="pl-8"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-contact-person" className="text-right text-sm font-medium">
                  Contact Person
                </Label>
                <Input
                  id="edit-contact-person"
                  value={editContactPersonName}
                  onChange={(e) => setEditContactPersonName(e.target.value)}
                  className="col-span-3"
                  placeholder="Contact person name"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-client-email" className="text-right text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="edit-client-email"
                  type="email"
                  value={editingClient.email || ""}
                  onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                  className="col-span-3"
                  placeholder="client@example.com"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-client-phone" className="text-right text-sm font-medium">
                  Phone
                </Label>
                <Input
                  id="edit-client-phone"
                  type="tel"
                  value={editingClient.phone || ""}
                  onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })}
                  className="col-span-3"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-client-color" className="text-right text-sm font-medium">
                  Color
                </Label>
                <div className="col-span-3 flex gap-2 items-center">
                  <Input
                    id="edit-client-color"
                    type="color"
                    value={editingClient.color || "#8347ff"}
                    onChange={(e) => setEditingClient({ ...editingClient, color: e.target.value })}
                    className="w-12 h-8 p-1"
                  />
                  <span className="text-sm text-muted-foreground">{editingClient.color}</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                onClick={handleSaveClient}
                disabled={!editingClient.name || editingClient.hourlyRate <= 0}
              >
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      <EnhancedInvoiceGenerationDialog
        isOpen={isInvoiceDialogOpen}
        onOpenChange={setIsInvoiceDialogOpen}
        clients={clients}
        timeEntries={timeEntries}
        onInvoiceCreated={() => {
          toast.success("Invoice created and saved successfully!");
        }}
      />
    </div>
  );
};

const ClientsPageWrapped: React.FC = () => (
  <SupabaseAppProvider>
    <ClientsPage />
  </SupabaseAppProvider>
);

export default ClientsPageWrapped;
