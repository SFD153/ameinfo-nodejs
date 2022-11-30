module.exports = {
  responseError(message) {
    return {
      name: 'Error',
      message: message
    };
  }
};
