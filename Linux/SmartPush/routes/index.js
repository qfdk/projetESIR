var express = require('express');
var url = require('url');
var md5 = require('md5');
var conf = require('../conf/conf.json');
var mysql = require('node-mysql');
var DB = mysql.DB;
var db = new DB(conf.db);
var exec = require('child_process').exec;

// info_users_list vm(traitement des donnees)
var vm = conf.vm;
// users info_users_list (user name)
var users = [];

// info_users_list de info user(detail)
var info_users_list = [];

var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'SmartPush', users: info_users_list, vms: vm});
});

router.get('/play', function (req, res, next) {
    var params = url.parse(req.url, true).query;
    var user = params['user'];
    var pass = md5(params['passwd']);
    db.connect(function (conn) {
        //console.log(conn);
        var requeteSql = 'select * from login_web where identifiant = ? and mdp = ?';
        conn.query(requeteSql, [user, pass], function (err, data) {
            if (data[0] != undefined) {
                console.log("Bien connecté ....");
                res.writeHead(200, {'Content-Type': 'text/json'});
                if (users.indexOf(user) === -1 && data[0].is_locked === 0) {
                    var url = conf.base_url + 'live/' + user;
                    //push video
                    push_stream(url, user);
                }
                if (users.indexOf(user) === -1 && data[0].is_locked === 1) {
                    var tmp = {};
                    tmp['user'] = user;
                    tmp['url'] = "Votre compte n'est pas validé !";
                    tmp['is_locked'] = 1;
                    users.push(user);
                    info_users_list.push(tmp);
                }
                res.end('ok');
            }
            else {
                console.log("Identifiants incorrects ....");
                res.writeHead(400, {'Content-Type': 'text/json'});
                res.end('falid')
            }
        });
    });
});

router.get('/addVm', function (req, res, next) {
    var params = url.parse(req.url, true).query;
    if (params['url'] !== "") {
        vm.push(params['url']);
    }
    res.redirect('/');
});

router.get('/removeVm', function (req, res, next) {
    var params = url.parse(req.url, true).query;
    var index = params['id'];
    vm.splice(index, 1);
    res.redirect('/');
});


router.get('/banUser', function (req, res, next) {
    var params = url.parse(req.url, true).query;
    var user = params['user'];
    console.log(user);
    var index = users.indexOf(user);
    info_users_list.splice(index, 1);
    users.splice(index, 1);
    db.connect(function (conn) {
        var requeteSql = 'update login_web set is_locked=1 where identifiant = ?';
        conn.query(requeteSql, [user], function (err, data) {
            var tmp = {};
            tmp['user'] = user;
            tmp['url'] = "Votre compte n'est pas validé !";
            tmp['is_locked'] = 1;
            info_users_list.push(tmp);
            users.push(user);
            res.redirect('/');
        });
    });

});

router.get('/activUser', function (req, res, next) {
    var params = url.parse(req.url, true).query;
    var user = params['user'];

    var index = users.indexOf(user);
    info_users_list.splice(index, 1);
    users.splice(index, 1);
    db.connect(function (conn) {
        var requeteSql = 'update login_web set is_locked=0 where identifiant = ?';
        conn.query(requeteSql, [user], function (err, data) {
            var url = conf.base_url + 'live/' + user;
            push_stream(url, user);
            res.redirect('/');
        });
    });
});

router.get('/api/test', function (req, res, next) {
    res.end('ok');
});
// /api/listVm
router.get('/api/listVm', function (req, res, next) {
    res.json(vm);
});
// /api/info_users_list
router.get('/api/list', function (req, res, next) {
    res.json(info_users_list);
});

// /api/info?user=xxx
router.get('/api/info', function (req, res, next) {
    var params = url.parse(req.url, true).query;
    db.connect(function (conn) {
        var requeteSql = 'select identifiant,is_locked,nom,prenom,email from login_web where identifiant = ?';
        conn.query(requeteSql, [params['user']], function (err, data) {
            if (data[0] != undefined) {
                res.json(data);
            }
            else {
                console.log("Identifiants incorrects ....");
                res.end('falid')
            }
        });
    });
});


function push_stream(src, user) {
    var json = {};
    json['user'] = user;
    users.push(user);
    var url = vm[(calcNbUserActive()) % vm.length] + '/' + user;
    console.log("KFC-Harpie => "+src);
    var command = 'ffmpeg -i ' + src + ' -c:v copy -c:a copy -f flv ' + url;
    json['url'] = url;
    console.log("Des => "+url);
    json['is_locked'] = 0;
    info_users_list.push(json);
    exec(command, function (a, b, c) {
        if (a !== null) {
            console.log('commande ok');
        }
    });
}

function calcNbUserActive() {
    var cpt = 0;
    for (var i = 0; i < info_users_list.length; i++) {
        if (info_users_list[i].is_locked === 0) {
            cpt++;
        }
    }
    return cpt;
}

function Map() {
}
Map.prototype.get = function (key) {
    return this[key];
};
Map.prototype.set = function (key, val) {
    this[key] = val;
};
Map.prototype.del = function (key) {
    delete this[key];
};

module.exports = router;