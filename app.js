const express = require('express');
const bodyparser = require('body-parser');
const handlebars = require('express-handlebars');
const session = require('express-session');
const UsersManager = require('./models/users.js');
const usersmanager = new UsersManager();
const AuditLog = require('./models/auditlog.js');
const auditLog = new AuditLog();

const app = express();
let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}
app.listen(port);



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
    if (isAuthenticatedRequest(req)) {
        next();
    }
    else {
        res.redirect('/users/login')
    }
}
function isAdminRequest(req) {
    return req.session.roles.some(r => r.title === 'Admin');
}

function isRegistrarRequest(req) {
    return req.session.roles.some(r => r.title === 'Admin');
}
function isProprietorRequest(req) {
    return req.session.roles.some(r => r.title === 'Admin');
}
function isPrincipalRequest(req) {
    return req.session.roles.some(r => r.title === 'Admin');
}

function isAuthenticatedRequest(req) {
    return req.session.isLoggedIn == true;
}
function requireAny(conditionFunctions) {
    return function (req, res, next) {
        for (i in conditionFunctions) {
            const f = conditionFunctions[i];
            const succeeded = f(req);
            if (succeeded) {
                next();
                return;
            }
        }
        res.redirect('/forbidden');
    }
}



app.get('/getLogs', auth, requireAny([isAdminRequest]), async (req, res) => {
    let result = await auditLog.getLogs();
    res.render('logs', { layout: 'admin', data: result[0] })
});
app.get('/editLogs/:ID', auth, requireAny([isAdminRequest]), async (req, res) => {
    let ID = req.params.ID;
    await auditLog.removeLog(ID);
    res.redirect('/getLogs');
});
app.get('/forbidden', function (req, res) {
    res.render('forbidden');
});


app.get('/*', function (req, res, next) {
    res.locals.name = req.session.name;
    res.locals.isLoggedIn = req.session.isLoggedIn;
    next();
})

app.get('/', function (req, res) {
    res.render('home');
});
app.get('/admin', auth, requireAny([isAdminRequest, isPrincipalRequest, isProprietorRequest, isRegistrarRequest]), function (req, res) {
    res.render('admindashboard', { layout: 'admin' });
})




app.use(require('./controllers/usercontroller'));
app.use(require('./controllers/rolecontroller'));
app.use(require('./controllers/applicantController'));
app.use(require('./controllers/studentController'));
app.use(require('./controllers/classController'));
app.use('/categories', require('./myapi/categorycontroller'));





console.log(`App listening on http://localhost:${port}`);

//RegistrarAuth, adminAuth
