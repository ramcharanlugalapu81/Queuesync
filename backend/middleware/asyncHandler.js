// Express 4 does not catch rejected promises from async route handlers.
export const asyncHandler = (handler) => (request, response, next) => {
  Promise.resolve(handler(request, response, next)).catch(next);
};
