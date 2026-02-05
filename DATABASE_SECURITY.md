# Database Security Documentation - Row Level Security (RLS)

## Overview

This document describes the Row Level Security (RLS) policies implemented in the SmartBill database to ensure data privacy and security. All user-facing tables have RLS enabled to ensure users can only access their own data.

**Reference**: DATA-01: Implementación de RLS y políticas de privacidad de datos

## Tables with RLS Enabled

### 1. `clients`
**Purpose**: Stores client information for each user.

**RLS Policies**:
- **SELECT**: Users can view their own clients (`auth.uid() = user_id`)
- **INSERT**: Users can create clients for themselves (`WITH CHECK (auth.uid() = user_id)`)
- **UPDATE**: Users can update their own clients (`auth.uid() = user_id`)
- **DELETE**: Users can delete their own clients (`auth.uid() = user_id`)

**Key Column**: `user_id` (UUID, references `auth.users`)

**Frontend Usage**: All queries automatically filter by `user_id` using `.eq('user_id', user.id)`

---

### 2. `invoices`
**Purpose**: Stores invoice records for each user.

**RLS Policies**:
- **SELECT**: Users can view their own invoices (`auth.uid() = user_id`)
- **INSERT**: Users can create invoices for themselves (`WITH CHECK (auth.uid() = user_id)`)
- **UPDATE**: Users can update their own invoices (`auth.uid() = user_id`)
- **DELETE**: Users can delete their own invoices (`auth.uid() = user_id`)

**Key Column**: `user_id` (UUID, references `auth.users`)

**Frontend Usage**: All queries automatically filter by `user_id` using `.eq('user_id', user.id)`

**Related Tables**: 
- `invoice_items` - Automatically protected through `invoices` ownership
- `invoice_timelines` - Automatically protected through `invoices` ownership

---

### 3. `invoice_items`
**Purpose**: Stores individual line items for each invoice.

**RLS Policies**:
- **SELECT**: Users can view invoice items for their own invoices
  ```sql
  USING (EXISTS (
    SELECT 1 FROM public.invoices 
    WHERE invoices.id = invoice_items.invoice_id 
    AND invoices.user_id = auth.uid()
  ))
  ```
- **INSERT**: Users can create invoice items for their own invoices
- **UPDATE**: Users can update invoice items for their own invoices
- **DELETE**: Users can delete invoice items for their own invoices

**Key Column**: `invoice_id` (UUID, references `invoices.id`)

**Security Model**: Access is controlled through the parent `invoices` table ownership.

---

### 4. `credit_notes`
**Purpose**: Stores credit notes issued to clients.

**RLS Policies**:
- **SELECT**: Users can view their own credit notes (`auth.uid() = user_id`)
- **INSERT**: Users can create credit notes for themselves (`WITH CHECK (auth.uid() = user_id)`)
- **UPDATE**: Users can update their own credit notes (`auth.uid() = user_id`)
- **DELETE**: Users can delete their own credit notes (`auth.uid() = user_id`)

**Key Column**: `user_id` (UUID, references `auth.users`)

**Frontend Usage**: All queries must filter by `user_id` using `.eq('user_id', user.id)`

---

### 5. `invoice_timelines`
**Purpose**: Stores event history and timeline for invoice activities.

**RLS Policies**:
- **SELECT**: Users can view timelines for their own invoices
  ```sql
  USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.invoices 
      WHERE invoices.id = invoice_timelines.invoice_id 
      AND invoices.user_id = auth.uid()
    )
  )
  ```
- **INSERT**: Users can create timeline events for their own invoices
- **UPDATE**: Users can update timeline events for their own invoices
- **DELETE**: Users can delete timeline events for their own invoices

**Key Columns**: 
- `user_id` (UUID, references `auth.users`)
- `invoice_id` (UUID, references `invoices.id`)

**Security Model**: Access is controlled through both direct `user_id` ownership and parent `invoices` table ownership.

---

### 6. `providers`
**Purpose**: Stores provider/vendor information for each user.

**RLS Policies**:
- **SELECT**: Users can view their own providers (`auth.uid() = user_id`)
- **INSERT**: Users can create providers for themselves (`WITH CHECK (auth.uid() = user_id)`)
- **UPDATE**: Users can update their own providers (`auth.uid() = user_id`)
- **DELETE**: Users can delete their own providers (`auth.uid() = user_id`)

**Key Column**: `user_id` (UUID, references `auth.users`)

**Frontend Usage**: All queries must filter by `user_id` using `.eq('user_id', user.id)`

---

## Security Best Practices

### 1. Always Filter by `user_id` in Frontend Queries

Even though RLS policies protect data at the database level, it's a best practice to explicitly filter by `user_id` in frontend queries for:
- Performance optimization (reduces data transfer)
- Code clarity (makes intent explicit)
- Defense in depth (multiple layers of security)

**Example**:
```typescript
const { data } = await supabase
  .from('clients')
  .select('*')
  .eq('user_id', user.id)  // Always include this filter
  .order('name');
```

### 2. Never Trust Client-Side Filtering Alone

RLS policies ensure that even if a malicious user tries to bypass frontend filters, they cannot access other users' data. The database enforces security at the row level.

### 3. Use Supabase Client with Authenticated User

Always use the authenticated Supabase client (`supabase` from `@/integrations/supabase/client`) which includes the user's JWT token. This token is automatically used by RLS policies to determine `auth.uid()`.

**Example**:
```typescript
import { supabase } from "@/integrations/supabase/client";
// This client automatically includes the user's auth token
```

### 4. Testing RLS Policies

To verify RLS is working correctly:

1. **Test with authenticated user**: Queries should return only the user's data
2. **Test with different user**: Should return empty results or error
3. **Test unauthorized access**: Attempts to access other users' data should fail silently (return empty) or with permission error

---

## Migration History

- **20250205000000**: Initial RLS implementation for all user-facing tables
  - Enabled RLS on `clients`, `invoices`, `credit_notes`, `invoice_timelines`, `providers`
  - Created comprehensive policies for all CRUD operations
  - Added indexes for performance optimization

---

## Related Tables (Already Protected)

These tables already have RLS enabled from previous migrations:

- `time_entries` - Protected by `user_id`
- `user_branding_profiles` - Protected by `user_id`
- `subscribers` - Protected by `user_id` or `email`
- `user_roles` - Protected by `user_id` (with admin overrides)
- `profiles` - Protected by `id` matching `auth.users.id`

---

## Troubleshooting

### Issue: Queries return empty results
**Solution**: Ensure the user is authenticated and the query includes `.eq('user_id', user.id)`

### Issue: Permission denied errors
**Solution**: Verify RLS is enabled on the table and policies are correctly configured

### Issue: Can't insert/update records
**Solution**: Check that `user_id` is being set correctly in INSERT/UPDATE operations and matches `auth.uid()`

---

## Security Audit Checklist

- [x] All user-facing tables have RLS enabled
- [x] All policies use `auth.uid() = user_id` pattern
- [x] Frontend queries filter by `user_id`
- [x] Related tables (invoice_items, invoice_timelines) protected through parent ownership
- [x] Indexes created for performance
- [x] Documentation created and maintained

---

**Last Updated**: 2025-02-05
**Migration**: `20250205000000_enable_rls_all_tables.sql`
