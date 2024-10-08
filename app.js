const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
const compression = require("compression");

const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const AppError = require("./utils/appError");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRoutes");
const contactRouter = require("./routes/contactRoutes");
const cookieSession = require("cookie-session");
const app = express();

// app.enable('trust proxy');

// GLOBAL MIDDLEWARE

// set Security http headers
app.use(helmet());

// app.use(cookieSession({
//   name: 'session',

// }));

// development loggin
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from same IP
const limiter = rateLimit({
  max: 100,
  windows: 60 * 60 * 1000,
  message: "Too many requests from this IP , please try agin in one hour!",
});
app.use("/api", limiter);

// allow cors
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// const allowedOrigins = [
//   'http://localhost:3000',
//   'https://backend-test-nine-steel.vercel.app',
// ];

// app.use(
//   cors({
//     origin: function(origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'));
//       }
//     },
//     credentials: true,
//   })
// );

// app.use('/public', (req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:5000");
//   res.header("Access-Control-Allow-Credentials", "true");
//   next();
// }, express.static(path.join(__dirname, 'public')));

// app.use(express.static('public'))
// app.use('/public', express.static(path.join(__dirname, '../public')));

app.use(express.json({ limit: "100mb" }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// preventing parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "price",
      "maxGroupSize",
      "ratingsAverage",
      "difficulty",
    ],
  })
);

app.use(compression());

// serving static files
// app.use(express.static(`${__dirname}/public`));

// app.get('/api/v1/tours',getAllTours);
// app.get('/api/v1/tours/:id',getTour);
// app.post('/api/v1/tours',createTour);
// app.patch('/api/v1/tours/:id',updateTour);
// app.delete('/api/v1/tours/:id',deleteTour);
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/contacts", contactRouter);

app.all("*", (req, res, next) => {
  // const err = new Error(`Cant find ${req.originalUrl}  on this server .`);
  // err.statusCode=404;
  // err.status='fail';
  next(new AppError(`Cant find ${req.originalUrl}  on this server .`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
