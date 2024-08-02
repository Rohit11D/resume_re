const express = require('express');
const router = express.Router();
const multer = require('multer');
const Resume = require('../models/Resume');
const { protect, isExpert } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Upload Resume
router.post('/upload', protect, upload.single('resume'), async (req, res) => {
    try {
        const resume = new Resume({
            student: req.user._id,
            resumeFile: req.file.path
        });
        await resume.save();
        res.status(201).json({ message: 'Resume uploaded successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get All Resumes (For Experts)
router.get('/', protect, isExpert, async (req, res) => {
    try {
        const resumes = await Resume.find().populate('student', 'name email');
        res.json(resumes);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


router.get('/myresumes', protect, async (req, res) => {
    try {
        const resumes = await Resume.find({ student: req.user._id }).populate('reviews.expert', 'name');
        res.json(resumes);
    } catch (error) {
        res.status(500).send({ message: 'Server Error' });
    }
});

// Review Resume
router.post('/review/:id', protect, isExpert, async (req, res) => {
    const { review } = req.body;

    try {
        const resume = await Resume.findById(req.params.id);
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        resume.reviews.push({ expert: req.user._id, review });
        await resume.save();
        res.json({ message: 'Review added successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
