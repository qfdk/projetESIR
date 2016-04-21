# Rasperry Pi Cam [![Build Status](https://travis-ci.org/qfdk/projetESIR.svg?branch=master)](https://travis-ci.org/qfdk/projetESIR)


## Etapes

modifier `/etc/apt/sources.list`
add -> `deb http://vontaene.de/raspbian-updates/ . main`

1. Connecter le cam à un Respberry Pi [mode USB ?| mode Wi-Fi]
2. Installer `sudo apt-get -y gstreamer1.0` en Respberry pour evider le delait d'image. 
3. EXP [https://obsproject.com ](https://obsproject.com)
4. `gstreamr` + `raspivid`
5. `sudo apt-get -y gstreamer1.0` && Commande magic `raspivid -n -t 0 -rot 270 -w 960 -h 720 -fps 30 -b 6000000 -o - | gst-launch-1.0 -e -vvvv fdsrc ! h264parse ! rtph264pay pt=96 config-interval=5 ! udpsink host=home.qfdk.me port=5000`
6. todo...

## Todo

- KFC
- Macdonald


## License New BSD
![img-source-from-https://github.com/docker/dockercraft](https://github.com/docker/dockercraft/raw/master/docs/img/contribute.png?raw=true)
