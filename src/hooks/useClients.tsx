
import { useState, useEffect } from "react";
import { Client } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export const useClients = (user: User | null) => {
  const [clients, setClients] = useState<Client[]>([]);

  // Load clients from Supabase
  useEffect(() => {
    if (!user) return;

    const loadClients = async () => {
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('user_id', user.id)
          .order('name');

        if (error) {
          console.error("Error loading clients:", error);
          return;
        }

        const clients: Client[] = data.map(client => ({
          id: client.id,
          name: client.name,
          hourlyRate: client.hourly_rate || 0,
          color: client.color || "#8347ff",
          email: client.email || undefined,
          phone: client.phone || undefined,
          contactPerson: client.contact_person || undefined
        }));

        setClients(clients);
      } catch (error) {
        console.error("Error loading clients:", error);
      }
    };

    loadClients();

    // Set up real-time subscription for clients with proper event handling
    const clientsSubscription = supabase
      .channel('clients_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'clients',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Client inserted:', payload.new);
          const newClient: Client = {
            id: payload.new.id,
            name: payload.new.name,
            hourlyRate: payload.new.hourly_rate || 0,
            color: payload.new.color || "#8347ff",
            email: payload.new.email || undefined,
            phone: payload.new.phone || undefined,
            contactPerson: payload.new.contact_person || undefined
          };
          setClients(prevClients => [...prevClients, newClient]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'clients',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Client updated:', payload.new);
          const updatedClient: Client = {
            id: payload.new.id,
            name: payload.new.name,
            hourlyRate: payload.new.hourly_rate || 0,
            color: payload.new.color || "#8347ff",
            email: payload.new.email || undefined,
            phone: payload.new.phone || undefined,
            contactPerson: payload.new.contact_person || undefined
          };
          setClients(prevClients => 
            prevClients.map(client => 
              client.id === updatedClient.id ? updatedClient : client
            )
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'clients',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Client deleted:', payload.old);
          setClients(prevClients => 
            prevClients.filter(client => client.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(clientsSubscription);
    };
  }, [user]);

  const addClient = async (client: Omit<Client, "id">) => {
    if (!user) return false;

    try {
      // Optimistic update
      const tempId = `temp-${Date.now()}`;
      const optimisticClient: Client = { ...client, id: tempId };
      setClients(prevClients => [...prevClients, optimisticClient]);

      const { data, error } = await supabase
        .from('clients')
        .insert({
          user_id: user.id,
          name: client.name,
          hourly_rate: client.hourlyRate,
          color: client.color || "#8347ff",
          email: client.email || null,
          phone: client.phone || null,
          contact_person: client.contactPerson || null
        })
        .select()
        .single();

      if (error) {
        console.error("Error adding client:", error);
        // Revert optimistic update
        setClients(prevClients => 
          prevClients.filter(c => c.id !== tempId)
        );
        return false;
      }

      // Replace optimistic client with real one
      const newClient: Client = {
        id: data.id,
        name: data.name,
        hourlyRate: data.hourly_rate || 0,
        color: data.color || "#8347ff",
        email: data.email || undefined,
        phone: data.phone || undefined,
        contactPerson: data.contact_person || undefined
      };

      setClients(prevClients => 
        prevClients.map(c => c.id === tempId ? newClient : c)
      );

      return true;
    } catch (error) {
      console.error("Error adding client:", error);
      return false;
    }
  };

  const updateClient = async (client: Client) => {
    if (!user) return false;

    try {
      // Optimistic update
      setClients(prevClients => 
        prevClients.map(c => c.id === client.id ? client : c)
      );

      const { error } = await supabase
        .from('clients')
        .update({
          name: client.name,
          hourly_rate: client.hourlyRate,
          color: client.color,
          email: client.email || null,
          phone: client.phone || null,
          contact_person: client.contactPerson || null
        })
        .eq('id', client.id)
        .eq('user_id', user.id);

      if (error) {
        console.error("Error updating client:", error);
        // Revert optimistic update by reloading data
        const { data } = await supabase
          .from('clients')
          .select('*')
          .eq('user_id', user.id)
          .order('name');
        
        if (data) {
          const clients: Client[] = data.map(client => ({
            id: client.id,
            name: client.name,
            hourlyRate: client.hourly_rate || 0,
            color: client.color || "#8347ff",
            email: client.email || undefined,
            phone: client.phone || undefined,
            contactPerson: client.contact_person || undefined
          }));
          setClients(clients);
        }
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error updating client:", error);
      return false;
    }
  };

  const deleteClient = async (id: string) => {
    if (!user) return false;

    try {
      // Optimistic update
      const clientToDelete = clients.find(c => c.id === id);
      setClients(prevClients => prevClients.filter(c => c.id !== id));

      // First unassign this client from all time entries
      await supabase
        .from('time_entries')
        .update({ client_id: null })
        .eq('client_id', id)
        .eq('user_id', user.id);

      // Then delete the client
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error("Error deleting client:", error);
        // Revert optimistic update
        if (clientToDelete) {
          setClients(prevClients => [...prevClients, clientToDelete]);
        }
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error deleting client:", error);
      return false;
    }
  };

  return {
    clients,
    addClient,
    updateClient,
    deleteClient,
  };
};
