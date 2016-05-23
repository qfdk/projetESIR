// ---------------Environnement-----------------
var mysql = require('node-mysql');
var DB = mysql.DB;
var url = require('url');
var app = require('express')();
var bodyParser = require("body-parser");
var expressSession = require('express-session');
var cookieParser = require('cookie-parser'); // the session is stored in a cookie
var server = require('http').Server(app);
var path = require('path');
var md5 = require('md5');
var io = require('socket.io')(server);

// ------------express-------------------
app.set('views', path.join(__dirname, 'view/'));
app.set('view engine', 'ejs');
app.use(require('express').static(path.join(__dirname, './assets')));

// -------------- Configuring express to use body-parser ----------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser());
app.use(cookieParser());
app.use(expressSession({ secret: 'somesecrettokenhere' }));

server.listen(3000, function(){
  console.log('listening on *:3000');
});

var db = new DB({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Projet_esir',
    connectionLimit: 50,
    useTransaction: {
		connectionLimit: 1
    }
});


// -----------------index-----------------
app.get('/index', function (req, res) {
    res.render('index');
});

app.get('/', function (req, res) {
	res.render('index');
});
app.get('/login', function (req, res) {
	if (req.session.isConnected) {
		res.redirect('stream');
	}
	else {
		res.render('login', { 'erreur': '' });
	}
});

app.get('/stream', function (req, res) {
	if (req.session.isConnected) {

		var urlsDispo = [
			{ name: 'Video 1', link: 'https://www.youtube.com/embed/qEOpts63QWg', description: "Decription de la video 1 ......" },
			{ name: 'Docker', link: 'https://www.youtube.com/embed/060fY1KxTc', description: "Decription de la video 2 ......" },
			{ name: 'Real', link: 'rtmp://rtmp.infomaniak.ch/livecast/yveline1', description: "Decription de la video 3 ......" },
			{ name: 'Zizou', link: '//www.youtube.com/watch?v=GE5a6Q2NTKU', description: "Decription de la video frnce vs spain ......" }
		];

		res.render('streams', { urlsDispo });
	}
	else {
		res.render('login', { 'erreur': 'Connectez vous d\'abord ...' });
	}
});

app.post("/streamer", function (req, res) {
	if (req.session.isConnected) {

		res.render('streamer', { 'stream': req.body.stream });
	} else {
		res.render('login', { 'erreur': '' });
	}
});

app.get('/createaccount', function (req, res) {
	// res.end
	res.render('createaccount', { 'erreur': '' });

});

app.post('/login', function (req, res) {

	if (req.session.isConnected) {
		res.redirect('stream');
	}
	else {

		var user = req.body.identifiant;
		var pass = md5(req.body.pwd);

		db.connect(function (conn) {
			var requeteSql = 'SELECT * FROM login_web Where identifiant = ? and mdp = ?';
			conn.query(requeteSql, [user, pass], function (err, data) {


				if (data[0] != undefined) {
					console.log("Bien connecté ....");
					req.session.isConnected = true;
					req.session.userName = user;
					res.redirect('stream');
				}
				else {
					res.render('login', { 'erreur': "Email ou mot de passe incorrect" });
				}
			});
		});
	}
});

// ----------------- Creation d'un compte -----------------
app.post('/createaccount', function (req, res) {

	if (req.session.isConnected) {
		res.redirect('stream');
	} else {

		db.connect(function (conn) {
			var post = {
				nom: req.body.nom,
				prenom: req.body.prenom,
				identifiant: req.body.identifiant,
				mdp: md5(req.body.mdp),
				email: req.body.email
			};
			conn.query('INSERT INTO login_web SET ?', post, function (error) {
				if (error) {
					console.log(error);
					res.render('createaccount', { 'erreur': "Création du compte impossible" });
				} else {
					console.log("Compte créé avec succés ....");
					res.redirect('login');
				}
			});

		});
	}
});

// ----------------- Chatbox Streamer -----------------
var pseudo = 0;

io.on('connection', function(socket){
  socket.pseudo = "name" + pseudo++;
  socket.on('chat message', function(msg){
    io.emit('chat message', "[" + new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1") + "] " + socket.pseudo + " : " + msg);
  });
});
