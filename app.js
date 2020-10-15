import express from 'express';
import bodyparser from 'body-parser';
import handlebars from 'express-handlebars';
import path from 'path';
import session from 'express-session';
import userRouter from './controllers/usercontroller.js';
import contactRouter from './controllers/contactcontroller.js';
import roleRouter from './controllers/rolecontroller.js';
import applicantRouter from './controllers/applicantcontroller.js';
import studentRouter from './controllers/studentcontroller.js';
import classRouter from './controllers/classcontroller.js';
import categoryRouter from './myapi/categorycontroller.js';
import AuditLog from './models/auditlog.js';
const auditLog = new AuditLog();
const __dirname = path.resolve();
const app = express();
const port = process.env.PORT || 5004;

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
function isOfficialRequest(req) {
    return req.session.roles.some(r => r.title === 'Admin'|| 'Registrar'||'Principal');
}
function isAdminorRegistrarRequest(req) {
    return req.session.roles.some(r => r.title === 'Admin'||'Registrar');
}
function isAdminRequest(req) {
    return req.session.roles.some(r => r.title === 'Admin');
}

function isRegistrarRequest(req) {
    return req.session.roles.some(r => r.title === 'Registrar');
}

function isProprietorRequest(req) {
    return req.session.roles.some(r => r.title === 'Proprietor');
}
function isPrincipalRequest(req) {
    return req.session.roles.some(r => r.title === 'Principal');
}

function isAuthenticatedRequest(req) {
    return req.session.isLoggedIn == true;
}

function requireAny(conditionFunctions) {
    return function (req, res, next) {
        for (var i in conditionFunctions) {
            const f = conditionFunctions[i];
            const succeeded = f(req);
            if (succeeded) {
                next();
                return;
            }
            else {
                res.redirect('/forbidden');
            }
        }

    }
}



app.get('/getLogs', auth, requireAny([isAdminRequest]), async (req, res) => {
    let result = await auditLog.getLogs();
    res.render('logs', { layout: 'admin', data: result[0] })
});
app.get('/forbidden', function (req, res) {
    res.render('forbidden');
});


app.get('/*', function (req, res, next) {
    res.locals.name = req.session.name;
    res.locals.isLoggedIn = req.session.isLoggedIn;
    next();
})

app.get('/about', (req, res) => {
    res.render('aboutus');
});

app.get('/', function (req, res) {
    res.render('home');
});
app.get('/admin', auth, requireAny([isOfficialRequest]), function (req, res) {
    res.render('admindashboard', { layout: 'admin' });
});





app.use(userRouter);
app.use(contactRouter);
app.use(roleRouter);
app.use(applicantRouter);
app.use(studentRouter);
app.use(classRouter);
app.use('/categories', categoryRouter);


app.listen(port);
console.log(`App listening on http://localhost:${port}`);
