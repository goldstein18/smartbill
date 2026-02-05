
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InvoiceWithDetails, EmailTemplate } from "@/types/invoice";
import { Mail, Send } from "lucide-react";

interface EmailCompositionDialogProps {
  invoice: InvoiceWithDetails | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSendEmail: (emailData: {
    to: string;
    subject: string;
    body: string;
    invoiceId: string;
  }) => Promise<void>;
  isLoading?: boolean;
}

const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'professional',
    name: 'Professional',
    subject: 'Invoice {{invoice_number}} - {{contact_name}}',
    body: `Dear {{contact_name}},

I hope this email finds you well. Please find attached invoice {{invoice_number}} for the legal services provided.

Invoice Details:
- Invoice Number: {{invoice_number}}
- Issue Date: {{issue_date}}
- Due Date: {{due_date}}
- Total Amount: {{total_amount}}
- Total Hours: {{total_hours}}

Payment is due within 30 days of the invoice date. If you have any questions regarding this invoice, please don't hesitate to contact me.

Thank you for your business.

Best regards,
{{your_name}}`
  },
  {
    id: 'friendly',
    name: 'Friendly',
    subject: 'Your Invoice {{invoice_number}} is Ready',
    body: `Hi {{contact_name}},

Hope you're doing well! I've attached your invoice {{invoice_number}} for the work we completed recently.

Here's a quick summary:
- Total Hours: {{total_hours}}
- Amount Due: {{total_amount}}
- Due Date: {{due_date}}

As always, if you have any questions about the invoice or the work performed, feel free to reach out.

Thanks!
{{your_name}}`
  },
  {
    id: 'reminder',
    name: 'Payment Reminder',
    subject: 'Payment Reminder - Invoice {{invoice_number}}',
    body: `Dear {{contact_name}},

This is a friendly reminder that invoice {{invoice_number}} issued on {{issue_date}} is now due.

Invoice Details:
- Amount: {{total_amount}}
- Due Date: {{due_date}}

Please process the payment at your earliest convenience. If you have already sent the payment, please disregard this reminder.

If you have any questions or need to discuss payment arrangements, please contact me.

Thank you,
{{your_name}}`
  }
];

export const EmailCompositionDialog: React.FC<EmailCompositionDialogProps> = ({
  invoice,
  isOpen,
  onOpenChange,
  onSendEmail,
  isLoading = false,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('professional');
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  React.useEffect(() => {
    if (invoice) {
      setEmailTo(invoice.client.email || '');
      applyTemplate(selectedTemplate);
    }
  }, [invoice, selectedTemplate]);

  const applyTemplate = (templateId: string) => {
    if (!invoice) return;

    const template = EMAIL_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;

    // Extract first name from contact_person or fallback to client name
    const contactName = invoice.client.contact_person 
      ? invoice.client.contact_person.split(' ')[0] 
      : invoice.client.name.split(' ')[0];

    const replacements = {
      '{{invoice_number}}': invoice.invoice_number,
      '{{contact_name}}': contactName,
      '{{issue_date}}': new Date(invoice.issue_date).toLocaleDateString(),
      '{{due_date}}': invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'Upon receipt',
      '{{total_amount}}': `$${invoice.total_amount.toFixed(2)}`,
      '{{total_hours}}': `${invoice.total_hours.toFixed(2)} hours`,
      '{{your_name}}': '[Your Name]' // This could be replaced with actual user name
    };

    let subject = template.subject;
    let body = template.body;

    Object.entries(replacements).forEach(([placeholder, value]) => {
      subject = subject.replace(new RegExp(placeholder, 'g'), value);
      body = body.replace(new RegExp(placeholder, 'g'), value);
    });

    setEmailSubject(subject);
    setEmailBody(body);
  };

  const handleSend = async () => {
    if (!invoice || !emailTo || !emailSubject || !emailBody) return;

    try {
      await onSendEmail({
        to: emailTo,
        subject: emailSubject,
        body: emailBody,
        invoiceId: invoice.id,
      });
      onOpenChange(false);
      // Reset form
      setEmailTo('');
      setEmailSubject('');
      setEmailBody('');
      setSelectedTemplate('professional');
    } catch (error) {
    }
  };

  if (!invoice) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send Invoice Email
          </DialogTitle>
          <DialogDescription>
            Compose and send invoice {invoice.invoice_number} to your client.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="template-select">Email Template</Label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger id="template-select">
                <SelectValue placeholder="Choose a template..." />
              </SelectTrigger>
              <SelectContent>
                {EMAIL_TEMPLATES.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email-to">To *</Label>
            <Input
              id="email-to"
              type="email"
              value={emailTo}
              onChange={(e) => setEmailTo(e.target.value)}
              placeholder="client@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email-subject">Subject *</Label>
            <Input
              id="email-subject"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              placeholder="Invoice subject..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email-body">Message *</Label>
            <Textarea
              id="email-body"
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              placeholder="Email message..."
              rows={8}
              required
            />
          </div>

          <div className="text-sm text-muted-foreground">
            The invoice PDF will be automatically attached to this email.
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSend}
            disabled={!emailTo || !emailSubject || !emailBody || isLoading}
          >
            {isLoading ? (
              "Sending..."
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
