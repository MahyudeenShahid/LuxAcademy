const express  = require('express');
const dotenv   = require('dotenv');
const cors     = require('cors');
const morgan   = require('morgan');
const connectDB = require('./config/db');

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Standard middleware ──────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ── Health check (always available) ─────────────────────────────────────────
app.get('/', (req, res) => {
  const mode = process.env.USE_MOCK_DB === 'true' ? 'mock (no DB)' : 'live DB';
  res.json({ message: 'LMS API is running', version: '1.0.0', mode });
});

/**
 * Bootstrap:
 *  1. Try MongoDB (unless USE_MOCK_DB is already true).
 *  2. If the connection fails, flip USE_MOCK_DB so models export mock versions.
 *  3. THEN require routes (which load models, which read the env flag).
 */
const startServer = async () => {
  if (process.env.USE_MOCK_DB === 'true') {
    console.log('⚠  USE_MOCK_DB=true — starting with in-memory mock data (no MongoDB)');
  } else {
    const connected = await connectDB();
    if (!connected) {
      process.env.USE_MOCK_DB = 'true';
      console.log('⚠  Falling back to in-memory mock data');
    }
  }

  // Load routes AFTER the DB decision so every model file sees the final env flag
  app.use('/api/auth',        require('./routes/authRoutes'));
  app.use('/api/courses',     require('./routes/courseRoutes'));
  app.use('/api/users',       require('./routes/userRoutes'));
  app.use('/api/enrollments', require('./routes/enrollmentRoutes'));

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
  });

  // Global error handler
  app.use((err, req, res, next) => {  // eslint-disable-line no-unused-vars
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Internal Server Error',
    });
  });

  app.listen(PORT, () => {
    const mode = process.env.USE_MOCK_DB === 'true' ? 'mock-db' : 'live-db';
    console.log(`🚀  Server [${mode}] running on port ${PORT} (${process.env.NODE_ENV})`);
  });
};

startServer().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
