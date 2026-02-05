
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InvoiceWithDetails } from "@/types/invoice";
import { format } from "date-fns";
import { FileText, Mail, Download, Eye } from "lucide-react";

interface InvoicePreviewModalProps {
  invoice: InvoiceWithDetails | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSendEmail: (invoice: InvoiceWithDetails) => void;
  onDownloadPDF: (invoice: InvoiceWithDetails) => void;
}

export const InvoicePreviewModal: React.FC<InvoicePreviewModalProps> = ({
  invoice,
  isOpen,
  onOpenChange,
  onSendEmail,
  onDownloadPDF,
}) => {
  if (!invoice) return null;

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

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  const formatHours = (hours: number) => `${hours.toFixed(2)}h`;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Invoice Preview - {invoice.invoice_number}
            </DialogTitle>
            <Badge className={getStatusColor(invoice.status)}>
              {invoice.status.toUpperCase()}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invoice Header */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-blue-900 mb-2">INVOICE</h1>
                <p className="text-gray-600">Professional Time Tracking Services</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">#{invoice.invoice_number}</p>
                <p className="text-sm text-gray-600">Issue Date: {format(new Date(invoice.issue_date), 'MMM dd, yyyy')}</p>
                {invoice.due_date && (
                  <p className="text-sm text-gray-600">Due Date: {format(new Date(invoice.due_date), 'MMM dd, yyyy')}</p>
                )}
              </div>
            </div>
          </div>

          {/* Client Info & Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-gray-800">Bill To:</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-lg">{invoice.client.name}</p>
                {invoice.client.contact_person && (
                  <p className="text-gray-600">{invoice.client.contact_person}</p>
                )}
                {invoice.client.email && (
                  <p className="text-gray-600">{invoice.client.email}</p>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-gray-800">Summary:</h3>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span>Total Hours:</span>
                  <span className="font-semibold">{formatHours(invoice.total_hours)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total Amount:</span>
                  <span className="text-red-600">{formatCurrency(invoice.total_amount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-800">Time Entries:</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 font-semibold">Date</th>
                    <th className="text-left p-3 font-semibold">Description</th>
                    <th className="text-right p-3 font-semibold">Hours</th>
                    <th className="text-right p-3 font-semibold">Rate</th>
                    <th className="text-right p-3 font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3">{format(new Date(item.date), 'MMM dd, yyyy')}</td>
                      <td className="p-3">{item.description}</td>
                      <td className="p-3 text-right">{formatHours(item.hours)}</td>
                      <td className="p-3 text-right">{formatCurrency(item.rate)}</td>
                      <td className="p-3 text-right font-semibold">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div>
              <h3 className="font-semibold mb-3 text-gray-800">Notes:</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{invoice.notes}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={() => onDownloadPDF(invoice)} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button onClick={() => onSendEmail(invoice)} className="bg-blue-600 hover:bg-blue-700">
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
