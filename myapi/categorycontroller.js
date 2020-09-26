const express = require('express');
const { ClassCategoryManager, Category } = require('../models/class-category');


const router = express.Router();
const classcategoryManager = new ClassCategoryManager();



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
router.get('/', async function (req, res) {
    let categories = await classcategoryManager.list();
    let data = categories.map(category => new Category(category.ID, category.name));
    res.set('Content-Type', 'application/json');
    res.status(200).send(data);
});
router.get('/createcategory', auth, requireAny([isAdminRequest, isProprietorRequest]), async function (req, res) {
    res.render('createcategory', { layout: 'admin' });
})
router.post('/createcategory', auth, requireAny([isAdminRequest, isProprietorRequest]), async function (req, res) {
    let name = req.body.name;
    await classcategoryManager.create(name);
});
router.get('/category/list', auth, requireAny([isAdminRequest, isRegistrarRequest, isPrincipalRequest, isProprietorRequest,]), async function (req, res) {
    let categories = await classcategoryManager.list();
    res.render('createcategory', { layout: 'admin', data: categories[0] });
})
router.get('/category/edit/:ID', auth, requireAny([isAdminRequest, isProprietorRequest]), async function (req, res) {
    let ID = req.params.ID;
    let result = await classcategoryManager.find(ID);
    res.render('editcategory', { layout: 'admin', result });
});
router.post('/category/edit', auth, requireAny([isAdminRequest, isProprietorRequest]), async function (req, res) {
    let ID = req.body.ID
    let name = req.body.name;
    await classcategoryManager.update(ID, name);
    res.redirect('/category/list');
});
router.get('/category/delete/:ID', auth, requireAny([isAdminRequest, isProprietorRequest]), async function (req, res) {
    let ID = req.params.ID;
    await classcategoryManager.Remove(ID);
    res.redirect('/category/list');
});


module.exports = router;