var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
var cors = require('cors')

const db = require('./db'); // Import the database configuration

db.on('connected', () => {
  console.log('MongoDB connected successfully');
});

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

db.on('disconnected', () => {
  console.log('MongoDB disconnected');
});


const dashboardRouter = require('./app/dashboard/router.js');
const categoryRouter = require('./app/category/router.js');
const nominalRouter = require('./app/nominal/router.js');
const voucherRouter = require('./app/voucher/router.js');
const bankRouter = require('./app/bank/router.js');
const paymentRouter = require('./app/payment/router.js');
const usersRouter = require('./app/users/router.js');
const transactionRouter = require('./app/transaction/router.js');
const playerRouter = require('./app/player/router.js');
const authRouter = require('./app/auth/router.js');

const app = express();
const URL = `/api/v1`
app.use(cors())

// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {}
}))
app.use(flash());
app.use(methodOverride('_method'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/adminlte', express.static(path.join(__dirname, '/node_modules/admin-lte/')));

app.use('/', usersRouter);
app.use('/bank', bankRouter);
app.use('/voucher', voucherRouter);
app.use('/nominal', nominalRouter);
app.use('/category', categoryRouter);
app.use('/payment', paymentRouter);
app.use('/dashboard', dashboardRouter);
app.use('/transaction', transactionRouter);

//api
app.use(`${URL}/players`, playerRouter)
app.use(`${URL}/auth`, authRouter)

app.get("/", (req, res) => res.send("Express on Vercel"));

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;