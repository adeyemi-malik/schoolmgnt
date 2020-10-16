import express from 'express';
import ClassCategoryManager from '../models/class-category.js';
import { Category } from '../models/class-category.js';


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

function isOfficialRequest(req) {
    return req.session.roles.some(r => r.title === 'Admin'|| r.title ==='Registrar'||r.title ==='Principal');
}
function isAdminorRegistrarRequest(req) {
    return req.session.roles.some(r => r.title === 'Admin'||r.title ==='Registrar');
}
function isAdminorProprietorRequest(req) {
    return req.session.roles.some(r => r.title === 'Admin'||r.title ==='Registrar');
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
router.get('/create', auth, requireAny([isAdminorProprietorRequest]), async function (req, res) {

    res.render('createcategory', { layout: 'admin' });
})
router.post('/create', auth, requireAny([isAdminorProprietorRequest]), async function (req, res) {
    let name = req.body.name;
    await classcategoryManager.create(name);
});
router.get('/list', auth, requireAny([isOfficialRequest]), async function (req, res) {
    let categories = await classcategoryManager.list();
    res.render('categorylist', { layout: 'admin', data: categories });
})
router.get('/edit/:ID', auth, requireAny([isAdminorProprietorRequest]), async function (req, res) {
    let ID = req.params.ID;
    let result = await classcategoryManager.find(ID);
    console.log(result[0]);
    res.render('editcategory', { layout: 'admin', data: result });
});
router.post('/edit', auth, requireAny([isAdminorProprietorRequest]), async function (req, res) {
    let ID = req.body.ID
    let name = req.body.name;
    await classcategoryManager.update(ID, name);
    res.redirect('/categories/list');
});
router.get('/delete/:ID', auth, requireAny([isAdminorProprietorRequest]), async function (req, res) {
    let ID = req.params.ID;
    await classcategoryManager.Remove(ID);
    res.redirect('/categories/list');
});


export default router;