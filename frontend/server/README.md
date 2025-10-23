# MedicPlannerAI Backend

A comprehensive backend API for the MedicPlannerAI medical appointment management system, built with Node.js, Express, and MongoDB.

## 🚀 Features

- **JWT Authentication** - Secure user authentication and authorization
- **Role-based Access Control** - Separate permissions for patients and doctors
- **Appointment Management** - Full CRUD operations for medical appointments
- **MongoDB Integration** - Robust data persistence with Mongoose ODM
- **Input Validation** - Comprehensive request validation and sanitization
- **Security** - Helmet, CORS, rate limiting, and password hashing
- **Error Handling** - Centralized error handling with detailed logging
- **API Documentation** - Well-documented RESTful endpoints

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/medicplannerai
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=http://localhost:5173
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Start MongoDB**
   - Local: `mongod`
   - Atlas: Update `MONGODB_URI` in `.env`

5. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user profile

### Appointments
- `GET /api/appointments` - Get user's appointments
- `POST /api/appointments` - Create new appointment (patients only)
- `GET /api/appointments/:id` - Get specific appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Health Check
- `GET /api/health` - Server health status

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 👥 User Roles

### Patient
- Create appointments
- View own appointments
- Update own appointment details (limited fields)

### Doctor
- View assigned appointments
- Update appointment notes, diagnosis, and status
- Delete appointments

## 🗄️ Database Schema

### User Model
```javascript
{
  email: String (unique, required)
  password: String (hashed, required)
  name: String (required)
  role: String (enum: ['patient', 'doctor'])
  phone: String (optional)
  // Patient fields
  dateOfBirth: Date
  address: String
  medicalHistory: [String]
  // Doctor fields
  specialization: String
  licenseNumber: String (unique)
  availability: [Object]
}
```

### Appointment Model
```javascript
{
  patientId: ObjectId (ref: User)
  patientName: String
  patientEmail: String
  patientPhone: String
  doctorId: ObjectId (ref: User)
  doctorName: String
  date: Date
  startTime: String
  endTime: String
  status: String (enum: ['scheduled', 'completed', 'cancelled', 'no-show'])
  reason: String
  symptoms: String
  notes: String
  diagnosis: String
  prescription: String
}
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medicplannerai
JWT_SECRET=your-production-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend-domain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### PM2 Deployment
```bash
npm install -g pm2
pm2 start src/server.js --name "medicplannerai-api"
pm2 save
pm2 startup
```

## 🔧 Development

### Project Structure
```
server/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── models/
│   │   ├── User.js
│   │   └── Appointment.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── appointments.js
│   ├── scripts/
│   │   └── seed.js
│   └── server.js
├── package.json
├── env.example
└── README.md
```

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data
- `npm test` - Run tests

## 🛡️ Security Features

- **Password Hashing** - bcrypt with salt rounds
- **JWT Tokens** - Secure authentication tokens
- **Rate Limiting** - Prevent API abuse
- **CORS** - Cross-origin resource sharing protection
- **Helmet** - Security headers
- **Input Validation** - Request validation and sanitization
- **Error Handling** - Secure error responses

## 📊 Monitoring

The API includes health check endpoints and logging for monitoring:
- Health check: `GET /api/health`
- Request logging with Morgan
- Error logging with detailed stack traces

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the error logs

---

**MedicPlannerAI Backend** - Built with ❤️ for better healthcare management
