// ---------------Environnement-----------------
var mysql = require('mysql');
var conf = require('./conf/conf.json');
var pool = mysql.createPool(conf.db);
var url = require('url');
var app = require('express')();
var bodyParser = require("body-parser");
var expressSession = require('express-session');
var cookieParser = require('cookie-parser'); // the session is stored in a cookie
var server = require('http').Server(app);
var path = require('path');
var md5 = require('md5');
var escape = require("html-escape");
var io = require('socket.io')(server);


// ------------ Appel REST   -------------
var Client = require('node-rest-client').Client;
var client = new Client();


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
    user: 'projet',
    password: '',
    database: 'projet',
    connectionLimit: 50,
    useTransaction: {
		connectionLimit: 1
    }
});

// -----------------index-----------------
app.get('/index', function (req, res) {
	var user = req.session.userName;
    res.render('index', { "userName": user });
});

app.get('/', function (req, res) {
	res.redirect('index');
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
		
		var json;
		client.get("http://kfc-harpie:8080/api/list", function (data, response) {
			json = data;
			json.push({user: 'Yveline', url: 'rtmp://rtmp.infomaniak.ch/livecast/yveline1'});
			json.push({user: 'Best moment decima', url: 'https://www.youtube.com/watch?v=krqdIHzrRBc'});

		
		/*var urlsDispo = [
			{ name: 'Test 1', link: 'rtmp://kfc-sisilafamille.istic.univ-rennes1.fr/live/salifou', description: "Video test 1 kfc-raspi" },
			{ name: 'Steve Job', link: 'https://www.youtube.com/embed/UF8uR6Z6KLc', description: "Steve Jobs Stanford Commencement Address ..." },
			{ name: 'Yveline', link: 'rtmp://rtmp.infomaniak.ch/livecast/yveline1', description: "Decription de la video 3 ......" },
			{ name: 'Zizou', link: '//www.youtube.com/watch?v=GE5a6Q2NTKU', description: "Decription de la video frnce vs spain ......" }
		];
		*/
		res.render('streams', {json,"userName":req.session.userName});
		});
	}
	else {
		res.render('login', { 'erreur': 'Connectez vous d\'abord ...' });
	}
});

app.post("/streamer", function (req, res) {
	if (req.session.isConnected) {
		res.render('streamer', { 'stream': req.body.stream,'userName':req.session.userName });
	} else {
		res.render('login', { 'erreur': '' });
	}
});

app.get("/streamer",function(req,res){
	res.redirect('stream');
});

app.get('/team', function (req, res) {
	var user = req.session.userName;
    res.render('team', { "userName": user });
});

app.get('/about', function (req, res) {
	var user = req.session.userName;
    res.render('about', { "userName": user });
});

app.get('/logout', function (req, res) {
	console.log("Deconnexion");
	req.session.userName = null;
	req.session.isConnected = false;
    res.redirect('/');
});


app.get('/createaccount', function (req, res) {
	// res.end
	
	if (req.session.isConnected) {
		res.redirect('stream');
	} else {

	res.render('createaccount', { 'erreur': '' });
}
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
	
});

// ----------------- Chatbox Streamer -----------------
io.on('connection', function(socket){
	socket.color = "#" + ((1<<24) * Math.random()|0).toString(16); // Random color chat
	
  socket.on('chat-message', function(msg, pseudo, stream){
	  if (msg != "")
    	io.emit('chat-message', escape(pseudo), socket.color, escape(msg), escape(stream));
  });
});

