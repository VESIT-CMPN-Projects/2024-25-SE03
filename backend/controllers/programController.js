const Program = require('../models/Program');
const { validationResult } = require('express-validator');

// @desc    Get all programs
exports.getPrograms = async (req, res) => {
  try {
    const programs = await Program.find().sort({ startDate: -1 });
    res.json(programs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Add a new program (Admin-only)
exports.addProgram = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, image, startDate, endDate } = req.body;

  try {
    const newProgram = new Program({
      title,
      description,
      image,
      startDate,
      endDate
    });

    await newProgram.save();
    res.json(newProgram);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a program (Admin-only)
exports.updateProgram = async (req, res) => {
  const { title, description, image, isActive } = req.body;

  try {
    let program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ msg: 'Program not found' });
    }

    program = await Program.findByIdAndUpdate(
      req.params.id,
      { $set: { title, description, image, isActive } },
      { new: true }
    );

    res.json(program);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a program (Admin-only)
exports.deleteProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ msg: 'Program not found' });
    }

    await program.remove();
    res.json({ msg: 'Program removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};