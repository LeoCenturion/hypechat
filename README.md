# hypechat
Trabajo práctico de taller de programación II, grupo 1. Facultad de Ingeniería - Universidad de Buenos Aires.
[![Coverage Status](https://coveralls.io/repos/github/LeoCenturion/hypechat/badge.svg?branch=master)](https://coveralls.io/github/LeoCenturion/hypechat?branch=master)

## Requerimientos
Para poder ejecutar este servidor es necesario tener instalado **git** (github), **docker** y **docker-compose**.<br />

## Ejecución
Primeramente es necesario descargar los archivos del repositorio git. Para realizar esto abir una terminal en donde se desea descargar una carpeta con los archivos y ejecutar:<br />
$ git clone https://github.com/LeoCenturion/hypechat.git <br />
<br />
Para ejecutar el servidor, abrir una terminal dentro de la carpeta descargada recien y poner:<br />
$ sudo docker-compose build<br />
$ sudo docker-compose up server<br />
<br />
Para ejecutar las pruebas, abrir una terminal dentro de la carpeta descargada recien y poner:<br />
$ sudo docker-compose build<br />
$ sudo docker-compose up test<br />

## API
Para transformar la documentacion en .yaml a .md se utiliza swagger-markdown disponible en npm.<br />
Instalar del siguiente modo: <br />
$ npm install swagger-markdown<br />
Para ejecutarlo: <br />
$ ./node_modules/swagger-markdown/bin/index.js -i swagger.yaml<br />


[API](swagger.md)
