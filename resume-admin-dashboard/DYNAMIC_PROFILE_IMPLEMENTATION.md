# Dynamic Sidebar Profile Implementation

## Overview
The sidebar profile has been updated to dynamically fetch and display user data from the database instead of using static default values.

## How It Works

### Data Flow
1. **Frontend Hook** (`useSidebarProfile.ts`):
   - Fetches user data from `/api/admins/current` endpoint
   - Processes the response to build the profile with name, email, initials, and tagline
   - Stores the data in localStorage for persistence
   - Falls back to default values if the API call fails

2. **API Endpoint** (`/api/admins/current`):
   - Calls the backend to fetch the current admin user
   - Returns user data including: id, email, username, firstName, lastName, isAdmin

3. **Backend Controller** (`AdminProfileController.py`):
   - Uses `AdminUserRepository` to query the database
   - Fetches the first admin user from the users table
   - Returns formatted response with all user fields

4. **Database Entity** (`AdminUserEntity.py`):
   - Maps to the `users` table
   - Contains fields: id, email, username, first_name, last_name, is_active, is_admin

### Profile Building Logic

The profile is built with the following priority:

**Name Display:**
1. First name + Last name (if both available)
2. Username (if full name not available)
3. Email (if username not available)
4. Default profile name (fallback)

**Initials:**
- Computed from the display name
- Takes first letter of first two words
- Falls back to default initials if computation fails

**Tagline:**
- "Administrator" if `isAdmin` is true
- Default tagline otherwise

**Email:**
- Uses email from database
- Falls back to default email if not available

### LocalStorage Persistence

User data is cached in localStorage under the key `jobmatch.adminProfile` with the following structure:
```json
{
  "userId": 1,
  "email": "user@example.com",
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe",
  "isAdmin": true
}
```

This allows the profile to be displayed immediately on page load before the API call completes.

## Files Modified

1. **`frontend/lib/useSidebarProfile.ts`**
   - Updated to process firstName, lastName, and username from API response
   - Added logic to compute display name and initials dynamically
   - Set tagline based on isAdmin status

2. **`frontend/lib/sidebarProfile.ts`**
   - Updated ADMIN_TAGLINE constant to "Administrator"

## Usage in Components

All pages using the sidebar profile will now automatically display dynamic user data:

```typescript
const DEFAULT_SIDEBAR_PROFILE: SidebarProfile = {
  name: 'Admin User',      // Fallback only
  initials: 'AU',          // Fallback only
  tagline: 'Lead Admin',   // Fallback only
  email: 'admin@example.com', // Fallback only
};

const sidebarProfile = useSidebarProfile(DEFAULT_SIDEBAR_PROFILE);
```

The `DEFAULT_SIDEBAR_PROFILE` now serves only as a fallback when:
- The API call fails
- The user is not logged in
- The database has no admin user
- The component is rendered server-side

## Testing

To test the dynamic profile:

1. Ensure you have at least one user in the database with `is_admin = true`
2. Update the user's `first_name`, `last_name`, and `username` fields
3. Reload any page with the sidebar
4. The sidebar should display the user's actual name and email from the database

## Database Requirements

The `users` table should have the following structure:
- `id` (BigInteger, Primary Key)
- `email` (String, Required, Unique)
- `username` (String, Required, Unique)
- `first_name` (String, Optional)
- `last_name` (String, Optional)
- `is_active` (Boolean, Default: true)
- `is_admin` (Boolean, Default: false)
