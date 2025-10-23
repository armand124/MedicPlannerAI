require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const connectDB = require('../config/database');

const seedData = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Appointment.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create sample users
    const patients = await User.create([
      {
        email: 'john.patient@example.com',
        password: 'Patient123!',
        name: 'John Smith',
        role: 'patient',
        phone: '(555) 123-4567',
        dateOfBirth: new Date('1990-05-15'),
        address: '123 Main St, Anytown, USA',
        medicalHistory: ['Hypertension', 'Diabetes Type 2']
      },
      {
        email: 'jane.patient@example.com',
        password: 'Patient123!',
        name: 'Jane Doe',
        role: 'patient',
        phone: '(555) 234-5678',
        dateOfBirth: new Date('1985-08-22'),
        address: '456 Oak Ave, Somewhere, USA',
        medicalHistory: ['Allergies']
      },
      {
        email: 'bob.patient@example.com',
        password: 'Patient123!',
        name: 'Bob Johnson',
        role: 'patient',
        phone: '(555) 345-6789',
        dateOfBirth: new Date('1978-12-03'),
        address: '789 Pine St, Elsewhere, USA',
        medicalHistory: []
      }
    ]);

    const doctors = await User.create([
      {
        email: 'dr.sarah@example.com',
        password: 'Doctor123!',
        name: 'Dr. Sarah Johnson',
        role: 'doctor',
        phone: '(555) 111-2222',
        specialization: 'Internal Medicine',
        licenseNumber: 'MD123456',
        availability: [
          { day: 'monday', startTime: '09:00', endTime: '17:00' },
          { day: 'tuesday', startTime: '09:00', endTime: '17:00' },
          { day: 'wednesday', startTime: '09:00', endTime: '17:00' },
          { day: 'thursday', startTime: '09:00', endTime: '17:00' },
          { day: 'friday', startTime: '09:00', endTime: '15:00' }
        ]
      },
      {
        email: 'dr.mike@example.com',
        password: 'Doctor123!',
        name: 'Dr. Michael Brown',
        role: 'doctor',
        phone: '(555) 333-4444',
        specialization: 'Cardiology',
        licenseNumber: 'MD789012',
        availability: [
          { day: 'monday', startTime: '08:00', endTime: '16:00' },
          { day: 'tuesday', startTime: '08:00', endTime: '16:00' },
          { day: 'wednesday', startTime: '08:00', endTime: '16:00' },
          { day: 'thursday', startTime: '08:00', endTime: '16:00' },
          { day: 'friday', startTime: '08:00', endTime: '14:00' }
        ]
      }
    ]);

    console.log('👥 Created sample users');

    // Create sample appointments
    const appointments = await Appointment.create([
      {
        patientId: patients[0]._id,
        patientName: patients[0].name,
        patientEmail: patients[0].email,
        patientPhone: patients[0].phone,
        doctorId: doctors[0]._id,
        doctorName: doctors[0].name,
        date: new Date('2024-12-20'),
        startTime: '09:00',
        endTime: '09:30',
        status: 'scheduled',
        reason: 'Annual checkup',
        symptoms: 'General health check',
        notes: '',
        diagnosis: '',
        prescription: ''
      },
      {
        patientId: patients[1]._id,
        patientName: patients[1].name,
        patientEmail: patients[1].email,
        patientPhone: patients[1].phone,
        doctorId: doctors[0]._id,
        doctorName: doctors[0].name,
        date: new Date('2024-12-21'),
        startTime: '10:00',
        endTime: '10:30',
        status: 'scheduled',
        reason: 'Follow-up consultation',
        symptoms: 'Headache, fatigue',
        notes: '',
        diagnosis: '',
        prescription: ''
      },
      {
        patientId: patients[2]._id,
        patientName: patients[2].name,
        patientEmail: patients[2].email,
        patientPhone: patients[2].phone,
        doctorId: doctors[1]._id,
        doctorName: doctors[1].name,
        date: new Date('2024-12-19'),
        startTime: '14:00',
        endTime: '14:30',
        status: 'completed',
        reason: 'Heart checkup',
        symptoms: 'Chest pain',
        notes: 'Patient reports mild chest discomfort. EKG normal.',
        diagnosis: 'Anxiety-related chest pain. No cardiac issues detected.',
        prescription: 'Recommend stress management and regular exercise.'
      },
      {
        patientId: patients[0]._id,
        patientName: patients[0].name,
        patientEmail: patients[0].email,
        patientPhone: patients[0].phone,
        doctorId: doctors[1]._id,
        doctorName: doctors[1].name,
        date: new Date('2024-12-18'),
        startTime: '11:00',
        endTime: '11:30',
        status: 'completed',
        reason: 'Cardiology consultation',
        symptoms: 'Shortness of breath',
        notes: 'Patient has diabetes and hypertension. Blood pressure elevated.',
        diagnosis: 'Hypertensive heart disease. Recommend medication adjustment.',
        prescription: 'Increase ACE inhibitor dosage. Follow up in 3 months.'
      }
    ]);

    console.log('📅 Created sample appointments');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Sample Accounts:');
    console.log('Patients:');
    patients.forEach(patient => {
      console.log(`  Email: ${patient.email} | Password: Patient123!`);
    });
    console.log('\nDoctors:');
    doctors.forEach(doctor => {
      console.log(`  Email: ${doctor.email} | Password: Doctor123!`);
    });

    console.log('\n🚀 You can now start the server with: npm run dev');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedData();
}

module.exports = seedData;
