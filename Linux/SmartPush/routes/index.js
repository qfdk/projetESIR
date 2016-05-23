var express = require('express');
var url=require('url');

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'SmartPush',salifou:'sasa'});
});

router.get('/login', function (req, res) {
    var params = url.parse(req.url, true).query;
    if (params['user'] === 'salifou' && params['passwd'] === 'salifou') {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('ok');
    } else {
        res.writeHead(400, {'Content-Type': 'text/plain'});
        res.end('faild');
    }
});

module.exports = router;
