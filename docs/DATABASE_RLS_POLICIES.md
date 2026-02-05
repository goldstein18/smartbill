# Database Row Level Security (RLS) Policies

## Overview

This document describes the Row Level Security (RLS) policies implemented in the SmartBill database. RLS ensures that users can only access data that belongs to them, providing a critical layer of data privacy and security.

**Migration File**: `supabase/migrations/20250205000000_enable_rls_all_tables.sql`

## Tables with RLS Enabled

The following tables have RLS enabled with user-based access policies:

1. **clients** - Client information
2. **invoices** - Invoice records
3. **credit_notes** - Credit note records
4. **invoice_timelines** - Invoice event history
5. **providers** - Provider/vendor information

## Policy Structure

All tables follow the same pattern with four policies:

- **SELECT**: Users can view their own records
- **INSERT**: Users can create records with their own user_id
- **UPDATE**: Users can update their own records
- **DELETE**: Users can delete their own records

## Detailed Policies

### 1. Clients Table

**RLS Enabled**: Yes

**Policies**:
- `Users can view their own clients`: `auth.uid() = user_id`
- `Users can create their own clients`: `auth.uid() = user_id` (WITH CHECK)
- `Users can update their own clients`: `auth.uid() = user_id`
- `Users can delete their own clients`: `auth.uid() = user_id`

**Access Pattern**: Direct user ownership via `user_id` column.

### 2. Invoices Table

**RLS Enabled**: Yes

**Policies**:
- `Users can view their own invoices`: `auth.uid() = user_id`
- `Users can create their own invoices`: `auth.uid() = user_id` (WITH CHECK)
- `Users can update their own invoices`: `auth.uid() = user_id`
- `Users can delete their own invoices`: `auth.uid() = user_id`

**Access Pattern**: Direct user ownership via `user_id` column.

**Related Tables**:
- `invoice_items`: Access controlled through parent `invoices` table ownership
- `invoice_timelines`: Access controlled through parent `invoices` table ownership

### 3. Credit Notes Table

**RLS Enabled**: Yes

**Policies**:
- `Users can view their own credit notes`: `auth.uid() = user_id`
- `Users can create their own credit notes`: `auth.uid() = user_id` (WITH CHECK)
- `Users can update their own credit notes`: `auth.uid() = user_id`
- `Users can delete their own credit notes`: `auth.uid() = user_id`

**Access Pattern**: Direct user ownership via `user_id` column.

**Constraints**:
- Unique constraint on `(user_id, credit_number)` ensures unique credit numbers per user

### 4. Invoice Timelines Table

**RLS Enabled**: Yes

**Policies**:
- `Users can view their own invoice timelines`: Access via parent invoice ownership
- `Users can create their own invoice timelines`: Requires both `auth.uid() = user_id` AND invoice ownership
- `Users can update their own invoice timelines`: Requires both `auth.uid() = user_id` AND invoice ownership
- `Users can delete their own invoice timelines`: Requires both `auth.uid() = user_id` AND invoice ownership

**Access Pattern**: Indirect access through parent `invoices` table. Users can only access timelines for invoices they own.

**Policy Logic**:
```sql
EXISTS (
  SELECT 1 FROM public.invoices 
  WHERE invoices.id = invoice_timelines.invoice_id 
  AND invoices.user_id = auth.uid()
)
```

### 5. Providers Table

**RLS Enabled**: Yes

**Policies**:
- `Users can view their own providers`: `auth.uid() = user_id`
- `Users can create their own providers`: `auth.uid() = user_id` (WITH CHECK)
- `Users can update their own providers`: `auth.uid() = user_id`
- `Users can delete their own providers`: `auth.uid() = user_id`

**Access Pattern**: Direct user ownership via `user_id` column.

## Security Guarantees

1. **Data Isolation**: Users can only access data where `auth.uid() = user_id`
2. **Prevent Data Leakage**: RLS policies are enforced at the database level, preventing accidental exposure
3. **Insert Protection**: WITH CHECK clauses ensure users cannot insert records with other users' IDs
4. **Update Protection**: USING clauses ensure users cannot update records belonging to other users
5. **Delete Protection**: USING clauses ensure users cannot delete records belonging to other users

## Frontend Implementation

The frontend queries already include explicit `user_id` filters (e.g., `.eq('user_id', user.id)`), which is a best practice for:

1. **Performance**: Reduces the dataset size before RLS evaluation
2. **Clarity**: Makes the intent explicit in the code
3. **Defense in Depth**: Provides an additional layer of security

**Example**:
```typescript
const { data, error } = await supabase
  .from('invoices')
  .select('*')
  .eq('user_id', user.id)  // Explicit filter (redundant but safe with RLS)
  .order('created_at', { ascending: false });
```

## Testing RLS Policies

To verify RLS is working correctly:

1. **Test as User A**: Create records and verify you can only see your own data
2. **Test as User B**: Verify you cannot see User A's data
3. **Test Unauthorized Access**: Attempt to access records with different user_id should return empty results or errors
4. **Test Insert**: Attempting to insert with wrong user_id should fail (WITH CHECK)
5. **Test Update**: Attempting to update another user's record should fail
6. **Test Delete**: Attempting to delete another user's record should fail

## Performance Considerations

- All tables have indexes on `user_id` columns for optimal query performance
- RLS policies use efficient `auth.uid()` function which is cached per request
- Related table policies (like `invoice_timelines`) use EXISTS subqueries which are optimized by PostgreSQL

## Related Tables

### Invoice Items
- Access controlled through parent `invoices` table
- Policies check invoice ownership before allowing access

### Time Entries
- Has its own RLS policies (not covered in this document)
- Also uses `auth.uid() = user_id` pattern

## Migration Notes

The migration file `20250205000000_enable_rls_all_tables.sql`:
- Uses `DROP POLICY IF EXISTS` to ensure clean state
- Uses `CREATE TABLE IF NOT EXISTS` for tables that may not exist
- Creates necessary indexes for performance
- Includes comments explaining each policy

## Compliance

This implementation satisfies:
- **DATA-01**: Implementación de RLS y políticas de privacidad de datos
- Ensures users can only access their own data
- Prevents unauthorized data access
- Provides audit trail through database-level security
