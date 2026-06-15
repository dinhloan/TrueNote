const mongoose = require("mongoose");

const requireDatabase = (req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  return res.status(503).json({
    message: "Database is not connected. Please retry shortly.",
  });
};

module.exports = requireDatabase;
