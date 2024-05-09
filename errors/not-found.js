class NotFoundError extends Error {
  status = 404;
  constructor(message = "Not Found") {
    super(message);
  }
}

module.exports = NotFoundError;
