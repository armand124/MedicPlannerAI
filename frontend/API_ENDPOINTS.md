# API Endpoints Required

Your backend server needs to implement the following endpoints to work with the frontend:

## Authentication Endpoints

### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name",
  "role": "patient" | "doctor",
  "phone": "(555) 123-4567" // optional
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "patient",
    "phone": "(555) 123-4567",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

### POST /api/auth/login
Login user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "patient",
    "phone": "(555) 123-4567",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

### GET /api/auth/verify
Verify JWT token and get user info.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "patient",
    "phone": "(555) 123-4567",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### POST /api/auth/logout
Logout user (invalidate token).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

## Doctor Endpoints

### GET /api/doctors
Get all available doctors.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "doctors": [
    {
      "_id": "doctor_id",
      "name": "Dr. Sarah Johnson",
      "email": "dr.sarah@example.com",
      "specialization": "Internal Medicine",
      "phone": "(555) 111-2222",
      "availability": [
        {
          "day": "monday",
          "startTime": "09:00",
          "endTime": "17:00"
        }
      ]
    }
  ]
}
```

## Appointment Endpoints

### GET /api/appointments
Get appointments for a user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `userId`: User ID
- `role`: "patient" or "doctor"

**Response:**
```json
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
      "notes": "",
      "diagnosis": "",
      "prescription": "",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### POST /api/appointments
Create a new appointment.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
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
  "symptoms": "None",
  "questionnaire": {
    "specialization": "Internal Medicine",
    "questions": [
      {
        "questionId": 1,
        "value": "Answer text"
      }
    ]
  }
}
```

**Response:**
```json
{
  "message": "Appointment created successfully",
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

### PUT /api/appointments/:id
Update an appointment.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "notes": "Updated doctor notes",
  "diagnosis": "Updated diagnosis",
  "status": "completed"
}
```

**Response:**
```json
{
  "message": "Appointment updated successfully",
  "appointment": {
    "_id": "appointment_id",
    // ... full appointment object
  }
}
```

## Questionnaire Endpoints

### GET /api/questionnaire
Get questionnaire specification for a specialization.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `specialization`: Specialization name (e.g., "Internal Medicine")

**Response:**
```json
{
  "specialization": "Internal Medicine",
  "questions": [
    {
      "questionId": 1,
      "question": "What is your age?",
      "hasOptions": false,
      "value": "number"
    },
    {
      "questionId": 2,
      "question": "Do you have any allergies?",
      "hasOptions": true,
      "options": ["Yes", "No", "Not sure"]
    }
  ]
}
```

## Error Responses

All endpoints should return errors in this format:

```json
{
  "message": "Error description",
  "statusCode": 400
}
```

## Authentication

- All protected endpoints require `Authorization: Bearer <jwt_token>` header
- JWT tokens should be validated on the server
- Return 401 for invalid/expired tokens
- Return 403 for insufficient permissions

## CORS

Make sure your server allows requests from your frontend domain:
- Origin: `http://localhost:5173` (development)
- Methods: GET, POST, PUT, DELETE, OPTIONS
- Headers: Content-Type, Authorization
