
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Client } from '@/types';
import { toast } from 'sonner';
import { Download, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useDemo } from '@/context/DemoContext';

interface ClientImportExportProps {
  clients: Client[];
  onImport: (clients: Omit<Client, 'id'>[]) => Promise<void>;
}

export const ClientImportExport: React.FC<ClientImportExportProps> = ({
  clients,
  onImport
}) => {
  const { isDemoMode } = useDemo();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if (isDemoMode) {
      toast.error("Cannot export clients in demo mode");
      return;
    }

    try {
      // Prepare data for export
      const exportData = clients.map(client => ({
        Company: client.name,
        'Contact Name': client.contactPerson || '',
        Email: client.email || '',
        Phone: client.phone || '',
        'Hourly Rate': client.hourlyRate,
        Color: client.color
      }));

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Clients');
      
      // Generate file and trigger download
      const fileName = `clients_export_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      toast.success(`Exported ${clients.length} clients successfully!`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export clients');
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isDemoMode) {
      toast.error("Cannot import clients in demo mode");
      event.target.value = '';
      return;
    }

    const file = event.target.files?.[0];
    if (!file) return;

    console.log('Selected file:', file.name, file.type);

    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    
    if (!validTypes.includes(file.type) && !file.name.endsWith('.csv')) {
      toast.error('Please select a valid Excel (.xlsx, .xls) or CSV file');
      return;
    }

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      
      console.log('Workbook sheets:', workbook.SheetNames);
      
      // Get first worksheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      console.log('Raw JSON data from file:', jsonData);
      
      if (jsonData.length === 0) {
        toast.error('No data found in the file');
        return;
      }

      // Process and validate data
      const processedClients: Omit<Client, 'id'>[] = [];
      const duplicateNames: string[] = [];
      const skippedDuplicates: string[] = [];
      
      // Create a set of existing client names (case-insensitive)
      const existingClientNames = new Set(
        clients.map(client => client.name.toLowerCase())
      );
      
      jsonData.forEach((row: any, index: number) => {
        console.log(`Processing row ${index + 1}:`, row);
        
        // Try to find company/name field first, then contact name as fallback
        const companyField = Object.keys(row).find(key => 
          key.toLowerCase().includes('company') || key.toLowerCase() === 'name'
        );
        
        const contactNameField = Object.keys(row).find(key => 
          key.toLowerCase().includes('contact') && key.toLowerCase().includes('name')
        );
        
        // Use company name as primary, fallback to contact name
        let clientName = '';
        let contactPerson = '';
        
        if (companyField && row[companyField]) {
          clientName = String(row[companyField]).trim();
          contactPerson = contactNameField ? String(row[contactNameField]).trim() : '';
        } else if (contactNameField && row[contactNameField]) {
          clientName = String(row[contactNameField]).trim();
          contactPerson = clientName; // Use same as contact person
        }
        
        console.log(`Row ${index + 1} client name:`, clientName, 'contact person:', contactPerson);
        
        if (!clientName) {
          console.warn(`Row ${index + 1}: No company name found, skipping`);
          return;
        }

        // Check for duplicates (case-insensitive)
        const clientNameLower = clientName.toLowerCase();
        
        // Check against existing clients
        if (existingClientNames.has(clientNameLower)) {
          console.warn(`Row ${index + 1}: Client "${clientName}" already exists, skipping`);
          skippedDuplicates.push(clientName);
          return;
        }
        
        // Check against clients in current import batch
        if (duplicateNames.includes(clientNameLower)) {
          console.warn(`Row ${index + 1}: Duplicate client "${clientName}" in import file, skipping`);
          skippedDuplicates.push(clientName);
          return;
        }
        
        // Add to duplicates tracking for this import batch
        duplicateNames.push(clientNameLower);

        // Extract other fields with flexible matching
        const emailField = Object.keys(row).find(key => 
          key.toLowerCase().includes('email') || key.toLowerCase().includes('mail')
        );
        
        const phoneField = Object.keys(row).find(key => 
          key.toLowerCase().includes('phone') || key.toLowerCase().includes('tel')
        );
        
        const rateField = Object.keys(row).find(key => 
          key.toLowerCase().includes('rate') || key.toLowerCase().includes('hourly')
        );
        
        const colorField = Object.keys(row).find(key => 
          key.toLowerCase().includes('color') || key.toLowerCase().includes('colour')
        );

        // Safely extract phone value
        let phoneValue = '';
        if (phoneField && row[phoneField]) {
          const rawPhone = row[phoneField];
          if (typeof rawPhone === 'string') {
            phoneValue = rawPhone.trim();
          } else if (typeof rawPhone === 'object' && rawPhone.value) {
            phoneValue = String(rawPhone.value).trim();
          } else {
            phoneValue = String(rawPhone).trim();
          }
        }

        const client: Omit<Client, 'id'> = {
          name: clientName,
          email: emailField ? String(row[emailField]).trim() || undefined : undefined,
          phone: phoneValue || undefined,
          contactPerson: contactPerson || undefined,
          hourlyRate: rateField ? parseFloat(row[rateField]) || 0 : 0,
          color: colorField ? String(row[colorField]).trim() || '#3B82F6' : '#3B82F6'
        };

        console.log(`Processed client ${index + 1}:`, client);
        processedClients.push(client);
      });

      console.log('Final processed clients:', processedClients);
      console.log('Skipped duplicates:', skippedDuplicates);

      if (processedClients.length === 0) {
        if (skippedDuplicates.length > 0) {
          toast.error(`All clients in the file already exist. Skipped ${skippedDuplicates.length} duplicates.`);
        } else {
          toast.error('No valid client data found. Make sure the file has a "Company" or "Name" column.');
        }
        return;
      }

      // Show summary of what will be imported
      if (skippedDuplicates.length > 0) {
        toast.warning(`Skipped ${skippedDuplicates.length} duplicate clients. Importing ${processedClients.length} new clients.`);
      }

      // Import the clients
      console.log('Calling onImport with', processedClients.length, 'clients');
      await onImport(processedClients);
      
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import clients. Please check the file format.');
    } finally {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    if (isDemoMode) {
      toast.error("Cannot import clients in demo mode");
      return;
    }
    fileInputRef.current?.click();
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={handleExport}
        className="gap-2"
        disabled={clients.length === 0}
      >
        <Download className="h-4 w-4" />
        Export
      </Button>
      
      <Button
        variant="outline"
        onClick={triggerFileInput}
        className="gap-2"
      >
        <Upload className="h-4 w-4" />
        Import
      </Button>
      
      <Input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleImport}
        className="hidden"
      />
    </div>
  );
};
