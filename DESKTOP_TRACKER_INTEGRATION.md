
# Desktop Tracker Integration Guide

This guide explains how to integrate your desktop time tracking application with the SmartBill Supabase backend.

## Overview

The desktop tracker integration uses the Supabase service role to bypass Row Level Security (RLS) policies, allowing desktop applications to upload time entries directly to the database.

## Files Created

- `src/integrations/supabase/desktop-client.ts` - Supabase client configured for desktop apps
- `src/integrations/supabase/desktop-api.ts` - API utilities for desktop integration

## Quick Start

### 1. Install Dependencies (if creating a Node.js desktop tracker)

```bash
npm install @supabase/supabase-js
```

### 2. Basic Usage

```javascript
import { uploadTimeEntry, testConnection, getUserIdFromEmail } from './src/integrations/supabase/desktop-api.js';

// Test connection first
const connectionTest = await testConnection();
if (!connectionTest.success) {
  console.error('Connection failed:', connectionTest.error);
  return;
}

// Get user ID from email (if you don't have the UUID)
const userResult = await getUserIdFromEmail('user@example.com');
if (!userResult.success) {
  console.error('User not found:', userResult.error);
  return;
}

// Upload a time entry
const timeEntry = {
  user_id: userResult.data, // UUID from getUserIdFromEmail
  timestamp: new Date().toISOString(), // Current time in ISO format
  duration: 3600, // 1 hour in seconds
  application: 'Visual Studio Code',
  window_title: 'SmartBill - desktop-api.ts',
  notes: 'Working on desktop integration', // Optional
  client_id: null // Optional - client UUID if available
};

const result = await uploadTimeEntry(timeEntry);
if (result.success) {
  console.log('Time entry uploaded successfully:', result.data);
} else {
  console.error('Upload failed:', result.error);
}
```

## Data Format

### TimeEntryData Interface

```typescript
interface TimeEntryData {
  user_id: string;      // UUID of the user (required)
  timestamp: string;    // ISO 8601 date string (required)
  duration: number;     // Duration in seconds (required)
  application: string;  // Application name (required)
  window_title: string; // Window title (required)
  notes?: string;       // Optional notes
  client_id?: string;   // Optional client UUID
}
```

### Example Data

```javascript
{
  user_id: "123e4567-e89b-12d3-a456-426614174000",
  timestamp: "2024-01-29T14:30:00.000Z",
  duration: 1800, // 30 minutes
  application: "Google Chrome",
  window_title: "SmartBill Dashboard - localhost:5173",
  notes: "Testing the application",
  client_id: "456e7890-e89b-12d3-a456-426614174001" // Optional
}
```

## Security Notes

⚠️ **Important Security Information:**

1. **Service Role Key**: The desktop client uses a service role key that bypasses RLS. This key should NEVER be exposed in frontend applications or public repositories.

2. **Desktop Only**: This integration is designed specifically for desktop applications running on user machines, not for web applications.

3. **User Validation**: Always validate that the user_id being used is legitimate and belongs to the correct user.

## Error Handling

The API returns standardized responses:

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;      // Present when success is true
  error?: string; // Present when success is false
}
```

Common error scenarios:
- Missing required fields
- Invalid UUID format for user_id
- Invalid timestamp format
- Invalid duration (must be > 0)
- Network/database connection issues

## Testing

Use the `testConnection()` function to verify that your desktop app can connect to Supabase:

```javascript
const test = await testConnection();
console.log('Connection test:', test.success ? 'PASSED' : 'FAILED');
if (!test.success) {
  console.error('Error:', test.error);
}
```

## Getting User Information

If your desktop app only knows the user's email address, you can get their UUID:

```javascript
const userResult = await getUserIdFromEmail('user@example.com');
if (userResult.success) {
  console.log('User ID:', userResult.data);
} else {
  console.error('User not found:', userResult.error);
}
```

## Web App Integration

The web application continues to use the regular Supabase client with authentication. Users can view their time entries through the web interface, and the desktop tracker data will appear seamlessly alongside any manual entries.

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify that the user exists in the system (they must sign up through the web app first)
3. Ensure all required fields are provided and properly formatted
4. Test the connection using the `testConnection()` function
