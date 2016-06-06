## SmartPush (Controler côté kfc-harpie)

Un service intelligent qui permet de balancer entre les diffuseurs et les machines de traitements en utilisant `Node.js`.

Il a une jolie interface graphique en utilisant `Bootstrap 3`

* Ajouter/ Supprimer dynamiquement les machines de traitements
* Ban utilisateur
* API utile => format json


## Nginx-rtmp-module

* kfc-raspi (Ubuntu 14.04)
* kfc-streaming
* kfc-sisilafamille

Traitement le flux avec ffmpeg. Il faut installer `ffmpeg`.

https://github.com/arut/nginx-rtmp-module

## LNMP

Si utilise lnmp c'est plus facile de configurer ce module-rtmp.

	wget -c http://soft.vpser.net/lnmp/lnmp1.2-full.tar.gz && tar zxf lnmp1.2-full.tar.gz && cd lnmp1.2-full && ./install.sh lnmp

puis installer nginx-rtmp-module

```bash
cd /root
git clone https://github.com/arut/nginx-rtmp-module.git

# modifier dans lnmp1.2-full/include/upgrade_nginx
Nginx_Modules_Options='--add-module=/root/nginx-rtmp-module'
./upgrade_niginx.sh
```

## ffmpeg

```bash
sudo add-apt-repository ppa:mc3man/trusty-media
sudo apt-get update
sudo apt-get install ffmpeg
```


## API

Example url: http://kfc-harpie:8080/api/{metode}

* listVm

```
[
  "rtmp:\/\/kfc-streaming.istic.univ-rennes1.fr\/live",
  "rtmp:\/\/kfc-sisilafamille.istic.univ-rennes1.fr\/live",
  "rtmp:\/\/kfc-raspi.istic.univ-rennes1.fr\/live"
]
```

* list

```
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

```
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

## Configuration de Nginx-rtmp-module
```
rtmp {
    server {
            listen 1935;
            chunk_size 4096;

            application live {
                    allow publish all;
                    deny publish all;
                    live on;
                    meta copy;
                    # permettre de verifier si c'est bon. puis lancer ffmpeg donc le button de client peut supprimer :)
                    on_publish http://127.0.0.1:8080/play;
                    notify_method get;
            }

    }

}
```

## Configuration de KFC-*(traitement)

```
rtmp {
    server {
            listen 1935;
            chunk_size 4096;

            application live {
                    live on;
                    record off;
                    exec ffmpeg -i rtmp://localhost/live/$name -threads 1 -c:v libx264 -profile:v baseline -b:v 350K -s 640x360 -f flv -c:a aac -ac 1 -strict -2 -b:a 56k rtmp://localhost/live360p/$name;
            	    exec ffmpeg -i rtmp://localhost/live/$name -threads 1 -c:v libx264 -profile:v baseline -b:v 350K -s 858x480 -f flv -c:a aac -ac 1 -strict -2 -b:a 56k rtmp://localhost/live480p/$name;
            	    exec ffmpeg -i rtmp://localhost/live/$name -threads 1 -c:v libx264 -profile:v baseline -b:v 350K -s 1280x720 -f flv -c:a aac -ac 1 -strict -2 -b:a 56k rtmp://localhost/live720p/$name;
	    }

            application live360p {
                    live on;
                    record off;
            }
	    application live480p {
		live on;
		record off;
}
	    application live720p {
		    live on;
		    record off;
	    }

    }
}
```

## HSL-Configuration de KFC-*(traitement)

Ajouter l'option dans confige, puis on peut avoir le format m3u8,
Example

```
# HLS

        # For HLS to work please create a directory in tmpfs (/tmp/hls here)
        # for the fragments. The directory contents is served via HTTP (see
        # http{} section in config)
        #
        # Incoming stream must be in H264/AAC. For iPhones use baseline H264
        # profile (see ffmpeg example).
        # This example creates RTMP stream from movie ready for HLS:
        #
        # ffmpeg -loglevel verbose -re -i movie.avi  -vcodec libx264
        #    -vprofile baseline -acodec libmp3lame -ar 44100 -ac 1
        #    -f flv rtmp://localhost:1935/hls/movie
        #
        # If you need to transcode live stream use 'exec' feature.
        #
        application hls {
            live on;
            hls on;
            hls_path /tmp/hls;
        }

        # MPEG-DASH is similar to HLS

        application dash {
            live on;
            dash on;
            dash_path /tmp/dash;
        }
```

## Example avec OBS
  
-  "push_url": "rtmp://kfc-harpie.istic.univ-rennes1.fr/live",

-  "key": "salifou1?user=salifou1&passwd=example"


![](./img/2.png)

Grace a module de node.js `morgan` on peut avoir des informations coté serveur.

![](./img/3.png)

## GUI pour KFC-Harpie

![](./img/1.png)


## examples de vérification

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
	
### forever start app.js

```bash
$ sudo npm install forever -g   #安装
$ forever start app.js          #start/启动
$ forever stop app.js           #stop/关闭
```

## License Apache 2
World is powered by solitude
Je suis fort :)
![img-source-from-https://github.com/docker/dockercraft](https://github.com/docker/dockercraft/raw/master/docs/img/contribute.png?raw=true)
