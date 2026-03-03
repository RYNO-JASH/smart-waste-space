require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');

// ─── Route Imports ───────────────────────────────────────────────────────────
const wasteRoutes = require('./routes/waste');

// ─── App Initialization ───────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────

// CORS — allow all origins (update origin in production)
app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

// JSON body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer — configured for future image upload support (memory storage for now)
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    },
});

// Expose upload middleware globally so routes can import it when needed
app.set('upload', upload);

// ─── Database Connection ──────────────────────────────────────────────────────
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('✅  MongoDB connected successfully');
    })
    .catch((err) => {
        console.error('❌  MongoDB connection failed:', err.message);
        process.exit(1); // Stop the server if DB connection fails
    });

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health check
app.get('/', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'Smart Waste Routing API is running 🚀',
        version: '1.0.0',
    });
});

// Waste analysis and history routes
app.use('/api', wasteRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found.',
    });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
    console.error('Unhandled error:', err.message);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error.',
    });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀  Server running on http://localhost:${PORT}`);
});
