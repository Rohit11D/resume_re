const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const jwt = require("jsonwebtoken");
const authRoutes = require('./routes/auth');

const router = express.Router();
const multer = require('multer');
const resumeSchema = require('./models/Resume.js');
const reviewSchema = require('./models/Review.js');
const { protect, isExpert } = require('./middleware/authMiddleware');
const userSchema = require('./models/User.js');
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware for parsing JSON
app.use(express.json());

// Enable CORS
app.use(cors({
    origin:'http://localhost:3000', // Adjust this to match your frontend URL
    credentials: true,
}));



// Routes
app.use('/auth', authRoutes);
// app.use('/resume', resumeRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: err.message });
});

// Serve frontend (for production)
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'frontend/build')));

    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    );
} else {
    app.get('/', (req, res) => {
        res.send('API is running...');
    });
}



// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directory where files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to avoid filename conflicts
    }
});

const upload = multer({ storage: storage });
// Upload Resume
app.post('/upload', protect, upload.single('resume'), async (req, res) => {
    try {
        console.log('req.user:', req.user); // Debug log

        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const resume = new resumeSchema({
            student: req.user.id,
            resumeFile: req.file.path,
            reviews: []
        });

        await resume.save();
        res.status(201).json({ message: 'Resume uploaded successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});

// Static folder for resume uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Get All Resumes (For Experts)

app.get('/', protect, isExpert, async (req, res) => {
    try {
        const resumes = await resumeSchema.find().populate('student', 'name email');
        res.json(resumes);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});



// Fetch Resumes for the Logged-in Student
app.get('/myresumes', protect, async (req, res) => {
    try {
        const resumes = await resumeSchema.find({ student: req.user.id });
        res.json(resumes);
    } catch (error) {
        res.status(500).send({ message: 'Server Error' });
    }
});


// Review Resume
app.post('/review/:id', protect, isExpert, async (req, res) => {
    const { review } = req.body;

    try {
        const resume = await resumeSchema.findById(req.params.id);
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

// Creating end point for registering the user
app.post('/register',async(req,res)=>{
    let check = await userSchema.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,errors:"Email Already Exist"});
    }

    const user = new userSchema({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        role:req.body.role,
    })
    await user.save();

    const data ={
        user:{
            id:user.id
        }
    }
    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true,token});
})

// Login user route
app.post('/login',async(req,res)=>{
    let user = await userSchema.findOne({email:req.body.email});
    if(user){
        const passCompare = req.body.password === user.password;
        if(passCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom');
            res.json({success:true,token,user});
        }else{
            res.json({success:false,errors:"wrong password"});
        }
    }else{
        res.json({success:false,errors:"Email does not Exist"});

    }
})

// Get All Resumes (For Experts)
app.get('/resumes', protect, isExpert, async (req, res) => {
    try {
        const resumes = await resumeSchema.find()
            .populate('student', 'name')
            .populate('reviews.expert', 'name');
        res.json(resumes);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});


// Submit a review
app.post('/resumes/review/:id', protect, isExpert, async (req, res) => {
    const { review } = req.body;

    try {
        const resume = await resumeSchema.findById(req.params.id);
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


const PORT =5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
