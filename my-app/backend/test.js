const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://saish:SC2006@cluster0.ql7tv.mongodb.net/UserInfo?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Enhanced User Schema
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    password: String
});

// Password hashing middleware
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Password comparison method
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', UserSchema);

// Auth Routes
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        
        // Validate input
        if (!(email || phone) || !password) {
            return res.status(400).json({ message: 'Email/phone and password required' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ 
            $or: [
                { email },
                { phone }
            ]
        });
        
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        // Create new user
        const newUser = new User({
            name,
            email,
            phone,
            password
        });
        
        await newUser.save();
        
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { emailOrPhone, password } = req.body;
        
        // Find user by email or phone
        const user = await User.findOne({ 
            $or: [
                { email: emailOrPhone },
                { phone: emailOrPhone }
            ]
        });
        
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // Create JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key', // Fallback for development
            { expiresIn: '1h' }
        );
        
        res.json({ 
            token, 
            userId: user._id,
            name: user.name 
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed' });
    }
});

// Existing routes
app.post('/api/users', async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.send(user);
});

app.get('/api/users', async (req, res) => {
    const users = await User.find();
    res.send(users);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));