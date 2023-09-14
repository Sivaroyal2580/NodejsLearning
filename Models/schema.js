const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: String,
  instructor: String,
  duration: Number,
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;