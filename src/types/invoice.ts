
export interface Invoice {
  id: string;
  user_id: string;
  client_id: string;
  invoice_number: string;
  issue_date: string;
  due_date: string | null;
  total_amount: number;
  total_hours: number;
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue';
  sent_at: string | null;
  viewed_at: string | null;
  paid_at: string | null;
  pdf_url: string | null;
  email_sent_to: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  time_entry_id: string;
  description: string;
  hours: number;
  rate: number;
  amount: number;
  date: string;
  created_at: string;
}

export interface InvoiceWithDetails extends Invoice {
  client: {
    id: string;
    name: string;
    email: string | null;
    contact_person: string | null;
  };
  items: InvoiceItem[];
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}
