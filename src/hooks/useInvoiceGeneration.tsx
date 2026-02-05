
import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Client, TimeEntry } from "@/types";
import { useUserProfile } from "./useUserProfile";
import { toast } from "sonner";

export const useInvoiceGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { profile } = useUserProfile();

  const generateInvoice = async (
    client: Client,
    timeEntries: TimeEntry[],
    invoiceNumber?: string,
    dueDate?: Date
  ) => {
    setIsGenerating(true);
    try {
      // Filter entries for this client
      const clientEntries = timeEntries.filter(entry => entry.clientId === client.id);
      
      if (clientEntries.length === 0) {
        toast.error("No time entries found for this client");
        return;
      }

      // Calculate totals
      const totalHours = clientEntries.reduce((sum, entry) => sum + entry.duration, 0) / 3600;
      const totalAmount = totalHours * client.hourlyRate;

      // Create invoice data
      const invoiceData = {
        invoiceNumber: invoiceNumber || `INV-${Date.now()}`,
        client,
        entries: clientEntries,
        totalHours,
        totalAmount,
        issueDate: new Date(),
        dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        branding: profile || {
          company_name: 'SmartBill',
          company_tagline: 'Professional Time Tracking Services',
          primary_color: '#2563eb'
        }
      };

      // Create a temporary div to render the invoice
      const invoiceElement = document.createElement('div');
      invoiceElement.innerHTML = createInvoiceHTML(invoiceData);
      invoiceElement.style.position = 'absolute';
      invoiceElement.style.left = '-9999px';
      invoiceElement.style.width = '800px';
      document.body.appendChild(invoiceElement);

      // Generate PDF
      const canvas = await html2canvas(invoiceElement, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice-${client.name}-${invoiceData.invoiceNumber}.pdf`);

      // Clean up
      document.body.removeChild(invoiceElement);
      
      toast.success("Invoice generated successfully!");
    } catch (error) {
      toast.error("Failed to generate invoice");
    } finally {
      setIsGenerating(false);
    }
  };

  return { generateInvoice, isGenerating };
};

const createInvoiceHTML = (data: any) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const brandColor = data.branding.primary_color || '#2563eb';
  const companyName = data.branding.company_name || 'SmartBill';
  const companyTagline = data.branding.company_tagline || 'Professional Time Tracking Services';

  return `
    <div style="font-family: 'Arial', sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; background: white; color: #333;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 40px; border-bottom: 3px solid ${brandColor}; padding-bottom: 20px;">
        <div>
          <h1 style="margin: 0; font-size: 32px; font-weight: bold; color: ${brandColor};">INVOICE</h1>
          <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">${companyTagline}</p>
          ${data.branding.company_email || data.branding.company_phone || data.branding.company_address ? `
            <div style="margin-top: 10px; font-size: 12px; color: #6b7280;">
              ${data.branding.company_email ? `<p style="margin: 2px 0;">${data.branding.company_email}</p>` : ''}
              ${data.branding.company_phone ? `<p style="margin: 2px 0;">${data.branding.company_phone}</p>` : ''}
              ${data.branding.company_address ? `<p style="margin: 2px 0; white-space: pre-line;">${data.branding.company_address}</p>` : ''}
            </div>
          ` : ''}
        </div>
        <div style="text-align: right;">
          <div style="background: ${brandColor}; color: white; padding: 12px 20px; border-radius: 8px; margin-bottom: 15px;">
            <p style="margin: 0; font-size: 18px; font-weight: bold;">${companyName}</p>
          </div>
          <p style="margin: 0; font-size: 18px; font-weight: bold; color: #374151;">Invoice #${data.invoiceNumber}</p>
          <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">Issue Date: ${formatDate(data.issueDate)}</p>
          <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">Due Date: ${formatDate(data.dueDate)}</p>
        </div>
      </div>

      <!-- Billing Info -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
        <div style="flex: 1; margin-right: 20px;">
          <h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: bold; color: #374151; text-transform: uppercase; letter-spacing: 1px;">Bill To:</h3>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid ${brandColor};">
            <p style="margin: 0 0 5px 0; font-size: 18px; font-weight: bold; color: #1f2937;">${data.client.name}</p>
            ${data.client.contactPerson ? `<p style="margin: 0 0 5px 0; color: #6b7280;">${data.client.contactPerson}</p>` : ''}
            ${data.client.email ? `<p style="margin: 0 0 5px 0; color: #6b7280;">${data.client.email}</p>` : ''}
            ${data.client.phone ? `<p style="margin: 0; color: #6b7280;">${data.client.phone}</p>` : ''}
          </div>
        </div>
        <div style="flex: 1;">
          <h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: bold; color: #374151; text-transform: uppercase; letter-spacing: 1px;">Summary:</h3>
          <div style="background: #fef3f2; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span style="color: #6b7280;">Total Hours:</span>
              <span style="font-weight: bold; color: #1f2937;">${data.totalHours.toFixed(2)}h</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span style="color: #6b7280;">Hourly Rate:</span>
              <span style="font-weight: bold; color: #1f2937;">${formatCurrency(data.client.hourlyRate)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px solid #e5e7eb;">
              <span style="font-size: 18px; font-weight: bold; color: #1f2937;">Total Amount:</span>
              <span style="font-size: 18px; font-weight: bold; color: #ef4444;">${formatCurrency(data.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Time Entries Table -->
      <div style="margin-bottom: 40px;">
        <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: bold; color: #374151; text-transform: uppercase; letter-spacing: 1px;">Time Entries:</h3>
        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <thead>
            <tr style="background: #f8fafc; border-bottom: 2px solid #e5e7eb;">
              <th style="padding: 15px; text-align: left; font-weight: bold; color: #374151; font-size: 14px;">Date</th>
              <th style="padding: 15px; text-align: left; font-weight: bold; color: #374151; font-size: 14px;">Window Name</th>
              <th style="padding: 15px; text-align: left; font-weight: bold; color: #374151; font-size: 14px;">Duration</th>
              <th style="padding: 15px; text-align: right; font-weight: bold; color: #374151; font-size: 14px;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${data.entries.map((entry: TimeEntry, index: number) => {
              const hours = entry.duration / 3600;
              const amount = hours * data.client.hourlyRate;
              const rowBg = index % 2 === 0 ? '#ffffff' : '#f8fafc';
              
              return `
                <tr style="background: ${rowBg}; border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 12px 15px; color: #6b7280; font-size: 14px;">${formatDate(new Date(entry.timestamp))}</td>
                  <td style="padding: 12px 15px; color: #1f2937; font-size: 14px; font-weight: 500;">${entry.windowTitle}</td>
                  <td style="padding: 12px 15px; color: #6b7280; font-size: 14px;">${formatDuration(entry.duration)}</td>
                  <td style="padding: 12px 15px; text-align: right; color: #1f2937; font-size: 14px; font-weight: 500;">${formatCurrency(amount)}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding-top: 30px; border-top: 2px solid #e5e7eb; color: #6b7280; font-size: 12px;">
        <p style="margin: 0;">Thank you for your business!</p>
        <p style="margin: 5px 0 0 0;">Generated by ${companyName} on ${formatDate(new Date())}</p>
      </div>
    </div>
  `;
};
