function ApiResponse(success, message, data = null, error = null) {
  return {
    success,
    message,
    data,
    error
  };
}

function ApiResponseSimple(success, message, error = null) {
  return {
    success,
    message,
    error
  };
}

module.exports = {
  ApiResponse,
  ApiResponseSimple
};
