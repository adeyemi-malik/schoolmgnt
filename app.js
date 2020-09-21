const express = require('express');
const bodyparser = require('body-parser');
const handlebars = require('express-handlebars');
const session = require('express-session');
const app = express();
const port = 4000;


app.use(express.static(__dirname + '/public'));



app.use(bodyparser());
app.use(session({
    saveUninitialized: true,
    secret: '123456',
    resave: true
}));
app.set('view engine', 'hbs');
app.engine('hbs', handlebars({
    extname: 'hbs'
}));


app.get('/', function (req, res) {
    res.send('Hello World!')
})




app.use(require('./controllers/applicantController'));
app.use(require('./controllers/studentController'));
app.use(require('./controllers/classController'));
app.use('/categories', require('./myapi/categorycontroller'));




app.listen(port);
console.log('App listening on http://localhost:4000');
