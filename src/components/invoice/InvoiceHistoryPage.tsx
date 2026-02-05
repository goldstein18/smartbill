
import React, { useState, useEffect } from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useInvoices } from "@/hooks/useInvoices";
import { supabase } from "@/integrations/supabase/client";
import { InvoicePreviewModal } from "./InvoicePreviewModal";
import { EmailCompositionDialog } from "./EmailCompositionDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InvoiceWithDetails } from "@/types/invoice";
import { format } from "date-fns";
import { 
  FileText, 
  Mail, 
  Download, 
  Eye, 
  Search, 
  Filter,
  Trash2,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";

export const InvoiceHistoryPage: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { invoices, isLoading, updateInvoiceStatus, deleteInvoice } = useInvoices(user);
  
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceWithDetails | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  useEffect(() => {
    console.log("InvoiceHistoryPage: invoices updated", invoices);
  }, [invoices]);

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'sent': return 'bg-blue-500';
      case 'viewed': return 'bg-yellow-500';
      case 'paid': return 'bg-green-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handlePreviewInvoice = (invoice: InvoiceWithDetails) => {
    setSelectedInvoice(invoice);
    setPreviewModalOpen(true);
  };

  const handleSendEmail = (invoice: InvoiceWithDetails) => {
    setSelectedInvoice(invoice);
    setEmailDialogOpen(true);
  };

  const handleDownloadPDF = async (invoice: InvoiceWithDetails) => {
    toast.info("PDF download functionality will be implemented with the enhanced invoice generation.");
  };

  const handleStatusChange = async (invoiceId: string, newStatus: string) => {
    const statusData: any = {};
    
    if (newStatus === 'paid') {
      statusData.paid_at = new Date().toISOString();
    } else if (newStatus === 'sent') {
      statusData.sent_at = new Date().toISOString();
    }

    const success = await updateInvoiceStatus(invoiceId, newStatus as any, statusData);
    if (success) {
      toast.success(`Invoice status updated to ${newStatus}`);
    }
  };

  const handleEmailSend = async (emailData: {
    to: string;
    subject: string;
    body: string;
    invoiceId: string;
  }) => {
    setIsEmailLoading(true);
    
    try {
      // Call the edge function to send the actual email
      const { data, error } = await supabase.functions.invoke('send-invoice-email', {
        body: emailData
      });

      if (error) {
        console.error('Error sending email:', error);
        toast.error("Failed to send email");
        return;
      }

      // Update the invoice status to sent
      await updateInvoiceStatus(emailData.invoiceId, 'sent', {
        sent_at: new Date().toISOString(),
        email_sent_to: emailData.to,
      });

      toast.success("Invoice email sent successfully!");
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error("Failed to send email");
    } finally {
      setIsEmailLoading(false);
      setEmailDialogOpen(false);
    }
  };

  const handleDeleteInvoice = async (invoice: InvoiceWithDetails) => {
    if (window.confirm(`Are you sure you want to delete invoice ${invoice.invoice_number}?`)) {
      await deleteInvoice(invoice.id);
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoice History</h1>
          <p className="text-gray-600 mt-1">Manage and track your invoices</p>
          {invoices.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">{invoices.length} invoice{invoices.length !== 1 ? 's' : ''} found</p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="viewed">Viewed</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  {isLoading ? (
                    'Loading invoices...'
                  ) : searchTerm || statusFilter !== 'all' ? (
                    'No invoices match your filters'
                  ) : invoices.length === 0 ? (
                    'No invoices found. Create your first invoice from the Clients page.'
                  ) : (
                    'No invoices found'
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">
                    {invoice.invoice_number}
                  </TableCell>
                  <TableCell>{invoice.client.name}</TableCell>
                  <TableCell>
                    {format(new Date(invoice.issue_date), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    {invoice.due_date 
                      ? format(new Date(invoice.due_date), 'MMM dd, yyyy')
                      : 'Upon receipt'
                    }
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(invoice.total_amount)}
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={invoice.status} 
                      onValueChange={(value) => handleStatusChange(invoice.id, value)}
                    >
                      <SelectTrigger className="w-32 h-8">
                        <div className="flex items-center">
                          <Badge className={`${getStatusColor(invoice.status)} text-white`}>
                            {invoice.status.toUpperCase()}
                          </Badge>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="viewed">Viewed</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePreviewInvoice(invoice)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSendEmail(invoice)}
                        disabled={!invoice.client.email}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadPDF(invoice)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteInvoice(invoice)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modals */}
      <InvoicePreviewModal
        invoice={selectedInvoice}
        isOpen={previewModalOpen}
        onOpenChange={setPreviewModalOpen}
        onSendEmail={handleSendEmail}
        onDownloadPDF={handleDownloadPDF}
      />

      <EmailCompositionDialog
        invoice={selectedInvoice}
        isOpen={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        onSendEmail={handleEmailSend}
        isLoading={isEmailLoading}
      />
    </div>
  );
};
