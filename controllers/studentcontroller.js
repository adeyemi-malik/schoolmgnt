import express from 'express';
import StudentManager from '../models/student.js';
const router = express.Router();
const studentmanager = new StudentManager();
import ClassManager from '../models/classes.js';
const classmanager = new ClassManager();


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
function isOfficialRequest(req) {
    return req.session.roles.some(r => r.title === 'Admin'|| 'Registrar'||'Principal');
}
function isAdminorRegistrarRequest(req) {
    return req.session.roles.some(r => r.title === 'Admin'||'Registrar');
}
function isAdminorProprietorRequest(req) {
    return req.session.roles.some(r => r.title === 'Admin'||'Proprietor');
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




router.get('/registerstudent', auth, requireAny([isAdminorRegistrarRequest]), async function (req, res) {
    let classes = await classmanager.list();
    res.render('studentreg', { layout: 'admin', data: classes[0] });
})

router.post('/registerstudent', auth, requireAny([isAdminorRegistrarRequest]), async function (req, res) {
    let firstname = req.body.firstname;
    let middlename = req.body.middlename;
    let lastname = req.body.lastname;
    let sex = req.body.sex;
    let age = req.body.age;
    let address = req.body.address;
    let dateofbirth = req.body.dateofbirth;
    let class_id = req.body.class_id;
    let admissiondate = req.body.admissiondate;
    let phoneno = req.body.phoneno;
    await studentmanager.create(firstname, middlename, lastname, dateofbirth, sex, age, address, class_id, admissiondate, phoneno);
    res.redirect('/studentslist');

})
router.get('/studentslist', auth, requireAny([isOfficialRequest]), async function (req, res) {
    let result = await studentmanager.list();
    res.render('studentslist', { layout: 'admin', data: result[0] });
});
router.get('/students/edit/:ID', auth, requireAny([isAdminorRegistrarRequest]), async function (req, res) {
    let ID = req.params.ID;
    console.log(ID);
    let student = await studentmanager.find(ID);
    console.log(student);
    if (student == null || student == undefined) {
        res.status(404).send("Student detail is not found");
    }
    else {

        res.render("Editstudentdetails", student);
    }

});
router.post('/students/edit/:ID',auth, requireAny([isAdminorRegistrarRequest]), async function (req, res) {
    let ID = req.body.ID;
    let firstname = req.body.firstname;
    let middlename = req.body.middlename;
    let lastname = req.body.lastname;
    let sex = req.body.sex;
    let age = req.body.age;
    let address = req.body.address;
    let dateofbirth = req.body.dateofbirth;
    console.log(dateofbirth);
    let class_id = req.body.class_id;
    let admissiondate = req.body.admissiondate;
    let phoneno = req.body.phoneno;
    await studentmanager.update(ID, firstname, middlename, lastname, dateofbirth, sex, age, address, class_id, admissiondate, phoneno);
    res.redirect('/studentslist');
});

router.get('/students/delete/:ID', auth, requireAny([isAdminRequest]), async function (req, res, next) {
    let ID = req.params.ID;
    let student = await studentmanager.find(ID);
    if (student == null || student == undefined) {
        res.status(404).send("Student detail is not found");
    }
    else {
        await studentmanager.Remove(ID);
        res.redirect('/studentslist');
    }

});

export default router;

