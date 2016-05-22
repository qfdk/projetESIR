## Nginx-rtmp-module

* kfc-raspi (Ubuntu 14.04)
* kfc-streaming
* kfc-sisilafamille

Traitement le flux avec ffmpeg. Il faut installer `ffmpeg`.


## ffmpeg

```bash
sudo add-apt-repository ppa:mc3man/trusty-media
sudo apt-get update
sudo apt-get install ffmpeg
```


https://github.com/arut/nginx-rtmp-module

```bash

cd /root
git clone https://github.com/arut/nginx-rtmp-module.git
lnmp 1.3直接修改lnmp.conf ，Nginx_Modules_Options='' 单引号中加上--add-module=/root/nginx-rtmp-module
./upgrade_niginx.sh
```

## Vérification

* kfc-harpie

Un petit script pour vérifier la permission.

example: http://xxx/?user=`salifou`&passwd=`salifou`

```javascript

var http = require('http');
var url=require('url');

http.createServer(function (req, res) {
    var params = url.parse(req.url, true).query;
    if(params['user']==='salifou'&&params['passwd']==='salifou')
    {
        	res.writeHead(200, {'Content-Type': 'text/plain'});
        	res.end('ok');
    }else{
        res.writeHead(400, {'Content-Type': 'text/plain'});
        res.end('faild');
    }

}).listen(8080);
```

## Todo

* Node.js - SmartPushRtmp(Blancing en push)
	- express
	- fluent-ffmpeg
	- leveDB (noSql/MySql)
	
* forever start app.js

```bash
$ sudo npm install forever -g   #安装
$ forever start app.js          #start/启动
$ forever stop app.js           #stop/关闭
```

