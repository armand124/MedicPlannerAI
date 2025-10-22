import { useState, useEffect } from 'react';
import { Appointment } from '@/types';

// Mock appointments data - to be replaced with MongoDB API calls
const mockAppointments: Appointment[] = [
  {
    _id: 'apt_1',
    patientId: 'patient_1',
    patientName: 'John Smith',
    patientEmail: 'john@example.com',
    patientPhone: '(555) 123-4567',
    doctorId: 'doctor_1',
    doctorName: 'Dr. Sarah Johnson',
    date: new Date('2025-10-25'),
    startTime: '09:00',
    endTime: '09:30',
    status: 'scheduled',
    reason: 'Annual checkup',
    symptoms: 'General health check',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'apt_2',
    patientId: 'patient_2',
    patientName: 'Emily Davis',
    patientEmail: 'emily@example.com',
    patientPhone: '(555) 234-5678',
    doctorId: 'doctor_1',
    doctorName: 'Dr. Sarah Johnson',
    date: new Date('2025-10-22'),
    startTime: '10:00',
    endTime: '10:30',
    status: 'scheduled',
    reason: 'Follow-up consultation',
    symptoms: 'Headache, fatigue',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const useAppointments = (userId?: string, role?: 'patient' | 'doctor') => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual MongoDB API call
    // Example: fetch(`/api/appointments?userId=${userId}&role=${role}`)
    
    const fetchAppointments = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter appointments based on user role
      let filtered = [...mockAppointments];
      if (role === 'patient' && userId) {
        filtered = filtered.filter(apt => apt.patientId === userId);
      } else if (role === 'doctor' && userId) {
        filtered = filtered.filter(apt => apt.doctorId === userId);
      }
      
      setAppointments(filtered);
      setIsLoading(false);
    };

    fetchAppointments();
  }, [userId, role]);

  const createAppointment = async (appointment: Omit<Appointment, '_id' | 'createdAt' | 'updatedAt'>) => {
    // TODO: Replace with actual MongoDB API call
    // Example: fetch('/api/appointments', { method: 'POST', body: JSON.stringify(appointment) })
    
    const newAppointment: Appointment = {
      ...appointment,
      _id: `apt_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setAppointments(prev => [...prev, newAppointment]);
    return newAppointment;
  };

  const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    // TODO: Replace with actual MongoDB API call
    // Example: fetch(`/api/appointments/${id}`, { method: 'PATCH', body: JSON.stringify(updates) })
    
    setAppointments(prev =>
      prev.map(apt => (apt._id === id ? { ...apt, ...updates, updatedAt: new Date() } : apt))
    );
  };

  return {
    appointments,
    isLoading,
    createAppointment,
    updateAppointment,
  };
};
