const helmet = require('helmet');
const csrf = require('csurf');

const setupSecurityMiddlewares = (app) => {
  app.use(helmet());
  app.use(csrf());
}

const csrfTokenMiddleware = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
}

module.exports = {
  setupSecurityMiddlewares,
  csrfTokenMiddleware
};