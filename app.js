if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const PORT = process.env.PORT || 3000;

const cardRoutes = require('./routes/card');
const ExpressError = require('./utils/ExpressError');

// const puppeteer = require('puppeteer');
// const browser = await puppeteer.launch({ headless: false });

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true })
    .then(() => console.log('Mongo connected!'))
    .catch((err) => console.log('Error! ', err));

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const secret = process.env.SECRET || 'thisisasecretkey'

const store = MongoStore.create({
    mongoUrl: process.env.DATABASE,
    crypto: {
        secret
    },
    touchAfter: 24 * 60 * 60
});

const sessionConfig = {
    name: 'session',
    secret,
    store,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', cardRoutes);

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong!";
    res.status(statusCode).render('error', { err });
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));