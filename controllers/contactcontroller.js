
import express from 'express';
import RoleManager from '../models/roles.js';
const router = express.Router();
const rolemanager = new RoleManager();
import AuditLog from '../models/auditlog.js';
const auditLog = new AuditLog();
import ContactManager from '../models/contact.js';
const contactmanager = new ContactManager();

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
function isAdminRequest(req) {
    return req.session.roles.some(r => r.title === 'Admin');

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
        }
        res.redirect('/forbidden');
    }
}
function requireAll(conditionFunctions) {
    return function (req, res, next) {
        for (var i in conditionFunctions) {
            const f = conditionFunctions[i];
            const succeeded = f(req);
            if (!succeeded) {
                res.redirect('/forbidden');
                return;
            }
        }
        next();
    }
}

router.get('/contact/create', (req, res) => {
    res.render('contactform');
});
router.post('/contact/create', async (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let message = req.body.message;
    contactmanager.create(name, email, message);
    res.redirect('/');
});

router.get('/contact/list',auth, requireAny([isOfficialRequest]), async (req, res) => {
    let contacts = await contactmanager.list()
    res.render('contactlist', { layout: 'admin', data: contacts[0] });
});

router.get('/contact/delete/:ID', auth, requireAny([isAdminRequest]), async function (req, res) {
    let ID = req.params.ID;
    await contactmanager.Remove(ID)
    res.redirect('/contact/list');
});
export default router;
