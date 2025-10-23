# Authentication System Documentation

## Overview

This document describes the authentication system implemented in the MedicPlannerAI website. The system provides secure user authentication with role-based access control for both patients and doctors.

## Features

- **JWT-based Authentication**: Secure token-based authentication
- **Role-based Access Control**: Separate access for patients and doctors
- **Persistent Sessions**: User sessions persist across browser refreshes
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Server Integration**: Ready for backend API integration

## Architecture

### Components

1. **AuthContext** (`src/contexts/AuthContext.tsx`)
   - Manages global authentication state
   - Handles login, signup, and logout operations
   - Provides user data and loading states

2. **ProtectedRoute** (`src/components/ProtectedRoute.tsx`)
   - Wraps protected pages
   - Redirects unauthenticated users to login
   - Enforces role-based access control

3. **Auth Page** (`src/pages/Auth.tsx`)
   - Login and registration forms
   - Handles form validation and submission
   - Automatic redirection after successful authentication

4. **API Utilities** (`src/lib/api.ts`)
   - Centralized API request handling
   - Automatic token attachment
   - Error handling and response parsing

## API Endpoints Required

Your server should implement the following endpoints:

### Authentication Endpoints

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "patient" | "doctor",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name",
  "role": "patient" | "doctor"
}

Response:
{
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "patient" | "doctor",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

```
GET /api/auth/verify
Authorization: Bearer jwt_token_here

Response:
{
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "patient" | "doctor",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

```
POST /api/auth/logout
Authorization: Bearer jwt_token_here

Response:
{
  "message": "Logged out successfully"
}
```

### Appointment Endpoints

```
GET /api/appointments?userId={userId}&role={role}
Authorization: Bearer jwt_token_here

Response:
{
  "appointments": [
    {
      "_id": "appointment_id",
      "patientId": "patient_id",
      "patientName": "Patient Name",
      "patientEmail": "patient@example.com",
      "patientPhone": "(555) 123-4567",
      "doctorId": "doctor_id",
      "doctorName": "Dr. Doctor Name",
      "date": "2024-01-01T00:00:00.000Z",
      "startTime": "09:00",
      "endTime": "09:30",
      "status": "scheduled",
      "reason": "Checkup",
      "symptoms": "None",
      "notes": "Doctor notes",
      "diagnosis": "Healthy",
      "prescription": "None",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

```
POST /api/appointments
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "patientId": "patient_id",
  "patientName": "Patient Name",
  "patientEmail": "patient@example.com",
  "patientPhone": "(555) 123-4567",
  "doctorId": "doctor_id",
  "doctorName": "Dr. Doctor Name",
  "date": "2024-01-01T00:00:00.000Z",
  "startTime": "09:00",
  "endTime": "09:30",
  "status": "scheduled",
  "reason": "Checkup",
  "symptoms": "None"
}

Response:
{
  "appointment": {
    "_id": "appointment_id",
    "patientId": "patient_id",
    "patientName": "Patient Name",
    "patientEmail": "patient@example.com",
    "patientPhone": "(555) 123-4567",
    "doctorId": "doctor_id",
    "doctorName": "Dr. Doctor Name",
    "date": "2024-01-01T00:00:00.000Z",
    "startTime": "09:00",
    "endTime": "09:30",
    "status": "scheduled",
    "reason": "Checkup",
    "symptoms": "None",
    "notes": "",
    "diagnosis": "",
    "prescription": "",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

```
PUT /api/appointments/{appointmentId}
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "notes": "Updated doctor notes",
  "diagnosis": "Updated diagnosis",
  "status": "completed"
}

Response:
{
  "appointment": {
    "_id": "appointment_id",
    "patientId": "patient_id",
    "patientName": "Patient Name",
    "patientEmail": "patient@example.com",
    "patientPhone": "(555) 123-4567",
    "doctorId": "doctor_id",
    "doctorName": "Dr. Doctor Name",
    "date": "2024-01-01T00:00:00.000Z",
    "startTime": "09:00",
    "endTime": "09:30",
    "status": "completed",
    "reason": "Checkup",
    "symptoms": "None",
    "notes": "Updated doctor notes",
    "diagnosis": "Updated diagnosis",
    "prescription": "",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Configuration

### Environment Variables

Create a `.env` file in your project root:

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api

# Environment
VITE_NODE_ENV=development
```

### API Base URL

The system uses `VITE_API_URL` environment variable for the API base URL. If not set, it defaults to `http://localhost:3000/api`.

## Usage

### Authentication Flow

1. **Initial Load**: App checks for stored token and verifies it with server
2. **Login/Register**: User submits credentials, receives JWT token
3. **Token Storage**: Token and user data stored in localStorage
4. **Protected Access**: All protected routes check authentication status
5. **Logout**: Token invalidated on server and cleared from localStorage

### Route Protection

```tsx
// Protect a route for all authenticated users
<ProtectedRoute>
  <MyComponent />
</ProtectedRoute>

// Protect a route for specific roles
<ProtectedRoute allowedRoles={['doctor']}>
  <DoctorDashboard />
</ProtectedRoute>

// Custom redirect for unauthenticated users
<ProtectedRoute redirectTo="/custom-login">
  <MyComponent />
</ProtectedRoute>
```

### Using Authentication in Components

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, login, logout, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <p>Role: {user.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Security Considerations

1. **Token Storage**: JWT tokens are stored in localStorage for persistence
2. **Token Verification**: Tokens are verified with the server on app initialization
3. **Automatic Logout**: Invalid tokens are automatically cleared
4. **HTTPS**: Ensure all API communication uses HTTPS in production
5. **Token Expiration**: Implement proper token expiration on the server

## Error Handling

The system handles various error scenarios:

- **Network Errors**: Graceful fallback when server is unavailable
- **Invalid Tokens**: Automatic token cleanup and redirect to login
- **Authentication Failures**: User-friendly error messages
- **Role Mismatches**: Automatic redirection to appropriate dashboard

## Testing

To test the authentication system:

1. **Start your backend server** with the required API endpoints
2. **Set the API URL** in your environment variables
3. **Navigate to the app** - should show landing page
4. **Try to access protected routes** - should redirect to login
5. **Register a new account** - should create user and redirect to dashboard
6. **Logout and login** - should work with existing credentials
7. **Refresh the page** - should maintain authentication state

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your backend allows requests from your frontend domain
2. **Token Not Found**: Check that the API returns the token in the expected format
3. **Redirect Loops**: Verify that the authentication state is properly managed
4. **Role Access Issues**: Ensure the user role matches the expected role for protected routes

### Debug Mode

Enable debug logging by adding this to your browser console:

```javascript
localStorage.setItem('debug', 'true');
```

This will log authentication events to the console.
