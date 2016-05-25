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

## SmartPush (Controler côté kfc-harpie)

Un service intelligent qui permet de balancer entre les diffuseurs et les machines de traitements en utilisant `Node.js`.

Il a une jolie interface graphique en utilisant `Bootstrap 3`

* Ajouter/ Supprimer dynamiquement les machines de traitements
* Ban utilisateur
* API utile => format json


## API

Example url: http://kfc-harpie:8080/api/{metode}

- listVm
- list
- info


* listVm

```json
[
  "rtmp:\/\/kfc-streaming.istic.univ-rennes1.fr\/live",
  "rtmp:\/\/kfc-sisilafamille.istic.univ-rennes1.fr\/live",
  "rtmp:\/\/kfc-raspi.istic.univ-rennes1.fr\/live"
]
```

* list

```json
// cas invalide
[
  {
    "user": "salifou",
    "url": "Votre compte n'est pas valid\u00e9 !",
    "is_locked": 1
  }
]
// cas valide
[
  {
    "user": "salifou",
    "url": "rtmp://kfc-streaming.istic.univ-rennes1.fr/live/salifou",
    "is_locked": 0
  }
]

```

* info?user=xx

```json
{
  "info": {
    "identifiant": "salifou1",
    "is_locked": 0,
    "nom": "ben",
    "prenom": "ben",
    "email": "ben@maiga.fr"
  },
  // il ne change pas!!
  "push_url": "rtmp://kfc-harpie.istic.univ-rennes1.fr/live",
  // le client va remplir dans son outil.
  "key": "salifou1?user=salifou1&passwd=xxx"
}
```

## Example avec OBS

  
-  "push_url": "rtmp://kfc-harpie.istic.univ-rennes1.fr/live",

-  "key": "salifou1?user=salifou1&passwd=example"


![](./img/2.png)

## GUI pour KFC-Harpie

![](./img/1.png)


	
### forever start app.js

```bash
$ sudo npm install forever -g   #安装
$ forever start bin/www          #start/启动
$ forever stop bin/www           #stop/关闭
```

## License Apache 2
World is powered by solitude
Je suis fort :)
![img-source-from-https://github.com/docker/dockercraft](https://github.com/docker/dockercraft/raw/master/docs/img/contribute.png?raw=true)
