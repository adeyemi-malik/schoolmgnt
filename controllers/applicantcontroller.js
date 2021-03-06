import express from 'express';
import ApplicantManager from '../models/applicants.js';
import StudentManager from '../models/student.js';
import ClassManager from '../models/classes.js';
import AuditLog from '../models/auditlog.js';
const router = express.Router();
const applicantmanager = new ApplicantManager();
const classmanager = new ClassManager();
const studentmanager = new StudentManager();
const auditLog = new AuditLog();


function auth(req, res, next) {
    if (isAuthenticatedRequest(req)) {
        next();
    }
    else {
        res.redirect('/users/login');
    }
}
function isOfficialRequest(req) {
    return req.session.roles.some(r => r.title === 'Admin'||  r.title ==='Registrar'|| r.title ==='Principal');
}
function isAdminorRegistrarRequest(req) {
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




router.get('/apply', async function (req, res) {
    let classes = await classmanager.list();
    res.render('applicationform', { data: classes[0] });
});
router.post('/apply', async function (req, res) {
    let firstname = req.body.firstname;
    let middlename = req.body.middlename;
    let lastname = req.body.lastname;
    let sex = req.body.sex;
    let age = req.body.age;
    let address = req.body.address;
    let dateofbirth = req.body.dateofbirth;
    let class_id = req.body.class_id;
    let phoneno = req.body.phoneno;
    await applicantmanager.create(firstname, middlename, lastname, dateofbirth, sex, age, class_id, address, phoneno);

    res.redirect('/');
})
router.get('/listapplicants', auth, requireAny([isOfficialRequest]), async function (req, res) {
    //let ID = req.params.ID;
    // let result1 = await applicantmanager.getClassName(ID);
    let result1 = await applicantmanager.list();
    let result2 = await applicantmanager.getClassNameList();
    res.render('applicantslist', {
        layout: 'admin',
        data1: result1,
        data2: result2
    });/*JSON.stringify({ data1: result1[0], data2: result2[0] }));*/
});
router.get('/application/admit/:ID', auth, requireAny([isAdminorRegistrarRequest]), async function (req, res) {
    let ID = req.params.ID;
    await applicantmanager.admit(ID);
    let result = await applicantmanager.getAdmittedStudent(ID);
    let applicant_id = result[0].ID;
    let firstname = result[0].firstname;
    let middlename = result[0].middlename;
    let lastname = result[0].lastname;
    let sex = result[0].sex;
    let age = result[0].age;
    let address = result[0].address;
    let dateofbirth = (result[0].dateofbirth).toISOString().replace(/T/, ' ').replace(/\..+/, '');
    let class_id = result[0].class_id;
    let admissiondate = (result[0].date_admitted).toISOString().replace(/T/, ' ').replace(/\..+/, '');;
    let phoneno = result[0].phoneno;
    await studentmanager.registerSuccessfulApplicant(applicant_id, firstname, middlename, lastname, dateofbirth, sex, age, address, class_id, admissiondate, phoneno);
    res.redirect('/admissionlist');
});

router.get('/application/delete/:ID', auth, requireAny([isAdminRequest]), async function (req, res) {
    let ID = req.params.ID;
    let applicant = await applicantmanager.find(ID);
    let ApplicantEmail = applicant.email
    if (applicant == null || applicant == undefined) {
        res.status(404).send("Applicant detail is not found");
    }
    else {
        await applicantmanager.Remove(ID);
        res.redirect('/listapplicants');
        let email = req.session.email;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        auditLog.insertAuditLog(' Applicant Detail deleted', `The details of the applicant ${ApplicantEmail} by  ${ip} with email ${email}`, email);
    }

});
router.get('/admissionlist', auth, async function (req, res) {
    let result = await applicantmanager.listAdmitted();
    res.render('admissionlist', { data: result[0] });
});


export default router;
