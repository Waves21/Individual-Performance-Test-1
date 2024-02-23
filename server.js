const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mongo-test')
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Connection to MongoDB failed:', error);
});

// Course Schema
const courseSchema = new mongoose.Schema({
  code: String,
  description: String,
  units: Number,
  tags: [String]
});

// Course Model
const Course = mongoose.model('Course', courseSchema);

// Retrieve all published backend courses and sort them alphabetically by their names, along with their names and specializations
app.get('/courses', async (req, res) => {
  try {
    const backendCourses = await Course.find({ tags: 'Backend' });
    const sortedCourses = backendCourses.sort((a, b) => a.description.localeCompare(b.description));
    const formattedCourses = sortedCourses.map(course => ({
      name: course.description,
      specialization: course.tags.find(tag => tag !== 'Backend')
    }));
    res.json(formattedCourses);
  } catch (error) {
    console.error('Error retrieving courses:', error);
    res.status(500).json({ error: 'Failed to retrieve courses' });
  }
});

// Retrieve all published BSIS (Bachelor of Science in Information Systems) courses
app.get('/bsis-courses', async (req, res) => {
  try {
    const bsisCourses = await Course.find({ tags: 'BSIS' });
    res.json(bsisCourses);
  } catch (error) {
    console.error('Error retrieving BSIS courses:', error);
    res.status(500).json({ error: 'Failed to retrieve BSIS courses' });
  }
});

// Retrieve all published BSIT (Bachelor of Science in Information Technology) courses
app.get('/bsit-courses', async (req, res) => {
  try {
    const bsitCourses = await Course.find({ tags: 'BSIT' });
    res.json(bsitCourses);
  } catch (error) {
    console.error('Error retrieving BSIT courses:', error);
    res.status(500).json({ error: 'Failed to retrieve BSIT courses' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

