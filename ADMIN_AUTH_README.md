# Lumera Admin Authentication System

## Overview
The Lumera Admin Authentication System provides secure access control for the admin panel using hashed passwords and protected routes. This system ensures that only authorized administrators can access sensitive store management functions.

## 🔐 Security Features

### Password Hashing
- **SHA-256 Hashing**: All passwords are hashed using SHA-256 cryptographic hash function
- **Salt-Free Implementation**: For demo purposes (in production, use bcrypt with salt)
- **Secure Storage**: Passwords are never stored in plain text

### Authentication Flow
1. **Login Form**: Secure login with username/password
2. **Password Verification**: Server-side password validation
3. **Session Management**: JWT-like session tokens stored in localStorage
4. **Protected Routes**: Automatic redirect to login for unauthenticated users
5. **Logout**: Secure session termination

## 🚀 Getting Started

### Default Admin Account
```
Username: admin
Password: admin123
```

**⚠️ Important**: Change the default password immediately after first login!

### Accessing the Admin Panel

#### Method 1: Direct URL
- Navigate to `/admin/login` for login
- Navigate to `/admin` for the dashboard (redirects to login if not authenticated)

#### Method 2: Header Navigation
- Click "Admin Login" button in header (when not authenticated)
- Click "Admin Panel" button in header (when authenticated)

#### Method 3: Quick Access Widget
- Floating admin button appears when authenticated
- Provides quick access to admin functions

## 🏗️ System Architecture

### Core Components

#### 1. Authentication Library (`src/lib/auth.ts`)
```typescript
// Password hashing and verification
export function hashPassword(password: string): string
export function verifyPassword(password: string, hashedPassword: string): boolean

// User management
export function authenticateAdmin(username: string, password: string): AdminUser | null
export function createAdminUser(userData: AdminUser, password: string): AdminUser
export function changeAdminPassword(username: string, newPassword: string): boolean
```

#### 2. Authentication Context (`src/context/admin-auth-context.tsx`)
```typescript
// Provides authentication state throughout the app
const { user, isAuthenticated, isLoading, login, logout, changePassword } = useAdminAuth();
```

#### 3. Protected Route Component (`src/components/admin/protected-admin-route.tsx`)
```typescript
// Wraps admin pages to ensure authentication
<ProtectedAdminRoute>
  <AdminDashboard />
</ProtectedAdminRoute>
```

#### 4. API Routes
- `/api/admin/login` - Handle login requests
- `/api/admin/change-password` - Handle password changes

### Data Models

#### AdminUser Interface
```typescript
interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'super_admin';
  createdAt: Date;
  lastLogin?: Date;
}
```

## 🔧 Configuration

### Password Requirements
- **Minimum Length**: 6 characters
- **Validation**: Server-side validation
- **Change Policy**: Must be different from current password

### Session Management
- **Storage**: localStorage (for demo purposes)
- **Persistence**: Survives browser refresh
- **Security**: Consider implementing JWT tokens for production

## 📱 User Interface

### Login Page (`/admin/login`)
- Clean, professional design
- Username and password fields
- Show/hide password functionality
- Error handling and validation
- Default credentials display

### Admin Dashboard (`/admin`)
- Protected route requiring authentication
- User information display
- Logout functionality
- Tabbed interface for different admin functions

### Settings Tab
- **Change Password**: Secure password update form
- **User Management**: Admin user administration
- **Store Configuration**: Future store settings

## 🛡️ Security Best Practices

### Current Implementation
✅ **Password Hashing**: SHA-256 hashing
✅ **Protected Routes**: Authentication required
✅ **Session Management**: Secure logout
✅ **Input Validation**: Server-side validation
✅ **Error Handling**: Secure error messages

### Production Recommendations
🔒 **Use bcrypt**: Replace SHA-256 with bcrypt + salt
🔒 **JWT Tokens**: Implement proper JWT authentication
🔒 **HTTPS Only**: Ensure all admin routes use HTTPS
🔒 **Rate Limiting**: Implement login attempt throttling
🔒 **Audit Logging**: Log all admin actions
🔒 **2FA Support**: Add two-factor authentication
🔒 **Password Policy**: Enforce strong password requirements

## 🔄 API Endpoints

### POST `/api/admin/login`
**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "id": "1",
  "username": "admin",
  "email": "admin@lumera.com",
  "role": "super_admin",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "lastLogin": "2024-01-15T10:30:00.000Z"
}
```

### POST `/api/admin/change-password`
**Request Body:**
```json
{
  "username": "admin",
  "currentPassword": "admin123",
  "newPassword": "newSecurePassword123"
}
```

**Response:**
```json
{
  "message": "Password changed successfully"
}
```

## 🚨 Error Handling

### Login Errors
- **Invalid Credentials**: "Invalid username or password"
- **Missing Fields**: "Username and password are required"
- **Server Errors**: "Internal server error"

### Password Change Errors
- **Current Password Mismatch**: "Failed to change password. Please check your current password."
- **Password Too Short**: "New password must be at least 6 characters long"
- **Password Mismatch**: "New passwords do not match"
- **Same Password**: "New password must be different from current password"

## 🔧 Customization

### Adding New Admin Users
```typescript
import { createAdminUser } from '@/lib/auth';

const newUser = createAdminUser({
  username: 'manager',
  email: 'manager@lumera.com',
  role: 'admin'
}, 'securePassword123');
```

### Changing Password
```typescript
import { changeAdminPassword } from '@/lib/auth';

const success = changeAdminPassword('admin', 'newSecurePassword');
```

### Custom Validation
```typescript
// Add custom password requirements
if (newPassword.length < 8) {
  throw new Error('Password must be at least 8 characters');
}

if (!/[A-Z]/.test(newPassword)) {
  throw new Error('Password must contain at least one uppercase letter');
}
```

## 🧪 Testing

### Test Credentials
```
Username: admin
Password: admin123
```

### Testing Scenarios
1. **Valid Login**: Should redirect to admin dashboard
2. **Invalid Login**: Should show error message
3. **Protected Route**: Should redirect to login if not authenticated
4. **Password Change**: Should validate and update password
5. **Logout**: Should clear session and redirect to login

## 🚀 Deployment Considerations

### Environment Variables
```env
# Production environment variables
ADMIN_SESSION_SECRET=your-secret-key-here
JWT_SECRET=your-jwt-secret-here
ADMIN_SESSION_TIMEOUT=3600
```

### Database Integration
```typescript
// Replace in-memory storage with database
import { prisma } from '@/lib/prisma';

export async function authenticateAdmin(username: string, password: string) {
  const user = await prisma.adminUser.findUnique({
    where: { username }
  });
  
  if (!user || !verifyPassword(password, user.hashedPassword)) {
    return null;
  }
  
  return user;
}
```

### Production Security
- **HTTPS Enforcement**: Redirect all HTTP to HTTPS
- **CORS Configuration**: Restrict admin API access
- **Rate Limiting**: Prevent brute force attacks
- **Session Timeout**: Automatic logout after inactivity
- **IP Whitelisting**: Restrict admin access to specific IPs

## 📚 Additional Resources

### Security Libraries
- **bcrypt**: For production password hashing
- **jsonwebtoken**: For JWT implementation
- **express-rate-limit**: For rate limiting
- **helmet**: For security headers

### Authentication Patterns
- **OAuth 2.0**: For third-party authentication
- **SAML**: For enterprise SSO
- **LDAP**: For directory service integration
- **2FA**: For additional security layer

---

## 🆘 Support

For technical support or security concerns:
1. **Check Logs**: Review server and browser console logs
2. **Verify Credentials**: Ensure correct username/password
3. **Clear Storage**: Clear localStorage and try again
4. **Check Network**: Verify API endpoints are accessible
5. **Contact Support**: Reach out to development team

**Security Notice**: If you suspect a security breach, immediately change all admin passwords and contact the security team.











