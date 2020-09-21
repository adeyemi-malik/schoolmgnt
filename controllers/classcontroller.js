const express = require('express');
const { ClassManager, Class } = require('../models/classes');
const router = express.Router();
const classmanager = new ClassManager();
const { ClassCategoryManager, Category } = require('../models/class-category');
const classcategoryManager = new ClassCategoryManager();

router.get('/createclass', async function (req, res) {
    let result = await classcategoryManager.list();
    res.render('createclass', { data: result[0] });
});
router.post('/createclass', async function (req, res) {
    let classname = req.body.class_name;
    let classcategory = req.body.class_category_id;
    await classmanager.create(classname, classcategory);
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
router.get('/classlist', async function (req, res) {
    let result = await classmanager.list()
    res.render('classlist', { data: result[0] });
});
router.get('/class/edit/:ID', async function (req, res) {
    let ID = req.params.ID;
    let result = await classmanager.find(ID);
    res.render('editclass', result);
});
router.post('/class/edit', async function (req, res) {
    let ID = req.body.ID
    let classname = req.body.class_name;
    let classcategory = req.body.class_category_id;
    await classmanager.update(ID, classname, classcategory);
    res.redirect('/classlist');
});
router.get('/class/delete/:ID', async function (req, res) {
    let ID = req.params.ID;
    await classmanager.Remove(ID);
    res.redirect('/classlist');
});


module.exports = router;
