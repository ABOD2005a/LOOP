const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateNumericId = (id) => {
  const parsed = parseInt(id);
  return !isNaN(parsed);
};

const handleError = (res, statusCode, message, error = null) => {
  return res.status(statusCode).json({
    message,
    ...(error && { error: error.message || error }),
  });
};

module.exports = { validateEmail, validateNumericId, handleError };
