
// ---------------Environnement-----------------
var mysql = require('node-mysql');
var url = require('url');
var app = require('express')();
var server = require('http').Server(app);
var path = require('path');


// ------------express-------------------
app.set('views', path.join(__dirname, '.'));
app.set('view engine', 'ejs');
app.use(require('express').static(path.join(__dirname, './assets')));
server.listen(3000);

// -----------------index-----------------
app.get('/index', function(req, res) {
    res.render('index');
});


app.get('/login', function(req, res) {
res.render('login');
});

app.get('/stream', function(req, res) {
res.render('streams');
});
   
app.get('/createaccount', function(req, res) {
res.render('createaccount');
   
});


// function BD() {
//     var connection = mysql.createConnection({
//         user: 'root',
//         password: 'coucousalifou',
//         host: 'kfc-raspi',
//        port: ,
//         database: 'Projet_esir'
//     });
//     return connection;
// }

// app.get("/user/create", function(req, res) {
//     console.log("je suis la ");
//         var objBD = BD();

//     var post = {
//         nom: req.body.nom,
// 		prenom: req.body.prenom,
// 		identifiant:req.body.id,
// 		mdp:req.body.mdp,
// 		email: req.body.email
//     };

//     objBD.query('INSERT INTO login_web VALUES ?', post, function(error) {
//         if (error) {
//             console.log(error.message);
//         } else {
//             console.log('success');    
//         }
//     });
// });



