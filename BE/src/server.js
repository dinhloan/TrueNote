require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;
const DB_RETRY_INTERVAL_MS = Number(process.env.DB_RETRY_INTERVAL_MS) || 15000;

let retryTimer;

const scheduleDbConnect = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error(`MongoDB unavailable. Retrying in ${DB_RETRY_INTERVAL_MS}ms.`);
    retryTimer = setTimeout(scheduleDbConnect, DB_RETRY_INTERVAL_MS);
  }
};

const server = app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
  scheduleDbConnect();
});

const shutdown = () => {
  if (retryTimer) {
    clearTimeout(retryTimer);
  }

  server.close(() => process.exit(0));
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
