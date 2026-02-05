import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Invoice, InvoiceWithDetails, InvoiceItem } from "@/types/invoice";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

// Query key factory
const invoiceKeys = {
  all: ['invoices'] as const,
  lists: () => [...invoiceKeys.all, 'list'] as const,
  list: (userId: string) => [...invoiceKeys.lists(), userId] as const,
  details: () => [...invoiceKeys.all, 'detail'] as const,
  detail: (id: string) => [...invoiceKeys.details(), id] as const,
};

// Fetch invoices function
const fetchInvoices = async (userId: string): Promise<InvoiceWithDetails[]> => {
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      clients(id, name, email, contact_person),
      invoice_items(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data.map(invoice => ({
    ...invoice,
    status: invoice.status as Invoice['status'],
    client: invoice.clients || {
      id: invoice.client_id,
      name: 'Unknown Client',
      email: null,
      contact_person: null
    },
    items: invoice.invoice_items || []
  }));
};

export const useInvoices = (user: User | null) => {
  const queryClient = useQueryClient();

  // Query for fetching invoices
  const {
    data: invoices = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: invoiceKeys.list(user?.id || ''),
    queryFn: () => fetchInvoices(user!.id),
    enabled: !!user,
  });

  // Mutation for creating invoice
  const createInvoiceMutation = useMutation({
    mutationFn: async (invoiceData: {
      client_id: string;
      invoice_number: string;
      issue_date: string;
      due_date: string | null;
      total_amount: number;
      total_hours: number;
      items: Omit<InvoiceItem, 'id' | 'invoice_id' | 'created_at'>[];
      notes?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      // Create invoice
      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          user_id: user.id,
          client_id: invoiceData.client_id,
          invoice_number: invoiceData.invoice_number,
          issue_date: invoiceData.issue_date,
          due_date: invoiceData.due_date,
          total_amount: invoiceData.total_amount,
          total_hours: invoiceData.total_hours,
          notes: invoiceData.notes || null,
          status: 'draft'
        })
        .select()
        .single();

      if (invoiceError) {
        throw invoiceError;
      }

      // Create invoice items
      const itemsWithInvoiceId = invoiceData.items.map(item => ({
        ...item,
        invoice_id: invoice.id
      }));

      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(itemsWithInvoiceId);

      if (itemsError) {
        throw itemsError;
      }

      return invoice.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.list(user?.id || '') });
      toast.success("Invoice created successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to create invoice");
    },
  });

  // Mutation for updating invoice status
  const updateInvoiceStatusMutation = useMutation({
    mutationFn: async ({
      invoiceId,
      status,
      additionalData,
    }: {
      invoiceId: string;
      status: Invoice['status'];
      additionalData?: {
        sent_at?: string;
        viewed_at?: string;
        paid_at?: string;
        email_sent_to?: string;
      };
    }) => {
      if (!user) throw new Error('User not authenticated');

      const updateData: any = { status };
      
      if (additionalData) {
        Object.assign(updateData, additionalData);
      }

      const { error } = await supabase
        .from('invoices')
        .update(updateData)
        .eq('id', invoiceId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      return { invoiceId, status, additionalData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.list(user?.id || '') });
    },
    onError: (error: Error) => {
      toast.error("Failed to update invoice status");
    },
  });

  // Mutation for deleting invoice
  const deleteInvoiceMutation = useMutation({
    mutationFn: async (invoiceId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', invoiceId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      return invoiceId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.list(user?.id || '') });
      toast.success("Invoice deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to delete invoice");
    },
  });

  return {
    invoices,
    isLoading,
    error,
    createInvoice: createInvoiceMutation.mutateAsync,
    updateInvoiceStatus: (invoiceId: string, status: Invoice['status'], additionalData?: {
      sent_at?: string;
      viewed_at?: string;
      paid_at?: string;
      email_sent_to?: string;
    }) => updateInvoiceStatusMutation.mutateAsync({ invoiceId, status, additionalData }),
    deleteInvoice: deleteInvoiceMutation.mutateAsync,
    isCreating: createInvoiceMutation.isPending,
    isUpdating: updateInvoiceStatusMutation.isPending,
    isDeleting: deleteInvoiceMutation.isPending,
  };
};
