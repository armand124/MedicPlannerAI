const express = require('express');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { auth, requireRole } = require('../middleware/auth');
const { validateAppointmentCreation, validateAppointmentUpdate } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/appointments
// @desc    Get appointments for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { userId, role } = req.query;
    const currentUserId = req.user._id.toString();

    // Validate that user can only access their own appointments
    if (userId && userId !== currentUserId) {
      return res.status(403).json({
        message: 'Access denied. You can only view your own appointments.'
      });
    }

    let query = {};
    
    // Build query based on user role
    if (req.user.role === 'patient') {
      query.patientId = currentUserId;
    } else if (req.user.role === 'doctor') {
      query.doctorId = currentUserId;
    } else {
      return res.status(403).json({
        message: 'Invalid user role'
      });
    }

    // Add status filter if provided
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Add date range filter if provided
    if (req.query.startDate || req.query.endDate) {
      query.date = {};
      if (req.query.startDate) {
        query.date.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        query.date.$lte = new Date(req.query.endDate);
      }
    }

    const appointments = await Appointment.find(query)
      .populate('patientId', 'name email phone')
      .populate('doctorId', 'name email specialization')
      .sort({ date: -1, startTime: 1 })
      .lean();

    res.json({
      appointments: appointments.map(apt => ({
        _id: apt._id,
        patientId: apt.patientId._id || apt.patientId,
        patientName: apt.patientName,
        patientEmail: apt.patientEmail,
        patientPhone: apt.patientPhone,
        doctorId: apt.doctorId._id || apt.doctorId,
        doctorName: apt.doctorName,
        date: apt.date,
        startTime: apt.startTime,
        endTime: apt.endTime,
        status: apt.status,
        reason: apt.reason,
        symptoms: apt.symptoms,
        notes: apt.notes,
        diagnosis: apt.diagnosis,
        prescription: apt.prescription,
        createdAt: apt.createdAt,
        updatedAt: apt.updatedAt
      }))
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      message: 'Server error while fetching appointments'
    });
  }
});

// @route   POST /api/appointments
// @desc    Create a new appointment
// @access  Private
router.post('/', auth, requireRole(['patient']), validateAppointmentCreation, async (req, res) => {
  try {
    const appointmentData = {
      ...req.body,
      patientId: req.user._id, // Ensure patient can only create appointments for themselves
      patientName: req.user.name,
      patientEmail: req.user.email
    };

    // Verify doctor exists
    const doctor = await User.findById(req.body.doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(400).json({
        message: 'Invalid doctor selected'
      });
    }

    // Update doctor name from database
    appointmentData.doctorName = doctor.name;

    // Check for time conflicts
    const conflictingAppointment = await Appointment.findOne({
      doctorId: req.body.doctorId,
      date: new Date(req.body.date),
      $or: [
        {
          startTime: { $lt: req.body.endTime },
          endTime: { $gt: req.body.startTime }
        }
      ],
      status: { $in: ['scheduled'] }
    });

    if (conflictingAppointment) {
      return res.status(400).json({
        message: 'Time slot is already booked'
      });
    }

    const appointment = new Appointment(appointmentData);
    await appointment.save();

    // Populate the appointment data
    await appointment.populate([
      { path: 'patientId', select: 'name email phone' },
      { path: 'doctorId', select: 'name email specialization' }
    ]);

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment: {
        _id: appointment._id,
        patientId: appointment.patientId._id || appointment.patientId,
        patientName: appointment.patientName,
        patientEmail: appointment.patientEmail,
        patientPhone: appointment.patientPhone,
        doctorId: appointment.doctorId._id || appointment.doctorId,
        doctorName: appointment.doctorName,
        date: appointment.date,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        status: appointment.status,
        reason: appointment.reason,
        symptoms: appointment.symptoms,
        notes: appointment.notes,
        diagnosis: appointment.diagnosis,
        prescription: appointment.prescription,
        createdAt: appointment.createdAt,
        updatedAt: appointment.updatedAt
      }
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      message: 'Server error while creating appointment'
    });
  }
});

// @route   PUT /api/appointments/:id
// @desc    Update an appointment
// @access  Private
router.put('/:id', auth, validateAppointmentUpdate, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({
        message: 'Appointment not found'
      });
    }

    // Check if user can update this appointment
    const canUpdate = req.user.role === 'doctor' || 
                     (req.user.role === 'patient' && appointment.patientId.toString() === req.user._id.toString());

    if (!canUpdate) {
      return res.status(403).json({
        message: 'Access denied. You can only update your own appointments.'
      });
    }

    // Update appointment
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate([
      { path: 'patientId', select: 'name email phone' },
      { path: 'doctorId', select: 'name email specialization' }
    ]);

    res.json({
      message: 'Appointment updated successfully',
      appointment: {
        _id: updatedAppointment._id,
        patientId: updatedAppointment.patientId._id || updatedAppointment.patientId,
        patientName: updatedAppointment.patientName,
        patientEmail: updatedAppointment.patientEmail,
        patientPhone: updatedAppointment.patientPhone,
        doctorId: updatedAppointment.doctorId._id || updatedAppointment.doctorId,
        doctorName: updatedAppointment.doctorName,
        date: updatedAppointment.date,
        startTime: updatedAppointment.startTime,
        endTime: updatedAppointment.endTime,
        status: updatedAppointment.status,
        reason: updatedAppointment.reason,
        symptoms: updatedAppointment.symptoms,
        notes: updatedAppointment.notes,
        diagnosis: updatedAppointment.diagnosis,
        prescription: updatedAppointment.prescription,
        createdAt: updatedAppointment.createdAt,
        updatedAt: updatedAppointment.updatedAt
      }
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({
      message: 'Server error while updating appointment'
    });
  }
});

// @route   DELETE /api/appointments/:id
// @desc    Delete an appointment
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({
        message: 'Appointment not found'
      });
    }

    // Check if user can delete this appointment
    const canDelete = req.user.role === 'doctor' || 
                     (req.user.role === 'patient' && appointment.patientId.toString() === req.user._id.toString());

    if (!canDelete) {
      return res.status(403).json({
        message: 'Access denied. You can only delete your own appointments.'
      });
    }

    await Appointment.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({
      message: 'Server error while deleting appointment'
    });
  }
});

// @route   GET /api/appointments/:id
// @desc    Get a specific appointment
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'name email phone')
      .populate('doctorId', 'name email specialization');

    if (!appointment) {
      return res.status(404).json({
        message: 'Appointment not found'
      });
    }

    // Check if user can view this appointment
    const canView = req.user.role === 'doctor' || 
                   (req.user.role === 'patient' && appointment.patientId._id.toString() === req.user._id.toString());

    if (!canView) {
      return res.status(403).json({
        message: 'Access denied. You can only view your own appointments.'
      });
    }

    res.json({
      appointment: {
        _id: appointment._id,
        patientId: appointment.patientId._id || appointment.patientId,
        patientName: appointment.patientName,
        patientEmail: appointment.patientEmail,
        patientPhone: appointment.patientPhone,
        doctorId: appointment.doctorId._id || appointment.doctorId,
        doctorName: appointment.doctorName,
        date: appointment.date,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        status: appointment.status,
        reason: appointment.reason,
        symptoms: appointment.symptoms,
        notes: appointment.notes,
        diagnosis: appointment.diagnosis,
        prescription: appointment.prescription,
        createdAt: appointment.createdAt,
        updatedAt: appointment.updatedAt
      }
    });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({
      message: 'Server error while fetching appointment'
    });
  }
});

module.exports = router;
