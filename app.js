const express = require('express');
const bodyparser = require('body-parser');
const handlebars = require('express-handlebars');
const session = require('express-session');
const app = express();
const port = 4000;


app.use(express.static(__dirname + '/public'));



app.use(bodyparser());
app.use(session({
    saveUninitialized: true,
    secret: '123456',
    resave: true
}));
app.set('view engine', 'hbs');
app.engine('hbs', handlebars({
    extname: 'hbs'
}));

function auth(req, res, next) {
    if (req.session.isLoggedIn == true) {
        next();
    }
    else {
        res.redirect('/users/login')
    }
}

function adminAuth(req, res, next) {
    if (req.session.roles.some(r => r.name === 'Admin')) {
        next();
    }
    else {
        res.redirect('/forbidden')
    }
}
function RegistrarAuth(req, res, next) {
    if (req.session.roles.some(r => r.name === 'Registrar')) {
        next();
    }
    else {
        res.redirect('/forbidden');
    }
}
app.get('/forbidden', function (req, res) {
    res.render('forbidden');
});



app.get('/', function (req, res) {
    res.render('home');
});
app.get('/admin', function (req, res) {
    res.render('admindashboard', { layout: 'admin' });
})




app.use(require('./controllers/usercontroller'));
app.use(require('./controllers/rolecontroller'));
app.use(require('./controllers/applicantController'));
app.use(require('./controllers/studentController'));
app.use(require('./controllers/classController'));
app.use('/categories', require('./myapi/categorycontroller'));




app.listen(port);
console.log('App listening on http://localhost:4000');
