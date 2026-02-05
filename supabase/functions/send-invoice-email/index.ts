
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to generate invoice HTML
const generateInvoiceHTML = (invoice: any, client: any, items: any[]) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; background: white; color: #333; }
        .header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 40px; border-bottom: 3px solid #2563eb; padding-bottom: 20px; }
        .invoice-title { margin: 0; font-size: 32px; font-weight: bold; color: #2563eb; }
        .company-info { text-align: right; }
        .company-name { background: #2563eb; color: white; padding: 12px 20px; border-radius: 8px; margin-bottom: 15px; font-size: 18px; font-weight: bold; }
        .invoice-number { font-size: 18px; font-weight: bold; color: #374151; margin: 0; }
        .date-info { color: #6b7280; font-size: 14px; margin: 5px 0 0 0; }
        .billing-section { display: flex; justify-content: space-between; margin-bottom: 40px; }
        .bill-to { flex: 1; margin-right: 20px; }
        .summary { flex: 1; }
        .section-title { margin: 0 0 15px 0; font-size: 16px; font-weight: bold; color: #374151; text-transform: uppercase; letter-spacing: 1px; }
        .client-info { background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb; }
        .client-name { margin: 0 0 5px 0; font-size: 18px; font-weight: bold; color: #1f2937; }
        .client-detail { margin: 0 0 5px 0; color: #6b7280; }
        .summary-box { background: #fef3f2; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .summary-label { color: #6b7280; }
        .summary-value { font-weight: bold; color: #1f2937; }
        .total-row { display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px solid #e5e7eb; }
        .total-label { font-size: 18px; font-weight: bold; color: #1f2937; }
        .total-value { font-size: 18px; font-weight: bold; color: #ef4444; }
        .items-table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 40px; }
        .items-table th { padding: 15px; text-align: left; font-weight: bold; color: #374151; font-size: 14px; background: #f8fafc; border-bottom: 2px solid #e5e7eb; }
        .items-table td { padding: 12px 15px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
        .items-table tr:nth-child(even) { background: #f8fafc; }
        .footer { text-align: center; padding-top: 30px; border-top: 2px solid #e5e7eb; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1 class="invoice-title">INVOICE</h1>
          <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">Professional Time Tracking Services</p>
        </div>
        <div class="company-info">
          <div class="company-name">SmartBill</div>
          <p class="invoice-number">Invoice #${invoice.invoice_number}</p>
          <p class="date-info">Issue Date: ${formatDate(invoice.issue_date)}</p>
          <p class="date-info">Due Date: ${invoice.due_date ? formatDate(invoice.due_date) : 'Upon receipt'}</p>
        </div>
      </div>

      <div class="billing-section">
        <div class="bill-to">
          <h3 class="section-title">Bill To:</h3>
          <div class="client-info">
            <p class="client-name">${client.name}</p>
            ${client.contact_person ? `<p class="client-detail">${client.contact_person}</p>` : ''}
            ${client.email ? `<p class="client-detail">${client.email}</p>` : ''}
          </div>
        </div>
        <div class="summary">
          <h3 class="section-title">Summary:</h3>
          <div class="summary-box">
            <div class="summary-row">
              <span class="summary-label">Total Hours:</span>
              <span class="summary-value">${invoice.total_hours.toFixed(2)}h</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Total Amount:</span>
              <span class="summary-value">${formatCurrency(invoice.total_amount)}</span>
            </div>
          </div>
        </div>
      </div>

      ${items.length > 0 ? `
      <div>
        <h3 class="section-title">Time Entries:</h3>
        <table class="items-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Hours</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr>
                <td>${formatDate(item.date)}</td>
                <td>${item.description}</td>
                <td>${item.hours.toFixed(2)}h</td>
                <td>${formatCurrency(item.amount)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ` : ''}

      <div class="footer">
        <p>Thank you for your business!</p>
        <p>Generated by SmartBill on ${formatDate(new Date().toISOString())}</p>
      </div>
    </body>
    </html>
  `;
};

// Function to generate PDF using jsPDF
const generateInvoicePDF = (invoice: any, client: any, items: any[]) => {
  // Import jsPDF dynamically
  const jsPDF = (globalThis as any).jsPDF || class {
    constructor() {
      throw new Error('jsPDF not available in this environment');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  // Create simple text-based PDF content
  const pdfContent = `
INVOICE

SmartBill
Professional Time Tracking Services

Invoice #: ${invoice.invoice_number}
Issue Date: ${formatDate(invoice.issue_date)}
Due Date: ${invoice.due_date ? formatDate(invoice.due_date) : 'Upon receipt'}

BILL TO:
${client.name}
${client.contact_person ? client.contact_person : ''}
${client.email ? client.email : ''}

SUMMARY:
Total Hours: ${invoice.total_hours.toFixed(2)}h
Total Amount: ${formatCurrency(invoice.total_amount)}

${items.length > 0 ? `
TIME ENTRIES:
${items.map(item => 
  `${formatDate(item.date)} - ${item.description} - ${item.hours.toFixed(2)}h - ${formatCurrency(item.amount)}`
).join('\n')}
` : ''}

Thank you for your business!
Generated by SmartBill on ${formatDate(new Date().toISOString())}
  `;

  // Return the content as a simple text buffer for now
  // In a real implementation, you'd use a proper PDF library
  return new TextEncoder().encode(pdfContent);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { to, subject, body, invoiceId } = await req.json();

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Get the current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Fetch invoice details with client information and items
    const { data: invoice, error: invoiceError } = await supabaseClient
      .from('invoices')
      .select(`
        *,
        clients!inner(name, email, contact_person),
        invoice_items(*)
      `)
      .eq('id', invoiceId)
      .eq('user_id', user.id)
      .single();

    if (invoiceError || !invoice) {
      throw new Error('Invoice not found');
    }

    // Generate PDF content as a simple text file for attachment
    let pdfBuffer = null;
    let pdfGenerationError = null;
    
    try {
      // Generate invoice content as HTML for email body and as text for PDF
      const htmlContent = generateInvoiceHTML(invoice, invoice.clients, invoice.invoice_items || []);
      
      // Create a simple text-based invoice for PDF attachment
      const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      };

      const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

      const textInvoice = `INVOICE - ${invoice.invoice_number}

SmartBill - Professional Time Tracking Services

Invoice Details:
- Invoice Number: ${invoice.invoice_number}
- Issue Date: ${formatDate(invoice.issue_date)}
- Due Date: ${invoice.due_date ? formatDate(invoice.due_date) : 'Upon receipt'}

Bill To:
${invoice.clients.name}
${invoice.clients.contact_person ? invoice.clients.contact_person : ''}
${invoice.clients.email ? invoice.clients.email : ''}

Summary:
- Total Hours: ${invoice.total_hours.toFixed(2)} hours
- Total Amount: ${formatCurrency(invoice.total_amount)}

${invoice.invoice_items && invoice.invoice_items.length > 0 ? `
Time Entries:
${invoice.invoice_items.map(item => 
  `• ${formatDate(item.date)} - ${item.description} - ${item.hours.toFixed(2)}h - ${formatCurrency(item.amount)}`
).join('\n')}
` : ''}

Thank you for your business!
Generated by SmartBill on ${formatDate(new Date().toISOString())}
`;

      // Convert to buffer for attachment
      pdfBuffer = new TextEncoder().encode(textInvoice);
      console.log('Invoice document generated successfully');
    } catch (error) {
      console.error('Invoice document generation failed:', error);
      pdfGenerationError = error.message;
    }

    // Send email via Resend regardless of PDF generation success
    const resendApiKey = 're_jCcs8C8d_7k2FmyYZ5mxt6HDRRxbRC3JH';
    if (!resendApiKey) {
      throw new Error('Resend API key not configured');
    }

    const emailPayload: any = {
      from: 'SmartBill <noreply@resend.dev>',
      to: [to],
      subject: subject,
      html: body.replace(/\n/g, '<br>'),
    };

    // Add invoice attachment if generation was successful
    if (pdfBuffer) {
      const base64Content = btoa(String.fromCharCode(...new Uint8Array(pdfBuffer)));
      emailPayload.attachments = [{
        filename: `invoice-${invoice.invoice_number}.txt`,
        content: base64Content,
        type: 'text/plain'
      }];
      console.log('Invoice attachment added to email');
    } else {
      console.log('Sending email without invoice attachment due to generation failure');
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error('Resend API error:', errorData);
      throw new Error(`Failed to send email via Resend: ${errorData}`);
    }

    const emailResult = await emailResponse.json();
    console.log('Email sent successfully:', emailResult);

    // Determine success message based on attachment generation
    let successMessage = 'Email sent successfully';
    if (pdfBuffer) {
      successMessage += ' with invoice attachment';
    } else {
      successMessage += ' (invoice attachment failed to generate)';
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: successMessage,
        emailId: emailResult.id,
        pdfAttached: !!pdfBuffer,
        pdfError: pdfGenerationError
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in send-invoice-email function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
