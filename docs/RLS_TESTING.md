# RLS Testing Guide

## Overview

This guide provides instructions for testing Row Level Security (RLS) policies to ensure data isolation and security.

## Prerequisites

- Two test user accounts (User A and User B)
- Access to Supabase Dashboard or SQL editor
- Understanding of the application's data model

## Test Cases

### 1. Clients Table RLS Testing

#### Test 1.1: User A can only see their own clients
```sql
-- Login as User A
-- Expected: Only User A's clients are returned
SELECT * FROM clients;
```

#### Test 1.2: User A cannot see User B's clients
```sql
-- Login as User A
-- Expected: Empty result set (no User B's clients)
SELECT * FROM clients WHERE user_id = '<user_b_id>';
```

#### Test 1.3: User A cannot create client for User B
```sql
-- Login as User A
-- Expected: Error or rejection
INSERT INTO clients (user_id, name, hourly_rate) 
VALUES ('<user_b_id>', 'Test Client', 100);
```

#### Test 1.4: User A cannot update User B's client
```sql
-- Login as User A
-- Expected: 0 rows updated
UPDATE clients 
SET name = 'Hacked' 
WHERE id = '<user_b_client_id>';
```

#### Test 1.5: User A cannot delete User B's client
```sql
-- Login as User A
-- Expected: 0 rows deleted
DELETE FROM clients WHERE id = '<user_b_client_id>';
```

### 2. Invoices Table RLS Testing

#### Test 2.1: User A can only see their own invoices
```sql
-- Login as User A
-- Expected: Only User A's invoices
SELECT * FROM invoices;
```

#### Test 2.2: User A cannot access User B's invoices
```sql
-- Login as User A
-- Expected: Empty result set
SELECT * FROM invoices WHERE user_id = '<user_b_id>';
```

#### Test 2.3: User A cannot create invoice for User B
```sql
-- Login as User A
-- Expected: Error or rejection
INSERT INTO invoices (user_id, client_id, invoice_number, issue_date, total_amount, total_hours)
VALUES ('<user_b_id>', '<client_id>', 'INV-001', CURRENT_DATE, 1000, 10);
```

### 3. Credit Notes Table RLS Testing

#### Test 3.1: User A can only see their own credit notes
```sql
-- Login as User A
-- Expected: Only User A's credit notes
SELECT * FROM credit_notes;
```

#### Test 3.2: User A cannot access User B's credit notes
```sql
-- Login as User A
-- Expected: Empty result set
SELECT * FROM credit_notes WHERE user_id = '<user_b_id>';
```

### 4. Invoice Timelines Table RLS Testing

#### Test 4.1: User A can only see timelines for their own invoices
```sql
-- Login as User A
-- Expected: Only timelines for User A's invoices
SELECT * FROM invoice_timelines;
```

#### Test 4.2: User A cannot see timelines for User B's invoices
```sql
-- Login as User A
-- Expected: Empty result set even if invoice_id belongs to User B
SELECT * FROM invoice_timelines 
WHERE invoice_id IN (
  SELECT id FROM invoices WHERE user_id = '<user_b_id>'
);
```

#### Test 4.3: User A cannot create timeline for User B's invoice
```sql
-- Login as User A
-- Expected: Error or rejection
INSERT INTO invoice_timelines (user_id, invoice_id, event_type)
VALUES ('<user_a_id>', '<user_b_invoice_id>', 'created');
```

### 5. Providers Table RLS Testing

#### Test 5.1: User A can only see their own providers
```sql
-- Login as User A
-- Expected: Only User A's providers
SELECT * FROM providers;
```

#### Test 5.2: User A cannot access User B's providers
```sql
-- Login as User A
-- Expected: Empty result set
SELECT * FROM providers WHERE user_id = '<user_b_id>';
```

## Frontend Testing

### Test via Application UI

1. **Login as User A**
   - Create clients, invoices, etc.
   - Verify you can see your own data

2. **Login as User B**
   - Verify you cannot see User A's data
   - Create your own data
   - Verify you can only see your own data

3. **Test Real-time Subscriptions**
   - User A creates a record
   - User B should NOT receive real-time updates
   - Only User A should see the new record

### Test via Browser Console

```javascript
// As User A
const { data, error } = await supabase
  .from('invoices')
  .select('*')
  // Even without .eq('user_id', user.id), RLS should filter
  .order('created_at', { ascending: false });

console.log('User A invoices:', data);
// Should only show User A's invoices

// Try to access User B's invoice directly
const { data: otherData, error: otherError } = await supabase
  .from('invoices')
  .select('*')
  .eq('id', '<user_b_invoice_id>')
  .single();

console.log('Other user invoice:', otherData);
// Should be null or empty due to RLS
```

## Automated Testing Script

Create a test script to verify RLS policies:

```typescript
// test-rls.ts
import { createClient } from '@supabase/supabase-js';

async function testRLS() {
  // Test as User A
  const supabaseA = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${USER_A_TOKEN}`
      }
    }
  });

  // Test as User B
  const supabaseB = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${USER_B_TOKEN}`
      }
    }
  });

  // Test 1: User A should only see their own clients
  const { data: clientsA } = await supabaseA.from('clients').select('*');
  console.assert(
    clientsA?.every(c => c.user_id === USER_A_ID),
    'User A can see other users\' clients'
  );

  // Test 2: User A should not see User B's clients
  const { data: clientsB } = await supabaseA
    .from('clients')
    .select('*')
    .eq('user_id', USER_B_ID);
  console.assert(
    clientsB?.length === 0,
    'User A can see User B\'s clients'
  );

  // Test 3: User A cannot insert with User B's ID
  const { error: insertError } = await supabaseA
    .from('clients')
    .insert({
      user_id: USER_B_ID,
      name: 'Test Client',
      hourly_rate: 100
    });
  console.assert(
    insertError !== null,
    'User A can insert client with User B\'s ID'
  );
}

testRLS();
```

## Expected Results

### Successful RLS Implementation

✅ Users can only see their own data
✅ Users cannot see other users' data
✅ Users cannot create records for other users
✅ Users cannot update other users' records
✅ Users cannot delete other users' records
✅ Real-time subscriptions only receive updates for user's own data
✅ Queries return empty results (not errors) for unauthorized access

### Common Issues

❌ **Users can see other users' data**: RLS not enabled or policies incorrect
❌ **Insert succeeds with wrong user_id**: WITH CHECK clause missing or incorrect
❌ **Update/Delete succeeds on other user's data**: USING clause missing or incorrect
❌ **Real-time receives all updates**: Filter not applied in subscription

## Verification Checklist

- [ ] RLS enabled on all required tables
- [ ] Policies created for SELECT, INSERT, UPDATE, DELETE
- [ ] Policies use `auth.uid() = user_id` pattern
- [ ] Related tables (invoice_timelines) check parent ownership
- [ ] Frontend queries include user_id filters (defense in depth)
- [ ] Real-time subscriptions filter by user_id
- [ ] Tests pass for all tables
- [ ] Documentation updated

## Notes

- RLS policies are enforced at the database level, so they work even if frontend code has bugs
- Frontend filters (`.eq('user_id', user.id)`) are redundant but recommended for performance and clarity
- Real-time subscriptions should always include user_id filters for efficiency
- RLS does not prevent service role access (by design for admin operations)
