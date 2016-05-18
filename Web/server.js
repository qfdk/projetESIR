
// ---------------Environnement-----------------
var mysql = require('node-mysql');
var DB = mysql.DB;
var url = require('url');
var app = require('express')();
var bodyParser = require("body-parser");
var server = require('http').Server(app);
var path = require('path');
var cookieSession = require('cookie-session')

// ------------express-------------------
app.set('views', path.join(__dirname, 'view/'));
app.set('view engine', 'ejs');
app.use(require('express').static(path.join(__dirname, './assets')));

//Configuring express to use body-parser as middle-ware.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

server.listen(3000);

var io = require('socket.io').listen(server);

var db = new DB({
    host: 'localhost',
    user: 'root',
    password: 'maiga',
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
	res.render('login', { 'erreur': '' });
});

app.get('/stream', function (req, res) {

	var urlsDispo = [
        { name: 'Video 1', link: 'https://www.youtube.com/embed/qEOpts63QWg', description: "Decription de la video 1 ......" },
        { name: 'Docker', link: 'https://www.youtube.com/embed/060fY1KxTc', description: "Decription de la video 2 ......" },
        { name: 'Real', link: 'rtmp://rtmp.infomaniak.ch/livecast/yveline1', description: "Decription de la video 3 ......" },
		{ name: 'Zizou', link: '//www.youtube.com/watch?v=GE5a6Q2NTKU', description: "Decription de la video frnce vs spain ......" }
    ];

	res.render('streams', { urlsDispo });
});

app.post("/streamer", function (req, res) {
	res.render('streamer', { 'stream': req.body.stream });
});

app.get('/createaccount', function (req, res) {
	// res.end
	res.render('createaccount');

});


app.post('/login', function (req, res) {
	var user = req.body.email;
	var pass = req.body.pwd;

	db.connect(function (conn) {
		console.log(conn);
		var requeteSql = 'SELECT * FROM login_web Where email = ? and mdp = ?';
		conn.query(requeteSql, [user, pass], function (err, data) {
			

			if (data[0]!=undefined) {
				console.log("Bien connecté ....");
				res.redirect('stream');
			}
			else {
				console.log("Identifiants incorrects ....");
				res.render('login', { 'erreur': "Email ou mot de passe incorrect" });
			}
		});
	});


});

// L'utilisateur va créer un compte
io.sockets.on('connection', function (socket) {

	socket.on('createnewuser', function (user) {
		console.log(user);

		db.connect(function (conn) {
			console.log(conn);
			conn.query('select * from login_web ', function (err, data) {
				console.log(data);

				var post = {
					nom: user.firstname,
					prenom: user.secondname,
					identifiant: user.identifiant,
					mdp: user.mdp,
					email: user.email
				};
				conn.query('INSERT INTO login_web SET ?', post, function (error) {
					if (error) {
						console.log(error.message);
					} else {
						console.log('success');
					}
				});

			});

		});
	});


	// 
	// 

	// var post = {
	// 	nom:user.firstname,
	// 	prenom:user.secondname,
	// 	identifiant:user.identifiant,
	// 	mdp:user.mdp,
	// 	email:user.email
	// 	};
	// 		db.query('INSERT INTO login_web VALUES ?', post, function(error) {
	//        if (error) {
	//            console.log(error.message);
	//        } else {
	//            console.log('success');    
	//        }
	//    });

	// });

	// socket.on('login', function (user) {
	// 	console.log("je suis dans login ");
	// });

});



// app.get("/user/create", function(req, res) {
//     console.log("je suis la ");
//         var objBD = BD();

//     var post = {
//      nom: req.body.nom,
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