
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Eye, Download, Info, Plus } from "lucide-react";
import { useDemo } from "@/context/DemoContext";

export const InvoicesPage: React.FC = () => {
  const { demoClients, demoStats } = useDemo();

  // Sample invoice data for demo
  const demoInvoices = [
    {
      id: "INV-2024-001",
      clientName: "Smith & Associates LLC",
      amount: 4875.00,
      status: "paid",
      createdAt: "2024-06-15",
      dueDate: "2024-07-15",
      description: "Legal consultation and document review"
    },
    {
      id: "INV-2024-002", 
      clientName: "TechCorp Industries",
      amount: 6250.00,
      status: "pending",
      createdAt: "2024-06-20",
      dueDate: "2024-07-20",
      description: "Contract negotiation and compliance review"
    },
    {
      id: "INV-2024-003",
      clientName: "Harbor Investment Group", 
      amount: 3125.00,
      status: "overdue",
      createdAt: "2024-05-30",
      dueDate: "2024-06-30",
      description: "M&A due diligence and documentation"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const totalPaid = demoInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const totalPending = demoInvoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0);
  const totalOverdue = demoInvoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-6">
      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Demo Mode:</strong> This is a read-only view of the Invoices page with sample data. 
          All actions are disabled.
        </AlertDescription>
      </Alert>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">
            Manage and track your client invoices
          </p>
        </div>
        <Button disabled className="gap-2">
          <Plus className="h-4 w-4" />
          Generate Invoice
        </Button>
      </div>

      {/* Invoice Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalPaid.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">${totalPending.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalOverdue.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unbilled Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">${demoStats.unbilledAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
          <CardDescription>
            Your latest invoices and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {demoInvoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{invoice.id}</div>
                    <div className="text-sm text-muted-foreground">{invoice.clientName}</div>
                    <div className="text-sm text-muted-foreground">{invoice.description}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-medium">${invoice.amount.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">
                      Due: {formatDate(invoice.dueDate)}
                    </div>
                  </div>
                  
                  <Badge className={getStatusColor(invoice.status)}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </Badge>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" disabled>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" disabled>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
