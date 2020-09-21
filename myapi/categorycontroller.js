const express = require('express');
const { ClassCategoryManager, Category } = require('../models/class-category');


const router = express.Router();
const classcategoryManager = new ClassCategoryManager();

router.get('/', async function (req, res) {
    let categories = await classcategoryManager.list();
    let data = categories.map(category => new Category(category.ID, category.name));
    res.set('Content-Type', 'application/json');
    res.status(200).send(data);
});
router.get('/createcategory', async function (req, res) {
    res.render('createcategory');
})
router.post('/createcategory', async function (req, res) {
    let name = req.body.name;
    await classcategoryManager.create(name);
})


module.exports = router;