const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');

// Mongoose Connect
mongoose.connect('mongodb://localhost/sportsblog');
const db = mongoose.Connection;

// Port
const port = 8080;

// Init app
const app = express();

// Define route files
const index = require('./routes/index');
const articles = require('./routes/articles');
const categories = require('./routes/categories');
const manage = require('./routes/manage');

// View Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Set static resources
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css/')));

// Express messages
app.use(require('connect-flash')());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express validator
app.use(expressValidator({
	errorFormatter: (param, msg, value) => {
		let namespace = param.split('.'),
		root = namespace.shift(),
		formParam = root;

		while (namespace.length) {
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param: formParam,
			msg: msg,
			value: value
		};
	}
}));

app.use('/', index);
app.use('/articles', articles);
app.use('/categories', categories);
app.use('/manage', manage);

app.listen(port, () => {
	console.log('Server is listening on port ', port);
});