const express = require('express');
const ApplicantManager = require('../models/applicants');
const router = express.Router();
const applicantmanager = new ApplicantManager();
const StudentManager = require('../models/student');
const studentmanager = new StudentManager();
const { ClassManager } = require('../models/classes');
const classmanager = new ClassManager();

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
    res.redirect('listapplicants');
})
router.get('/listapplicants', async function (req, res) {
    //let ID = req.params.ID;
    // let result1 = await applicantmanager.getClassName(ID);
    let result = await applicantmanager.list();
    res.render('applicantslist', { data: result[0] });/*JSON.stringify({ data1: result1[0], data2: result2[0] }));*/
});
router.get('/application/admit/:ID', async function (req, res) {
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

router.get('/application/delete/:ID', async function (req, res) {
    let ID = req.params.ID;
    let student = await applicantmanager.find(ID);
    if (student == null || student == undefined) {
        res.status(404).send("Applicant detail is not found");
    }
    else {
        await studentmanager.Remove(ID);
        res.redirect('/listapplicants');
    }

});
router.get('/admissionlist', async function (req, res) {
    let result = await applicantmanager.listAdmitted();
    res.render('admissionlist', { data: result[0] });
});





module.exports = router;
