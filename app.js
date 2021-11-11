if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path')
const PORT = process.env.PORT || 3000;

const cardRoutes = require('./routes/card');

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true })
    .then(() => console.log('Mongo connected!'))
    .catch((err) => console.log('Error! ', err));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', cardRoutes);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));