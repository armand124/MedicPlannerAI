const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/doctors
// @desc    Get all available doctors
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const doctors = await User.find({ 
      role: 'doctor', 
      isActive: true 
    }).select('name email specialization phone availability');

    res.json({
      doctors: doctors.map(doctor => ({
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialization: doctor.specialization,
        phone: doctor.phone,
        availability: doctor.availability
      }))
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({
      message: 'Server error while fetching doctors'
    });
  }
});

module.exports = router;
