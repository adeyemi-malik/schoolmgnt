
import express from 'express';
import RoleManager from '../models/roles.js';
const router = express.Router();
const rolemanager = new RoleManager();
import AuditLog from '../models/auditlog.js';
const auditLog = new AuditLog();

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
function isAuthenticatedRequest(req) {
    return req.session.isLoggedIn == true;
}
function requireAny(conditionFunctions) {
    return function (req, res, next) {
<<<<<<< HEAD
        for (var i in conditionFunctions) {
=======
        for ( var i in conditionFunctions) {
>>>>>>> 478bd6fefad5e1766c9db440d999aed179233b60
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
        for ( var i in conditionFunctions) {
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

router.get('/roles/create', auth, requireAny([isAdminRequest]), (req, res) => {
    res.render('Addrole', { layout: 'admin' });
});
router.post('/roles/create', auth, requireAny([isAdminRequest]), (req, res) => {
    let title = req.body.title;
    rolemanager.create(title);
    let email = req.session.email
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    auditLog.insertAuditLog('New Role Added ', `A new role was added to the role list by ${ip} with email ${email}`, email);
    res.redirect('/roles/list');
});

router.get('/roles/list', auth, requireAny([isAdminRequest]), async (req, res) => {
    let roles = await rolemanager.list()
    res.render('rolelist', { layout: 'admin', data: roles[0] });
});
router.get('/roles/edit/:ID', auth, requireAny([isAdminRequest]), async function (req, res) {
    let ID = req.params.ID;
    let result = await rolemanager.find(ID);
    res.render('Editrole', { layout: 'admin', result });
});
router.post('/roles/edit/:ID', auth, requireAny([isAdminRequest]), async function (req, res) {
    let ID = req.body.ID;
    let title = req.body.title;
    await rolemanager.update(ID, title);
    let email = req.session.email;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    auditLog.insertAuditLog(' Role modified ', `A role was modified in the role list by ${ip} with email ${email}`, email);
    res.redirect('/roles/list');
});
router.get('/roles/delete/:ID', auth, requireAny(isAdminRequest), async function (req, res) {
    let ID = req.params.ID;
    let result = await rolemanager.Remove(ID);
    let email = req.session.email
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    auditLog.insertAuditLog(' Role deleted ', `A role was deleted from the role list by ${ip} with email ${email}`, email);
    res.redirect('/roles/list');
});
export default router;
