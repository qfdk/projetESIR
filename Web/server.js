
// ---------------Environnement-----------------
var mysql = require('node-mysql');
var DB = mysql.DB;
var url = require('url');
var app = require('express')();
var server = require('http').Server(app);
var path = require('path');


// ------------express-------------------
app.set('views', path.join(__dirname, '.'));
app.set('view engine', 'ejs');
app.use(require('express').static(path.join(__dirname, './assets')));
server.listen(3000);

var io=require('socket.io').listen(server);


var db =  new DB({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'Projet_esir',
    connectionLimit: 50,
    useTransaction: {
    connectionLimit: 1
    }
});
// -----------------index-----------------
app.get('/index', function(req, res) {
    res.render('index');
});

app.get('/', function(req, res) {
 res.render('index');
});
app.get('/login', function(req, res) {
res.render('login');
});

app.get('/stream', function(req, res) {
res.render('streams');
});
   
app.get('/createaccount', function(req, res) {
	// res.end
    if (req.session.username) {
    // User is authenticated, dont let him in
    res.redirect('/login');
  } else {
    // Otherwise we redirect him to createaccount form
    res.render("createaccount");
  }

   
});







	 // L'utilisateur va créer un compte
io.sockets.on('connection', function(socket){

	socket.on('createnewuser',function(user){
	console.log(user);

    db.connect(function(conn) {
       console.log(conn);
       conn.query('select * from login_web ', function(err,data){
       		console.log(data);



	var post = {
		nom:user.firstname,
		prenom:user.secondname,
		identifiant:user.identifiant,
		mdp:user.mdp,
		email:user.email
		};
       	conn.query('INSERT INTO login_web SET ?', post, function(error) {
        if (error) {
            console.log(error.message);
        } else {
            console.log('success');   
            
        }
       });

    });

 });
     });


socket.on('login',function(user){
	console.log("je suis dans login "+user.email+ " : "+user.password);
});



});
	


