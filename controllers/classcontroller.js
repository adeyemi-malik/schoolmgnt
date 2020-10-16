import express from 'express';
import ClassManager from '../models/classes.js'
import {Class} from '../models/classes.js';
const router = express.Router();
const classmanager = new ClassManager();
import  ClassCategoryManager from '../models/class-category.js';
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
        for ( var i in conditionFunctions) {
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

router.get('/createclass', auth, requireAny([isAdminorProprietorRequest]), async function (req, res) {
    let result = await classcategoryManager.getcategorynames();
    res.render('createclass', { layout: 'admin', data: result });
});
router.post('/createclass', auth,requireAny([isAdminorProprietorRequest]), async function (req, res) {
    let classname = req.body.class_name;
    let categoryname = req.body.categoryname;
    let result = await classcategoryManager.getCategoryId(categoryname);
    let class_category_id = result.ID;
    await classmanager.create(classname, class_category_id);
    res.redirect('/classlist');
});
router.get('/classes/:id', async (req, res) => {
    let categoryId = req.params.id;
    if (!categoryId) {
        return [];
    }
    let classes = await classmanager.listByCategoryId(categoryId);
    let data = classes.map(item => new Class(item.ID, item.class_name, item.class_category_id));
    res.set('Content-Type', 'application/json');
    res.status(200).send(data);
});
router.get('/classlist', auth, requireAny([isOfficialRequest]), async function (req, res) {
    let result = await classmanager.list()
    res.render('classlist', { layout: 'admin', data: result[0] });
});
router.get('/class/edit/:ID', auth, requireAny([isAdminorProprietorRequest]), async function (req, res) {
    let ID = req.params.ID;
    let result = await classmanager.find(ID);
    console.log(result);
    res.render('editclass', result);
});
router.post('/class/edit',auth, requireAny([isAdminorProprietorRequest]), async function (req, res) {
    let ID = req.body.ID
    let classname = req.body.class_name;
    let classcategory = req.body.class_category_id;
    await classmanager.update(ID, classname, classcategory);
    res.redirect('/classlist');
});
router.get('/class/delete/:ID', auth, requireAny([isAdminorProprietorRequest]), async function (req, res) {
    let ID = req.params.ID;
    await classmanager.Remove(ID);
    res.redirect('/classlist');
});

export default router;
