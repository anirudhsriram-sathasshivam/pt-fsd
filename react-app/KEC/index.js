require('dotenv').config(); // Load environment variables
var express = require('express');
var path = require('path');
var mdb = require('mongoose');
var cors = require('cors'); 
var User = require('./models/user'); // Import the user model

var app = express();
const PORT = 3001;

// Enable CORS
app.use(cors());

// MongoDB connection
mdb.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected successfully");
    })
    .catch((err) => {
        console.log("MongoDB connection failed:", err);
    });

// Middleware to parse JSON request body
app.use(express.json());

// Default route
app.get('/', (req, res) => {
    res.send("Welcome da maple");
});

// Signup route
app.post('/signup', (req, res) => {
    var { firstName, lastName, email, password } = req.body;

    var newUser = new User({ firstName, lastName, email, password });
    newUser.save()
        .then(() => {
            res.status(200).send("User added successfully");
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Error saving user");
        });
});

// JSON route
app.get('/json', (req, res) => {
    res.json({ server: "Welcome da MACHI", url: "localhost", port: PORT });
});

// Fetch all signup records
app.get('/getsignup', async (req, res) => {
    try {
        var allSignupRecords = await User.find();
        res.json(allSignupRecords);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching records");
    }
});

// Login route
app.post('/login', async (req, res) => {
    var { email, password } = req.body;
    try {
        var existingUser = await User.findOne({ email });
        if (existingUser && existingUser.password === password) {
            res.json({ message: "Login Successful", isLoggedIn: true });
        } else {
            res.status(401).json({ message: "Invalid email or password", isLoggedIn: false });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Error processing the request");
    }
});

// Static file route
app.get('/static', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Backend server started\nUrl: http://localhost:${PORT}`);
});
