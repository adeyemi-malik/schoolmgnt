const express = require('express');
const StudentManager = require('../models/student');
const router = express.Router();
const studentmanager = new StudentManager();
const { ClassManager } = require('../models/classes');
const classmanager = new ClassManager();


router.get('/registerstudent', async function (req, res) {
    let classes = await classmanager.list();
    res.render('studentreg', { data: classes[0] });
})

router.post('/registerstudent', async function (req, res) {
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
router.get('/studentslist', async function (req, res) {
    let result = await studentmanager.list();
    res.render('studentslist', { data: result[0] });
});
router.get('/students/edit/:ID', async function (req, res) {
    let ID = req.params.ID;
    let student = await studentmanager.find(ID);
    if (student == null || student == undefined) {
        res.status(404).send("Student detail is not found");
    }
    else {
        res.render("Editstudentdetails", student);
    }

});
router.post('/students/edit/:ID', async function (req, res) {
    let ID = req.body.ID;
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
    await studentmanager.update(ID, firstname, middlename, lastname, dateofbirth, sex, age, address, class_id, admissiondate, phoneno);
    res.redirect('/studentslist');
});

router.get('/students/delete/:ID', async function (req, res) {
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



module.exports = router;
