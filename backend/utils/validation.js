const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateNumericId = (id) => {
  const numId = parseInt(id);
  return !isNaN(numId) && numId > 0;
};

const handleError = (res, statusCode, message, error = null) => {
  console.error(`❌ Error ${statusCode}:`, message);
  if (error) {
    console.error("Error details:", JSON.stringify(error, null, 2));
  }
  
  return res.status(statusCode).json({
    error: message,
    message: message, 
    ...(error && process.env.NODE_ENV !== 'production' && { 
      details: error.message || error 
    })
  });
};

module.exports = {
  validateEmail,
  validateNumericId,
  handleError,
};