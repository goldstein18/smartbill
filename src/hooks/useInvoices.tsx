import { useState, useEffect } from "react";
import { Invoice, InvoiceWithDetails, InvoiceItem } from "@/types/invoice";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

export const useInvoices = (user: User | null) => {
  const [invoices, setInvoices] = useState<InvoiceWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load invoices from Supabase
  useEffect(() => {
    if (!user) return;

    const loadInvoices = async () => {
      setIsLoading(true);
      try {
        console.log("Loading invoices for user:", user.id);
        
        const { data, error } = await supabase
          .from('invoices')
          .select(`
            *,
            clients(id, name, email, contact_person),
            invoice_items(*)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error loading invoices:", error);
          toast.error("Failed to load invoices");
          return;
        }

        console.log("Loaded invoices data:", data);

        const invoicesWithDetails: InvoiceWithDetails[] = data.map(invoice => ({
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

        console.log("Processed invoices:", invoicesWithDetails);
        setInvoices(invoicesWithDetails);
      } catch (error) {
        console.error("Error loading invoices:", error);
        toast.error("Failed to load invoices");
      } finally {
        setIsLoading(false);
      }
    };

    loadInvoices();

    // Set up real-time subscription for invoices with proper event handling
    const invoicesSubscription = supabase
      .channel('invoices_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'invoices',
          filter: `user_id=eq.${user.id}`
        },
        async (payload) => {
          console.log("Invoice inserted:", payload.new);
          // Load the complete invoice with relations
          const { data } = await supabase
            .from('invoices')
            .select(`
              *,
              clients(id, name, email, contact_person),
              invoice_items(*)
            `)
            .eq('id', payload.new.id)
            .single();

          if (data) {
            const newInvoice: InvoiceWithDetails = {
              ...data,
              status: data.status as Invoice['status'],
              client: data.clients || {
                id: data.client_id,
                name: 'Unknown Client',
                email: null,
                contact_person: null
              },
              items: data.invoice_items || []
            };
            setInvoices(prevInvoices => [newInvoice, ...prevInvoices]);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'invoices',
          filter: `user_id=eq.${user.id}`
        },
        async (payload) => {
          console.log("Invoice updated:", payload.new);
          // Load the complete invoice with relations
          const { data } = await supabase
            .from('invoices')
            .select(`
              *,
              clients(id, name, email, contact_person),
              invoice_items(*)
            `)
            .eq('id', payload.new.id)
            .single();

          if (data) {
            const updatedInvoice: InvoiceWithDetails = {
              ...data,
              status: data.status as Invoice['status'],
              client: data.clients || {
                id: data.client_id,
                name: 'Unknown Client',
                email: null,
                contact_person: null
              },
              items: data.invoice_items || []
            };
            setInvoices(prevInvoices => 
              prevInvoices.map(invoice => 
                invoice.id === updatedInvoice.id ? updatedInvoice : invoice
              )
            );
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'invoices',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log("Invoice deleted:", payload.old);
          setInvoices(prevInvoices => 
            prevInvoices.filter(invoice => invoice.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    // Also listen to invoice_items changes to update invoice details
    const invoiceItemsSubscription = supabase
      .channel('invoice_items_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoice_items'
        },
        async (payload) => {
          console.log("Invoice item changed:", payload);
          // Find the related invoice and reload it
          const invoiceId = (payload.new as any)?.invoice_id || (payload.old as any)?.invoice_id;
          if (invoiceId) {
            // Check if this invoice belongs to the current user
            const { data } = await supabase
              .from('invoices')
              .select(`
                *,
                clients(id, name, email, contact_person),
                invoice_items(*)
              `)
              .eq('id', invoiceId)
              .eq('user_id', user.id)
              .single();

            if (data) {
              const updatedInvoice: InvoiceWithDetails = {
                ...data,
                status: data.status as Invoice['status'],
                client: data.clients || {
                  id: data.client_id,
                  name: 'Unknown Client',
                  email: null,
                  contact_person: null
                },
                items: data.invoice_items || []
              };
              setInvoices(prevInvoices => 
                prevInvoices.map(invoice => 
                  invoice.id === updatedInvoice.id ? updatedInvoice : invoice
                )
              );
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(invoicesSubscription);
      supabase.removeChannel(invoiceItemsSubscription);
    };
  }, [user]);

  const createInvoice = async (invoiceData: {
    client_id: string;
    invoice_number: string;
    issue_date: string;
    due_date: string | null;
    total_amount: number;
    total_hours: number;
    items: Omit<InvoiceItem, 'id' | 'invoice_id' | 'created_at'>[];
    notes?: string;
  }): Promise<string | null> => {
    if (!user) return null;

    try {
      console.log("Creating invoice with data:", invoiceData);
      
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
        console.error("Error creating invoice:", invoiceError);
        toast.error("Failed to create invoice");
        return null;
      }

      console.log("Invoice created:", invoice);

      // Create invoice items
      const itemsWithInvoiceId = invoiceData.items.map(item => ({
        ...item,
        invoice_id: invoice.id
      }));

      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(itemsWithInvoiceId);

      if (itemsError) {
        console.error("Error creating invoice items:", itemsError);
        toast.error("Failed to create invoice items");
        return null;
      }

      console.log("Invoice items created successfully");
      toast.success("Invoice created successfully!");
      return invoice.id;
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Failed to create invoice");
      return null;
    }
  };

  const updateInvoiceStatus = async (invoiceId: string, status: Invoice['status'], additionalData?: {
    sent_at?: string;
    viewed_at?: string;
    paid_at?: string;
    email_sent_to?: string;
  }): Promise<boolean> => {
    if (!user) return false;

    try {
      // Optimistic update
      setInvoices(prevInvoices => 
        prevInvoices.map(invoice => 
          invoice.id === invoiceId 
            ? { ...invoice, status, ...additionalData }
            : invoice
        )
      );

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
        console.error("Error updating invoice status:", error);
        toast.error("Failed to update invoice status");
        // Revert optimistic update by reloading
        const { data } = await supabase
          .from('invoices')
          .select(`
            *,
            clients(id, name, email, contact_person),
            invoice_items(*)
          `)
          .eq('id', invoiceId)
          .single();

        if (data) {
          const revertedInvoice: InvoiceWithDetails = {
            ...data,
            status: data.status as Invoice['status'],
            client: data.clients || {
              id: data.client_id,
              name: 'Unknown Client',
              email: null,
              contact_person: null
            },
            items: data.invoice_items || []
          };
          setInvoices(prevInvoices => 
            prevInvoices.map(invoice => 
              invoice.id === invoiceId ? revertedInvoice : invoice
            )
          );
        }
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error updating invoice status:", error);
      toast.error("Failed to update invoice status");
      return false;
    }
  };

  const deleteInvoice = async (invoiceId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      // Optimistic update
      const invoiceToDelete = invoices.find(i => i.id === invoiceId);
      setInvoices(prevInvoices => prevInvoices.filter(i => i.id !== invoiceId));

      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', invoiceId)
        .eq('user_id', user.id);

      if (error) {
        console.error("Error deleting invoice:", error);
        toast.error("Failed to delete invoice");
        // Revert optimistic update
        if (invoiceToDelete) {
          setInvoices(prevInvoices => [...prevInvoices, invoiceToDelete]);
        }
        return false;
      }

      toast.success("Invoice deleted successfully!");
      return true;
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Failed to delete invoice");
      return false;
    }
  };

  return {
    invoices,
    isLoading,
    createInvoice,
    updateInvoiceStatus,
    deleteInvoice,
  };
};
