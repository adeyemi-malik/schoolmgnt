

import express from 'express';
import bycryt from 'bcrypt';
import UsersManager from '../models/users.js';
const router = express.Router();
const usersmanager = new UsersManager();
import  AuditLog from '../models/auditlog.js';
const auditLog = new AuditLog();
import RoleManager from '../models/roles.js';
const rolemanager = new RoleManager();
import User_roleManager from '../models/user_role.js';
const user_rolemanager = new User_roleManager();


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



router.get('/users/signup', function (req, res) {
    res.render('signup');
});
router.post('/users/signup', async function (req, res) {
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let email = req.body.email;
    let phone_no = req.body.phone_no;
    let password = req.body.password1;
    let password2 = req.body.password2;
    if (email.indexOf('@') < 0) {
        let message = "Email is invalid";
        res.render("usersignup", { 'message': message });
        return;
    }
    if (password != password2) {
        let message = "Your password does not match";
        res.render("usersignup", { 'message': message });
        return;
    }
    let existingUsersmail = await usersmanager.checkemail(email);
    console.log(existingUsersmail);
    if (existingUsersmail) {
        let message = "This email has already been taken";
        res.render("signup", { 'message': message });
        return;
    }
    let hashedpassword = await bycryt.hash(password, 10);
    usersmanager.create(firstname, lastname, email, phone_no, hashedpassword);
    let message = "Your account has been created";
    res.render("signup", { 'message': message });
    res.redirect('/users/login');
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    auditLog.insertAuditLog('User account created', `successful creation of account by ${ip} with email ${email}`, email);

});
router.get('/users/edit/:ID', auth, requireAny([isAdminRequest]), async function (req, res) {
    let ID = req.params.ID;
    let user = await user_rolemanager.find(ID);
    res.render('edituser', { layout: 'admin', data: user })
});
router.post('/users/edit', auth, requireAny([isAdminRequest]), async function (req, res) {
    let ID = req.body.ID;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let email = req.body.email;
    let phone_no = req.body.phone_no;
    let password = req.body.password1;
    let password2 = req.body.password2;
    if (email.indexOf('@') < 0) {
        let message = "Email is invalid";
        res.render("edituser", { layout: 'admin', 'message': message });
        return;
    }
    if (password != password2) {
        let message = "Your password does not match";
        res.render("edituser", { layout: 'admin', 'message': message });
        return;
    }
    let existingUsersmail = await usersmanager.checkemail(email);
    console.log(existingUsersmail);
    if (existingUsersmail) {
        let hashedpassword = await bycryt.hash(password, 10);
        usersmanager.update(ID, firstname, lastname, email, phone_no, hashedpassword);
        res.redirect('/users/login');
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        auditLog.insertAuditLog('User account modified', `successful modification of account by ${ip} with email ${email}`, email);
    }

});
router.get('/users/delete/:ID', auth, requireAny([isAdminRequest]), async function (req, res) {
    let ID = req.params.ID;
    let user = await usersmanager.Remove(ID);

});
router.get('/users/assignrole/:ID', auth, requireAny([isAdminRequest]), async function (req, res) {
    let result = await rolemanager.list();
    res.render('assignrole', { layout: 'admin', data: result[0] });
});
router.post('/users/assignrole/:ID', auth, requireAny([isAdminRequest]), async function (req, res) {
    let user_id = req.params.ID;
    let role = req.body.title;
    let result = await rolemanager.getRoleId(role);
    let role_id = result[0].ID;
    await user_rolemanager.create(user_id, role_id);
    res.redirect('/usersroles');
});
router.get('/usersroles', auth, requireAny([isAdminRequest]), async function (req, res) {
    let result = await user_rolemanager.list();
    res.render('userroles', { layout: 'admin', data: result[0] });
});
router.get('/deleteuserrole/:ID', auth, requireAny([isAdminRequest]), async function (req, res) {
    let ID = req.params.ID;
    await user_rolemanager.Remove(ID);
    res.redirect('/usersroles');
});

router.get('/users/login', function (req, res) {
    res.render('login');
});
router.post('/users/login', async function (req, res) {
    let email = req.body.email;
    let password = req.body.password;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    let user = await usersmanager.findByEmail(email);
    if (user == null || user == undefined) {
        let message = "<div class='alert alert-danger'>Incorrect email or password</div>";
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.render("login", { 'message': message });
        return;
    }
    else {
        let isCorrect = await bycryt.compare(password, user.password);
        if (isCorrect == true) {
            req.session.userid = user.ID;
            req.session.isLoggedIn = true;
            req.session.name = `${user.firstname}`;
            req.session.email = user.email;
            let roles = await usersmanager.getRoles(user.ID);
            req.session.roles = roles || [];
            res.redirect('/');
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            auditLog.insertAuditLog(' succesful Login', `successful login from ${ip} with email ${email}`, email);
            res.redirect('/');
        }
        else {
            let message = "Incorrect email or password";
            res.render("login", { 'message': message });
            auditLog.insertAuditLog('Failed Login', `failed login from ${ip} with email ${email}`, email);
            return;
        }
    }
});
router.get('/users/list', auth, requireAny([isAdminRequest]), async function (req, res) {
    let result = await usersmanager.list();
    console.log(result);
    res.render('userslist', { layout: 'admin', data: result[0] });
});

router.get('/users/logout', (req, res) => {
    if (req.session.userid) {
        delete req.session.userid;
        res.redirect('/users/login');
    } else {
        let email = req.session.email;
        res.redirect('/');
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        auditLog.insertAuditLog('Logout', `logout from ${ip} with email ${email}`, email);

    }
});
export default router;
